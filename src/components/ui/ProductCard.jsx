import { useNavigate } from "react-router-dom";
import "./ProductCard.css";

/**
 * Компонент карточки товара (бургера)
 * Отображает информацию о товаре и кнопку добавления в корзину
 *
 * @param {Object} details - объект с данными о товаре
 * @param {string} details.id - уникальный идентификатор товара
 * @param {string} details.name - название товара
 * @param {string} details.description - описание товара
 * @param {number} details.price - цена товара в рублях
 * @param {string} details.weight - вес товара
 * @param {string} details.image - имя файла изображения товара
 * @param {function} onAddToBasket - функция добавления товара в корзину
 *
 * Особенности:
 * - Динамическая загрузка изображений с обработкой ошибок
 * - Hover-эффекты для улучшения UX
 * - Адаптивный дизайн для мобильных устройств
 * - Валидация функции onAddToBasket
 */
export const ProductCard = ({ details }) => {
  // Деструктуризация данных товара для удобства использования
  const { id, name, description, price, weight, image, imgSrc } = details;

  // Хук для программной навигации
  const navigate = useNavigate();


  /**
   * Обработчик перехода к детальной странице товара
   * Использует navigate для перехода на страницу ProductDetails с ID товара
   *
   * @returns {void} - функция не возвращает значение
   *
   * @example
   * // При клике на кнопку "В корзину" вызывается:
   * handleViewDetails(); // Переходит на страницу /app/product/1
   */
  const handleViewDetails = () => {
    // Переход на страницу детальной информации о товаре
    navigate(`/app/product/${id}`);
  };

  return (
    // Основной контейнер карточки товара
    <div className="product-card">
      {/* Контейнер изображения товара */}
      <div className="product-image">
        <img
          src={imgSrc || `/images/${image}`} // Используем imgSrc из Firebase или локальное изображение
          alt={name} // Альтернативный текст для доступности
          onError={(e) => {
            // Скрытие изображения при ошибке загрузки
            e.target.style.display = "none";
          }}
        />
      </div>

      {/* Контейнер текстового содержимого */}
      <div className="product-content">
        {/* Название товара */}
        <h3 className="product-title">{name}</h3>

        {/* Описание товара */}
        <p className="product-description">{description}</p>

        {/* Нижняя часть карточки с ценой и кнопкой */}
        <div className="product-footer">
          {/* Информация о товаре (цена и вес) */}
          <div className="product-info">
            <span className="product-price">{price} ₽</span>
            <span className="product-weight">{weight}</span>
          </div>

          {/* Контейнер для кнопок действий */}
          <div className="product-actions">
            {/* Кнопка перехода к детальной странице товара */}
            <button
              className="product-button btn-primary"
              onClick={handleViewDetails}
            >
              Подробнее
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
