import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "../../css/Admin.css";
import "../../css/ArtistPageResponsive.css";
import { FaUserCircle, FaCog, FaBars } from "react-icons/fa";
import logo from "../../images/logo/logo_clear.png";
import wavebg from "../../images/images/login_bg.png";

// ✅ 1. Configuration
const API_URL = "http://localhost:8082"; 

export default function AdminArtists() {
  const navigate = useNavigate();

  const [artists, setArtists] = useState([]);
  const [query, setQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("none");

  const [showSettings, setShowSettings] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showNav, setShowNav] = useState(false);

  const [showAddOverlay, setShowAddOverlay] = useState(false);
  const [showEditOverlay, setShowEditOverlay] = useState(false);
  const [showPreviewOverlay, setShowPreviewOverlay] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);

  // ✅ 2. State for New Artist
  const [newArtist, setNewArtist] = useState({
    name: "",
    origin: "",
    style: "",
    bio: "",
    email: "",
    file: null, 
  });

  const [editedArtist, setEditedArtist] = useState(null);
  const [previewArtist, setPreviewArtist] = useState(null);

  // ✅ 3. FETCH DATA
  const fetchArtists = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/artists`);
      if (response.ok) {
        const data = await response.json();
        setArtists(data);
      }
    } catch (error) {
      console.error("Error fetching artists:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchArtists();
  }, []);

  // UI Toggles
  const toggleSettings = () => { setShowSettings(!showSettings); setShowProfile(false); };
  const toggleProfile = () => { setShowProfile(!showProfile); setShowSettings(false); };
  const toggleNav = () => setShowNav(!showNav);
  const handleLogout = () => navigate("/admin/login");

  // Filtering
  const filtered = useMemo(() => {
    let data = [...artists];
    const q = query.trim().toLowerCase();

    if (q) {
      data = data.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          (a.origin && a.origin.toLowerCase().includes(q)) ||
          (a.style && a.style.toLowerCase().includes(q))
      );
    }

    if (sortOrder === "a-z") {
      data.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOrder === "z-a") {
      data.sort((a, b) => b.name.localeCompare(a.name));
    }

    return data;
  }, [artists, query, sortOrder]);

  // ✅ 4. DELETE ARTIST
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this artist?")) return;
    try {
        await fetch(`${API_URL}/api/artists/${id}`, { method: "DELETE" });
        setArtists((prev) => prev.filter((a) => a.id !== id));
    } catch (error) {
        alert("Failed to delete artist.");
    }
  };

  const handleEdit = (artist) => {
    setEditedArtist({ ...artist, file: null });
    setShowEditOverlay(true);
  };

  // ✅ 5. SAVE EDIT
  const handleSaveEdit = async () => {
    setIsLoading(true);
    try {
        const formData = new FormData();
        formData.append("name", editedArtist.name);
        formData.append("origin", editedArtist.origin || "");
        formData.append("style", editedArtist.style || "");
        formData.append("email", editedArtist.email || "");
        formData.append("bio", editedArtist.bio || "");
        
        if (editedArtist.file) {
            formData.append("image", editedArtist.file);
        }
        
        formData.append("_method", "PUT"); 

        const response = await fetch(`${API_URL}/api/artists/${editedArtist.id}`, {
            method: "POST", 
            body: formData,
        });

        if (response.ok) {
            const result = await response.json();
            setArtists((prev) => prev.map((a) => (a.id === editedArtist.id ? result.artist : a)));
            setShowEditOverlay(false);
            setEditedArtist(null);
            alert("Artist updated!");
        } else {
            alert("Failed to update.");
        }
    } catch (error) {
        console.error(error);
    } finally {
        setIsLoading(false);
    }
  };

  const handleViewArtist = (artist) => {
    setPreviewArtist(artist);
    setShowPreviewOverlay(true);
  };

  const handleAddArtistClick = () => {
    setShowAddOverlay(true);
  };

  // ✅ 6. SAVE NEW ARTIST
  const handleSaveNewArtist = async () => {
    setIsLoading(true);
    try {
        const formData = new FormData();
        formData.append("name", newArtist.name);
        formData.append("origin", newArtist.origin);
        formData.append("style", newArtist.style);
        formData.append("email", newArtist.email);
        formData.append("bio", newArtist.bio);
        
        if (newArtist.file) {
            formData.append("image", newArtist.file);
        }

        const response = await fetch(`${API_URL}/api/artists`, {
            method: "POST",
            body: formData,
        });

        if (response.ok) {
            const result = await response.json();
            setArtists((prev) => [...prev, result.artist]);
            setShowAddOverlay(false);
            setNewArtist({ name: "", origin: "", style: "", bio: "", email: "", file: null });
            alert("Artist added!");
        } else {
            alert("Failed to add artist.");
        }
    } catch (error) {
        console.error(error);
    } finally {
        setIsLoading(false);
    }
  };

  // ✅ Helper: Returns null if no image, so we can show default icon
  const getImageUrl = (path) => {
      if (!path) return null; // No placeholder, just null
      if (path.startsWith("http")) return path;
      return `${API_URL}${path}`;
  };

  // ✅ Component: Renders Image or Default Icon
  const ArtistProfileImage = ({ path, size = 40 }) => {
      const url = getImageUrl(path);
      if (url) {
          return (
              <img 
                  src={url} 
                  alt="profile" 
                  style={{ width: `${size}px`, height: `${size}px`, borderRadius: '50%', objectFit: 'cover' }} 
              />
          );
      }
      return <FaUserCircle size={size} color="#ccc" />;
  };

  return (
    <div
      className="admin-root"
      style={{
        backgroundImage: `url(${wavebg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* HEADER */}
      <header className="dashboard-header">
        <div className="brand">
          <img src={logo} alt="logo" className="brand-logo" />
        </div>

        <button className="hamburger" onClick={toggleNav}>
          <FaBars />
        </button>

          <nav className="dashboard-nav">
            <button className="nav-item" onClick={() => navigate("/admin/dashboard")}>DASHBOARD</button>
            <button className="nav-item" onClick={() => navigate("/admin/users")}>USERS</button>
            <button className="nav-item" onClick={() => navigate("/admin/arts")}>ARTS</button>
            <button className="nav-item active" onClick={() => navigate("/admin/artists")}>ARTISTS</button>
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
              <button onClick={handleLogout}>Logout</button>
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
              placeholder="Search artists..."
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
            </select>
            <button className="btn">Search</button>
          </div>

          <div className="controls-right">
            <button className="btn-add" onClick={handleAddArtistClick}>Add Artist</button>
          </div>
        </section>

        <section className="table-section">
          <div className="table-card scrollable-table">
            <table className="users-table">
              <thead>
                <tr>
                  {/* ✅ Changed Header to "Profile" */}
                  <th>Profile</th>
                  <th>Name</th>
                  <th className="hide-mobile">Origin</th>
                  <th className="hide-mobile">Style</th>
                  <th className="hide-tablet">Email</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                    <tr><td colSpan="6" style={{textAlign:"center"}}>Loading...</td></tr>
                ) : filtered.length === 0 ? (
                  <tr className="empty-row">
                    <td colSpan="6">No artists found</td>
                  </tr>
                ) : (
                  filtered.map((a) => (
                    <tr key={a.id}>
                       <td>
                        {/* ✅ Use new Component for Default Icon */}
                        <ArtistProfileImage path={a.profile_image} size={40} />
                      </td>
                      <td>{a.name}</td>
                      <td className="hide-mobile">{a.origin}</td>
                      <td className="hide-mobile">{a.style}</td>
                      <td className="hide-tablet">{a.email}</td>
                      <td>
                        <button className="action-btn save" onClick={() => handleViewArtist(a)}>View</button>
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

      {/* OVERLAY: ADD ARTIST */}
      {showAddOverlay && (
        <div className="overlay">
          <div className="overlay-content">
            <h2>Add New Artist</h2>
            <input
                placeholder="Name"
                value={newArtist.name}
                onChange={(e) => setNewArtist({...newArtist, name: e.target.value})}
                className="overlay-input"
            />
            <input
                placeholder="Origin"
                value={newArtist.origin}
                onChange={(e) => setNewArtist({...newArtist, origin: e.target.value})}
                className="overlay-input"
            />
            <input
                placeholder="Style"
                value={newArtist.style}
                onChange={(e) => setNewArtist({...newArtist, style: e.target.value})}
                className="overlay-input"
            />
            <input
                placeholder="Email"
                value={newArtist.email}
                onChange={(e) => setNewArtist({...newArtist, email: e.target.value})}
                className="overlay-input"
            />
            <textarea
                placeholder="Biography"
                rows={3}
                value={newArtist.bio}
                onChange={(e) => setNewArtist({...newArtist, bio: e.target.value})}
                className="overlay-input"
            />
            
            {/* ✅ Label Changed */}
            <label style={{display:'block', textAlign:'left', fontSize:'14px'}}>Profile (Optional):</label>
            <input 
                type="file" 
                accept="image/*"
                onChange={(e) => setNewArtist({...newArtist, file: e.target.files[0]})}
                className="overlay-input"
            />

            <div className="overlay-actions">
              <button className="btn" onClick={handleSaveNewArtist} disabled={isLoading}>
                {isLoading ? "Saving..." : "Save"}
              </button>
              <button className="btn" onClick={() => setShowAddOverlay(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* OVERLAY: EDIT ARTIST */}
      {showEditOverlay && editedArtist && (
        <div className="overlay">
          <div className="overlay-content">
            <h2>Edit Artist</h2>
            <input
                placeholder="Name"
                value={editedArtist.name}
                onChange={(e) => setEditedArtist({...editedArtist, name: e.target.value})}
                className="overlay-input"
            />
            <input
                placeholder="Origin"
                value={editedArtist.origin}
                onChange={(e) => setEditedArtist({...editedArtist, origin: e.target.value})}
                className="overlay-input"
            />
            <input
                placeholder="Style"
                value={editedArtist.style}
                onChange={(e) => setEditedArtist({...editedArtist, style: e.target.value})}
                className="overlay-input"
            />
            <input
                placeholder="Email"
                value={editedArtist.email}
                onChange={(e) => setEditedArtist({...editedArtist, email: e.target.value})}
                className="overlay-input"
            />
            <textarea
                placeholder="Biography"
                rows={3}
                value={editedArtist.bio}
                onChange={(e) => setEditedArtist({...editedArtist, bio: e.target.value})}
                className="overlay-input"
            />

            {/* ✅ Label Changed */}
            <label style={{display:'block', textAlign:'left', fontSize:'14px'}}>Change Profile (Optional):</label>
            <input 
                type="file" 
                accept="image/*"
                onChange={(e) => setEditedArtist({...editedArtist, file: e.target.files[0]})}
                className="overlay-input"
            />

            <div className="overlay-actions">
              <button className="btn" onClick={handleSaveEdit} disabled={isLoading}>
                {isLoading ? "Saving..." : "Save"}
              </button>
              <button className="btn" onClick={() => setShowEditOverlay(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* OVERLAY: VIEW ARTIST */}
      {showPreviewOverlay && previewArtist && (
        <div className="overlay">
          <div className="overlay-content preview">
            <div style={{marginBottom: '15px'}}>
               <ArtistProfileImage path={previewArtist.profile_image} size={150} />
            </div>
            <h2>{previewArtist.name}</h2>
            <p><strong>Origin:</strong> {previewArtist.origin || "Unknown"}</p>
            <p><strong>Style:</strong> {previewArtist.style || "Unknown"}</p>
            <p><strong>Email:</strong> {previewArtist.email || "N/A"}</p>
            <p style={{marginTop: '10px'}}>{previewArtist.bio || "No biography available."}</p>
            <div className="overlay-actions">
              <button className="btn" onClick={() => setShowPreviewOverlay(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}