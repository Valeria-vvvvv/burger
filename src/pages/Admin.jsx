import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { Table } from "../components/ui/Table.jsx";
import { Drawer } from "../components/ui/Drawer.jsx";
import { ConfirmModal } from "../components/ui/ConfirmModal.jsx";
import { useDisclosure } from "../hooks/useDisclosure";
import { useProducts } from "../store/useProducts";
import { useAuth } from "../hooks/useAuth";
import { uploadToCloudinary } from "../services/cloudinaryUpload";
import { useNotification } from "../contexts/NotificationContext";
import "./Admin.css";

const HEADERS = [
  { name: "Название", key: "name" },
  { name: "Описание", key: "description" },
  { name: "Цена", key: "price" },
  { name: "Категория", key: "category" },
  { name: "Вес", key: "weight" },
  {
    name: "Изображение",
    key: "imgSrc",
    render: (row) => (
      <img
        src={row?.imgSrc}
        alt={row?.name}
        style={{
          width: "50px",
          height: "50px",
          objectFit: "cover",
          borderRadius: "4px",
        }}
      />
    ),
  },
];

const CATEGORIES = [
  "Бургеры",
  "Напитки",
  "Первые блюда",
  "Вторые блюда",
  "Салаты",
  "Десерты",
  "Закуски",
];


export const Admin = () => {
  const { user } = useAuth();
  const { showSuccess, showError } = useNotification();
  const { products, getProducts, addProduct, updateProduct, deleteProduct } = useProducts();
  
  // Состояние активной вкладки
  const [activeTab, setActiveTab] = useState("products");
  

  const [mode, setMode] = useState("add");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    weight: "",
    imageUrl: "",
    imageName: "",
    imageSize: 0,
    imageFile: null,
  });

  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isModalOpen, onOpen: onModalOpen, onClose: onModalClose } = useDisclosure();


  useEffect(() => {
    getProducts();
  }, []);


  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  function handleUploadFile(e) {
    const file = e.target.files[0];
    if (!file) return;

    setFormData((prev) => ({
      ...prev,
      imageUrl: URL.createObjectURL(file),
      imageName: file.name,
      imageSize: file.size,
      imageFile: file,
    }));
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.imageFile) {
      showError("Заполните все обязательные поля");
      return;
    }

    const CLOUDINARY = {
      cloudName: "dous0b5vy",
      uploadPreset: "Products",
      folder: "products",
    };

    let finalImageUrl = formData.imageUrl;

    if (formData.imageFile) {
      try {
        finalImageUrl = await uploadToCloudinary(formData.imageFile, CLOUDINARY);
      } catch (err) {
        showError(`Ошибка загрузки: ${err.message}`);
        return;
      }
    }

    const payload = {
      name: formData.name,
      description: formData.description,
      price: formData.price,
      category: formData.category,
      weight: formData.weight,
      imgSrc: finalImageUrl,
    };

    if (mode === "edit") {
      updateProduct({ ...payload, id: formData.id });
    } else {
      addProduct(payload);
    }

    showSuccess(mode === "edit" ? "Товар обновлен" : "Товар добавлен");
    onClose();
    setFormData({
      name: "",
      description: "",
      price: "",
      category: "",
      weight: "",
      imageUrl: "",
      imageName: "",
      imageSize: 0,
      imageFile: null,
    });
  };

  const handleDoubleClick = (rowData) => {
    setMode("edit");
    onOpen();
    setFormData({
      id: rowData?.id,
      name: rowData?.name,
      description: rowData?.description,
      price: rowData?.price,
      category: rowData?.category,
      weight: rowData?.weight,
      imageUrl: rowData?.imgSrc || "",
      imageName: rowData?.imageName || "",
      imageSize: rowData?.imageSize || 0,
      imageFile: null,
    });
  };

  const handleDeleteProduct = () => {
    onModalClose();
    onClose();
    deleteProduct(formData?.id);
    setFormData({
      name: "",
      description: "",
      price: "",
      category: "",
      weight: "",
      imageUrl: "",
      imageName: "",
      imageSize: 0,
      imageFile: null,
    });
    setMode("add");
    showSuccess("Товар удален успешно");
  };

  return (
    <div className="admin-page">
      <div className="container">
        <div className="admin-header">
          <h1>Admin Panel</h1>
          
        </div>

        {activeTab === "products" && (
          <>
            <button
              onClick={() => {
                setMode("add");
                setFormData({
                  name: "",
                  description: "",
                  price: "",
                  category: "",
                  weight: "",
                  imageUrl: "",
                  imageName: "",
                  imageSize: 0,
                  imageFile: null,
                });
                onOpen();
              }}
              className="button admin-add-button"
            >
              Добавить продукт
            </button>

            {products.length === 0 && (
              <p style={{ color: "#fff", textAlign: "center", marginTop: "2rem" }}>
                Нет продуктов. Добавьте первый продукт.
              </p>
            )}

            {products.length > 0 && (
              <Table
                data={products}
                headers={HEADERS}
                onDoubleClick={handleDoubleClick}
              />
            )}
          </>
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
            placeholder="Название товара*"
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

          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="">Выберите категорию</option>
            {CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

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

          <div style={{ marginTop: "1rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem", color: "#666" }}>
              Изображение*
            </label>
            <div style={{
              display: "flex", alignItems: "center", gap: "8px", padding: "16px",
              border: "1px solid #444", borderRadius: "8px", background: "#2a2a2a", marginBottom: "16px"
            }}>
              <label style={{ cursor: "pointer" }}>
                <span style={{ color: "#d58c51", fontWeight: "500", fontSize: "14px" }}>
                  {formData.imageName || "Выбрать файл"}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleUploadFile}
                />
              </label>
            </div>
            {formData.imageUrl && (
              <img
                src={formData.imageUrl}
                alt="preview"
                style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "8px" }}
              />
            )}
          </div>

          <div style={{ display: "flex", gap: "12px", marginTop: "16px", justifyContent: "flex-end" }}>
            {mode === "edit" && (
              <button
                type="button"
                onClick={onModalOpen}
                className="button"
                style={{ backgroundColor: "#dc3545", borderColor: "#dc3545", color: "#fff" }}
              >
                Удалить товар
              </button>
            )}
            <button type="submit" className="button">
              {mode === "edit" ? "Обновить" : "Добавить"}
            </button>
          </div>
        </form>
      </Drawer>

      <ConfirmModal
        isOpen={isModalOpen}
        onClose={onModalClose}
        onConfirm={handleDeleteProduct}
        title="Удаление товара"
        message={`Вы уверены, что хотите удалить товар "${formData.name}"?`}
      />
    </div>
  );
};