// src/services/api.js - UPDATED FOR YOUR ENDPOINTS
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`📡 API Call: ${config.method.toUpperCase()} ${config.url}`);
    
    // Add auth token if exists
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// PRODUCT API - MATCHING YOUR ROUTES
export const productAPI = {
  // Get all products - matches Route::get('/products', [ProductController::class, 'index']);
  getAllProducts: async () => {
    try {
      const response = await api.get('/products');
      console.log('✅ Products API Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Failed to fetch products:', error.response?.data || error.message);
      throw error;
    }
  },

  // Get single product - matches Route::get('/products/{id}', [ProductController::class, 'show']);
  getProductById: async (id) => {
    try {
      const response = await api.get(`/products/${id}`);
      return response.data;
    } catch (error) {
      console.error(`❌ Failed to fetch product ${id}:`, error);
      throw error;
    }
  },

  // Search products (if you have search functionality)
  searchProducts: async (query) => {
    try {
      const response = await api.get('/products', {
        params: { search: query }
      });
      return response.data;
    } catch (error) {
      console.error('❌ Search failed:', error);
      return [];
    }
  },
};

// CART API - MATCHING YOUR ROUTES
export const cartAPI = {
  // Get cart - matches Route::get('/cart', [CartController::class, 'index']);
  getCart: async () => {
    try {
      const response = await api.get('/cart');
      return response.data;
    } catch (error) {
      console.error('❌ Cart error:', error.response?.data || 'Cart empty or not logged in');
      return { items: [], total: 0 };
    }
  },

  // Add to cart - matches Route::post('/cart', [CartController::class, 'addToCart']);
  addToCart: async (productId, quantity = 1) => {
    try {
      const response = await api.post('/cart', {
        product_id: productId,
        quantity: quantity
      });
      return response.data;
    } catch (error) {
      console.error('❌ Add to cart failed:', error.response?.data || error.message);
      throw error;
    }
  },

  // Update quantity - matches Route::put('/cart/{id}', [CartController::class, 'updateQuantity']);
  updateCartItem: async (itemId, quantity) => {
    try {
      const response = await api.put(`/cart/${itemId}`, {
        quantity: quantity
      });
      return response.data;
    } catch (error) {
      console.error('❌ Update cart failed:', error);
      throw error;
    }
  },

  // Remove from cart - matches Route::delete('/cart/{id}', [CartController::class, 'destroy']);
  removeFromCart: async (itemId) => {
    try {
      const response = await api.delete(`/cart/${itemId}`);
      return response.data;
    } catch (error) {
      console.error('❌ Remove from cart failed:', error);
      throw error;
    }
  },
};

// AUTH API - MATCHING YOUR ROUTES
export const authAPI = {
  // Login - matches Route::post('/login', [UsersInfoController::class, 'login']);
  login: async (email, password) => {
    try {
      const response = await api.post('/login', {
        email: email,
        password: password
      });
      
      // Save token if returned
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return response.data;
    } catch (error) {
      console.error('❌ Login failed:', error.response?.data || error.message);
      throw error;
    }
  },

  // Register - matches Route::post('/register', [UsersInfoController::class, 'register']);
  register: async (userData) => {
    try {
      const response = await api.post('/register', userData);
      return response.data;
    } catch (error) {
      console.error('❌ Registration failed:', error.response?.data || error.message);
      throw error;
    }
  },

  // Get current user (if you have this endpoint)
  getCurrentUser: async () => {
    try {
      const response = await api.get('/user'); // Check if this endpoint exists
      return response.data;
    } catch (error) {
      console.error('❌ Get user failed:', error);
      return null;
    }
  },
};

// ORDER API - MATCHING YOUR ROUTES
export const orderAPI = {
  // Create order - matches Route::post('/orders', [OrderController::class, 'store']);
  createOrder: async (orderData) => {
    try {
      const response = await api.post('/orders', orderData);
      return response.data;
    } catch (error) {
      console.error('❌ Create order failed:', error);
      throw error;
    }
  },

  // Get orders - matches Route::get('/orders', [OrderController::class, 'index']);
  getOrders: async () => {
    try {
      const response = await api.get('/orders');
      return response.data;
    } catch (error) {
      console.error('❌ Get orders failed:', error);
      return [];
    }
  },
};

export default api;