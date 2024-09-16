import { Account, Avatars, Client, Databases, ID, Query } from 'react-native-appwrite';

export const Config = {
    endpoint: 'https://cloud.appwrite.io/v1',
    platform: 'co.edu.sena.aora',
    projectId: '66c512d0002efc2c58e7',
    databaseId: '66c512ea001864cd2ed4',
    userCollectionId: '66c5142b000af2f76129',
    videoCollectionId: '66c514740008e8ca98bc',
    storageId: '66c74bb50023d20a4db6'
}

const {
  endpoint,
  plataform,
  projectId,
  databaseId,
  userCollectionId,
  videoCollectionId,
  storageId,
} = Config;

// Init your React Native SDK
const client = new Client();

client
    .setEndpoint(Config.endpoint)
    .setProject(Config.projectId)
    .setPlatform(Config.plataform);

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);

export const createUser = async (email, password, username) => {
    try {
      const newAccount = await account.create(
        ID.unique(),
        email,
        password,
        username
      ) 

      if (!newAccount) throw Error;
      

      const avatarUrl = avatars.getInitials(username);

      await signIn(email, password);

      const newUser = await databases.createDocument(
        Config.databaseId,
        Config.userCollectionId,
        ID.unique(),
        {
          accountId: newAccount.$id,
          email: email,
          username: username,
          avatar: avatarUrl,
        }
      );
      
      return newUser;
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
}

export const signIn = async (email, password) => {
    try {
      const session = await account.createEmailPasswordSession(email, password);
      
      return session;
    } catch (error) {
      throw new Error(error);  
    }
}

export async function getAccount() {
  try {
    const currentAccount = await account.get();

    return currentAccount;
  } catch (error) {
    throw new Error(error);
  }
}

// Get Current User
export async function getCurrentUser() {
  try {
    const currentAccount = await getAccount();
    if (!currentAccount) throw Error;

    const currentUser = await databases.listDocuments(
      Config.databaseId,
      Config.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );

    if (!currentUser) throw Error;

    return currentUser.documents[0];
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function getAllPosts() {
  try {
    const posts = await databases.listDocuments(
      databaseId,
      videoCollectionId
    );

    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
}