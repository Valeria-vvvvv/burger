import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useProducts } from "../../store/useProducts";
import { useNotification } from "../../contexts/NotificationContext";
import { logEvent } from "firebase/analytics";
import { analytics } from "../../../firebase.js";
import "./ReviewForm.css";

export const ReviewForm = ({ productId, onReviewAdded }) => {
  const { user } = useAuth();
  const { addReview } = useProducts();
  const { showSuccess } = useNotification();

  const [formData, setFormData] = useState({
    message: "",
    rating: 0,
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Обработчик клика по звезде
  const handleRatingClick = (rating) => {
    setFormData({
      ...formData,
      rating: rating,
    });
  };

  // Рендер звезд рейтинга
  const renderStars = (rating) => {
    return (
      <div className="stars-container">
        {Array.from({ length: 5 }, (_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => handleRatingClick(i + 1)}
            className="star-button"
          >
            <span className={i < rating ? "star-filled" : "star-empty"}>
              ⭐
            </span>
          </button>
        ))}
      </div>
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      showSuccess("Войдите, чтобы оставить отзыв");
      return;
    }

    if (!formData.rating) {
      showSuccess("Пожалуйста, выберите оценку");
      return;
    }

    setLoading(true);
    try {
      const reviewData = {
        userName: user.displayName || user.email,
        message: formData.message,
        rating: formData.rating.toString(),
        date: new Date().toISOString(),
      };

      await addReview(productId, reviewData);

      // Трекинг события отзыва
      logEvent(analytics, "review_submitted", {
        product_id: productId,
        rating: formData.rating,
      });

      // Очищаем форму
      setFormData({ message: "", rating: 0 });

      // Показываем уведомление
      showSuccess("Ваш отзыв успешно добавлен!");

      // Уведомляем родительский компонент
      if (onReviewAdded) {
        onReviewAdded();
      }
    } catch (error) {
      console.error("Ошибка при добавлении отзыва:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="review-form-login">
        <p>Войдите, чтобы оставить отзыв</p>
      </div>
    );
  }

  return (
    <form className="review-form" onSubmit={handleSubmit}>
      <h3 className="review-form-title">Оставить отзыв</h3>

      <div className="form-group">
        <label>Оценка *</label>
        {renderStars(formData.rating)}
        {formData.rating > 0 && (
          <span className="rating-text">({formData.rating} / 5)</span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="message">Ваш отзыв</label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          className="form-textarea"
          placeholder="Расскажите о вашем впечатлении..."
          rows="4"
          required
        />
      </div>

      <button
        type="submit"
        className="button submit-button"
        disabled={loading || !formData.rating || !formData.message}
      >
        {loading ? "Отправка..." : "Отправить отзыв"}
      </button>
    </form>
  );
};
