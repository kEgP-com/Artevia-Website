
import React, { useState } from "react";


const API_URL = "http://localhost:8082";

function ProductCard({ item, onView, onAddToCart }) {
  const [addedMessage, setAddedMessage] = useState("");

  const getImageUrl = (item) => {
    if (!item) return '/images/default-product.jpg';
    
  
    if (item.image_url) {
      if (item.image_url.startsWith('http')) {
        return item.image_url;
      }
     
      if (item.image_url.startsWith('/')) {
        return `${API_URL}${item.image_url}`;
      }
      if (item.image_url.startsWith('storage/')) {
        return `${API_URL}/${item.image_url}`;
      }
    }
    
   
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
    
    if (onAddToCart) {
        onAddToCart(item);
        return; 
    }

    
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