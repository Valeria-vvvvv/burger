import { Routes, Route, Navigate } from "react-router-dom";
import { MainLayout } from "../layouts/MainLayout";
import { HomePage } from "../../pages/Home.jsx";
import { ProductsPage } from "../../pages/Products.jsx";
import { BasketPage } from "../../pages/Basket.jsx";
import { ProductDetails } from "../../pages/ProductDetails.jsx";
import { Reviews } from "../../pages/Reviews.jsx";
import { Login } from "../Auth/Login.jsx";
import { Register } from "../Auth/Register.jsx";
import { useAuth } from "../../hooks/useAuth.jsx";
import { Admin } from "../../pages/Admin.jsx";
import { UserPage } from "../../pages/User.jsx";

/** Массив защищенных роутов приложения */
const protectedRoutes = [
  { path: "home", element: <HomePage /> },
  { path: "products", element: <ProductsPage /> },
  { path: "product/:id", element: <ProductDetails /> },
  { path: "basket", element: <BasketPage /> },
  { path: "reviews", element: <Reviews /> },
  { path: "admin", element: <Admin /> },
  { path: "profile", element: <UserPage /> },
];

/**
 * Рекурсивно отображает роуты и дочерние роуты.
 * @param {RouteItem} route - Объект роута.
 */
const renderRoute = ({ path, element, children }) => (
  <Route key={path} path={path} element={element}>
    {children && children.map(renderRoute)}
  </Route>
);

// Компонент для защищенных маршрутов
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();

  return user ? children : <Navigate to="/login" replace />;
};

/** Корневой компонент приложения с роутами */
export const AppRoutes = () => (
  <Routes>
    {/* Публичные маршруты аутентификации */}
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />

    {/* Защищенные маршруты - только для аутентифицированных пользователей */}
    <Route
      path="/app"
      element={
        <ProtectedRoute>
          <MainLayout />
        </ProtectedRoute>
      }
    >
      {protectedRoutes.map(renderRoute)}
      {/* Перенаправление с /app на /app/home */}
      <Route index element={<Navigate to="home" replace />} />
    </Route>

    {/* Корневой путь всегда перенаправляет на логин */}
    <Route path="/" element={<Navigate to="/login" replace />} />

    {/* Все остальные неизвестные маршруты тоже на логин */}
    <Route path="*" element={<Navigate to="/login" replace />} />
  </Routes>
);
