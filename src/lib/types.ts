// ==========================================
// Neuravixor POS System — Type Definitions
// ==========================================

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: ProductCategory;
  price: number;
  cost: number;
  stock: number;
  minStock: number;
  image: string;
  description: string;
  status: "active" | "inactive";
  barcode: string;
  unit: string;
  createdAt: string;
}

export type ProductCategory =
  | "beverages"
  | "food"
  | "snacks"
  | "combos"
  | "desserts";

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  taxRate: number;
  discount: number;
  discountType: "percentage" | "fixed";
  total: number;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  customer?: Customer;
  customerId?: string;
  createdAt: string;
  note?: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  total: number;
}

export type PaymentMethod = "cash" | "card" | "mobile";
export type OrderStatus = "completed" | "pending" | "cancelled" | "refunded" | "held";

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  totalOrders: number;
  totalSpent: number;
  loyaltyPoints: number;
  lastVisit: string;
  createdAt: string;
}

export interface DashboardStats {
  todaySales: number;
  todayOrders: number;
  totalCustomers: number;
  avgOrderValue: number;
  salesTrend: number; // percentage change
  ordersTrend: number;
  customersTrend: number;
  avgOrderTrend: number;
}

export interface SalesData {
  name: string;
  sales: number;
  orders: number;
}

export interface CategorySales {
  name: string;
  value: number;
  color: string;
}

export interface TopSellingItem {
  rank: number;
  name: string;
  quantity: number;
  revenue: number;
}

export interface StockMovement {
  id: string;
  productId: string;
  productName: string;
  type: "in" | "out" | "adjustment";
  quantity: number;
  previousStock: number;
  newStock: number;
  note: string;
  date: string;
}

export interface BusinessSettings {
  storeName: string;
  address: string;
  phone: string;
  email: string;
  currency: string;
  currencySymbol: string;
  taxRate: number;
  receiptFooter: string;
}
