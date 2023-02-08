import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyArhB74NYAqmfQ1zbgAkeiPG2FozMEoxoY",
    authDomain: "chat-e6f04.firebaseapp.com",
    projectId: "chat-e6f04",
    storageBucket: "chat-e6f04.appspot.com",
    messagingSenderId: "439572212289",
    appId: "1:439572212289:web:31060c0e2e3d882e4ab4c0"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore();
