import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
// import "../../css/Admin.css";
import "../../css/AdminMessage.css";
import {
  FaUserCircle,
  FaCog,
  FaSearch,
  FaEnvelopeOpenText,
  FaPaperPlane,
  FaBars
} from "react-icons/fa";
import logo from "../../images/logo/logo_clear.png";
import wavebg from "../../images/images/login_bg.png";
import messagesData from "../../data/messages.json";

export default function AdminMessages() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [query, setQuery] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("none");
  const [showSettings, setShowSettings] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [viewMessage, setViewMessage] = useState(null);
  const [responseText, setResponseText] = useState("");
  const [isNavOpen, setIsNavOpen] = useState(false);
  const toggleNav = () => setIsNavOpen(!isNavOpen);
  useEffect(() => {
    const dataWithResponses = messagesData.map((m) => ({
      ...m,
      response: m.response || "",
    }));
    setMessages(dataWithResponses);
  }, []);

  const toggleSettings = () => {
    setShowSettings(!showSettings);
    setShowProfile(false);
  };

  const toggleProfile = () => {
    setShowProfile(!showProfile);
    setShowSettings(false);
  };

  const handleSearch = () => {
    setQuery(searchTerm);
  };

  const handleDelete = (id) => {
    if (!window.confirm("Delete this message?")) return;
    setMessages((prev) => prev.filter((m) => m.id !== id));
    setViewMessage(null);
  };

  const handleSendResponse = () => {
    if (!responseText.trim()) return alert("Please enter a response before sending.");

    const updatedMessages = messages.map((m) =>
      m.id === viewMessage.id
        ? { ...m, response: responseText, status: "Resolved" }
        : m
    );

    setMessages(updatedMessages);
    const updatedMessage = updatedMessages.find((m) => m.id === viewMessage.id);
    setViewMessage(updatedMessage);
    alert("Response sent and message marked as Resolved!");
    setResponseText(updatedMessage.response);
  };

  const handleMarkResolved = (id) => {
    const message = messages.find((m) => m.id === id);
    if (!message) return;

    if (!message.response && !responseText.trim()) {
      return alert("Please write a response before marking as resolved.");
    }

    const updatedResponse = responseText.trim() || message.response;
    const updatedMessages = messages.map((m) =>
      m.id === id ? { ...m, response: updatedResponse, status: "Resolved" } : m
    );

    setMessages(updatedMessages);
    const updatedMessage = updatedMessages.find((m) => m.id === id);
    setViewMessage(updatedMessage);
    alert("Message marked as Resolved with your response!");
    setResponseText("");
  };

  const filtered = useMemo(() => {
    let data = [...messages];
    const q = query.trim().toLowerCase();

    if (q) {
      data = data.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.email.toLowerCase().includes(q)
      );
    }

    switch (sortOrder) {
      case "latest":
        data.sort((a, b) => new Date(b.date) - new Date(a.date));
        break;
      case "oldest":
        data.sort((a, b) => new Date(a.date) - new Date(b.date));
        break;
      case "unread":
        data = data.filter((m) => m.status.toLowerCase() === "unread");
        break;
      case "resolved":
        data = data.filter((m) => m.status.toLowerCase() === "resolved");
        break;
      default:
        break;
    }

    return data;
  }, [messages, query, sortOrder]);

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
          <button className="nav-item" onClick={() => navigate("/admin/orders")}>
            ORDERS
          </button>
          <button className="nav-item active" onClick={() => navigate("/admin/messages")}>
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
              placeholder="Search messages..."
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
              <option value="unread">Unread Only</option>
              <option value="resolved">Resolved Only</option>
            </select>
          </div>
        </section>

        <section className="table-section">
          <div className="table-card scrollable-table">
            <table className="users-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr className="empty-row">
                    <td colSpan="6">No messages found</td>
                  </tr>
                ) : (
                  filtered.map((m) => (
                    <tr key={m.id}>
                      <td>{m.id}</td>
                      <td>{m.name}</td>
                      <td>{m.email}</td>
                      <td>{m.date}</td>
                      <td>
                        <span
                          className={`status-badge ${
                            m.status.toLowerCase() === "unread"
                              ? "status-pending"
                              : "status-completed"
                          }`}
                        >
                          {m.status}
                        </span>
                      </td>
                      <td>
                        <button
                          className="action-btn save"
                          onClick={() => {
                            setViewMessage(m);
                            setResponseText("");
                          }}
                        >
                          View
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

      {/* VIEW MESSAGE OVERLAY */}
      {viewMessage && (
        <div className="overlay">
          <div className="overlay-content">
            <h2>
              <FaEnvelopeOpenText /> Message #{viewMessage.id}
            </h2>
            <p><strong>Name:</strong> {viewMessage.name}</p>
            <p><strong>Email:</strong> {viewMessage.email}</p>
            <p><strong>Subject:</strong> {viewMessage.subject}</p>
            <p><strong>Date:</strong> {viewMessage.date}</p>
            <p><strong>Status:</strong> {viewMessage.status}</p>

            <div className="message-box">
              <strong>Message:</strong>
              <p>{viewMessage.message}</p>
            </div>

            {viewMessage.response && (
              <div className="previous-response">
                <strong>Previous Response:</strong>
                <p>{viewMessage.response}</p>
              </div>
            )}

            <div className="response-container">
              <label><strong>Response:</strong></label>
              <textarea
                className="response-input"
                placeholder="Type your response here..."
                value={responseText}
                onChange={(e) => setResponseText(e.target.value)}
              />
              <button className="btn save" onClick={handleSendResponse}>
                <FaPaperPlane /> Send Response
              </button>
            </div>

            {viewMessage.status === "Resolved" && (
              <p style={{ marginTop: "10px", color: "#4a7c59", fontWeight: "bold" }}>
                This message has been marked as resolved.
              </p>
            )}

            <div className="overlay-actions">
              {viewMessage.status !== "Resolved" && (
                <button className="btn save" onClick={() => handleMarkResolved(viewMessage.id)}>
                  Mark as Resolved
                </button>
              )}
              <button className="btn delete" onClick={() => handleDelete(viewMessage.id)}>
                Delete
              </button>
              <button className="btn" onClick={() => setViewMessage(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
