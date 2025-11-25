import "./Footer.css";
import logo from "../../assets/img/Logo.png";

export const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-logo">
            <img src={logo} alt="Logo" />
          </div>
          <div className="footer-rights">Все права защищены</div>
        </div>
      </div>
    </footer>
  );
};
