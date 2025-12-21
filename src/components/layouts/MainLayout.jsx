import { Outlet } from "react-router-dom";
import { Header } from "../ui/Header.jsx";
import { Footer } from "../ui/Footer.jsx";
import "./MainLayout.css";

export const MainLayout = () => {
  return (
    <div className="main-layout">
      <Header />
      <main className="main-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
