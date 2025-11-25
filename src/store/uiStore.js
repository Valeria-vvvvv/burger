import { create } from "zustand";

/**
 * ZUSTAND STORE ДЛЯ УПРАВЛЕНИЯ UI СОСТОЯНИЕМ
 * Управляет состоянием модальных окон и уведомлений
 */

export const useUIStore = create((set) => ({
  modals: {
    login: false,
    register: false,
    basket: false,
    order: false,
  },

  notifications: [],

  // ОТКРЫТЬ МОДАЛЬНОЕ ОКНО
  openModal: (modalName) => {
    set((state) => ({
      modals: {
        ...state.modals,
        [modalName]: true,
      },
    }));
  },

  // ЗАКРЫТЬ МОДАЛЬНОЕ ОКНО
  closeModal: (modalName) => {
    set((state) => ({
      modals: {
        ...state.modals,
        [modalName]: false,
      },
    }));
  },

  // УДАЛИТЬ УВЕДОМЛЕНИЕ
  removeNotification: (id) => {
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    }));
  },

  // ПОКАЗАТЬ УСПЕШНОЕ УВЕДОМЛЕНИЕ
  showSuccess: (message, duration = 5000) => {
    const id = Date.now().toString();
    const notification = {
      id,
      type: "success",
      message,
      duration,
    };

    set((state) => ({
      notifications: [...state.notifications, notification],
    }));

    setTimeout(() => {
      set((state) => ({
        notifications: state.notifications.filter((n) => n.id !== id),
      }));
    }, duration);
  },

  // ПОКАЗАТЬ ОШИБКУ
  showError: (message, duration = 5000) => {
    const id = Date.now().toString();
    const notification = {
      id,
      type: "error",
      message,
      duration,
    };

    set((state) => ({
      notifications: [...state.notifications, notification],
    }));

    setTimeout(() => {
      set((state) => ({
        notifications: state.notifications.filter((n) => n.id !== id),
      }));
    }, duration);
  },
}));
