import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useBasketList } from "../store/useBasketList";
import { useProducts } from "../store/useProducts";
import { burgerImages } from "../assets/imageImports";
import { ReviewForm } from "../components/ReviewForm/ReviewForm";
import { ReviewsList } from "../components/ReviewsList/ReviewsList";
import "./ProductDetails.css";

/**
 * Страница детальной информации о товаре
 * Отображает подробную информацию о выбранном бургере с возможностью добавления в корзину
 *
 * Возможности:
 * - Подробная информация о товаре (название, описание, цена, вес)
 * - Большое изображение товара
 * - Кнопки управления количеством (+ и -)
 * - Добавление товара в корзину
 * - Навигация назад к каталогу
 * - Отображение текущего количества товара в корзине
 *
 * @returns {JSX.Element} - компонент страницы детальной информации о товаре
 */
export const ProductDetails = () => {
  // Получение ID товара из URL параметров
  const { id } = useParams();
  const navigate = useNavigate();

  // Получение функций из basketStore
  const addToBasket = useBasketList((state) => state.addToBasket);
  const currentUserId = useBasketList((state) => state.currentUserId);

  // Получение продуктов из Firebase
  const { products, getProducts } = useProducts();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    getProducts();
  }, []);

  useEffect(() => {
    if (products.length > 0) {
      const foundProduct = products.find((p) => p.id === id);
      setProduct(foundProduct);
    }
  }, [products, id]);

  // Обработчик после добавления отзыва
  const handleReviewAdded = () => {
    getProducts(); // Перезагружаем продукты чтобы получить новый отзыв
  };

  // Если товар не найден, показываем сообщение об ошибке
  if (!product) {
    return (
      <section className="product-details-page">
        <div className="container">
          <div className="product-not-found">
            <h1>Товар не найден</h1>
            <p>К сожалению, запрашиваемый товар не существует.</p>
            <Link to="/app/products" className="button">
              Вернуться к каталогу
            </Link>
          </div>
        </div>
      </section>
    );
  }

  /**
   * Обработчик добавления товара в корзину с переходом в корзину
   * Добавляет товар в корзину и перенаправляет пользователя на страницу корзины
   *
   * @returns {void}
   */
  const handleAddToBasketAndGo = () => {
    if (!currentUserId) {
      alert("Пожалуйста, войдите в систему для добавления товаров в корзину");
      return;
    }
    addToBasket(product);
    // Переход в корзину после добавления товара
    navigate("/app/basket");
  };

  /**
   * Обработчик возврата к каталогу
   * Использует navigate для программного перехода назад
   *
   * @returns {void}
   */
  const handleGoBack = () => {
    navigate("/app/products");
  };

  return (
    <section className="product-details-page">
      <div className="container">
        {/* Кнопка возврата к каталогу */}
        <button className="back-button" onClick={handleGoBack}>
          ← Назад к каталогу
        </button>

        <div className="product-details-content">
          {/* Изображение товара */}
          <div className="product-details-image">
            <img
              src={burgerImages[product.image]}
              alt={product.name}
              className="product-image"
            />
          </div>

          {/* Информация о товаре */}
          <div className="product-details-info">
            <h1 className="product-title">{product.name}</h1>

            <div className="product-meta">
              <span className="product-price">{product.price} ₽</span>
              <span className="product-weight">{product.weight}</span>
            </div>

            <div className="product-description">
              <h3>Описание</h3>
              <p>{product.description}</p>
            </div>

            {/* КБЖУ товара */}
            <div className="product-nutrition">
              <h3>Пищевая ценность на 100г</h3>
              <div className="nutrition-grid">
                <div className="nutrition-item">
                  <span className="nutrition-label">Калории</span>
                  <span className="nutrition-value">
                    {product.nutrition.calories} ккал
                  </span>
                </div>
                <div className="nutrition-item">
                  <span className="nutrition-label">Белки</span>
                  <span className="nutrition-value">
                    {product.nutrition.proteins} г
                  </span>
                </div>
                <div className="nutrition-item">
                  <span className="nutrition-label">Жиры</span>
                  <span className="nutrition-value">
                    {product.nutrition.fats} г
                  </span>
                </div>
                <div className="nutrition-item">
                  <span className="nutrition-label">Углеводы</span>
                  <span className="nutrition-value">
                    {product.nutrition.carbs} г
                  </span>
                </div>
              </div>
            </div>

            {/* Добавление в корзину */}
            <div className="product-actions">
              <button
                className="add-to-basket-btn"
                onClick={handleAddToBasketAndGo}
              >
                Добавить в корзину за {product.price} ₽
              </button>
            </div>
          </div>
        </div>

        {/* Отзывы */}
        <div className="product-reviews-section">
          <ReviewsList reviews={product.reviews} />
          <ReviewForm productId={id} onReviewAdded={handleReviewAdded} />
        </div>
      </div>
    </section>
  );
};
