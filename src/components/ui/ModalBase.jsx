import React, { useEffect } from "react";
import "./ModalBase.css";

/**
 * Базовый компонент модального окна
 * Переиспользуемый компонент для создания модальных окон с единым стилем
 *
 * @param {boolean} isOpen - состояние открытия модального окна
 * @param {function} onClose - функция закрытия модального окна
 * @param {string} title - заголовок модального окна (опционально)
 * @param {React.ReactNode} children - содержимое модального окна
 * @param {string} className - дополнительные CSS классы для modal-content
 *
 * Возможности:
 * - Закрытие по клику на overlay
 * - Закрытие по нажатию Escape
 * - Блокировка скролла страницы при открытии
 * - Кнопка закрытия (×)
 * - Настраиваемые стили через className
 */
export const ModalBase = ({
  isOpen,
  onClose,
  title,
  children,
  className = "",
}) => {
  /**
   * Обработчик клика по overlay (затемненной области)
   * Закрывает модальное окно только при клике именно на overlay,
   * а не на содержимое модального окна
   */
  const handleOverlayClick = (e) => {
    // Проверяем, что клик был именно по overlay, а не по дочернему элементу
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  /**
   * Эффект для обработки клавиши Escape и блокировки скролла
   * Выполняется при изменении состояния isOpen или функции onClose
   */
  useEffect(() => {
    /**
     * Обработчик нажатия клавиши Escape
     * Закрывает модальное окно при нажатии Escape
     */
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    // Если модальное окно открыто
    if (isOpen) {
      // Добавляем обработчик клавиши Escape
      document.addEventListener("keydown", handleEscape);
      // Блокируем скролл страницы
      document.body.style.overflow = "hidden";
    }

    // Функция очистки эффекта
    return () => {
      // Удаляем обработчик клавиши Escape
      document.removeEventListener("keydown", handleEscape);
      // Восстанавливаем скролл страницы
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  // Если модальное окно закрыто, не рендерим ничего
  if (!isOpen) return null;

  return (
    // Затемненный фон модального окна (overlay)
    <div className="modal-overlay" onClick={handleOverlayClick}>
      {/* Контейнер содержимого модального окна */}
      <div className={`modal-content ${className}`}>
        {/* Кнопка закрытия модального окна */}
        <button className="modal-close" onClick={onClose}>
          &times;
        </button>

        {/* Заголовок модального окна (отображается только если передан) */}
        {title && <h2 className="modal-title">{title}</h2>}

        {/* Содержимое модального окна */}
        {children}
      </div>
    </div>
  );
};
