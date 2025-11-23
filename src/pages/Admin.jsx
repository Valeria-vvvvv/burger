import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import Table from "../components/Table/Table";
import { Drawer } from "../components/Drawer/Drawer";
import { useDisclosure } from "../hooks/useDisclosure.js";
import { useProducts } from "../store/useProducts";
import { useAuth } from "../hooks/useAuth";
import "./Admin.css";

const HEADERS = [
  { name: "Название", key: "name" },
  { name: "Описание", key: "description" },
  { name: "Цена", key: "price" },
  { name: "Вес", key: "weight" },
];

/**
 * Компонент админ-панели для управления продуктами
 * Позволяет просматривать список продуктов/добавлять новые
 */
export const Admin = () => {
  // Проверка авторизации
  const { user } = useAuth();

  // Получаем данные и методы из Zustand store
  const {
    products,
    loading,
    error,
    getProducts,
    addProduct,
    updateProduct,
    deleteProduct,
  } = useProducts();

  // Если пользователь не авторизован, перенаправляем на главную
  if (!user) {
    return <Navigate to="/app/home" replace />;
  }

  // Режим добавления/редактирования/просмотра
  const [mode, setMode] = useState("add");

  // Состояние для данных формы
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
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

  useEffect(() => {
    getProducts();
  }, [getProducts]);

  // Обработчик изменения данных формы
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Сброс формы
  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      weight: "",
    });
  };

  // Обработчик отправки формы
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      name: formData?.name,
      description: formData?.description,
      price: Number(formData?.price),
      weight: formData?.weight,
    };

    if (mode === "edit") {
      updateProduct({ ...payload, id: formData?.id });
      setAlert({
        isOpen: true,
        variant: "info",
        title: "Обновление товара",
        subtitle: "Товар обновлен успешно",
      });
    } else {
      addProduct(payload);
      setAlert({
        isOpen: true,
        variant: "success",
        title: "Добавление товара",
        subtitle: "Товар добавлен успешно",
      });
    }

    onClose();
    resetForm();
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
      weight: rowData?.weight,
    });
  };

  // Обработчик удаления продукта
  const handleDeleteProduct = () => {
    onModalClose();
    onClose();
    deleteProduct(formData?.id);
    resetForm();
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
              onOpen();
            }}
            className="button admin-add-button"
          >
            Добавить продукт
          </button>
        </div>

        {loading && (
          <p style={{ color: "#fff", textAlign: "center", marginTop: "2rem" }}>
            Загрузка продуктов...
          </p>
        )}
        {error && (
          <p
            style={{ color: "#ff4444", textAlign: "center", marginTop: "2rem" }}
          >
            Ошибка: {error}
          </p>
        )}
        {!loading && !error && products.length === 0 && (
          <p style={{ color: "#fff", textAlign: "center", marginTop: "2rem" }}>
            Нет продуктов. Добавьте первый продукт или выполните команду{" "}
            <code>window.seedData()</code> в консоли браузера.
          </p>
        )}
        {!loading && products.length > 0 && (
          <Table
            data={products}
            headers={HEADERS}
            onDoubleClick={handleDoubleClick}
          />
        )}
      </div>

      <Drawer isOpen={isOpen} onClose={onClose} title="Добавить продукт">
        <form onSubmit={handleSubmit} className="simple-form">
          <input
            type="text"
            placeholder="Название бургера"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <textarea
            placeholder="Описание бургера"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={3}
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
            Добавить
          </button>
        </form>
      </Drawer>
    </div>
  );
};
