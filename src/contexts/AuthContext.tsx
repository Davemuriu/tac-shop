
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  switchUser: (userId: string, pin: string) => Promise<boolean>;
  resetPassword: (email: string) => Promise<boolean>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Mock users for demonstration
const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@tacshop.com',
    name: 'Admin User',
    role: 'admin',
    permissions: ['all'],
    pin: '1234'
  },
  {
    id: '2',
    email: 'manager@tacshop.com',
    name: 'Manager User',
    role: 'manager',
    permissions: ['inventory', 'reports', 'pos'],
    pin: '5678'
  },
  {
    id: '3',
    email: 'cashier@tacshop.com',
    name: 'Cashier User',
    role: 'cashier',
    permissions: ['pos'],
    pin: '9999'
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored auth data
    const storedUser = localStorage.getItem('tacshop_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Mock authentication - replace with actual API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const foundUser = mockUsers.find(u => u.email === email);
    if (foundUser && password === 'password') {
      setUser(foundUser);
      localStorage.setItem('tacshop_user', JSON.stringify(foundUser));
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const switchUser = async (userId: string, pin: string): Promise<boolean> => {
    setIsLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const foundUser = mockUsers.find(u => u.id === userId && u.pin === pin);
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('tacshop_user', JSON.stringify(foundUser));
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const resetPassword = async (email: string): Promise<boolean> => {
    setIsLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const foundUser = mockUsers.find(u => u.email === email);
    setIsLoading(false);
    return !!foundUser;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('tacshop_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, switchUser, resetPassword, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
