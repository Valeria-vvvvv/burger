import { useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useBasketList } from "../../store/useBasketList.jsx";

/**
 * Провайдер приложения
 * Синхронизирует корзину с пользователем
 */
export const AppProvider = ({ children }) => {
  const { user } = useAuth();
  const setCurrentUser = useBasketList((state) => state.setCurrentUser);

  // Синхронизируем корзину с текущим пользователем
  useEffect(() => {
    if (user) {
      setCurrentUser(user.id);
    } else {
      setCurrentUser(null);
    }
  }, [user, setCurrentUser]);

  return children;
};
