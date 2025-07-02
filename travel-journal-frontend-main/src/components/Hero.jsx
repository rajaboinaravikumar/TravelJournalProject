import React from "react";
import { useNavigate } from "react-router-dom";
import { FaCompass, FaPlane, FaCamera, FaMapMarkerAlt, FaImage } from "react-icons/fa";
import "./Hero.css";

function Hero() {
  const navigate = useNavigate();

  const handleCreateJournalClick = () => {
    navigate("/login");
  };

  return (
    <div className="hero-container">
      <div className="hero-background">
        <div className="floating-icons">
          <FaCompass className="floating-icon icon-1" />
          <FaPlane className="floating-icon icon-2" />
          <FaCamera className="floating-icon icon-3" />
        </div>
      </div>
      
      <div className="hero-content">
        <div className="hero-text">
          <h1 className="hero-title single-line-title">
            Capture Your Journey</h1>
            
          <p className="hero-subtitle">
            Create beautiful travel journals, share your adventures, and relive
            your favorite moments with our intuitive journaling platform.
          </p>
          <div className="hero-buttons">
            <button 
              onClick={handleCreateJournalClick} 
              className="btn btn-primary hero-btn primary-btn"
            >
              <FaCompass className="btn-icon" />
              Create New Journal
            </button>
            
          </div>
        </div>
        
        <div className="hero-visual">
          <div className="hero-image-container">
            <div className="hero-image">
              <img 
                src="https://picsum.photos/400/300?random=travel" 
                alt="Travel Adventure"
                className="main-image"
              />
              <div className="image-overlay"></div>
            </div>
            <div className="floating-card card-1">
              <FaMapMarkerAlt className="card-icon" />
              <span>Location Tagging</span>
            </div>
            <div className="floating-card card-2">
              <FaImage className="card-icon" />
              <span>Photo Galleries</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hero; 