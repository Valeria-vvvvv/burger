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

 */
export const ProductCard = ({ details }) => {
  // Деструктуризация данных товара для удобства использования
  const { id, name, description, price, weight, image, imgSrc } = details;

  // Хук для программной навигации
  const navigate = useNavigate();

  const handleViewDetails = () => {
    // Переход на страницу детальной информации о товаре
    navigate(`/app/product/${id}`);
  };

  return (
    <div className="product-card">
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

      <div className="product-content">
        <h3 className="product-title">{name}</h3>
        <p className="product-description">{description}</p>
        <div className="product-footer">
          <div className="product-info">
            <span className="product-price">{price} ₽</span>
            <span className="product-weight">{weight}</span>
          </div>
          <div className="product-actions">
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
