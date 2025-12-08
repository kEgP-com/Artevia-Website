// src/components/ProductCard.js
import React, { useState } from "react";

// Updated Port to 8082 based on your previous files
const API_URL = "http://localhost:8082";

function ProductCard({ item, onView, onAddToCart }) {
  const [addedMessage, setAddedMessage] = useState("");

  const getImageUrl = (item) => {
    if (!item) return '/images/default-product.jpg';
    
    // If from API (Laravel)
    if (item.image_url) {
      if (item.image_url.startsWith('http')) {
        return item.image_url;
      }
      // 👇 FIXED: Changed to API_URL (8082) para lumabas ang image
      if (item.image_url.startsWith('/')) {
        return `${API_URL}${item.image_url}`;
      }
      if (item.image_url.startsWith('storage/')) {
        return `${API_URL}/${item.image_url}`;
      }
    }
    
    // Fallback to local images
    if (item.imageUrl) {
      try {
        const images = require.context("../images", true);
        const cleanPath = item.imageUrl.replace(/^(\.\.\/)+images\//, "");
        return images(`./${cleanPath}`);
      } catch (err) {
        console.warn("Local image not found:", item.imageUrl);
      }
    }
    
    return '/images/default-product.jpg';
  };

  const handleAddToCart = () => {
    // 1. PRIORITY: Kung may pinasang onAddToCart galing sa Parent (Category Pages)
    // Ito ang magpapatakbo ng logic papuntang Cart Page.
    if (onAddToCart) {
        onAddToCart(item);
        return; 
    }

    // 2. FALLBACK: Kung walang parent function, save to LocalStorage (Old logic)
    const storedCart = JSON.parse(localStorage.getItem("cartItems")) || [];
    const existingIndex = storedCart.findIndex((i) => i.id === item.id);

    if (existingIndex >= 0) {
      storedCart[existingIndex].quantity =
        (storedCart[existingIndex].quantity || 1) + 1;
    } else {
      storedCart.push({
        id: item.id,
        name: item.name,
        artist: item.artist || "Unknown",
        type: item.category || "Art",
        price: item.price,
        image: getImageUrl(item), 
        quantity: 1,
      });
    }

    localStorage.setItem("cartItems", JSON.stringify(storedCart));

    setAddedMessage("Added to Cart!");
    setTimeout(() => setAddedMessage(""), 2000);
  };

  return (
    <div className="discovery-frame">
      <img 
        src={getImageUrl(item)} 
        alt={item.name}
        onError={(e) => {
          e.target.src = '/images/default-product.jpg';
        }}
      />
      <div className="discovery-overlay">
        <div className="discovery-info">
          <span>{item.name}</span>
          <span>₱{parseFloat(item.price).toLocaleString()}</span>
        </div>

        <div className="discovery-buttons-container">
          {/* Ito ang pipindutin ng user */}
          <button 
            className="btn-discovery-overlay" 
            onClick={handleAddToCart}
          >
            ADD TO CART
          </button>

          <button
            className="btn-discovery-overlay"
            onClick={() => onView(item)}
          >
            VIEW
          </button>
        </div>
      </div>

      {addedMessage && (
        <div className="added-message">
          {addedMessage}
        </div>
      )}
    </div>
  );
}

export default ProductCard;