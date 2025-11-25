import { useRef, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import "./Drawer.css";

/**
 * @param {React.ReactNode} props.children - Дочерние элементы
 * @param {boolean} prop.isOpen - Компонент открыт или закрыт
 * @param {() => void} prop.onClose - Функция закрытия меню
 * @param {"left" | "right"} prop.align - Выравнивание меню
 * @param {string} prop.title - Заголовок
 * @param {React.ReactNode} props.footerContent - Подвал компонента
 */
export const Drawer = ({
  children,
  isOpen,
  onClose,
  align = "right",
  title,
  footerContent,
}) => {
  // Создаем ссылку на DOM-элемент
  const drawerRef = useRef(null);

  // Обработчик клика за пределами
  const handleOutsideClick = useCallback(
    (event) => {
      if (drawerRef?.current && !drawerRef?.current?.contains(event?.target)) {
        // Проверяем, не кликнули ли мы внутри Modal (который может быть открыт поверх)
        const modalElement = document.querySelector("[data-modal-overlay]");
        if (modalElement && modalElement.contains(event?.target)) {
          return; // Не закрываем Drawer если клик внутри Modal
        }
        // Закрываем только Drawer
        event?.stopPropagation();
        onClose();
      }
    },
    [onClose]
  );

  // Обработчик нажатия клавиши Esc
  const handleKeyPress = useCallback(
    (event) => {
      if (event?.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document?.addEventListener("mousedown", handleOutsideClick, true);
      document?.addEventListener("keydown", handleKeyPress);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document?.removeEventListener("mousedown", handleOutsideClick, true);
      document?.removeEventListener("keydown", handleKeyPress);
      // document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose, handleOutsideClick, handleKeyPress]);

  return (
    isOpen &&
    createPortal(
      <div className="drawer-overlay">
        <aside
          ref={drawerRef}
          onMouseDown={(e) => e.stopPropagation()}
          className={`drawer ${
            align === "right" ? "drawer-right" : "drawer-left"
          }`}
        >
          <header className="drawer-header">
            {title && <h2 className="drawer-title">{title}</h2>}
            <button onClick={onClose} className="drawer-close">
              &times;
            </button>
          </header>
          <main className="drawer-content">{children}</main>
          {footerContent && (
            <footer className="drawer-footer">{footerContent}</footer>
          )}
        </aside>
      </div>,
      document.body
    )
  );
};
