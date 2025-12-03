// src/pages/ProductPage/Sketch.js
import React, { useState, useEffect } from "react";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";
import "../../css/Category.css";
import ProductCard from "../../components/ProductCard";
import { productAPI } from "../../services/api";

function Sketch() {
  const [selectedArt, setSelectedArt] = useState(null);
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
        
        // Filter for sketches
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
          
          <div className="database-info">
            <p>Found {products.length} sketches in database</p>
          </div>

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
            {filteredSketches.length > 0 ? (
              filteredSketches.map((art) => (
                <ProductCard key={art.id} item={art} onView={handleView} />
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
            <h3>₱{selectedArt.price.toLocaleString()}</h3>
          </div>
        </div>
      )}
    </>
  );
}

export default Sketch;