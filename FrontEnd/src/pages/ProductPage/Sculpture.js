import React, { useState, useEffect } from "react";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";
import "../../css/Category.css";
import ProductCard from "../../components/ProductCard";
import { productAPI } from "../../services/api";

function Sculpture() {
  const [selectedArt, setSelectedArt] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await productAPI.getAllProducts();
        
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
  
  const addToCart = async (product) => {
      const savedUser = localStorage.getItem("accountInfo");
      if (!savedUser) {
          alert("Please log in first to add items to your cart.");
          return;
      }

      const currentUser = JSON.parse(savedUser);
      setIsSubmitting(true);
  
      const payload = {
          user_id: currentUser.id,
          product_id: product.id,
          quantity: 1,
          name: product.name,
          price: product.price,
          image: product.image_url || product.image
      };

      try {
          const response = await fetch("http://localhost:8000/api/cart/add", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload)
          });

          if (response.ok) {
              alert("Item added to cart successfully!");
              setSelectedArt(null);
          } else {
              alert("Failed to add item to cart.");
          }
      } catch (error) {
          console.error("Add to cart error:", error);
      } finally {
          setIsSubmitting(false);
      }
  };

  const closeOverlay = () => setSelectedArt(null);

  const filteredSculptures = products.filter((art) => {
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
          </div>

          <div className="discovery-grid">
            {filteredSculptures.length > 0 ? (
              filteredSculptures.map((art) => (
                <ProductCard key={art.id} item={art} onView={handleView} />
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
            <h3>₱{selectedArt.price ? selectedArt.price.toLocaleString() : 0}</h3>
            <button 
                className="buy-now-btn"
                style={{
                  backgroundColor: '#e49e69', color: 'white', padding: '10px 20px', 
                  border: 'none', cursor: 'pointer', marginTop: '15px', width: '100%', fontSize: '1.1rem'
                }}
                onClick={() => addToCart(selectedArt)} 
                disabled={isSubmitting}
            >
                {isSubmitting ? "Adding..." : "Add to Cart"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default Sculpture;