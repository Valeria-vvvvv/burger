import { createContext, useContext, useState, useCallback } from "react";

// Создание контекста для управления уведомлениями
const NotificationContext = createContext();

// Провайдер контекста, который предоставляет функции для работы с уведомлениями
export const NotificationProvider = ({ children }) => {
  // Состояние для хранения списка активных уведомлений
  const [notifications, setNotifications] = useState([]);

  // Функция для удаления уведомления по ID
  const removeNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  // Основная функция для показа уведомления
  // type - тип уведомления ('success', 'error' и т.д.)
  // message - текст сообщения
  // duration - время отображения в миллисекундах (по умолчанию 5000мс)
  const showNotification = useCallback(
    (type, message, duration = 5000) => {
      // Генерация уникального ID на основе текущего времени
      const id = Date.now().toString();
      // Создание объекта уведомления
      const notification = { id, type, message, duration };

      // Добавление уведомления в список
      setNotifications((prev) => [...prev, notification]);

      // Автоматическое удаление уведомления через указанное время
      setTimeout(() => removeNotification(id), duration);
    },
    [removeNotification]
  );

  // Удобная функция для показа успешного уведомления
  const showSuccess = useCallback(
    (message, duration = 5000) => {
      showNotification("success", message, duration);
    },
    [showNotification]
  );

  // Удобная функция для показа уведомления об ошибке
  const showError = useCallback(
    (message, duration = 5000) => {
      showNotification("error", message, duration);
    },
    [showNotification]
  );

  // Возвращаем провайдер с контекстом, содержащим все необходимые функции и состояние
  return (
    <NotificationContext.Provider
      value={{
        notifications, // Список активных уведомлений
        removeNotification, // Функция удаления уведомления
        showSuccess, // Функция показа успешного уведомления
        showError, // Функция показа уведомления об ошибке
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

// Хук для использования контекста уведомлений
// Должен использоваться только внутри NotificationProvider
export const useNotification = () => {
  const context = useContext(NotificationContext);
  // Проверка, что хук используется внутри провайдера
  if (!context) {
    throw new Error("useNotification must be used within NotificationProvider");
  }
  return context;
};
