/* * ------------------------------------------------------------------
 * reantaso-product-integration
 * COMPONENT: DigitalArts (Connected to Laravel Backend)
 * ------------------------------------------------------------------
 */

import React, { useState, useEffect } from "react";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";
import "../../css/Category.css";
import ProductCard from "../../components/ProductCard";

function DigitalArts() {
  // State for data and UI
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedArt, setSelectedArt] = useState(null);

  // WATERMARK LOGGING & DATA FETCHING
  useEffect(() => {
    const fetchDigitalArts = async () => {
      console.log("🚀 Launching: reantaso-product-integration (DigitalArts)");

      try {
        setLoading(true);
        // Connect to Laravel Backend
        const response = await fetch("http://localhost:8000/api/products");

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("✅ Digital Arts Data received:", data);

        // Handle Laravel response structure
        const allProducts = Array.isArray(data) ? data : (data.data || []);

        // Filter specifically for Digital Art categories
        // We check for "Digital" in the name, or specific types like "3D Art", "Vector", etc.
        const digitalOnly = allProducts.filter(product => {
          const cat = product.category || "";
          const validCategories = ["Digital Art", "3D Art", "Digital Painting", "Vector Art", "Concept Art"];
          return validCategories.includes(cat) || cat.toLowerCase().includes("digital");
        });
        
        setProducts(digitalOnly);

      } catch (error) {
        console.error("❌ Connection Failed:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDigitalArts();
  }, []);

  // Image URL Processor
  const getImageUrl = (item) => {
    if (!item || !item.image_url) return "/images/default-product.jpg";
    
    // If it's a full URL, return it
    if (item.image_url.startsWith("http")) return item.image_url;

    // If it's a relative path from Laravel Storage
    const cleanPath = item.image_url.startsWith('/') ? item.image_url.substring(1) : item.image_url;
    return `http://localhost:8000/${cleanPath}`;
  };

  const handleView = (art) => setSelectedArt(art);
  const closeOverlay = () => setSelectedArt(null);

  // Search Filter
  const filteredDigitalArts = products.filter((art) => {
    return art.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <>
      <Navbar />
      <div className="sculpture-page">
        <section className="sculpture-hero">
          <h1>Digital Arts</h1>
          
          {/* Search Bar */}
          <div className="sculpture-filters">
            <input
              type="text"
              placeholder="Search digital arts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="sculpture-search-input"
            />
          </div>

          {/* Product Grid */}
          <div className="discovery-grid">
            {loading ? (
              <div className="loading-container">
                <p>Loading Digital Arts...</p>
              </div>
            ) : filteredDigitalArts.length > 0 ? (
              filteredDigitalArts.map((art) => (
                <ProductCard 
                  key={art.id} 
                  item={{
                    ...art,
                    // Inject processed URL
                    image_url: getImageUrl(art)
                  }} 
                  onView={handleView} 
                />
              ))
            ) : (
              <div className="no-products">
                <p>No digital arts found.</p>
              </div>
            )}
          </div>
        </section>
      </div>

      <Footer />

      {/* Overlay */}
      {selectedArt && (
        <div className="overlay-backdrop" onClick={closeOverlay}>
          <div className="overlay-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={closeOverlay}>×</button>
            
            <img
              src={getImageUrl(selectedArt)}
              alt={selectedArt.name}
              className="overlay-image"
            />
            
            <h2>{selectedArt.name}</h2>
            <p><strong>{selectedArt.artist}</strong></p>
            <p><em>{selectedArt.category}</em></p>
            <p>{selectedArt.description}</p>
            <h3>₱{parseFloat(selectedArt.price).toLocaleString()}</h3>
            
            <button 
              className="buy-now-btn"
              onClick={() => {
                alert(`"${selectedArt.name}" added to cart!`);
                closeOverlay();
              }}
            >
              Add to Cart
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default DigitalArts;
