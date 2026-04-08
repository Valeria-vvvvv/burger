import React from "react";
import "./OrderConfirmModal.css";

export const OrderConfirmModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content order-confirm-modal">
        <button className="modal-close" onClick={onClose}>
          ×
        </button>
        
        <div className="order-confirm-content">
          <div className="order-confirm-icon">
            ✓
          </div>
          
          <h2 className="order-confirm-title">
            Заказ принят!
          </h2>
          
          <p className="order-confirm-text">
            Спасибо за ваш заказ! Наш курьер приедет к вам в течение часа.
          </p>
          
          <button className="button order-confirm-button" onClick={onClose}>
            Понятно
          </button>
        </div>
      </div>
    </div>
  );
};