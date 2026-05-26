import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBJrCJG_wm2n2K0aa7lPbe2N9afh_KHxEI",
  authDomain: "shop-rewards-5ff41.firebaseapp.com",
  projectId: "shop-rewards-5ff41",
  storageBucket: "shop-rewards-5ff41.firebasestorage.app",
  messagingSenderId: "450734107427",
  appId: "1:450734107427:web:2f462f553308597c353a96",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);