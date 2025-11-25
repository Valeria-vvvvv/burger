import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.jsx";
import "./Auth.css";
import logo from "../../assets/img/Logo.png";

export const Register = () => {
  // Регистрация через Google/GitHub/Email
  const { signInWithGoogle, signInWithGithub, onRegister } = useAuth();

  // Данные пользователя
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  // Состояние для ошибок и загрузки
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Обработчик изменения данных формы
  const handleChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
    // Очищаем ошибку при изменении данных
    if (error) setError("");
  };

  // Обработчик отправки формы
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await onRegister(data);
      console.log(result);
      if (!result.success) {
        setError(result.error);
      }
    } catch (err) {
      setError("Произошла неожиданная ошибка. Попробуйте еще раз.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-form-section">
          <img src={logo} alt="Burger Cheddar" className="auth-logo" />

          <div className="auth-form">
            <div className="social-buttons">
              <button className="social-button" onClick={signInWithGoogle}>
                Зарегистрироваться через Google
              </button>

              <button className="social-button" onClick={signInWithGithub}>
                Зарегистрироваться через GitHub
              </button>
            </div>

            <div className="divider">
              <span>Или зарегистрироваться с помощью email</span>
            </div>

            <form className="auth-form" onSubmit={handleSubmit}>
              {error && (
                <div
                  className="error-message"
                  style={{
                    color: "#dc3545",
                    backgroundColor: "#f8d7da",
                    border: "1px solid #f5c6cb",
                    borderRadius: "4px",
                    padding: "8px 12px",
                    marginBottom: "16px",
                    fontSize: "14px",
                  }}
                >
                  {error}
                </div>
              )}

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
                  disabled={isLoading}
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
                  autoComplete="new-password"
                  disabled={isLoading}
                />
              </div>
              <button
                type="submit"
                className="submit-button"
                disabled={isLoading}
              >
                {isLoading ? "Регистрация..." : "Зарегистрироваться"}
              </button>

              <div className="auth-link">
                Уже есть аккаунт?
                <Link to="/login">Войти</Link>
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
