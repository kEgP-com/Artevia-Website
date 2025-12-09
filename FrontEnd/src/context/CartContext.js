
import React, { createContext, useState, useContext, useEffect } from 'react';
import { cartAPI } from '../services/api';


const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};


export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(false);

  
  const fetchCart = async () => {
    try {
      setLoading(true);
      const data = await cartAPI.getCart();
      
      console.log('🛒 Cart data received:', data);
      
      
      let items = [];
      if (Array.isArray(data)) {
        items = data;
      } else if (data && data.items) {
        items = data.items;
      } else if (data && data.data) {
        items = data.data;
      } else if (Array.isArray(data.data)) {
        items = data.data;
      }
      
      setCartItems(items);
      
      
      const total = items.reduce((sum, item) => {
        const price = item.product?.price || item.price || 0;
        const quantity = item.quantity || 1;
        return sum + (price * quantity);
      }, 0);
      
      const count = items.reduce((sum, item) => sum + (item.quantity || 1), 0);
      
      setCartTotal(total);
      setCartCount(count);
    } catch (error) {
      console.log('Cart is empty');
      setCartItems([]);
      setCartTotal(0);
      setCartCount(0);
    } finally {
      setLoading(false);
    }
  };

  
  useEffect(() => {
    fetchCart();
  }, []);

  
  const addToCart = async (productId, quantity = 1) => {
    try {
      console.log(`➕ Adding product ${productId} to cart`);
      const result = await cartAPI.addToCart(productId, quantity);
      await fetchCart(); 
      
    
      if (typeof window !== 'undefined') {
        alert('Product added to cart!');
      }
      
      return { success: true, data: result };
    } catch (error) {
      console.error('Add to cart failed:', error);
      
     
      let message = 'Failed to add to cart';
      if (error.response?.status === 401) {
        message = 'Please login to add items to cart';
      } else if (error.response?.data?.message) {
        message = error.response.data.message;
      }
      
      if (typeof window !== 'undefined') {
        alert(`${message}`);
      }
      
      return { success: false, error: message };
    }
  };

  
  const updateQuantity = async (itemId, quantity) => {
    try {
      await cartAPI.updateCartItem(itemId, quantity);
      await fetchCart();
      return { success: true };
    } catch (error) {
      console.error('Update quantity failed:', error);
      return { success: false };
    }
  };

  
  const removeFromCart = async (itemId) => {
    try {
      await cartAPI.removeFromCart(itemId);
      await fetchCart();
      return { success: true };
    } catch (error) {
      console.error('Remove from cart failed:', error);
      return { success: false };
    }
  };

  
  const clearCart = async () => {
    try {
      await cartAPI.clearCart();
      setCartItems([]);
      setCartTotal(0);
      setCartCount(0);
      return { success: true };
    } catch (error) {
      console.error('Clear cart failed:', error);
      return { success: false };
    }
  };

  
  const value = {
    cartItems,
    cartTotal,
    cartCount,
    loading,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    refreshCart: fetchCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};