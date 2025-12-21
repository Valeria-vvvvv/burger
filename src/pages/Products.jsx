import { useState, useEffect, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useProducts } from "../store/useProducts";
import { ProductCard } from "../components/ui/ProductCard.jsx";
// Используем путь из public папки
const lupaIcon = "/images/lupa.png";
import "./Products.css";

export const ProductsPage = () => {
  const { products, getProducts } = useProducts();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    getProducts();
  }, []);

  // Фильтрация продуктов по поиску
  const filteredProducts = useMemo(() => {
    return products.filter((item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [products, searchQuery]);

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

  const handleDetails = (id) => navigate(`/app/product/${id}`);

  return (
    <section className="products-page">
      <div className="container">
        <h1 className="page-title common-title">Наше меню</h1>
        <p className="page-description">
          Выберите свой идеальный бургер из нашего разнообразного меню. Все
          бургеры готовятся из свежих ингредиентов и отборной мраморной
          говядины.
        </p>

        {/* Поиск */}
        <div className="search-container">
          <input
            className="search-input"
            type="text"
            placeholder="Поиск по названию..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <img className="search-icon" src={lupaIcon} alt="search" />
        </div>

        {/* Список продуктов */}
        <div className="products-items">
          {filteredProducts.length > 0 &&
            filteredProducts.map((item) => (
              <ProductCard
                key={item.id}
                details={item}
                onCardClick={handleDetails}
              />
            ))}
        </div>

        {searchQuery && filteredProducts.length === 0 && (
          <div className="no-results">
            Бургеры не найдены. Попробуйте изменить поисковый запрос.
          </div>
        )}

        {/* Блок отзывов */}
        {allReviews.length > 0 && (
          <div className="reviews-section">
            <div className="reviews-header">
              <h2 className="reviews-section-title">Отзывы наших клиентов</h2>
              <p className="reviews-section-subtitle">
                Узнайте, что говорят наши клиенты о наших бургерах
              </p>
            </div>

            <div className="reviews-grid">
              {allReviews.slice(0, 6).map((review) => (
                <div key={review.id} className="review-card">
                  <div className="review-card-header">
                    <div className="review-user">{review.userName}</div>
                    <div className="review-rating">
                      {"⭐".repeat(review.rating)}
                    </div>
                  </div>
                  <p className="review-message">{review.message}</p>
                  <div className="review-product">
                    Отзыв на: {review.productName}
                  </div>
                </div>
              ))}
            </div>

            <div className="reviews-link-container">
              <Link to="/app/reviews" className="reviews-link">
                Посмотреть все отзывы →
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
