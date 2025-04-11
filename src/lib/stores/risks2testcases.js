import { ID, Query } from "appwrite";
import { databases } from "../../appwrite";
import { reactive } from "vue";

export const KICD_DATABASE_ID = "kicd";
export const RISKS2TESTCASES_COLLECTION_ID = "risks2testcases";

export const ens = reactive({
  current: [],
  async init() {
    const response = await databases.listDocuments(
      KICD_DATABASE_ID,
      RISKS2TESTCASES_COLLECTION_ID,
      [Query.orderDesc("$createdAt"), Query.limit(10)]
    );
    this.current = response.documents;
    console.log("init risks2testcases done");
    console.log(this.current);
  },
  async add(en) {
    const response = await databases.createDocument(
      KICD_DATABASE_ID,
      RISKS2TESTCASES_COLLECTION_ID,
      ID.unique(),
      en
    );
    this.current = [response, ...this.current].slice(0, 10);
  },
  async remove(id) {
    await databases.deleteDocument(KICD_DATABASE_ID, RISKS2TESTCASES_COLLECTION_ID, id);
    this.current = this.current.filter((en) => en.$id !== id);
    await this.init();
  },
  async update(en) {
    console.log(en);
    await databases.updateDocument(KICD_DATABASE_ID, RISKS2TESTCASES_COLLECTION_ID, en.$id, en);
    await this.init();
  },
});
