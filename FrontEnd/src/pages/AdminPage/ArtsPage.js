import React, { useEffect, useState, useMemo } from "react";
import "../../css/Admin.css";
import "../../css/ArtsResponsive.css"; 
import { FaUserCircle, FaCog, FaBars } from "react-icons/fa";
import logo from "../../images/logo/logo_clear.png";
import wavebg from "../../images/images/login_bg.png";
import { useNavigate } from "react-router-dom";


const API_URL = "http://localhost:8082"; 

export default function AdminArts() {
  const navigate = useNavigate();
  const [arts, setArts] = useState([]);
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
    artist: "",
    price: "",
    description: "",
    category: "",
    file: null, // Stores the actual file to upload
  });

  const [editedArt, setEditedArt] = useState(null);
  const [previewArt, setPreviewArt] = useState(null);

  // FETCH PRODUCTS
  const fetchProducts = async () => {
    setIsLoading(true);
    try {
        const response = await fetch(`${API_URL}/api/products`);
        if (response.ok) {
            const data = await response.json();
            const mappedData = data.map(item => ({
                ...item,
                title: item.name, 
                image: item.image_url, 
                origin: "Unknown"
            }));
            setArts(mappedData);
        }
    } catch (error) {
        console.error("Error fetching products:", error);
    } finally {
        setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const toggleSettings = () => {
    setShowSettings(!showSettings);
    setShowProfile(false);
  };

  const toggleProfile = () => {
    setShowProfile(!showProfile);
    setShowSettings(false);
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

    if (sortOrder === "a-z") {
      data.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortOrder === "z-a") {
      data.sort((a, b) => b.title.localeCompare(a.title));
    } else if (sortOrder === "price") {
      data.sort((a, b) => Number(a.price) - Number(b.price));
    }

    return data;
  }, [arts, query, sortOrder]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this artwork?")) return;

    try {
        await fetch(`${API_URL}/api/products/${id}`, {
            method: "DELETE"
        });
        setArts((prev) => prev.filter((a) => a.id !== id));
    } catch (error) {
        alert("Failed to delete product.");
    }
  };

  const handleEdit = (art) => {
    // When editing, we don't set a new file immediately
    setEditedArt({ ...art, file: null });
    setShowEditOverlay(true);
  };
  
  const toggleNav = () => setShowNav(!showNav);

  const handleSaveEdit = async () => {
    setIsLoading(true);
    try {
        const formData = new FormData();
        formData.append("name", editedArt.title);
        formData.append("artist", editedArt.artist);
        formData.append("category", editedArt.category);
        formData.append("price", editedArt.price);
        formData.append("description", editedArt.description);
        
        // Only append image if the user selected a new one
        if (editedArt.file) {
            formData.append("image", editedArt.file);
        }
        

        formData.append("_method", "PUT"); 

        const response = await fetch(`${API_URL}/api/products/${editedArt.id}`, {
            method: "POST", 
            body: formData, 
        });

        if (response.ok) {
            const result = await response.json();
            // Update the list with the new data from server
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

  const handleViewArt = (art) => {
    setPreviewArt(art);
    setShowPreviewOverlay(true);
  };

  const handleAddArtClick = () => {
    setShowAddOverlay(true);
  };

  const handleSaveNewArt = async () => {
    setIsLoading(true);
    try {
        // Create FormData object
        const formData = new FormData();
        formData.append("name", newArt.title);
        formData.append("artist", newArt.artist);
        formData.append("category", newArt.category);
        formData.append("price", newArt.price);
        formData.append("description", newArt.description);
        
        // Append the file object, NOT the string
        if (newArt.file) {
            formData.append("image", newArt.file);
        }

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
                origin: "Unknown"
            }]);

            setShowAddOverlay(false);
            setNewArt({
                title: "", artist: "", price: "", description: "", category: "", file: null
            });
            alert("Product added!");
        } else {
            alert("Failed to add product. Make sure all fields are filled.");
        }
    } catch (error) {
        console.error("Add error", error);
    } finally {
        setIsLoading(false);
    }
  };

  // Helper to resolve Image URL
  const getImageUrl = (path) => {
      if (!path) return "https://via.placeholder.com/300";
      // If path is a full URL (e.g. from internet), return it
      if (path.startsWith("http")) return path;
      // Otherwise append backend URL
      return `${API_URL}${path}`;
  };

  return (
    <div className="admin-root" style={{ backgroundImage: `url(${wavebg})` }}>
         {/* HEADER */}
         <header className="dashboard-header">
           <div className="brand">
             <img src={logo} alt="logo" className="brand-logo" />
           </div>
   
           <button className="hamburger" onClick={toggleNav}>
             <FaBars />
           </button>
   
         <nav className="dashboard-nav">
          <button className="nav-item" onClick={() => navigate("/admin/dashboard")}>
            DASHBOARD
          </button>
          <button className="nav-item" onClick={() => navigate("/admin/users")}>
            USERS
          </button>
          <button className="nav-item active" onClick={() => navigate("/admin/arts")}>
            ARTS
          </button>
          <button className="nav-item" onClick={() => navigate("/admin/artists")}>
            ARTISTS
          </button>
          <button className="nav-item" onClick={() => navigate("/admin/orders")}>
            ORDERS
          </button>
          <button className="nav-item" onClick={() => navigate("/admin/messages")}>
            MESSAGES
          </button>
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

      {/* MAIN CONTENT */}
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
            <button className="btn-add" onClick={handleAddArtClick}>
              Add Art
            </button>
            <button className="btn" onClick={fetchProducts} style={{marginLeft: '10px'}}>
                Refresh
            </button>
          </div>
        </section>

        <section className="table-section">
          <div className="table-card scrollable-table">
            <table className="users-table">
              <thead>
                <tr>
                  <th>Image</th> {/* Added Image Column */}
                  <th>Title</th>
                  <th>Artist</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                    <tr><td colSpan="6" style={{textAlign: "center", padding: "20px"}}>Loading Data...</td></tr>
                ) : filtered.length === 0 ? (
                  <tr className="empty-row">
                    <td colSpan="6">No artworks found</td>
                  </tr>
                ) : (
                  filtered.map((a) => (
                    <tr key={a.id}>
                  
                      <td>
                        <img 
                            src={getImageUrl(a.image)} 
                            alt="art" 
                            style={{width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px'}}
                        />
                      </td>
                      <td>{a.title}</td>
                      <td>{a.artist}</td>
                      <td>{a.category}</td>
                      <td>₱{a.price}</td>
                      <td>
                        <button className="action-btn save" onClick={() => handleViewArt(a)}>
                          View
                        </button>
                        <button className="action-btn edit" onClick={() => handleEdit(a)}>
                          Edit
                        </button>
                        <button className="action-btn delete" onClick={() => handleDelete(a.id)}>
                          Delete
                        </button>
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
            <input
              placeholder="Title"
              value={newArt.title}
              onChange={(e) => setNewArt({ ...newArt, title: e.target.value })}
              className="overlay-input"
            />
            <input
              placeholder="Artist"
              value={newArt.artist}
              onChange={(e) => setNewArt({ ...newArt, artist: e.target.value })}
              className="overlay-input"
            />
            <input
              placeholder="Category"
              value={newArt.category}
              onChange={(e) => setNewArt({ ...newArt, category: e.target.value })}
              className="overlay-input"
            />
            <input
              placeholder="Price (₱)"
              type="number"
              value={newArt.price}
              onChange={(e) => setNewArt({ ...newArt, price: e.target.value })}
              className="overlay-input"
            />
            <textarea
              placeholder="Description"
              value={newArt.description}
              onChange={(e) => setNewArt({ ...newArt, description: e.target.value })}
              className="overlay-input"
              rows={3}
            />
            
      
            <label style={{display:'block', textAlign:'left', marginBottom:'5px', fontSize:'14px'}}>Upload Image:</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setNewArt({ ...newArt, file: e.target.files[0] })}
              className="overlay-input"
              style={{paddingTop: '10px'}}
            />

            <div className="overlay-actions">
              <button className="btn" onClick={handleSaveNewArt} disabled={isLoading}>
                {isLoading ? "Saving..." : "Save"}
              </button>
              <button className="btn" onClick={() => setShowAddOverlay(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* OVERLAY - EDIT ART */}
      {showEditOverlay && editedArt && (
        <div className="overlay">
          <div className="overlay-content">
            <h2>Edit Artwork</h2>
            <input
              placeholder="Title"
              value={editedArt.title}
              onChange={(e) => setEditedArt({ ...editedArt, title: e.target.value })}
              className="overlay-input"
            />
            <input
              placeholder="Artist"
              value={editedArt.artist}
              onChange={(e) => setEditedArt({ ...editedArt, artist: e.target.value })}
              className="overlay-input"
            />
            <input
              placeholder="Category"
              value={editedArt.category}
              onChange={(e) => setEditedArt({ ...editedArt, category: e.target.value })}
              className="overlay-input"
            />
            <input
              placeholder="Price (₱)"
              type="number"
              value={editedArt.price}
              onChange={(e) => setEditedArt({ ...editedArt, price: e.target.value })}
              className="overlay-input"
            />
            <textarea
              placeholder="Description"
              value={editedArt.description}
              onChange={(e) => setEditedArt({ ...editedArt, description: e.target.value })}
              className="overlay-input"
              rows={3}
            />
            
            {/* ✅ FILE INPUT FOR EDIT */}
            <label style={{display:'block', textAlign:'left', marginBottom:'5px', fontSize:'14px'}}>Change Image (Optional):</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setEditedArt({ ...editedArt, file: e.target.files[0] })}
              className="overlay-input"
              style={{paddingTop: '10px'}}
            />

            <div className="overlay-actions">
              <button className="btn" onClick={handleSaveEdit} disabled={isLoading}>
                {isLoading ? "Saving..." : "Save"}
              </button>
              <button
                className="btn"
                onClick={() => {
                  setShowEditOverlay(false);
                  setEditedArt(null);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* OVERLAY - PREVIEW ART */}
      {showPreviewOverlay && previewArt && (
        <div className="overlay">
          <div className="overlay-content preview">
            <h2>{previewArt.title}</h2>
            {/* ✅ FIXED PREVIEW IMAGE SOURCE */}
            <img
              src={getImageUrl(previewArt.image)}
              alt={previewArt.title}
              style={{
                maxWidth: "300px",
                maxHeight: "300px",
                borderRadius: "10px",
                marginBottom: "20px",
                objectFit: "contain"
              }}
            />
            <p><strong>Artist:</strong> {previewArt.artist}</p>
            <p><strong>Category:</strong> {previewArt.category}</p>
            <p><strong>Price:</strong> ₱{previewArt.price}</p>
            <p><strong>Description:</strong> {previewArt.description}</p>

            <div className="overlay-actions">
              <button
                className="btn"
                onClick={() => {
                  setShowPreviewOverlay(false);
                  setPreviewArt(null);
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}