/**
 * ЦЕНТРАЛЬНЫЙ ЭКСПОРТ ВСЕХ ZUSTAND STORES
 *
 * Удобный импорт всех stores из одного места
 */

export { useAuthStore } from "./authStore.js";
export { useUIStore } from "./uiStore.js";
export { useBasketList } from "./useBasketList.jsx";
export { useProducts } from "./useProducts.jsx";

// Селекторы для корзины с привязкой к пользователю
export const basketSelectors = {
  basketList: (state) => state.basketList,
  currentUserId: (state) => state.currentUserId,
  totalQuantity: (state) => state.getTotalQuantity(),
  totalPrice: (state) =>
    state.basketList.reduce(
      (total, item) => total + item.price * item.cartQuantity,
      0
    ),
  addToBasket: (state) => state.addToBasket,
  removeFromBasket: (state) => state.removeFromBasket,
  updateQuantity: (state) => state.updateQuantity,
  getTotalQuantity: (state) => state.getTotalQuantity,
};

export const authSelectors = {
  user: (state) => state.user,
  loading: (state) => state.loading,
  error: (state) => state.error,
  signInWithGoogle: (state) => state.signInWithGoogle,
  signInWithGithub: (state) => state.signInWithGithub,
  signOut: (state) => state.signOut,
};

export const uiSelectors = {
  modals: (state) => state.modals,
  openModal: (state) => state.openModal,
  closeModal: (state) => state.closeModal,
  notifications: (state) => state.notifications,
  removeNotification: (state) => state.removeNotification,
  showSuccess: (state) => state.showSuccess,
  showError: (state) => state.showError,
};

export const productsSelectors = {
  products: (state) => state.products,
  loading: (state) => state.loading,
  error: (state) => state.error,
  getProducts: (state) => state.getProducts,
  addProduct: (state) => state.addProduct,
  updateProduct: (state) => state.updateProduct,
  deleteProduct: (state) => state.deleteProduct,
  clearError: (state) => state.clearError,
};
