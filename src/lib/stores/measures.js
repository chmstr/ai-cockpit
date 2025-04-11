import { ID, Query } from "appwrite";
import { databases } from "../../appwrite";
import { reactive } from "vue";
import { ens as allmeasures } from "./allmeasures";
import { ens as systems } from "./systems.js";


export const KICD_DATABASE_ID = "kicd";
export const MEASURES_COLLECTION_ID = "measures";

export const ens = reactive({
  current: [],
  async init() {
    let system_query_cond = systems.getQueryCondition();
    const response = await databases.listDocuments(
      KICD_DATABASE_ID,
      MEASURES_COLLECTION_ID,
      [system_query_cond]
    );
    this.current = response.documents;
    allmeasures.deleteByCollectionId(MEASURES_COLLECTION_ID);
    allmeasures.update(this.current);
    console.log(this.current);
    console.log("INIT: Measures done");
  },
  async add(en) {
    const response = await databases.createDocument(
      KICD_DATABASE_ID,
      MEASURES_COLLECTION_ID,
      ID.unique(),
      en
    );
    await this.init();
  },
  async remove(id) {
    await databases.deleteDocument(KICD_DATABASE_ID, MEASURES_COLLECTION_ID, id);
    this.current = this.current.filter((en) => en.$id !== id);
    await this.init();
  },
  async update(en) {
    console.log(en);
    await databases.updateDocument(KICD_DATABASE_ID, MEASURES_COLLECTION_ID, en.$id, en);
    await this.init();
  },
});
