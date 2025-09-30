
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const getFirebaseApp = () => {
  if (getApps().length > 0) {
    return getApp();
  }

  const firebaseConfig = {
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  };

  if (!firebaseConfig.apiKey) {
    throw new Error('Missing Firebase API Key');
  }

  return initializeApp(firebaseConfig);
};

// Initialize Firebase
const app = getFirebaseApp();
export const auth = getAuth(app);
