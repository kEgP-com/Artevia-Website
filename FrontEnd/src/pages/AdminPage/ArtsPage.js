import React, { useEffect, useState, useMemo } from "react";
import "../../css/Admin.css";
import "../../css/ArtsResponsive.css"; 
import { FaUserCircle, FaCog, FaBars } from "react-icons/fa";
import logo from "../../images/logo/logo_clear.png";
import wavebg from "../../images/images/login_bg.png";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:8082"; 


const CATEGORIES = [
  "Painting",
  "Sculpture",
  "Digital Art",
  "Sketch Art",
  "Handmade Decor"
];


const tableOverlayStyle = {
  position: "absolute",
  top: 0, left: 0, width: "100%", height: "100%",
  backgroundColor: "rgba(255, 255, 255, 0.5)",
  backdropFilter: "blur(2px)",
  zIndex: 10,
  display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column",
  color: "#333", fontWeight: "bold", fontSize: "1.2rem", borderRadius: "8px"
};

const spinnerStyle = {
  width: "50px", height: "50px",
  border: "5px solid rgba(0, 0, 0, 0.1)",
  borderTop: "5px solid #007bff",
  borderRadius: "50%",
  animation: "spin 1s linear infinite",
  marginBottom: "15px"
};

export default function AdminArts() {
  const navigate = useNavigate();
  
  
  const [arts, setArts] = useState([]);
  const [artists, setArtists] = useState([]); 
  const [query, setQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("none");
  const [showNav, setShowNav] = useState(false);

  const [showSettings, setShowSettings] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

 
  const [showAddOverlay, setShowAddOverlay] = useState(false);
  const [showEditOverlay, setShowEditOverlay] = useState(false);
  const [showPreviewOverlay, setShowPreviewOverlay] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

 
  const [newArt, setNewArt] = useState({
    title: "", 
    artist_id: "", 
    category: "",
    price: "",
    description: "",
    file: null, 
  });

  const [editedArt, setEditedArt] = useState(null);
  const [previewArt, setPreviewArt] = useState(null);

  
  const fetchArtists = async () => {
    try {
      const response = await fetch(`${API_URL}/api/artists`);
      if (response.ok) {
        const data = await response.json();
        setArtists(data);
      }
    } catch (error) {
      console.error("Error fetching artists:", error);
    }
  };

  const fetchProducts = async (suppressLoading = false) => {
    if (!suppressLoading) setIsLoading(true);
    
    try {
        const response = await fetch(`${API_URL}/api/products`);
        if (response.ok) {
            const data = await response.json();
            const mappedData = data.map(item => ({
                ...item,
                title: item.name, 
                image: item.image_url, 
                artist: item.artist || (item.artist_relation ? item.artist_relation.name : "Unknown") 
            }));
            setArts(mappedData);
        }
    } catch (error) {
        console.error("Error fetching products:", error);
    } finally {
        if (!suppressLoading) setIsLoading(false);
    }
  };

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        await Promise.all([fetchProducts(false), fetchArtists()]);
      } catch (error) {
        console.error("Error loading initial data", error);
      }
    };
    loadInitialData();
  }, []);

  
  const toggleSettings = () => { setShowSettings(!showSettings); setShowProfile(false); };
  const toggleProfile = () => { setShowProfile(!showProfile); setShowSettings(false); };
  const toggleNav = () => setShowNav(!showNav);

  const getImageUrl = (path) => {
      if (!path) return "https://via.placeholder.com/300";
      if (path.startsWith("http")) return path;
      return `${API_URL}${path}`;
  };

  const filtered = useMemo(() => {
    let data = [...arts];
    const q = query.trim().toLowerCase();

    if (q) {
      data = data.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          (a.artist && a.artist.toLowerCase().includes(q)) ||
          (a.category && a.category.toLowerCase().includes(q))
      );
    }

    if (sortOrder === "a-z") data.sort((a, b) => a.title.localeCompare(b.title));
    else if (sortOrder === "z-a") data.sort((a, b) => b.title.localeCompare(a.title));
    else if (sortOrder === "price") data.sort((a, b) => Number(a.price) - Number(b.price));

    return data;
  }, [arts, query, sortOrder]);

  
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this artwork?")) return;
    setIsLoading(true); 
    try {
        await fetch(`${API_URL}/api/products/${id}`, { method: "DELETE" });
        setArts((prev) => prev.filter((a) => a.id !== id));
    } catch (error) {
        alert("Failed to delete product.");
    } finally {
        setIsLoading(false);
    }
  };

  const handleEdit = (art) => {
    setEditedArt({ 
        ...art, 
        artist_id: art.artist_id || "", 
        file: null 
    });
    setShowEditOverlay(true);
  };

  const handleViewArt = (art) => {
    setPreviewArt(art);
    setShowPreviewOverlay(true);
  };

  const handleAddArtClick = () => {
    setShowAddOverlay(true);
  };

  const handleSaveNewArt = async () => {
    if(!newArt.artist_id) { alert("Please select an artist"); return; } 
    if(!newArt.category) { alert("Please select a category"); return; }

    setIsLoading(true); 
    try {
        const formData = new FormData();
        formData.append("artist_id", newArt.artist_id); 
        formData.append("name", newArt.title);
        
        const selectedArtist = artists.find(a => a.id == newArt.artist_id);
        formData.append("artist", selectedArtist ? selectedArtist.name : "Unknown"); 

        formData.append("category", newArt.category);
        formData.append("price", newArt.price);
        formData.append("description", newArt.description);
        
        if (newArt.file) formData.append("image", newArt.file);

        const response = await fetch(`${API_URL}/api/products`, {
            method: "POST",
            body: formData 
        });

        if (response.ok) {
            const result = await response.json();
            const savedProduct = result.product;
            
            setArts((prev) => [...prev, {
                ...savedProduct,
                title: savedProduct.name,
                image: savedProduct.image_url,
                artist: savedProduct.artist 
            }]);

            setShowAddOverlay(false);
            setNewArt({ title: "", artist_id: "", price: "", description: "", category: "", file: null });
            alert("Product added!");
        } else {
            alert("Failed to add product.");
        }
    } catch (error) {
        console.error("Add error", error);
    } finally {
        setIsLoading(false); 
    }
  };

  const handleSaveEdit = async () => {
    setIsLoading(true); 
    try {
        const formData = new FormData();
        formData.append("name", editedArt.title);
        
        if(editedArt.artist_id) {
            formData.append("artist_id", editedArt.artist_id);
            const selectedArtist = artists.find(a => a.id == editedArt.artist_id);
            if(selectedArtist) formData.append("artist", selectedArtist.name);
        } else {
            formData.append("artist", editedArt.artist); 
        }

        formData.append("category", editedArt.category);
        formData.append("price", editedArt.price);
        formData.append("description", editedArt.description);
        
        if (editedArt.file) formData.append("image", editedArt.file);
        
        formData.append("_method", "PUT"); 

        const response = await fetch(`${API_URL}/api/products/${editedArt.id}`, {
            method: "POST", 
            body: formData, 
        });

        if (response.ok) {
            const result = await response.json();
            const updatedProduct = result.product;
            setArts((prev) => prev.map((a) => (a.id === editedArt.id ? {
                ...updatedProduct,
                title: updatedProduct.name,
                image: updatedProduct.image_url
            } : a)));

            setShowEditOverlay(false);
            setEditedArt(null);
            alert("Product updated!");
        } else {
            alert("Failed to update.");
        }
    } catch (error) {
        console.error("Update error", error);
    } finally {
        setIsLoading(false); 
    }
  };

  return (
    <div className="admin-root" style={{ backgroundImage: `url(${wavebg})` }}>
         <style>
            {`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}
         </style>

         <header className="dashboard-header">
           <div className="brand">
             <img src={logo} alt="logo" className="brand-logo" />
           </div>
           <button className="hamburger" onClick={toggleNav}><FaBars /></button>
   
         <nav className="dashboard-nav">
          <button className="nav-item" onClick={() => navigate("/admin/dashboard")}>DASHBOARD</button>
          <button className="nav-item" onClick={() => navigate("/admin/users")}>USERS</button>
          <button className="nav-item active" onClick={() => navigate("/admin/arts")}>ARTS</button>
          <button className="nav-item" onClick={() => navigate("/admin/artists")}>ARTISTS</button>
          <button className="nav-item" onClick={() => navigate("/admin/orders")}>ORDERS</button>
          <button className="nav-item" onClick={() => navigate("/admin/messages")}>MESSAGES</button>
        </nav>
   
           <div className="icon-section">
             <FaCog className="icon-btn" onClick={toggleSettings} />
             <FaUserCircle className="icon-btn" onClick={toggleProfile} />
             {showSettings && (
               <div className="dropdown-menu">
                 <button>Account Settings</button>
                 <button>Preferences</button>
                 <button onClick={() => navigate("/admin/login")}>Logout</button>
               </div>
             )}
             {showProfile && (
               <div className="dropdown-menu">
                 <button>View Profile</button>
                 <button>Edit Profile</button>
               </div>
             )}
           </div>
         </header>

      <main className="admin-main">
        <section className="controls">
          <div className="search-group">
            <input
              className="search-input"
              placeholder="Search art..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <select
              className="select-field"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="none">Sort...</option>
              <option value="a-z">A–Z</option>
              <option value="z-a">Z–A</option>
              <option value="price">By Price</option>
            </select>
            <button className="btn">Search</button>
          </div>

          <div className="controls-right">
            <button className="btn-add" onClick={handleAddArtClick}>Add Art</button>
            <button className="btn" onClick={() => fetchProducts(false)} style={{marginLeft: '10px'}}>Refresh</button>
          </div>
        </section>

        <section className="table-section">
          <div className="table-card scrollable-table" style={{ position: "relative", minHeight: "200px" }}>
            {isLoading && (
                <div style={tableOverlayStyle}>
                    <div style={spinnerStyle}></div>
                    <span>Processing...</span>
                </div>
            )}

            <table className="users-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Title</th>
                  <th>Artist</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr className="empty-row"><td colSpan="6">No artworks found</td></tr>
                ) : (
                  filtered.map((a) => (
                    <tr key={a.id}>
                      <td><img src={getImageUrl(a.image)} alt="art" loading="lazy" style={{width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px'}} /></td>
                      <td style={{ whiteSpace: "normal", maxWidth: "200px" }}>{a.title}</td>
                      <td style={{ whiteSpace: "normal", maxWidth: "150px" }}>{a.artist}</td>
                      <td>{a.category}</td>
                      <td>₱{a.price}</td>
                      <td>
                        <button className="action-btn save" onClick={() => handleViewArt(a)}>View</button>
                        <button className="action-btn edit" onClick={() => handleEdit(a)}>Edit</button>
                        <button className="action-btn delete" onClick={() => handleDelete(a.id)}>Delete</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      
      {showAddOverlay && (
        <div className="overlay">
          <div className="overlay-content">
            <h2>Add New Artwork</h2>
            <input placeholder="Title" value={newArt.title} onChange={(e) => setNewArt({ ...newArt, title: e.target.value })} className="overlay-input" />
            
            <select className="overlay-input" value={newArt.artist_id} onChange={(e) => setNewArt({ ...newArt, artist_id: e.target.value })}>
                <option value="">-- Select Artist --</option>
                {artists.map(artist => <option key={artist.id} value={artist.id}>{artist.name}</option>)}
            </select>

            
            <select className="overlay-input" value={newArt.category} onChange={(e) => setNewArt({ ...newArt, category: e.target.value })}>
                <option value="">-- Select Category --</option>
                {CATEGORIES.map((cat, index) => <option key={index} value={cat}>{cat}</option>)}
            </select>

            <input placeholder="Price (₱)" type="number" value={newArt.price} onChange={(e) => setNewArt({ ...newArt, price: e.target.value })} className="overlay-input" />
            <textarea placeholder="Description" value={newArt.description} onChange={(e) => setNewArt({ ...newArt, description: e.target.value })} className="overlay-input" rows={3} />
            <label style={{display:'block', textAlign:'left', marginBottom:'5px', fontSize:'14px'}}>Upload Image:</label>
            <input type="file" accept="image/*" onChange={(e) => setNewArt({ ...newArt, file: e.target.files[0] })} className="overlay-input" style={{paddingTop: '10px'}} />

            <div className="overlay-actions">
              <button className="btn" onClick={handleSaveNewArt} disabled={isLoading}>Save</button>
              <button className="btn" onClick={() => setShowAddOverlay(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

     
      {showEditOverlay && editedArt && (
        <div className="overlay">
          <div className="overlay-content">
            <h2>Edit Artwork</h2>
            <input placeholder="Title" value={editedArt.title} onChange={(e) => setEditedArt({ ...editedArt, title: e.target.value })} className="overlay-input" />
            
            <select className="overlay-input" value={editedArt.artist_id || ""} onChange={(e) => setEditedArt({ ...editedArt, artist_id: e.target.value })}>
                <option value="">-- Select Artist --</option>
                {artists.map(artist => <option key={artist.id} value={artist.id}>{artist.name}</option>)}
            </select>

           
            <select className="overlay-input" value={editedArt.category} onChange={(e) => setEditedArt({ ...editedArt, category: e.target.value })}>
                <option value="">-- Select Category --</option>
                {CATEGORIES.map((cat, index) => <option key={index} value={cat}>{cat}</option>)}
            </select>

            <input placeholder="Price (₱)" type="number" value={editedArt.price} onChange={(e) => setEditedArt({ ...editedArt, price: e.target.value })} className="overlay-input" />
            <textarea placeholder="Description" value={editedArt.description} onChange={(e) => setEditedArt({ ...editedArt, description: e.target.value })} className="overlay-input" rows={3} />
            <label style={{display:'block', textAlign:'left', marginBottom:'5px', fontSize:'14px'}}>Change Image (Optional):</label>
            <input type="file" accept="image/*" onChange={(e) => setEditedArt({ ...editedArt, file: e.target.files[0] })} className="overlay-input" style={{paddingTop: '10px'}} />
            
            <div className="overlay-actions">
              <button className="btn" onClick={handleSaveEdit} disabled={isLoading}>Save</button>
              <button className="btn" onClick={() => { setShowEditOverlay(false); setEditedArt(null); }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      
      {showPreviewOverlay && previewArt && (
        <div className="overlay">
          <div className="overlay-content preview">
            <h2>{previewArt.title}</h2>
            <img src={getImageUrl(previewArt.image)} alt={previewArt.title} style={{maxWidth: "300px", maxHeight: "300px", borderRadius: "10px", marginBottom: "20px", objectFit: "contain"}} />
            <p><strong>Artist:</strong> {previewArt.artist}</p>
            <p><strong>Category:</strong> {previewArt.category}</p>
            <p><strong>Price:</strong> ₱{previewArt.price}</p>
            <p><strong>Description:</strong> {previewArt.description}</p>
            <div className="overlay-actions">
              <button className="btn" onClick={() => { setShowPreviewOverlay(false); setPreviewArt(null); }}>Close</button>
            </div>
          </div>
        </div>
      )}     
    </div>
  );
}