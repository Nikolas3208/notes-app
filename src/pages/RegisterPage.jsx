import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();

    setError("");

    if (password.length < 6) {
      setError("Пароль повинен містити що найменше 6 символів.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Паролі не співпадають.");
      return;
    }

    register(name, email, password);

    navigate("/notes");
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Реєстрація</h1>

        <p className="auth-subtitle">
          Створіть акаунт для своїх нотаток
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Ім'я</label>

            <input
              id="name"
              type="text"
              placeholder="Ваше ім'я"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Електронна пошта</label>

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
            <label htmlFor="password">Пароль</label>

            <input
                id="password"
                type="password"
                placeholder="Створіть пароль"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                onFocus={() => setIsPasswordFocused(true)}
                onBlur={() => setIsPasswordFocused(false)}
                required
            />

            {isPasswordFocused && (
            <p
                className={`password-hint ${
                password.length >= 6 ? "password-valid" : ""
                }`}
            >
                {password.length >= 6 && "✓ "}
                Мінімум 6 символів
            </p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="confirm-password">
              Підтвердження пароля
            </label>

            <input
              id="confirm-password"
              type="password"
              placeholder="Повторіть пароль"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              required
            />
          </div>

          {error && (
            <p className="form-error">
              {error}
            </p>
          )}

          <button type="submit" className="auth-button">
            Зареєструватися
          </button>
        </form>

        <p className="auth-footer">
          Вже маєте акаунт?{" "}
          <Link to="/login">Увійти</Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;