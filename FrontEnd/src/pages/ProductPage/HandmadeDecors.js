import React, { useState, useEffect } from "react";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";
import "../../css/Category.css";
import ProductCard from "../../components/ProductCard";

function HandmadeDecors() 
  // 1. New state to hold the data coming from your database
  const [handmadeDecors, setHandmadeDecors] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedArt, setSelectedArt] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");

  const handleView = (art) => setSelectedArt(art);
  const closeOverlay = () => setSelectedArt(null);

  // 2. Fetch the data when the page loads
  useEffect(() => {
    const fetchDecors = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/products");
        const data = await response.json();

        // 3. Filter the data immediately
        // Since the API sends back *everything* (Paintings, Digital Art, etc.),
        // we need to pick out only the Handmade items.
        const decorOnly = data.filter((item) => {
          const cat = item.category || "";
          // These are the categories allowed on this page:
          const validCategories = ["Handmade Decor", "Wood", "Clay", "Fabric", "Paper"];
          return validCategories.includes(cat);
        });

        setHandmadeDecors(decorOnly);
        setLoading(false);
      } catch (error) {
        console.error("Oops, something went wrong fetching the decors:", error);
        setLoading(false);
      }
    };

    fetchDecors();
  }, []);

  // 4. Helper to fix image URLs from the database issue
  const getImagePath = (imageUrl) => {
    if (!imageUrl) return "https://via.placeholder.com/300"; // Safety fallback
    
    // If it's already a full link (like from the internet), use it.
    if (imageUrl.startsWith("http")) return imageUrl;

    // Otherwise, add your Laravel server address to the front.
    return `http://127.0.0.1:8000/${imageUrl}`;
  };

  // 5. Filter based on what the user types or selects in the dropdown
  const filteredDecors = handmadeDecors.filter((art) => {
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
          <h1>Handmade Decorations</h1>

          <div className="sculpture-filters">
            <input
              type="text"
              placeholder="Search handmade decors..."
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
              {/* Make sure these match the categories in your database exactly! */}
              <option value="Wood">Wood</option>
              <option value="Clay">Clay</option>
              <option value="Fabric">Fabric</option>
              <option value="Paper">Paper</option>
            </select>
          </div>

          <div className="discovery-grid">
            {loading ? (
              // A simple loading message so the user knows something is happening
              <p>Loading collection...</p>
            ) : filteredDecors.length > 0 ? (
              filteredDecors.map((art) => (
                <ProductCard
                  key={art.id}
                  // We pass the fixed image URL down to the card here
                  item={{ ...art, imageUrl: getImagePath(art.imageUrl) }}
                  onView={handleView}
                />
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
            <button className="close-btn" onClick={closeOverlay}>
              ×
            </button>

            <img
              src={getImagePath(selectedArt.imageUrl)}
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
