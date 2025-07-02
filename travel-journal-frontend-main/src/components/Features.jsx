import React from "react";
import { FaMapMarkerAlt, FaImage, FaShareAlt, FaHeart, FaGlobe, FaMobileAlt } from "react-icons/fa";
import "./Features.css";

function Features() {
  const features = [
    {
      icon: FaMapMarkerAlt,
      title: "Location Tagging",
      description: "Tag your exact location and create interactive maps of your journey with precise GPS coordinates.",
      color: "#ff6b6b"
    },
    {
      icon: FaImage,
      title: "Photo Galleries",
      description: "Upload and organize your travel photos in beautiful galleries with automatic sorting and tagging.",
      color: "#4ecdc4"
    },
    {
      icon: FaShareAlt,
      title: "Easy Sharing",
      description: "Share your adventures with friends and family or keep them private with customizable privacy settings.",
      color: "#45b7d1"
    },
    {
      icon: FaHeart,
      title: "Memory Preservation",
      description: "Preserve your precious travel memories with detailed entries, emotions, and personal reflections.",
      color: "#96ceb4"
    },
    {
      icon: FaGlobe,
      title: "Global Community",
      description: "Connect with fellow travelers, discover new destinations, and get inspired by amazing stories.",
      color: "#feca57"
    },
    {
      icon: FaMobileAlt,
      title: "Mobile Friendly",
      description: "Create and update your journals on the go with our responsive mobile-first design.",
      color: "#ff9ff3"
    }
  ];

  return (
    <section className="features-section">
      <div className="features-container">
        <div className="features-header">
          <h2 className="features-title">Everything You Need to Document Your Adventures</h2>
          <p className="features-subtitle">
            Powerful features designed to make your travel journaling experience seamless and enjoyable
          </p>
        </div>
        
        <div className="features-grid">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div 
                key={index} 
                className="feature-card"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="feature-icon-container" style={{ backgroundColor: feature.color }}>
                  <IconComponent className="feature-icon" />
                </div>
                <div className="feature-content">
                  <h3 className="feature-title">{feature.title}</h3>
                  <p className="feature-description">{feature.description}</p>
                </div>
                <div className="feature-hover-effect"></div>
              </div>
            );
          })}
        </div>
        
        <div className="features-cta">
          <div className="cta-content">
            <h3>Ready to Start Your Journey?</h3>
            <p>Join thousands of travelers documenting their adventures</p>
            <button className="cta-button">
              Get Started Today
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Features; 