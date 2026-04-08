import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useProducts } from "../../store/useProducts";
import { ProductCard } from "./ProductCard.jsx";
import "./ProductsPreview.css";

// Используем путь из public папки
const lupaIcon = "/images/lupa.png";

// Фиксированный список категорий как в админке
const CATEGORIES = [
  "Бургеры",
  "Напитки",
  "Первые блюда",
  "Вторые блюда",
  "Салаты",
  "Десерты",
  "Закуски",
];

export const ProductsPreview = () => {
  const { products, getProducts } = useProducts();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    getProducts();
  }, []);

  const handleDetails = (id) => navigate(`/app/product/${id}`);

  // Фильтрация продуктов по категории и поиску
  const filteredProducts = useMemo(() => {
    let filtered = products;

    // Фильтр по категории
    if (selectedCategory) {
      filtered = filtered.filter((item) => item.category === selectedCategory);
    }

    // Фильтр по поиску
    if (searchQuery) {
      filtered = filtered.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    return filtered;
  }, [products, selectedCategory, searchQuery]);

  // Показываем только первые 6 отфильтрованных продуктов на главной
  const previewProducts = filteredProducts.slice(0, 6);

  return (
    <section className="products-preview" id="products">
      <div className="container">
        <div className="products-title common-title">выберите свой бургер</div>

        {/* Поиск */}
        <div className="filters-container">
          <div className="search-container">
            <input
              className="search-input"
              type="text"
              placeholder="Поиск по названию..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <img className="search-icon" src={lupaIcon} alt="search" />
          </div>
        </div>

        <div className="products-items">
          {previewProducts.map((item) => (
            <ProductCard
              key={item.id}
              details={item}
              onCardClick={handleDetails}
            />
          ))}
        </div>

        {filteredProducts.length > 6 && (
          <div className="view-all-container">
            <button
              className="view-all-button button"
              onClick={() => navigate("/app/products")}
            >
              Посмотреть все{" "}
              {selectedCategory ? selectedCategory.toLowerCase() : "бургеры"}
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
