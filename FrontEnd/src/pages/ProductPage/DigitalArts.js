import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";
import "../../css/Category.css";
import ProductCard from "../../components/ProductCard";
import { productAPI } from "../../services/api";

function DigitalArts() {
  const navigate = useNavigate();
  const [selectedArt, setSelectedArt] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDigitalArts = async () => {
      try {
        setLoading(true);
        const response = await productAPI.getAllProducts();
        
        let allProducts = [];
        if (Array.isArray(response)) {
          allProducts = response;
        } else if (response && Array.isArray(response.data)) {
          allProducts = response.data;
        }
        
        const digitalArts = allProducts.filter(product => 
          product.category?.toLowerCase().includes('digital')
        );
        
        setProducts(digitalArts);
      } catch (error) {
        console.error("Error fetching digital arts:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDigitalArts();
  }, []);

  const handleView = (art) => setSelectedArt(art);

const addToCart = async (product) => {
    
    const savedUser = localStorage.getItem("accountInfo");
    if (!savedUser) {
        alert("Please log in first to add items to your cart.");
        return;
    }

    let userId;
    try {
        const currentUser = JSON.parse(savedUser);
        userId = currentUser.id;
    } catch (e) {
        alert("Session error. Please logout and login again.");
        return;
    }

    setIsSubmitting(true);

  
    const payload = {
        user_id: userId,
        product_id: product.id,
        name: product.name,
        artist: product.artist || 'Unknown',
        type: product.category, 
        price: product.price,
        image: product.image_url, 
        quantity: 1
    };

   
    try {
        const response = await fetch('http://localhost:8082/api/cart', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const result = await response.json();

        if (response.ok) {
            
            alert(`Success! ${product.name} added to cart.`); 
            
           
            navigate("/cart"); 
            
        } else {
            console.error("Server Error:", result);
            alert("Failed to add: " + (result.message || "Unknown error"));
        }

    } catch (error) {
        console.error("Connection Error:", error);
        alert("Cannot connect to server.");
    } finally {
        setIsSubmitting(false);
    }
  };

  const closeOverlay = () => setSelectedArt(null);

  const filteredDigitalArts = products.filter((art) => {
    return art.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <>
      <Navbar />
      <div className="sculpture-page">
        <section className="sculpture-hero">
          <h1>Digital Arts</h1>
          <div className="sculpture-filters">
            <input
              type="text"
              placeholder="Search digital arts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="sculpture-search-input"
            />
          </div>
          <div className="discovery-grid">
          
            {loading ? (
              <div style={{ width: "100%", textAlign: "center", padding: "50px", color: "#666", fontSize: "1.2rem" }}>
                Loading digital arts...
              </div>
            ) : filteredDigitalArts.length > 0 ? (
              filteredDigitalArts.map((art) => (
                  <ProductCard 
                      key={art.id} 
                      item={art} 
                      onView={handleView} 
                      onAddToCart={addToCart}
                  />
                ))
            ) : (
              <p className="no-results">No digital arts found.</p>
            )}
          </div>
        </section>
      </div>
      <Footer />
      {selectedArt && (
        <div className="overlay-backdrop" onClick={closeOverlay}>
          <div className="overlay-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={closeOverlay}>×</button>
            <img
              src={selectedArt.image_url || '/images/default-product.jpg'}
              alt={selectedArt.name}
              className="overlay-image"
            />
            <h2>{selectedArt.name}</h2>
            <p><strong>{selectedArt.artist}</strong></p>
            <p><em>{selectedArt.category}</em></p>
            <p>{selectedArt.description}</p>
            <h3>₱{selectedArt.price ? selectedArt.price.toLocaleString() : 0}</h3>
            <button 
                className="buy-now-btn"
                style={{
                  backgroundColor: '#e49e69', color: 'white', padding: '10px 20px', 
                  border: 'none', cursor: 'pointer', marginTop: '15px', width: '100%', fontSize: '1.1rem'
                }}
                onClick={() => addToCart(selectedArt)} 
                disabled={isSubmitting}
            >
                {isSubmitting ? "Adding..." : "Add to Cart"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default DigitalArts;