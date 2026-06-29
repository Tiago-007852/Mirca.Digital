/// <reference types="vite/client" />
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Support production configuration through environment variables with development fallback
const firebaseConfig = {
  projectId: (import.meta.env.VITE_FIREBASE_PROJECT_ID as string) || "gen-lang-client-0141710048",
  appId: (import.meta.env.VITE_FIREBASE_APP_ID as string) || "1:98268419670:web:67c17608474cfb2cfacdf7",
  apiKey: (import.meta.env.VITE_FIREBASE_API_KEY as string) || "AIzaSyAV3m8yH6uApQxVbypnWsAq8HHV1UVHfpw",
  authDomain: (import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string) || "gen-lang-client-0141710048.firebaseapp.com",
  storageBucket: (import.meta.env.VITE_FIREBASE_STORAGE_BUCKET as string) || "gen-lang-client-0141710048.firebasestorage.app",
  messagingSenderId: (import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID as string) || "98268419670"
};

const databaseId = (import.meta.env.VITE_FIREBASE_FIRESTORE_DATABASE_ID as string) || "ai-studio-64fe233a-3bd7-4f10-b7d3-3b3312214cb1";

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app, databaseId);
export const storage = getStorage(app);
export { app };

