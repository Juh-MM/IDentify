import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [user, setUser] = useState({
    username: localStorage.getItem("username"),
    cargo: localStorage.getItem("cargo"),
  });

  const login = ({ token, username, cargo }) => {
    localStorage.setItem("token", token);
    localStorage.setItem("username", username);
    localStorage.setItem("cargo", cargo);
    setToken(token);
    setUser({ username, cargo });
  };

  const logout = () => {
    localStorage.clear();
    setToken("");
    setUser({});
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
