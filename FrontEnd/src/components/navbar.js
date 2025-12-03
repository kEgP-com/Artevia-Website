import React, { useState, useEffect } from "react";
import "./Compo.css";
import { FaBars, FaTimes, FaEnvelope, FaPhoneAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import ProfileIcon from "../images/images/profile.png";
import CartIcon from "../images/images/cart.png";
import HelpIcon from "../images/images/help.png";
import Logo from "../images/images/logo_clear.png";

function Navbar() {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [showLeftMenu, setShowLeftMenu] = useState(false);
  const [showRightMenu, setShowRightMenu] = useState(false);
  const [showHelpOverlay, setShowHelpOverlay] = useState(false);
  const navigate = useNavigate();

  // Hide navbar on scroll down
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY <= 0 ? 0 : currentScrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // Scroll to footer
  const scrollToFooter = () => {
    const footer = document.getElementById("footer-section");
    if (footer) {
      footer.scrollIntoView({ behavior: "smooth" });
    }
    setShowLeftMenu(false);
    setShowRightMenu(false);
  };

  // ✅ PUBLIC NAVIGATION (No login required)
  const goToPage = (path) => {
    navigate(path);
    setShowLeftMenu(false);
    setShowRightMenu(false);
  };

  // 🔒 PROTECTED NAVIGATION (Requires Login)
  // Used for: Account, Orders, Cart
  const checkAuthAndNavigate = (path) => {
    const isLoggedIn = localStorage.getItem("accountInfo");

    if (!isLoggedIn) {
      // Alert the user and offer to go to login
      if (window.confirm("You need to login to access this page. Go to Login?")) {
        navigate("/customer/login");
      }
    } else {
      goToPage(path);
    }
  };

  return (
    <>
      <header className={`navbar-container ${isVisible ? "visible" : "hidden"}`}>
        <nav className="navbar">

          {/* Mobile Left Menu Button */}
          <button
            className="menu-btn left-menu-btn"
            onClick={() => setShowLeftMenu(!showLeftMenu)}
          >
            {showLeftMenu ? <FaTimes /> : <FaBars />}
          </button>

          {/* Logo (Public) */}
          <div
            className="nav-left"
            onClick={() => goToPage("/customer/homepage")}
            style={{ cursor: "pointer" }}
          >
            <img src={Logo} alt="Logo" className="logo-img" />
          </div>

          {/* Search Bar */}
          <div className="nav-center">
            <input type="text" className="search-bar" placeholder="Search..." />
          </div>

          {/* Right Icons */}
          <div className="nav-right">
            {/* 🔒 PROTECTED: Profile */}
            <img
              src={ProfileIcon}
              alt="Profile"
              className="icon-img"
              onClick={() => checkAuthAndNavigate("/customer/account")}
            />
            
            {/* 🔒 PROTECTED: Cart (Updated) */}
            <img
              src={CartIcon}
              alt="Cart"
              className="icon-img"
              onClick={() => checkAuthAndNavigate("/customer/cart")}
            />
            
            {/* 🌍 PUBLIC: Help */}
            <img
              src={HelpIcon}
              alt="Help"
              className="icon-img"
              onClick={() => setShowHelpOverlay(true)}
            />
          </div>

          {/* Mobile Right Menu Button */}
          <button
            className="menu-btn right-menu-btn"
            onClick={() => setShowRightMenu(!showRightMenu)}
          >
            {showRightMenu ? <FaTimes /> : <FaBars />}
          </button>
        </nav>

        {/* Desktop Links */}
        <div className="nav-links-bar">
          <ul className="nav-links">
            <li onClick={() => goToPage("/customer/homepage")}>HOME</li>
            <li onClick={scrollToFooter}>ABOUT</li>
            <li onClick={() => goToPage("/customer/artpage")}>ART</li> 
            
            {/* 🔒 PROTECTED: Orders */}
            <li onClick={() => checkAuthAndNavigate("/customer/order")}>ORDERS</li>
            
            <li className="nav-link-dropdown">
              CATEGORIES
              <div className="dropdown-content">
                <span onClick={() => goToPage("/customer/sketch")}>Sketch Art</span>
                <span onClick={() => goToPage("/customer/digital-arts")}>Digital Art</span>
                <span onClick={() => goToPage("/customer/sculpture")}>Sculpture</span>
                <span onClick={() => goToPage("/customer/painting")}>Painting</span>
                <span onClick={() => goToPage("/customer/handmade-decors")}>Handmade Decor</span>
              </div>
            </li>
          </ul>
        </div>

        {/* Mobile Left Menu */}
        {showLeftMenu && (
          <div className="mobile-dropdown left-dropdown">
            <ul>
              <li onClick={() => goToPage("/customer/homepage")}>HOME</li>
              <li onClick={scrollToFooter}>ABOUT</li>
              <li onClick={() => goToPage("/customer/artpage")}>ART</li> 
              
              {/* 🔒 PROTECTED: Orders */}
              <li onClick={() => checkAuthAndNavigate("/customer/order")}>ORDERS</li>
              
              <li className="nav-link-dropdown">
                CATEGORIES
                <div className="dropdown-content">
                  <span onClick={() => goToPage("/customer/sketch")}>Sketch Art</span>
                  <span onClick={() => goToPage("/customer/digital-arts")}>Digital Art</span>
                  <span onClick={() => goToPage("/customer/sculpture")}>Sculpture</span>
                  <span onClick={() => goToPage("/customer/painting")}>Painting</span>
                  <span onClick={() => goToPage("/customer/handmade-decors")}>Handmade Decor</span>
                </div>
              </li>
            </ul>
          </div>
        )}

        {/* Mobile Right Menu */}
        {showRightMenu && (
          <div className="mobile-dropdown right-dropdown">
            <div className="mobile-search-alt">
              <input type="text" className="search-bar" placeholder="Search..." />
            </div>
            <div className="mobile-icons">
              {/* 🔒 PROTECTED: Profile */}
              <img
                src={ProfileIcon}
                alt="Profile"
                className="icon-img"
                onClick={() => checkAuthAndNavigate("/customer/account")}
              />
              {/* 🔒 PROTECTED: Cart */}
              <img
                src={CartIcon}
                alt="Cart"
                className="icon-img"
                onClick={() => checkAuthAndNavigate("/customer/cart")}
              />
              {/* 🌍 PUBLIC: Help */}
              <img
                src={HelpIcon}
                alt="Help"
                className="icon-img"
                onClick={() => setShowHelpOverlay(true)}
              />
            </div>
          </div>
        )}
      </header>

      {/* Help Overlay */}
      {showHelpOverlay && (
        <div className="overlay">
          <div className="overlay-content">
            <button className="close-btn" onClick={() => setShowHelpOverlay(false)}>
              ×
            </button>
            <h2>Need Help?</h2>
            <p>
              If you have questions about orders, products, or your account, 
              our support team is happy to assist you.
            </p>
            <p className="contact-info">
              <FaEnvelope className="contact-icon" /> <strong>Email:</strong> support@artistryhub.com <br />
              <FaPhoneAlt className="contact-icon" /> <strong>Phone:</strong> +63 912 345 6789
            </p>
            <button className="save-btn" onClick={() => setShowHelpOverlay(false)}>
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;