import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth, signInAnonymously } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAI3sODIFc4E2b5K3mTlxO43JnbY-Af9Sg",
  authDomain: "trivia-family-b4265.firebaseapp.com",
  databaseURL: "https://trivia-family-b4265-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "trivia-family-b4265",
  storageBucket: "trivia-family-b4265.firebasestorage.app",
  messagingSenderId: "336325747930",
  appId: "1:336325747930:web:7d2b696336f3dfd497f1e3",
  measurementId: "G-FMG7T87GXP"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);

const auth = getAuth();
signInAnonymously(auth).then(() => console.log("🔐 Connected anonymously")).catch(console.error);

