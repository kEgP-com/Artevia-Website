import React, { useState } from "react";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";
import "../../css/Category.css";
import digitalArts from "../../data/DigitalArts.json";
import ProductCard from "../../components/ProductCard";

const images = require.context("../../images", true);

function DigitalArts() {
  const [selectedArt, setSelectedArt] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");

  const handleView = (art) => setSelectedArt(art);
  const closeOverlay = () => setSelectedArt(null);


  const getImagePath = (path) => {
    try {
      const cleanPath = path.replace(/^(\.\.\/)+images\//, "");
      return images(`./${cleanPath}`);
    } catch (err) {
      console.warn("Image not found:", path);
      return "";
    }
  };

  const filteredSculptures = digitalArts.filter((art) => {
    const matchesSearch = art.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === "All" || art.category === filterCategory;
    return matchesSearch && matchesCategory;
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
            <select
              className="sculpture-filter-select"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="All">All Categories</option>
              <option value="3D Art">3D Art</option>
              <option value="Digital Painting">Digital Painting</option>
              <option value="Vector Art">Vector Art</option>
              <option value="Concept Art">Concept Art</option>
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
              <p className="no-results">No artworks found.</p>
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

export default DigitalArts;
