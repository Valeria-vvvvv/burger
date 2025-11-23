import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useProducts } from "../../store/useProducts";
import { ProductCard } from "../Products/ProductCard.jsx";
import "./ProductsPreview.css";

export const ProductsPreview = () => {
  const { products, getProducts } = useProducts();
  const navigate = useNavigate();

  useEffect(() => {
    getProducts();
  }, []);

  const handleDetails = (id) => navigate(`/app/product/${id}`);

  // Показываем только первые 6 продуктов на главной
  const previewProducts = products.slice(0, 6);

  return (
    <section className="products-preview" id="products">
      <div className="container">
        <div className="products-title common-title">выберите свой бургер</div>

        <div className="products-items">
          {previewProducts.map((item) => (
            <ProductCard
              key={item.id}
              details={item}
              onCardClick={handleDetails}
            />
          ))}
        </div>

        {products.length > 6 && (
          <div className="view-all-container">
            <button
              className="view-all-button button"
              onClick={() => navigate("/app/products")}
            >
              Посмотреть все бургеры
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
