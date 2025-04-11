import { ID, Query } from "appwrite";
import { databases } from "../../appwrite";
import { reactive } from "vue";
import { ens as risksList } from "./risks.js";
import { ens as systems } from "./systems.js";
import { KICD_DATABASE_ID, MODULES_COLLECTION_ID } from "./../shared/constants";

function refresh() {
  refresh_option_list();
}

function refresh_option_list() {
  console.log("MODULE refresh optionlist start");
  this.ens.option_list = [];
  this.ens.current.forEach(e => {
    let o = {};
    o.value = e.$id;
    o.label = e.title;
    ens.option_list.value.push(o);
    //console.log("MODULE refresh: pushed in option.list: " + o.label);
  });
  this.ens.option_list.value.sort((a, b) => (a.label > b.label) ? 1 : ((b.label > a.label) ? -1 : 0));
  console.log("MODULE refresh optionlist done");
}

export const ens = reactive({
  current: [],
  option_list: [],
  async init() {
    let system_query_cond = systems.getQueryCondition();
    const response = await databases.listDocuments(
      KICD_DATABASE_ID,
      MODULES_COLLECTION_ID,
      [system_query_cond]
    );
    this.current = response.documents;
    //console.log("MODULES: this.current.modules: ", this.current);

    this.option_list = [];
    this.current.forEach(e => {
      let o = {};
      o.value = e.$id;
      o.label = e.title;
      this.option_list.push(o);
      //console.log("MODULE refresh: pushed in option.list: " + o.label);
    });
    this.option_list.sort((a, b) => (a.label > b.label) ? 1 : ((b.label > a.label) ? -1 : 0));

    this.current.sort((a, b) =>
      a.title > b.title ? 1 : b.title > a.title ? -1 : 0
    );
  
    //console.log("MODULES module.options: ", this.option_list);
    console.log("MODULES init done");
    console.log(this.current);
  },
  async add(en) {
    const response = await databases.createDocument(
      KICD_DATABASE_ID,
      MODULES_COLLECTION_ID,
      ID.unique(),
      { ...en, systemId: systems.systemId }
    );
    await this.init();
    refresh();
  },
  async remove(id) {
    await databases.deleteDocument(KICD_DATABASE_ID, MODULES_COLLECTION_ID, id);
    this.current = this.current.filter((en) => en.$id !== id);
    await this.init();
  },
  async update(en) {
    console.log(en);
    await databases.updateDocument(KICD_DATABASE_ID, MODULES_COLLECTION_ID, en.$id, { ...en, systemId: systems.systemId });
    await this.init();
    await risksList.init();
  },
  async resetAlarmcounter() {
    console.log( "alarm counter for ALL modules set to 0!" );
    this.current.forEach(e => {
      let u = { alarmcounter: 0, $id: e.$id };
      this.update( u );
    });
  }
  
});
