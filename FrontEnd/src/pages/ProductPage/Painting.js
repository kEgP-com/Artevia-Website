import React, { useState, useEffect } from "react";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";
import "../../css/Category.css";
// import painting from "../../data/Painting.json"; // Removed JSON import
import ProductCard from "../../components/ProductCard";

function Painting() {
  // 1. State for API data
  const [paintings, setPaintings] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedArt, setSelectedArt] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");

  const handleView = (art) => setSelectedArt(art);
  const closeOverlay = () => setSelectedArt(null);

  // 2. Fetch Data
  useEffect(() => {
    const fetchPaintings = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/products");
        const data = await response.json();

        // 3. Pre-filter: Keep only Painting and Sketch related categories
        const validCategories = ["Painting", "Sketch", "Illustration", "Concept Art"];
        
        const paintingOnly = data.filter((item) => {
          const cat = item.category || "";
          return validCategories.includes(cat);
        });

        setPaintings(paintingOnly);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching paintings:", error);
        setLoading(false);
      }
    };

    fetchPaintings();
  }, []);

  // 4. Image Helper for API
  const getImagePath = (imageUrl) => {
    if (!imageUrl) return "https://via.placeholder.com/300";
    if (imageUrl.startsWith("http")) return imageUrl;
    return `http://127.0.0.1:8000/${imageUrl}`;
  };

  // 5. Filter based on Search and Dropdown
  const filteredSketches = paintings.filter((art) => {
    const name = art.name || "";
    const category = art.category || "";

    const matchesSearch = name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === "All" || category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <Navbar />

      <div className="sculpture-page">
        <section className="sculpture-hero">
          <h1>Painting</h1>

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
              {/* Ensure these values match your Database exactly */}
              <option value="Painting">Painting</option> 
              <option value="Sketch">Sketch</option>
              <option value="Illustration">Illustration</option>
              <option value="Concept Art">Concept Art</option>
            </select>
          </div>

          <div className="discovery-grid">
            {loading ? (
               <p>Loading paintings...</p>
            ) : filteredSketches.length > 0 ? (
              filteredSketches.map((art) => (
                <ProductCard
                  key={art.id}
                  // Pass the processed image URL
                  item={{...art, imageUrl: getImagePath(art.imageUrl)}}
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
            <h3>₱{selectedArt.price ? selectedArt.price.toLocaleString() : 0}</h3>
          </div>
        </div>
      )}
    </>
  );
}

export default Painting;
