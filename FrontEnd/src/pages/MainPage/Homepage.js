import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";
import "../../css/Homepage.css";
import WaveBg from "../../images/images/wavebg.png";
import SaleBadge from "../../images/images/Sale.png";

// --- FALLBACK IMAGES (Used if database is empty) ---
import DigitalArt1 from "../../images/Digital Art/Searching for peace.png";
import Painting1 from "../../images/Painting/Pag Akbay Series VII by Leti watersong.jpg";
import Sculpture1 from "../../images/Sculpture/blossom-v-wood-sculpture-by-wouter-van-der-vlugt-1-300x200.png";
import DigitalArt2 from "../../images/Digital Art/A_Taste_of_Honey.png";
import Handmadedecor2 from "../../images/Handmade Decor/dovy_oak.png";
import Painting2 from "../../images/Painting/Oil_On_Canvas_By_Shan_Arts.jpg";
import Sculpture2 from "../../images/Sculpture/la-grande-ourse-animal-sculpture-by-eric-valat_7-550x769.png";
import Sketch2 from "../../images/Sketch arts/Custom_Portrait_2.png";

function Homepage() {
  const [activePage, setActivePage] = useState(1);
  const [selectedArt, setSelectedArt] = useState(null);
  
  // New States for Backend Data
  const [products, setProducts] = useState([]); 
  const [loading, setLoading] = useState(true);
  
  const navigate = useNavigate();
  const slideAmount = (activePage - 1) * 280;

  // --- 1. FETCH DATA FROM BACKEND ---
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Change port 8000 to match your Laravel port
        const response = await fetch("http://localhost:8000/api/products");
        if (response.ok) {
          const data = await response.json();
          setProducts(data);
        } else {
          console.log("Using local data (Server might be offline)");
        }
      } catch (error) {
        console.error("Error connecting to backend:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // --- 2. ADD TO CART FUNCTION (Connects to DB) ---
  const handleAddToCart = async (artItem) => {
    const cartData = {
      product_id: artItem.id, // ID from Database
      name: artItem.name,
      price: typeof artItem.price === 'string' ? parseFloat(artItem.price.replace(/[^\d.]/g, '')) : artItem.price,
      image: artItem.image,
      artist: artItem.artist || "Unknown",
      type: artItem.category || "Art",
      quantity: 1
    };

    try {
      const res = await fetch("http://localhost:8000/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cartData),
      });

      if (res.ok) {
        alert(`${artItem.name} added to cart!`);
      } else {
        alert("Failed to add to cart. Please try again.");
      }
    } catch (error) {
      console.error("Cart Error:", error);
      // Fallback for demo if offline
      alert("Added to cart (Offline Mode)");
    }
  };

  // --- 3. HELPER: Handle Images (DB URL vs Local) ---
  const getImgUrl = (img) => {
    if (!img) return DigitalArt1; // Default
    if (img.startsWith("http")) return img; // Valid URL from DB
    return img; // Local import
  };

  // --- 4. DATA ORGANIZATION ---
  // If DB has data, use it. If not, use manual fallback for display.
  const displayProducts = products.length > 0 ? products : [
    { id: 101, name: "Searching for peace", price: 1750, image: DigitalArt1, category: "Digital Art", artist: "Unknown" },
    { id: 102, name: "Pag Akbay Series", price: 5500, image: Painting1, category: "Painting", artist: "Leti" },
    { id: 103, name: "Blossom V Wood", price: 5954, image: Sculpture1, category: "Sculpture", artist: "Wouter" },
    { id: 104, name: "A Taste of Honey", price: 7700, image: DigitalArt2, category: "Digital Art", artist: "Unknown" },
    { id: 105, name: "Dovy Oak Wood", price: 2890, image: Handmadedecor2, category: "Handmade Decor", artist: "Woodlands" },
  ];

  // Slice data for specific sections
  const topFeature = displayProducts[0]; // Big Image on Left
  const sideFeatures = displayProducts.slice(1, 3); // Two small images on Right
  const discoveryItems = displayProducts; // All items for discovery

  const allCategories = [
    { id: 1, name: "Paintings", image: Painting2 },
    { id: 2, name: "Sculpture", image: Sculpture2 },
    { id: 3, name: "Digital Art", image: DigitalArt2 },
    { id: 4, name: "Sketches", image: Sketch2 },
    { id: 5, name: "Handmade Decor", image: Handmadedecor2 },
  ];

  const handleView = (item) => {
    setSelectedArt(item);
  };

  const closeOverlay = () => setSelectedArt(null);

  return (
    <>
      <Navbar />

      <div className="homepage">
        {/* ==== HERO SECTION ==== */}
        <section className="hero" style={{ backgroundImage: `url(${WaveBg})` }}>
          <h1>Shop art, live inspired.</h1>
          <p>
            We connect you directly with a global community of artists, making it simple
            to find art that truly reflects you.
          </p>
          <button className="btn-primary" onClick={() => navigate("/art")}>Shop Now</button>
        </section>

        {/* ==== QUOTE ==== */}
        <section className="quote">
          <p>“Art should comfort the disturbed and disturb the comfortable.” – Banksy</p>
        </section>

        {/* ==== ART DISPLAY (TOP PICKS) ==== */}
        <section className="art-display">
          <div className="section-title">TOP</div>
          <div className="art-gallery">
            
            {/* LEFT COLUMN (1 Large Item) */}
            <div className="gallery-column-left">
              {topFeature && (
                <div className="art-frame-large">
                  <img src={getImgUrl(topFeature.image)} alt={topFeature.name} className="art-image-large" />
                  <div className="art-overlay">
                    <div className="art-info">
                      <span>{topFeature.name}</span>
                      <span>₱{topFeature.price.toLocaleString()}</span>
                    </div>
                    <div className="art-buttons-container">
                      <button className="btn-overlay" onClick={() => handleAddToCart(topFeature)}>ADD TO CART</button>
                      <button className="btn-overlay" onClick={() => handleView(topFeature)}>VIEW</button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT COLUMN (2 Small Items) */}
            <div className="gallery-column-right">
              {sideFeatures.map((art, i) => (
                <div className="art-frame-small" key={art.id || i}>
                  <img src={getImgUrl(art.image)} alt={art.name} className="art-image-small" />
                  <div className="art-overlay">
                    <div className="art-info">
                      <span>{art.name}</span>
                      <span>₱{art.price.toLocaleString()}</span>
                    </div>
                    <div className="art-buttons-container">
                      <button className="btn-overlay" onClick={() => handleAddToCart(art)}>ADD TO CART</button>
                      <button className="btn-overlay" onClick={() => handleView(art)}>VIEW</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ==== CATEGORIES ==== */}
        <section className="promo">
          <div className="promo-title-container">
            <img src={SaleBadge} alt="Sale" className="sale-badge" />
            <div className="section-title">CATEGORIES</div>
          </div>

          <div className="promo-content-wrapper">
            <div className="category-gallery">
              <div
                className="category-carousel-inner"
                style={{ transform: `translateX(-${slideAmount}px)` }}
              >
                {allCategories.map((category) => (
                  <div
                    className="category-frame"
                    key={category.id}
                    style={{ backgroundImage: `url(${category.image})` }}
                  >
                    <span className="category-name">{category.name}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="pagination-dots">
              {[1, 2, 3].map((page) => (
                <span
                  key={page}
                  className={`dot ${activePage === page ? "active" : ""}`}
                  onClick={() => setActivePage(page)}
                />
              ))}
            </div>
            <p className="promo-text">
              Grab original artworks now on sale! Premium creations at prices you’ll love.
            </p>
          </div>
        </section>

        {/* ==== DISCOVERY (FROM BACKEND) ==== */}
        <section
          className="discovery"
          style={{
            backgroundImage: `url(${WaveBg}), linear-gradient(to bottom, white, #E49E69)`,
          }}
        >
          <div className="section-title">DISCOVERY</div>
          <div className="discovery-content-wrapper">
            <div className="discovery-grid">
              {discoveryItems.map((art, index) => (
                <div key={art.id || index} className="discovery-frame">
                  <img src={getImgUrl(art.image)} alt={art.name} />
                  <div className="discovery-overlay">
                    <div className="discovery-info">
                      <span>{art.name}</span>
                      <span>₱{art.price.toLocaleString()}</span>
                    </div>
                    <div className="discovery-buttons-container">
                      <button className="btn-discovery-overlay" onClick={() => handleAddToCart(art)}>ADD TO CART</button>
                      <button className="btn-discovery-overlay" onClick={() => handleView(art)}>VIEW</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button className="btn-browse-more" onClick={() => navigate("/art")}>Browse More</button>
          </div>
        </section>
      </div>

      <Footer />

      {/* ==== OVERLAY MODAL ==== */}
      {selectedArt && (
        <div className="overlay-backdrop" onClick={closeOverlay}>
          <div className="overlay-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={closeOverlay}>
              ×
            </button>
            <img
              src={getImgUrl(selectedArt.image)}
              alt={selectedArt.name}
              className="overlay-image"
            />
            <h2>{selectedArt.name}</h2>
            <p><strong>{selectedArt.artist || "Unknown Artist"}</strong></p>
            <p><em>{selectedArt.category || selectedArt.type}</em></p>
            <p>{selectedArt.description || "No description available."}</p>
            <h3>₱{selectedArt.price.toLocaleString()}</h3>
            
            <button 
                className="btn-primary" 
                style={{marginTop: '20px', width: '100%'}}
                onClick={() => {
                    handleAddToCart(selectedArt);
                    closeOverlay();
                }}
            >
                ADD TO CART
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default Homepage;

