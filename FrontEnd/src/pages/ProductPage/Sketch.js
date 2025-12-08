import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";
import "../../css/Category.css";
import ProductCard from "../../components/ProductCard";
import { productAPI } from "../../services/api";

function Sketch() {
  const navigate = useNavigate();
  const [selectedArt, setSelectedArt] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSketches = async () => {
      try {
        setLoading(true);
        const response = await productAPI.getAllProducts();
        
        let allProducts = [];
        if (Array.isArray(response)) {
          allProducts = response;
        } else if (response && Array.isArray(response.data)) {
          allProducts = response.data;
        }
        
        const sketches = allProducts.filter(product => 
          product.category?.toLowerCase().includes('sketch') ||
          product.category?.toLowerCase().includes('illustration')
        );
        
        setProducts(sketches);
      } catch (error) {
        console.error("Error fetching sketches:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSketches();
  }, []);

  const handleView = (art) => setSelectedArt(art);
  
  const addToCart = async (product) => {
    // A. Check User Login
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

    // B. Prepare Payload
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

    // C. Send to Backend
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
            // Optional: Pwede mong tanggalin ang alert kung gusto mo diretso agad
            alert(`✅ Success! ${product.name} added to cart.`); 
            
            // 👇 ITO ANG MAGDADALA SA USER SA CART PAGE
            navigate("/cart"); 
            
        } else {
            console.error("Server Error:", result);
            alert("❌ Failed to add: " + (result.message || "Unknown error"));
        }

    } catch (error) {
        console.error("Connection Error:", error);
        alert("❌ Cannot connect to server.");
    } finally {
        setIsSubmitting(false);
    }
  };

  const closeOverlay = () => setSelectedArt(null);

  const filteredSketches = products.filter((art) => {
    return art.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <>
      <Navbar />
      <div className="sculpture-page">
        <section className="sculpture-hero">
          <h1>Illustrations & Sketch</h1>

          <div className="sculpture-filters">
            <input
              type="text"
              placeholder="Search sketches..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="sculpture-search-input"
            />
          </div>

          <div className="discovery-grid">
            {/* 👇 LOADING CHECK ADDED HERE */}
            {loading ? (
              <div style={{ width: "100%", textAlign: "center", padding: "50px", color: "#666", fontSize: "1.2rem" }}>
                Loading sketches...
              </div>
            ) : filteredSketches.length > 0 ? (
              filteredSketches.map((art) => (
                <ProductCard 
                    key={art.id} 
                    item={art} 
                    onView={handleView} 
                    onAddToCart={addToCart} // 👈 ITO ANG SUSI! Ipinapasa natin yung function.
                />
              ))
            ) : (
              <p className="no-results">No sketches found.</p>
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
                  backgroundColor: '#e49e69', 
                  color: 'white', 
                  padding: '10px 20px', 
                  border: 'none', 
                  cursor: 'pointer',
                  marginTop: '15px',
                  width: '100%',
                  fontSize: '1.1rem'
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

export default Sketch;