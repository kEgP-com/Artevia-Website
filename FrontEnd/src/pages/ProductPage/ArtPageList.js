import React, { useState, useEffect } from "react"; // 1. Added useEffect
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";
import "../../css/Category.css";
// import productList from "../../data/productList.json"; // 2. REMOVED JSON Import
import ProductCard from "../../components/ProductCard";

function ArtPageList() {
  // 3. New State to store API data
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedArt, setSelectedArt] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [sortBy, setSortBy] = useState("default");

  const handleView = (art) => setSelectedArt(art);
  const closeOverlay = () => setSelectedArt(null);

  // 4. Fetch Data from Laravel API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Ensure this matches your Laravel server URL
        const response = await fetch("http://127.0.0.1:8000/api/products");
        
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await response.json();
        // Check if your API returns the array directly or inside a 'data' key
        // Example: setProducts(data.data ? data.data : data);
        setProducts(data); 
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // 5. Updated Image Handling for API
  // NOTE: Your Laravel ProductController should return the full image URL 
  // or a path relative to the public folder.
  const getImagePath = (imageUrl) => {
    if (!imageUrl) return "https://via.placeholder.com/300"; // Fallback image
    
    // If the image path from DB already has http, use it. 
    if (imageUrl.startsWith('http')) {
        return imageUrl;
    }
    
    // Otherwise, prepend your Laravel base URL
    return `http://127.0.0.1:8000/${imageUrl}`; 
  };

  // 6. Changed 'productList' to 'products' state variable
  let filteredArts = products.filter((art) => {
    // Ensure properties exist to prevent crashing on incomplete data
    const name = art.name || "";
    const category = art.category || "";
    
    const matchesSearch = name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === "All" || category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  if (sortBy === "priceLowHigh") {
    filteredArts.sort((a, b) => a.price - b.price);
  } else if (sortBy === "priceHighLow") {
    filteredArts.sort((a, b) => b.price - a.price);
  } else if (sortBy === "nameAZ") {
    filteredArts.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortBy === "nameZA") {
    filteredArts.sort((a, b) => b.name.localeCompare(a.name));
  }

  return (
    <>
      <Navbar />

      <div className="sculpture-page">
        <section className="sculpture-hero">
          <h1>Art Collections</h1>

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

          <div className="discovery-grid">
            {loading ? (
                 <p>Loading artworks...</p>
            ) : filteredArts.length > 0 ? (
              filteredArts.map((art) => (
                // Ensure your ProductCard uses the new image path logic if needed, 
                // or pass the processed URL down
                <ProductCard key={art.id} item={{...art, imageUrl: getImagePath(art.imageUrl)}} onView={handleView} />
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
              // Use the helper function here
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

export default ArtPageList;
