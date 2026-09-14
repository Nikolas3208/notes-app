import { createContext, useContext, useEffect, useState } from "react";
import {
    login as apiLogin,
    register as apiRegister,
    checkSession
} from "../api/authApi";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem("notes_user");
        return savedUser ? JSON.parse(savedUser) : null;
    });

    // Поки триває перевірка куки при першому завантаженні —
    // не даємо ProtectedRoute передчасно редіректнути на /login.
    const [authChecked, setAuthChecked] = useState(false);

    useEffect(() => {
        checkSession()
            .then(() => {
                // Кука валідна. Якщо в localStorage вже є збережений юзер —
                // лишаємо його як є, бо /User/me не існує і дізнатись
                // ім'я/email наново нема звідки.
                setUser((current) => {
                    if (current) return current;

                    const savedUser = localStorage.getItem("notes_user");
                    return savedUser ? JSON.parse(savedUser) : null;
                });
            })
            .catch(() => {
                // Кука відсутня/протухла — примусово розлогінюємо локально.
                localStorage.removeItem("notes_user");
                setUser(null);
            })
            .finally(() => setAuthChecked(true));
    }, []);

    const login = async (email, password, name = "Користувач") => {
        await apiLogin(email, password);

        const newUser = {
            name,
            email
        };

        localStorage.setItem(
            "notes_user",
            JSON.stringify(newUser)
        );

        setUser(newUser);
    };

    const register = async (name, email, password) => {
        await apiRegister(name, email, password);
        // Бекенд на реєстрації не видає сесію/токен окремо,
        // тож одразу після реєстрації логінимось тим самим паролем,
        // але з реальним ім'ям замість дефолтного "Користувач".
        await login(email, password, name);
    };

    const updateUser = (updates) => {
        const updatedUser = {
            ...user,
            ...updates
        };

        localStorage.setItem(
            "notes_user",
            JSON.stringify(updatedUser)
        );

        setUser(updatedUser);
    };

    const logout = () => {
        localStorage.removeItem("notes_user");
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                authChecked,
                login,
                register,
                updateUser,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}