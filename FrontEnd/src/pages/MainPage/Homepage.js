import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
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

const
 API_URL = "http://localhost:8082"; 
function Homepage() {
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState(1);
  const [selectedArt, setSelectedArt] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Data State
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  

  const [searchTerm, setSearchTerm] = useState("");


  useEffect(() => {
  
    const storedUser = localStorage.getItem("user") || localStorage.getItem("accountInfo");
    
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        console.log("Logged in User:", parsedUser); 
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


  const getImageUrl = (path) => {
      if (!path) return "https://via.placeholder.com/300";
      if (path.startsWith("http")) return path;
      return `${API_URL}${path}`;
  };


   // 4. ADD TO CART FUNCTION
  const handleAddToCart = async (product) => {
    // A. Check User Login
    const savedUser = localStorage.getItem("accountInfo");
    if (!savedUser) {
        alert("Please log in first to add items to your cart.");
        return;
    }

    let userId;
    try {
        const currentUser = JSON.parse(savedUser);
        userId = currentUser.id;
    } catch (e) {
        alert("Session error. Please logout and login again.");
        return;
    }

    setIsSubmitting(true);

    // B. Prepare Payload
    const payload = {
        user_id: userId,
        product_id: product.id,
        name: product.name,
        artist: product.artist || 'Unknown',
        type: product.category, 
        price: product.price,
        image: product.image_url, 
        quantity: 1
    };

    // C. Send to Backend (Ibinalik ang original URL string)
    try {
        const response = await fetch('http://localhost:8082/api/cart', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const result = await response.json();

        if (response.ok) {
            alert(`✅ Success! ${product.name} added to cart.`);
            if(selectedArt) closeOverlay(); 
        } else {
            console.error("Server Error:", result);
            alert("❌ Failed to add: " + (result.message || "Unknown error"));
        }

    } catch (error) {
        console.error("Connection Error:", error);
        alert("❌ Cannot connect to server.");
    } finally {
        setIsSubmitting(false);
    }
  };


  const filteredProducts = products.filter((art) => {
    const query = searchTerm.toLowerCase();
    return (
      art.title.toLowerCase().includes(query) ||
      (art.category && art.category.toLowerCase().includes(query)) ||
      (art.artist && art.artist.toLowerCase().includes(query))
    );
  });

  
  const featuredArt = filteredProducts.length > 0 ? filteredProducts[0] : null;
  const sideArts = filteredProducts.length > 1 ? filteredProducts.slice(1, 3) : [];
  const discoveryArts = filteredProducts.length > 3 ? filteredProducts.slice(3, 9) : []; // Limit to top 6


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

  return (
    <>
      <Navbar onSearch={setSearchTerm} />

      <div className="homepage">
     
        <section className="hero" style={{ backgroundImage: `url(${WaveBg})` }}>
          <h1>Shop art, live inspired.</h1>
          <p>
            We connect you directly with a global community of artists, making it simple
            to find art that truly reflects you.
          </p>
          <button className="btn-primary" onClick={() => navigate("/customer/artpage")}>Shop Now</button>
        </section>

   
        <section className="quote">
          <p>“Art should comfort the disturbed and disturb the comfortable.” – Banksy</p>
        </section>

        <section className="art-display" style={{ minHeight: "400px", position: "relative" }}>
          <div className="section-title">TOP</div>
          
    
          {isLoading ? (
             <div style={{
                 display: "flex", 
                 justifyContent: "center", 
                 alignItems: "center", 
                 height: "300px", 
                 color: "#555",
                 fontSize: "1.2rem"
             }}>
                 {/* Simple CSS Spinner or Text */}
                 <div className="spinner" style={{
                     border: "4px solid #f3f3f3", 
                     borderTop: "4px solid #3498db", 
                     borderRadius: "50%", 
                     width: "40px", 
                     height: "40px", 
                     animation: "spin 2s linear infinite",
                     marginRight: "10px"
                 }}></div>
                 <span>Loading Gallery...</span>
                 <style>{`@keyframes spin {0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); }}`}</style>
             </div>
          ) : filteredProducts.length === 0 ? (
             <div style={{textAlign: "center", padding: "40px", color: "#666"}}>
               <h3>No artworks found for "{searchTerm}"</h3>
             </div>
          ) : (
            <div className="art-gallery">
    
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

        {!isLoading && discoveryArts.length > 0 && (
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
              <button className="btn-browse-more" onClick={() => navigate("/customer/artpage")}>Browse More</button>
            </div>
          </section>
        )}
      </div>

      <Footer />

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