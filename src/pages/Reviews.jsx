import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { useProducts } from "../store/useProducts";
import { useAuth } from "../hooks/useAuth";
import { addReviewToProduct } from "../services/reviewsService";
import "./Reviews.css";

export const Reviews = () => {
  const { products, getProducts } = useProducts();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    productId: "",
    productName: "",
    rating: 0,
    comment: "",
  });
  const [hoveredRating, setHoveredRating] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    getProducts();
  }, []);

  // Собираем все отзывы из всех продуктов
  const allReviews = useMemo(() => {
    return products.flatMap((product) => {
      if (!product.reviews || product.reviews.length === 0) return [];
      return product.reviews.map((review) => ({
        id: review.id,
        userName: review.userName,
        rating: Number.parseFloat(review.rating) ?? 0,
        date: review.date,
        message: review.message,
        productName: product.name,
      }));
    });
  }, [products]);

  // Обработчик изменения значений в форме
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "productId") {
      const selectedProduct = products.find((p) => p.id === value);
      setFormData({
        ...formData,
        productId: value,
        productName: selectedProduct?.name || "",
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  // Обработчик клика по звезде рейтинга
  const handleRatingClick = (rating) => {
    setFormData({
      ...formData,
      rating: rating,
    });
  };

  // Обработчик наведения на звезду
  const handleRatingHover = (rating) => {
    setHoveredRating(rating);
  };

  // Обработчик отведения курсора с звезды рейтинга
  const handleRatingLeave = () => {
    setHoveredRating(0);
  };

  // Обработчик отправки формы
  const handleSubmit = async (e) => {
    e.preventDefault();

    const selectedProduct = products.find(
      ({ id }) => id === formData.productId
    );

    const reviewData = {
      userName: user.displayName || user.email,
      productName: formData.productName,
      message: formData.comment,
      rating: formData.rating.toString(),
      date: new Date().toISOString(),
    };

    const result = await addReviewToProduct(formData.productId, reviewData);

    if (result) {
      // Обновляем список продуктов, чтобы получить обновленные отзывы
      await getProducts();

      // Сброс формы
      setFormData({
        productId: "",
        productName: "",
        rating: 0,
        comment: "",
      });
      setHoveredRating(0);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  // Рендер звезд рейтинга
  const renderStars = (rating, interactive = false) => {
    const displayRating =
      interactive && hoveredRating > 0 ? hoveredRating : rating;
    return (
      <div className="stars-container">
        {Array.from({ length: 5 }, (_, i) => (
          <button
            key={i}
            type={interactive ? "button" : undefined}
            onClick={interactive ? () => handleRatingClick(i + 1) : undefined}
            onMouseEnter={
              interactive ? () => handleRatingHover(i + 1) : undefined
            }
            onMouseLeave={interactive ? handleRatingLeave : undefined}
            className={interactive ? "star-button" : "star-static"}
          >
            <span className={i < displayRating ? "star-filled" : "star-empty"}>
              ⭐
            </span>
          </button>
        ))}
      </div>
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ru-RU", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="reviews-page">
      <div className="container">
        <Link to="/app/products" className="back-link">
          ← Назад к продуктам
        </Link>

        <h1 className="page-title">Отзывы клиентов</h1>

        <div className="reviews-layout">
          {/* Форма добавления отзыва */}
          <div className="review-form-sidebar">
            <div className="review-form-card">
              <h2 className="form-title">Написать отзыв</h2>

              {showSuccess && (
                <div className="success-message">Отзыв успешно добавлен!</div>
              )}

              {!user ? (
                <div className="login-prompt">
                  <p>Войдите, чтобы оставить отзыв</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="review-form">
                  <div className="form-group">
                    <label htmlFor="productId" className="form-label required">
                      Выберите продукт
                    </label>
                    <select
                      name="productId"
                      id="productId"
                      value={formData.productId}
                      onChange={handleChange}
                      className="form-select"
                      required
                    >
                      <option value="">Выберите бургер...</option>
                      {products.map((product) => (
                        <option key={product.id} value={product.id}>
                          {product.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label required">Оценка</label>
                    {renderStars(formData.rating, true)}
                    {formData.rating > 0 && (
                      <span className="rating-text">
                        ({formData.rating} / 5)
                      </span>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="comment" className="form-label required">
                      Ваш отзыв
                    </label>
                    <textarea
                      name="comment"
                      id="comment"
                      rows={5}
                      value={formData.comment}
                      onChange={handleChange}
                      className="form-textarea"
                      placeholder="Поделитесь своим впечатлением..."
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="submit-button"
                    disabled={
                      !formData.productId ||
                      !formData.rating ||
                      !formData.comment
                    }
                  >
                    Отправить отзыв
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Список отзывов */}
          <div className="reviews-list-section">
            <div className="reviews-list-header">
              <h2 className="reviews-list-title">
                Все отзывы ({allReviews.length})
              </h2>
              <p className="reviews-list-subtitle">
                Читайте, что говорят другие клиенты
              </p>
            </div>

            {allReviews.length === 0 ? (
              <div className="no-reviews">
                <p>Пока нет отзывов. Будьте первым!</p>
              </div>
            ) : (
              <div className="reviews-list">
                {allReviews.map((review) => (
                  <div key={review.id} className="review-item">
                    <div className="review-header">
                      <div className="review-user">{review.userName}</div>
                      <div className="review-rating">
                        {"⭐".repeat(review.rating)}
                      </div>
                    </div>
                    <p className="review-message">{review.message}</p>
                    <div className="review-footer">
                      <span className="review-product">
                        {review.productName}
                      </span>
                      <span className="review-date">
                        {formatDate(review.date)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
