import { ID, Query } from "appwrite";
import { databases } from "../../appwrite";
import { reactive } from "vue";
import { ens as allmeasures } from "./allmeasures";
import { ens as systems } from "./systems.js";

export const KICD_DATABASE_ID = "kicd"; // Replace with your database ID
export const TESTCASES_COLLECTION_ID = "testcases"; // Replace with your collection ID

export const ens = reactive({
  current: [],
  async init() {
    let system_query_cond = systems.getQueryCondition();
    const response = await databases.listDocuments(
      KICD_DATABASE_ID,
      TESTCASES_COLLECTION_ID,
      [system_query_cond]
    );
    this.current = response.documents;
    allmeasures.deleteByCollectionId(TESTCASES_COLLECTION_ID);
    allmeasures.update(this.current);
    console.log("INIT Testcase done");
    console.log(this.current);
  },
  async add(en) {
    const response = await databases.createDocument(
      KICD_DATABASE_ID,
      TESTCASES_COLLECTION_ID,
      ID.unique(),
      en
    );
    await this.init();
  },
  async remove(id) {
    await databases.deleteDocument(KICD_DATABASE_ID, TESTCASES_COLLECTION_ID, id);
    this.current = this.current.filter((idea) => idea.$id !== id);
    await this.init(); // Refetch ideas to ensure we have 10 items
  },
  async update(idea) {
    console.log(idea);
    await databases.updateDocument(KICD_DATABASE_ID, TESTCASES_COLLECTION_ID, idea.$id, idea);
    await this.init(); // Refetch ideas to ensure we have 10 items
  },
});
