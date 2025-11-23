import React, { useState } from "react";
import "../../css/login.css";
import logo from "../../images/logo/logo.png";
import wavebg from "../../images/images/login_bg.png";
import { useNavigate } from "react-router-dom";

export default function CodeVerification() {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleVerify = () => {
    if (code === "123456") {
      navigate("/forgot-password");
    } else {
      setError("Invalid verification code. Please try again.");
    }
  };

  const handleResend = () => {
    alert("A new verification code has been sent to your email.");
  };

  return (
    <div className="view" style={{ backgroundImage: `url(${wavebg})` }}>
      <div className="column">
        <img src={logo} alt="Logo" className="logo-image" />

        <h2 className="code-verification-title">Enter Verification Code</h2>

        <input
          placeholder="Enter the code sent to your email"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="code-verification-input"
        />

        {error && <p className="error-message">{error}</p>}

        <button className="button" onClick={handleVerify}>
          <span className="text2">VERIFY CODE</span>
        </button>

        <span className="clickable-text" onClick={handleResend}>
          Resend Code
        </span>
      </div>
    </div>
  );
}
