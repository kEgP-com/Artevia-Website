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
import { useNavigate } from "react-router-dom";

export default function OrderPage() {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  // --- STATE DEFINITIONS ---
  const [filter, setFilter] = useState("All");
  const [selectedOrder, setSelectedOrder] = useState(null);
  
  // Modals
  const [showVendorOverlay, setShowVendorOverlay] = useState(false);
  const [currentVendorOrder, setCurrentVendorOrder] = useState(null);
  const [vendorMessage, setVendorMessage] = useState("");
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // --- 1. FETCH ORDERS ---
  useEffect(() => {
    const fetchOrders = async () => {
      const savedInfo = JSON.parse(localStorage.getItem("accountInfo"));
      const userId = savedInfo ? savedInfo.id : null;

      if (!userId) return;

      try {
        // Fetch lang ng simple list galing sa orders table
        const response = await fetch(`http://localhost:8082/api/orders?user_id=${userId}`);
        if (response.ok) {
          const data = await response.json();
          setOrders(data);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  // --- 2. ACTION HANDLERS ---

  // Cancel Order (Update Status)
  const handleCancel = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this item?")) return;
    try {
        const res = await fetch(`http://localhost:8082/api/orders/${orderId}/cancel`, {
            method: 'PUT'
        });
        if (res.ok) {
            alert("Item cancelled.");
            // Update local state
            setOrders(orders.map(o => o.id === orderId ? {...o, status: 'Cancelled'} : o));
            setSelectedOrder(null);
        } else {
            alert("Failed to cancel.");
        }
    } catch (error) {
        console.error(error);
    }
  };

  // Delete Order (Permanent Remove)
  const handleDelete = async (orderId) => {
    if (!window.confirm("Permanently delete this record from history?")) return;
    try {
        const res = await fetch(`http://localhost:8082/api/orders/${orderId}`, {
            method: 'DELETE',
        });
        if (res.ok) {
            setOrders(orders.filter(o => o.id !== orderId));
            alert("Record deleted.");
        }
    } catch (error) {
        console.error("Error deleting order:", error);
    }
  };

  // Clear All History
  const handleClearAll = async () => {
    const savedInfo = JSON.parse(localStorage.getItem("accountInfo"));
    if(!savedInfo) return;

    try {
        const res = await fetch(`http://localhost:8082/api/orders/clear?user_id=${savedInfo.id}`, {
            method: 'DELETE',
        });
        if (res.ok) {
            setOrders([]);
            setShowClearConfirm(false);
            alert("All history has been deleted.");
        }
    } catch (error) {
        console.error("Error clearing history:", error);
    }
  };

  // --- 3. HELPER FUNCTIONS ---
  
  const handleContactDriver = (driverName) => {
    alert(`Calling driver: ${driverName || "Assigning..."}... 📞`);
  };

  const handleContactVendor = (order) => {
    setCurrentVendorOrder(order);
    setShowVendorOverlay(true);
  };

  // --- SEND MESSAGE TO DATABASE ---
  const handleSendVendorMessage = async () => {
    // 1. Kunin ang User Info galing LocalStorage
    const savedInfo = JSON.parse(localStorage.getItem("accountInfo"));
    
    if (!savedInfo) {
        alert("Please login first to send a message.");
        return;
    }

    if (!vendorMessage.trim()) {
        alert("Please type a message.");
        return;
    }

    // 2. Prepare Payload (Dapat match sa Controller validation mo)
    const payload = {
        // 👇 UPDATE: Subukan kunin sa .name, kung wala try .fullName, kung wala pa rin -> "Customer"
        name: savedInfo.name || savedInfo.fullName || "Customer", 
        
        email: savedInfo.email || "no-email@provided.com",
        subject: `Order #${currentVendorOrder.id}: ${currentVendorOrder.name}`,
        message: vendorMessage
    };

    try {
        // 3. Send sa Laravel Backend
        const res = await fetch("http://localhost:8082/api/contact-messages", {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(payload)
        });

        if (res.ok) {
            alert("Message sent to Admin! We will review your concern.");
            setVendorMessage(""); // Clear textbox
            setShowVendorOverlay(false); // Close modal
        } else {
            const errorData = await res.json();
            console.error("Server Error:", errorData);
            alert("Failed to send message. Please try again.");
        }
    } catch (error) {
        console.error("Network Error:", error);
        alert("Connection error. Is Laravel running?");
    }
  };

  const handleRate = (orderId) => {
    const rating = prompt("Rate this item (1-5):");
    if (rating) {
        alert(`You rated item #${orderId} with ${rating} stars! ⭐`);
    }
  };

  // Image URL Fixer
  const getImgUrl = (img) => {
    if (!img || img === 'no-image.png') return "https://via.placeholder.com/150";
    if (typeof img === 'string' && img.startsWith("http")) return img;
    const cleanPath = img.startsWith('/') ? img : `/${img}`;
    return `http://localhost:8082${cleanPath}`;
  };

  // --- 4. RENDER ---

  // Filter Logic
  const filteredOrders = orders.filter((order) => {
    if (filter === "All") return true;
    return order.status === filter;
  });

  return (
      <>
      <Navbar />
      <div className="order-history-container">
        
        {/* HEADER */}
        <div className="order-history-header">
          <h2><FaBoxOpen /> Order History</h2>
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
            No {filter.toLowerCase()} items found
          </div>
        ) : (
          <div className="orders-list">
            {filteredOrders.map((order) => (
              <div key={order.id} className="order-card">
                
                {/* Image */}
                <div className="order-img">
                  <img src={getImgUrl(order.image)} alt={order.name} />
                </div>

                {/* Info */}
                <div className="order-info">
                  <h3>{order.name}</h3>
                  <p>
                    <strong>Status:</strong>{" "}
                    <span className={`order-status ${order.status.toLowerCase()}`}>
                      {order.status}
                    </span>
                  </p>
                  <p><strong>Quantity:</strong> {order.quantity}</p>
                  <p><strong>Total:</strong> ₱{parseFloat(order.total_amount).toLocaleString()}</p>
                  <p><strong>Date:</strong> {new Date(order.created_at).toLocaleDateString()}</p>
                </div>

                {/* Buttons */}
                <div className="order-actions">
                  <button className="details-btn" onClick={() => setSelectedOrder(order)}>
                    <FaEye /> View
                  </button>

                  {order.status === "Pending" && (
                    <button className="cancel-btn" onClick={() => handleCancel(order.id)}>
                      <FaTrashAlt /> Cancel
                    </button>
                  )}

                  {["Cancelled", "Delivered"].includes(order.status) && (
                     <button 
                        className="cancel-btn" 
                        style={{ backgroundColor: "#d32f2f" }} 
                        onClick={() => handleDelete(order.id)}
                     >
                        <FaTrashAlt /> Delete
                     </button>
                  )}

                  {["Pending", "Delivered"].includes(order.status) && (
                    <button className="driver-btn" onClick={() => handleContactDriver(order.driver)}>
                      <FaPhoneAlt /> Driver
                    </button>
                  )}

                  <button className="vendor-btn" onClick={() => handleContactVendor(order)}>
                    <FaUserTie /> Vendor
                  </button>

                  {order.status === "Delivered" && (
                    <button className="rate-btn" onClick={() => handleRate(order.id)}>
                      <FaStar /> Rate
                    </button>
                  )}
                </div>
              </div>
            ))}

            {/* Clear All Button */}
            <div className="clear-history-container">
              <button className="clear-history-btn" onClick={() => setShowClearConfirm(true)}>
                <FaTrashAlt /> Clear All History
              </button>
            </div>
          </div>
        )}
      </div>

      {/* --- MODALS --- */}

      {/* 1. Details Modal */}
      {selectedOrder && (
        <div className="overlay">
          <div className="overlay-content">
            <button className="close-btn" onClick={() => setSelectedOrder(null)}>✕</button>
            <h2>Item Details</h2>
            <img 
                src={getImgUrl(selectedOrder.image)} 
                alt={selectedOrder.name} 
                className="overlay-img" 
            />
            <p><strong>Item:</strong> {selectedOrder.name}</p>
            <p>
              <strong>Status:</strong>{" "}
              <span className={`order-status ${selectedOrder.status.toLowerCase()}`}>
                {selectedOrder.status}
              </span>
            </p>
            <p><strong>Quantity:</strong> {selectedOrder.quantity}</p>
            <p><strong>Total Price:</strong> ₱{parseFloat(selectedOrder.total_amount).toLocaleString()}</p>
            <p><strong>Driver:</strong> {selectedOrder.driver || "Unassigned"}</p>
            <p><strong>Address:</strong> {selectedOrder.address}</p>
            <p><strong>Payment:</strong> {selectedOrder.payment_method}</p>
          </div>
        </div>
      )}

      {/* 2. Vendor Message Modal */}
      {showVendorOverlay && currentVendorOrder && (
        <div className="overlay">
          <div className="overlay-content">
            <button className="close-btn" onClick={() => setShowVendorOverlay(false)}>✕</button>
            <h2>Message Vendor</h2>
            <p> regarding: <strong>{currentVendorOrder.name}</strong></p>
            <textarea
              placeholder="Type your message..."
              value={vendorMessage}
              onChange={(e) => setVendorMessage(e.target.value)}
              style={{ width: "100%", height: "120px", margin: "10px 0", padding: "8px" }}
            />
            <button className="confirm-btn" onClick={handleSendVendorMessage}>Send Message</button>
          </div>
        </div>
      )}

      {/* 3. Clear History Confirmation Modal */}
      {showClearConfirm && (
        <div className="overlay">
          <div className="overlay-content">
            <FaExclamationTriangle style={{ color: "#e53935", fontSize: "32px", marginBottom: "10px" }} />
            <h2>Clear All Orders?</h2>
            <p style={{ textAlign: "center", marginBottom: "20px" }}>This will delete history.</p>
            <div className="confirm-buttons">
              <button className="cancel-btn" onClick={() => setShowClearConfirm(false)}>Cancel</button>
              <button className="confirm-btn" onClick={handleClearAll}>Yes, Clear</button>
            </div>
          </div>
        </div>
      )}

      <Footer />
      </>
  );
}