// src/pages/ProductPage/Sculpture.js
import React, { useState, useEffect } from "react";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";
import "../../css/Category.css";
import ProductCard from "../../components/ProductCard";
import { productAPI } from "../../services/api"; // ADD THIS

function Sculpture() {
  const [selectedArt, setSelectedArt] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [products, setProducts] = useState([]); // CHANGE: State instead of import
  const [loading, setLoading] = useState(false);

  // ADD: Fetch from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await productAPI.getAllProducts();
        
        // Filter for sculptures
        let allProducts = [];
        if (Array.isArray(data)) {
          allProducts = data;
        } else if (data && Array.isArray(data.data)) {
          allProducts = data.data;
        }
        
        const sculptures = allProducts.filter(product => 
          product.category?.toLowerCase().includes('sculpture')
        );
        
        setProducts(sculptures);
      } catch (error) {
        console.error("Error fetching sculptures:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleView = (art) => setSelectedArt(art);
  const closeOverlay = () => setSelectedArt(null);

  // KEEP ORIGINAL filtering
  const filteredSculptures = products.filter((art) => {
    const matchesSearch = art.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === "All" || art.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  // KEEP ORIGINAL image handling
  const images = require.context("../../images", true);
  const getImagePath = (path) => {
    try {
      const cleanPath = path.replace(/^(\.\.\/)+images\//, "");
      return images(`./${cleanPath}`);
    } catch (err) {
      console.warn("Image not found:", path);
      return "";
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="sculpture-page">
          <section className="sculpture-hero">
            <h1>Sculptures</h1>
            <p style={{ textAlign: 'center' }}>Loading...</p>
          </section>
        </div>
        <Footer />
      </>
    );
  }

  // RETURN ORIGINAL JSX
  return (
    <>
      <Navbar />
      <div className="sculpture-page">
        <section className="sculpture-hero">
          <h1>Sculptures</h1>

          <div className="sculpture-filters">
            <input
              type="text"
              placeholder="Search sculptures..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="sculpture-search-input"
            />
            <select
              className="sculpture-filter-select"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="All">All Categories</option>
              <option value="Sculpture">Sculpture</option>
              <option value="Marble">Marble</option>
              <option value="Wood">Wood</option>
              <option value="Steel">Steel</option>
            </select>
            <button className="sculpture-search-btn">Search</button>
          </div>

          <div className="discovery-grid">
            {filteredSculptures.length > 0 ? (
              filteredSculptures.map((art) => (
                <ProductCard
                  key={art.id}
                  item={art}
                  onView={handleView}
                />
              ))
            ) : (
              <p className="no-results">No sculptures found.</p>
            )}
          </div>
        </section>
      </div>

      <Footer />

      {selectedArt && (
        <div className="overlay-backdrop" onClick={closeOverlay}>
          <div className="overlay-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={closeOverlay}>
              ×
            </button>
            <img
              src={getImagePath(selectedArt.imageUrl)}
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

export default Sculpture;