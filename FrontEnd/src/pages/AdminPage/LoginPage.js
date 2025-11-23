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
  const navigate = useNavigate();

  // Default admin credentials
  const defaultAdmin = {
    username: "admin@gmail.com",
    password: "admin123",
    pin: "4321"
  };

 
  const handleLogin = () => {
    if (
      (emailOrUser === defaultAdmin.username || emailOrUser === "admin") &&
      password === defaultAdmin.password &&
      pin === defaultAdmin.pin
    ) {
      alert("Admin login successful!");

      // Save login flag
      localStorage.setItem("isAdminLoggedIn", "true");

      navigate("/admin/dashboard");
    } else {
      alert("Invalid admin credentials or PIN.");
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
          <span
            className="eye-icon"
            onClick={() => setShowPassword(!showPassword)}
          >
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

        <button className="button" onClick={handleLogin}>
          <span className="text2">LOGIN</span>
        </button>

        <Link to="/admin/forgotPassword" className="text4">
          Forgot Password?
        </Link>
      </div>
    </div>
  );
}
