import { Routes, Route, Navigate } from "react-router-dom";
import { MainLayout } from "../layouts/MainLayout";
import { Home } from "../../pages/Home.jsx";
import { ProductsPage } from "../../pages/Products.jsx";
import { BasketPage } from "../../pages/Basket.jsx";
import { ProductDetails } from "../../pages/ProductDetails.jsx";
import { Reviews } from "../../pages/Reviews.jsx";
import { Checkout } from "../../pages/Checkout.jsx";
import { Login } from "../Auth/Login.jsx";
import { Register } from "../Auth/Register.jsx";
import { ResetPassword } from "../Auth/ResetPassword.jsx";
import { useAuth } from "../../hooks/useAuth.jsx";
import { Admin } from "../../pages/Admin.jsx";
import { UserPage } from "../../pages/User.jsx";
/** Массив роутов приложения */
const routes = [
  { path: "/app/home", element: <Home /> },
  { path: "/app/products", element: <ProductsPage /> },
  { path: "/app/product/:id", element: <ProductDetails /> },
  { path: "/app/basket", element: <BasketPage /> },
  { path: "/app/checkout", element: <Checkout /> },
  { path: "/app/reviews", element: <Reviews /> },
  { path: "/app/profile", element: <UserPage /> },
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

/** Корневой компонент приложения с роутами */
export const AppRoutes = () => {
  const { user, isAdmin } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Редирект с корня - проверяем авторизацию */}
      <Route
        path="/"
        element={
          user ? (
            <Navigate to="/app/home" replace />
          ) : (
            <Navigate to="/register" replace />
          )
        }
      />

      <Route path="/app" element={<MainLayout />}>
        {routes.map(renderRoute)}
        <Route
          path="admin"
          element={isAdmin() ? <Admin /> : <Navigate to="/app/home" replace />}
        />
        <Route path="*" element={<Navigate to="/app/home" replace />} />
      </Route>

      <Route path="*" element={<Navigate to="/register" replace />} />
    </Routes>
  );
};
