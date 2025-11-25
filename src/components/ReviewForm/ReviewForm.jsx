import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { addReviewToProduct } from "../../services/reviewsService";
import "./ReviewForm.css";

export const ReviewForm = ({ productId, onReviewAdded }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    message: "",
    rating: "5",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      alert("Войдите, чтобы оставить отзыв");
      return;
    }

    setLoading(true);
    try {
      const reviewData = {
        userName: user.displayName || user.email,
        message: formData.message,
        rating: formData.rating,
      };

      await addReviewToProduct(productId, reviewData);

      // Очищаем форму
      setFormData({ message: "", rating: "5" });

      // Уведомляем родительский компонент
      if (onReviewAdded) {
        onReviewAdded();
      }
    } catch (error) {
      alert("Ошибка при добавлении отзыва");
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
        <label htmlFor="rating">Оценка</label>
        <select
          id="rating"
          name="rating"
          value={formData.rating}
          onChange={handleChange}
          className="form-select"
        >
          <option value="5">⭐⭐⭐⭐⭐ Отлично</option>
          <option value="4">⭐⭐⭐⭐ Хорошо</option>
          <option value="3">⭐⭐⭐ Нормально</option>
          <option value="2">⭐⭐ Плохо</option>
          <option value="1">⭐ Ужасно</option>
        </select>
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

      <button type="submit" className="button submit-button" disabled={loading}>
        {loading ? "Отправка..." : "Отправить отзыв"}
      </button>
    </form>
  );
};
