import { createContext, useContext, useState, useCallback } from "react";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const removeNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const showNotification = useCallback(
    (type, message, duration = 5000) => {
      const id = Date.now().toString();
      const notification = { id, type, message, duration };

      setNotifications((prev) => [...prev, notification]);

      setTimeout(() => removeNotification(id), duration);
    },
    [removeNotification]
  );

  const showSuccess = useCallback(
    (message, duration = 5000) => {
      showNotification("success", message, duration);
    },
    [showNotification]
  );

  const showError = useCallback(
    (message, duration = 5000) => {
      showNotification("error", message, duration);
    },
    [showNotification]
  );

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        removeNotification,
        showSuccess,
        showError,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotification must be used within NotificationProvider");
  }
  return context;
};
