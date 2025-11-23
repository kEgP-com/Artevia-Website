import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "../../css/Admin.css";
import "../../css/ArtistPageResponsive.css";
import { FaUserCircle, FaCog, FaBars } from "react-icons/fa";
import logo from "../../images/logo/logo_clear.png";
import artistsData from "../../data/Artist.json";
import wavebg from "../../images/images/login_bg.png";

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

  const [newArtist, setNewArtist] = useState({
    name: "",
    origin: "",
    style: "",
    bio: "",
    email: "",
  });

  const [editedArtist, setEditedArtist] = useState(null);
  const [previewArtist, setPreviewArtist] = useState(null);

  // Load artist data
  useEffect(() => {
    setArtists(artistsData);
  }, []);

  // Toggle dropdowns
  const toggleSettings = () => {
    setShowSettings(!showSettings);
    setShowProfile(false);
  };

  const toggleProfile = () => {
    setShowProfile(!showProfile);
    setShowSettings(false);
  };

  const toggleNav = () => setShowNav(!showNav);

  // Search & sorting
  const filtered = useMemo(() => {
    let data = [...artists];
    const q = query.trim().toLowerCase();

    if (q) {
      data = data.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          a.origin.toLowerCase().includes(q) ||
          a.style.toLowerCase().includes(q)
      );
    }

    if (sortOrder === "a-z") {
      data.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOrder === "z-a") {
      data.sort((a, b) => b.name.localeCompare(a.name));
    }

    return data;
  }, [artists, query, sortOrder]);

  // CRUD handlers
  const handleDelete = (id) => {
    if (!window.confirm("Delete this artist?")) return;
    setArtists((prev) => prev.filter((a) => a.id !== id));
  };

  const handleEdit = (artist) => {
    setEditedArtist({ ...artist });
    setShowEditOverlay(true);
  };

  const handleSaveEdit = () => {
    setArtists((prev) =>
      prev.map((a) => (a.id === editedArtist.id ? editedArtist : a))
    );
    setShowEditOverlay(false);
    setEditedArtist(null);
  };

  const handleViewArtist = (artist) => {
    setPreviewArtist(artist);
    setShowPreviewOverlay(true);
  };

  const handleAddArtistClick = () => {
    setShowAddOverlay(true);
  };

  const handleSaveNewArtist = () => {
    setArtists((prev) => [...prev, { id: Date.now(), ...newArtist }]);
    setShowAddOverlay(false);
    setNewArtist({
      name: "",
      origin: "",
      style: "",
      bio: "",
      email: "",
    });
  };



  // Logout handler
  const handleLogout = () => {
    // Optional: clear any stored session
    // localStorage.removeItem("adminToken");
    navigate("/admin/login");
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
            <button className="nav-item" onClick={() => navigate("/admin/dashboard")}>
              DASHBOARD
            </button>
            <button className="nav-item" onClick={() => navigate("/admin/users")}>
              USERS
            </button>
            <button className="nav-item" onClick={() => navigate("/admin/arts")}>
              ARTS
            </button>
            <button className="nav-item active" onClick={() => navigate("/admin/artists")}>
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

          {/* SETTINGS DROPDOWN */}
          {showSettings && (
            <div className="dropdown-menu">
              <button onClick={() => alert("Account Settings clicked")}>
                Account Settings
              </button>
              <button onClick={() => alert("Preferences clicked")}>
                Preferences
              </button>
              <button onClick={handleLogout}>Logout</button>
            </div>
          )}

          {/* PROFILE DROPDOWN */}
          {showProfile && (
            <div className="dropdown-menu">
              <button onClick={() => alert("View Profile clicked")}>
                View Profile
              </button>
              <button onClick={() => alert("Edit Profile clicked")}>
                Edit Profile
              </button>
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
            <button className="btn-add" onClick={handleAddArtistClick}>
              Add Artist
            </button>
          </div>
        </section>

        <section className="table-section">
          <div className="table-card scrollable-table">
            <table className="users-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th className="hide-mobile">Origin</th>
                  <th className="hide-mobile">Style</th>
                  <th className="hide-tablet">Email</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr className="empty-row">
                    <td colSpan="6">No artists found</td>
                  </tr>
                ) : (
                  filtered.map((a) => (
                    <tr key={a.id}>
                      <td>{a.name}</td>
                      <td className="hide-mobile">{a.origin}</td>
                      <td className="hide-mobile">{a.style}</td>
                      <td className="hide-tablet">{a.email}</td>
                      <td>
                        <button
                          className="action-btn save"
                          onClick={() => handleViewArtist(a)}
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
    </div>
  );
}
