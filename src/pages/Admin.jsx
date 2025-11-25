import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { Table } from "../components/Table/Table";
import { Drawer } from "../components/Drawer/Drawer";
import { useDisclosure } from "../hooks/useDisclosure";
import { useProducts } from "../store/useProducts";
import { useAuth } from "../hooks/useAuth";
import "./Admin.css";

const HEADERS = [
  { name: "Название", key: "name" },
  { name: "Описание", key: "description" },
  { name: "Категория", key: "category" },
  { name: "Цена", key: "price" },
  { name: "Вес", key: "weight" },
];

export const Admin = () => {
  // Проверка авторизации
  const { user } = useAuth();

  // Состояние для данных таблицы
  const { products, getProducts, addProduct, updateProduct, deleteProduct } =
    useProducts();

  // Режим добавления/редактирования/просмотра
  const [mode, setMode] = useState("add");

  // Состояние для данных формы
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    weight: "",
  });

  // Состояние для открытия Drawer
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Состояние для модалки
  const {
    isOpen: isModalOpen,
    onOpen: onModalOpen,
    onClose: onModalClose,
  } = useDisclosure();

  // Состояние для показа/скрытия уведомления
  const [alert, setAlert] = useState({
    isOpen: false,
    variant: "", // success | info | warning | error
    title: "",
    subtitle: "",
  });

  // Если пользователь не авторизован, перенаправляем на главную
  if (!user) {
    return <Navigate to="/app/home" replace />;
  }

  useEffect(() => {
    getProducts();
  }, []);

  // Обработчик изменения данных формы
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Обработчик отправки формы
  const handleSubmit = (e) => {
    e.preventDefault();

    if (mode === "edit") {
      updateProduct(formData, formData?.id);
      setAlert({
        isOpen: true,
        variant: "info",
        title: "Обновление товара",
        subtitle: "Товар обновлен успешно",
      });
    } else {
      addProduct(formData);
      setAlert({
        isOpen: true,
        variant: "success",
        title: "Добавление товара",
        subtitle: "Товар добавлен успешно",
      });
    }

    onClose();
    setFormData({
      name: "",
      description: "",
      price: "",
      category: "",
      weight: "",
    });
  };

  // Обработчик двойного клика по строке таблицы
  const handleDoubleClick = (rowData) => {
    setMode("view");
    onOpen();
    setFormData({
      id: rowData?.id,
      name: rowData?.name,
      description: rowData?.description,
      price: rowData?.price,
      category: rowData?.category,
      weight: rowData?.weight,
    });
  };

  // Обработчик удаления продукта
  const handleDeleteProduct = () => {
    onModalClose();
    onClose(); // закрываем Drawer
    deleteProduct(formData?.id);
    setFormData({
      name: "",
      description: "",
      price: "",
      category: "",
      weight: "",
    });
    setMode("add");
    setAlert({
      isOpen: true,
      variant: "success",
      title: "Удаление товара",
      subtitle: "Товар удален успешно",
    });
  };

  return (
    <div className="admin-page">
      <div className="container">
        <div className="admin-header">
          <h1>Admin Panel</h1>
          <button
            onClick={() => {
              setMode("add");
              setFormData({
                name: "",
                description: "",
                price: "",
                category: "",
                weight: "",
              });
              onOpen();
            }}
            className="button admin-add-button"
          >
            Добавить продукт
          </button>
        </div>

        {products.length === 0 && (
          <p style={{ color: "#fff", textAlign: "center", marginTop: "2rem" }}>
            Нет продуктов. Добавьте первый продукт или выполните команду{" "}
            <code>window.seedData()</code> в консоли браузера.
          </p>
        )}

        {products.length > 0 && (
          <Table
            data={products}
            headers={HEADERS}
            onDoubleClick={handleDoubleClick}
          />
        )}
      </div>

      <Drawer
        isOpen={isOpen}
        onClose={onClose}
        title={mode === "edit" ? "Редактировать продукт" : "Добавить продукт"}
      >
        <form onSubmit={handleSubmit} className="simple-form">
          <input
            type="text"
            placeholder="Название товара"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <textarea
            placeholder="Описание товара"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={3}
          />

          <input
            type="text"
            placeholder="Категория (например: Бургеры, Напитки, Первые блюда)"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          />

          <input
            type="number"
            placeholder="Цена (₽)"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            min="0"
            step="1"
          />

          <input
            type="text"
            placeholder="Вес (например: 360 гр)"
            name="weight"
            value={formData.weight}
            onChange={handleChange}
            required
          />

          <button type="submit" className="button">
            {mode === "edit" ? "Обновить" : "Добавить"}
          </button>
        </form>
      </Drawer>
    </div>
  );
};
