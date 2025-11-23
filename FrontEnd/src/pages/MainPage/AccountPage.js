import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";
import "../../css/AccountPage.css";
import {
  FaUser,
  FaEnvelope,
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

  const [account, setAccount] = useState({
    fullName: "Carl M. Rodriguez",
    email: "carl.rodriguez@example.com",
    username: "carl123",
    password: "mypassword123",
    address: "Blk. 13 Lt. 5 Phase 2 Mabuhay, Cabuyao Laguna",
    contact: "+63 912 345 6789",
    payment: {
      paypal: "paypal.me/artgallery123",
      gcash: "0912 345 6789",
    },
  });

  const [showOverlay, setShowOverlay] = useState(false);
  const [field, setField] = useState("");
  const [tempValue, setTempValue] = useState("");
  const [tempPayment, setTempPayment] = useState(account.payment);

  useEffect(() => {
    const saved = localStorage.getItem("accountInfo");
    if (saved) setAccount(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("accountInfo", JSON.stringify(account));
  }, [account]);

  const openOverlay = (key) => {
    setField(key);
    if (key === "payment") setTempPayment(account.payment);
    else setTempValue(account[key]);
    setShowOverlay(true);
  };

  const handleSave = () => {
    if (field === "payment") {
      setAccount((prev) => ({ ...prev, payment: tempPayment }));
    } else {
      setAccount((prev) => ({ ...prev, [field]: tempValue }));
    }
    setShowOverlay(false);
    alert(`${field} updated successfully!`);
  };

  // ✅ Logout function
  const handleLogout = () => {
    localStorage.removeItem("accountInfo");
    navigate("/customer/login");
  };

  // ✅ Inline style for the logout button
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

      <div className="account-page">
        <div
          className="account-header"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h2 className="account-heading">My Account</h2>

          {/* ✅ Logout Button with inline CSS */}
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
          {/* Personal Info */}
          <div className="account-box">
            <h3>
              <FaUser className="account-icon" /> Personal Information
            </h3>
            <hr />
            <p>
              <strong>Full Name:</strong> {account.fullName}
            </p>
            <p>
              <strong>Email:</strong> {account.email}
            </p>
            <p>
              <strong>Username:</strong> {account.username}
              <FaEdit
                className="edit-icon"
                title="Edit Username"
                onClick={() => openOverlay("username")}
              />
            </p>

            <p className="password-line">
              <strong>Password:</strong> ••••••••
              <FaLock
                className="edit-icon"
                title="Edit Password"
                onClick={() => openOverlay("password")}
              />
            </p>
          </div>

          {/* Address */}
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

          {/* Contact */}
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

          {/* Payment */}
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
            <p>
              <strong>PayPal:</strong> {account.payment.paypal}
            </p>
            <p>
              <strong>GCash:</strong> {account.payment.gcash}
            </p>
          </div>
        </div>
      </div>

      {/* Editable Overlay */}
      {showOverlay && (
        <div className="overlay">
          <div className="overlay-content">
            <button className="close-btn" onClick={() => setShowOverlay(false)}>
              <FaTimes />
            </button>

            <h2>
              Edit{" "}
              {field.charAt(0).toUpperCase() +
                field.slice(1).replace("_", " ")}
            </h2>

            {field === "payment" ? (
              <div className="payment-edit">
                <label>PayPal Link / Email</label>
                <input
                  type="text"
                  className="overlay-input"
                  value={tempPayment.paypal}
                  onChange={(e) =>
                    setTempPayment((prev) => ({
                      ...prev,
                      paypal: e.target.value,
                    }))
                  }
                  placeholder="Enter your PayPal link"
                />
                <label>GCash Number</label>
                <input
                  type="text"
                  className="overlay-input"
                  value={tempPayment.gcash}
                  onChange={(e) =>
                    setTempPayment((prev) => ({
                      ...prev,
                      gcash: e.target.value,
                    }))
                  }
                  placeholder="Enter your GCash number"
                />
              </div>
            ) : (
              <>
                <p>Enter new {field} below:</p>
                <input
                  type={field === "password" ? "text" : "text"}
                  value={tempValue}
                  onChange={(e) => setTempValue(e.target.value)}
                  className="overlay-input"
                />
              </>
            )}

            <button className="save-btn" onClick={handleSave}>
              Save Changes
            </button>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
