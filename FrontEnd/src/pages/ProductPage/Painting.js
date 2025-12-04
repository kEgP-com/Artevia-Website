// src/pages/ProductPage/Painting.js
import React, { useState, useEffect } from "react";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";
import "../../css/Category.css";
import ProductCard from "../../components/ProductCard";
import { productAPI } from "../../services/api";

function Painting() {
  // 1. State for API data
  const [paintings, setPaintings] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedArt, setSelectedArt] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPaintings = async () => {
      try {
        setLoading(true);
        const response = await productAPI.getAllProducts();
        
        let allProducts = [];
        if (Array.isArray(response)) {
          allProducts = response;
        } else if (response && Array.isArray(response.data)) {
          allProducts = response.data;
        }
        
        // Filter for paintings
        const paintings = allProducts.filter(product => 
          product.category?.toLowerCase().includes('painting')
        );
        
        setProducts(paintings);
      } catch (error) {
        console.error("Error fetching paintings:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPaintings();
  }, []);

  const handleView = (art) => setSelectedArt(art);
  const closeOverlay = () => setSelectedArt(null);

  const filteredPaintings = products.filter((art) => {
    return art.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="sculpture-page">
          <section className="sculpture-hero">
            <h1>Painting</h1>
            <p>Loading paintings from database...</p>
          </section>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="sculpture-page">
        <section className="sculpture-hero">
          <h1>Painting</h1>
          
          <div className="database-info">
            <p>Found {products.length} paintings in database</p>
          </div>

          <div className="sculpture-filters">
            <input
              type="text"
              placeholder="Search paintings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="sculpture-search-input"
            />
          </div>

          <div className="discovery-grid">
            {filteredPaintings.length > 0 ? (
              filteredPaintings.map((art) => (
                <ProductCard key={art.id} item={art} onView={handleView} />
              ))
            ) : (
              <p className="no-results">No paintings found.</p>
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
          </div>
        </div>
      )}
    </>
  );
}

export default Painting;