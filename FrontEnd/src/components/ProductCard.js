import React, { useState } from "react";

function ProductCard({ item, onView }) {
  const [addedMessage, setAddedMessage] = useState("");


  const getImagePath = (relativePath) => {
    try {
      const cleanPath = relativePath.replace(/^(\.\.\/)+images\//, "");
      return require(`../images/${cleanPath}`);
    } catch (err) {
      console.warn("Image not found:", relativePath);
      return "";
    }
  };


  const handleAddToCart = () => {
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
        image: getImagePath(item.imageUrl), 
        quantity: 1,
      });
    }


    localStorage.setItem("cartItems", JSON.stringify(storedCart));


    setAddedMessage("Added to Cart!");
    setTimeout(() => setAddedMessage(""), 2000);
  };

  return (
    <div className="discovery-frame">
      <img src={getImagePath(item.imageUrl)} alt={item.name} />
      <div className="discovery-overlay">
        <div className="discovery-info">
          <span>{item.name}</span>
          <span>₱{item.price.toLocaleString()}</span>
        </div>

        <div className="discovery-buttons-container">

          <button className="btn-discovery-overlay" onClick={handleAddToCart}>
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
