import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAriZPBlr8la89Cl0KqBMLgw_flNUxhZps",
  authDomain: "crve-801a7.firebaseapp.com",
  projectId: "crve-801a7",
  storageBucket: "crve-801a7.appspot.com",
  messagingSenderId: "353750817401",
  appId: "1:353750817401:web:cc45e9d50358d6819212a8"
};

// Only initialize once
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

// ✅ Use default getAuth (no persistence)
const auth = getAuth(app);

// ✅ Firestore
const db = getFirestore(app);

export { auth, db };
  