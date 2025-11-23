import React, { useState } from 'react';
import { Link } from 'react-router-dom'; 
import './Homepage.css';
import WaveBg from '../images/images/wavebg.png';
import SaleBadge from '../images/images/Sale.png';

import DigitalArt1 from '../images/Digital Art/Searching for peace.png'; 
import Painting1 from '../images/Painting/Pag Akbay Series VII by Leti watersong.jpg'; 
import Sculpture1 from '../images/Sculpture/blossom-v-wood-sculpture-by-wouter-van-der-vlugt-1-300x200.png';
import Sketch1 from '../images/Sketch arts/cat portrait.png'; 

//FOR CATEGORIES
import DigitalArt2 from '../images/Digital Art/A_Taste_of_Honey.png'; 
import Handmadedecor2 from '../images/Handmade Decor/dovy_oak_wood_decorative_bird_by_Woodlands_P_2,890.00.png';
import Painting2 from '../images/Painting/Oil_On_Canvas_By_Shan_Arts.jpg'; 
import Sculpture2 from '../images/Sculpture/la-grande-ourse-animal-sculpture-by-eric-valat_7-550x769.png';
import Sketch2 from '../images/Sketch arts/Custom_Portrait_2.png'; 


function Homepage() {
  const [activePage, setActivePage] = useState(1);

  const allCategories = [
    { id: 1, name: "Paintings", image: Painting2 }, 
    { id: 2, name: "Sculpture", image: Sculpture2 }, 
    { id: 3, name: "Digital Art", image: DigitalArt2 },
    { id: 4, name: "Sketches", image: Sketch2 }, 
    { id: 5, name: "Handmade Decor", image: Handmadedecor2 } 
  ];

  const discoveryImages = [
    { src: DigitalArt1, name: "Searching for peace", price: "P1,750" }, 
    { src: Painting1, name: "Pag Akbay Series", price: "P5,500" },
    { src: Sculpture1, name: "Blossom V Wood", price: "P5,954" },
    { src: Sketch1, name: "Cat Portrait", price: "P2,826" },
    { src: DigitalArt2, name: "A Taste of Honey", price: "P7,700" },
    { src: Handmadedecor2, name: "Dovy oak wood", price: "P2,890" }
  ];

  const slideAmount = (activePage - 1) * 280;

  return (
    <div className="homepage">
      <section className="hero" style={{ backgroundImage: `url(${WaveBg})` }}>
        <h1>Shop art, live inspired.</h1>
        <p>
          We connect you directly with a global community of artists, 
          making it simple to find art that truly reflects you. 
          Elevate your home beyond the ordinary by choosing from a curated collection of original artworks and limited editions.
        </p>
        <button className="btn-primary">Shop Now</button>
      </section>

      <section className="quote">
        <p>“Art should comfort the disturbed and disturb the comfortable” - Banksy</p>
      </section>
      
      <section className="art-display">
        <div className="section-title">TOP</div>

        <div className="art-gallery">
          <div className="gallery-column-left">
            <div className="art-frame-large">
              <img src={DigitalArt1} alt="Digital Art" className="art-image-large" />
              
              <div className="art-overlay">
                <div className="art-info">
                  <span>Searching for Peace</span>
                  <span>P1,750</span>
                </div>
                <div className="art-buttons-container">
                  <button className="btn-overlay">ADD TO CART</button>
                  <button className="btn-overlay">BUY</button>
                </div>
              </div>
            </div>
          </div>

          <div className="gallery-column-right">
            <div className="art-frame-small">
              <img src={Painting1} alt="Painting" className="art-image-small" />
              <div className="art-overlay">
                <div className="art-info">
                  <span>Pag Akbay Series</span>
                  <span>P5,500</span>
                </div>
                <div className="art-buttons-container">
                  <button className="btn-overlay">ADD TO CART</button>
                  <button className="btn-overlay">BUY</button>
                </div>
              </div>
            </div>
            <div className="art-frame-small">
              <img src={Sculpture1} alt="Sculpture" className="art-image-small" />
              <div className="art-overlay">
                <div className="art-info">
                  <span>Blossom Wood</span>
                  <span>P5,954</span>
                </div>
                <div className="art-buttons-container">
                  <button className="btn-overlay">ADD TO CART</button>
                  <button className="btn-overlay">BUY</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="promo">
        <div className="promo-title-container">
          <img src={SaleBadge} alt="Sale" className="sale-badge" />
          <div className="section-title">CATEGORIES</div>
        </div>
        
        <div className="promo-content-wrapper"> 
          
          <div className="category-gallery">
            
            <div className="category-carousel-inner" style={{ transform: `translateX(-${slideAmount}px)` }}>
              
              {allCategories.map((category) => (
                <div 
                  className="category-frame" 
                  key={category.id}
                  style={{ backgroundImage: category.image ? `url(${category.image})` : 'none' }}
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
                className={`dot ${activePage === page ? 'active' : ''}`}
                onClick={() => setActivePage(page)}
              />
            ))}
          </div>
          
          <p className="promo-text">
            Grab original artworks now on sale! Premium creations at prices you’ll love.
          </p>
        </div> 
        
      </section>

      <section 
        className="discovery"
    style={{ 
          backgroundImage: `url(${WaveBg}), linear-gradient(to bottom, white, #E49E69)` 
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
                    <button className="btn-discovery-overlay">BUY</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button className="btn-browse-more">Browse More</button>
        </div>
      </section>


    </div>
  );
}

export default Homepage;