import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const trimmedEmail = email.trim();

    // Перевірка email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(trimmedEmail)) {
        setError("Введіть коректну електронну пошту.");
        return;
    }

    // Перевірка пароля
    if (!password) {
        setError("Введіть пароль.");
        return;
    }

    try {
        await login(trimmedEmail, password);

        navigate("/notes");
    } catch (error) {
        setError(error.message || "Помилка входу.");
    }
};

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Вхід</h1>

        <p className="auth-subtitle">
          Увійдіть, щоб продовжити роботу з нотатками
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">
              Електронна пошта
            </label>

            <input
              id="email"
              type="email"
              placeholder="example@gmail.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">
              Пароль
            </label>

            <input
              id="password"
              type="password"
              placeholder="Введіть пароль"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>

          {error && (
            <p className="form-error">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="auth-button"
          >
            Увійти
          </button>
        </form>

        <p className="auth-footer">
          Ще немає акаунта?{" "}
          <Link to="/register">
            Зареєструватися
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;