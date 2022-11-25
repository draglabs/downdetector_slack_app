import { initializeApp } from "firebase/app";
import {
  getFirestore,
  addDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

export function getFirebaseConfig() {
  return {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
    measurementId: process.env.FIREBASE_MEASUREMENT_ID,
  };
}

export const app = initializeApp(getFirebaseConfig());
export const db = getFirestore(app);

const sitesCollection = collection(db, "sites");

export async function checkIfSiteRegistered(url: string) {
  const q = query(sitesCollection, where("url", "==", url));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.length > 0;
}

export async function addSite(url: string, channelId: string) {
  await addDoc(sitesCollection, {
    url,
    channelId,
  });
}
