import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom"; 
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";
import "../../css/Homepage.css";

// Static Backgrounds & UI Elements
import WaveBg from "../../images/images/wavebg.png";
import SaleBadge from "../../images/images/Sale.png";

// Static Category Images
import Handmadedecor2 from "../../images/Handmade Decor/dovy_oak.png";
import Painting2 from "../../images/Painting/Oil_On_Canvas_By_Shan_Arts.jpg";
import Sculpture2 from "../../images/Sculpture/la-grande-ourse-animal-sculpture-by-eric-valat_7-550x769.png";
import Sketch2 from "../../images/Sketch arts/Custom_Portrait_2.png";
import DigitalArt2 from "../../images/Digital Art/A_Taste_of_Honey.png";

const API_URL = "http://localhost:8082"; 

function Homepage() {
  const [activePage, setActivePage] = useState(1);
  const [selectedArt, setSelectedArt] = useState(null);
  
  // Data State
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  
  // ✅ SEARCH STATE
  const [searchTerm, setSearchTerm] = useState("");

  // FETCH DATA & CHECK LOGIN
  useEffect(() => {
    // ⚠️ CRITICAL FIX: Check BOTH 'user' and 'accountInfo' keys
    // This solves the issue where Navbar sees login but Homepage does not.
    const storedUser = localStorage.getItem("user") || localStorage.getItem("accountInfo");
    
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        console.log("Logged in User:", parsedUser); // Debugging Log
        setCurrentUser(parsedUser);
      } catch (e) {
        console.error("User data corrupted");
      }
    } else {
        console.warn("No user found in localStorage");
    }

    const fetchProducts = async () => {
      try {
        const response = await fetch(`${API_URL}/api/products`); 
        if (response.ok) {
            const data = await response.json();
            const mappedData = data.map(item => ({
                ...item,
                title: item.name,      
                image: item.image_url, 
                artist: item.artist_name || item.artist || "Unknown"
            }));
            setProducts(mappedData);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // IMAGE URL HELPER
  const getImageUrl = (path) => {
      if (!path) return "https://via.placeholder.com/300";
      if (path.startsWith("http")) return path;
      return `${API_URL}${path}`;
  };

  // ADD TO CART
  const handleAddToCart = async (art) => {
    // Debugging: Check why it fails
    if (!currentUser) {
      console.log("Cart Check Failed: currentUser is null");
      alert("You need to login first to add items to your cart!");
      return;
    }

    // Ensure we have a valid ID (Handles both 'id' and 'user_id' formats)
    const userId = currentUser.id || currentUser.user_id;

    if (!userId) {
        alert("User ID missing. Please re-login.");
        return;
    }

    try {
      const response = await fetch(`${API_URL}/api/cart`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          name: art.name,
          artist: art.artist, 
          type: art.category,
          price: art.price,
          quantity: 1,
          image: art.image_url
        }),
      });

      if (response.ok) alert(`${art.title} added to cart!`);
      else alert("Failed to add to cart.");
    } catch (error) {
      console.error("Cart Error:", error);
    }
  };

  // ✅ FILTERING LOGIC
  const filteredProducts = products.filter((art) => {
    const query = searchTerm.toLowerCase();
    return (
      art.title.toLowerCase().includes(query) ||
      (art.category && art.category.toLowerCase().includes(query)) ||
      (art.artist && art.artist.toLowerCase().includes(query))
    );
  });

  // LAYOUT LOGIC
  const featuredArt = filteredProducts.length > 0 ? filteredProducts[0] : null;
  const sideArts = filteredProducts.length > 1 ? filteredProducts.slice(1, 3) : [];
  const discoveryArts = filteredProducts.length > 3 ? filteredProducts.slice(3, 9) : []; // Limit to top 6

  // Static Categories
  const allCategories = [
    { id: 1, name: "Paintings", image: Painting2 },
    { id: 2, name: "Sculpture", image: Sculpture2 },
    { id: 3, name: "Digital Art", image: DigitalArt2 },
    { id: 4, name: "Sketches", image: Sketch2 },
    { id: 5, name: "Handmade Decor", image: Handmadedecor2 },
  ];

  const slideAmount = (activePage - 1) * 280;
  const handleView = (art) => setSelectedArt(art);
  const closeOverlay = () => setSelectedArt(null);

  if (isLoading) return <div className="homepage" style={{paddingTop: "100px", textAlign:"center"}}>Loading Art...</div>;

  return (
    <>
      {/* ✅ Pass setSearchTerm to Navbar */}
      <Navbar onSearch={setSearchTerm} />

      <div className="homepage">
        {/* ==== HERO SECTION ==== */}
        <section className="hero" style={{ backgroundImage: `url(${WaveBg})` }}>
          <h1>Shop art, live inspired.</h1>
          <p>
            We connect you directly with a global community of artists, making it simple
            to find art that truly reflects you.
          </p>
          <button className="btn-primary">Shop Now</button>
        </section>

        {/* ==== QUOTE ==== */}
        <section className="quote">
          <p>“Art should comfort the disturbed and disturb the comfortable.” – Banksy</p>
        </section>

        {/* ==== ART DISPLAY (TOP 3) ==== */}
        <section className="art-display">
          <div className="section-title">TOP</div>
          
          {filteredProducts.length === 0 ? (
             <div style={{textAlign: "center", padding: "40px", color: "#666"}}>
               <h3>No artworks found for "{searchTerm}"</h3>
             </div>
          ) : (
            <div className="art-gallery">
                {/* LEFT COLUMN */}
                <div className="gallery-column-left">
                {featuredArt && (
                    <div className="art-frame-large">
                    <img 
                        src={getImageUrl(featuredArt.image)} 
                        alt={featuredArt.title} 
                        className="art-image-large" 
                    />
                    <div className="art-overlay">
                        <div className="art-info">
                        <span>{featuredArt.title}</span>
                        <span>₱{Number(featuredArt.price).toLocaleString()}</span>
                        </div>
                        <div className="art-buttons-container">
                        <button className="btn-overlay" onClick={() => handleAddToCart(featuredArt)}>ADD TO CART</button>
                        <button className="btn-overlay" onClick={() => handleView(featuredArt)}>VIEW</button>
                        </div>
                    </div>
                    </div>
                )}
                </div>

                {/* RIGHT COLUMN */}
                <div className="gallery-column-right">
                {sideArts.map((art) => (
                    <div className="art-frame-small" key={art.id}>
                    <img 
                        src={getImageUrl(art.image)} 
                        alt={art.title} 
                        className="art-image-small" 
                    />
                    <div className="art-overlay">
                        <div className="art-info">
                        <span>{art.title}</span>
                        <span>₱{Number(art.price).toLocaleString()}</span>
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
          )}
        </section>

        {/* ==== CATEGORIES (Static) ==== */}
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

        {/* ==== DISCOVERY (Top 6 Items) ==== */}
        {discoveryArts.length > 0 && (
          <section
            className="discovery"
            style={{
              backgroundImage: `url(${WaveBg}), linear-gradient(to bottom, white, #E49E69)`,
            }}
          >
            <div className="section-title">DISCOVERY</div>
            <div className="discovery-content-wrapper">
              <div className="discovery-grid">
                {discoveryArts.map((art) => (
                  <div key={art.id} className="discovery-frame">
                    <img src={getImageUrl(art.image)} alt={art.title} />
                    <div className="discovery-overlay">
                      <div className="discovery-info">
                        <span>{art.title}</span>
                        <span>₱{Number(art.price).toLocaleString()}</span>
                      </div>
                      <div className="discovery-buttons-container">
                        <button className="btn-discovery-overlay" onClick={() => handleAddToCart(art)}>ADD TO CART</button>
                        <button
                          className="btn-discovery-overlay"
                          onClick={() => handleView(art)}
                        >
                          VIEW
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button className="btn-browse-more">Browse More</button>
            </div>
          </section>
        )}
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
              src={getImageUrl(selectedArt.image)}
              alt={selectedArt.title}
              className="overlay-image"
            />
            <h2>{selectedArt.title}</h2>
            <p><strong>{selectedArt.artist}</strong></p>
            <p><em>{selectedArt.category}</em></p>
            <p>{selectedArt.description}</p>
            <h3>₱{Number(selectedArt.price).toLocaleString()}</h3>
          </div>
        </div>
      )}
    </>
  );
}

export default Homepage;