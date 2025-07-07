
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Product, Sale, SaleItem, CartItem, DashboardStats } from '@/types';
import { useAuth } from './AuthContext';

interface StoreContextType {
  products: Product[];
  sales: Sale[];
  cart: CartItem[];
  dashboardStats: DashboardStats;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  completeSale: (paymentMethod: 'cash' | 'card' | 'digital' | 'mpesa', discount?: number) => Sale;
  clearCart: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  
  // Empty initial states - no mock data
  const [products] = useState<Product[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);

  // Empty dashboard stats
  const [dashboardStats] = useState<DashboardStats>({
    todaySales: 0,
    todayTransactions: 0,
    lowStockItems: 0,
    totalProducts: 0,
    weeklyRevenue: [0, 0, 0, 0, 0, 0, 0],
    topProducts: []
  });

  const addToCart = (product: Product) => {
    if (product.quantity <= 0) return;
    
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.product.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { product, quantity: 1, discount: 0 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.product.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCart(prevCart =>
      prevCart.map(item =>
        item.product.id === productId
          ? { ...item, quantity }
          : item
      )
    );
  };

  const completeSale = (paymentMethod: 'cash' | 'card' | 'digital' | 'mpesa', discount: number = 0): Sale => {
    const saleItems: SaleItem[] = cart.map(item => ({
      id: `item-${Date.now()}-${Math.random()}`,
      productId: item.product.id,
      productName: item.product.name,
      quantity: item.quantity,
      unitPrice: item.product.price,
      discount: item.discount || 0,
      total: item.product.price * item.quantity
    }));

    const subtotal = saleItems.reduce((sum, item) => sum + item.total, 0);
    const tax = subtotal * 0.08;
    const total = subtotal + tax - discount;

    const sale: Sale = {
      id: `sale-${Date.now()}`,
      receiptNumber: `R${Date.now().toString().slice(-6)}`,
      items: saleItems,
      subtotal,
      tax,
      discount,
      total,
      paymentMethod,
      cashierId: user?.id || 'unknown',
      status: 'completed',
      createdAt: new Date().toISOString(),
    };

    setSales(prevSales => [sale, ...prevSales]);
    setCart([]);

    return sale;
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <StoreContext.Provider value={{
      products,
      sales,
      cart,
      dashboardStats,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      completeSale,
      clearCart,
    }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}
