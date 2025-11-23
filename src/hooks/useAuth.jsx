import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  updateEmail,
} from "firebase/auth";
import { auth, googleProvider, githubProvider } from "../../firebase";

// Функция для перевода ошибок Firebase на русский язык
const getFirebaseErrorMessage = (errorCode) => {
  const errorMessages = {
    "auth/email-already-in-use": "Этот email уже используется другим аккаунтом",
    "auth/invalid-email": "Некорректный адрес электронной почты",
    "auth/weak-password": "Пароль должен содержать минимум 6 символов",
    "auth/user-not-found": "Пользователь с таким email не найден",
    "auth/wrong-password": "Неверный пароль",
    "auth/too-many-requests": "Слишком много попыток входа. Попробуйте позже",
    "auth/operation-not-allowed": "Этот метод входа не разрешен",
    "auth/account-exists-with-different-credential":
      "Аккаунт с таким email уже существует",
    "auth/network-request-failed":
      "Ошибка сети. Проверьте подключение к интернету",
    "auth/user-disabled": "Аккаунт заблокирован",
    "auth/invalid-credential": "Неверные учетные данные",
  };

  return errorMessages[errorCode] || "Произошла неизвестная ошибка";
};

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  // Данные об аутентификации пользователя
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Слушатель состояния аутентификации Firebase
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        // Пользователь вошел через Firebase
        const userData = {
          id: firebaseUser.uid,
          login: firebaseUser.email,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
          provider: firebaseUser.providerData[0]?.providerId || "email",
          role: "user", // По умолчанию обычный пользователь
        };
        setUser(userData);
      } else {
        // Пользователь не авторизован
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // Вход через Google
  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      navigate("/app/home");
    } catch (error) {
      console.error("Ошибка входа через Google:", error);
    }
  };

  // Вход через GitHub
  const signInWithGithub = async () => {
    try {
      await signInWithPopup(auth, githubProvider);
      navigate("/app/home");
    } catch (error) {
      console.error("Ошибка входа через GitHub:", error);
    }
  };

  // Регистрация пользователя через Firebase
  const onRegister = async (userData) => {
    try {
      if (userData.email && userData.password) {
        const result = await createUserWithEmailAndPassword(
          auth,
          userData.email,
          userData.password
        );

        // Отправляем email для подтверждения регистрации через Firebase
        try {
          await sendEmailVerification(result.user);
        } catch (emailError) {
          console.warn("Не удалось отправить email подтверждения:", emailError);
        }

        navigate("/app/home");
        return { success: true };
      }
    } catch (error) {
      return { success: false, error: getFirebaseErrorMessage(error.code) };
    }
  };

  // Вход пользователя через Firebase
  const onLogin = async (userData) => {
    try {
      if (userData.email && userData.password) {
        await signInWithEmailAndPassword(
          auth,
          userData.email,
          userData.password
        );
        navigate("/app/home");
        return { success: true };
      }
    } catch (error) {
      return { success: false, error: getFirebaseErrorMessage(error.code) };
    }
  };

  // Выход пользователя
  const onLogout = async () => {
    await signOut(auth);
    setUser(null);
    navigate("/");
  };
  // Отправка email для сброса пароля
  const resetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true };
    } catch (error) {
      return { success: false, error: getFirebaseErrorMessage(error.code) };
    }
  };

  // Отправка email для подтверждения email адреса
  const sendVerificationEmail = async () => {
    try {
      if (auth.currentUser) {
        await sendEmailVerification(auth.currentUser);
        return { success: true };
      }
      return { success: false, error: "Пользователь не авторизован" };
    } catch (error) {
      return { success: false, error: getFirebaseErrorMessage(error.code) };
    }
  };

  // Изменение email адреса
  const changeEmail = async (newEmail) => {
    try {
      if (auth.currentUser) {
        await updateEmail(auth.currentUser, newEmail);
        return { success: true };
      }
      return { success: false, error: "Пользователь не авторизован" };
    } catch (error) {
      return { success: false, error: getFirebaseErrorMessage(error.code) };
    }
  };

  const contextValue = {
    user,
    onRegister,
    onLogin,
    onLogout,
    signInWithGoogle,
    signInWithGithub,
    resetPassword,
    sendVerificationEmail,
    changeEmail,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

// Хук для доступа к контексту аутентификации
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
