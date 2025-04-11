import { ID, Query } from "appwrite";
import { databases } from "../../appwrite";
import { ens as risks } from "./risks";
import { reactive } from "vue";
import { resolveType } from "../shared/dropdowns";
import { ens as systems } from "./systems";

export const KICD_DATABASE_ID = "kicd";
export const RISK2MEASURE_COLLECTION_ID = "risk2measure";
export const RISKS2RULES_COLLECTION_ID = "risks2rules";
export const RISKS2KPIS_COLLECTION_ID = "risks2kpis";
export const RISKS2TESTCASES_COLLECTION_ID = "risks2testcases";

function resolveCollection2Type(collectionId) {
  let type = "xxx";
  if (collectionId == RISK2MEASURE_COLLECTION_ID) type = "measure";
  else if (collectionId == RISKS2RULES_COLLECTION_ID) type = "rule";
  else if (collectionId == RISKS2KPIS_COLLECTION_ID) type = "kpi";
  else if (collectionId == RISKS2TESTCASES_COLLECTION_ID) type = "testcase";
  return type;
}

function resolveType2CollectionId(type) {
  let collectionId = "xxx";
  if (type == "measure") collectionId = RISK2MEASURE_COLLECTION_ID;
  else if (type == "rule") collectionId = RISKS2RULES_COLLECTION_ID;
  else if (type == "kpi") collectionId = RISKS2KPIS_COLLECTION_ID;
  else if (type == "testcase") collectionId = RISKS2TESTCASES_COLLECTION_ID;
  return collectionId;
}

function enrichEntity(e) {
  if (e.$collectionId == RISK2MEASURE_COLLECTION_ID) {
    e.mtitle = e.measure?.title;
    e.mid = e.measure?.$id;
  }
  if (e.$collectionId == RISKS2RULES_COLLECTION_ID) {
    e.mtitle = e.rule?.title;
    e.mid = e.rule?.$id;
  }
  if (e.$collectionId == RISKS2KPIS_COLLECTION_ID) {
    e.mtitle = e.kpi?.title;
    e.mid = e.kpi?.$id;
  }
  if (e.$collectionId == RISKS2TESTCASES_COLLECTION_ID) {
    e.mtitle = e.testcase?.title;
    e.mid = e.testcase?.$id;
  }
  e.mtype = resolveType(resolveCollection2Type(e.$collectionId));
  return e;
}

export const ens = reactive({
  current: [],
  async init() {
    let system_query_cond = systems.getQueryCondition();
    console.log("----------- RISK2ALL INIT START -----------");

    const response = await databases.listDocuments(
      KICD_DATABASE_ID,
      RISK2MEASURE_COLLECTION_ID,
      [system_query_cond]
    );

    const response2 = await databases.listDocuments(
      KICD_DATABASE_ID,
      RISKS2KPIS_COLLECTION_ID,
      [system_query_cond]
    );

    const response3 = await databases.listDocuments(
      KICD_DATABASE_ID,
      RISKS2RULES_COLLECTION_ID,
      [system_query_cond]
    );

    const response4 = await databases.listDocuments(
      KICD_DATABASE_ID,
      RISKS2TESTCASES_COLLECTION_ID,
      [system_query_cond]
    );

    console.log("risks.all add items .....");
    console.log("risk2measures: " + response.documents.length);
    console.log("risk2kpis: " + response2.documents.length);
    console.log("risk2rules: " + response3.documents.length);
    console.log("risk2testcases: " + response4.documents.length);
    this.current = [...response.documents, ...response2.documents, ...response3.documents, ...response4.documents];
    console.log("risks.all length: " + this.current.length);

    let i = 0;
    this.current.forEach(e => {
      //console.log(i + ". enriching Element ", e);
      enrichEntity(e);
      //console.log(i + ". enriched Element ", e);
      i++;
    });

    //aktualisierte die measures bei jedem risk als transientes text-attribut fürs UI
    //sollte das hier sein? Oder besser im Frontend?
    //auf jedenfall bei jedem update eines risk2all für das betroffene risk
    //siehe update Kommentar (wo aber immer ALLES neugeladen wird :-)
    risks.current.forEach(r => {
      console.log("-------- next risk -------");
      let mappings = this.current.filter(function (m) {
        // console.log("m.risk.id: " + m.risk.$id);
        // console.log("r.$id: " + r.$id);
        let match = m.risk?.$id == r.$id;
        // console.log("match: " + match);
        return match;
        //select * from risk2all where risk.$id = e.$id
      });

      let mtext = "";
      let mlist = [];
      let mids = [];
      // console.log("found risks mappings: ", mappings);
      mappings.forEach(m => {
        let t = resolveType(m.mtype) + ": " + m.mtitle;
        mtext += t + "| ";
        mlist.push(t);
        mids.push(m.mid);
      });
      //console.log("mlist: ", mlist);
      //console.log("mtext: ", mtext);

      //r.measures = mtext;
      r.measurelist = mlist;
      r.measureids = mids;
      // console.log("mappings added for risk: " + r.title + " -> " + r.measures);
    });

    systems.isReloading = false;

    console.log("risks4all.map: ", this.current);
    console.log("----------- RISK2ALL INIT END -----------");
  },
  async add(en, entype) {
    console.log("------- risks4all: ADD ---------");
    console.log("RISKS4ALL.ADD for en: ", en);
    console.log("RISKS4ALL.ADD for type: " + entype);
    let collectionId = resolveType2CollectionId(entype);
    console.log("RISKS4ALL.ADD resolved to collectionId: " + collectionId);
    console.log("prepare to save risks4all: ", { ...en, systemId: systems.systemId });

    const response = await databases.createDocument(
      KICD_DATABASE_ID,
      collectionId,
      ID.unique(),
      { ...en, systemId: systems.systemId }
    );

    console.log("response: ", response);
    let enrichedEntity = enrichEntity(response);
    console.log("enriched entity: ", enrichedEntity);
    this.current = [enrichedEntity, ...this.current].slice(0, 10);
    console.log("new RISK2ALL current: ", this.current);

    await this.init(); //kann man bei add evtl auch weglassen, wie bei den anderen stores
    /* wenn wir das weglassen, dann müsste mindestens
    bei jedem update auf risk2all update auch ein update auf risk passieren
    d.h. sowas wie risks.reload( en.risk )
    oder sowas wie getRiskById( en.risk ).updateAutomatedAttributes();
    so dass die risk measurements in der risk-liste angezeigt werden können
    */
  },
  async remove(en) {
    console.log("--------- risks2all: REMOVE ----------");
    console.log("REMOVE will start for entity.id: " + en.$id);
    console.log("REMOVE will start for entity: ", en);
    await databases.deleteDocument(KICD_DATABASE_ID, en.$collectionId, en.$id);
    this.current = this.current.filter((e) => e.$id !== en.$id);
    console.log("REMOVE proc done for entity.id: " + en.$id);
    await this.init();
  },
  async update(en) {
    console.log("update for risks2all is not implemented, because only ram!!!", en);
    //await databases.updateDocument(KICD_DATABASE_ID, RISKS2RULES_COLLECTION_ID, en.$id, en);
    //await this.init();
  },
});
