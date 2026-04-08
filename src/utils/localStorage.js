/**
 * Сохраняет данные в localStorage
 * @param {string} key - ключ для сохранения
 * @param {any} value - значение для сохранения (будет преобразовано в JSON)
 */
export const setStorageItem = (key, value) => {
  const jsonValue = JSON.stringify(value);
  localStorage.setItem(key, jsonValue);
};

/**
 * Получает данные из localStorage
 * @param {string} key - ключ для получения данных
 */
export const getStorageItem = (key) => {
  const item = localStorage.getItem(key);
  if (!item) return null;
  return JSON.parse(item);
};

/**
 * Удаляет данные из localStorage
 * @param {string} key - ключ для удаления
 */
export const removeStorageItem = (key) => localStorage.removeItem(key);

/**
 * Очищает весь localStorage
 */
export const clearStorage = () => localStorage.clear();
