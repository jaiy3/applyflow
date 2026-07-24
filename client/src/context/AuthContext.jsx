import { createContext, useEffect, useState } from "react";

import {
  getCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
} from "../services/authService";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    restoreSession();
  }, []);

  async function restoreSession() {
    try {
      const data = await getCurrentUser();

      setUser(data.user);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  async function login(credentials) {
    const data = await loginUser(credentials);

    localStorage.setItem("token", data.token);

    setUser(data.user);

    return data;
  }

  async function register(userData) {
    const data = await registerUser(userData);

    localStorage.setItem("token", data.token);

    setUser(data.user);

    return data;
  }

  async function logout() {
    localStorage.removeItem("token");

    await logoutUser();

    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        register,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;