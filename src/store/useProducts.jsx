import { create } from "zustand";
import {
  fetchProducts,
  addProductToDB,
  updateProductInDB,
  deleteProductFromDB,
  addReviewToProduct,
} from "../services/productsService";

export const useProducts = create((set) => ({
  products: [],

  // Получает все продукты
  getProducts: async () => {
    try {
      const productsData = await fetchProducts();
      set({ products: productsData });
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  },

  /**
   * Добавляет продукт .
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

  /**
   * Добавляет отзыв к продукту.
   * @param {string} productId - id продукта
   * @param {Object} review - Данные отзыва
   */
  addReview: async (productId, review) => {
    try {
      const updatedProduct = await addReviewToProduct(productId, review);
      set((state) => ({
        products: state.products.map((p) =>
          p.id === productId ? updatedProduct : p
        ),
      }));
      return { success: true };
    } catch (error) {
      console.error("Ошибка при добавлении отзыва:", error);
      return { success: false, error: error.message };
    }
  },
}));
