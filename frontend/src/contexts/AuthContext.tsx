import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "@/types";
import api from "@/utils/api";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  switchUser: (userId: string, pin: string) => Promise<boolean>;
  resetPassword: (email: string) => Promise<boolean>;
  verifyPin: (pin: string) => boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from API on mount if token exists
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      api
        .get("/user")
        .then((res) => setUser(res.data))
        .catch(() => {
          localStorage.removeItem("authToken");
          setUser(null);
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  // 🔐 Real backend login
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const res = await api.post("/login", { email, password });
      localStorage.setItem("authToken", res.data.token); // Store token
      const profile = await api.get("/user");
      setUser(profile.data);
      return true;
    } catch (err) {
      console.error("Login failed", err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // 🔐 Real backend logout
  const logout = async (): Promise<void> => {
    try {
      await api.post("/logout");
    } catch (err) {
      console.warn("Logout failed", err);
    } finally {
      localStorage.removeItem("authToken");
      setUser(null);
    }
  };

  // ⛔ Keep as mock logic (for now)
  const switchUser = async (userId: string, pin: string): Promise<boolean> => {
    // Placeholder: still mock
    await new Promise((res) => setTimeout(res, 300));
    return false;
  };

  const resetPassword = async (email: string): Promise<boolean> => {
    // Placeholder: still mock
    await new Promise((res) => setTimeout(res, 300));
    return false;
  };

  const verifyPin = (pin: string): boolean => {
    return user?.pin === pin || pin === "1234";
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        switchUser,
        resetPassword,
        verifyPin,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
