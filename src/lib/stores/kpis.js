import { ID, Query } from "appwrite";
import { databases } from "../../appwrite";
import { reactive } from "vue";
import { ens as allmeasures } from "./allmeasures";
import { ens as systems } from "./systems.js";

export const KICD_DATABASE_ID = "kicd";
export const KPIS_COLLECTION_ID = "kpis";

export const ens = reactive({
  loaded: false,
  current: [],
  dashboardKpis: [],
  option_list: [],
  async init() {
    let system_query_cond = systems.getQueryCondition();
    const response = await databases.listDocuments(
      KICD_DATABASE_ID,
      KPIS_COLLECTION_ID,
      [system_query_cond, Query.orderDesc("chartseq")]
    );
    this.current = response.documents;

    console.log( "dashboard kpi response ", response );
    console.log( "dashboard allKpis: ", this.current.length );

    this.dashboardKpis = this.current.filter( function(kpi) { 
      return kpi.chartseq > 0 
    } ); 

    console.log( "dashboard kpi1", this.dashboardKpis[0]);
    console.log( "dashboard kpi2", this.dashboardKpis[1]);

    console.log( "dashboard only Kpis:", this.dashboardKpis.length );

    allmeasures.deleteByCollectionId(KPIS_COLLECTION_ID);
    allmeasures.update(this.current);

    this.option_list = [];
    this.current.forEach(e => {
      let o = {};
      o.value = e.$id;
      o.label = e.title;
      this.option_list.push(o);
      //console.log("MODULE refresh: pushed in option.list: " + o.label);
    });
    this.option_list.sort((a, b) => (a.label > b.label) ? 1 : ((b.label > a.label) ? -1 : 0));
    this.loaded = true;

    console.log("updated +: " + this.current.length);
    console.log("INIT: KPIs done");
    console.log(this.current);
  },
  async add(en) {
    const response = await databases.createDocument(
      KICD_DATABASE_ID,
      KPIS_COLLECTION_ID,
      ID.unique(),
      en
    );
    await this.init();
  },
  async remove(id) {
    await databases.deleteDocument(KICD_DATABASE_ID, KPIS_COLLECTION_ID, id);
    this.current = this.current.filter((en) => en.$id !== id);
    await this.init();
  },
  async updateOnly(en) {
    console.log(en);
    await databases.updateDocument(KICD_DATABASE_ID, KPIS_COLLECTION_ID, en.$id, en);
  },
  async update(en) {
    console.log(en);
    await databases.updateDocument(KICD_DATABASE_ID, KPIS_COLLECTION_ID, en.$id, en);
    await this.init();
  },
  async updateAllKpiValues(){
    this.current.forEach(e => {
      console.log("update start: ", e.$id);
      this.updateKpiValues(e);
      console.log("update started: ", e.$id);
    });
    console.log("all KPIs updates running");    
  },
  async updateKpiValues(en){
    console.log("updateKpiValues START for ID=", en.$id );
    let url = en.url;
  
    console.log("url: ", url);
    if( !url ) return;
  
    await fetch(url, {
      method: "GET",
      headers: {},
    })
      .then((response) => {
        console.log( "response", response );
        return response.json();
      })
      .then((data) => {
        console.log("data: ", data);
        en.chartdata = JSON.stringify(data);
        let u = { chartdata: en.chartdata, $id: en.$id };
        this.update( u );
        //en.title = "new: " + en.$id;
        console.log( "updateKpiValues DONE");
      })
      .catch((err) => {
        console.error(err);
      });  
      console.log( "updateKpiValues END");
  },
});
