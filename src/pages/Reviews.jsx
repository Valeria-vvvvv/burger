import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { useProducts } from "../store/useProducts";
import { useAuth } from "../hooks/useAuth";
import { useNotification } from "../contexts/NotificationContext";
import "./Reviews.css";

export const Reviews = () => {
  const { products, getProducts, addReview } = useProducts();
  const { user } = useAuth();
  const { showSuccess } = useNotification();

  const [formData, setFormData] = useState({
    productId: "",
    productName: "",
    rating: 0,
    comment: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(""); // Фильтр по категории

  useEffect(() => {
    getProducts();
  }, []);

  // Получаем уникальные категории из товаров
  const categories = useMemo(() => {
    const uniqueCategories = [
      ...new Set(products.map((product) => product.category).filter(Boolean)),
    ];
    return uniqueCategories.sort();
  }, [products]);

  // Собираем все отзывы из всех продуктов и сортируем по дате (новые сначала)
  const allReviews = useMemo(() => {
    let filteredProducts = products;

    // Фильтруем товары по выбранной категории
    if (selectedCategory) {
      filteredProducts = products.filter(
        (product) => product.category === selectedCategory
      );
    }

    const reviews = filteredProducts.flatMap((product) => {
      if (!product.reviews || product.reviews.length === 0) return [];
      return product.reviews.map((review) => ({
        id: review.id,
        userName: review.userName,
        rating: Number.parseFloat(review.rating) ?? 0,
        date: review.date,
        message: review.message,
        productName: product.name,
        productCategory: product.category,
      }));
    });

    // Сортируем по дате (новые сначала)
    return reviews.sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [products, selectedCategory]);

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

  // Обработчик отправки формы
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Защита от множественных отправок
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      // Валидация данных перед отправкой
      if (!formData.productId || !formData.rating || !formData.comment) {
        console.error("Не все обязательные поля заполнены");
        return;
      }

      const reviewData = {
        userName: user?.displayName || user?.email || "Гость",
        productName: formData.productName || "Продукт",
        message: formData.comment.trim(),
        rating: Number(formData.rating).toString(),
        date: new Date().toISOString(),
      };

      // Добавляем отзыв через store
      await addReview(formData.productId, reviewData);

      // Сброс формы
      setFormData({
        productId: "",
        productName: "",
        rating: 0,
        comment: "",
      });

      // Показываем уведомление об успехе
      showSuccess("Ваш отзыв успешно добавлен!");
    } catch (error) {
      console.error("Ошибка при отправке отзыва:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Рендер звезд рейтинга
  const renderStars = (rating, interactive = false) => {
    return (
      <div className="stars-container">
        {Array.from({ length: 5 }, (_, i) => (
          <button
            key={i}
            type={interactive ? "button" : undefined}
            onClick={interactive ? () => handleRatingClick(i + 1) : undefined}
            className={interactive ? "star-button" : "star-static"}
          >
            <span className={i < rating ? "star-filled" : "star-empty"}>
              ⭐
            </span>
          </button>
        ))}
      </div>
    );
  };

  // понятное оформление даты
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
                      !formData.comment ||
                      isSubmitting
                    }
                  >
                    {isSubmitting ? "Отправка..." : "Отправить отзыв"}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Список отзывов */}
          <div className="reviews-list-section">
            <div className="reviews-list-header">
              <h2 className="reviews-list-title">
                {selectedCategory
                  ? `Отзывы: ${selectedCategory}`
                  : "Все отзывы"}{" "}
                ({allReviews.length})
              </h2>
              <p className="reviews-list-subtitle">
                Читайте, что говорят другие клиенты
              </p>

              {/* Фильтр по категориям */}
              <div className="category-filter">
                <label htmlFor="categoryFilter" className="filter-label">
                  Фильтр по категории:
                </label>
                <select
                  id="categoryFilter"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="category-select"
                >
                  <option value="">Все категории</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {allReviews.length === 0 ? (
              <div className="no-reviews">
                <p>Пока нет отзывов. Будьте первым!</p>
              </div>
            ) : (
              <div className="reviews-list">
                {allReviews.map((review) => (
                  <div key={review?.id} className="review-item">
                    <div className="review-header">
                      {review?.userName && (
                        <div className="review-user">{review.userName}</div>
                      )}
                      {review?.rating && (
                        <div className="review-rating">
                          {"⭐".repeat(review.rating)}
                        </div>
                      )}
                    </div>
                    {review?.message && (
                      <p className="review-message">{review.message}</p>
                    )}
                    <div className="review-footer">
                      {review?.productName && (
                        <span className="review-product">
                          {review.productName}
                        </span>
                      )}
                      {review?.date && (
                        <span className="review-date">
                          {formatDate(review.date)}
                        </span>
                      )}
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
