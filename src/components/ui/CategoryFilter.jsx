import { useMemo } from "react";
import "./CategoryFilter.css";

export const CategoryFilter = ({
  products,
  selectedCategory,
  onCategoryChange,
}) => {
  // Получаем уникальные категории из товаров
  const categories = useMemo(() => {
    const uniqueCategories = [
      ...new Set(products.map((product) => product.category).filter(Boolean)),
    ];
    return uniqueCategories.sort();
  }, [products]);

  return (
    <div className="category-filter">
      <button
        className={`category-button ${selectedCategory === "" ? "active" : ""}`}
        onClick={() => onCategoryChange("")}
      >
        Все
      </button>
      {categories.map((category) => (
        <button
          key={category}
          className={`category-button ${
            selectedCategory === category ? "active" : ""
          }`}
          onClick={() => onCategoryChange(category)}
        >
          {category}
        </button>
      ))}
    </div>
  );
};
