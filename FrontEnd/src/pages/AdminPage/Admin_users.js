import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../css/Admin.css";
import { FaUserCircle, FaCog, FaBars } from "react-icons/fa";
import logo from "../../images/logo/logo_clear.png";
import wavebg from "../../images/images/login_bg.png";
import usersData from "../../data/users.json";

export default function AdminUsers() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("none");
  const [editingId, setEditingId] = useState(null);
  const [editedUser, setEditedUser] = useState({});
  const [showOverlay, setShowOverlay] = useState(false);
  const [newUsersCount, setNewUsersCount] = useState(1);
  const [newUsers, setNewUsers] = useState([]);
  const [showSettings, setShowSettings] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const toggleNav = () => setIsNavOpen(!isNavOpen);
  useEffect(() => {
    setUsers(usersData);
  }, []);

  // --- DROPDOWNS ---
  const toggleSettings = () => {
    setShowSettings(!showSettings);
    setShowProfile(false);
  };

  const toggleProfile = () => {
    setShowProfile(!showProfile);
    setShowSettings(false);
  };

  // --- NAVIGATION ---
  const goTo = (path) => navigate(path);

  const handleLogout = () => {
    // Example: clear session if needed
    // localStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  // --- FILTERING & SORTING ---
  const filtered = useMemo(() => {
    let data = [...users];
    const q = query.trim().toLowerCase();

    if (q) {
      data = data.filter(
        (u) =>
          u.name.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          u.address.toLowerCase().includes(q)
      );
    }

    if (sortOrder === "a-z") {
      data.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOrder === "z-a") {
      data.sort((a, b) => b.name.localeCompare(a.name));
    } else if (sortOrder === "age") {
      data.sort((a, b) => a.age - b.age);
    }

    return data;
  }, [users, query, sortOrder]);

  // --- CRUD FUNCTIONS ---
  const handleDelete = (id) => {
    if (!window.confirm("Delete this user?")) return;
    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  const handleEdit = (user) => {
    setEditingId(user.id);
    setEditedUser({ ...user });
  };

  const handleChange = (e, key) => {
    setEditedUser((prev) => ({ ...prev, [key]: e.target.value }));
  };

  const handleSave = (id) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...editedUser } : u))
    );
    setEditingId(null);
  };

  // --- ADD USER OVERLAY ---
  const handleAddClick = () => {
    setShowOverlay(true);
    setNewUsers([
      {
        id: Date.now(),
        name: "",
        email: "",
        address: "",
        contact: "",
        age: "",
      },
    ]);
  };

  const handleAddCountChange = (count) => {
    const number = Math.max(1, Number(count) || 1);
    setNewUsersCount(number);
    const newArray = Array.from({ length: number }, (_, i) => ({
      id: Date.now() + i,
      name: "",
      email: "",
      address: "",
      contact: "",
      age: "",
    }));
    setNewUsers(newArray);
  };

  const handleNewUserChange = (index, key, value) => {
    const updated = [...newUsers];
    updated[index][key] = value;
    setNewUsers(updated);
  };

  const handleSaveNewUsers = () => {
    setUsers((prev) => [...prev, ...newUsers]);
    setShowOverlay(false);
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

        <nav className={`dashboard-nav ${isNavOpen ? "show" : ""}`}>
          <button className="nav-item" onClick={() => navigate("/admin/dashboard")}>
            DASHBOARD
          </button>
          <button className="nav-item active" onClick={() => navigate("/admin/users")}>
            USERS
          </button>
          <button className="nav-item" onClick={() => navigate("/admin/arts")}>
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
          <div className="icon-wrapper">
            <FaCog className="icon-btn" onClick={toggleSettings} />
            {showSettings && (
              <div className="dropdown-menu show-dropdown">
                <button>Account Settings</button>
                <button>Preferences</button>
                <button onClick={() => navigate("/admin/login")}>Logout</button>
              </div>
            )}
          </div>

          <div className="icon-wrapper">
            <FaUserCircle className="icon-btn" onClick={toggleProfile} />
            {showProfile && (
              <div className="dropdown-menu show-dropdown">
                <button>View Profile</button>
                <button>Edit Profile</button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="admin-main">
        {/* Controls */}
        <section className="controls">
          <div className="search-group">
            <input
              className="search-input"
              placeholder="Search user..."
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
              <option value="age">By Age</option>
            </select>
            <button className="btn btn-search">Search</button>
          </div>

          <div className="controls-right">
            <button className="btn-add" onClick={handleAddClick}>
              Add User
            </button>
          </div>
        </section>

        {/* TABLE */}
        <section className="table-section">
          <div className="table-card scrollable-table">
            <table className="users-table">
              <thead>
                <tr>
                  <th>NAME</th>
                  <th>EMAIL</th>
                  <th>ADDRESS</th>
                  <th>CONTACT NO.</th>
                  <th>AGE</th>
                  <th>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr className="empty-row">
                    <td colSpan="6">No results found</td>
                  </tr>
                ) : (
                  filtered.map((u) => (
                    <tr key={u.id}>
                      <td>
                        {editingId === u.id ? (
                          <input
                            type="text"
                            value={editedUser.name}
                            onChange={(e) => handleChange(e, "name")}
                            className="edit-input"
                          />
                        ) : (
                          u.name
                        )}
                      </td>
                      <td>
                        {editingId === u.id ? (
                          <input
                            type="email"
                            value={editedUser.email}
                            onChange={(e) => handleChange(e, "email")}
                            className="edit-input"
                          />
                        ) : (
                          u.email
                        )}
                      </td>
                      <td>
                        {editingId === u.id ? (
                          <input
                            type="text"
                            value={editedUser.address}
                            onChange={(e) => handleChange(e, "address")}
                            className="edit-input"
                          />
                        ) : (
                          u.address
                        )}
                      </td>
                      <td>
                        {editingId === u.id ? (
                          <input
                            type="text"
                            value={editedUser.contact}
                            onChange={(e) => handleChange(e, "contact")}
                            className="edit-input"
                          />
                        ) : (
                          u.contact
                        )}
                      </td>
                      <td>
                        {editingId === u.id ? (
                          <input
                            type="number"
                            value={editedUser.age}
                            onChange={(e) => handleChange(e, "age")}
                            className="edit-input"
                          />
                        ) : (
                          u.age
                        )}
                      </td>
                      <td>
                        {editingId === u.id ? (
                          <button
                            className="action-btn save"
                            onClick={() => handleSave(u.id)}
                          >
                            Save
                          </button>
                        ) : (
                          <>
                            <button
                              className="action-btn edit"
                              onClick={() => handleEdit(u)}
                            >
                              Edit
                            </button>
                            <button
                              className="action-btn delete"
                              onClick={() => handleDelete(u.id)}
                            >
                              Delete
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {/* Overlay for adding users */}
      {showOverlay && (
        <div className="overlay">
          <div className="overlay-content">
            <h2>Add New Users</h2>
            <label>
              How many users to add:
              <input
                type="number"
                className="overlay-input"
                value={newUsersCount}
                onChange={(e) => handleAddCountChange(e.target.value)}
              />
            </label>

            <div className="overlay-users-form">
              {newUsers.map((user, i) => (
                <div key={i} className="overlay-user-box">
                  <h4>User {i + 1}</h4>
                  <input
                    placeholder="Name"
                    value={user.name}
                    onChange={(e) => handleNewUserChange(i, "name", e.target.value)}
                  />
                  <input
                    placeholder="Email"
                    value={user.email}
                    onChange={(e) => handleNewUserChange(i, "email", e.target.value)}
                  />
                  <input
                    placeholder="Address"
                    value={user.address}
                    onChange={(e) => handleNewUserChange(i, "address", e.target.value)}
                  />
                  <input
                    placeholder="Contact No."
                    value={user.contact}
                    onChange={(e) => handleNewUserChange(i, "contact", e.target.value)}
                  />
                  <input
                    placeholder="Age"
                    type="number"
                    value={user.age}
                    onChange={(e) => handleNewUserChange(i, "age", e.target.value)}
                  />
                </div>
              ))}
            </div>

            <div className="overlay-actions">
              <button className="btn" onClick={handleSaveNewUsers}>
                Save
              </button>
              <button className="btn" onClick={() => setShowOverlay(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
