import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";
import "../../css/AccountPage.css";
import {
  FaUser,
  FaMapMarkerAlt,
  FaPhone,
  FaCreditCard,
  FaEdit,
  FaLock,
  FaTimes,
  FaSignOutAlt,
} from "react-icons/fa";

export default function AccountPage() {
  const navigate = useNavigate();

  // Initialize state
  const [account, setAccount] = useState({
    id: "",
    fullName: "",
    email: "",
    username: "",
    age: "", // ✅ Added Age
    password: "",
    address: "",
    contact: "",
    payment: {
      paypal: "",
      gcash: "",
    },
  });

  const [showOverlay, setShowOverlay] = useState(false);
  const [field, setField] = useState(""); 
  
  // Temporary States for Editing
  // ✅ Added age to tempPersonal
  const [tempPersonal, setTempPersonal] = useState({ fullName: "", email: "", username: "", age: "" });
  const [tempValue, setTempValue] = useState(""); 
  const [tempPayment, setTempPayment] = useState({ paypal: "", gcash: "" });
  
  const [isLoading, setIsLoading] = useState(false);

  // Fetch Fresh Data on Mount
  useEffect(() => {
    const fetchUserData = async () => {
      const saved = localStorage.getItem("accountInfo");
      if (!saved) {
        navigate("/customer/login");
        return;
      }
      const localData = JSON.parse(saved);

      try {
        const response = await fetch(`http://localhost:8082/api/users/${localData.id}`);
        
        if (response.ok) {
            const dbData = await response.json();
            
            setAccount({
                id: dbData.id,
                fullName: dbData.name,
                username: dbData.name,
                email: dbData.email,
                age: dbData.age || "", // ✅ Set Age from DB
                password: localData.password,
                address: dbData.address || "No address set",
                contact: dbData.contact || "No contact set",
                payment: {
                    paypal: dbData.paypal || "Not Set",
                    gcash: dbData.gcash || "Not Set"
                }
            });
        }
      } catch (error) {
        console.error("Network error fetching user data", error);
      }
    };

    fetchUserData();
  }, [navigate]);

  useEffect(() => {
    if (account.id) {
        localStorage.setItem("accountInfo", JSON.stringify(account));
    }
  }, [account]);

  // Open Overlay Logic
  const openOverlay = (section) => {
    setField(section);
    
    if (section === "personal") {
        setTempPersonal({
            fullName: account.fullName,
            email: account.email,
            username: account.username,
            age: account.age // ✅ Load current age into temp state
        });
    } else if (section === "payment") {
        setTempPayment(account.payment);
    } else {
        setTempValue(account[section]);
    }
    setShowOverlay(true);
  };

  // Handle Save
  const handleSave = async () => {
    setIsLoading(true);
    let payload = {};

    if (field === "personal") {
        payload = {
            name: tempPersonal.fullName,
            email: tempPersonal.email,
            age: tempPersonal.age // ✅ Include Age in payload
        };
    } else if (field === "payment") {
        payload = {
            gcash: tempPayment.gcash,
            paypal: tempPayment.paypal
        };
    } else if (field === "address") {
        payload = { address: tempValue };
    } else if (field === "contact") {
        payload = { contact: tempValue };
    } else if (field === "password") {
        payload = { password: tempValue }; 
    }

    try {
        if (!account.id) {
            alert("Error: User ID missing. Please login again.");
            navigate("/customer/login");
            return;
        }

        const response = await fetch(`http://localhost:8082/api/users/${account.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            // Update Local State
            if (field === "personal") {
                setAccount(prev => ({
                    ...prev,
                    fullName: tempPersonal.fullName,
                    email: tempPersonal.email,
                    username: tempPersonal.username,
                    age: tempPersonal.age // ✅ Update Age in UI
                }));
            } else if (field === "payment") {
                setAccount(prev => ({ ...prev, payment: tempPayment }));
            } else {
                setAccount(prev => ({ ...prev, [field]: tempValue }));
            }

            setShowOverlay(false);
            alert(`${field.charAt(0).toUpperCase() + field.slice(1)} updated successfully!`);
        } else {
            alert("Failed to update. Server returned an error.");
        }

    } catch (error) {
        console.error("Update error:", error);
        alert("Network error. Is the backend running?");
    } finally {
        setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("accountInfo");
    navigate("/customer/login");
  };

  const logoutButtonStyle = {
    backgroundColor: "#e63946",
    color: "white",
    border: "none",
    padding: "8px 16px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "500",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    transition: "background-color 0.3s",
  };

  const logoutButtonHoverStyle = {
    ...logoutButtonStyle,
    backgroundColor: "#c92c3a",
  };

  const [isHovered, setIsHovered] = useState(false);

  return (
    <>
      <Navbar />
      <style>{`
        .loading-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.6);
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          z-index: 9999;
          backdrop-filter: blur(5px);
        }
        .spinner {
          border: 6px solid #f3f3f3;
          border-top: 6px solid #3498db;
          border-radius: 50%;
          width: 50px;
          height: 50px;
          animation: spin 1s linear infinite;
          margin-bottom: 15px;
        }
        .loading-text {
          color: white;
          font-size: 1.2rem;
          font-weight: bold;
          font-family: sans-serif;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>

      {isLoading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
          <div className="loading-text">Saving Changes...</div>
        </div>
      )}

      <div className="account-page">
        <div className="account-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 className="account-heading">My Account</h2>
          <button
            style={isHovered ? logoutButtonHoverStyle : logoutButtonStyle}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={handleLogout}
          >
            <FaSignOutAlt style={{ fontSize: "1rem" }} /> Logout
          </button>
        </div>

        <div className="account-container">
          {/* Personal Info Section */}
          <div className="account-box">
            <h3>
              <FaUser className="account-icon" /> Personal Information
              <FaEdit
                className="edit-icon"
                title="Edit Personal Info"
                onClick={() => openOverlay("personal")}
              />
            </h3>
            <hr />
            <p><strong>Full Name:</strong> {account.fullName}</p>
            <p><strong>Email:</strong> {account.email}</p>
            <p><strong>Username:</strong> {account.username}</p>
            {/* ✅ Added Age Display */}
            <p><strong>Age:</strong> {account.age}</p>
            
            <p className="password-line">
              <strong>Password:</strong> ••••••••
              <FaLock
                className="edit-icon"
                title="Edit Password"
                onClick={() => openOverlay("password")}
              />
            </p>
          </div>

          {/* Address Section */}
          <div className="account-box">
            <h3>
              <FaMapMarkerAlt className="account-icon" /> Address
              <FaEdit
                className="edit-icon"
                title="Edit Address"
                onClick={() => openOverlay("address")}
              />
            </h3>
            <hr />
            <p>{account.address}</p>
          </div>

          {/* Contact Section */}
          <div className="account-box">
            <h3>
              <FaPhone className="account-icon" /> Contact
              <FaEdit
                className="edit-icon"
                title="Edit Contact Number"
                onClick={() => openOverlay("contact")}
              />
            </h3>
            <hr />
            <p>{account.contact}</p>
          </div>

          {/* Payment Section */}
          <div className="account-box">
            <h3>
              <FaCreditCard className="account-icon" /> Payment Methods
              <FaEdit
                className="edit-icon"
                title="Edit Payment Methods"
                onClick={() => openOverlay("payment")}
              />
            </h3>
            <hr />
            <p><strong>PayPal:</strong> {account.payment?.paypal}</p>
            <p><strong>GCash:</strong> {account.payment?.gcash}</p>
          </div>
        </div>
      </div>

      {/* Dynamic Overlay Content */}
      {showOverlay && (
        <div className="overlay">
          <div className="overlay-content">
            <button className="close-btn" onClick={() => setShowOverlay(false)}>
              <FaTimes />
            </button>

            <h2>Edit {field === 'personal' ? 'Personal Information' : field.charAt(0).toUpperCase() + field.slice(1)}</h2>

            {/* Content Switcher based on Field */}
            {field === "personal" ? (
               <div className="payment-edit"> 
                 <label>Full Name</label>
                 <input
                   className="overlay-input"
                   value={tempPersonal.fullName}
                   onChange={(e) => setTempPersonal({...tempPersonal, fullName: e.target.value})}
                 />
                 <label>Email</label>
                 <input
                   className="overlay-input"
                   value={tempPersonal.email}
                   onChange={(e) => setTempPersonal({...tempPersonal, email: e.target.value})}
                 />
                 <label>Username</label>
                 <input
                   className="overlay-input"
                   value={tempPersonal.username}
                   onChange={(e) => setTempPersonal({...tempPersonal, username: e.target.value})}
                 />
                 {/* ✅ Added Age Input */}
                 <label>Age</label>
                 <input
                   className="overlay-input"
                   type="number"
                   value={tempPersonal.age}
                   onChange={(e) => setTempPersonal({...tempPersonal, age: e.target.value})}
                 />
               </div>
            ) : field === "payment" ? (
              <div className="payment-edit">
                <label>PayPal Link / Email</label>
                <input
                  type="text"
                  className="overlay-input"
                  value={tempPayment.paypal}
                  onChange={(e) => setTempPayment((prev) => ({ ...prev, paypal: e.target.value }))}
                  placeholder="Enter your PayPal link"
                />
                <label>GCash Number</label>
                <input
                  type="text"
                  className="overlay-input"
                  value={tempPayment.gcash}
                  onChange={(e) => setTempPayment((prev) => ({ ...prev, gcash: e.target.value }))}
                  placeholder="Enter your GCash number"
                />
              </div>
            ) : (
              <>
                <p>Enter new {field}:</p>
                <input
                  type={field === "password" ? "password" : "text"}
                  value={tempValue}
                  onChange={(e) => setTempValue(e.target.value)}
                  className="overlay-input"
                />
              </>
            )}

            <button className="save-btn" onClick={handleSave} disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}