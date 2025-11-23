import { ModalBase } from "../shared/ModalBase.jsx";
import { burgerImages } from "../../assets/imageImports";
import "./BasketModal.css";

export const BasketModal = ({
  isOpen,
  onClose,
  basketItems,
  removeFromBasket,
  getTotalPrice,
  increaseQuantity,
  decreaseQuantity,
}) => {
  return (
    <ModalBase
      isOpen={isOpen}
      onClose={onClose}
      title="Корзина"
      className="basket-modal"
    >
      {basketItems.length === 0 ? (
        <div className="empty-basket">
          <p>Корзина пуста</p>
          <p>Добавьте товары из меню</p>
        </div>
      ) : (
        <>
          <div className="basket-items">
            {basketItems.map((item) => (
              <div key={item.id} className="basket-item">
                <div className="basket-item-image">
                  <img src={burgerImages[item.image]} alt={item.name} />
                </div>
                <div className="basket-item-info">
                  <h3 className="basket-item-name">{item.name}</h3>
                  <div className="basket-item-details">
                    <span className="basket-item-price">{item.price} ₽</span>
                    <div className="quantity-controls">
                      <button
                        className="quantity-btn decrease"
                        onClick={() => decreaseQuantity(item.id)}
                        title="Уменьшить количество"
                      >
                        -
                      </button>
                      <span className="basket-item-quantity">
                        x{item.quantity}
                      </span>
                      <button
                        className="quantity-btn increase"
                        onClick={() => increaseQuantity(item.id)}
                        title="Увеличить количество"
                      >
                        +
                      </button>
                    </div>
                    <span className="basket-item-total">
                      {(item.price * item.quantity).toFixed(0)} ₽
                    </span>
                  </div>
                </div>
                <button
                  className="basket-item-remove"
                  onClick={() => removeFromBasket(item.id)}
                  title="Удалить из корзины"
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          <div className="basket-footer">
            <div className="basket-total">
              <strong>Итого: {getTotalPrice().toFixed(0)} ₽</strong>
            </div>
            <button className="button basket-checkout">Оформить заказ</button>
          </div>
        </>
      )}
    </ModalBase>
  );
};
