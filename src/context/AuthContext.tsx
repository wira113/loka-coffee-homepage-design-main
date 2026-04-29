import React, { createContext, useContext, useState, useEffect } from "react";

interface User {
  id: number;
  email: string;
  name: string;
  phone?: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (credentials: any) => Promise<{ success: boolean; message: string }>;
  register: (data: any) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  updateUser: (userData: User) => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE_URL = `${import.meta.env.VITE_API_URL}/api`;

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user and token from localStorage on initial load
  useEffect(() => {
    const savedUser = localStorage.getItem("loka_user");
    const savedToken = localStorage.getItem("loka_token");
    if (savedUser && savedToken) {
      try {
        setUser(JSON.parse(savedUser));
        setToken(savedToken);
      } catch (error) {
        console.error("Auth initialization error:", error);
        localStorage.removeItem("loka_user");
        localStorage.removeItem("loka_token");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (credentials: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(credentials),
      });

      const result = await response.json();

      if (result.status === "success") {
        const { user: userData, token: userToken } = result.data;
        setUser(userData);
        setToken(userToken);
        localStorage.setItem("loka_user", JSON.stringify(userData));
        localStorage.setItem("loka_token", userToken);
        return { success: true, message: result.message };
      } else {
        return { success: false, message: result.message || "Login failed" };
      }
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, message: "Kesalahan koneksi ke server." };
    }
  };

  const register = async (data: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.status === "success" || response.status === 201) {
        // Automatically login after register if backend provides token
        if (result.data && result.data.token) {
          const { user: userData, token: userToken } = result.data;
          setUser(userData);
          setToken(userToken);
          localStorage.setItem("loka_user", JSON.stringify(userData));
          localStorage.setItem("loka_token", userToken);
        }
        return { success: true, message: result.message };
      } else {
        // Handle validation errors from Laravel
        let errorMsg = result.message || "Registrasi gagal";
        if (result.errors) {
          const firstError = Object.values(result.errors)[0] as string[];
          errorMsg = firstError[0] || errorMsg;
        }
        return { success: false, message: errorMsg };
      }
    } catch (error) {
      console.error("Register error:", error);
      return { success: false, message: "Kesalahan koneksi ke server." };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("loka_user");
    localStorage.removeItem("loka_token");
  };

  const updateUser = (userData: User) => {
    setUser(userData);
    localStorage.setItem("loka_user", JSON.stringify(userData));
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, updateUser, isAuthenticated: !!user, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
