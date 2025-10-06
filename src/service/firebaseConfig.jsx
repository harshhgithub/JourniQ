import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
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

// ✅ Initialize Firebase
export const app = initializeApp(firebaseConfig);

// ✅ Initialize Firestore & Auth
export const db = getFirestore(app);
export const auth = getAuth(app);

// ✅ Add Google Auth Provider (this fixes your import error)
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: "select_account", // optional: always ask user to pick account
});

// ✅ Optional: Analytics (only in browser)
export let analytics;
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}
