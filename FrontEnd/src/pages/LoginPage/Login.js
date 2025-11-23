import React, { useState } from "react";
import "../../css/login.css";
import logo from "../../images/logo/logo.png";
import wavebg from "../../images/images/login_bg.png";
import { useNavigate, Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function Login() {
  const [input1, setInput1] = useState(""); // email/username
  const [input2, setInput2] = useState(""); // password
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  
  const DEFAULT_USERNAME = "user";
  const DEFAULT_PASSWORD = "12345";

  const handleLogin = () => {
    if (input1.trim() === DEFAULT_USERNAME && input2.trim() === DEFAULT_PASSWORD) {
 
      navigate("/customer/homepage");
    } else if (input1 === "" || input2 === "") {
      setError("Please fill in both fields.");
    } else {
      setError("Invalid username or password. Try again.");
    }
  };

  return (
    <div className="view" style={{ backgroundImage: `url(${wavebg})` }}>
      <div className="column">
        {/* Logo */}
        <div className="logo-container">
          <img src={logo} alt="Logo" className="logo-image" />
        </div>

        {/* Email/Username */}
        <input
          placeholder="Enter email or username"
          value={input1}
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
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>


        {/* Error Message */}
        {error && <p className="error-message">{error}</p>}

        {/* Login Button */}
        <button className="button" onClick={handleLogin}>
          <span className="text2">LOGIN</span>
        </button>

        {/* Sign Up link */}
        <span className="text3">
          <span className="text3-label">Don’t have an account?</span>{" "}
          <span
            className="signup-link"
            onClick={() => navigate("/customer/register")}
            style={{ cursor: "pointer", textDecoration: "underline" }}
          >
            Sign Up Now!
          </span>
        </span>

        {/* Forgot Password */}
        <Link to="/customer/code-verification" className="text4">
          Forgot Password?
        </Link>
      </div>
    </div>
  );
}
