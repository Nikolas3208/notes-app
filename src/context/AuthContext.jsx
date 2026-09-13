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
      email,
    };

    localStorage.setItem("notes_user", JSON.stringify(newUser));
    setUser(newUser);
  };

  const register = (name, email, password) => {
    const newUser = {
      name,
      email,
    };

    localStorage.setItem("notes_user", JSON.stringify(newUser));
    setUser(newUser);
  };

  const updateUser = (updates) => {
    const updatedUser = {
      ...user,
      ...updates,
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
        login,
        register,
        updateUser,
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