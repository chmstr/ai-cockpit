import { ID, Query } from "appwrite";
import { databases } from "../../appwrite";
import { reactive, computed } from "vue";
import { ens as logs } from "./logs.js";
import { ens as modules } from "./modules.js";
import { ens as risks } from "./risks.js";
import { ens as testcases } from "./testcases.js";
import { ens as kpis } from "./kpis.js";
import { ens as rules } from "./rules.js";
import { ens as measures } from "./measures.js";
import { ens as risks2all } from "./risks2all.js";
import { ens as autonomylevels } from "./autonomylevels.js";
import { KICD_DATABASE_ID, SYSTEMS_COLLECTION_ID, PROP_SYSTEMID, DEFAULT_SYSTEM_POOL_ID, DEFAULT_SYSTEM_ID } from "../shared/constants";

//export const KICD_DATABASE_ID = "kicd"; // Replace with your database ID
//export const SYSTEMS_COLLECTION_ID = "rules"; // Replace with your collection ID

function checkIfSystemPool(system) {
  return system.isPool;
}

export const activeSystem = computed(() => {
  console.log( "activeSystem: this:", this );
  console.log( "activeSystem: this.ens:", this.ens );
  console.log( "activeSystem: this.ens.systemId:", this.ens.systemId );
  let s = this.current.find(s => s.$id === this.ens.systemId);
  console.log("activeSystem.computed.changedTo.system : ", s );
  console.log("activeSystem.computed.changedTo.sid: ", s.$id );
  return s;
});

export const ens = reactive({
  current: [],
  option_list: [],
  systemId: DEFAULT_SYSTEM_ID,
  system: [],
  isReloading: false,
  changeSystemId(sid) {
    this.isReloading = true;
    console.log("systems.isReloading: ", this.isReloading);
    console.log("setActiveSystem.before");
    this.setActiveSystem(sid);
    modules.init();
    risks.init();
    testcases.init();
    kpis.init();
    rules.init();
    measures.init();
    risks2all.init();
    logs.init();
    autonomylevels.init();
  },
  setActiveSystem(sid) {
    this.systemId = sid;
    this.system = this.current.find(s => s.systemId === this.systemId);
    console.log("setActiveSystem.systems.systemId:", this.systemId);
    console.log("setActiveSystem.systems.system: ", this.system);
  },
  getQueryCondition() {
    return Query.equal(PROP_SYSTEMID, this.systemId);
  },
  async getSystemPoolId() {
    if (this.current.length == 0) {
      console.log("RISKPOOL: all systems init")
      await this.init();
      console.log("RISKPOOL: all systems loaded")
    }
    console.log("RISKPOOL.allSystems", this.current);
    const poolSystem = this.current.filter(checkIfSystemPool);
    console.log("RISKPOOL.poolSystem", poolSystem);
    let sid = DEFAULT_SYSTEM_ID;
    if (poolSystem?.length > 0) sid = poolSystem[0].systemId;
    console.log("RISKPOOL.poolSystem.systemId", sid);
    return sid;
  },
  async init() {
    const response = await databases.listDocuments(
      KICD_DATABASE_ID,
      SYSTEMS_COLLECTION_ID,
      [Query.orderDesc("seq"), Query.equal("deleted", 0)]
    );
    this.current = response.documents;
    console.log("init SYSTEMS done");
    console.log(this.current);

    let setDefault = false;
    this.setActiveSystem(DEFAULT_SYSTEM_ID);
    // if( this.current.length == 1 ) {
    //   this.changeSystemId(this.current[0].systemId);
    //   setDefault = true;
    // }  

    this.option_list = [];
    console.log("systems.init.current ", this.current);
    this.current.forEach(e => {
      let o = {};

      let eid = parseInt(e.systemId);
      let did = parseInt(DEFAULT_SYSTEM_ID);
      console.log("systems.init.e.systemId ", eid);
      console.log("systems.init.DEFAULT_SYSTEM_ID", did);

      o.value = e.systemId;
      o.label = e.title;


      // if( eid === did  ) { 
      //     console.log( "systems.init.e.systemId == DEFAULT_SYSTEM_ID", eid === did );
      //     o.selected = true; 
      //     this.ens.systemId = eid ;
      //     console.log( "systems.init.ens.systemId", this.ens.systemId );
      //   }
      // else {
      //   console.log( "systems.init.its not a default entry")
      // };
      if (!e.isPool) this.option_list.push(o);
      console.log("systems.init.pushed in option_list: " + o.label);
    });
    this.option_list.sort((a, b) => (a.label > b.label) ? 1 : ((b.label > a.label) ? -1 : 0));

    console.log("systems.init.option_list", this.option_list);
    console.log("systems.init.systemId", this.systemId);


  },
  async add(en) {
    const response = await databases.createDocument(
      KICD_DATABASE_ID,
      SYSTEMS_COLLECTION_ID,
      ID.unique(),
      en
    );
    this.current = [response, ...this.current].slice(0, 10);
  },
  async remove(id) {
    await databases.deleteDocument(KICD_DATABASE_ID, SYSTEMS_COLLECTION_ID, id);
    this.current = this.current.filter((en) => en.$id !== id);
    await this.init(); // Refetch ideas to ensure we have 10 items
  },
  async update(en) {
    console.log(en);
    await databases.updateDocument(KICD_DATABASE_ID, SYSTEMS_COLLECTION_ID, en.$id, en);
    await this.init(); // Refetch ideas to ensure we have 10 items
  },
});
