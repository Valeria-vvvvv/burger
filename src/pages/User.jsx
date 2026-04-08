import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useBasketList } from "../store/useBasketList";
import { useNotification } from "../contexts/NotificationContext";
import "./User.css";

export const UserPage = () => {
  const { user, updateUserProfile, changeEmail } = useAuth();
  const basketItems = useBasketList((state) => state.basketList);
  const getTotalQuantity = useBasketList((state) => state.getTotalQuantity);
  const { showSuccess, showError } = useNotification();

  // Состояние для режима редактирования
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Состояние для данных формы
  const [formData, setFormData] = useState({
    displayName: user?.displayName || "",
    email: user?.email || "",
    photoURL: user?.photoURL || "",
  });

  // Если пользователь не авторизован, перенаправляем на главную
  if (!user) {
    return <Navigate to="/app/home" replace />;
  }

  const totalQuantity = getTotalQuantity();
  const totalOrders = basketItems.length; // Можно заменить на реальное количество заказов

  // Обработчик изменения данных формы
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Обработчик начала редактирования
  const handleEditStart = () => {
    setFormData({
      displayName: user?.displayName || "",
      email: user?.email || "",
      photoURL: user?.photoURL || "",
    });
    setIsEditing(true);
  };

  // Обработчик отмены редактирования
  const handleEditCancel = () => {
    setIsEditing(false);
    setFormData({
      displayName: user?.displayName || "",
      email: user?.email || "",
      photoURL: user?.photoURL || "",
    });
  };

  // Обработчик сохранения изменений
  const handleSave = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      // Обновляем профиль (имя и фото)
      if (
        formData.displayName !== user?.displayName ||
        formData.photoURL !== user?.photoURL
      ) {
        const profileResult = await updateUserProfile({
          displayName: formData.displayName.trim(),
          photoURL: formData.photoURL.trim(),
        });

        if (!profileResult.success) {
          showError(profileResult.error);
          return;
        }
      }

      // Обновляем email отдельно (если изменился)
      if (formData.email !== user?.email) {
        const emailResult = await changeEmail(formData.email.trim());

        if (!emailResult.success) {
          showError(emailResult.error);
          return;
        }
      }

      setIsEditing(false);
      showSuccess("Профиль успешно обновлен!");
    } catch (error) {
      console.error("Ошибка при обновлении профиля:", error);
      showError("Произошла ошибка при обновлении профиля");
    } finally {
      setIsSubmitting(false);
    }
  };

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
            {!isEditing ? (
              // Режим просмотра
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
                  <button
                    className="edit-profile-button"
                    onClick={handleEditStart}
                  >
                    ✏️ Редактировать профиль
                  </button>
                </div>
              </div>
            ) : (
              // Режим редактирования
              <form onSubmit={handleSave} className="user-edit-form">
                <div className="form-group">
                  <label htmlFor="photoURL">URL фото профиля</label>
                  <input
                    type="url"
                    id="photoURL"
                    name="photoURL"
                    value={formData.photoURL}
                    onChange={handleChange}
                    placeholder="https://example.com/photo.jpg"
                  />
                  {formData.photoURL && (
                    <img
                      src={formData.photoURL}
                      alt="Preview"
                      className="photo-preview"
                    />
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="displayName">Имя пользователя</label>
                  <input
                    type="text"
                    id="displayName"
                    name="displayName"
                    value={formData.displayName}
                    onChange={handleChange}
                    placeholder="Введите ваше имя"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Введите email"
                    required
                  />
                </div>

                <div className="form-actions">
                  <button
                    type="submit"
                    className="save-button"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Сохранение..." : "💾 Сохранить"}
                  </button>
                  <button
                    type="button"
                    className="cancel-button"
                    onClick={handleEditCancel}
                    disabled={isSubmitting}
                  >
                    ❌ Отмена
                  </button>
                </div>
              </form>
            )}

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
