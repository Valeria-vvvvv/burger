import { create } from "zustand";
import {
  fetchProducts,
  addProductToDB,
  updateProductInDB,
  deleteProductFromDB,
} from "../services/productsService";

export const useProducts = create((set) => ({
  products: [],
  loading: false,
  error: null,

  // Получает все продукты
  getProducts: async () => {
    set({ loading: true, error: null });
    try {
      const productsData = await fetchProducts();
      set({ products: productsData, loading: false });
      console.log("Загружено продуктов:", productsData.length);
      console.log("Список продуктов:", productsData);
    } catch (error) {
      console.error("Error fetching products:", error);
      set({ error: error.message, loading: false });
    }
  },

  /**
   * Добавляет продукт.
   * @param {Object} form - Данные продукта
   */
  addProduct: async (form) => {
    try {
      const product = await addProductToDB(form);
      set((state) => ({
        products: [...state.products, product],
      }));
    } catch (error) {
      console.error("Ошибка при добавлении продукта:", error);
    }
  },

  /**
   * Обновляет продукт.
   * @param {Object} form - Данные продукта (с id)
   */
  updateProduct: async (form) => {
    try {
      const product = await updateProductInDB(form);
      set((state) => ({
        products: state.products.map((p) =>
          p.id === product.id ? product : p
        ),
      }));
    } catch (error) {
      console.error("Ошибка при обновлении продукта:", error);
    }
  },

  /**
   * Удаляет продукт.
   * @param {string} productId - id продукта
   */
  deleteProduct: async (productId) => {
    if (!productId) return;

    try {
      await deleteProductFromDB(productId);
      set((state) => ({
        products: state.products.filter((p) => p.id !== productId),
      }));
    } catch (error) {
      console.error("Ошибка при удалении:", error);
    }
  },
}));
