import { ID, Query } from "appwrite";
import { databases } from "../../appwrite.js";
import { reactive } from "vue";
import { ens as systems } from "./systems.js";
import { ens as myrisks } from "./risks.js";

import { KICD_DATABASE_ID, RISKS_COLLECTION_ID, RISKPOOL_SYSTEM_ID, PROP_SYSTEMID } from "./../shared/constants";

function addSystemId( en ){
  en = { ...en, "systemId": ens.systemId };
  return en;
}

function enrichRiskpoolWithImportflag(){
  ens.list.forEach((poolrisk) => {
    console.log("enrich_poolrisks: myrisks.poolriskIds", myrisks.poolriskIds);
    if (myrisks.poolriskIds.includes(poolrisk.$id)) {
      poolrisk.imported = true;
      poolrisk.rating = -1;
      //console.log("poolriskcheck: found");
    } else {
      //console.log("poolriskcheck: not found");
      poolrisk.imported = false;
      poolrisk.rating = 0;
    }
  });  
}

export const ens = reactive({
  list: [],
  systemId: -1,
  updateImportFlag(){
    console.log("updateImportFlag");
    this.list.forEach((poolrisk) => {
      // console.log("enrich_poolrisks: myrisks.poolriskIds", myrisks.poolriskIds);
      if (myrisks.poolriskIds.includes(poolrisk.$id)) {
        poolrisk.imported = true;
        poolrisk.rating = -1;
        //console.log("poolriskcheck: found");
      } else {
        //console.log("poolriskcheck: not found");
        poolrisk.imported = false;
        poolrisk.rating = 0;
      }
    });  
  },
  async init() {
    console.log( "RISKPOOL: systems.getSystemPoolId()" );
    this.systemId = await systems.getSystemPoolId();
    console.log( "RISKPOOL: systems.getSystemPoolID() returned sid", this.systemId );

    //let system_query_cond = systems.getQueryCondition(this.systemId);
    let system_query_cond = Query.equal(PROP_SYSTEMID, this.systemId );
    console.log( "RISKPOOL.sid-cond", system_query_cond)
    
    const response = await databases.listDocuments(
      KICD_DATABASE_ID,
      RISKS_COLLECTION_ID,
      [system_query_cond, Query.limit(100), Query.orderDesc("$createdAt")]
    );
    this.list = response.documents;

    console.log("RISKPOOL: len1", this.list.length);
    this.updateImportFlag();
    console.log("RISKPOOL: len2", this.list.length);
    console.log("RISKPOOL: init done", this.list);
  },
  async add(en) {
    const response = await databases.createDocument(
      KICD_DATABASE_ID,
      RISKS_COLLECTION_ID,
      ID.unique(),
      addSystemId( en )
    );
    await this.init();
  },
  async remove(id) {
    await databases.deleteDocument(KICD_DATABASE_ID, RISKS_COLLECTION_ID, id);
    this.list = this.list.filter((en) => en.$id !== id);
    await this.init();
  },
  async update(en) {
    console.log(en);
    await databases.updateDocument(KICD_DATABASE_ID, RISKS_COLLECTION_ID, en.$id, addSystemId( en ) );
    await this.init();
  },
});
