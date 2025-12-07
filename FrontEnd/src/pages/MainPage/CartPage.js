// src/pages/ProductPage/CartPage.js (Updated with Selection Feature)
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";
import "../../css/CartPage.css";
import {
  FaTrashAlt, FaPaypal, FaMoneyBillAlt, FaCcMastercard,
  FaHome, FaShieldAlt, FaListAlt, FaCreditCard, FaBoxOpen, FaEdit,
  FaCheckSquare, FaSquare
} from "react-icons/fa"; // Added icons for selection if needed
import sampleImg from "../../images/Sketch arts/cat portrait.png";

export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [userId, setUserId] = useState(null);
  const [protection, setProtection] = useState(true);
  const [payment, setPayment] = useState("paypal");
  const [showOverlay, setShowOverlay] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // 👇 1. NEW STATE: Para sa mga naka-check na items
  const [selectedItemIds, setSelectedItemIds] = useState([]);

  const [accountInfo, setAccountInfo] = useState({
    name: "", address: "", contact: "", payment: { paypal: "", gcash: "" },
  });

  const navigate = useNavigate();

  // --- LOAD DATA ---
  useEffect(() => {
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
      currentUserId = acc.id;
      setUserId(acc.id);
    }

    const fetchCart = async () => {
      try {
        let url = "http://localhost:8000/api/cart";
        if (currentUserId) {
          url = `http://localhost:8000/api/cart?user_id=${currentUserId}`;
        }

        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
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

  // --- SELECTION LOGIC ---
  
  // 👇 Toggle single item
  const toggleSelect = (id) => {
    if (selectedItemIds.includes(id)) {
      setSelectedItemIds(selectedItemIds.filter(itemId => itemId !== id));
    } else {
      setSelectedItemIds([...selectedItemIds, id]);
    }
  };

  // 👇 Select All / Deselect All
  const handleSelectAll = () => {
    if (selectedItemIds.length === cartItems.length) {
      setSelectedItemIds([]); // Deselect all
    } else {
      setSelectedItemIds(cartItems.map(item => item.id)); // Select all
    }
  };

  // 👇 Computed Property: Items na isasama lang sa checkout
  const itemsToCheckout = cartItems.filter(item => selectedItemIds.includes(item.id));

  // --- DELETE ITEM ---
  const handleDelete = async (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
    setSelectedItemIds((prev) => prev.filter((itemId) => itemId !== id)); // Remove from selection if deleted

    try {
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

  // 👇 UPDATED COMPUTATION: Base sa itemsToCheckout, hindi sa lahat
  const subtotal = itemsToCheckout.reduce((sum, i) => sum + i.price * (i.quantity || 1), 0);
  const shipping = itemsToCheckout.length > 0 ? 120 : 0; // Walang shipping fee kung walang selected
  const protectionFee = (protection && itemsToCheckout.length > 0) ? 50 : 0;
  const total = subtotal + shipping + protectionFee;

  const expectedDelivery = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString("en-PH", {
    month: "long", day: "numeric", year: "numeric",
  });

  // 👇 UPDATED PROCEED: Check kung may selected
  const handleProceed = () => {
    if (itemsToCheckout.length === 0) {
      alert("Please select at least one item to checkout.");
      return;
    }
    setShowOverlay(true);
  };

  // --- CHECKOUT ---
  const handleOverlayProceed = async () => {
    setIsProcessing(true);

    const orderData = {
      user_id: userId,
      name: accountInfo.name,
      items: itemsToCheckout, // 👈 PASS ONLY SELECTED ITEMS
      total: total,
      address: accountInfo.address,
      contact: accountInfo.contact,
      payment: payment,
    };

    try {
      const res = await fetch("http://localhost:8000/api/orders", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(orderData),
      });

      if (!res.ok) throw new Error("Server response was not OK");

      const result = await res.json();
      setShowOverlay(false);
      
      // 👇 Tanggalin na ang checked items sa Cart UI (visual update)
      // Note: Sa backend logic mo, dapat burahin din sila sa 'cart' table upon successful order.
      // Pero kung visual lang muna:
      const remainingItems = cartItems.filter(item => !selectedItemIds.includes(item.id));
      setCartItems(remainingItems);
      setSelectedItemIds([]); 

      navigate("/customer/order", {
        state: { savedOrder: result, items: itemsToCheckout, total: total, accountInfo: accountInfo, payment: payment }
      });

    } catch (error) {
      console.error("Connection Error:", error);
      alert("Note: Proceeding with local data (Server might be offline).");
      setShowOverlay(false);
      navigate("/customer/order", {
        state: { items: itemsToCheckout, total: total, accountInfo: accountInfo, payment: payment }
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

  const getImgUrl = (img) => {
    if (!img) return sampleImg;
    if (typeof img === 'string' && img.startsWith("http")) return img;
    if (typeof img === 'string' && img.startsWith("/")) {
        return `http://localhost:8000${img}`;
    }
    return img;
  };

  return (
    <>
      <Navbar />
      <div className="cart-container">
        <div className="cart-left">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
             <h2 className="page-heading-left" style={{ margin: 0 }}><FaBoxOpen /> Your Art</h2>
             
             {/* 👇 SELECT ALL BUTTON */}
             {cartItems.length > 0 && (
                 <label style={{ display: "flex", alignItems: "center", cursor: "pointer", fontWeight: "bold" }}>
                    <input 
                        type="checkbox" 
                        checked={selectedItemIds.length === cartItems.length && cartItems.length > 0}
                        onChange={handleSelectAll}
                        style={{ width: "18px", height: "18px", marginRight: "8px", cursor: "pointer" }}
                    />
                    Select All
                 </label>
             )}
          </div>

          <div className="cart-items-scroll">
            {cartItems.length === 0 ? (
              <p className="empty-cart">Your cart is empty 🛒</p>
            ) : (
              cartItems.map((item) => (
                <div key={item.id} className="cart-item">
                  
                  {/* 👇 CHECKBOX FOR EACH ITEM */}
                  <div style={{ marginRight: "15px", display: "flex", alignItems: "center" }}>
                    <input 
                        type="checkbox" 
                        checked={selectedItemIds.includes(item.id)}
                        onChange={() => toggleSelect(item.id)}
                        style={{ width: "20px", height: "20px", cursor: "pointer", accentColor: "#bfa181" }}
                    />
                  </div>

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
            <h3>
              <FaListAlt className="cart-icon" /> Checkout Summary
            </h3>
            <hr />
            {/* 👇 UPDATED SUMMARY DISPLAYS */}
            <p><strong>Selected Items:</strong> {itemsToCheckout.length}</p>
            <p><strong>Subtotal:</strong> ₱{subtotal.toLocaleString()}</p>
            <p><strong>Shipping Fee:</strong> ₱{shipping}</p>
            <p><strong>Protection Fee:</strong> ₱{protectionFee}</p>
            <hr />
            <p className="total"><strong>Total: ₱{total.toLocaleString()}</strong></p>

            <div className="checkout-buttons single">
              <button className="purchase-btn" onClick={handleProceed} disabled={itemsToCheckout.length === 0} style={{ opacity: itemsToCheckout.length === 0 ? 0.6 : 1 }}>
                Proceed to Checkout ({itemsToCheckout.length})
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {showOverlay && (
        <div className="overlay">
          <div className="overlay-content">
            <h2>Order Summary</h2>
            <p><strong>Recipient:</strong> {accountInfo.name}</p>
            <p><strong>Address:</strong> {accountInfo.address}</p>
            <p><strong>Contact:</strong> {accountInfo.contact}</p>
            <p><strong>Payment Method:</strong> {paymentInfo.method}</p>
            <p><em>{paymentInfo.details}</em></p>
            <hr />
            <ul>
              {/* 👇 LOOP OVER CHECKED ITEMS ONLY */}
              {itemsToCheckout.map((item) => (
                <li key={item.id}>
                  {item.name} × {item.quantity}
                </li>
              ))}
            </ul>
            <hr />
            <p><strong>Total:</strong> ₱{total.toLocaleString()}</p>
            <p><strong>Expected Delivery:</strong> {expectedDelivery}</p>
            <div className="overlay-buttons">
              <button onClick={() => setShowOverlay(false)}>Close</button>
              <button className="proceed-btn" onClick={handleOverlayProceed}>
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