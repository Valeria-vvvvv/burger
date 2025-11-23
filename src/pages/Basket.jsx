import { useState } from "react";
import { Link } from "react-router-dom";
import { useBasketList } from "../store/useBasketList";
import { burgerImages } from "../assets/imageImports";
import { ConfirmModal } from "../components/ConfirmModal/ConfirmModal";
import "./Basket.css";

/**
 * Страница корзины товаров
 * Отображает список товаров в корзине с возможностью управления количеством
 *
 * Основные возможности:
 * - Отображение всех товаров в корзине
 * - Увеличение/уменьшение количества товаров (кнопки + и -)
 * - Удаление отдельных товаров из корзины
 * - Полная очистка корзины
 * - Подсчет общего количества и стоимости товаров
 * - Переход к оформлению заказа
 * - Отображение пустой корзины с призывом к действию
 *
 * Состояния:
 * - Пустая корзина: отображение сообщения и ссылки на каталог
 * - Заполненная корзина: список товаров с управлением и итоговой информацией
 */
export const BasketPage = () => {
  // Получение данных и функций из Zustand store
  const basketItems = useBasketList((state) => state.basketList);
  const removeFromBasket = useBasketList((state) => state.removeFromBasket);
  const updateQuantity = useBasketList((state) => state.updateQuantity);
  const getTotalQuantity = useBasketList((state) => state.getTotalQuantity);

  // Состояние для модального окна подтверждения
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    productId: null,
    productName: "",
  });

  // Вычисляем значения
  const totalQuantity = getTotalQuantity();
  const totalPrice = basketItems.reduce(
    (total, item) => total + item.price * item.cartQuantity,
    0
  );

  // Открыть модальное окно подтверждения удаления
  const handleRemoveClick = (id, name) => {
    setConfirmModal({
      isOpen: true,
      productId: id,
      productName: name,
    });
  };

  // Подтвердить удаление
  const confirmRemove = () => {
    if (confirmModal.productId) {
      removeFromBasket(confirmModal.productId);
    }
  };

  // Закрыть модальное окно
  const closeConfirmModal = () => {
    setConfirmModal({
      isOpen: false,
      productId: null,
      productName: "",
    });
  };

  // Функция очистки корзины
  const clearBasket = () => {
    basketItems.forEach((item) => removeFromBasket(item.id));
  };

  // Функции управления количеством
  const increaseQuantity = (id) => {
    const item = basketItems.find((item) => item.id === id);
    if (item) {
      updateQuantity(id, item.cartQuantity + 1);
    }
  };

  const decreaseQuantity = (id) => {
    const item = basketItems.find((item) => item.id === id);
    if (item) {
      if (item.cartQuantity <= 1) {
        removeFromBasket(id);
      } else {
        updateQuantity(id, item.cartQuantity - 1);
      }
    }
  };

  if (basketItems.length === 0) {
    return (
      <section className="basket-page">
        <div className="container">
          <h1 className="page-title common-title">Корзина</h1>
          <div className="empty-basket">
            <div className="empty-basket-content">
              <h2>Ваша корзина пуста</h2>
              <p>Добавьте товары из нашего меню, чтобы оформить заказ</p>
              <Link to="/products" className="button">
                Перейти к меню
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="basket-page">
      <div className="container">
        <div className="basket-header">
          <h1 className="page-title common-title">Корзина</h1>
          <div className="basket-summary">
            <button
              className="clear-basket-btn"
              onClick={clearBasket}
              title="Очистить корзину"
            >
              Очистить корзину
            </button>
          </div>
        </div>

        <div className="basket-content">
          <div className="basket-items">
            {basketItems.map((item) => (
              <div key={item.id} className="basket-item">
                <div className="basket-item-image">
                  <img src={burgerImages[item.image]} alt={item.name} />
                </div>

                <div className="basket-item-info">
                  <h3 className="basket-item-name">{item.name}</h3>
                  <p className="basket-item-description">{item.description}</p>
                  <div className="basket-item-weight">{item.weight}</div>
                </div>

                <div className="basket-item-controls">
                  <div className="basket-item-price">
                    <span className="price-per-item">
                      {item.price} ₽ за шт.
                    </span>
                    <div className="quantity-controls">
                      <button
                        className="quantity-btn decrease"
                        onClick={() => decreaseQuantity(item.id)}
                        title="Уменьшить количество"
                      >
                        -
                      </button>
                      <span className="quantity">
                        Количество: {item.cartQuantity}
                      </span>
                      <button
                        className="quantity-btn increase"
                        onClick={() => increaseQuantity(item.id)}
                        title="Увеличить количество"
                      >
                        +
                      </button>
                    </div>
                    <span className="total-price">
                      Итого: {item.price * item.cartQuantity} ₽
                    </span>
                  </div>

                  <button
                    className="remove-item-btn"
                    onClick={() => handleRemoveClick(item.id, item.name)}
                    title="Удалить из корзины"
                  >
                    Удалить
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="basket-footer">
            <div className="basket-total">
              <div className="total-info">
                <div className="total-quantity">
                  Общее количество: <strong>{totalQuantity} шт.</strong>
                </div>
                <div className="total-price">
                  Общая стоимость: <strong>{totalPrice} ₽</strong>
                </div>
              </div>

              <div className="basket-actions">
                <button className="button basket-checkout">
                  Оформить заказ
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={closeConfirmModal}
        onConfirm={confirmRemove}
        title="Удалить товар?"
        message={`Вы уверены, что хотите удалить "${confirmModal.productName}" из корзины?`}
      />
    </section>
  );
};
