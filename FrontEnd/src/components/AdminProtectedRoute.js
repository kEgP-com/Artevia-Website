import React from 'react';
import { Navigate } from 'react-router-dom';

const AdminProtectedRoute = ({ children }) => {
  // Check if admin data exists in storage
  const isAuthenticated = localStorage.getItem("adminData");

  if (!isAuthenticated) {
    // If not logged in, force redirect to Admin Login
    return <Navigate to="/admin/login" replace />;
  }

  // If logged in, render the page
  return children;
};

export default AdminProtectedRoute;