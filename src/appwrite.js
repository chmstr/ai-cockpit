import { Client, Databases, Account } from "appwrite";
const { VITE_ENDPOINT, VITE_PROJECT_ID } = import.meta.env;

const client = new Client();

client
    .setEndpoint(VITE_ENDPOINT || "")
    .setProject(VITE_PROJECT_ID || "");


export const account = new Account(client);
export const databases = new Databases(client);
