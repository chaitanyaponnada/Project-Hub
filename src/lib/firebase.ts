
import { initializeApp, getApps, getApp, FirebaseOptions } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig: FirebaseOptions = {
  apiKey: "AIzaSyA3zCqM0aFSZPI5BG4YsfGgd_bprcypDL0",
  authDomain: "studio-2375892107-c45c7.firebaseapp.com",
  projectId: "studio-2375892107-c45c7",
  storageBucket: "studio-2375892107-c45c7.appspot.com",
  messagingSenderId: "831626629323",
  appId: "1:831626629323:web:8edaa747bbe5751fa94b4e"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
