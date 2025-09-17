import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyA99CeQrv2r7ay2pA6upDguR7pcvtbxFQg",
  authDomain: "travelai-8dc38.firebaseapp.com",
  projectId: "travelai-8dc38",
  storageBucket: "travelai-8dc38.firebasestorage.app",
  messagingSenderId: "487036867269",
  appId: "1:487036867269:web:9a1ebbc8865c4f7b3c16ac",
  measurementId: "G-EJB0JSL3F2"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

// ✅ Only initialize analytics if available (to avoid SSR issues in Vercel)
export let analytics;
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}