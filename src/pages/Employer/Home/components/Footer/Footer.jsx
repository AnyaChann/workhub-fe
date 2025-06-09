import React from 'react';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Product</h3>
            <ul>
              <li><a href="#">Job posting</a></li>
              <li><a href="#">Candidate search</a></li>
              <li><a href="#">AI matching</a></li>
              <li><a href="#">Analytics</a></li>
              <li><a href="#">Integrations</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h3>Company</h3>
            <ul>
              <li><a href="#">About us</a></li>
              <li><a href="#">Careers</a></li>
              <li><a href="#">Press</a></li>
              <li><a href="#">Blog</a></li>
              <li><a href="#">Contact</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h3>Resources</h3>
            <ul>
              <li><a href="#">Help center</a></li>
              <li><a href="#">API docs</a></li>
              <li><a href="#">Templates</a></li>
              <li><a href="#">Guides</a></li>
              <li><a href="#">Webinars</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h3>Legal</h3>
            <ul>
              <li><a href="#">Privacy policy</a></li>
              <li><a href="#">Terms of service</a></li>
              <li><a href="#">Cookie policy</a></li>
              <li><a href="#">GDPR</a></li>
              <li><a href="#">Security</a></li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <div className="footer-copyright">
            © {currentYear} WorkHub. All rights reserved.
          </div>
          <div className="footer-social">
            <a href="#" aria-label="Facebook">📘</a>
            <a href="#" aria-label="Twitter">🐦</a>
            <a href="#" aria-label="LinkedIn">💼</a>
            <a href="#" aria-label="Instagram">📷</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;