import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Link } from 'react-router-dom';
import './Auth.css';

const logo = "/images/Logo.png";

export const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { resetPassword } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      const result = await resetPassword(email);
      if (result.success) {
        setMessage('Письмо для сброса пароля отправлено на ваш email!');
        setEmail('');
      } else {
        setMessage(result.error);
      }
    } catch (error) {
      setMessage('Произошла ошибка при отправке письма');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-form-section">
          <img src={logo} alt="Burger Cheddar" className="auth-logo" />
          
          <Link to="/login" className="back-link">
            ← Назад к входу
          </Link>

          <div className="auth-form">
            <h2>Сброс пароля</h2>
            <p>Введите ваш email для получения ссылки сброса пароля</p>

            <form onSubmit={handleSubmit}>
              {message && (
                <div className={`message ${message.includes('отправлено') ? 'success' : 'error'}`}>
                  {message}
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input"
                  placeholder="name@company.com"
                  required
                  disabled={isLoading}
                />
              </div>

              <button
                type="submit"
                className="submit-button"
                disabled={isLoading}
              >
                {isLoading ? 'Отправка...' : 'Отправить письмо'}
              </button>
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