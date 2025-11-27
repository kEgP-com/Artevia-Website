import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../css/Admin.css";
import { FaUserCircle, FaCog, FaBars } from "react-icons/fa";
import logo from "../../images/logo/logo_clear.png";
import wavebg from "../../images/images/login_bg.png";

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
  

  const [isLoading, setIsLoading] = useState(false);

  const toggleNav = () => setIsNavOpen(!isNavOpen);


  const fetchUsers = async () => {
    setIsLoading(true);
    try {
        const response = await fetch("http://localhost:8082/api/users");
        if (response.ok) {
            const data = await response.json();
            setUsers(data);
        } else {
            console.error("Failed to fetch users");
        }
    } catch (error) {
        console.error("Network error:", error);
    } finally {
        setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
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

  // --- FILTERING & SORTING ---
  const filtered = useMemo(() => {
    let data = [...users];
    const q = query.trim().toLowerCase();

    if (q) {
      data = data.filter(
        (u) =>
          u.name.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          (u.address && u.address.toLowerCase().includes(q))
      );
    }

    if (sortOrder === "a-z") {
      data.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOrder === "z-a") {
      data.sort((a, b) => b.name.localeCompare(a.name));
    } else if (sortOrder === "age") {
      data.sort((a, b) => (a.age || 0) - (b.age || 0));
    }

    return data;
  }, [users, query, sortOrder]);

  // --- CRUD FUNCTIONS ---
  

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user? This cannot be undone.")) return;

    try {
        const response = await fetch(`http://localhost:8082/api/users/${id}`, {
            method: "DELETE"
        });
        
        setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (error) {
        alert("Failed to delete user.");
    }
  };

  const handleEdit = (user) => {
    setEditingId(user.id);
    setEditedUser({ ...user });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditedUser({});
  };

  const handleChange = (e, key) => {
    setEditedUser((prev) => ({ ...prev, [key]: e.target.value }));
  };


  const handleSave = async (id) => {
    try {
        const response = await fetch(`http://localhost:8082/api/users/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(editedUser)
        });

        if (response.ok) {
            setUsers((prev) =>
              prev.map((u) => (u.id === id ? { ...editedUser } : u))
            );
            setEditingId(null);
            alert("User updated successfully!");
        } else {
            alert("Failed to update user.");
        }
    } catch (error) {
        console.error("Update error:", error);
        alert("Network error.");
    }
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
        password: "password123"
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
      password: "password123"
    }));
    setNewUsers(newArray);
  };

  const handleNewUserChange = (index, key, value) => {
    const updated = [...newUsers];
    updated[index][key] = value;
    setNewUsers(updated);
  };

  // ✅ SAVE NEW USERS (Backend Connected)
  const handleSaveNewUsers = async () => {
    setIsLoading(true);
    try {
        for (const user of newUsers) {
            await fetch("http://localhost:8082/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({
                    email: user.email,
                    password: user.password,
                    name: user.name,
                    address: user.address,
                    contact: user.contact,
                    age: user.age
                })
            });
        }
        
        await fetchUsers();
        setShowOverlay(false);
        alert("Users added successfully!");
    } catch (error) {
        console.error("Add user error:", error);
        alert("Failed to add some users.");
    } finally {
        setIsLoading(false);
    }
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
            <button className="btn" onClick={fetchUsers} style={{marginLeft: '10px'}}>
              Refresh Data
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
                {isLoading ? (
                    <tr><td colSpan="6" style={{textAlign: "center", padding: "20px"}}>Loading Data...</td></tr>
                ) : filtered.length === 0 ? (
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
                          <>
                            <button
                              className="action-btn save"
                              onClick={() => handleSave(u.id)}
                            >
                              Save
                            </button>
                            {/* ✅ NEW CANCEL BUTTON */}
                            <button
                                className="action-btn"
                                onClick={handleCancelEdit}
                                style={{ marginLeft: "5px", backgroundColor: "#6c757d", color: "white" }}
                            >
                                Cancel
                            </button>
                          </>
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
              <button className="btn" onClick={handleSaveNewUsers} disabled={isLoading}>
                {isLoading ? "Saving..." : "Save"}
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