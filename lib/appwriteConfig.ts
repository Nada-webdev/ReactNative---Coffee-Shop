import { Account, Client, Databases } from "react-native-appwrite";

const client = new Client();

client
  .setEndpoint("https://nyc.cloud.appwrite.io/v1")
  .setProject("6857132a002a5a00e64e"); 

export const account = new Account(client);
export const databases = new Databases(client);

export default client;
