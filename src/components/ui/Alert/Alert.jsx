import React from 'react';
import './Alert.css';

export const Alert = ({ title, subtitle, variant = 'info', isOpen, onClose }) => {
  if (!isOpen) return null;

  const getVariantClass = () => {
    switch (variant) {
      case 'error':
        return 'alert-error';
      case 'success':
        return 'alert-success';
      case 'warning':
        return 'alert-warning';
      default:
        return 'alert-info';
    }
  };

  return (
    <div className={`alert ${getVariantClass()}`}>
      <div className="alert-content">
        {title && <h4 className="alert-title">{title}</h4>}
        {subtitle && <p className="alert-subtitle">{subtitle}</p>}
      </div>
      {onClose && (
        <button className="alert-close" onClick={onClose}>
          ×
        </button>
      )}
    </div>
  );
};