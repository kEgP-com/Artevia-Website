import React, { useEffect, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../css/Admin.css";
import { FaUserCircle, FaCog, FaSearch,FaBars } from "react-icons/fa";
import logo from "../../images/logo/logo_clear.png";
import wavebg from "../../images/images/login_bg.png";
import ordersData from "../../data/orders.json";
// import "../../css/AdminMessage.css";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [query, setQuery] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("none");
  const [showSettings, setShowSettings] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showEditOverlay, setShowEditOverlay] = useState(false);
  const [showViewOverlay, setShowViewOverlay] = useState(false);
  const [editedOrder, setEditedOrder] = useState(null);
  const [viewOrder, setViewOrder] = useState(null);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const toggleNav = () => setIsNavOpen(!isNavOpen);
  const navigate = useNavigate();

  useEffect(() => {
    setOrders(ordersData);
  }, []);

  const toggleSettings = () => {
    setShowSettings(!showSettings);
    setShowProfile(false);
  };

  const toggleProfile = () => {
    setShowProfile(!showProfile);
    setShowSettings(false);
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      navigate("/admin/login");
    }
  };

  const handleSearch = () => {
    setQuery(searchTerm);
  };

  const filtered = useMemo(() => {
    let data = [...orders];
    const q = query.trim().toLowerCase();

    if (q) {
      data = data.filter(
        (o) =>
          o.customer.toLowerCase().includes(q) ||
          o.id.toString().includes(q) ||
          o.status.toLowerCase().includes(q)
      );
    }

    switch (sortOrder) {
      case "latest":
        data.sort((a, b) => new Date(b.dateOrdered) - new Date(a.dateOrdered));
        break;
      case "oldest":
        data.sort((a, b) => new Date(a.dateOrdered) - new Date(b.dateOrdered));
        break;
      case "status":
        data.sort((a, b) => a.status.localeCompare(b.status));
        break;
      case "pending":
        data = data.filter((o) => o.status.toLowerCase() === "pending");
        break;
      case "cancelled":
        data = data.filter((o) => o.status.toLowerCase() === "cancelled");
        break;
      case "delivered":
        data = data.filter(
          (o) =>
            o.status.toLowerCase() === "completed" ||
            o.status.toLowerCase() === "delivered"
        );
        break;
      default:
        break;
    }

    return data;
  }, [orders, query, sortOrder]);

  const handleDelete = (id) => {
    if (!window.confirm("Delete this order?")) return;
    setOrders((prev) => prev.filter((o) => o.id !== id));
    setShowViewOverlay(false);
    setShowEditOverlay(false);
  };

  const handleEdit = (order) => {
    setEditedOrder({ ...order });
    setShowEditOverlay(true);
  };

  const handleSaveEdit = () => {
    setOrders((prev) =>
      prev.map((o) => (o.id === editedOrder.id ? editedOrder : o))
    );
    setShowEditOverlay(false);
    setEditedOrder(null);
  };

  const handleViewOrder = (order) => {
    setViewOrder(order);
    setShowViewOverlay(true);
  };

  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "status-pending";
      case "processing":
        return "status-processing";
      case "shipped":
        return "status-shipped";
      case "completed":
      case "delivered":
        return "status-completed";
      case "cancelled":
        return "status-cancelled";
      default:
        return "";
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

        <nav className={`dashboard-nav ${isNavOpen ? "show" : ""}`}>
          <button className="nav-item" onClick={() => navigate("/admin/dashboard")}>
            DASHBOARD
          </button>
          <button className="nav-item" onClick={() => navigate("/admin/users")}>
            USERS
          </button>
          <button className="nav-item" onClick={() => navigate("/admin/arts")}>
            ARTS
          </button>
          <button className="nav-item" onClick={() => navigate("/admin/artists")}>
            ARTISTS
          </button>
          <button className="nav-item active" onClick={() => navigate("/admin/orders")}>
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
        <section className="controls">
          <div className="search-group">
            <input
              className="search-input"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="btn" onClick={handleSearch}>
              <FaSearch /> Search
            </button>
            <select
              className="select-field"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="none">Sort...</option>
              <option value="latest">Latest</option>
              <option value="oldest">Oldest</option>
              <option value="status">By Status</option>
              <option value="pending">Pending Only</option>
              <option value="cancelled">Cancelled Only</option>
              <option value="delivered">Delivered Only</option>
            </select>
          </div>
        </section>

        <section className="table-section">
          <div className="table-card scrollable-table">
            <table className="users-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Date Ordered</th>
                  <th>Date Delivered</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr className="empty-row">
                    <td colSpan="7">No orders found</td>
                  </tr>
                ) : (
                  filtered.map((o) => (
                    <tr key={o.id}>
                      <td>{o.id}</td>
                      <td>{o.customer}</td>
                      <td>{o.dateOrdered}</td>
                      <td>
                        {o.status.toLowerCase() === "completed" ||
                        o.status.toLowerCase() === "delivered"
                          ? o.dateDelivered || "— Delivered —"
                          : o.status.toLowerCase() === "cancelled"
                          ? o.dateCancelled || "— Cancelled —"
                          : "— Pending —"}
                      </td>
                      <td>₱{o.total}</td>
                      <td>
                        <span
                          className={`status-badge ${getStatusClass(o.status)}`}
                        >
                          {o.status}
                        </span>
                      </td>
                      <td>
                        <button
                          className="action-btn save"
                          onClick={() => handleViewOrder(o)}
                        >
                          View
                        </button>
                        <button
                          className="action-btn edit"
                          onClick={() => handleEdit(o)}
                        >
                          Edit
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

      {/* VIEW OVERLAY */}
      {showViewOverlay && viewOrder && (
        <div className="overlay">
          <div className="overlay-content">
            <h2>Order #{viewOrder.id}</h2>
            <p><strong>Customer:</strong> {viewOrder.customer}</p>
            <p><strong>Date Ordered:</strong> {viewOrder.dateOrdered}</p>
            <p><strong>Date Delivered:</strong> {viewOrder.dateDelivered || "— Not Delivered —"}</p>
            <p><strong>Status:</strong> {viewOrder.status}</p>
            <p><strong>Payment Method:</strong> {viewOrder.paymentMethod}</p>
            <p><strong>Total:</strong> ₱{viewOrder.total}</p>

            <h3>Artworks Ordered:</h3>
            <ul>
              {viewOrder.items.map((item, i) => (
                <li key={i} style={{ marginBottom: "10px" }}>
                  <strong>{item.name}</strong> — ₱{item.price}
                  <br />
                  <span>Artist: {item.artist}</span>
                  <br />
                  <span>Type: {item.artistType}</span>
                </li>
              ))}
            </ul>

            <div className="overlay-actions">
              <button className="btn delete" onClick={() => handleDelete(viewOrder.id)}>
                Delete
              </button>
              <button className="btn" onClick={() => setShowViewOverlay(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT OVERLAY */}
      {showEditOverlay && editedOrder && (
        <div className="overlay">
          <div className="overlay-content">
            <h2>Edit Order #{editedOrder.id}</h2>
            <label>Status:</label>
            <select
              className="overlay-input"
              value={editedOrder.status}
              onChange={(e) =>
                setEditedOrder({ ...editedOrder, status: e.target.value })
              }
            >
              <option value="Pending">Pending</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
            <div className="overlay-actions">
              <button className="btn save" onClick={handleSaveEdit}>
                Save
              </button>
              <button
                className="btn cancel"
                onClick={() => {
                  setShowEditOverlay(false);
                  setEditedOrder(null);
                }}
              >
                Cancel
              </button>
              <button
                className="btn delete"
                onClick={() => handleDelete(editedOrder.id)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
