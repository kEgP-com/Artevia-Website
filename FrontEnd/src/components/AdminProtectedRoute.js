import React from 'react';
import { Navigate } from 'react-router-dom';

const AdminProtectedRoute = ({ children }) => {
 
  const isAuthenticated = localStorage.getItem("adminData");

  if (!isAuthenticated) {
   
    return <Navigate to="/admin/login" replace />;
  }


  return children;
};

export default AdminProtectedRoute;