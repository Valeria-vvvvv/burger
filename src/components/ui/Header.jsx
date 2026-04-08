import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useBasketList } from "../../store/useBasketList";
import { useAuth } from "../../hooks/useAuth";
import { useDisclosure } from "../../hooks/useDisclosure";
import { ModalBase } from "./ModalBase.jsx";
import { ConfirmModal } from "./ConfirmModal.jsx";
import { Login } from "../Auth/Login.jsx";
// Используем путь из public папки
const logo = "/images/Logo.png";
import "./Header.css";

/** Пункты меню в шапке */
const NAV_ITEMS = [
  { name: "Главная", path: "/app/home" },
  { name: "Меню бургеров", path: "/app/products" },
  { name: "Отзывы", path: "/app/reviews" },
  { name: "Admin", path: "/app/admin" },
];

export const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  // Для получения общего количества товаров в корзине
  const basketList = useBasketList((state) => state.basketList);
  const totalQuantity = basketList.reduce(
    (total, item) => total + (item?.cartQuantity || 0),
    0,
  );

  // Достаем данные о пользователе
  const { user, onLogout } = useAuth();

  // Модальное окно входа
  const {
    isOpen: isLoginOpen,
    onOpen: onLoginOpen,
    onClose: onLoginClose,
  } = useDisclosure();

  // Модальное окно подтверждения выхода
  const {
    isOpen: isLogoutOpen,
    onOpen: onLogoutOpen,
    onClose: onLogoutClose,
  } = useDisclosure();

  const handleLoginClick = () => {
    onLoginOpen();
  };

  const handleLogoutClick = () => {
    onLogoutOpen();
  };

  const handleConfirmLogout = async () => {
    await onLogout();
    onLogoutClose();
  };

  return (
    <>
      <header className="header">
        <div className="container">
          <Link to="/app/home" className="logo">
            <img src={logo} alt="Burger Cheddar" />
          </Link>

          {/* Навигация — десктоп */}
          <nav className="navigation">
            <ul className="navigation-list">
              {NAV_ITEMS?.map((item) => {
                if (item.path === "/app/admin" && user?.role !== "admin")
                  return null;
                return (
                  <li key={item.name} className="navigation-item">
                    <Link
                      to={item.path}
                      className={`navigation-link ${location.pathname === item.path ? "active" : ""}`}
                    >
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Действия пользователя */}
          <div className="user-actions">
            <Link to="/app/basket" className="basket-link">
              <div className="basket-icon">
                🛒
                {totalQuantity > 0 && (
                  <span className="basket-count">{totalQuantity}</span>
                )}
              </div>
            </Link>

            {user ? (
              <div className="user-profile">
                <img
                  src={user?.photoURL || "/assets/auth/avatar.jpeg"}
                  alt="User"
                  className="user-avatar"
                  onClick={() => navigate("/app/profile")}
                  title="Перейти в профиль"
                />
                <button
                  className="button logout-button"
                  onClick={handleLogoutClick}
                >
                  Выйти
                </button>
              </div>
            ) : (
              <button
                className="button login-button"
                onClick={handleLoginClick}
              >
                Войти
              </button>
            )}
          </div>

          {/* Кнопка бургер-меню (только мобильные) */}
          <button
            className={`burger-btn ${menuOpen ? "open" : ""}`}
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Открыть меню"
          >
            <span />
            <span />
            <span />
          </button>
        </div>

        {/* Мобильное меню */}
        {menuOpen && (
          <nav className="mobile-nav">
            <ul className="mobile-nav-list">
              {NAV_ITEMS.map((item) => {
                if (item.path === "/app/admin" && user?.role !== "admin")
                  return null;
                return (
                  <li key={item.name}>
                    <Link
                      to={item.path}
                      className={`navigation-link ${location.pathname === item.path ? "active" : ""}`}
                      onClick={() => setMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  </li>
                );
              })}
              <li>
                <Link
                  to="/app/basket"
                  className="navigation-link"
                  onClick={() => setMenuOpen(false)}
                >
                  Корзина {totalQuantity > 0 && `(${totalQuantity})`}
                </Link>
              </li>
              {user ? (
                <li>
                  <button
                    className="button logout-button"
                    onClick={() => {
                      handleLogoutClick();
                      setMenuOpen(false);
                    }}
                  >
                    Выйти
                  </button>
                </li>
              ) : (
                <li>
                  <button
                    className="button login-button"
                    onClick={() => {
                      handleLoginClick();
                      setMenuOpen(false);
                    }}
                  >
                    Войти
                  </button>
                </li>
              )}
            </ul>
          </nav>
        )}
      </header>

      {/* Модальное окно входа */}
      <ModalBase isOpen={isLoginOpen} onClose={onLoginClose}>
        <Login />
      </ModalBase>

      {/* Модальное окно подтверждения выхода */}
      <ConfirmModal
        isOpen={isLogoutOpen}
        onClose={onLogoutClose}
        onConfirm={handleConfirmLogout}
        title="Подтверждение выхода"
        message="Вы уверены, что хотите выйти из аккаунта?"
      />
    </>
  );
};
