import React, { useState } from "react";
import "../../css/login.css";
import logo from "../../images/logo/logo.png";
import wavebg from "../../images/images/login_bg.png";
import { useNavigate, Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function AdminLogin() {
  const [emailOrUser, setEmailOrUser] = useState("");
  const [password, setPassword] = useState("");
  const [pin, setPin] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPin, setShowPin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setIsLoading(true);
    try {
        const response = await fetch("http://localhost:8082/api/admin/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ emailOrUser, password, pin })
        });

        const data = await response.json();

        if (response.ok) {
            // ✅ Save Login Session
            localStorage.setItem("adminData", JSON.stringify(data.admin));
            alert("Login Successful!");
            navigate("/admin/dashboard");
        } else {
            alert(data.message || "Login failed");
        }
    } catch (error) {
        console.error("Login Error:", error);
        alert("Server error. Please try again.");
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

        <input
          placeholder="Enter email or username"
          value={emailOrUser}
          onChange={(e) => setEmailOrUser(e.target.value)}
          className="input"
        />

        {/* PASSWORD FIELD */}
        <div className="password-container">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input2 password-input"
          />
          <span className="eye-icon" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        {/* PIN FIELD */}
        <div className="password-container">
          <input
            type={showPin ? "text" : "password"}
            placeholder="Enter access PIN"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            maxLength={4}
            className="input2 password-input"
          />
          <span className="eye-icon" onClick={() => setShowPin(!showPin)}>
            {showPin ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        <button className="button" onClick={handleLogin} disabled={isLoading}>
          <span className="text2">{isLoading ? "Verifying..." : "LOGIN"}</span>
        </button>

        <Link to="/admin/forgotPassword" style={{marginTop: '10px', textDecoration:'none', color:'#555'}}>
          Forgot Password?
        </Link>
      </div>
    </div>
  );
}