import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaBan, FaArrowLeft } from "react-icons/fa";
import wavebg from "../images/images/login_bg.png"; 

export default function Suspend() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // 1. Get the data passed from Login.js
  // These variables now contain exactly what the Admin typed/selected.
  const { reason, until, type } = location.state || {};

  // 2. Format the Date nicely
  const dateStr = until 
    ? new Date(until).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }) 
    : "Permanent";

  return (
    <div style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundImage: `url(${wavebg})`,
        backgroundSize: "cover"
    }}>
      <div style={{
          background: "white",
          padding: "40px",
          borderRadius: "12px",
          textAlign: "center",
          maxWidth: "500px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.2)"
      }}>
        <FaBan style={{ fontSize: "60px", color: "#d32f2f", marginBottom: "20px" }} />
        <h1 style={{ color: "#d32f2f", margin: "0 0 10px 0" }}>Account Suspended</h1>
        
        <p style={{ fontSize: "1.1rem", color: "#555" }}>
            Your account has been suspended due to a violation of our policies.
        </p>

        {/* 3. DYNAMIC DATA DISPLAY */}
        <div style={{ background: "#f8d7da", padding: "15px", borderRadius: "8px", margin: "20px 0", color: "#721c24", textAlign: "left" }}>
            
            <p style={{ margin: "5px 0" }}>
                <strong>Suspension Type:</strong> <span style={{ textTransform: 'capitalize' }}>{type || "Permanent"}</span>
            </p>
            
            <p style={{ margin: "5px 0" }}>
                <strong>Reason:</strong> {reason || "No reason provided."}
            </p>
            
            <p style={{ margin: "5px 0" }}>
                <strong>Duration:</strong> {until ? `Until ${dateStr}` : "Indefinite"}
            </p>
        
        </div>

        <button 
            onClick={() => navigate("/customer/login")}
            style={{
                background: "#333", color: "white", padding: "10px 20px",
                border: "none", borderRadius: "5px", cursor: "pointer",
                display: "flex", alignItems: "center", gap: "10px", margin: "0 auto"
            }}
        >
            <FaArrowLeft /> Back to Login
        </button>
      </div>
    </div>
  );
}