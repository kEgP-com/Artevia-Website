import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import App from "./App"; // Customer App
import AdminApp from "./AdminApp"; // Admin App

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/customer/*" element={<App />} />
        <Route path="/admin/*" element={<AdminApp />} />
        
        <Route path="*" element={<Navigate to="/customer/homepage" />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
