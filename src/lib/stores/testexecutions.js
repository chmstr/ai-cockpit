import { ID, Query } from "appwrite";
import { databases } from "../../appwrite";
import { reactive } from "vue";

export const KICD_DATABASE_ID = "kicd"; // Replace with your database ID
export const TESTEXECUTIONS_COLLECTION_ID = "testexecutions"; // Replace with your collection ID

export const ens = reactive({
  current: [],
  tc_id: "",
  async init(tcid) {
    if (tcid) {
      this.tc_id = tcid
      console.log("testexecutions.js: using new tcid " + this.tc_id);
    }
    else console.log("testexecutions.js: using existing tcid " + this.tc_id);
    const response = await databases.listDocuments(
      KICD_DATABASE_ID,
      TESTEXECUTIONS_COLLECTION_ID,
      [Query.equal("testcases", this.tc_id), Query.orderDesc("$createdAt"), Query.limit(10)]
    );
    this.current = response.documents;
    console.log("INIT Testexecution done");
    console.log(this.current);
  },
  async add(en) {
    const response = await databases.createDocument(
      KICD_DATABASE_ID,
      TESTEXECUTIONS_COLLECTION_ID,
      ID.unique(),
      en
    );
    this.current = [response, ...this.current].slice(0, 10);
    let docid = response.$id;
    console.log("texec-id added: " + docid);
    return docid;
  },
  async remove(id) {
    await databases.deleteDocument(KICD_DATABASE_ID, TESTEXECUTIONS_COLLECTION_ID, id);
    this.current = this.current.filter((en) => en.$id !== id);
    await this.init();
  },
  async update(en) {
    console.log(en);
    await databases.updateDocument(KICD_DATABASE_ID, TESTEXECUTIONS_COLLECTION_ID, en.$id, en);
    await this.init();
  },
});
