import React, { useState, useEffect } from "react";
import { 
  FaUserCircle, FaCog, FaBars, 
  FaUsers, FaShoppingCart, FaEnvelope, FaMoneyBillWave, FaDownload, FaChartLine 
} from "react-icons/fa";
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
  const [avgOrderValue, setAvgOrderValue] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const usersRes = await fetch(`${API_URL}/users`);
        if (usersRes.ok) {
            const users = await usersRes.json();
            setUserCount(users.length);
        }

        const ordersRes = await fetch(`${API_URL}/orders`);
        if (ordersRes.ok) {
            const orders = await ordersRes.json();
            setOrderCount(orders.length);
            
            const sales = orders.reduce((sum, order) => sum + Number(order.total_amount || 0), 0);
            setTotalSales(sales);

            if (orders.length > 0) {
                setAvgOrderValue(sales / orders.length);
            }
        }

        const messagesRes = await fetch(`${API_URL}/contact-messages`);
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

  const handleGenerateReport = () => {
    setIsGeneratingReport(true);
    const date = new Date().toLocaleString();
    const csvRows = [
        ["ADMIN DASHBOARD REPORT"],
        [`Generated on: ${date}`],
        [], 
        ["Metric", "Value"],
        ["Total Registered Users", userCount],
        ["Total Orders Processed", orderCount],
        ["Total Messages Received", messageCount],
        ["Total Revenue", `P${totalSales.toLocaleString()}`],
        ["Average Order Value", `P${avgOrderValue.toFixed(2)}`]
    ];

    const csvContent = "data:text/csv;charset=utf-8," 
        + csvRows.map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Admin_Report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => setIsGeneratingReport(false), 800);
  };

  const toggleNav = () => setShowNav(!showNav);
  const toggleSettings = () => { setShowSettings(!showSettings); setShowProfile(false); };
  const toggleProfile = () => { setShowProfile(!showProfile); setShowSettings(false); };
  const handleLogout = () => { navigate("/admin/login"); };

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
      <header className="dashboard-header">
        <div className="brand">
          <img src={logo} alt="logo" className="brand-logo" />
        </div>

        <button className="hamburger" onClick={toggleNav}>
          <FaBars />
        </button>

        <nav className={`dashboard-nav ${showNav ? "show" : ""}`}>
          <button className="nav-item active" onClick={() => navigate("/admin/dashboard")}>DASHBOARD</button>
          <button className="nav-item" onClick={() => navigate("/admin/users")}>USERS</button>
          <button className="nav-item" onClick={() => navigate("/admin/arts")}>ARTS</button>
          <button className="nav-item" onClick={() => navigate("/admin/artists")}>ARTISTS</button>
          <button className="nav-item" onClick={() => navigate("/admin/orders")}>ORDERS</button>
          <button className="nav-item" onClick={() => navigate("/admin/messages")}>MESSAGES</button>
        </nav>

        <div className="icon-section">
          <div className="icon-wrapper">
            <FaCog className="icon-btn" onClick={toggleSettings} />
            {showSettings && (
              <div className="dropdown-menu show-dropdown">
                <button>Account Settings</button>
                <button>Preferences</button>
                <button onClick={handleLogout}>Logout</button>
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

      <main className="dashboard-main">
        
       
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>Welcome Admin!</h1>
            <p style={{ color: '#555', fontSize: '1.1rem' }}>Here is an overview of your platform's performance.</p>
            
        
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                <button 
                    onClick={handleGenerateReport} 
                    disabled={isLoading || isGeneratingReport}
                    className="btn-add" 
                    style={{ 
                        display: 'flex', alignItems: 'center', gap: '10px', 
                        padding: '10px 25px', fontSize: '1rem', 
                        cursor: (isLoading || isGeneratingReport) ? 'not-allowed' : 'pointer' 
                    }}
                >
                    <FaDownload />
                    {isGeneratingReport ? "Downloading..." : "Generate Report"}
                </button>
            </div>
        </div>

        {isLoading ? (
            <div style={{textAlign: "center", marginTop: "50px", fontSize: "1.2rem", color: "#555"}}>
                Loading Dashboard Data...
            </div>
        ) : (
            <div className="stats-container">
            
           
            <div className="stat-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h3>Total Users</h3>
                        <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: '10px 0' }}>{userCount}</p>
                    </div>
                    <FaUsers size={40} color="#3498db" style={{ opacity: 0.8 }} />
                </div>
                <small style={{ color: '#777' }}>Registered accounts</small>
            </div>

         
            <div className="stat-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h3>Orders</h3>
                        <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: '10px 0' }}>{orderCount}</p>
                    </div>
                    <FaShoppingCart size={40} color="#e67e22" style={{ opacity: 0.8 }} />
                </div>
                <small style={{ color: '#777' }}>Total transactions</small>
            </div>

           
            <div className="stat-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h3>Messages</h3>
                        <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: '10px 0' }}>{messageCount}</p>
                    </div>
                    <FaEnvelope size={40} color="#9b59b6" style={{ opacity: 0.8 }} />
                </div>
                <small style={{ color: '#777' }}>Pending inquiries</small>
            </div>

           
            <div className="stat-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h3>Total Sales</h3>
                        <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: '10px 0', color: '#27ae60' }}>
                            ₱{totalSales.toLocaleString()}
                        </p>
                    </div>
                    <FaMoneyBillWave size={40} color="#27ae60" style={{ opacity: 0.8 }} />
                </div>
                <small style={{ color: '#777' }}>Avg. Order: ₱{avgOrderValue.toFixed(0)}</small>
            </div>

          
            <div className="stat-card">
                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h3>Avg. Order Value</h3>
                        <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: '10px 0' }}>
                            ₱{avgOrderValue.toFixed(0)}
                        </p>
                    </div>
                    <FaChartLine size={40} color="#f1c40f" style={{ opacity: 0.8 }} />
                </div>
                <small style={{ color: '#777' }}>Revenue efficiency</small>
            </div>

            </div>
        )}
      </main>
    </div>
  );
};

export default DashboardPage;