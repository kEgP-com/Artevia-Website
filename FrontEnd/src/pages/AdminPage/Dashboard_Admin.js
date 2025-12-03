import React, { useState, useEffect } from "react";
import { FaUserCircle, FaCog, FaBars } from "react-icons/fa";
import wavebg from "../../images/images/wavebg.png";
import logo from "../../images/logo/logo_clear.png";
import "../../css/Admin.css";
import { useNavigate } from "react-router-dom";
import "../../css/DashboardResponsive.css";


const API_URL = "http://localhost:8082/api";

const DashboardPage = () => {
  const navigate = useNavigate();
  const [showSettings, setShowSettings] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showNav, setShowNav] = useState(false);


  const [userCount, setUserCount] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  const [messageCount, setMessageCount] = useState(0);
  const [totalSales, setTotalSales] = useState(0);
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // 1. Fetch Users Count
        const usersRes = await fetch(`${API_URL}/users`);
        if (usersRes.ok) {
            const users = await usersRes.json();
            setUserCount(users.length);
        }

        // 2. Fetch Orders & Calculate Sales
        const ordersRes = await fetch(`${API_URL}/orders`);
        if (ordersRes.ok) {
            const orders = await ordersRes.json();
            setOrderCount(orders.length);
            
            // Sum up 'total_amount' from database
            const sales = orders.reduce((sum, order) => sum + Number(order.total_amount || 0), 0);
            setTotalSales(sales);
        }

        // 3. Fetch Messages Count
        const messagesRes = await fetch(`${API_URL}/messages`);
        if (messagesRes.ok) {
            const messages = await messagesRes.json();
            setMessageCount(messages.length);
        }

      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const toggleNav = () => setShowNav(!showNav);
  const toggleSettings = () => {
    setShowSettings(!showSettings);
    setShowProfile(false);
  };
  const toggleProfile = () => {
    setShowProfile(!showProfile);
    setShowSettings(false);
  };

  const handleLogout = () => {
    navigate("/admin/login");
  };

  return (
    <div
      className="admin-root"
      style={{
        backgroundImage: `url(${wavebg})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center bottom",
        overflowY: "auto",
        minHeight: "100vh",
      }}
    >
      {/* HEADER */}
      <header className="dashboard-header">
        <div className="brand">
          <img src={logo} alt="logo" className="brand-logo" />
        </div>

        {/* Hamburger button visible on mobile */}
        <button className="hamburger" onClick={toggleNav}>
          <FaBars />
        </button>

        {/* Navigation links */}
        <nav className={`dashboard-nav ${showNav ? "show" : ""}`}>
          <button
            className="nav-item active"
            onClick={() => navigate("/admin/dashboard")}
          >
            DASHBOARD
          </button>
          <button className="nav-item" onClick={() => navigate("/admin/users")}>
            USERS
          </button>
          <button className="nav-item" onClick={() => navigate("/admin/arts")}>
            ARTS
          </button>
          <button
            className="nav-item"
            onClick={() => navigate("/admin/artists")}
          >
            ARTISTS
          </button>
          <button className="nav-item" onClick={() => navigate("/admin/orders")}>
            ORDERS
          </button>
          <button
            className="nav-item"
            onClick={() => navigate("/admin/messages")}
          >
            MESSAGES
          </button>
        </nav>

        {/* Settings + Profile icons */}
        <div className="icon-section">
          <div className="icon-wrapper">
            <FaCog className="icon-btn" onClick={toggleSettings} />
            {showSettings && (
              <div className="dropdown-menu">
                <button>Account Settings</button>
                <button>Preferences</button>
                <button onClick={handleLogout}>Logout</button>
              </div>
            )}
          </div>

          <div className="icon-wrapper">
            <FaUserCircle className="icon-btn" onClick={toggleProfile} />
            {showProfile && (
              <div className="dropdown-menu">
                <button>View Profile</button>
                <button>Edit Profile</button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="dashboard-main">
        <h1>Welcome Admin!</h1>
        <p>Monitor your users, products, and activity all in one place.</p>

        {isLoading ? (
            <div style={{textAlign: "center", marginTop: "50px", fontSize: "1.2rem"}}>
                Loading Dashboard Data...
            </div>
        ) : (
            <div className="stats-container">
            <div className="stat-card">
                <h3>Users</h3>
                <p>{userCount}</p>
            </div>
            <div className="stat-card">
                <h3>Orders</h3>
                <p>{orderCount}</p>
            </div>
            <div className="stat-card">
                <h3>Messages</h3>
                <p>{messageCount}</p>
            </div>
            <div className="stat-card">
                <h3>Sales</h3>
                <p>₱{totalSales.toLocaleString()}</p>
            </div>
            </div>
        )}
      </main>
    </div>
  );
};

export default DashboardPage;