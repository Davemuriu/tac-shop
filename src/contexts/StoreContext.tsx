
import React, { createContext, useContext, useState } from 'react';
import { Product, Sale, DashboardStats, CartItem } from '@/types';

interface StoreContextType {
  products: Product[];
  sales: Sale[];
  cart: CartItem[];
  stats: DashboardStats;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  completeSale: (paymentMethod: string, discount?: number) => Sale;
  updateProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const useStore = () => {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};

// Mock data
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Tactical Vest',
    sku: 'TAC-VEST-001',
    barcode: '123456789012',
    price: 199.99,
    cost: 120.00,
    quantity: 25,
    category: 'Protection',
    description: 'Heavy-duty tactical vest with MOLLE system',
    active: true,
    lowStockThreshold: 5,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    name: 'Combat Boots',
    sku: 'BOOT-CMB-001',
    barcode: '123456789013',
    price: 149.99,
    cost: 90.00,
    quantity: 3,
    category: 'Footwear',
    description: 'Durable combat boots for all terrain',
    active: true,
    lowStockThreshold: 5,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '3',
    name: 'Flashlight - LED',
    sku: 'LIGHT-LED-001',
    barcode: '123456789014',
    price: 49.99,
    cost: 25.00,
    quantity: 50,
    category: 'Electronics',
    description: 'High-intensity LED flashlight',
    active: true,
    lowStockThreshold: 10,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
];

const mockStats: DashboardStats = {
  todaySales: 1250.50,
  todayTransactions: 23,
  lowStockItems: 2,
  totalProducts: 156,
  weeklyRevenue: [850, 920, 1100, 980, 1250, 1400, 1200],
  topProducts: [
    { id: '1', name: 'Tactical Vest', sales: 15, revenue: 2999.85 },
    { id: '3', name: 'Flashlight - LED', sales: 28, revenue: 1399.72 },
    { id: '2', name: 'Combat Boots', sales: 8, revenue: 1199.92 }
  ]
};

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [sales, setSales] = useState<Sale[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [stats, setStats] = useState<DashboardStats>(mockStats);

  const addToCart = (product: Product, quantity: number = 1) => {
    setCart(prev => {
      const existingItem = prev.find(item => item.product.id === product.id);
      if (existingItem) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.product.id === productId
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const completeSale = (paymentMethod: string, discount: number = 0): Sale => {
    const subtotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    const tax = subtotal * 0.08; // 8% tax
    const total = subtotal + tax - discount;

    const sale: Sale = {
      id: Date.now().toString(),
      receiptNumber: `REC-${Date.now()}`,
      items: cart.map(item => ({
        id: Date.now().toString() + Math.random(),
        productId: item.product.id,
        productName: item.product.name,
        quantity: item.quantity,
        unitPrice: item.product.price,
        total: item.product.price * item.quantity
      })),
      subtotal,
      tax,
      discount,
      total,
      paymentMethod: paymentMethod as any,
      cashierId: '1', // Mock cashier ID
      status: 'completed',
      createdAt: new Date().toISOString()
    };

    setSales(prev => [sale, ...prev]);
    
    // Update inventory
    setProducts(prev =>
      prev.map(product => {
        const cartItem = cart.find(item => item.product.id === product.id);
        if (cartItem) {
          return { ...product, quantity: product.quantity - cartItem.quantity };
        }
        return product;
      })
    );

    clearCart();
    return sale;
  };

  const updateProduct = (updatedProduct: Product) => {
    setProducts(prev =>
      prev.map(product =>
        product.id === updatedProduct.id ? updatedProduct : product
      )
    );
  };

  const deleteProduct = (productId: string) => {
    setProducts(prev => prev.filter(product => product.id !== productId));
  };

  const addProduct = (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newProduct: Product = {
      ...productData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setProducts(prev => [newProduct, ...prev]);
  };

  return (
    <StoreContext.Provider value={{
      products,
      sales,
      cart,
      stats,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      clearCart,
      completeSale,
      updateProduct,
      deleteProduct,
      addProduct
    }}>
      {children}
    </StoreContext.Provider>
  );
};
