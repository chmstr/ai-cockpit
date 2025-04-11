import { ID, Query } from "appwrite";
import { databases } from "../../appwrite";
import { reactive } from "vue";

export const KICD_DATABASE_ID = "kicd";
export const RISKS2RULES_COLLECTION_ID = "risks2rules";

export const ens = reactive({
  current: [],
  async init() {
    const response = await databases.listDocuments(
      KICD_DATABASE_ID,
      RISKS2RULES_COLLECTION_ID,
      [Query.orderDesc("$createdAt"), Query.limit(10)]
    );
    this.current = response.documents;
    console.log("init risks2rules done");
    console.log(this.current);
  },
  async add(en) {
    const response = await databases.createDocument(
      KICD_DATABASE_ID,
      RISKS2RULES_COLLECTION_ID,
      ID.unique(),
      { ...en, systemId: systems.systemId }
    );
  },
  async remove(id) {
    await databases.deleteDocument(KICD_DATABASE_ID, RISKS2RULES_COLLECTION_ID, id);
    this.current = this.current.filter((en) => en.$id !== id);
    await this.init();
  },
  async update(en) {
    console.log(en);
    await databases.updateDocument(KICD_DATABASE_ID, RISKS2RULES_COLLECTION_ID, en.$id, en);
    await this.init();
  },
});
