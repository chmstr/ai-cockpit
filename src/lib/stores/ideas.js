import { ID, Query } from "appwrite";
import { databases } from "../../appwrite";
import { reactive } from "vue";

export const IDEAS_DATABASE_ID = "ideas-tracker"; // Replace with your database ID
export const IDEAS_COLLECTION_ID = "ideas"; // Replace with your collection ID

export const ens = reactive({
  current: [],
  async init() {
    const response = await databases.listDocuments(
      IDEAS_DATABASE_ID,
      IDEAS_COLLECTION_ID,
      [Query.orderDesc("$createdAt"), Query.limit(10)]
    );
    this.current = response.documents;
    console.log("init done");
    console.log(this.current);
  },
  async add(idea) {
    const response = await databases.createDocument(
      IDEAS_DATABASE_ID,
      IDEAS_COLLECTION_ID,
      ID.unique(),
      idea
    );
    this.current = [response, ...this.current].slice(0, 10);
  },
  async remove(id) {
    await databases.deleteDocument(IDEAS_DATABASE_ID, IDEAS_COLLECTION_ID, id);
    this.current = this.current.filter((idea) => idea.$id !== id);
    await this.init(); // Refetch ideas to ensure we have 10 items
  },
  async update(idea) {
    console.log(idea);
    await databases.updateDocument(IDEAS_DATABASE_ID, IDEAS_COLLECTION_ID, idea.$id, idea);
    await this.init(); // Refetch ideas to ensure we have 10 items
  },
});
