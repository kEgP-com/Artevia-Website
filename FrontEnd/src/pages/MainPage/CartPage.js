// src/pages/ProductPage/CartPage.js (Updated Port)
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";
import "../../css/CartPage.css";
import {
  FaTrashAlt, FaPaypal, FaMoneyBillAlt, FaCcMastercard,
  FaHome, FaShieldAlt, FaListAlt, FaCreditCard, FaBoxOpen, FaEdit,
} from "react-icons/fa";
import sampleImg from "../../images/Sketch arts/cat portrait.png";

export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [userId, setUserId] = useState(null);
  const [protection, setProtection] = useState(true);
  const [payment, setPayment] = useState("paypal");
  const [showOverlay, setShowOverlay] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);


  const [accountInfo, setAccountInfo] = useState({
    name: "", address: "", contact: "", payment: { paypal: "", gcash: "" },
  });

  const navigate = useNavigate();

  // --- 1. LOAD DATA ---
 // Hanapin ang useEffect na ito sa CartPage.js
  // Hanapin ang useEffect na ito sa CartPage.js
  useEffect(() => {
    // 1. Kunin ang User Info
    const saved = localStorage.getItem("accountInfo");
    let currentUserId = null;

    if (saved) {
      const acc = JSON.parse(saved);
      setAccountInfo({
        name: acc.fullName,
        address: acc.address,
        contact: acc.contact,
        payment: acc.payment || { paypal: "", gcash: "" },
      });
      currentUserId = acc.id; // Eto yung ID (e.g., 1)
      setUserId(acc.id);
    }

    // 2. Fetch Cart mula sa Database
    const fetchCart = async () => {
      try {
        // 👇 MAHALAGA: I-check kung may user ID
        let url = "http://localhost:8000/api/cart";
        
        if (currentUserId) {
            // 👇 IDAGDAG ANG USER ID SA URL
            url = `http://localhost:8000/api/cart?user_id=${currentUserId}`;
        }

        const res = await fetch(url);
        
        if (res.ok) {
          const data = await res.json();
          // I-set ang data (siguraduhing array)
          setCartItems(Array.isArray(data) ? data : []);
        } else {
          console.warn("Failed to fetch cart from DB.");
        }
      } catch (error) {
        console.error("Error fetching cart:", error);
      }
    };

    fetchCart();
  }, []);
  // --- 2. DELETE ITEM (UPDATED PORT) ---
  const handleDelete = async (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));

    try {
      // FIX: Changed 8082 to 8000
      await fetch(`http://localhost:8000/api/cart/${id}`, {
        method: "DELETE",
      });
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const updateQuantity = (id, change) => {
    setCartItems((prev) => {
      return prev.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, (item.quantity || 1) + change) }
          : item
      );
    });
  };

  const subtotal = cartItems.reduce((sum, i) => sum + i.price * (i.quantity || 1), 0);
  const shipping = 120;
  const protectionFee = protection ? 50 : 0;
  const total = subtotal + shipping + protectionFee;

  const expectedDelivery = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString("en-PH", {
    month: "long", day: "numeric", year: "numeric",
  });

  const handleProceed = () => setShowOverlay(true);

  // --- 3. CHECKOUT (UPDATED PORT) ---
  const handleOverlayProceed = async () => {
    setIsProcessing(true);

    const orderData = {
      user_id: userId,
      name: accountInfo.name,
      items: cartItems,
      total: total,
      address: accountInfo.address,
      contact: accountInfo.contact,
      payment: payment,
    };

    try {
      // FIX: Changed 8082 to 8000
      // Sa loob ng CartPage.js -> handleOverlayProceed function

      const res = await fetch("http://localhost:8000/api/orders", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"  // 👈 IDAGDAG MO ITO! Napaka-importante nito sa Laravel.
        },
        body: JSON.stringify(orderData),
      });

      if (!res.ok) throw new Error("Server response was not OK");

      const result = await res.json();
      setShowOverlay(false);
      navigate("/customer/order", {
        state: { savedOrder: result, items: cartItems, total: total, accountInfo: accountInfo, payment: payment }
      });

    } catch (error) {
      console.error("Connection Error:", error);
      alert("Note: Proceeding with local data (Server might be offline).");
      setShowOverlay(false);
      navigate("/customer/order", {
        state: { items: cartItems, total: total, accountInfo: accountInfo, payment: payment }
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleEditRestricted = (type) => {
    if (window.confirm(`Go to Account Page to edit your ${type}?`)) {
      navigate("/customer/account");
    }
  };

  const paymentInfo = payment === "paypal"
      ? { method: "PayPal", details: accountInfo.payment?.paypal || "PayPal not set" }
      : payment === "gcash"
      ? { method: "GCash", details: accountInfo.payment?.gcash || "GCash not set" }
      : { method: "Cash on Delivery", details: "Pay upon receiving your order." };

 // Helper for Image URL (FIXED for Laravel Backend)
  const getImgUrl = (img) => {
    // 1. Kung walang image, mag-default
    if (!img) return sampleImg;

    // 2. Kung full URL na (may http), gamitin agad
    if (typeof img === 'string' && img.startsWith("http")) return img;

    // 3. Kung relative path (nagsisimula sa /), dagdagan ng backend URL
    if (typeof img === 'string' && img.startsWith("/")) {
        return `http://localhost:8000${img}`; // 👈 ITO ANG NAGPAPALABAS NG IMAGE
    }

    // 4. Fallback
    return img;
  };
  return (
    <>
      <Navbar />
      <div className="cart-container">
        <div className="cart-left">
          <h2 className="page-heading-left"><FaBoxOpen /> Your Art</h2>
          <div className="cart-items-scroll">
            {cartItems.length === 0 ? (
              <p className="empty-cart">Your cart is empty 🛒</p>
            ) : (
              cartItems.map((item) => (
                <div key={item.id} className="cart-item">
                  <div className="cart-item-img">
                    <img src={getImgUrl(item.image)} alt={item.name} />
                  </div>
                  <div className="cart-item-info">
                    <h4>{item.name}</h4>
                    <p className="artist">by {item.artist || "Unknown"}</p>
                    <p className="type">Type: {item.type || item.category}</p>
                    <p className="price">₱{item.price.toLocaleString()}</p>
                    <div className="quantity-control">
                      <button onClick={() => updateQuantity(item.id, -1)}>-</button>
                      <span>{item.quantity || 1}</span>
                      <button onClick={() => updateQuantity(item.id, +1)}>+</button>
                    </div>
                  </div>
                  <button className="delete-btn" onClick={() => handleDelete(item.id)}><FaTrashAlt /></button>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="cart-right">
          {/* Address Box */}
          <div className="cart-box">
            <h3><FaHome className="cart-icon" /> Shipping Address <FaEdit className="edit-icon" onClick={() => handleEditRestricted("shipping address")} /></h3>
            <hr />
            <p><strong>Recipient:</strong> {accountInfo.name || "Not set"}</p>
            <p><strong>Address:</strong> {accountInfo.address || "Not set"}</p>
            <p><strong>Contact:</strong> {accountInfo.contact || "Not set"}</p>
          </div>

          {/* Payment Box */}
          <div className="cart-box">
             <h3><FaCreditCard className="cart-icon" /> Payment Methods <FaEdit className="edit-icon" onClick={() => handleEditRestricted("payment method")} /></h3>
            <hr />
            <div className="payment-options">
              <label><input type="radio" name="payment" checked={payment === "paypal"} onChange={() => setPayment("paypal")} /> <FaPaypal /> PayPal</label>
              <label><input type="radio" name="payment" checked={payment === "gcash"} onChange={() => setPayment("gcash")} /> <FaCcMastercard /> GCash</label>
              <label><input type="radio" name="payment" checked={payment === "cod"} onChange={() => setPayment("cod")} /> <FaMoneyBillAlt /> Cash on Delivery</label>
            </div>
          </div>

          {/* Checkout Summary */}
          <div className="cart-box checkout-box">
            <h3><FaListAlt className="cart-icon" /> Checkout Summary</h3>
            <hr />
            <p><strong>Total Items:</strong> {cartItems.length}</p>
            <p><strong>Subtotal:</strong> ₱{subtotal.toLocaleString()}</p>
            <p><strong>Shipping Fee:</strong> ₱{shipping}</p>
            <hr />
            <p className="total"><strong>Total: ₱{total.toLocaleString()}</strong></p>
            <div className="checkout-buttons single">
              <button className="purchase-btn" onClick={handleProceed}>Proceed to Checkout</button>
            </div>
          </div>
        </div>
      </div>

      {showOverlay && (
        <div className="overlay">
          <div className="overlay-content">
            <h2>Order Summary</h2>
            <p><strong>Total:</strong> ₱{total.toLocaleString()}</p>
             <div className="overlay-buttons">
              <button onClick={() => setShowOverlay(false)}>Close</button>
              <button className="proceed-btn" onClick={handleOverlayProceed} disabled={isProcessing}>
                {isProcessing ? "Processing..." : "Proceed"}
              </button>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </>
  );
}