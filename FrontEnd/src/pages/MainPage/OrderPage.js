import React, { useState, useEffect } from "react";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";
import "../../css/OrderHistoryPage.css";
import {
  FaBoxOpen,
  FaEye,
  FaTrashAlt,
  FaPhoneAlt,
  FaStar,
  FaUserTie,
  FaFilter,
  FaExclamationTriangle,
} from "react-icons/fa";

export default function OrderPage() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filter, setFilter] = useState("All");
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Vendor messaging overlay states
  const [showVendorOverlay, setShowVendorOverlay] = useState(false);
  const [currentVendorOrder, setCurrentVendorOrder] = useState(null);
  const [vendorMessage, setVendorMessage] = useState("");

  // Load Orders from LocalStorage
  useEffect(() => {
    const storedOrders = JSON.parse(localStorage.getItem("orders")) || [];
    setOrders(storedOrders);
  }, []);

  // Save back to LocalStorage
  const updateOrders = (newOrders) => {
    setOrders(newOrders);
    localStorage.setItem("orders", JSON.stringify(newOrders));
  };

  // Cancel Order
  const handleCancel = (id) => {
    if (window.confirm("Are you sure you want to cancel this order?")) {
      const updated = orders.map((o) =>
        o.id === id ? { ...o, status: "Cancelled" } : o
      );
      updateOrders(updated);
    }
  };

  // Rate Order
  const handleRate = (id) => {
    const rating = prompt("Rate your order (1–5 stars):");
    if (!rating || rating < 1 || rating > 5) {
      alert("Please enter a valid rating between 1 and 5.");
      return;
    }
    const updated = orders.map((o) =>
      o.id === id ? { ...o, rating: parseInt(rating) } : o
    );
    updateOrders(updated);
    alert(`Thank you! You rated this order ${rating}⭐`);
  };

  // Contact Driver
  const handleContactDriver = (driver) =>
    alert(`Calling ${driver}...`);

  // Open Vendor Messaging Overlay
  const handleContactVendor = (order) => {
    setCurrentVendorOrder(order);
    setVendorMessage(""); // reset message
    setShowVendorOverlay(true);
  };

  // Send message to vendor
  const handleSendVendorMessage = () => {
    const existingMessages = JSON.parse(localStorage.getItem("vendorMessages")) || [];
    const newMessage = {
      orderId: currentVendorOrder.id,
      orderName: currentVendorOrder.name,
      message: vendorMessage,
      date: new Date().toLocaleString(),
    };
    localStorage.setItem(
      "vendorMessages",
      JSON.stringify([...existingMessages, newMessage])
    );
    alert("Message sent to vendor!");
    setShowVendorOverlay(false);
  };

  // Clear All Orders
  const handleClearAll = () => {
    localStorage.removeItem("orders");
    setOrders([]);
    setShowClearConfirm(false);
  };

  // Filter Orders
  const filteredOrders =
    filter === "All" ? orders : orders.filter((o) => o.status === filter);

  return (
    <>
      <Navbar />
      <div className="order-history-container">
        {/* HEADER SECTION */}
        <div className="order-history-header">
          <h2>
            <FaBoxOpen /> Order History
          </h2>
          <div className="order-filter">
            <FaFilter className="filter-icon" />
            <select value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="All">All Orders</option>
              <option value="Pending">Pending</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* ORDER LIST */}
        {filteredOrders.length === 0 ? (
          <div className="empty-order">
            No {filter.toLowerCase()} orders found
          </div>
        ) : (
          <div className="orders-list">
            {filteredOrders.map((order) => (
              <div key={order.id} className="order-card">
                <div className="order-img">
                  <img src={order.image} alt={order.name} />
                </div>

                <div className="order-info">
                  <h3>{order.name}</h3>
                  <p>
                    <strong>Status:</strong>{" "}
                    <span className={`order-status ${order.status.toLowerCase()}`}>
                      {order.status}
                    </span>
                  </p>
                  <p>
                    <strong>Quantity:</strong> {order.quantity}
                  </p>
                  <p>
                    <strong>Total:</strong> ₱
                    {(order.price * order.quantity).toLocaleString()}
                  </p>
                  <p>
                    <strong>Ordered:</strong> {order.dateOrdered}
                  </p>
                  <p>
                    <strong>Expected Delivery:</strong> {order.deliveryDate}
                  </p>
                </div>

                {/* ACTION BUTTONS */}
                <div className="order-actions">
                  <button
                    className="details-btn"
                    onClick={() => setSelectedOrder(order)}
                  >
                    <FaEye /> View
                  </button>

                  {order.status === "Pending" && (
                    <button
                      className="cancel-btn"
                      onClick={() => handleCancel(order.id)}
                    >
                      <FaTrashAlt /> Cancel
                    </button>
                  )}

                  {["Pending", "Delivered"].includes(order.status) && (
                    <button
                      className="driver-btn"
                      onClick={() => handleContactDriver(order.driver)}
                    >
                      <FaPhoneAlt /> Driver
                    </button>
                  )}

                  <button
                    className="vendor-btn"
                    onClick={() => handleContactVendor(order)}
                  >
                    <FaUserTie /> Vendor
                  </button>

                  {order.status === "Delivered" && (
                    <button
                      className="rate-btn"
                      onClick={() => handleRate(order.id)}
                    >
                      <FaStar /> Rate
                    </button>
                  )}
                </div>
              </div>
            ))}

            {/* Clear History Button */}
            <div className="clear-history-container">
              <button
                className="clear-history-btn"
                onClick={() => setShowClearConfirm(true)}
              >
                <FaTrashAlt /> Clear All History
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ORDER DETAILS MODAL */}
      {selectedOrder && (
        <div className="overlay">
          <div className="overlay-content">
            <button
              className="close-btn"
              onClick={() => setSelectedOrder(null)}
            >
              ✕
            </button>
            <h2>Order Details</h2>
            <img
              src={selectedOrder.image}
              alt={selectedOrder.name}
              className="overlay-img"
            />
            <p>
              <strong>Item:</strong> {selectedOrder.name}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              <span
                className={`order-status ${selectedOrder.status.toLowerCase()}`}
              >
                {selectedOrder.status}
              </span>
            </p>
            <p>
              <strong>Quantity:</strong> {selectedOrder.quantity}
            </p>
            <p>
              <strong>Total:</strong> ₱
              {(selectedOrder.price * selectedOrder.quantity).toLocaleString()}
            </p>
            <p>
              <strong>Driver:</strong> {selectedOrder.driver}
            </p>
            <p>
              <strong>Address:</strong> {selectedOrder.address}
            </p>
            <p>
              <strong>Payment:</strong> {selectedOrder.payment}
            </p>
            <p>
              <strong>Date Ordered:</strong> {selectedOrder.dateOrdered}
            </p>
            <p>
              <strong>Expected Delivery:</strong> {selectedOrder.deliveryDate}
            </p>
            {selectedOrder.rating && (
              <p>
                <strong>Your Rating:</strong> {selectedOrder.rating}⭐
              </p>
            )}
          </div>
        </div>
      )}

      {/* VENDOR CONTACT MODAL */}
      {showVendorOverlay && currentVendorOrder && (
        <div className="overlay">
          <div className="overlay-content">
            <button
              className="close-btn"
              onClick={() => setShowVendorOverlay(false)}
            >
              ✕
            </button>
            <h2>Message Vendor</h2>
            <p>
              You are sending a message regarding: <strong>{currentVendorOrder.name}</strong>
            </p>
            <textarea
              placeholder="Type your message to the vendor..."
              value={vendorMessage}
              onChange={(e) => setVendorMessage(e.target.value)}
              style={{ width: "100%", height: "120px", margin: "10px 0", padding: "8px" }}
            />
            <button
              className="confirm-btn"
              onClick={handleSendVendorMessage}
              disabled={!vendorMessage.trim()}
            >
              Send Message
            </button>
          </div>
        </div>
      )}

      {/* CLEAR CONFIRMATION MODAL */}
      {showClearConfirm && (
        <div className="overlay">
          <div className="overlay-content">
            <FaExclamationTriangle
              style={{ color: "#e53935", fontSize: "32px", marginBottom: "10px" }}
            />
            <h2>Clear All Orders?</h2>
            <p style={{ textAlign: "center", marginBottom: "20px" }}>
              This will permanently delete all your order history.
            </p>
            <div className="confirm-buttons">
              <button
                className="cancel-btn"
                onClick={() => setShowClearConfirm(false)}
              >
                Cancel
              </button>
              <button className="confirm-btn" onClick={handleClearAll}>
                Yes, Clear
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
