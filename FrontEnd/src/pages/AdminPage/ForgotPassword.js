import React, { useState } from "react";
import "../../css/login.css";
import logo from "../../images/logo/logo.png";
import wavebg from "../../images/images/login_bg.png";
import { useNavigate } from "react-router-dom";
import Overlay from "../../components/Overlay";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function AdminForgotPassword() {
  const [email, setEmail] = useState("");
  const [pin, setPin] = useState(""); 
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  
  const [showOverlay, setShowOverlay] = useState(false);
  const [isLoading, setIsLoading] = useState(false); 
  
  const navigate = useNavigate();

  const handleReset = async () => {
    
    if (!email || !pin || !newPass || !confirmPass) {
      alert("Please fill in all fields.");
      return;
    }

    if (newPass !== confirmPass) {
      alert("❌ Passwords do not match!");
      return;
    }

    if (newPass.length < 6) {
        alert("❌ Password must be at least 6 characters.");
        return;
    }

    setIsLoading(true);

    try {
       
        const response = await fetch("http://localhost:8082/api/admin/reset-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                email: email, 
                pin: pin, 
                new_password: newPass 
            })
        });

        const data = await response.json();

        if (response.ok) {
           
            setShowOverlay(true);
        } else {
           
            alert(`${data.message || "Reset failed"}`);
        }
    } catch (error) {
        console.error("Reset Error:", error);
        alert(" Server connection error.");
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="view" style={{ backgroundImage: `url(${wavebg})` }}>
      <div className="column">
       
        <div className="logo-container">
          <img src={logo} alt="Logo" className="logo-image" />
        </div>

        <h2 style={{color: '#333', marginBottom: '15px'}}>Admin Reset</h2>

       
        <input
          placeholder="Enter admin email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input"
        />

        
        <div className="password-container">
            <input
                type="text"
                placeholder="Enter Security PIN"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                maxLength={4}
                className="input2 password-input"
            />
        </div>

        
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

        <button className="button" onClick={handleReset} disabled={isLoading}>
          <span className="text2">
            {isLoading ? "UPDATING..." : "RESET PASSWORD"}
          </span>
        </button>

        <span
          className="clickable-text"
          onClick={() => navigate("/admin/login")}
          style={{ marginTop: "10px", cursor: "pointer", color: "#555" }}
        >
          Back to Login
        </span>
      </div>

    
      {showOverlay && (
        <Overlay
          title="Password Reset Successful!"
          message="Your password has been updated. Please log in with your new credentials."
          buttonText="Go to Login"
          onClose={() => navigate("/admin/login")}
        />
      )}
    </div>
  );
}