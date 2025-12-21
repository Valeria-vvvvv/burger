import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, GithubAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Инициализация Firebase
const app = initializeApp(firebaseConfig);

// Инициализация аутентификации
export const auth = getAuth(app);

// Инициализация Firestore
export const db = getFirestore(app);

// Инициализация Analytics
export const analytics = getAnalytics(app);

// Провайдеры для OAuth
export const googleProvider = new GoogleAuthProvider();
export const githubProvider = new GithubAuthProvider();

// Настройка дополнительных областей для GitHub
githubProvider.addScope("user:email");

export default app;
