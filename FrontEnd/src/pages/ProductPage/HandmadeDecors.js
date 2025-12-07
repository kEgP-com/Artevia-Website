HandMadeDecors.js

import React, { useState, useEffect } from "react";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";
import "../../css/Category.css";
import ProductCard from "../../components/ProductCard";

function HandmadeDecors() {
  // 1. New state to hold the data coming from your database
  const [handmadeDecors, setHandmadeDecors] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedArt, setSelectedArt] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");

  const handleView = (art) => setSelectedArt(art);
  const closeOverlay = () => setSelectedArt(null);

  // 2. Fetch the data when the page loads
  useEffect(() => {
    const fetchDecors = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/products");
        const data = await response.json();

        const validCategories = ["Handmade Decor", "Wood", "Clay", "Fabric", "Paper"];
        const decorOnly = data.filter((item) =>
          validCategories.includes(item.category || "")
        );

        setHandmadeDecors(decorOnly);
        setLoading(false);
      } catch (error) {
        console.error("Oops, something went wrong fetching the decors:", error);
        setLoading(false);
      }
    };

    fetchDecors();
  }, []);

  const getImagePath = (imageUrl) => {
    if (!imageUrl) return "https://via.placeholder.com/300";
    if (imageUrl.startsWith("http")) return imageUrl;
    return `http://127.0.0.1:8000/${imageUrl}`;
  };

  const filteredDecors = handmadeDecors.filter((art) => {
    const name = art.name || "";
    const category = art.category || "";
    const matchesSearch = name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === "All" || category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <Navbar />
      {/* ...rest of your JSX unchanged... */}
    </>
  );
}

export default HandmadeDecors;
