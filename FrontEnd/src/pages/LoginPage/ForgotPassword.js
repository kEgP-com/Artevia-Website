import React, { useState } from "react";
import "../../css/login.css";
import logo from "../../images/logo/logo.png";
import wavebg from "../../images/images/login_bg.png";
import { useNavigate } from "react-router-dom";
import Overlay from "../../components/Overlay";
import { FaEye, FaEyeSlash } from "react-icons/fa";


const API_URL = "http://localhost:8082";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  
  
  const [showOverlay, setShowOverlay] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  const navigate = useNavigate();

  const handleReset = async () => {
    setError("");

   
    if (!email || !newPass || !confirmPass) {
      setError("Please fill in all fields.");
      return;
    }

    if (newPass !== confirmPass) {
      setError("Passwords do not match!");
      return;
    }

    
    setIsLoading(true);

    try {
      
      const response = await fetch(`${API_URL}/api/reset-password`, {
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
        
        setIsLoading(false);
        setShowOverlay(true); 
      } else {
       
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
      
   
      <style>{`
        .loading-overlay {
          position: fixed; top: 0; left: 0; width: 100%; height: 100%;
          background: rgba(0, 0, 0, 0.6);
          display: flex; flex-direction: column;
          justify-content: center; align-items: center;
          z-index: 9999; backdrop-filter: blur(5px);
        }
        .spinner {
          border: 6px solid #f3f3f3; border-top: 6px solid #3498db;
          border-radius: 50%; width: 50px; height: 50px;
          animation: spin 1s linear infinite; margin-bottom: 15px;
        }
        .loading-text { color: white; font-size: 1.2rem; font-weight: bold; font-family: sans-serif; }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      `}</style>

    
      {isLoading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
          <div className="loading-text">Updating Password...</div>
        </div>
      )}

      <div className="column">
      
        <div className="logo-container">
          <img src={logo} alt="Logo" className="logo-image" />
        </div>

        <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#333' }}>Reset Password</h2>

      
        <input
          placeholder="Enter your email"
          value={email}
          disabled={isLoading}
          onChange={(e) => { setEmail(e.target.value); setError(""); }}
          className="input"
        />

       
        <div className="password-container" style={{ position: 'relative' }}>
          <input
            placeholder="New Password"
            type={showNewPass ? "text" : "password"}
            value={newPass}
            disabled={isLoading}
            onChange={(e) => { setNewPass(e.target.value); setError(""); }}
            className="input2 password-input"
            style={{ width: '100%' }}
          />
          <button 
            type="button"
            className="eye-icon"
            onClick={() => setShowNewPass(!showNewPass)}
            style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            {showNewPass ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
          </button>
        </div>

        
        <div className="password-container" style={{ position: 'relative' }}>
          <input
            placeholder="Confirm Password"
            type={showConfirmPass ? "text" : "password"}
            value={confirmPass}
            disabled={isLoading}
            onChange={(e) => { setConfirmPass(e.target.value); setError(""); }}
            className="input2 password-input"
            style={{ width: '100%' }}
          />
          <button 
            type="button"
            className="eye-icon"
            onClick={() => setShowConfirmPass(!showConfirmPass)}
            style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            {showConfirmPass ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
          </button>
        </div>

        
        {error && <p style={{ color: "red", marginTop: "10px", fontSize: "14px", textAlign: "center" }}>{error}</p>}

       
        <button className="button" onClick={handleReset} disabled={isLoading}>
          <span className="text2">
            {isLoading ? "WAIT..." : "RESET PASSWORD"}
          </span>
        </button>


        <span
          className="clickable-text"
          onClick={() => !isLoading && navigate("/customer/login")}
          style={{ marginTop: "15px", cursor: isLoading ? "not-allowed" : "pointer", textAlign: 'center', display: 'block', textDecoration: 'underline' }}
        >
          Back to Login
        </span>
      </div>

      {showOverlay && (
        <Overlay
          title="Password Reset Successful!"
          message="You can now login with your new password."
          buttonText="Go to Login"
          onClose={() => navigate("/customer/login")}
        />
      )}
    </div>
  );
}