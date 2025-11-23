import React, { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";
import "../../css/Homepage.css";
import WaveBg from "../../images/images/wavebg.png";
import SaleBadge from "../../images/images/Sale.png";
// Import a few main images manually for the top sections
import DigitalArt1 from "../../images/Digital Art/Searching for peace.png";
import Painting1 from "../../images/Painting/Pag Akbay Series VII by Leti watersong.jpg";
import Sculpture1 from "../../images/Sculpture/blossom-v-wood-sculpture-by-wouter-van-der-vlugt-1-300x200.png";
import Sketch1 from "../../images/Sketch arts/cat portrait.png";
import DigitalArt2 from "../../images/Digital Art/A_Taste_of_Honey.png";
import Handmadedecor2 from "../../images/Handmade Decor/dovy_oak.png";
import Painting2 from "../../images/Painting/Oil_On_Canvas_By_Shan_Arts.jpg";
import Sculpture2 from "../../images/Sculpture/la-grande-ourse-animal-sculpture-by-eric-valat_7-550x769.png";
import Sketch2 from "../../images/Sketch arts/Custom_Portrait_2.png";

//Import 12345.
import digitalArts from "../../data/DigitalArts.json";
import handmadeDecors from "../../data/HandmadeDecors.json";
import paintings from "../../data/Painting.json";
import sculptures from "../../data/Sculpture.json";
import sketches from "../../data/IllustrationSketch.json";

function Homepage() {
  const [activePage, setActivePage] = useState(1);
  const [selectedArt, setSelectedArt] = useState(null);

  const allCategories = [
    { id: 1, name: "Paintings", image: Painting2 },
    { id: 2, name: "Sculpture", image: Sculpture2 },
    { id: 3, name: "Digital Art", image: DigitalArt2 },
    { id: 4, name: "Sketches", image: Sketch2 },
    { id: 5, name: "Handmade Decor", image: Handmadedecor2 },
  ];

  const discoveryImages = [
    { src: DigitalArt1, name: "Searching for peace", price: "₱1,750", category: "Digital Art" },
    { src: Painting1, name: "Pag Akbay Series", price: "₱5,500", category: "Painting" },
    { src: Sculpture1, name: "Blossom V Wood", price: "₱5,954", category: "Sculpture" },
    { src: Sketch1, name: "Cat Portrait", price: "₱2,826", category: "Sketch" },
    { src: DigitalArt2, name: "A Taste of Honey", price: "₱7,700", category: "Digital Art" },
    { src: Handmadedecor2, name: "Dovy Oak Wood", price: "₱2,890", category: "Handmade Decor" },
  ];

  const slideAmount = (activePage - 1) * 280;

  //  Helper — find the artwork details by name
  const getArtDetails = (name) => {
    const allArtData = [...digitalArts, ...handmadeDecors, ...paintings, ...sculptures, ...sketches];
    return allArtData.find((art) => art.name.toLowerCase().includes(name.toLowerCase()));
  };


  const handleView = (name) => {
    const artData = getArtDetails(name);
    if (artData) setSelectedArt(artData);
  };

  const closeOverlay = () => setSelectedArt(null);


  const getImagePath = (relativePath) => {
    try {
      // remove leading ../../images/ if present
      const cleanPath = relativePath.replace(/^(\.\.\/)+images\//, "");
      return require(`../../images/${cleanPath}`);
    } catch (err) {
      console.warn("Image not found:", relativePath);
      return "";
    }
  };

  return (
    <>
      <Navbar />

      <div className="homepage">
        {/* ==== HERO SECTION ==== */}
        <section className="hero" style={{ backgroundImage: `url(${WaveBg})` }}>
          <h1>Shop art, live inspired.</h1>
          <p>
            We connect you directly with a global community of artists, making it simple
            to find art that truly reflects you.
          </p>
          <button className="btn-primary">Shop Now</button>
        </section>

        {/* ==== QUOTE ==== */}
        <section className="quote">
          <p>“Art should comfort the disturbed and disturb the comfortable.” – Banksy</p>
        </section>

        {/* ==== ART DISPLAY ==== */}
        <section className="art-display">
          <div className="section-title">TOP</div>
          <div className="art-gallery">
            <div className="gallery-column-left">
              <div className="art-frame-large">
                <img src={DigitalArt1} alt="Digital Art" className="art-image-large" />
                <div className="art-overlay">
                  <div className="art-info">
                    <span>Searching for Peace</span>
                    <span>₱1,750</span>
                  </div>
                  <div className="art-buttons-container">
                    <button className="btn-overlay">ADD TO CART</button>
                    <button className="btn-overlay" onClick={() => handleView("Searching for peace")}>
                      VIEW
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="gallery-column-right">
              {[Painting1, Sculpture1].map((img, i) => {
                const names = ["Pag Akbay Series", "Blossom V Wood"];
                const prices = ["₱5,500", "₱5,954"];
                return (
                  <div className="art-frame-small" key={i}>
                    <img src={img} alt={names[i]} className="art-image-small" />
                    <div className="art-overlay">
                      <div className="art-info">
                        <span>{names[i]}</span>
                        <span>{prices[i]}</span>
                      </div>
                      <div className="art-buttons-container">
                        <button className="btn-overlay">ADD TO CART</button>
                        <button className="btn-overlay" onClick={() => handleView(names[i])}>
                          VIEW
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ==== CATEGORIES ==== */}
        <section className="promo">
          <div className="promo-title-container">
            <img src={SaleBadge} alt="Sale" className="sale-badge" />
            <div className="section-title">CATEGORIES</div>
          </div>

          <div className="promo-content-wrapper">
            <div className="category-gallery">
              <div
                className="category-carousel-inner"
                style={{ transform: `translateX(-${slideAmount}px)` }}
              >
                {allCategories.map((category) => (
                  <div
                    className="category-frame"
                    key={category.id}
                    style={{ backgroundImage: `url(${category.image})` }}
                  >
                    <span className="category-name">{category.name}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="pagination-dots">
              {[1, 2, 3].map((page) => (
                <span
                  key={page}
                  className={`dot ${activePage === page ? "active" : ""}`}
                  onClick={() => setActivePage(page)}
                />
              ))}
            </div>
            <p className="promo-text">
              Grab original artworks now on sale! Premium creations at prices you’ll love.
            </p>
          </div>
        </section>

        {/* ==== DISCOVERY ==== */}
        <section
          className="discovery"
          style={{
            backgroundImage: `url(${WaveBg}), linear-gradient(to bottom, white, #E49E69)`,
          }}
        >
          <div className="section-title">DISCOVERY</div>
          <div className="discovery-content-wrapper">
            <div className="discovery-grid">
              {discoveryImages.map((art, index) => (
                <div key={index} className="discovery-frame">
                  <img src={art.src} alt={art.name} />
                  <div className="discovery-overlay">
                    <div className="discovery-info">
                      <span>{art.name}</span>
                      <span>{art.price}</span>
                    </div>
                    <div className="discovery-buttons-container">
                      <button className="btn-discovery-overlay">ADD TO CART</button>
                      <button
                        className="btn-discovery-overlay"
                        onClick={() => handleView(art.name)}
                      >
                        VIEW
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button className="btn-browse-more">Browse More</button>
          </div>
        </section>
      </div>

      <Footer />

      {/* ==== OVERLAY MODAL ==== */}
      {selectedArt && (
        <div className="overlay-backdrop" onClick={closeOverlay}>
          <div className="overlay-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={closeOverlay}>
              ×
            </button>
            <img
              src={getImagePath(selectedArt.imageUrl)}
              alt={selectedArt.name}
              className="overlay-image"
            />
            <h2>{selectedArt.name}</h2>
            <p><strong>{selectedArt.artist}</strong></p>
            <p><em>{selectedArt.category}</em></p>
            <p>{selectedArt.description}</p>
            <h3>₱{selectedArt.price.toLocaleString()}</h3>
          </div>
        </div>
      )}
    </>
  );
}

export default Homepage;
