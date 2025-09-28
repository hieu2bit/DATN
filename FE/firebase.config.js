import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyABwoiNgHyXCHkvS85wss-QL6vyLLOaoQU",
  authDomain: "aopolonam-d7902.firebaseapp.com",
  projectId: "aopolonam-d7902",
  storageBucket: "aopolonam-d7902.appspot.com", 
  messagingSenderId: "894493310312",
  appId: "1:894493310312:web:a1d3e9f8c27f9120e22add",
  measurementId: "G-PX7SK91PV6"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage };
