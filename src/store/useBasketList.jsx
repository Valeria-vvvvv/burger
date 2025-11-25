import { create } from "zustand";
import { getStorageItem, setStorageItem } from "../utils/localStorage";
import { useUIStore } from "./uiStore";

/**
 * Стор корзины товаров с привязкой к конкретному пользователю.
 * Каждый пользователь имеет свою корзину в localStorage.
 */
export const useBasketList = create((set, get) => {
  /**
   * Установка текущего пользователя и загрузка его корзины
   * @param {string|null} userId - ID пользователя или null
   */
  const setCurrentUser = (userId) => {
    if (!userId) {
      set({ currentUserId: null, basketList: [] });
      return;
    }

    const key = `basket-list-${userId}`;
    const listFromStorage = getStorageItem(key) || [];
    set({ currentUserId: userId, basketList: listFromStorage });
  };

  /**
   * Получение ключа localStorage для текущего пользователя
   */
  const getStorageKey = () => {
    const userId = get()?.currentUserId;
    if (!userId) return null;
    return `basket-list-${userId}`;
  };

  /**
   * Добавление товаров в корзину
   * @param {Object} product - Данные товара.
   */
  const addToBasket = (product) => {
    const userId = get()?.currentUserId;
    if (!userId) {
      console.warn(
        "Пользователь не авторизован. Невозможно добавить товар в корзину."
      );
      return;
    }

    // Получаем текущее состояние корзины или инициализируем пустой массив
    const currentCart = [...(get()?.basketList || [])];

    // Ищем товар в корзине по id
    const existingProductIndex = currentCart.findIndex(
      (item) => item?.id === product?.id
    );

    let newCart;
    if (existingProductIndex !== -1) {
      // Если товар уже в корзине, увеличиваем количество
      newCart = currentCart.map((item, index) =>
        index === existingProductIndex
          ? { ...item, cartQuantity: item.cartQuantity + 1 }
          : item
      );
    } else {
      newCart = [...currentCart, { ...product, cartQuantity: 1 }];
    }

    const storageKey = getStorageKey();
    if (storageKey) {
      setStorageItem(storageKey, newCart);
    }

    set({ basketList: newCart });

    // Показываем уведомление
    useUIStore.getState().showSuccess("Товар добавлен в корзину", 2000);
  };

  /**
   * Подсчет общего кол-ва товара
   */
  const getTotalQuantity = () => {
    const basketList = get()?.basketList || [];
    let totalQuantity = 0;

    if (basketList.length > 0) {
      basketList.forEach((item) => {
        if (item?.cartQuantity) totalQuantity += item?.cartQuantity;
      });
      return totalQuantity;
    }

    return 0;
  };

  /**
   * Обновление количества товара в корзине
   * @param {string} id - ID товара.
   * @param {number} quantity - Количество товара.
   */
  const updateQuantity = (id, quantity) => {
    const userId = get()?.currentUserId;
    if (!userId) return;

    const currentCart = get()?.basketList || [];

    // Создаем новый массив с обновленным количеством
    const newCart = currentCart.map((item) =>
      item?.id === id ? { ...item, cartQuantity: quantity } : item
    );

    const storageKey = getStorageKey();
    if (storageKey) {
      setStorageItem(storageKey, newCart);
    }

    set({ basketList: newCart });
  };

  /**
   * Удаление товара из корзины
   * @param {string} id - ID товара.
   */
  const removeFromBasket = (id) => {
    const userId = get()?.currentUserId;
    if (!userId) return;

    const currentCart = get()?.basketList || [];

    // Создаем новый массив без удаленного товара
    const newCart = currentCart.filter((item) => item?.id !== id);

    const storageKey = getStorageKey();
    if (storageKey) {
      setStorageItem(storageKey, newCart);
    }

    set({ basketList: newCart });

    // Показываем уведомление
    useUIStore.getState().showSuccess("Товар удален из корзины", 2000);
  };

  return {
    currentUserId: null,
    basketList: [],
    setCurrentUser,
    addToBasket,
    getTotalQuantity,
    updateQuantity,
    removeFromBasket,
  };
});
