import React, { useState, useEffect } from "react";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";
import "../../css/Category.css";
import ProductCard from "../../components/ProductCard";
import { productAPI } from "../../services/api";

function ArtPageList() {
  // 1. STATE DECLARATIONS
  const [selectedArt, setSelectedArt] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [sortBy, setSortBy] = useState("default");
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // 2. FETCH PRODUCTS
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        
        // Note: Assumes productAPI calls the correct endpoint internally
        const data = await productAPI.getAllProducts();
        
        // Handle varying Laravel response formats
        let productList = [];
        if (Array.isArray(data)) {
          productList = data;
        } else if (data && Array.isArray(data.data)) {
          productList = data.data;
        } else if (data && data.products && Array.isArray(data.products)) {
          productList = data.products;
        }
        
        setProducts(productList);
        setError(null);
        
      } catch (err) {
        console.error('API Error:', err);
        setError(`Cannot connect to backend. Error: ${err.message}`);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // 3. HELPER FUNCTIONS (Restored original URL logic)
  const getImageUrl = (item) => {
    if (!item || !item.image_url) {
      return '/images/default-product.jpg';
    }
    // Ibinalik ko sa dating logic mo:
    if (item.image_url.startsWith('/')) {
      return `http://localhost:8082${item.image_url}`;
    }
    return item.image_url;
  };

  const handleView = (art) => setSelectedArt(art);
  const closeOverlay = () => setSelectedArt(null);

  // 4. ADD TO CART FUNCTION
  const addToCart = async (product) => {
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

  // 5. FILTERS & SORTING
  const filteredArts = products.filter((art) => {
    if (!art) return false;
    const matchesSearch = art.name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === "All" || art.category === filterCategory;
    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
      if (sortBy === "priceLowHigh") return (a.price || 0) - (b.price || 0);
      if (sortBy === "priceHighLow") return (b.price || 0) - (a.price || 0);
      if (sortBy === "nameAZ") return (a.name || '').localeCompare(b.name || '');
      if (sortBy === "nameZA") return (b.name || '').localeCompare(a.name || '');
      return 0; 
  });

  // 6. RENDER
  if (loading) {
    return (
      <>
        <Navbar />
        <div className="sculpture-page">
          <section className="sculpture-hero">
            <h1>Art Collections</h1>
            <p>Loading artworks...</p>
          </section>
        </div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="sculpture-page">
          <section className="sculpture-hero">
            <h1>Art Collections</h1>
            <p style={{color: 'red'}}>{error}</p>
            <button onClick={() => window.location.reload()}>Retry</button>
          </section>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="sculpture-page">
        <section className="sculpture-hero">
          <h1>Art Collections</h1>

          {/* Filters */}
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
          {/* Grid */}
          <div className="discovery-grid">
            {filteredArts.length > 0 ? (
              filteredArts.map((art) => (
                <ProductCard 
                    key={art.id} 
                    // Pinapasa natin yung imageUrl na galing sa helper function mo
                    item={{...art, imageUrl: getImageUrl(art)}} 
                    onView={handleView} 
                    onAddToCart={() => addToCart(art)} 
                />
              ))
            ) : (
              <div className="no-products">
                <p>No artworks found.</p>
              </div>
            )}
          </div>
        </section>
      </div>

      <Footer />

      {/* Overlay Modal */}
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
            <p><strong>Artist: {selectedArt.artist || 'Unknown'}</strong></p>
            <p><em>Category: {selectedArt.category}</em></p>
            <p>{selectedArt.description}</p>
            <h3>Price: ₱{parseFloat(selectedArt.price).toLocaleString()}</h3>
            
            <button 
              className="buy-now-btn"
              onClick={() => addToCart(selectedArt)}
              disabled={isSubmitting}
              style={{ 
                  opacity: isSubmitting ? 0.7 : 1, 
                  cursor: isSubmitting ? 'wait' : 'pointer',
                  backgroundColor: '#e49e69',
                  color: 'white',
                  padding: '10px 20px',
                  marginTop: '15px',
                  width: '100%',
                  border: 'none',
                  fontSize: '1rem',
                  borderRadius: '5px'
              }}
            >
              {isSubmitting ? "Adding to Cart..." : "Add to Cart"}
            </button>
          </div>
        </div>
      )}
    </>
   );
}

export default ArtPageList;