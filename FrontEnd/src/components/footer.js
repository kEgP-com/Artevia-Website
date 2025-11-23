import React from 'react';
import './Compo.css';

import TwitterIcon from '../images/images/twitter.png';
import InstagramIcon from '../images/images/instagram.png';
import FacebookIcon from '../images/images/facebook.png';
import QrCode from '../images/images/qrcode.png';

function Footer() {
  return (
    <>
      <footer id="footer-section" className="footer"> {/* 👈 Added ID here */}
        <div className="footer-section">
          <h4>Download App</h4>
          <img src={QrCode} alt="QR Code" className="qr-code" />
        </div>

        <div className="footer-section">
          <h4>About us</h4>
          <p>
            Launched to support artists worldwide, our platform was created to make 
            discovering and owning art easy, secure, and inspiring. By connecting 
            creators with customers, we offer a seamless way to shop original pieces 
            with confidence and convenience.
          </p>
        </div>

        <div className="footer-section">
          <h4>Follow us</h4>
          <div className="social-link">
            <img src={TwitterIcon} alt="Twitter" />
            <span>Twitter</span>
          </div>
          <div className="social-link">
            <img src={InstagramIcon} alt="Instagram" />
            <span>Instagram</span>
          </div>
          <div className="social-link">
            <img src={FacebookIcon} alt="Facebook" />
            <span>Facebook</span>
          </div>
        </div>

        <div className="footer-section">
          <h4>Contacts</h4>
          <p>
            Katapatan Mutual Homes, Brgy. Banay-Banay, City of Cabuyao,<br />
            Laguna, Philippines 4025
          </p>
          <p>(63) 912 333 3333</p>
          <p>info@Appdev.com</p>
        </div>
      </footer>

      <div className="footer-bottom">
        © 2025 Appdev | All Rights Reserved
      </div>
    </>
  );
}

export default Footer;
