import React, { useState } from "react";
import "../../css/login.css";
import logo from "../../images/logo/logo.png";
import wavebg from "../../images/images/login_bg.png";
import { useNavigate } from "react-router-dom";
import Overlay from "../../components/Overlay";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import icons

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [showNewPass, setShowNewPass] = useState(false); // Toggle new password
  const [showConfirmPass, setShowConfirmPass] = useState(false); // Toggle confirm
  const [showOverlay, setShowOverlay] = useState(false);
  const navigate = useNavigate();

  const handleReset = () => {
    if (newPass && confirmPass && newPass === confirmPass) {
      setShowOverlay(true);
    } else {
      alert("Passwords do not match!");
    }
  };

  return (
    <div className="view" style={{ backgroundImage: `url(${wavebg})` }}>
      <div className="column">
        {/*  Logo */}
        <div className="logo-container">
          <img src={logo} alt="Logo" className="logo-image" />
        </div>

        {/* Email */}
        <input
          placeholder="Enter email or username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input"
        />

        {/*  New Password */}
        <div className="password-container">
          <input
            placeholder="New Password"
            type={showNewPass ? "text" : "password"}
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

        {/*  Confirm Password */}
        <div className="password-container">
          <input
            placeholder="Confirm Password"
            type={showConfirmPass ? "text" : "password"}
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
        {/*  Button */}
        <button className="button" onClick={handleReset}>
          <span className="text2">RESET PASSWORD</span>
        </button>

        {/* Back to Login */}
        <span
          className="clickable-text"
          onClick={() => navigate("/")}
          style={{ marginTop: "10px" }}
        >
          Back to Login
        </span>
      </div>


      {showOverlay && (
        <Overlay
          title="Password has been reset!"
          message="Login again for verification."
          buttonText="Go to Login"
          onClose={() => navigate("/")}
        />
      )}
    </div>
  );
}
