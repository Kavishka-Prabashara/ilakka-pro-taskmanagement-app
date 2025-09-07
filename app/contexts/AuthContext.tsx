// contexts/AuthContext.tsx
import React, { createContext, useState, useEffect, ReactNode, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api, { setAuthToken } from "../lib/api";

type User = {
  id?: number;
  username?: string;
  email?: string;
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  loading: boolean;
  register: (username: string, email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const defaultAuth: AuthContextType = {
  user: null,
  token: null,
  loading: true,
  register: async () => {},
  login: async () => {},
  logout: async () => {},
};

const AuthContext = createContext<AuthContextType>(defaultAuth);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Load token/user from AsyncStorage on app start
  useEffect(() => {
    const loadAuthData = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("token");
        const storedUser = await AsyncStorage.getItem("user");

        if (storedToken) {
          setToken(storedToken);
          setAuthToken(storedToken);
        }

        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (err) {
        console.log("Error loading auth data:", err);
      } finally {
        setLoading(false);
      }
    };

    loadAuthData();
  }, []);

  // Register a new user
  const register = async (username: string, email: string, password: string) => {
    try {
      await api.post("/auth/register", { username, email, password });
      await login(email, password); // auto-login after register
    } catch (err) {
      console.error("Registration error:", err);
      throw err;
    }
  };

  // Login user
  const login = async (email: string, password: string) => {
    try {
      const res = await api.post("/auth/login", { email, password });
      const token = res.data.token;

      if (!token) throw new Error("No token returned from server");

      setToken(token);
      setAuthToken(token);
      await AsyncStorage.setItem("token", token);

      const userData: User = { email }; // optionally fetch more user info from /auth/me
      setUser(userData);
      await AsyncStorage.setItem("user", JSON.stringify(userData));
    } catch (err) {
      console.error("Login error:", err);
      throw err;
    }
  };

  // Logout user
  const logout = async () => {
    try {
      setUser(null);
      setToken(null);
      setAuthToken(null);
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("user");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for easier usage
export const useAuth = () => useContext(AuthContext);

export default AuthContext;
