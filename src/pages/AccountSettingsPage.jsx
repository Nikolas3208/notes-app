import { useState } from "react";
import { useAuth } from "../context/AuthContext";

function AccountSettingsPage() {
  const { user, updateUser } = useAuth();

const [name, setName] = useState(user.name || "");
const [email] = useState(user.email || "");
const [avatar, setAvatar] = useState(user.avatar || "");

const [currentPassword, setCurrentPassword] = useState("");
const [newPassword, setNewPassword] = useState("");
const [confirmPassword, setConfirmPassword] = useState("");

const [message, setMessage] = useState("");

  const avatarLetter = name
    ? name.charAt(0).toUpperCase()
    : "?";

  const handleAvatarChange = (event) => {
    const file = event.target.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setMessage("Будь ласка, виберіть зображення.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setMessage("Фото має бути не більше 2 МБ.");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setAvatar(reader.result);
      setMessage("");
    };

    reader.readAsDataURL(file);
  };

  const removeAvatar = () => {
    setAvatar("");
    setMessage("");
  };

    const handleSubmit = (event) => {
    event.preventDefault();

    const trimmedName = name.trim();

    if (!trimmedName) {
        setMessage("Ім'я не може бути порожнім.");
        return;
    }

    if (newPassword || confirmPassword || currentPassword) {
        if (!currentPassword) {
        setMessage("Введіть поточний пароль.");
        return;
        }

        if (newPassword.length < 6) {
        setMessage(
            "Новий пароль має містити щонайменше 6 символів."
        );
        return;
        }

        if (newPassword === currentPassword) {
        setMessage(
            "Новий пароль не може збігатися з поточним."
        );
        return;
        }

        if (newPassword !== confirmPassword) {
        setMessage("Нові паролі не збігаються.");
        return;
        }
    }

    updateUser({
        name: trimmedName,
        avatar,
    });

    if (newPassword) {
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
    }

    setName(trimmedName);
    setMessage("Дані успішно збережено!");
    };

  return (
    <div className="settings-page">
      <div className="settings-card">
        <button
          className="settings-back-button"
          onClick={() => window.history.back()}
        >
          ← Назад
        </button>

        <h1>Налаштування акаунта</h1>

        <p className="settings-subtitle">
          Керуйте даними свого акаунта
        </p>

        <form onSubmit={handleSubmit}>
          <div className="settings-avatar-section">
            <div className="settings-avatar">
              {avatar ? (
                <img
                  src={avatar}
                  alt="Аватар"
                />
              ) : (
                avatarLetter
              )}
            </div>

            <div className="settings-avatar-actions">
              <label className="avatar-upload-button">
                Додати фото
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                />
              </label>

              {avatar && (
                <button
                  type="button"
                  className="avatar-remove-button"
                  onClick={removeAvatar}
                >
                  Видалити фото
                </button>
              )}

              <span>
                JPG, PNG або інше зображення до 2 МБ
              </span>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="settings-name">
              Ім'я
            </label>

            <input
              id="settings-name"
              type="text"
              value={name}
              onChange={(event) => {
                setName(event.target.value);
                setMessage("");
              }}
            />
          </div>

          <div className="form-group">
            <label htmlFor="settings-email">
              Електронна пошта
            </label>

            <input
              id="settings-email"
              type="email"
              value={email}
              disabled
            />
          </div>

            <div className="password-section">
            <h2>Зміна пароля</h2>

            <div className="form-group">
                <label htmlFor="current-password">
                Поточний пароль
                </label>

                <input
                id="current-password"
                type="password"
                placeholder="Введіть поточний пароль"
                value={currentPassword}
                onChange={(event) => {
                    setCurrentPassword(event.target.value);
                    setMessage("");
                }}
                />
            </div>

            <div className="form-group">
                <label htmlFor="new-password">
                Новий пароль
                </label>

                <input
                id="new-password"
                type="password"
                placeholder="Введіть новий пароль"
                value={newPassword}
                onChange={(event) => {
                    setNewPassword(event.target.value);
                    setMessage("");
                }}
                />
            </div>

            <div className="form-group">
                <label htmlFor="confirm-password">
                Повторіть новий пароль
                </label>

                <input
                id="confirm-password"
                type="password"
                placeholder="Повторіть новий пароль"
                value={confirmPassword}
                onChange={(event) => {
                    setConfirmPassword(event.target.value);
                    setMessage("");
                }}
                />
            </div>
            </div>

          {message && (
            <p className="settings-message">
              {message}
            </p>
          )}

          <button
            type="submit"
            className="settings-save-button"
          >
            Зберегти зміни
          </button>
        </form>
      </div>
    </div>
  );
}

export default AccountSettingsPage;