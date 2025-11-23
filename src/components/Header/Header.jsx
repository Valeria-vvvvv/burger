import React from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useBasketList } from "../../store/useBasketList";
import { useAuth } from "../../hooks/useAuth";
import { useDisclosure } from "../../hooks/useDisclosure";
import { ModalBase } from "../shared/ModalBase";
import { ConfirmModal } from "../ConfirmModal/ConfirmModal";
import { Login } from "../Auth/Login";
import logo from "../../assets/img/Logo.png";
import "./Header.css";

/** Пункты меню в шапке */
const NAV_ITEMS = [
  { name: "Главная", path: "/app/home" },
  { name: "Меню бургеров", path: "/app/products" },
  { name: "Отзывы", path: "/app/reviews" },
  { name: "Admin", path: "/app/admin" },
];

export const Header = () => {
  // Для получения данных из адресной строки
  const location = useLocation();
  // Для перехода между страницами
  const navigate = useNavigate();

  // Для получения общего количества товаров в корзине
  const getTotalQuantity = useBasketList((state) => state.getTotalQuantity);
  const totalQuantity = getTotalQuantity();

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

          {/* Навигация */}
          <nav className="navigation">
            <ul className="navigation-list">
              {NAV_ITEMS?.length > 0 &&
                NAV_ITEMS?.map((item) => {
                  return (
                    <li key={item?.name} className="navigation-item">
                      <Link
                        to={item?.path}
                        className={`navigation-link ${
                          location?.pathname === item?.path ? "active" : ""
                        }`}
                      >
                        {item?.name}
                      </Link>
                    </li>
                  );
                })}
            </ul>
          </nav>

          {/* Действия пользователя */}
          <div className="user-actions">
            {/* Корзина */}
            <Link to="/app/basket" className="basket-link">
              <div className="basket-icon">
                🛒
                {totalQuantity > 0 && (
                  <span className="basket-count">{totalQuantity}</span>
                )}
              </div>
            </Link>

            {/* Кнопка входа или профиль пользователя */}
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
        </div>
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
