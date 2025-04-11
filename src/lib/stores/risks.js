import { ID, Query } from "appwrite";
import { databases } from "../../appwrite";
import { reactive } from "vue";
import { ens as riskpool } from "./riskpool";
import { ens as moduleList } from "./modules";
import { ens as risks2allList } from "./risks2all";
import { ens as systems } from "./systems.js";
import { getById } from "../shared/utils.js";


export const KICD_DATABASE_ID = "kicd";
export const RISKS_COLLECTION_ID = "risks";

export const ens = reactive({
  current: [],
  poolriskIds: [],
  async init() {
    console.log("RISKS: init start");
    let system_query_cond = systems.getQueryCondition();
    
    const response = await databases.listDocuments(
      KICD_DATABASE_ID,
      RISKS_COLLECTION_ID,
      [system_query_cond, Query.orderDesc("alarmcounter")]
    );
    this.current = response.documents;

    this.poolriskIds = [];
    this.current.forEach(risk => {
      if( risk.poolriskId ) this.poolriskIds.push( risk.poolriskId );
    });
    console.log( "poolriskcheck: forall risks create poolriskIds", this.poolriskIds);
    riskpool.updateImportFlag();

    console.log("RISKS: init done");
    console.log(this.current);
  },
  async add(en) {
    const response = await databases.createDocument(
      KICD_DATABASE_ID,
      RISKS_COLLECTION_ID,
      ID.unique(),
      en
    );
    await this.init();
    //await riskpool.init();
  },
  async remove(id) {
    await databases.deleteDocument(KICD_DATABASE_ID, RISKS_COLLECTION_ID, id);
    this.current = this.current.filter((en) => en.$id !== id);
    await this.init();
    //await riskpool.init();
  },
  async update(en) {
    console.log(en);
    // await databases.updateDocument(KICD_DATABASE_ID, RISKS_COLLECTION_ID, en.$id, en);

    await this.updatePersistence(en);
    await this.updateCache();

  },
  getById( id ){
    console.log( "currentlist:", this.current );
    return getById( this.current, id );
  },
  async updatePersistence(en) {
    console.log("update ", en);
    await databases.updateDocument(KICD_DATABASE_ID, RISKS_COLLECTION_ID, en.$id, en);
    await this.init();
  },
  async updatePlain(en) {
    console.log(en);
    let risk = getById( this.current, en.$id );
    await databases.updateDocument(KICD_DATABASE_ID, RISKS_COLLECTION_ID, en.$id, en);
    if( en.hasOwnProperty('rating')) {
      risk.rating = en.rating;
      console.log( "dto risk.rating: ", risk.rating ); 
    }
  },
  async updateCache(){
    console.log( "updateCache");
    //await riskpool.init();
    await moduleList.init();
    await risks2allList.init();

  },
  async resetAlarmcounter() {
    console.log( "resetAlarmcounter: reset alarm counter for ALL risks: START" );
    this.current.forEach(e => {
      let u = { alarmcounter: 0, $id: e.$id };
      console.log( "resetAlarmcounter: " + e.title + " reset", e.$id );
      this.updatePersistence( u );
    });
    this.updateCache();
    console.log( "resetAlarmcounter: reset alarm counter for ALL risks: END" );
  },
});
