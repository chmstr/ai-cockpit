import { ID, Query } from "appwrite";
import { databases } from "../../appwrite";
import { reactive } from "vue";
import { ens as systems } from "./systems.js";

export const KICD_DATABASE_ID = "kicd"; // Replace with your database ID
export const LOGS_COLLECTION_ID = "logs"; // Replace with your collection ID

export const ens = reactive({
  current: [],
  async init() {
    let system_query_cond = systems.getQueryCondition();
    const response = await databases.listDocuments(
      KICD_DATABASE_ID,
      LOGS_COLLECTION_ID,
      [Query.orderDesc("$createdAt"), system_query_cond]
    );
    this.current = response.documents;
    console.log("init done");
    console.log(this.current);
  },
  async add(en) {
    const response = await databases.createDocument(
      KICD_DATABASE_ID,
      LOGS_COLLECTION_ID,
      ID.unique(),
      { ...en, systemId: systems.systemId }
    );
    this.current = [response, ...this.current].slice(0, 10);
  },
  async remove(id) {
    await databases.deleteDocument(KICD_DATABASE_ID, LOGS_COLLECTION_ID, id);
    this.current = this.current.filter((en) => en.$id !== id);
    await this.init();
  },
  async update(en) {
    console.log(en);
    await databases.updateDocument(KICD_DATABASE_ID, LOGS_COLLECTION_ID, en.$id, en);
    await this.init();
  },
});
