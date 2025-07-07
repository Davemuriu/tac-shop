
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'manager' | 'cashier';
  avatar?: string;
  permissions: string[];
  pin?: string;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  barcode?: string;
  price: number;
  cost: number;
  quantity: number;
  category: string;
  description?: string;
  image?: string;
  active: boolean;
  lowStockThreshold: number;
  reorderLevel: number;
  variants?: ProductVariant[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductVariant {
  id: string;
  name: string;
  value: string;
  priceModifier: number;
  quantityModifier: number;
}

export interface Sale {
  id: string;
  receiptNumber: string;
  items: SaleItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  paymentMethod: 'cash' | 'card' | 'digital' | 'mpesa';
  cashierId: string;
  customerId?: string;
  status: 'completed' | 'pending' | 'refunded' | 'held';
  createdAt: string;
  notes?: string;
}

export interface SaleItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  total: number;
  variantId?: string;
}

export interface Customer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  totalPurchases: number;
  lastPurchase?: string;
}

export interface DashboardStats {
  todaySales: number;
  todayTransactions: number;
  lowStockItems: number;
  totalProducts: number;
  weeklyRevenue: number[];
  topProducts: Array<{
    id: string;
    name: string;
    sales: number;
    revenue: number;
  }>;
}

export interface CartItem {
  product: Product;
  quantity: number;
  discount: number;
  priceOverride?: number;
  variantId?: string;
}

export interface Receipt {
  id: string;
  saleId: string;
  receiptNumber: string;
  items: SaleItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  paymentMethod: string;
  cashier: string;
  timestamp: string;
  businessInfo: {
    name: string;
    address: string;
    phone: string;
    email: string;
    logo?: string;
  };
}

export interface HeldCart {
  id: string;
  items: CartItem[];
  customerId?: string;
  notes?: string;
  createdAt: string;
}

export interface SystemSettings {
  shopName: string;
  logo?: string;
  address: string;
  phone: string;
  email: string;
  taxRate: number;
  currency: string;
  receiptFooter?: string;
}
