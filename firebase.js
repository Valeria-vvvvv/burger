import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, GithubAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCS2BzkfMC8Cu6i40NY41vu_R0PFUUFJpw",
  authDomain: "application-7735c.firebaseapp.com",
  projectId: "application-7735c",
  storageBucket: "application-7735c.firebasestorage.app",
  messagingSenderId: "34605007025",
  appId: "1:34605007025:web:04f81bda5c66e6f16a6290",
  measurementId: "G-BGKZXHENCK",
};

// Инициализация Firebase
const app = initializeApp(firebaseConfig);

// Инициализация аутентификации
export const auth = getAuth(app);

// Инициализация Firestore
export const db = getFirestore(app);

// Провайдеры для OAuth
export const googleProvider = new GoogleAuthProvider();
export const githubProvider = new GithubAuthProvider();

// Настройка дополнительных областей для GitHub
githubProvider.addScope("user:email");

export default app;
