import React from "react";
import "./Overlay.css";

export default function Overlay({ title, message, buttonText, onClose }) {
  return (
    <div className="overlay">
      <div className="overlay-box">
        <div className="overlay-icon">✔</div>
        <h2>{title}</h2>
        <p>{message}</p>
        <button className="overlay-button" onClick={onClose}>
          {buttonText}
        </button>
      </div>
    </div>
  );
}
