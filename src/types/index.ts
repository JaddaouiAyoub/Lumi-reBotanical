// Product Types
export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  price: number;
  originalPrice?: number;
  images: ProductImage[];
  category: Category;
  subcategory?: string;
  brand: string;
  sku: string;
  stock: number;
  rating: number;
  reviewCount: number;
  reviews: Review[];
  ingredients: string[];
  benefits: string[];
  howToUse: string;
  skinTypes: SkinType[];
  concerns: SkinConcern[];
  isNew: boolean;
  isBestseller: boolean;
  isOnSale: boolean;
  discount?: number;
  weight: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductImage {
  id: string;
  url: string;
  alt: string;
  isMain: boolean;
  type: 'packshot' | 'lifestyle' | 'texture';
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  icon: string;
  productCount: number;
  subcategories: Subcategory[];
}

export interface Subcategory {
  id: string;
  name: string;
  slug: string;
}

export type SkinType = 'all' | 'dry' | 'oily' | 'combination' | 'sensitive' | 'normal';
export type SkinConcern = 'hydration' | 'anti-aging' | 'brightening' | 'acne' | 'sensitivity' | 'pores' | 'dark-spots' | 'firmness';

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  title: string;
  comment: string;
  helpful: number;
  verified: boolean;
  createdAt: string;
}

// Cart Types
export interface CartItem {
  product: Product;
  quantity: number;
  selected: boolean;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  itemCount: number;
}

// Wishlist Types
export interface WishlistItem {
  product: Product;
  addedAt: string;
}

// Order Types
export interface Order {
  id: string;
  orderNumber: string;
  userId?: string;
  items: OrderItem[];
  shippingAddress: Address;
  billingAddress: Address;
  paymentMethod: PaymentMethod;
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
  status: OrderStatus;
  trackingNumber?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  product: Product;
  quantity: number;
  price: number;
  total: number;
}

export interface Address {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface PaymentMethod {
  type: 'card' | 'paypal' | 'cod';
  cardNumber?: string;
  cardHolder?: string;
  expiryDate?: string;
  cvv?: string;
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';

// User Types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  phone?: string;
  addresses: Address[];
  defaultAddressId?: string;
  wishlist: string[];
  orders: string[];
  role: 'user' | 'admin';
  createdAt: string;
  updatedAt: string;
}

// Admin Types
export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalCustomers: number;
  revenueChange: number;
  ordersChange: number;
  productsChange: number;
  customersChange: number;
  recentOrders: Order[];
  topProducts: Product[];
  salesChart: ChartData[];
}

export interface ChartData {
  label: string;
  value: number;
  date?: string;
}

// Filter Types
export interface ProductFilters {
  categories: string[];
  skinTypes: SkinType[];
  concerns: SkinConcern[];
  priceRange: [number, number];
  brands: string[];
  rating: number;
  sortBy: 'newest' | 'price-asc' | 'price-desc' | 'rating' | 'bestseller';
  search: string;
}

// Theme Types
export type Theme = 'light' | 'dark' | 'system';

// Animation Types
export interface AnimationConfig {
  initial?: object;
  animate?: object;
  exit?: object;
  transition?: object;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: string[];
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
