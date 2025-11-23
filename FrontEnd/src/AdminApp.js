import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import DashboardAdmin from "./pages/AdminPage/Dashboard_Admin";
import ArtsPage from "./pages/AdminPage/ArtsPage";
import AdminUsers from "./pages/AdminPage/Admin_users";
import AdminOrders from "./pages/AdminPage/Admin_orders";
import AdminMessages from "./pages/AdminPage/Admin_messages";
import ArtistsPage from "./pages/AdminPage/ArtistsPage";
import LoginPage from "./pages/AdminPage/LoginPage";
import ForgotPassword from "./pages/AdminPage/ForgotPassword";

import ProtectedRoute from "./components/ProtectedRoute"; 

export default function AdminApp() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/forgotPassword" element={<ForgotPassword />} />

      {/* Protected routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardAdmin />
          </ProtectedRoute>
        }
      />
      <Route
        path="/arts"
        element={
          <ProtectedRoute>
            <ArtsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/users"
        element={
          <ProtectedRoute>
            <AdminUsers />
          </ProtectedRoute>
        }
      />
      <Route
        path="/artists"
        element={
          <ProtectedRoute>
            <ArtistsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/orders"
        element={
          <ProtectedRoute>
            <AdminOrders />
          </ProtectedRoute>
        }
      />
      <Route
        path="/messages"
        element={
          <ProtectedRoute>
            <AdminMessages />
          </ProtectedRoute>
        }
      />

      {/* Default route */}
      <Route path="*" element={<Navigate to="/admin/login" />} />
    </Routes>
  );
}
