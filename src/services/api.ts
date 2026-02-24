import type { Product, Category, Order, User, DashboardStats, PaginatedResponse, ProductFilters } from '@/types';
import { 
  products, 
  categories, 
  orders, 
  users, 
  dashboardStats,
  getProductBySlug,
  getProductById,
  getProductsByCategory,
  getRelatedProducts,
  getBestsellers,
  getNewArrivals,
  getOnSale,
  searchProducts 
} from '@/data/mockData';

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Products API
export const productApi = {
  getAll: async (page = 1, limit = 12, filters?: ProductFilters): Promise<PaginatedResponse<Product>> => {
    await delay(500);
    
    let filteredProducts = [...products];
    
    // Apply filters
    if (filters) {
      if (filters.categories.length > 0) {
        filteredProducts = filteredProducts.filter(p => 
          filters.categories.includes(p.category.slug)
        );
      }
      
      if (filters.skinTypes.length > 0) {
        filteredProducts = filteredProducts.filter(p =>
          p.skinTypes.some(st => filters.skinTypes.includes(st))
        );
      }
      
      if (filters.concerns.length > 0) {
        filteredProducts = filteredProducts.filter(p =>
          p.concerns.some(c => filters.concerns.includes(c))
        );
      }
      
      if (filters.brands.length > 0) {
        filteredProducts = filteredProducts.filter(p =>
          filters.brands.includes(p.brand)
        );
      }
      
      if (filters.priceRange) {
        filteredProducts = filteredProducts.filter(p =>
          p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]
        );
      }
      
      if (filters.rating > 0) {
        filteredProducts = filteredProducts.filter(p =>
          p.rating >= filters.rating
        );
      }
      
      if (filters.search) {
        const query = filters.search.toLowerCase();
        filteredProducts = filteredProducts.filter(p =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.category.name.toLowerCase().includes(query)
        );
      }
      
      // Sort
      switch (filters.sortBy) {
        case 'price-asc':
          filteredProducts.sort((a, b) => a.price - b.price);
          break;
        case 'price-desc':
          filteredProducts.sort((a, b) => b.price - a.price);
          break;
        case 'rating':
          filteredProducts.sort((a, b) => b.rating - a.rating);
          break;
        case 'newest':
          filteredProducts.sort((a, b) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          break;
        case 'bestseller':
          filteredProducts.sort((a, b) => 
            (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0)
          );
          break;
      }
    }
    
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedProducts = filteredProducts.slice(start, end);
    
    return {
      data: paginatedProducts,
      total: filteredProducts.length,
      page,
      limit,
      totalPages: Math.ceil(filteredProducts.length / limit),
    };
  },

  getBySlug: async (slug: string): Promise<Product | null> => {
    await delay(300);
    return getProductBySlug(slug) || null;
  },

  getById: async (id: string): Promise<Product | null> => {
    await delay(300);
    return getProductById(id) || null;
  },

  getByCategory: async (categorySlug: string, page = 1, limit = 12): Promise<PaginatedResponse<Product>> => {
    await delay(500);
    const filteredProducts = getProductsByCategory(categorySlug);
    const start = (page - 1) * limit;
    const end = start + limit;
    
    return {
      data: filteredProducts.slice(start, end),
      total: filteredProducts.length,
      page,
      limit,
      totalPages: Math.ceil(filteredProducts.length / limit),
    };
  },

  getRelated: async (productId: string, limit = 4): Promise<Product[]> => {
    await delay(400);
    return getRelatedProducts(productId, limit);
  },

  getBestsellers: async (limit = 6): Promise<Product[]> => {
    await delay(400);
    return getBestsellers(limit);
  },

  getNewArrivals: async (limit = 6): Promise<Product[]> => {
    await delay(400);
    return getNewArrivals(limit);
  },

  getOnSale: async (limit = 6): Promise<Product[]> => {
    await delay(400);
    return getOnSale(limit);
  },

  search: async (query: string): Promise<Product[]> => {
    await delay(300);
    return searchProducts(query);
  },

  // Admin operations
  create: async (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> => {
    await delay(800);
    const newProduct: Product = {
      ...product as any,
      id: `prod-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    products.push(newProduct);
    return newProduct;
  },

  update: async (id: string, updates: Partial<Product>): Promise<Product | null> => {
    await delay(800);
    const index = products.findIndex(p => p.id === id);
    if (index === -1) return null;
    
    products[index] = {
      ...products[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    return products[index];
  },

  delete: async (id: string): Promise<boolean> => {
    await delay(600);
    const index = products.findIndex(p => p.id === id);
    if (index === -1) return false;
    products.splice(index, 1);
    return true;
  },
};

// Categories API
export const categoryApi = {
  getAll: async (): Promise<Category[]> => {
    await delay(300);
    return categories;
  },

  getBySlug: async (slug: string): Promise<Category | null> => {
    await delay(300);
    return categories.find(c => c.slug === slug) || null;
  },

  // Admin operations
  create: async (category: Omit<Category, 'id'>): Promise<Category> => {
    await delay(600);
    const newCategory: Category = {
      ...category,
      id: `cat-${Date.now()}`,
    };
    categories.push(newCategory);
    return newCategory;
  },

  update: async (id: string, updates: Partial<Category>): Promise<Category | null> => {
    await delay(600);
    const index = categories.findIndex(c => c.id === id);
    if (index === -1) return null;
    categories[index] = { ...categories[index], ...updates };
    return categories[index];
  },

  delete: async (id: string): Promise<boolean> => {
    await delay(500);
    const index = categories.findIndex(c => c.id === id);
    if (index === -1) return false;
    categories.splice(index, 1);
    return true;
  },
};

// Orders API
export const orderApi = {
  getAll: async (page = 1, limit = 10): Promise<PaginatedResponse<Order>> => {
    await delay(500);
    const start = (page - 1) * limit;
    const end = start + limit;
    
    return {
      data: orders.slice(start, end),
      total: orders.length,
      page,
      limit,
      totalPages: Math.ceil(orders.length / limit),
    };
  },

  getById: async (id: string): Promise<Order | null> => {
    await delay(400);
    return orders.find(o => o.id === id) || null;
  },

  getByOrderNumber: async (orderNumber: string): Promise<Order | null> => {
    await delay(400);
    return orders.find(o => o.orderNumber === orderNumber) || null;
  },

  create: async (order: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt'>): Promise<Order> => {
    await delay(800);
    const orderNumber = `LB-${new Date().getFullYear()}-${String(orders.length + 1).padStart(4, '0')}`;
    const newOrder: Order = {
      ...order as any,
      id: `ord-${Date.now()}`,
      orderNumber,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    orders.unshift(newOrder);
    return newOrder;
  },

  updateStatus: async (id: string, status: Order['status']): Promise<Order | null> => {
    await delay(600);
    const index = orders.findIndex(o => o.id === id);
    if (index === -1) return null;
    orders[index].status = status;
    orders[index].updatedAt = new Date().toISOString();
    return orders[index];
  },

  addTracking: async (id: string, trackingNumber: string): Promise<Order | null> => {
    await delay(600);
    const index = orders.findIndex(o => o.id === id);
    if (index === -1) return null;
    orders[index].trackingNumber = trackingNumber;
    orders[index].updatedAt = new Date().toISOString();
    return orders[index];
  },
};

// Users API
export const userApi = {
  getAll: async (page = 1, limit = 10): Promise<PaginatedResponse<User>> => {
    await delay(500);
    const start = (page - 1) * limit;
    const end = start + limit;
    
    return {
      data: users.slice(start, end),
      total: users.length,
      page,
      limit,
      totalPages: Math.ceil(users.length / limit),
    };
  },

  getById: async (id: string): Promise<User | null> => {
    await delay(400);
    return users.find(u => u.id === id) || null;
  },

  update: async (id: string, updates: Partial<User>): Promise<User | null> => {
    await delay(600);
    const index = users.findIndex(u => u.id === id);
    if (index === -1) return null;
    users[index] = { 
      ...users[index], 
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    return users[index];
  },

  delete: async (id: string): Promise<boolean> => {
    await delay(500);
    const index = users.findIndex(u => u.id === id);
    if (index === -1) return false;
    users.splice(index, 1);
    return true;
  },
};

// Dashboard API
export const dashboardApi = {
  getStats: async (): Promise<DashboardStats> => {
    await delay(600);
    return dashboardStats;
  },

  getSalesChart: async (_period: 'week' | 'month' | 'year' = 'month') => {
    await delay(400);
    return dashboardStats.salesChart;
  },
};

// Export all APIs
export const api = {
  products: productApi,
  categories: categoryApi,
  orders: orderApi,
  users: userApi,
  dashboard: dashboardApi,
};

export default api;
