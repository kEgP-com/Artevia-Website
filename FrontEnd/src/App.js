import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/LoginPage/Login";
import Register from "./pages/LoginPage/Register";
import ForgotPassword from "./pages/LoginPage/ForgotPassword";
import CodeVerification from "./pages/LoginPage/Code_verification";
import CartPage from "./pages/MainPage/CartPage";
import OrderPage from "./pages/MainPage/OrderPage";
import AccountPage from "./pages/MainPage/AccountPage";
import Homepage from "./pages/MainPage/Homepage";
import Sculpture from "./pages/ProductPage/Sculpture";
import DigitalArts from "./pages/ProductPage/DigitalArts";
import Painting from "./pages/ProductPage/Painting";
import Sketch from "./pages/ProductPage/Sketch";
import HandmadeDecors from "./pages/ProductPage/HandmadeDecors";
import ArtPage from "./pages/ProductPage/ArtPageList";

export default function App() {
  return (
    <Routes>
      {/* Auth routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/code-verification" element={<CodeVerification />} />

      {/* Main pages */}
      <Route path="/" element={<Navigate to="/homepage" />} />
      <Route path="/homepage" element={<Homepage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/order" element={<OrderPage />} />
      <Route path="/account" element={<AccountPage />} />

      {/* Product pages */}
      <Route path="/artpage" element={<ArtPage />} />
      <Route path="/sculpture" element={<Sculpture />} />
      <Route path="/digital-arts" element={<DigitalArts />} />
      <Route path="/painting" element={<Painting />} />
      <Route path="/sketch" element={<Sketch />} />
      <Route path="/handmade-decors" element={<HandmadeDecors />} />
    </Routes>
  );
}
