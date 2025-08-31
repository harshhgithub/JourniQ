// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA99CeQrv2r7ay2pA6upDguR7pcvtbxFQg",
  authDomain: "travelai-8dc38.firebaseapp.com",
  projectId: "travelai-8dc38",
  storageBucket: "travelai-8dc38.firebasestorage.app",
  messagingSenderId: "487036867269",
  appId: "1:487036867269:web:9a1ebbc8865c4f7b3c16ac",
  measurementId: "G-EJB0JSL3F2"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);