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
  const [accountInfo, setAccountInfo] = useState({
    name: "",
    address: "",
    contact: "",
    payment: { paypal: "", gcash: "" },
  });

  const navigate = useNavigate();


  useEffect(() => {
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


  const handleOverlayProceed = () => {
    const existingOrders = JSON.parse(localStorage.getItem("orders")) || [];

    const newOrders = cartItems.map((item) => ({
      id: Date.now() + Math.random(),
      image: item.image || sampleImg,
      name: item.name,
      quantity: item.quantity || 1,
      price: item.price,
      status: "Pending",
      deliveryDate: `Expected ${expectedDelivery}`,
      driver: "Juan Dela Cruz",
      address: accountInfo.address,
      contact: accountInfo.contact,
      payment: payment,
      dateOrdered: new Date().toLocaleDateString("en-PH", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
    }));

    localStorage.setItem("orders", JSON.stringify([...existingOrders, ...newOrders]));
    localStorage.removeItem("cartItems");

    setShowOverlay(false);
    setCartItems([]);
    navigate("/customer/order");
  };

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
          {/* Shipping Address */}
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

          {/* Payment Methods */}
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

          {/* Merchandise Protection */}
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

          {/* Checkout Summary */}
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
              <button className="proceed-btn" onClick={handleOverlayProceed}>
                Proceed
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
