import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useBasketList } from "../store/useBasketList";
import "./User.css";

export const UserPage = () => {
  const { user } = useAuth();
  const basketItems = useBasketList((state) => state.basketList);
  const getTotalQuantity = useBasketList((state) => state.getTotalQuantity);

  // Если пользователь не авторизован, перенаправляем на главную
  if (!user) {
    return <Navigate to="/app/home" replace />;
  }

  const totalQuantity = getTotalQuantity();
  const totalOrders = basketItems.length; // Можно заменить на реальное количество заказов

  return (
    <section className="user-page">
      <div className="container">
        <div className="user-header">
          <h1 className="page-title">Профиль пользователя</h1>
          <p className="page-subtitle">Управление профилем и заказами</p>
        </div>

        <div className="user-content">
          {/* Карточка пользователя */}
          <div className="user-main-card">
            <div className="user-profile-section">
              <img
                src={user?.photoURL || "/assets/auth/avatar.jpeg"}
                alt="User Avatar"
                className="user-avatar-large"
              />
              <div className="user-basic-info">
                <h2 className="user-name">
                  {user?.displayName || "Пользователь"}
                </h2>
                <p className="user-email">{user?.email}</p>
              </div>
            </div>

            {/* Статистика */}
            <div className="user-stats">
              <div className="stat-card">
                <div className="stat-icon">🛒</div>
                <div className="stat-info">
                  <div className="stat-value">{totalQuantity}</div>
                  <div className="stat-label">В корзине</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">📦</div>
                <div className="stat-info">
                  <div className="stat-value">{totalOrders}</div>
                  <div className="stat-label">Заказов</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">⭐</div>
                <div className="stat-info">
                  <div className="stat-value">0</div>
                  <div className="stat-label">Отзывов</div>
                </div>
              </div>
            </div>
          </div>

          {/* Информация об аккаунте */}
          <div className="user-details-card">
            <h3 className="card-title">Информация об аккаунте</h3>
            <div className="user-details-list">
              <div className="detail-item">
                <span className="detail-label">ID пользователя</span>
                <span className="detail-value">{user?.id}</span>
              </div>

              <div className="detail-item">
                <span className="detail-label">Способ входа</span>
                <span className="detail-value">
                  {user?.provider === "google.com"
                    ? "Google"
                    : user?.provider === "github.com"
                    ? "GitHub"
                    : "Email"}
                </span>
              </div>

              <div className="detail-item">
                <span className="detail-label">Роль</span>
                <span className="detail-value">
                  {user?.role === "admin" ? "Администратор" : "Пользователь"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
