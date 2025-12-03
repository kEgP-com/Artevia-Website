import React, { useState } from "react";
import "../../css/login.css";
import logo from "../../images/logo/logo.png";
import wavebg from "../../images/images/login_bg.png";
import { useNavigate } from "react-router-dom";
import Overlay from "../../components/Overlay";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  
  // ✅ New States for Loading and Errors
  const [showOverlay, setShowOverlay] = useState(false); // Success Overlay
  const [isLoading, setIsLoading] = useState(false); // Loading Spinner
  const [error, setError] = useState(""); // Error Message
  
  const navigate = useNavigate();

  const handleReset = async () => {
    // 1. Reset Error
    setError("");

    // 2. Validation
    if (!email || !newPass || !confirmPass) {
      setError("Please fill in all fields.");
      return;
    }

    if (newPass !== confirmPass) {
      setError("Passwords do not match!");
      return;
    }

    // 3. Start Loading
    setIsLoading(true);

    try {
      // 4. Send Request to Backend
      // We are hitting a new endpoint we will create: /api/reset-password
      const response = await fetch("http://localhost:8082/api/reset-password", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({
            email: email,
            password: newPass
        })
      });

      const data = await response.json();

      if (response.ok) {
        // Success! Stop loading and show the Success Overlay
        setIsLoading(false);
        setShowOverlay(true); 
      } else {
        // Handle Backend Errors (e.g., Email not found)
        setIsLoading(false);
        setError(data.message || "Failed to reset password.");
      }

    } catch (err) {
      console.error(err);
      setIsLoading(false);
      setError("Network error. Is the backend running?");
    }
  };

  return (
    <div className="view" style={{ backgroundImage: `url(${wavebg})` }}>
      
      {/* ✅ Internal Styles for the Loading Spinner */}
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

      {/* ✅ The Loading Overlay Component */}
      {isLoading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
          <div className="loading-text">Updating Password...</div>
        </div>
      )}

      <div className="column">
        {/* Logo */}
        <div className="logo-container">
          <img src={logo} alt="Logo" className="logo-image" />
        </div>

        {/* Email */}
        <input
          placeholder="Enter email"
          value={email}
          disabled={isLoading}
          onChange={(e) => {
            setEmail(e.target.value);
            setError("");
          }}
          className="input"
        />

        {/* New Password */}
        <div className="password-container">
          <input
            placeholder="New Password"
            type={showNewPass ? "text" : "password"}
            value={newPass}
            disabled={isLoading}
            onChange={(e) => {
                setNewPass(e.target.value);
                setError("");
            }}
            className="input2 password-input"
          />
          <span
            className="eye-icon"
            onClick={() => setShowNewPass(!showNewPass)}
          >
            {showNewPass ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        {/* Confirm Password */}
        <div className="password-container">
          <input
            placeholder="Confirm Password"
            type={showConfirmPass ? "text" : "password"}
            value={confirmPass}
            disabled={isLoading}
            onChange={(e) => {
                setConfirmPass(e.target.value);
                setError("");
            }}
            className="input2 password-input"
          />
          <span
            className="eye-icon"
            onClick={() => setShowConfirmPass(!showConfirmPass)}
          >
            {showConfirmPass ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        {/* ✅ Error Message Display */}
        {error && <p style={{ color: "red", marginTop: "10px", fontSize: "14px", textAlign: "center" }}>{error}</p>}

        {/* Button */}
        <button className="button" onClick={handleReset} disabled={isLoading}>
          <span className="text2">
            {isLoading ? "WAIT..." : "RESET PASSWORD"}
          </span>
        </button>

        {/* Back to Login */}
        <span
          className="clickable-text"
          onClick={() => !isLoading && navigate("/customer/login")}
          style={{ marginTop: "10px", cursor: isLoading ? "not-allowed" : "pointer" }}
        >
          Back to Login
        </span>
      </div>

      {/* Existing Success Overlay */}
      {showOverlay && (
        <Overlay
          title="Password has been reset!"
          message="Login again for verification."
          buttonText="Go to Login"
          onClose={() => navigate("/customer/login")}
        />
      )}
    </div>
  );
}