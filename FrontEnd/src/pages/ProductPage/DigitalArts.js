import React, { useState, useEffect } from "react";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";
import "../../css/Category.css";
// import digitalArts from "../../data/DigitalArts.json"; // REMOVED JSON
import ProductCard from "../../components/ProductCard";

function DigitalArts() {
  // 1. State for API data
  const [digitalArts, setDigitalArts] = useState([]); 
  const [loading, setLoading] = useState(true);

  const [selectedArt, setSelectedArt] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");

  const handleView = (art) => setSelectedArt(art);
  const closeOverlay = () => setSelectedArt(null);

  // 2. Fetch Data
  useEffect(() => {
    const fetchDigitalArts = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/products");
        const data = await response.json();

        // 3. Pre-filter: Ensure we ONLY keep Digital Arts for this page
        // Depending on how your DB saves categories, we check if the category 
        // matches one of the digital types or the main 'Digital Art' category.
        const digitalOnly = data.filter(art => {
           const cat = art.category || ""; 
           // List of categories that belong on this page:
           const validCategories = ["Digital Art", "3D Art", "Digital Painting", "Vector Art", "Concept Art"];
           return validCategories.includes(cat);
        });

        setDigitalArts(digitalOnly);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching digital arts:", error);
        setLoading(false);
      }
    };

    fetchDigitalArts();
  }, []);

  // 4. Image Helper for API
  const getImagePath = (imageUrl) => {
    if (!imageUrl) return "https://via.placeholder.com/300";
    if (imageUrl.startsWith('http')) return imageUrl;
    return `http://127.0.0.1:8000/${imageUrl}`;
  };

  // 5. Filtering based on User Selection (Search / Dropdown)
  const filteredArts = digitalArts.filter((art) => {
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
              {/* Ensure these values match exactly what is in your Database */}
              <option value="3D Art">3D Art</option>
              <option value="Digital Painting">Digital Painting</option>
              <option value="Vector Art">Vector Art</option>
              <option value="Concept Art">Concept Art</option>
            </select>
            {/* Search button is visual only since input updates live, but kept for design */}
            <button className="sculpture-search-btn">Search</button>
          </div>

          <div className="discovery-grid">
            {loading ? (
                <p>Loading digital arts...</p>
            ) : filteredArts.length > 0 ? (
              filteredArts.map((art) => (
                <ProductCard
                  key={art.id}
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

export default DigitalArts;
