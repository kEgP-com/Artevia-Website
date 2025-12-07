ArtPageList.js

/* * ------------------------------------------------------------------
 * reantaso-product-integration
 * COMPONENT: ArtPageList (Connected to Laravel Backend)
 * ------------------------------------------------------------------
 */

import React, { useState, useEffect } from "react";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";
import "../../css/Category.css";

function ArtPageList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedArt, setSelectedArt] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [sortBy, setSortBy] = useState("default");

  useEffect(() => {
    const fetchProducts = async () => {
      console.log("🚀 Launching: reantaso-product-integration build");

      try {
        const response = await fetch("http://localhost:8000/api/products");
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();
        console.log("✅ Data received:", data);

        const productArray = Array.isArray(data) ? data : (data.data || []);
        setProducts(productArray);
        setLoading(false);
      } catch (error) {
        console.error("❌ Connection Failed:", error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleView = (art) => setSelectedArt(art);
  const closeOverlay = () => setSelectedArt(null);

  const getImageUrl = (item) => {
    if (!item || !item.image_url) return "https://via.placeholder.com/300";
    if (item.image_url.startsWith("http")) return item.image_url;
    const cleanPath = item.image_url.startsWith("/") ? item.image_url.substring(1) : item.image_url;
    return `http://localhost:8000/${cleanPath}`;
  };

  const filteredArts = products.filter((art) => {
    const matchesSearch = art.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === "All" || art.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedArts = [...filteredArts].sort((a, b) => {
    if (sortBy === "priceLowHigh") return a.price - b.price;
    if (sortBy === "priceHighLow") return b.price - a.price;
    if (sortBy === "nameAZ") return a.name.localeCompare(b.name);
    if (sortBy === "nameZA") return b.name.localeCompare(a.name);
    return 0;
  });

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

          {/* Product Grid */}
          <div className="discovery-grid">
            {loading ? (
              <div className="loading-container">
                <p>Loading Artworks...</p>
              </div>
            ) : sortedArts.length > 0 ? (
              sortedArts.map((art) => (
                <div key={art.id} className="art-card" onClick={() => handleView(art)}>
                  <img
                    src={getImageUrl(art)}
                    alt={art.name}
                    className="art-image"
                    style={{ width: "100%", height: "auto", objectFit: "cover" }}
                  />
                  <h3>{art.name}</h3>
                  <p><strong>{art.artist}</strong></p>
                  <p><em>{art.category}</em></p>
                  <p>₱{parseFloat(art.price).toLocaleString()}</p>
                </div>
              ))
            ) : (
              <p className="no-results">No artworks found.</p>
            )}
          </div>
        </section>
      </div>

      <Footer />

      {/* Detail Overlay */}
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
          </div>
        </div>
      )}
    </>
  );
}

export default ArtPageList;
