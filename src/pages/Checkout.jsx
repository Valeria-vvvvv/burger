import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useBasketList } from "../store/useBasketList";
import { OrderConfirmModal } from "../components/ui/OrderConfirmModal.jsx";
import { logEvent } from "firebase/analytics";
import { analytics } from "../../firebase.js";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../firebase.js";
import "./Checkout.css";

export const Checkout = () => {
  const navigate = useNavigate();
  const basketItems = useBasketList((state) => state.basketList);
  const clearBasket = useBasketList((state) => state.clearBasket);

  const [formData, setFormData] = useState({
    address: "",
    paymentMethod: "card",
    comment: "",
    allowContact: true,
    phone: "",
  });
  const [showModal, setShowModal] = useState(false);
  const [errors, setErrors] = useState({});

  const totalPrice = basketItems.reduce(
    (total, item) => total + item.price * item.cartQuantity,
    0
  );

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Очищаем ошибку при изменении поля
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: "",
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      // Создание заказа
      const orderData = {
        items: basketItems,
        totalPrice,
        customerInfo: {
          address: formData.address,
          phone: formData.phone,
          paymentMethod: formData.paymentMethod,
          comment: formData.comment,
          allowContact: formData.allowContact,
        },
        status: "pending",
        createdAt: new Date(),
      };

      // Сохранение в Firestore
      await addDoc(collection(db, "orders"), orderData);

      // Трекинг события заказа
      logEvent(analytics, "order_placed", {
        value: totalPrice,
        currency: "RUB",
        items: basketItems.map((item) => ({
          item_id: item.id,
          item_name: item.name,
          price: item.price,
          quantity: item.cartQuantity,
        })),
      });

      // Показываем модальное окно подтверждения
      setShowModal(true);
    } catch (error) {
      console.error("Ошибка при оформлении заказа:", error);
      // Здесь можно добавить уведомление об ошибке
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Валидация адреса
    if (!formData.address.trim()) {
      newErrors.address = "Адрес доставки обязателен";
    }

    // Валидация телефона (российский формат)
    const phoneRegex =
      /^(\+7|8)?[\s\-]?\(?[0-9]{3}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/;
    if (!formData.phone.trim()) {
      newErrors.phone = "Номер телефона обязателен";
    } else if (!phoneRegex.test(formData.phone.replace(/\s/g, ""))) {
      newErrors.phone = "Введите корректный номер телефона";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleModalClose = () => {
    setShowModal(false);
    clearBasket();
    navigate("/app/home");
  };

  if (basketItems.length === 0) {
    return (
      <section className="checkout-page">
        <div className="container">
          <h1 className="page-title common-title">Оформление заказа</h1>
          <div className="empty-checkout">
            <p>Корзина пуста. Добавьте товары для оформления заказа.</p>
            <button
              className="button"
              onClick={() => navigate("/app/products")}
            >
              Перейти к меню
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="checkout-page">
      <div className="container">
        <h1 className="page-title common-title">Оформление заказа</h1>

        <div className="checkout-content">
          <div className="order-summary">
            <h2>Ваш заказ</h2>
            <div className="order-items">
              {basketItems.map((item) => (
                <div key={item.id} className="order-item">
                  <img src={`/images/${item.image}`} alt={item.name} />
                  <div className="item-info">
                    <h3>{item.name}</h3>
                    <p>
                      {item.cartQuantity} × {item.price} ₽
                    </p>
                  </div>
                  <div className="item-total">
                    {item.price * item.cartQuantity} ₽
                  </div>
                </div>
              ))}
            </div>
            <div className="order-total">
              <strong>Итого: {totalPrice} ₽</strong>
            </div>
          </div>

          <form className="checkout-form" onSubmit={handleSubmit}>
            <h2>Данные для доставки</h2>

            <div className="form-group">
              <label htmlFor="address">Адрес доставки *</label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Введите адрес доставки"
                className={errors.address ? "error" : ""}
                required
              />
              {errors.address && (
                <span className="error-message">{errors.address}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="phone">Номер телефона *</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Введите номер телефона"
                className={errors.phone ? "error" : ""}
                required
              />
              {errors.phone && (
                <span className="error-message">{errors.phone}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="paymentMethod">Способ оплаты</label>
              <select
                id="paymentMethod"
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleChange}
              >
                <option value="card">Банковская карта</option>
                <option value="cash">Наличными</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="comment">Комментарий к заказу</label>
              <textarea
                id="comment"
                name="comment"
                value={formData.comment}
                onChange={handleChange}
                placeholder="Дополнительные пожелания к заказу"
              />
            </div>

            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="allowContact"
                  checked={formData.allowContact}
                  onChange={(e) =>
                    setFormData({ ...formData, allowContact: e.target.checked })
                  }
                />
                Связаться с вами
              </label>
            </div>

            <div className="form-actions">
              <button type="submit" className="button primary">
                Подтвердить заказ
              </button>
              <button
                type="button"
                className="button secondary"
                onClick={() => navigate("/app/basket")}
              >
                Вернуться в корзину
              </button>
            </div>
          </form>
        </div>
      </div>

      <OrderConfirmModal isOpen={showModal} onClose={handleModalClose} />
    </section>
  );
};
