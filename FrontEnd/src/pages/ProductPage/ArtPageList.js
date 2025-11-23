import React, { useState } from "react";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";
import "../../css/Category.css";
import productList from "../../data/productList.json";
import ProductCard from "../../components/ProductCard";


const images = require.context("../../images", true);

function ArtPageList() {
  const [selectedArt, setSelectedArt] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [sortBy, setSortBy] = useState("default");

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


  let filteredArts = productList.filter((art) => {
    const matchesSearch = art.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === "All" || art.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  if (sortBy === "priceLowHigh") {
    filteredArts.sort((a, b) => a.price - b.price);
  } else if (sortBy === "priceHighLow") {
    filteredArts.sort((a, b) => b.price - a.price);
  } else if (sortBy === "nameAZ") {
    filteredArts.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortBy === "nameZA") {
    filteredArts.sort((a, b) => b.name.localeCompare(a.name));
  }

  return (
    <>
      <Navbar />

      <div className="sculpture-page">
        <section className="sculpture-hero">
          <h1>Art Collections</h1>

          <div className="sculpture-filters">
            <input
              type="text"
              placeholder="Search artworks..."
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
              <option value="Painting">Painting</option>
              <option value="Illustration & Sketch">Illustration & Sketch</option>
              <option value="Handmade Decor">Handmade Decor</option>
              <option value="Digital Art">Digital Arts</option> 
            </select>

            <select
              className="sculpture-filter-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="default">Sort by</option>
              <option value="priceLowHigh">Price: Low to High</option>
              <option value="priceHighLow">Price: High to Low</option>
              <option value="nameAZ">Name: A–Z</option>
              <option value="nameZA">Name: Z–A</option>
            </select>
          </div>

          <div className="discovery-grid">
            {filteredArts.length > 0 ? (
              filteredArts.map((art) => (
                <ProductCard key={art.id} item={art} onView={handleView} />
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

export default ArtPageList;
