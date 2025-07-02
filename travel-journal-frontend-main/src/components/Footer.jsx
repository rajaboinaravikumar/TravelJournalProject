import React from "react";
import { Link } from "react-router-dom";
import { FaCompass, FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaHeart } from "react-icons/fa";
import "./Footer.css";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <div className="footer-brand">
              <FaCompass className="footer-logo" />
              <h3>Travel Journal</h3>
            </div>
            <p className="footer-description">
              Capture your journey, share your story, and preserve your travel memories 
              with our intuitive journaling platform.
            </p>
            <div className="social-links">
              <a href="#" className="social-link">
                <FaFacebook />
              </a>
              <a href="#" className="social-link">
                <FaTwitter />
              </a>
              <a href="#" className="social-link">
                <FaInstagram />
              </a>
              <a href="#" className="social-link">
                <FaLinkedin />
              </a>
            </div>
          </div>
          
          <div className="footer-section">
            <h4>Features</h4>
            <ul className="footer-links">
              <li><Link to="/features">Location Tagging</Link></li>
              <li><Link to="/features">Photo Galleries</Link></li>
              <li><Link to="/features">Easy Sharing</Link></li>
              <li><Link to="/features">Mobile App</Link></li>
              <li><Link to="/features">Privacy Controls</Link></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Community</h4>
            <ul className="footer-links">
              <li><Link to="/explore">Explore Stories</Link></li>
              <li><Link to="/following">Following</Link></li>
              <li><Link to="/community">Travel Groups</Link></li>
              <li><Link to="/events">Events</Link></li>
              <li><Link to="/forum">Forum</Link></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Support</h4>
            <ul className="footer-links">
              <li><Link to="/help">Help Center</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
              <li><Link to="/faq">FAQ</Link></li>
              <li><Link to="/feedback">Feedback</Link></li>
              <li><Link to="/status">System Status</Link></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Company</h4>
            <ul className="footer-links">
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/careers">Careers</Link></li>
              <li><Link to="/press">Press</Link></li>
              <li><Link to="/privacy">Privacy Policy</Link></li>
              <li><Link to="/terms">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p className="copyright">
              © {currentYear} Travel Journal. Made with <FaHeart className="heart-icon" /> by travelers for travelers.
            </p>
            <div className="footer-bottom-links">
              <Link to="/privacy">Privacy</Link>
              <Link to="/terms">Terms</Link>
              <Link to="/cookies">Cookies</Link>
              <Link to="/sitemap">Sitemap</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer; 