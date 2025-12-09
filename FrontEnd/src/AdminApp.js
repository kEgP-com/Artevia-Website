import { Routes, Route } from "react-router-dom"; 
import DashboardAdmin from "./pages/AdminPage/Dashboard_Admin"; 
import AdminArts from "./pages/AdminPage/ArtsPage"; 
import AdminUsers from "./pages/AdminPage/Admin_users";
import AdminOrders from "./pages/AdminPage/Admin_orders";
import AdminMessages from "./pages/AdminPage/Admin_messages";
import AdminArtists from "./pages/AdminPage/ArtistsPage"; 
import LoginPage from "./pages/AdminPage/LoginPage";
import AdminProtectedRoute from "./components/AdminProtectedRoute"; 


import Suspend from "./components/Suspension";

function AdminApp() {
  return (
  
    <Routes>
      
      <Route path="/login" element={<LoginPage />} />
      
     
      <Route path="/suspend" element={<Suspend />} />

    
      <Route
        path="/dashboard"
        element={
          <AdminProtectedRoute>
            <DashboardAdmin />
          </AdminProtectedRoute>
        }
      />
      
      <Route
        path="/users"
        element={
          <AdminProtectedRoute>
            <AdminUsers />
          </AdminProtectedRoute>
        }
      />
      
      <Route
        path="/arts"
        element={
          <AdminProtectedRoute>
            <AdminArts />
          </AdminProtectedRoute>
        }
      />
      
      <Route
        path="/artists"
        element={
          <AdminProtectedRoute>
            <AdminArtists />
          </AdminProtectedRoute>
        }
      />
      
      <Route
        path="/orders"
        element={
          <AdminProtectedRoute>
            <AdminOrders />
          </AdminProtectedRoute>
        }
      />
      
      <Route
        path="/messages"
        element={
          <AdminProtectedRoute>
            <AdminMessages />
          </AdminProtectedRoute>
        }
      />
      
    </Routes>
  );
}

export default AdminApp;