import React, { useState, useEffect } from "react";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";
import "../../css/Category.css";
import ProductCard from "../../components/ProductCard";
import { productAPI } from "../../services/api";

function DigitalArts() {
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

      const currentUser = JSON.parse(savedUser);
      setIsSubmitting(true);
  
      const payload = {
          user_id: currentUser.id,
          product_id: product.id,
          quantity: 1,
          name: product.name,
          price: product.price,
          image: product.image_url || product.image
      };

      try {
          const response = await fetch("http://localhost:8082/api/cart/add", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload)
          });

          if (response.ok) {
              alert("Item added to cart successfully!");
              setSelectedArt(null);
          } else {
              alert("Failed to add item to cart.");
          }
      } catch (error) {
          console.error("Add to cart error:", error);
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
            {/* 👇 LOADING CHECK ADDED HERE */}
            {loading ? (
              <div style={{ width: "100%", textAlign: "center", padding: "50px", color: "#666", fontSize: "1.2rem" }}>
                Loading digital arts...
              </div>
            ) : filteredDigitalArts.length > 0 ? (
              filteredDigitalArts.map((art) => (
                <ProductCard key={art.id} item={art} onView={handleView} />
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