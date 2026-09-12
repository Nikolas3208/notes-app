import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("notes_user");

    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = (email, password) => {
    const newUser = {
      name: "Користувач",
      email: email,
    };

    localStorage.setItem("notes_user", JSON.stringify(newUser));

    setUser(newUser);
  };

  const register = (name, email, password) => {
    const newUser = {
      name: name,
      email: email,
    };

    localStorage.setItem("notes_user", JSON.stringify(newUser));

    setUser(newUser);
  };

  const logout = () => {
    localStorage.removeItem("notes_user");

    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}