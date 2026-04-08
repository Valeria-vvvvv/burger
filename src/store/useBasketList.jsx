import { create } from "zustand";

// Zustand стор для управления корзиной товаров
export const useBasketList = create((set, get) => {
  // Определяем функции как переменные
  const setCurrentUserFunc = (userId) => {
    if (!userId) {
      // Очистка состояния при выходе пользователя
      set({
        currentUserId: null,
        basketList: [],
        modals: { login: false, register: false, basket: false, order: false },
        notifications: [],
      });
      return;
    }

    // Создание уникального ключа для localStorage
    const key = `basket-list-${userId}`;
    // Загрузка сохраненной корзины или пустой массив
    const listFromStorage =
      JSON?.parse(localStorage?.getItem(key) || "[]") || [];

    // Обновление состояния с данными пользователя
    set({ currentUserId: userId, basketList: listFromStorage });
  };

  const addToBasketFunc = (product) => {
    const userId = get()?.currentUserId;
    if (!userId) {
      console.warn(
        "Пользователь не авторизован. Невозможно добавить товар в корзину."
      );
      return;
    }

    // Получение текущего состояния корзины через get()
    const currentCart = get()?.basketList || [];

    // Поиск существующего товара по ID
    const existingProductIndex = currentCart.findIndex(
      (item) => item?.id === product?.id
    );

    let updatedCart;
    if (existingProductIndex !== -1) {
      // Товар уже в корзине - увеличиваем количество
      updatedCart = currentCart.map((item, index) =>
        index === existingProductIndex
          ? { ...item, cartQuantity: item.cartQuantity + 1 } // Новый объект
          : item
      );
    } else {
      // Новый товар - добавляем в корзину
      updatedCart = [...currentCart, { ...product, cartQuantity: 1 }];
    }

    // Сохранение обновленной корзины в localStorage
    const storageKey = userId ? `basket-list-${userId}` : null;
    if (storageKey) {
      localStorage?.setItem(storageKey, JSON?.stringify(updatedCart));
    }

    // Обновление состояния через set()
    set({ basketList: updatedCart });
  };

  const updateQuantityFunc = (id, quantity) => {
    const userId = get()?.currentUserId;
    if (!userId) return;

    const currentCart = get()?.basketList || [];
    // Создание нового массива с обновленным количеством
    const updatedCart = currentCart.map((item) =>
      item.id === id ? { ...item, cartQuantity: quantity } : item
    );

    // Сохранение в localStorage
    const storageKey = getStorageKey();
    if (storageKey) {
      localStorage?.setItem(storageKey, JSON?.stringify(updatedCart));
    }

    // Обновление состояния
    set({ basketList: updatedCart });
  };

  const removeFromBasketFunc = (id) => {
    const userId = get()?.currentUserId;
    if (!userId) return;

    const currentCart = get()?.basketList || [];

    // Создание нового массива без удаленного товара
    const updatedCart = currentCart.filter((item) => item?.id !== id);

    // Сохранение в localStorage
    const storageKey = getStorageKey();
    if (storageKey) {
      localStorage?.setItem(storageKey, JSON?.stringify(updatedCart));
    }

    // Обновление состояния
    set({ basketList: updatedCart });
  };

  // генерирует уникальный ключ для хранения данных корзины в localStorage 
  const getStorageKey = () => {
    const userId = get()?.currentUserId;
    if (!userId) return null;
    return `basket-list-${userId}`;
  };

  // Инициализация
  // Начальное состояние стора
  // Возвращаемые значения стора (доступны в компонентах через useBasketList())
  return {
    currentUserId: null,
    basketList: [],
    setCurrentUser: setCurrentUserFunc,
    addToBasket: addToBasketFunc,
    updateQuantity: updateQuantityFunc,
    removeFromBasket: removeFromBasketFunc,
    getTotalQuantity: () => {
      const basketList = get()?.basketList || [];
      let totalQuantity = 0;

      if (basketList.length > 0) {
        basketList.forEach((item) => {
          if (item?.cartQuantity) {
            totalQuantity += item?.cartQuantity;
          }
        });
      }
      return totalQuantity;
    },
  };
});
