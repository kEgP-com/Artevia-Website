import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";
import "../../css/CartPage.css";
import {
  FaTrashAlt,
  FaPaypal,
  FaMoneyBillAlt,
  FaCcMastercard,
  FaHome,
  FaShieldAlt,
  FaListAlt,
  FaCreditCard,
  FaBoxOpen,
  FaEdit,
} from "react-icons/fa";
import sampleImg from "../../images/Sketch arts/cat portrait.png";


export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [protection, setProtection] = useState(true);
  const [payment, setPayment] = useState("paypal");
  const [showOverlay, setShowOverlay] = useState(false);
 
  // ETO ANG KULANG KANINA:
  const [isProcessing, setIsProcessing] = useState(false);


  const [accountInfo, setAccountInfo] = useState({
    name: "",
    address: "",
    contact: "",
    payment: { paypal: "", gcash: "" },
  });


  const navigate = useNavigate();


  useEffect(() => {
    // 1. Load Account Info
    const saved = localStorage.getItem("accountInfo");
    if (saved) {
      const acc = JSON.parse(saved);
      setAccountInfo({
        name: acc.fullName,
        address: acc.address,
        contact: acc.contact,
        payment: acc.payment || { paypal: "", gcash: "" },
      });
    }


    // 2. Load Cart Items from LocalStorage
    const storedCart = JSON.parse(localStorage.getItem("cartItems")) || [];
    setCartItems(storedCart);
  }, []);


  const handleDelete = (id) => {
    setCartItems((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      localStorage.setItem("cartItems", JSON.stringify(updated));
      return updated;
    });
  };


  const updateQuantity = (id, change) => {
    setCartItems((prev) => {
      const updated = prev.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, (item.quantity || 1) + change) }
          : item
      );
      localStorage.setItem("cartItems", JSON.stringify(updated));
      return updated;
    });
  };


  const subtotal = cartItems.reduce(
    (sum, i) => sum + i.price * (i.quantity || 1),
    0
  );
  const shipping = 120;
  const protectionFee = protection ? 50 : 0;
  const total = subtotal + shipping + protectionFee;


  const expectedDelivery = new Date(
    Date.now() + 5 * 24 * 60 * 60 * 1000
  ).toLocaleDateString("en-PH", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });


  const handleProceed = () => setShowOverlay(true);


  // --- UPDATED FUNCTION WITH LOADING STATE ---
  const handleOverlayProceed = async () => {
    setIsProcessing(true); // Start loading


    const orderData = {
      items: cartItems,
      total: total,
      address: accountInfo.address,
      contact: accountInfo.contact,
      payment: payment,
    };


    try {
      // Maghihintay ng 5 seconds bago mag-timeout para hindi stock
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);


      const res = await fetch("http://localhost:8000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
        signal: controller.signal
      });
     
      clearTimeout(timeoutId);


      if (!res.ok) {
        throw new Error("Server response was not OK");
      }


      const result = await res.json();
      console.log("Order saved to DB:", result);


      setShowOverlay(false);
      navigate("/customer/order", {
        state: {
          savedOrder: result,
          items: cartItems,
          total: total
        }
      });


    } catch (error) {
      console.error("Connection Error or Timeout:", error);
     
      // FALLBACK: Proceed pa rin kahit error para sa demo
      setShowOverlay(false);
      navigate("/customer/order", {
        state: {
            items: cartItems,
            total: total,
            accountInfo: accountInfo,
            payment: payment
        }
      });
    } finally {
      setIsProcessing(false); // Stop loading
    }
  };
  // -----------------------------------


  const handleEditRestricted = (type) => {
    if (window.confirm(`Go to Account Page to edit your ${type}?`)) {
      navigate("/customer/account");
    }
  };


  const paymentInfo =
    payment === "paypal"
      ? {
          method: "PayPal",
          details: accountInfo.payment?.paypal || "PayPal not set",
        }
      : payment === "gcash"
      ? {
          method: "GCash",
          details: accountInfo.payment?.gcash || "GCash not set",
        }
      : {
          method: "Cash on Delivery",
          details: "Pay upon receiving your order.",
        };


  return (
    <>
      <Navbar />
      <div className="cart-container">
        {/* LEFT SIDE */}
        <div className="cart-left">
          <h2 className="page-heading-left">
            <FaBoxOpen /> Your Art
          </h2>


          <div className="cart-items-scroll">
            {cartItems.length === 0 ? (
              <p className="empty-cart">Your cart is empty 🛒</p>
            ) : (
              cartItems.map((item) => (
                <div key={item.id} className="cart-item">
                  <div className="cart-item-img">
                    <img src={item.image || sampleImg} alt={item.name} />
                  </div>
                  <div className="cart-item-info">
                    <h4>{item.name}</h4>
                    <p className="artist">by {item.artist}</p>
                    <p className="type">Type: {item.type}</p>
                    <p className="price">₱{item.price.toLocaleString()}</p>
                    <div className="quantity-control">
                      <button onClick={() => updateQuantity(item.id, -1)}>-</button>
                      <span>{item.quantity || 1}</span>
                      <button onClick={() => updateQuantity(item.id, +1)}>+</button>
                    </div>
                  </div>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(item.id)}
                  >
                    <FaTrashAlt />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>


        {/* RIGHT SIDE */}
        <div className="cart-right">
          <div className="cart-box">
            <h3>
              <FaHome className="cart-icon" /> Shipping Address
              <FaEdit
                className="edit-icon"
                onClick={() => handleEditRestricted("shipping address")}
              />
            </h3>
            <hr />
            <p><strong>Recipient:</strong> {accountInfo.name || "Not set"}</p>
            <p><strong>Address:</strong> {accountInfo.address || "Not set"}</p>
            <p><strong>Contact:</strong> {accountInfo.contact || "Not set"}</p>
          </div>


          <div className="cart-box">
            <h3>
              <FaCreditCard className="cart-icon" /> Payment Methods
              <FaEdit
                className="edit-icon"
                onClick={() => handleEditRestricted("payment method")}
              />
            </h3>
            <hr />
            <div className="payment-options">
              <label>
                <input
                  type="radio"
                  name="payment"
                  checked={payment === "paypal"}
                  onChange={() => setPayment("paypal")}
                />
                <FaPaypal /> PayPal
              </label>
              <label>
                <input
                  type="radio"
                  name="payment"
                  checked={payment === "gcash"}
                  onChange={() => setPayment("gcash")}
                />
                <FaCcMastercard /> GCash
              </label>
              <label>
                <input
                  type="radio"
                  name="payment"
                  checked={payment === "cod"}
                  onChange={() => setPayment("cod")}
                />
                <FaMoneyBillAlt /> Cash on Delivery
              </label>
            </div>
          </div>


          <div className="cart-box">
            <h3>
              <FaShieldAlt className="cart-icon" /> Merchandise Protection
            </h3>
            <hr />
            <div className="protection-check">
              <label>
                <input
                  type="checkbox"
                  checked={protection}
                  onChange={() => setProtection(!protection)}
                />{" "}
                Add ₱50 protection fee for damage or loss coverage
              </label>
            </div>
            <p style={{ fontSize: "14px", color: "#6b4b2d", marginTop: "10px" }}>
              Ensures your order is covered in case of shipment issues or item damage.
            </p>
          </div>


          <div className="cart-box checkout-box">
            <h3>
              <FaListAlt className="cart-icon" /> Checkout Summary
            </h3>
            <hr />
            <p><strong>Total Items:</strong> {cartItems.length}</p>
            <p><strong>Subtotal:</strong> ₱{subtotal.toLocaleString()}</p>
            <p><strong>Shipping Fee:</strong> ₱{shipping}</p>
            <p><strong>Protection Fee:</strong> ₱{protectionFee}</p>
            <hr />
            <p className="total"><strong>Total: ₱{total.toLocaleString()}</strong></p>


            <div className="checkout-buttons single">
              <button className="purchase-btn" onClick={handleProceed}>
                Proceed to Checkout
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
              {cartItems.map((item) => (
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
             
              {/* ETO YUNG UPDATED BUTTON NA MAY LOADING INDICATOR */}
              <button
                className="proceed-btn"
                onClick={handleOverlayProceed}
                disabled={isProcessing}
                style={{
                  opacity: isProcessing ? 0.7 : 1,
                  cursor: isProcessing ? 'wait' : 'pointer'
                }}
              >
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
