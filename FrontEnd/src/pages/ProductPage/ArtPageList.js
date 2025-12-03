// src/pages/ProductPage/ArtPageList.js - UPDATED WITH DEBUGGING
import React, { useState, useEffect } from "react";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";
import "../../css/Category.css";
import ProductCard from "../../components/ProductCard";
import { productAPI } from "../../services/api";

function ArtPageList() {
  const [selectedArt, setSelectedArt] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [sortBy, setSortBy] = useState("default");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [apiStatus, setApiStatus] = useState('Testing API...');

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setApiStatus('Connecting to backend...');
        
        console.log('🔄 Calling: GET http://localhost:8000/api/products');
        
        const data = await productAPI.getAllProducts();
        setApiStatus('✅ Connected successfully!');
        
        console.log('📦 Raw API response:', data);
        
        // Handle Laravel response format
        let productList = [];
        
        if (Array.isArray(data)) {
          // Direct array: [{"id":1,...}, {"id":2,...}]
          productList = data;
        } else if (data && Array.isArray(data.data)) {
          // Paginated: {"data":[{"id":1,...}]}
          productList = data.data;
        } else if (data && data.products && Array.isArray(data.products)) {
          // Wrapped: {"products":[{"id":1,...}]}
          productList = data.products;
        } else {
          console.warn('⚠️ Unexpected response format:', data);
          productList = [];
        }
        
        console.log(`✅ Processed ${productList.length} products`);
        setProducts(productList);
        setError(null);
        
      } catch (err) {
        console.error('❌ API Error details:', err);
        
        setApiStatus('❌ Connection failed');
        setError(`Cannot connect to backend. 
        
Error: ${err.message}

Please check:
1. Laravel is running on http://localhost:8000
2. Visit http://localhost:8000/api/test to test
3. Check Docker containers are running
4. Browser console (F12) for CORS errors`);
        
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleView = (art) => setSelectedArt(art);
  const closeOverlay = () => setSelectedArt(null);

  // Filter products
  let filteredArts = products.filter((art) => {
    if (!art) return false;
    
    const matchesSearch = art.name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === "All" || art.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  // Sort products
  if (sortBy === "priceLowHigh") {
    filteredArts.sort((a, b) => (a.price || 0) - (b.price || 0));
  } else if (sortBy === "priceHighLow") {
    filteredArts.sort((a, b) => (b.price || 0) - (a.price || 0));
  } else if (sortBy === "nameAZ") {
    filteredArts.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
  } else if (sortBy === "nameZA") {
    filteredArts.sort((a, b) => (b.name || '').localeCompare(a.name || ''));
  }

  // Get image URL
  const getImageUrl = (item) => {
    if (!item || !item.image_url) {
      return '/images/default-product.jpg';
    }
    
    // Your image paths: /images/Handmade Decor/Anava.png
    if (item.image_url.startsWith('/')) {
      return `http://localhost:8000${item.image_url}`;
    }
    
    return item.image_url;
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="sculpture-page">
          <section className="sculpture-hero">
            <h1>Art Collections</h1>
            <div className="api-debug">
              <h3>🔍 API Integration Test</h3>
              <p className="api-status">{apiStatus}</p>
              <div className="debug-info">
                <p><strong>Endpoint:</strong> http://localhost:8000/api/products</p>
                <p><strong>Method:</strong> GET</p>
                <p><strong>Expected:</strong> JSON array of products</p>
                <p>Check browser console (F12) for detailed logs</p>
              </div>
            </div>
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
            <div className="api-error">
              <h3>⚠️ API Connection Issue</h3>
              <pre className="error-details">{error}</pre>
              <div className="troubleshooting">
                <h4>Quick Fixes:</h4>
                <ol>
                  <li>Open <a href="http://localhost:8000/api/test" target="_blank">http://localhost:8000/api/test</a></li>
                  <li>Check if Laravel is running: <code>docker ps</code></li>
                  <li>Check backend container logs</li>
                  <li>Press F12 → Console tab → Look for CORS errors</li>
                </ol>
                <button 
                  onClick={() => window.location.reload()}
                  className="retry-btn"
                >
                  Retry Connection
                </button>
              </div>
            </div>
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
          
          {/* API Status */}
          <div className="api-success">
            <p className="success-msg">✅ Connected to backend API</p>
            <small>Loaded {products.length} products from database</small>
          </div>

          {/* Search and filters */}
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

          {/* Results info */}
          <div className="results-info">
            Showing {filteredArts.length} of {products.length} products
            {searchQuery && ` for "${searchQuery}"`}
            {filterCategory !== "All" && ` in ${filterCategory}`}
          </div>

          {/* Product grid */}
          <div className="discovery-grid">
            {filteredArts.length > 0 ? (
              filteredArts.map((art) => (
                <ProductCard key={art.id} item={art} onView={handleView} />
              ))
            ) : (
              <div className="no-products">
                <p>No artworks found matching your criteria.</p>
                <p>Try a different search or category.</p>
              </div>
            )}
          </div>
        </section>
      </div>

      <Footer />

      {/* Product detail overlay */}
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
              onClick={() => {
                alert(`"${selectedArt.name}" added to cart!`);
                closeOverlay();
              }}
            >
              Add to Cart
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default ArtPageList;