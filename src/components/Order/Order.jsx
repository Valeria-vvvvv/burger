import React, { useState } from "react";
import "./Order.css";
import orderImage from "../../assets/img/order_image.png";

export const Order = () => {
  const [formData, setFormData] = useState({
    burger: "",
    name: "",
    phone: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Убираем ошибку при вводе
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: false,
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.burger.trim()) {
      newErrors.burger = true;
    }

    if (!formData.name.trim()) {
      newErrors.name = true;
    }

    if (!formData.phone.trim()) {
      newErrors.phone = true;
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = validateForm();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Успешная отправка
    setFormData({ burger: "", name: "", phone: "" });
    setErrors({});
  };

  return (
    <section className="order" id="order">
      <div className="container">
        <div className="order-title common-title">оформление заказа</div>

        <div className="order-content">
          <img
            src={orderImage}
            alt="Burger in the box"
            className="order-image"
          />

          <div className="order-form">
            <div className="order-form-text">
              Заполните все данные и наш менеджер свяжется с вами для
              подтверждения заказа
            </div>

            <form onSubmit={handleSubmit} className="order-form-inputs">
              <div
                className={`order-form-input ${errors.burger ? "error" : ""}`}
              >
                <input
                  type="text"
                  placeholder="Ваш заказ"
                  name="burger"
                  value={formData.burger}
                  onChange={handleChange}
                />
              </div>

              <div className={`order-form-input ${errors.name ? "error" : ""}`}>
                <input
                  type="text"
                  placeholder="Ваше имя"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              <div
                className={`order-form-input ${errors.phone ? "error" : ""}`}
              >
                <input
                  type="tel"
                  placeholder="Ваш телефон"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>

              <button type="submit" className="button order-button">
                Оформить заказ
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
