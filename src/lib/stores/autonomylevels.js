import { ID, Query } from "appwrite";
import { databases } from "../../appwrite";
import { reactive } from "vue";
import { ens as systems } from "./systems.js";


export const KICD_DATABASE_ID = "kicd"; // Replace with your database ID
export const AUTONOMYLEVELS_COLLECTION_ID = "autonomylevels"; // Replace with your collection ID

export function getAutonomyLevelsByModuleId( mid ){
  // if( ens.current.length == 0 ) await ens.init();
  console.log("getAutonomyLevelsByModuleId.list", ens.current );
  console.log("getAutonomyLevelsByModuleId.moduleId", mid );
  let als = ens.current.filter((al) => al.moduleId == mid);
  console.log("getAutonomyLevelsByModuleId.als.length", als.length );
  console.log("getAutonomyLevelsByModuleId.als", als );
  return als;
}

export const ens = reactive({
  current: [],
  async init() {
    let system_query_cond = systems.getQueryCondition();

    const response = await databases.listDocuments(
      KICD_DATABASE_ID,
      AUTONOMYLEVELS_COLLECTION_ID,
      [system_query_cond]
    );
    this.current = response.documents;
    console.log("init.autonomylevels:", this.current);
  },
  async add(en) {
    const response = await databases.createDocument(
      KICD_DATABASE_ID,
      AUTONOMYLEVELS_COLLECTION_ID,
      ID.unique(),
      en
    );
    this.current = [response, ...this.current].slice(0, 10);
    let docid = response.$id;
    console.log("al-id added: " + docid);
    return docid;
  },
  async remove(id) {
    await databases.deleteDocument(KICD_DATABASE_ID, AUTONOMYLEVELS_COLLECTION_ID, id);
    this.current = this.current.filter((en) => en.$id !== id);
    await this.init();
  },
  async update(en) {
    console.log(en);
    await databases.updateDocument(KICD_DATABASE_ID, AUTONOMYLEVELS_COLLECTION_ID, en.$id, en);
    await this.init();
  },
});
