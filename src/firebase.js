import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCLRDVeOBEzOqEEzDB5pqwL_1Mfgq_cAgo",
  authDomain: "vivahamuhurtam.firebaseapp.com",
  projectId: "vivahamuhurtam",
  storageBucket: "vivahamuhurtam.firebasestorage.app",
  messagingSenderId: "519486685875",
  appId: "1:519486685875:web:e3a70b51d24e68b299a6c6",
  measurementId: "G-55ZHRCW8ET",
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app); // optional
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider, signInWithPopup, signOut };
