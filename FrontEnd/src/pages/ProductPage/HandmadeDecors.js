// src/pages/ProductPage/HandmadeDecors.js
import React, { useState, useEffect } from "react";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";
import "../../css/Category.css";
import ProductCard from "../../components/ProductCard";
import { productAPI } from "../../services/api";

function HandmadeDecors() {
  // 1. New state to hold the data coming from your database
  const [handmadeDecors, setHandmadeDecors] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedArt, setSelectedArt] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHandmadeDecors = async () => {
      try {
        setLoading(true);
        const response = await productAPI.getAllProducts();
        
        let allProducts = [];
        if (Array.isArray(response)) {
          allProducts = response;
        } else if (response && Array.isArray(response.data)) {
          allProducts = response.data;
        }
        
        // Filter for handmade decors
        const handmadeDecors = allProducts.filter(product => 
          product.category?.toLowerCase().includes('handmade')
        );
        
        setProducts(handmadeDecors);
      } catch (error) {
        console.error("Error fetching handmade decors:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHandmadeDecors();
  }, []);

  const handleView = (art) => setSelectedArt(art);
  const closeOverlay = () => setSelectedArt(null);

  const filteredDecors = products.filter((art) => {
    return art.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <>
      <Navbar />
      <div className="sculpture-page">
        <section className="sculpture-hero">
          <h1>Handmade Decorations</h1>
          
          <div className="database-info">
            <p>Found {products.length} handmade decorations in database</p>
          </div>

          <div className="sculpture-filters">
            <input
              type="text"
              placeholder="Search handmade decors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="sculpture-search-input"
            />
          </div>

          <div className="discovery-grid">
            {loading ? (
              // A simple loading message so the user knows something is happening
              <p>Loading collection...</p>
            ) : filteredDecors.length > 0 ? (
              filteredDecors.map((art) => (
                <ProductCard key={art.id} item={art} onView={handleView} />
              ))
            ) : (
              <p className="no-results">No handmade decorations found.</p>
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
            <p>
              <strong>{selectedArt.artist}</strong>
            </p>
            <p>
              <em>{selectedArt.category}</em>
            </p>
            <p>{selectedArt.description}</p>
            <h3>
              ₱{selectedArt.price ? selectedArt.price.toLocaleString() : 0}
            </h3>
          </div>
        </div>
      )}
    </>
  );
}

export default HandmadeDecors;