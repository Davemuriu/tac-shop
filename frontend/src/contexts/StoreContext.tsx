import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Product, Sale, SaleItem, CartItem, DashboardStats } from '@/types';
import { useAuth } from './AuthContext';

interface StoreContextType {
  products: Product[];
  sales: Sale[];
  cart: CartItem[];
  dashboardStats: DashboardStats;
  heldCarts: { id: string; items: CartItem[]; timestamp: string }[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  completeSale: (paymentMethod: 'cash' | 'card' | 'digital' | 'mpesa', discount?: number) => Sale;
  clearCart: () => void;
  holdCart: () => void;
  resumeCart: (heldCartId: string) => void;
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  
  // Empty initial states - no mock data
  const [products] = useState<Product[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [heldCarts, setHeldCarts] = useState<{ id: string; items: CartItem[]; timestamp: string }[]>([]);

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

  const holdCart = () => {
    if (cart.length === 0) return;
    
    const heldCart = {
      id: `held-${Date.now()}`,
      items: [...cart],
      timestamp: new Date().toISOString()
    };
    
    setHeldCarts(prev => [...prev, heldCart]);
    setCart([]);
  };

  const resumeCart = (heldCartId: string) => {
    const heldCart = heldCarts.find(hc => hc.id === heldCartId);
    if (heldCart) {
      setCart(heldCart.items);
      setHeldCarts(prev => prev.filter(hc => hc.id !== heldCartId));
    }
  };

  const addProduct = (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    // Mock implementation - in real app this would call API
    console.log('Adding product:', product);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    // Mock implementation - in real app this would call API
    console.log('Updating product:', id, updates);
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
      holdCart,
      resumeCart,
      heldCarts,
      addProduct,
      updateProduct,
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
