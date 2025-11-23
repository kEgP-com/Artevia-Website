import React, { useEffect, useState, useMemo } from "react";
import "../../css/Admin.css";
import "../../css/ArtsResponsive.css"; // ✅ new responsive CSS
import { FaUserCircle, FaCog, FaBars } from "react-icons/fa";
import logo from "../../images/logo/logo_clear.png";
import wavebg from "../../images/images/login_bg.png";
import artsData from "../../data/arts.json";
import { useNavigate } from "react-router-dom";
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

  const [newArt, setNewArt] = useState({
    title: "",
    artist: "",
    origin: "",
    price: "",
    description: "",
    category: "",
    image: "",
  });

  const [editedArt, setEditedArt] = useState(null);
  const [previewArt, setPreviewArt] = useState(null);

  useEffect(() => {
    setArts(artsData);
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
          a.artist.toLowerCase().includes(q) ||
          a.origin.toLowerCase().includes(q) ||
          a.category.toLowerCase().includes(q)
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

  const handleDelete = (id) => {
    if (!window.confirm("Delete this artwork?")) return;
    setArts((prev) => prev.filter((a) => a.id !== id));
  };

  const handleEdit = (art) => {
    setEditedArt({ ...art });
    setShowEditOverlay(true);
  };
  const toggleNav = () => setShowNav(!showNav);
  const handleSaveEdit = () => {
    setArts((prev) => prev.map((a) => (a.id === editedArt.id ? editedArt : a)));
    setShowEditOverlay(false);
    setEditedArt(null);
  };

  const handleViewArt = (art) => {
    setPreviewArt(art);
    setShowPreviewOverlay(true);
  };

  const handleAddArtClick = () => {
    setShowAddOverlay(true);
  };

  const handleSaveNewArt = () => {
    setArts((prev) => [...prev, { id: Date.now(), ...newArt }]);
    setShowAddOverlay(false);
    setNewArt({
      title: "",
      artist: "",
      origin: "",
      price: "",
      description: "",
      category: "",
      image: "",
    });
  };

  const handleImportImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imgURL = URL.createObjectURL(file);
      setEditedArt({ ...editedArt, image: imgURL });
    }
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
          </div>
        </section>

        <section className="table-section">
          <div className="table-card scrollable-table">
            <table className="users-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Artist</th>
                  <th>Origin</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr className="empty-row">
                    <td colSpan="6">No artworks found</td>
                  </tr>
                ) : (
                  filtered.map((a) => (
                    <tr key={a.id}>
                      <td>{a.title}</td>
                      <td>{a.artist}</td>
                      <td>{a.origin}</td>
                      <td>{a.category}</td>
                      <td>₱{a.price}</td>
                      <td>
                        <button
                          className="action-btn save"
                          onClick={() => handleViewArt(a)}
                        >
                          View
                        </button>
                        <button
                          className="action-btn edit"
                          onClick={() => handleEdit(a)}
                        >
                          Edit
                        </button>
                        <button
                          className="action-btn delete"
                          onClick={() => handleDelete(a.id)}
                        >
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
  {/* OVERLAY - EDIT ART */}
      {showEditOverlay && editedArt && (
        <div className="overlay">
          <div className="overlay-content">
            <h2>Edit Artwork</h2>
            <input
              placeholder="Title"
              value={editedArt.title}
              onChange={(e) =>
                setEditedArt({ ...editedArt, title: e.target.value })
              }
              className="overlay-input"
            />
            <input
              placeholder="Artist"
              value={editedArt.artist}
              onChange={(e) =>
                setEditedArt({ ...editedArt, artist: e.target.value })
              }
              className="overlay-input"
            />
            <input
              placeholder="Origin"
              value={editedArt.origin}
              onChange={(e) =>
                setEditedArt({ ...editedArt, origin: e.target.value })
              }
              className="overlay-input"
            />
            <input
              placeholder="Category"
              value={editedArt.category}
              onChange={(e) =>
                setEditedArt({ ...editedArt, category: e.target.value })
              }
              className="overlay-input"
            />
            <input
              placeholder="Price (₱)"
              type="number"
              value={editedArt.price}
              onChange={(e) =>
                setEditedArt({ ...editedArt, price: e.target.value })
              }
              className="overlay-input"
            />
            <textarea
              placeholder="Description"
              value={editedArt.description}
              onChange={(e) =>
                setEditedArt({ ...editedArt, description: e.target.value })
              }
              className="overlay-input"
              rows={3}
            />
            <input
              placeholder="Image URL"
              value={editedArt.image}
              onChange={(e) =>
                setEditedArt({ ...editedArt, image: e.target.value })
              }
              className="overlay-input"
            />

            <div className="overlay-actions">
              <button className="btn" onClick={handleSaveEdit}>
                Save
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
            <img
              src={previewArt.image || "https://via.placeholder.com/300"}
              alt={previewArt.title}
              style={{
                maxWidth: "300px",
                maxHeight: "300px",
                borderRadius: "10px",
                marginBottom: "20px",
              }}
            />
            <p>
              <strong>Artist:</strong> {previewArt.artist}
            </p>
            <p>
              <strong>Origin:</strong> {previewArt.origin}
            </p>
            <p>
              <strong>Category:</strong> {previewArt.category}
            </p>
            <p>
              <strong>Price:</strong> ₱{previewArt.price}
            </p>
            <p>
              <strong>Description:</strong> {previewArt.description}
            </p>

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


