import React, { useState } from "react";
import "../../css/login.css";
import logo from "../../images/logo/logo.png";
import wavebg from "../../images/images/login_bg.png";
import { useNavigate, Link } from "react-router-dom";
import { FaEye, FaEyeSlash, FaBan } from "react-icons/fa";


const API_BASE_URL = "http://localhost:8082";

export default function Login() {
  const [input1, setInput1] = useState(""); 
  const [input2, setInput2] = useState(""); 
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
 
  const [banDetails, setBanDetails] = useState(null); 

  const navigate = useNavigate();

  const handleLogin = async () => {
    setError("");
    setBanDetails(null); 

    if (input1 === "" || input2 === "") {
      setError("Please fill in both fields.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json", 
          "Accept": "application/json"
        },
        body: JSON.stringify({
          email: input1,
          password: input2,
        }),
      });

      const data = await response.json();

     
      if (response.status === 403 || (data.user && data.user.is_banned)) {
          setIsLoading(false);
          
        
          setBanDetails({
              reason: data.reason || (data.user && data.user.ban_reason) || "Violation of Terms",
              until: data.until || (data.user && data.user.banned_until),
              type: data.type || (data.user && data.user.ban_type) || "permanent"
          });
          return; 
      }

      
      if (response.ok) {
        const userData = data.user;

        const accountInfo = {
            id: userData.id,
            fullName: userData.name,
            email: userData.email,
            username: userData.name,
            password: input2, 
            address: userData.address || "", 
            contact: userData.contact || "",
            age: userData.age || "",
            payment: {
              paypal: userData.paypal || "",
              gcash: userData.gcash || "",
            },
        };

        localStorage.setItem("accountInfo", JSON.stringify(accountInfo));
        navigate("/customer/homepage");
      } 
    
      else {
        setIsLoading(false);
        if (response.status === 401) {
          setError("Invalid email or password.");
        } else {
          setError(data.message || "Login failed.");
        }
      }

    } catch (err) {
      console.error(err);
      setIsLoading(false);
      setError("Network error. Is the backend running on port 8082?");
    }
  };

  
  const formatDate = (dateString) => {
      if (!dateString) return "Permanent";
      return new Date(dateString).toLocaleDateString("en-US", { 
          year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' 
      });
  };

  return (
    <div className="view" style={{ backgroundImage: `url(${wavebg})` }}>
      
    
      <style>{`
        .loading-overlay {
          position: fixed; top: 0; left: 0; width: 100%; height: 100%;
          background: rgba(0, 0, 0, 0.6); display: flex;
          flex-direction: column; justify-content: center; align-items: center;
          z-index: 9999; backdrop-filter: blur(5px);
        }
        .ban-card {
            background: white; padding: 30px; border-radius: 12px;
            text-align: center; max-width: 400px; width: 90%;
            box-shadow: 0 10px 25px rgba(0,0,0,0.3);
            border-top: 6px solid #d32f2f;
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
          <div className="loading-text">Logging in...</div>
        </div>
      )}

   
      {banDetails && (
        <div className="loading-overlay">
            <div className="ban-card">
                <FaBan style={{ fontSize: "50px", color: "#d32f2f", marginBottom: "15px" }} />
                <h2 style={{ color: "#d32f2f", marginTop: 0 }}>Account Suspended</h2>
                <p style={{ color: "#555", fontSize: "1rem" }}>
                    Your account has been suspended.
                </p>
                
                <div style={{ background: "#fdf2f2", padding: "15px", borderRadius: "8px", margin: "20px 0", textAlign: "left", fontSize: "0.9rem", color: "#721c24" }}>
                    <p style={{ margin: "5px 0" }}><strong>Type:</strong> <span style={{textTransform:'capitalize'}}>{banDetails.type}</span></p>
                    <p style={{ margin: "5px 0" }}><strong>Reason:</strong> {banDetails.reason}</p>
                    <p style={{ margin: "5px 0" }}><strong>Duration:</strong> {formatDate(banDetails.until)}</p>
                </div>

                <button 
                    onClick={() => setBanDetails(null)}
                    style={{
                        background: "#333", color: "white", padding: "10px 20px",
                        border: "none", borderRadius: "5px", cursor: "pointer", width: "100%"
                    }}
                >
                    Close
                </button>
            </div>
        </div>
      )}

      <div className="column">
        <div className="logo-container">
          <img src={logo} alt="Logo" className="logo-image" />
        </div>

        <input
          placeholder="Enter email"
          value={input1}
          disabled={isLoading}
          onChange={(event) => { setInput1(event.target.value); setError(""); }}
          className="input"
        />

        <div className="password-container">
          <input
            placeholder="Password"
            value={input2}
            disabled={isLoading}
            onChange={(event) => { setInput2(event.target.value); setError(""); }}
            className="input2 password-input"
            type={showPassword ? "text" : "password"}
          />
          <button
            type="button"
            className="eye-icon"
            onClick={() => setShowPassword(!showPassword)}
            disabled={isLoading}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        {error && <p className="error-message">{error}</p>}

        <button className="button" onClick={handleLogin} disabled={isLoading}>
          <span className="text2">{isLoading ? "WAIT..." : "LOGIN"}</span>
        </button>

        <span className="text3">
          <span className="text3-label">Don’t have an account?</span>{" "}
          <span
            className="signup-link"
            onClick={() => !isLoading && navigate("/customer/register")}
            style={{ cursor: isLoading ? "not-allowed" : "pointer", textDecoration: "underline" }}
          >
            Sign Up Now!
          </span>
        </span>

        <Link 
          to="/customer/forgot-password" 
          className="text4"
          style={{ pointerEvents: isLoading ? "none" : "auto" }}
        >
          Forgot Password?
        </Link>
      </div>
    </div>
  );
}