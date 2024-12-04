// src/utils/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyBAuvWYqkGXne1wlpECSuJLDvLMGHJ01l4",
  authDomain: "responsi2-584bd.firebaseapp.com",
  projectId: "responsi2-584bd",
  storageBucket: "responsi2-584bd.firebasestorage.app",
  messagingSenderId: "757989864005",
  appId: "1:757989864005:web:42e5b1dd7729bafdd3692c",
  measurementId: "G-7NLYHTCKV5"
};

const firebase = initializeApp(firebaseConfig);
const auth = getAuth(firebase);
const googleProvider = new GoogleAuthProvider();
const db = getFirestore(firebase);

export { auth, googleProvider, db };