import React, { useState } from "react";
import "../../css/Register.css";
import wavebg from "../../images/images/login_bg.png";
import { FaCheckCircle, FaRegCircle, FaGoogle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [confirm, setConfirm] = useState("");
  const [agreed, setAgreed] = useState(false);
  const navigate = useNavigate();

  const handleSignUp = () => {
    if (!agreed) {
      alert("You must agree to the Terms of Service and Privacy Policy!");
      return;
    }

    // You can add actual sign-up logic here

    alert("Sign up successful!");
    navigate("/customer/homepage"); // Navigate after signing up
  };

  const handleGoogleSignIn = () => {
    alert("Continue with Google clicked!");
    navigate("/customer/homepage"); // Navigate after Google sign-in
  };

  return (
    <div className="contain">
      <style>{`
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
            onChange={(e) => setEmail(e.target.value)}
            className="input"
          />
          <input
            placeholder="enter password"
            type="password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            className="input2"
          />
          <input
            placeholder="confirm password"
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="input3"
          />

          {/* Sign-up button */}
          <button className="button" onClick={handleSignUp}>
            <span className="text3">Sign up with email</span>
          </button>

          {/* Divider */}
          <div className="row-view">
            <div className="box"></div>
            <span className="text4">or continue with</span>
            <div className="box"></div>
          </div>

          {/* Google button with React icon */}
          <button className="google-button" onClick={handleGoogleSignIn}>
            <FaGoogle size={24} color="#DB4437" />
            <span>Google</span>
          </button>

          {/* Terms and agreement */}
          <div className="column3">
            <div className="terms-container" onClick={() => setAgreed(!agreed)}>
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
