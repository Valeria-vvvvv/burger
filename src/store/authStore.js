import { create } from "zustand";
import { devtools } from "zustand/middleware";
import {
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from "firebase/auth";
import { auth, googleProvider, githubProvider } from "../../firebase";

/**
 * ZUSTAND STORE ДЛЯ УПРАВЛЕНИЯ АУТЕНТИФИКАЦИЕЙ
 *
 * Заменяет AuthContext и useAuth хук
 * Управляет состоянием пользователя, входом/выходом через Firebase Auth
 */
export const useAuthStore = create(
  devtools(
    (set, get) => ({
      // ========================================
      // СОСТОЯНИЕ АУТЕНТИФИКАЦИИ
      // ========================================

      user: null,
      loading: true,
      error: null,
      initialized: false,

      // ========================================
      // ИНИЦИАЛИЗАЦИЯ
      // ========================================

      /**
       * ИНИЦИАЛИЗАЦИЯ FIREBASE AUTH
       * Настраивает слушатель изменений состояния аутентификации
       */
      initialize: () => {
        const { initialized } = get();
        if (initialized) return;

        set({ initialized: true }, false, "auth/initialize");

        // Проверяем результат redirect при загрузке страницы
        const checkRedirectResult = async () => {
          try {
            const result = await getRedirectResult(auth);
            if (result) {
              set(
                { user: result.user, loading: false },
                false,
                "auth/redirect-success"
              );
              console.log("Успешный вход через redirect:", result.user);
            }
          } catch (error) {
            console.error("Ошибка redirect:", error);
            set(
              { error: error.message, loading: false },
              false,
              "auth/redirect-error"
            );
          }
        };

        checkRedirectResult();

        // Настраиваем слушатель изменений состояния
        try {
          const unsubscribe = onAuthStateChanged(
            auth,
            (user) => {
              console.log("Auth state changed:", user);
              set({ user, loading: false }, false, "auth/state-changed");
            },
            (error) => {
              console.error("Auth state error:", error);
              set(
                { error: error.message, loading: false },
                false,
                "auth/state-error"
              );
            }
          );

          // Сохраняем функцию отписки в store для cleanup
          set({ unsubscribe }, false, "auth/set-unsubscribe");
        } catch (error) {
          console.error("Firebase auth initialization error:", error);
          set(
            {
              error: "Ошибка инициализации Firebase",
              loading: false,
            },
            false,
            "auth/init-error"
          );
        }

        // Fallback таймер на случай, если Firebase не отвечает
        const timeoutId = setTimeout(() => {
          const { loading } = get();
          if (loading) {
            console.warn("Firebase auth timeout, setting loading to false");
            set({ loading: false }, false, "auth/timeout");
          }
        }, 5000);

        // Сохраняем ID таймера для очистки
        set({ timeoutId }, false, "auth/set-timeout");
      },

      // ========================================
      // МЕТОДЫ ВХОДА
      // ========================================

      /**
       * ВХОД ЧЕРЕЗ GOOGLE
       */
      signInWithGoogle: async () => {
        set({ loading: true, error: null }, false, "auth/google-start");

        try {
          // Сначала пробуем popup
          try {
            const result = await signInWithPopup(auth, googleProvider);
            set(
              {
                user: result.user,
                loading: false,
              },
              false,
              "auth/google-popup-success"
            );
            console.log("Успешный вход через Google (popup):", result.user);
          } catch (popupError) {
            // Игнорируем CORS предупреждения - это нормально для Firebase popup
            if (popupError.code === "auth/popup-blocked") {
              console.log("Popup заблокирован, используем redirect");
              await signInWithRedirect(auth, googleProvider);
              return;
            }
            if (popupError.code === "auth/popup-closed-by-user") {
              console.log("Пользователь закрыл окно входа");
              set({ loading: false }, false, "auth/google-popup-cancelled");
              return;
            }
            // Игнорируем ошибки связанные с CORS и window.closed
            if (popupError.message?.includes("Cross-Origin-Opener-Policy")) {
              console.log("CORS предупреждение (можно игнорировать)");
              set({ loading: false }, false, "auth/google-cors-warning");
              return;
            }
            throw popupError;
          }
        } catch (error) {
          // Не показываем ошибку если это просто CORS предупреждение
          if (!error.message?.includes("Cross-Origin-Opener-Policy")) {
            set(
              {
                error: error.message,
                loading: false,
              },
              false,
              "auth/google-error"
            );
            console.error("Ошибка входа через Google:", error);
          } else {
            set({ loading: false }, false, "auth/google-cors-ignored");
          }
        }
      },

      /**
       * ВХОД ЧЕРЕЗ GITHUB
       */
      signInWithGithub: async () => {
        set({ loading: true, error: null }, false, "auth/github-start");

        try {
          // Сначала пробуем popup
          try {
            const result = await signInWithPopup(auth, githubProvider);
            set(
              {
                user: result.user,
                loading: false,
              },
              false,
              "auth/github-popup-success"
            );
            console.log("Успешный вход через GitHub (popup):", result.user);
          } catch (popupError) {
            // Игнорируем CORS предупреждения - это нормально для Firebase popup
            if (popupError.code === "auth/popup-blocked") {
              console.log("Popup заблокирован, используем redirect");
              await signInWithRedirect(auth, githubProvider);
              return;
            }
            if (popupError.code === "auth/popup-closed-by-user") {
              console.log("Пользователь закрыл окно входа");
              set({ loading: false }, false, "auth/github-popup-cancelled");
              return;
            }
            // Игнорируем ошибки связанные с CORS и window.closed
            if (popupError.message?.includes("Cross-Origin-Opener-Policy")) {
              console.log("CORS предупреждение (можно игнорировать)");
              set({ loading: false }, false, "auth/github-cors-warning");
              return;
            }
            throw popupError;
          }
        } catch (error) {
          // Не показываем ошибку если это просто CORS предупреждение
          if (!error.message?.includes("Cross-Origin-Opener-Policy")) {
            set(
              {
                error: error.message,
                loading: false,
              },
              false,
              "auth/github-error"
            );
            console.error("Ошибка входа через GitHub:", error);
          } else {
            set({ loading: false }, false, "auth/github-cors-ignored");
          }
        }
      },

      /**
       * ВЫХОД ИЗ СИСТЕМЫ
       */
      signOut: async () => {
        set({ loading: true, error: null }, false, "auth/signout-start");

        try {
          await firebaseSignOut(auth);
          set(
            {
              user: null,
              loading: false,
            },
            false,
            "auth/signout-success"
          );
          console.log("Успешный выход из системы");
        } catch (error) {
          set(
            {
              error: error.message,
              loading: false,
            },
            false,
            "auth/signout-error"
          );
          console.error("Ошибка выхода:", error);
        }
      },

      // ========================================
      // УТИЛИТЫ
      // ========================================

      /**
       * ОЧИСТКА ОШИБКИ
       */
      clearError: () => {
        set({ error: null }, false, "auth/clear-error");
      },

      /**
       * CLEANUP - вызывается при размонтировании
       */
      cleanup: () => {
        const { unsubscribe, timeoutId } = get();
        if (unsubscribe) {
          unsubscribe();
        }
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
      },
    }),
    { name: "auth-store" }
  )
);
