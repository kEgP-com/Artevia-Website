// src/components/ProductCard.js - UPDATED
import React from 'react';
import './ProductCard.css';

function ProductCard({ item, onView }) {
  const handleAddToCart = async (e) => {
    e.stopPropagation();
    
    try {
      // Import API
      const { cartAPI } = await import('../services/api');
      
      // Call your Laravel API endpoint
      await cartAPI.addToCart(item.id, 1);
      
      alert(`✅ "${item.name}" added to cart!`);
    } catch (error) {
      console.error('Add to cart error:', error);
      
      if (error.response?.status === 401) {
        alert('Please login to add items to cart');
      } else {
        alert('Failed to add to cart. Please try again.');
      }
    }
  };

  // Fix image URLs from database
  const getImageUrl = () => {
    if (!item.image_url) {
      return '/images/default-product.jpg';
    }
    
    // Your database has paths like: /images/Handmade Decor/Anava.png
    if (item.image_url.startsWith('/images/')) {
      return `http://localhost:8000${item.image_url}`;
    }
    
    return item.image_url;
  };

  return (
    <div className="product-card" onClick={() => onView(item)}>
      <div className="product-image">
        <img 
          src={getImageUrl()} 
          alt={item.name}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/images/default-product.jpg';
          }}
        />
      </div>
      <div className="product-info">
        <h3 className="product-name">{item.name}</h3>
        <p className="product-artist">{item.artist || 'Unknown Artist'}</p>
        <p className="product-category">{item.category}</p>
        <div className="product-price">₱{parseFloat(item.price).toLocaleString()}</div>
        <button 
          className="add-to-cart-btn"
          onClick={handleAddToCart}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}

export default ProductCard;