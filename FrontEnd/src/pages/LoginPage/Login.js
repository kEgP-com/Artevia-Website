import React, { useState } from "react";
// axios import removed
import "../../css/login.css";
import logo from "../../images/logo/logo.png";
import wavebg from "../../images/images/login_bg.png";
import { useNavigate, Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function Login() {
  const [input1, setInput1] = useState(""); // email
  const [input2, setInput2] = useState(""); // password
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError("");

    if (input1 === "" || input2 === "") {
      setError("Please fill in both fields.");
      return;
    }

    // Start Loading
    setIsLoading(true);

    try {
    
      const response = await fetch("http://localhost:8082/api/login", {
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

      // Parse the JSON response
      const data = await response.json();

      // Check if the request was successful (Status 200-299)
      if (response.ok) {
        const userData = data.user;

        const accountInfo = {
            id: userData.id,
            fullName: userData.name,
            email: userData.email,
            username: userData.name,
            password: input2,
            address: userData.address || "No address set",
            contact: userData.contact || "No contact set",
            payment: {
              paypal: "paypal.me/user",
              gcash: "0912 345 6789",
            },
        };

        localStorage.setItem("accountInfo", JSON.stringify(accountInfo));
        navigate("/customer/homepage");
        // Keep loading true while navigating
      } else {
        // Handle Server Errors (Like 401 Unauthorized)
        setIsLoading(false);
        if (response.status === 401) {
          setError("Invalid email or password.");
        } else {
          setError(data.message || "Server error. Is the backend running?");
        }
      }

    } catch (err) {
      console.error(err);
      // Handle Network Errors (Fetch failed completely)
      setIsLoading(false);
      setError("Network error. Cannot connect to server.");
    }
  };

  return (
    <div className="view" style={{ backgroundImage: `url(${wavebg})` }}>
      
      {/* Internal Styles for the Overlay */}
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

      {/* The Overlay Component */}
      {isLoading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
          <div className="loading-text">Logging in...</div>
        </div>
      )}

      <div className="column">
        {/* Logo */}
        <div className="logo-container">
          <img src={logo} alt="Logo" className="logo-image" />
        </div>

        {/* Email/Username */}
        <input
          placeholder="Enter email"
          value={input1}
          disabled={isLoading}
          onChange={(event) => {
            setInput1(event.target.value);
            setError("");
          }}
          className="input"
        />

        {/* Password with eye toggle */}
        <div className="password-container">
          <input
            placeholder="Password"
            value={input2}
            disabled={isLoading}
            onChange={(event) => {
              setInput2(event.target.value);
              setError("");
            }}
            className="input2 password-input"
            type={showPassword ? "text" : "password"}
          />
          <button
            type="button"
            className="eye-icon"
            onClick={() => setShowPassword(!showPassword)}
            aria-label="Toggle password visibility"
            disabled={isLoading}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        {/* Error Message */}
        {error && <p className="error-message">{error}</p>}

        {/* Login Button */}
        <button className="button" onClick={handleLogin} disabled={isLoading}>
          <span className="text2">
            {isLoading ? "WAIT..." : "LOGIN"}
          </span>
        </button>

        {/* Sign Up link */}
        <span className="text3">
          <span className="text3-label">Don’t have an account?</span>{" "}
          <span
            className="signup-link"
            onClick={() => !isLoading && navigate("/customer/register")}
            style={{ 
              cursor: isLoading ? "not-allowed" : "pointer", 
              textDecoration: "underline" 
            }}
          >
            Sign Up Now!
          </span>
        </span>

        {/* Forgot Password */}
        <Link 
          to="/customer/code-verification" 
          className="text4"
          style={{ pointerEvents: isLoading ? "none" : "auto" }}
        >
          Forgot Password?
        </Link>
      </div>
    </div>
  );
}