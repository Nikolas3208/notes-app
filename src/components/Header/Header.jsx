import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Header.module.css";

function Header({ user, onLogout }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const profileRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  const avatarLetter = user.name
    ? user.name.charAt(0).toUpperCase()
    : "?";

  return (
    <header className={styles.header}>
      <div className={styles.titleBlock}>
        <h1>Мої нотатки</h1>
        <p>Привіт, {user.name} 👋</p>
      </div>

      <div className={styles.profile} ref={profileRef}>
        <button
          className={styles.avatarButton}
          onClick={() =>
            setIsMenuOpen((current) => !current)
          }
          aria-label="Відкрити меню профілю"
        >
          {user.avatar ? (
            <img
              src={user.avatar}
              alt="Аватар"
              className={styles.avatarImage}
            />
          ) : (
            avatarLetter
          )}
        </button>

        {isMenuOpen && (
          <div className={styles.profileMenu}>
            <div className={styles.profileInfo}>
              <div className={styles.menuAvatar}>
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt="Аватар"
                    className={styles.menuAvatarImage}
                  />
                ) : (
                  avatarLetter
                )}
              </div>

              <div>
                <strong>{user.name}</strong>
                <span>{user.email}</span>
              </div>
            </div>

            <div className={styles.menuDivider} />

            <button
              className={styles.menuItem}
              onClick={() => {
                setIsMenuOpen(false);
                navigate("/settings");
              }}
            >
              ⚙
              <span>Налаштування акаунта</span>
            </button>

            <button
              className={`${styles.menuItem} ${styles.logoutItem}`}
              onClick={onLogout}
            >
              ⇥
              <span>Вийти</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;