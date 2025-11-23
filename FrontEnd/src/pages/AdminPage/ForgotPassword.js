import React, { useState } from "react";
import "../../css/login.css";
import logo from "../../images/logo/logo.png";
import wavebg from "../../images/images/login_bg.png";
import { useNavigate } from "react-router-dom";
import Overlay from "../../components/Overlay";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function AdminForgotPassword() {
  const [email, setEmail] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const navigate = useNavigate();

  // Default admin email for verification
  const adminEmail = "admin@example.com";

  const handleReset = () => {
    if (email !== adminEmail) {
      alert("❌ This email is not registered as an admin.");
      return;
    }

    if (!newPass || !confirmPass) {
      alert("Please fill in all fields.");
      return;
    }

    if (newPass !== confirmPass) {
      alert("Passwords do not match!");
      return;
    }

    // Optional: Save new password locally (for simulation)
    localStorage.setItem("adminPassword", newPass);

    setShowOverlay(true);
  };

  return (
    <div className="view" style={{ backgroundImage: `url(${wavebg})` }}>
      <div className="column">
        {/* Logo */}
        <div className="logo-container">
          <img src={logo} alt="Logo" className="logo-image" />
        </div>

        {/* Email */}
        <input
          placeholder="Enter admin email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input"
        />

        {/* New Password */}
        <div className="password-container">
          <input
            type={showNewPass ? "text" : "password"}
            placeholder="New Password"
            value={newPass}
            onChange={(e) => setNewPass(e.target.value)}
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
            type={showConfirmPass ? "text" : "password"}
            placeholder="Confirm Password"
            value={confirmPass}
            onChange={(e) => setConfirmPass(e.target.value)}
            className="input2 password-input"
          />
          <span
            className="eye-icon"
            onClick={() => setShowConfirmPass(!showConfirmPass)}
          >
            {showConfirmPass ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        {/* Button */}
        <button className="button" onClick={handleReset}>
          <span className="text2">RESET PASSWORD</span>
        </button>

        {/* Back to Login */}
        <span
          className="clickable-text"
          onClick={() => navigate("/admin/login")}
          style={{ marginTop: "10px" }}
        >
          Back to Login
        </span>
      </div>

      {/* Overlay after reset */}
      {showOverlay && (
        <Overlay
          title="Password has been reset!"
          message="Please log in again with your new password."
          buttonText="Go to Login"
          onClose={() => navigate("/admin/login")}
        />
      )}
    </div>
  );
}
