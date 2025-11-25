import React, { useState } from "react";
import { ModalBase } from "../shared/ModalBase.jsx";
import "./Modal.css";

export const Modal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validatePhone = (phone) => {
    const phonePattern = /^\+?\d{10,15}$/;
    return phonePattern.test(phone);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validatePhone(formData.phone)) {
      return;
    }

    // Регистрация успешна
    setFormData({ name: "", email: "", phone: "", password: "" });
    onClose();
  };

  return (
    <ModalBase isOpen={isOpen} onClose={onClose} title="Регистрация">
      <form onSubmit={handleSubmit} className="modal-form">
        <div className="form-group">
          <label htmlFor="name">Имя:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="phone">Телефон:</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Пароль:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="button modal-submit">
          Отправить
        </button>
      </form>
    </ModalBase>
  );
};
