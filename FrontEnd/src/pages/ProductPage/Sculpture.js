import React, { useState } from "react";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";
import "../../css/Category.css";
import sculptures from "../../data/Sculpture.json";
import ProductCard from "../../components/ProductCard";

function Sculpture() {
  const [selectedArt, setSelectedArt] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");

  const handleView = (art) => setSelectedArt(art);
  const closeOverlay = () => setSelectedArt(null);


  const filteredSculptures = sculptures.filter((art) => {
    const matchesSearch = art.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === "All" || art.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

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
                  categoryFolder="Sculpture"
                  onView={handleView}
                  onAddToCart={() => console.log("Added:", art.name)}
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
              src={require(`../../images/Sculpture/${selectedArt.imageUrl.split("/").pop()}`)}
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
