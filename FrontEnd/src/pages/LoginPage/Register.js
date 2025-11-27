import React, { useState } from "react";
// No axios import needed
import "../../css/Register.css";
import wavebg from "../../images/images/login_bg.png";
import { FaCheckCircle, FaRegCircle, FaGoogle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [confirm, setConfirm] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState(""); // State for error messages
  const [isLoading, setIsLoading] = useState(false); // State for loading overlay
  const navigate = useNavigate();

  const handleSignUp = async () => {
    setError("");

    // 1. Client-side Validation
    if (!agreed) {
      alert("You must agree to the Terms of Service and Privacy Policy!");
      return;
    }

    if (email === "" || pass === "" || confirm === "") {
        setError("Please fill in all fields.");
        return;
    }

    if (pass !== confirm) {
        setError("Passwords do not match!");
        return;
    }

    // 2. Start Loading
    setIsLoading(true);

    try {
        // 3. Send Data to Backend using Fetch
        const response = await fetch("http://localhost:8082/api/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                email: email,
                password: pass
            })
        });

        const data = await response.json();

        if (response.ok) {
            // Success!
            alert("Sign up successful! Please log in.");
            navigate("/customer/login"); 
        } else {
            // Backend returned an error (e.g., Email taken)
            setIsLoading(false);
            setError(data.message || "Registration failed. Email might be taken.");
        }

    } catch (err) {
        console.error(err);
        setIsLoading(false);
        setError("Network error. Cannot connect to server.");
    }
  };

  const handleGoogleSignIn = () => {
    if (isLoading) return;
    alert("Continue with Google clicked!");
    navigate("/customer/homepage");
  };

  return (
    <div className="contain">
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

        .checkmark {
          cursor: pointer !important;
          transition: transform 0.2s ease-in-out !important;
        }
        .checkmark:hover {
          transform: scale(1.1) !important;
        }
        .google-button {
          display: flex;
          align-items: center;
          justify-content: center;
          background: #fff;
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 10px 20px;
          cursor: pointer;
          gap: 10px;
          margin-top: 10px;
          font-weight: bold;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .google-button:hover {
          transform: scale(1.02);
          box-shadow: 0 4px 10px rgba(0,0,0,0.15);
        }
      `}</style>

      {/* ✅ The Overlay Component */}
      {isLoading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
          <div className="loading-text">Creating Account...</div>
        </div>
      )}

      <div className="view" style={{ backgroundImage: `url(${wavebg})` }}>
        <div className="column">
          {/* Header */}
          <div className="column2">
            <span className="text">Create an account</span>
            <span className="text7">Enter your email to sign up!</span>
          </div>

          {/* Input fields */}
          <input
            placeholder="email@domain.com"
            value={email}
            disabled={isLoading}
            onChange={(e) => {
                setEmail(e.target.value);
                setError("");
            }}
            className="input"
          />
          <input
            placeholder="enter password"
            type="password"
            value={pass}
            disabled={isLoading}
            onChange={(e) => {
                setPass(e.target.value);
                setError("");
            }}
            className="input2"
          />
          <input
            placeholder="confirm password"
            type="password"
            value={confirm}
            disabled={isLoading}
            onChange={(e) => {
                setConfirm(e.target.value);
                setError("");
            }}
            className="input3"
          />

          {/* Error Message Display */}
          {error && <p style={{ color: "red", fontSize: "14px", marginTop: "10px", textAlign: "center" }}>{error}</p>}

          {/* Sign-up button */}
          <button className="button" onClick={handleSignUp} disabled={isLoading}>
            <span className="text3">
                {isLoading ? "WAIT..." : "Sign up with email"}
            </span>
          </button>

          {/* Divider */}
          <div className="row-view">
            <div className="box"></div>
            <span className="text4">or continue with</span>
            <div className="box"></div>
          </div>

          {/* Google button with React icon */}
          <button className="google-button" onClick={handleGoogleSignIn} disabled={isLoading}>
            <FaGoogle size={24} color="#DB4437" />
            <span>Google</span>
          </button>

          {/* Terms and agreement */}
          <div className="column3">
            <div 
                className="terms-container" 
                onClick={() => !isLoading && setAgreed(!agreed)}
                style={{ cursor: isLoading ? "not-allowed" : "pointer" }}
            >
              {agreed ? (
                <FaCheckCircle size={50} color="#000" className="checkmark" />
              ) : (
                <FaRegCircle size={50} color="#555" className="checkmark" />
              )}
              <span className="text5">
                By clicking continue, you agree to our{" "}
                <a href="#">Terms of Service</a> and <br />
                <a href="#">Privacy Policy</a>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}