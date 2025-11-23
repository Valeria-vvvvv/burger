import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.jsx";
import "./Auth.css";
import logo from "../../assets/img/Logo.png";

export const Login = () => {
  // вход через Google и GitHub
  const { signInWithGoogle, signInWithGithub, onLogin } = useAuth();

  // Данные пользователя
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  // Обработчик изменения данных формы
  const handleChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  // Обработчик отправки формы
  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(data);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-form-section">
          <img src={logo} alt="Burger Cheddar" className="auth-logo" />

          <div className="auth-form">
            <div className="social-buttons">
              <button className="social-button" onClick={signInWithGoogle}>
                Войти через Google
              </button>

              <button className="social-button" onClick={signInWithGithub}>
                Войти через GitHub
              </button>
            </div>

            <div className="divider">
              <span>Или войти с помощью email</span>
            </div>

            <form className="auth-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="email" className="form-label required">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={data?.email}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="name@company.com"
                  required
                  autoComplete="email"
                />
              </div>

              <div className="form-group">
                <label htmlFor="password" className="form-label required">
                  Пароль
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  value={data?.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="form-input"
                  required
                  autoComplete="current-password"
                />
              </div>

              <button type="submit" className="submit-button">
                Войти
              </button>

              <div className="auth-link">
                Нет аккаунта?
                <Link to="/register">Зарегистрироваться</Link>
              </div>
            </form>
          </div>
        </div>
        <div className="image-section">
          <img src={logo} alt="Burger Cheddar" className="auth-image" />
        </div>
      </div>
    </div>
  );
};
