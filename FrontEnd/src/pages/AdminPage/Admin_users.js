import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../css/Admin.css";
import { FaUserCircle, FaCog, FaBars, FaBan, FaCheck } from "react-icons/fa";
import logo from "../../images/logo/logo_clear.png";
import wavebg from "../../images/images/login_bg.png";

export default function AdminUsers() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("none");
  
  
  const [showBanOverlay, setShowBanOverlay] = useState(false);
  const [selectedUserBan, setSelectedUserBan] = useState(null);
  const [banType, setBanType] = useState("permanent"); 
  const [banDuration, setBanDuration] = useState(1);
  const [banUnit, setBanUnit] = useState("days"); 
  const [banReason, setBanReason] = useState(""); 

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

  const toggleSettings = () => {
    setShowSettings(!showSettings);
    setShowProfile(false);
  };

  const toggleProfile = () => {
    setShowProfile(!showProfile);
    setShowSettings(false);
  };

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

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user? This cannot be undone.")) return;

    try {
        await fetch(`http://localhost:8082/api/users/${id}`, {
            method: "DELETE"
        });
        setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (error) {
        alert("Failed to delete user.");
    }
  };

  
  const handleBanClick = (user) => {
      if (user.is_banned) {
          if (window.confirm(`Unban ${user.name}?`)) {
             
             confirmBanAction(user, false, null, null, null); 
          }
      } else {
        
          setSelectedUserBan(user);
          setBanType("permanent");
          setBanDuration(1);
          setBanUnit("days");
          setBanReason(""); 
          setShowBanOverlay(true);
      }
  };

  
  const submitBan = () => {
      if (!banReason.trim()) {
          alert("Please provide a reason for this suspension.");
          return;
      }

      let bannedUntil = null;

      if (banType === "temporary") {
          const date = new Date();
          const duration = parseInt(banDuration);
          
          if (banUnit === "days") date.setDate(date.getDate() + duration);
          if (banUnit === "months") date.setMonth(date.getMonth() + duration);
          if (banUnit === "years") date.setFullYear(date.getFullYear() + duration);
          
          bannedUntil = date.toISOString().slice(0, 19).replace('T', ' ');
      }

      confirmBanAction(selectedUserBan, true, bannedUntil, banReason, banType);
     
  };

  
  const confirmBanAction = async (user, isBanned, bannedUntil, reason, type) => {
      
      setIsLoading(true);
      
      try {
        const response = await fetch(`http://localhost:8082/api/users/${user.id}/ban`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({ 
                is_banned: isBanned,
                banned_until: isBanned ? bannedUntil : null,
                ban_reason: isBanned ? reason : null,
                type: isBanned ? type : null 
            }) 
        });

        if (response.ok) {
            const updatedUser = await response.json(); 
            
            setUsers((prev) =>
              prev.map((u) => (u.id === user.id ? updatedUser : u))
            );
            
            setShowBanOverlay(false); 
            const msg = !isBanned ? "User Activated." : "User has been suspended successfully.";
            alert(msg);
        } else {
            alert("Failed to update status.");
        }
    } catch (error) {
        console.error("Ban error:", error);
        alert("Network error.");
    } finally {
       
        setIsLoading(false);
    }
  };

  return (
    <div className="admin-root" style={{ backgroundImage: `url(${wavebg})`, backgroundSize: "cover", backgroundPosition: "center" }}>
      
      <header className="dashboard-header">
        <div className="brand"><img src={logo} alt="logo" className="brand-logo" /></div>
        <button className="hamburger" onClick={toggleNav}><FaBars /></button>
        <nav className={`dashboard-nav ${isNavOpen ? "show" : ""}`}>
          <button className="nav-item" onClick={() => navigate("/admin/dashboard")}>DASHBOARD</button>
          <button className="nav-item active" onClick={() => navigate("/admin/users")}>USERS</button>
          <button className="nav-item" onClick={() => navigate("/admin/arts")}>ARTS</button>
          <button className="nav-item" onClick={() => navigate("/admin/artists")}>ARTISTS</button>
          <button className="nav-item" onClick={() => navigate("/admin/orders")}>ORDERS</button>
          <button className="nav-item" onClick={() => navigate("/admin/messages")}>MESSAGES</button>
        </nav>
        <div className="icon-section">
          <div className="icon-wrapper">
            <FaCog className="icon-btn" onClick={toggleSettings} />
            {showSettings && (<div className="dropdown-menu show-dropdown"><button>Account Settings</button><button>Preferences</button><button onClick={() => navigate("/admin/login")}>Logout</button></div>)}
          </div>
          <div className="icon-wrapper">
            <FaUserCircle className="icon-btn" onClick={toggleProfile} />
            {showProfile && (<div className="dropdown-menu show-dropdown"><button>View Profile</button><button>Edit Profile</button></div>)}
          </div>
        </div>
      </header>

      <main className="admin-main">
        <section className="controls">
          <div className="search-group">
            <input className="search-input" placeholder="Search user..." value={query} onChange={(e) => setQuery(e.target.value)} />
            <select className="select-field" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
              <option value="none">Sort...</option>
              <option value="a-z">A–Z</option>
              <option value="z-a">Z–A</option>
              <option value="age">By Age</option>
            </select>
            <button className="btn btn-search">Search</button>
          </div>
          <div className="controls-right">
            
            <button className="btn" onClick={fetchUsers} style={{marginLeft: '10px'}}>Refresh Data</button>
          </div>
        </section>

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
                  <th>STATUS</th> 
                  <th>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {isLoading && !showBanOverlay ? (
                    <tr><td colSpan="7" style={{textAlign: "center", padding: "20px"}}>Loading Data...</td></tr>
                ) : filtered.length === 0 ? (
                  <tr className="empty-row"><td colSpan="7">No results found</td></tr>
                ) : (
                  filtered.map((u) => (
                    <tr key={u.id} style={{ opacity: u.is_banned ? 0.6 : 1 }}>
                      <td>{u.name}</td>
                      <td>{u.email}</td>
                      <td>{u.address || "N/A"}</td>
                      <td>{u.contact || "N/A"}</td>
                      <td>{u.age || "-"}</td>
                      <td>
                        <span style={{
                                backgroundColor: u.is_banned ? "#ffcccc" : "#ccffcc",
                                color: u.is_banned ? "#cc0000" : "#006600",
                                padding: "4px 8px", borderRadius: "4px", fontWeight: "bold", fontSize: "0.85rem"
                            }}
                        >
                            {u.is_banned ? "BANNED" : "ACTIVE"}
                        </span>
                      </td>
                      <td>
                        <button
                          className="action-btn"
                          onClick={() => handleBanClick(u)}
                          style={{ 
                              backgroundColor: u.is_banned ? "#28a745" : "#ff9800",
                              color: "white", marginRight: "5px", display: "inline-flex", alignItems: "center", gap: "4px"
                          }}
                          title={u.is_banned ? "Re-activate User" : "Suspend User"}
                        >
                          {u.is_banned ? <FaCheck /> : <FaBan />}
                          {u.is_banned ? "Activate" : "Ban"}
                        </button>
                        <button className="action-btn delete" onClick={() => handleDelete(u.id)}>Delete</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>

     
      {showBanOverlay && selectedUserBan && (
          <div className="overlay">
            <div className="overlay-content" style={{ maxWidth: '450px' }}>
                <h2 style={{color: '#d32f2f'}}>Suspend User</h2>
                <p>Select suspension details for <strong>{selectedUserBan.name}</strong>:</p>
                
                <div style={{ margin: '20px 0', textAlign: 'left' }}>
                    
                    <div style={{ marginBottom: '15px' }}>
                        <div style={{ marginBottom: '10px' }}>
                            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                                <input 
                                    type="radio" name="banType" value="permanent" 
                                    checked={banType === "permanent"} onChange={() => setBanType("permanent")}
                                    style={{ marginRight: '10px', width: '20px', height: '20px' }}
                                />
                                <strong>Permanent Ban</strong>
                            </label>
                        </div>
                        <div style={{ marginBottom: '10px' }}>
                            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                                <input 
                                    type="radio" name="banType" value="temporary" 
                                    checked={banType === "temporary"} onChange={() => setBanType("temporary")}
                                    style={{ marginRight: '10px', width: '20px', height: '20px' }}
                                />
                                <strong>Temporary Suspension</strong>
                            </label>
                        </div>
                        {banType === "temporary" && (
                            <div style={{ paddingLeft: '30px', display: 'flex', gap: '10px' }}>
                                <input type="number" min="1" value={banDuration} onChange={(e) => setBanDuration(e.target.value)} style={{ width: '80px', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}/>
                                <select value={banUnit} onChange={(e) => setBanUnit(e.target.value)} style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}>
                                    <option value="days">Days</option>
                                    <option value="months">Months</option>
                                    <option value="years">Years</option>
                                </select>
                            </div>
                        )}
                    </div>

                    
                    <div style={{ borderTop: '1px solid #eee', paddingTop: '15px' }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Reason for Suspension (Required):</label>
                        <textarea
                            rows="3"
                            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', fontFamily: 'inherit', resize: 'vertical' }}
                            placeholder="e.g. Violation of Terms of Service, Inappropriate behavior, Fake profile..."
                            value={banReason}
                            onChange={(e) => setBanReason(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overlay-actions">
                    
                    <button 
                        className="btn" 
                        onClick={submitBan} 
                        disabled={isLoading}
                        style={{ backgroundColor: '#d32f2f', color: 'white', opacity: isLoading ? 0.7 : 1, cursor: isLoading ? 'not-allowed' : 'pointer' }}
                    >
                        {isLoading ? "Processing..." : "Confirm Suspension"}
                    </button>
                    
                    <button 
                        className="btn" 
                        onClick={() => setShowBanOverlay(false)}
                        disabled={isLoading} 
                    >
                        Cancel
                    </button>
                </div>
            </div>
          </div>
      )}

    </div>
  );
}