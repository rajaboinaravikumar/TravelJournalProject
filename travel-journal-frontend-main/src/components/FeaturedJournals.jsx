import React, { useState } from "react";
import { FaHeart, FaEye, FaShareAlt, FaMapMarkerAlt } from "react-icons/fa";
import "./FeaturedJournals.css";

function FeaturedJournals() {
  const [hoveredCard, setHoveredCard] = useState(null);

  const featuredJournals = [
    {
      id: 1,
      title: "Greek Island Hopping",
      author: "Sarah Johnson",
      location: "Santorini, Greece",
      image: "https://picsum.photos/400/300?random=1",
      likes: 1247,
      views: 8923,
      description: "A magical journey through the stunning islands of Greece, from the white-washed buildings of Santorini to the ancient ruins of Rhodes.",
      tags: ["Greece", "Islands", "Culture", "Beach"]
    },
    {
      id: 2,
      title: "Japan in Spring",
      author: "Michael Chen",
      location: "Kyoto, Japan",
      image: "https://picsum.photos/400/300?random=2",
      likes: 2156,
      views: 15678,
      description: "Cherry blossoms, ancient temples, and the perfect blend of tradition and modernity in the heart of Japan.",
      tags: ["Japan", "Cherry Blossoms", "Temples", "Spring"]
    },
    {
      id: 3,
      title: "Peru Adventure",
      author: "Elena Rodriguez",
      location: "Machu Picchu, Peru",
      image: "https://picsum.photos/400/300?random=3",
      likes: 1893,
      views: 12345,
      description: "Hiking the Inca Trail to the lost city of Machu Picchu, exploring ancient ruins and breathtaking mountain landscapes.",
      tags: ["Peru", "Hiking", "Ancient", "Mountains"]
    },
    {
      id: 4,
      title: "Iceland Northern Lights",
      author: "David Wilson",
      location: "Reykjavik, Iceland",
      image: "https://picsum.photos/400/300?random=4",
      likes: 3421,
      views: 23456,
      description: "Chasing the aurora borealis across Iceland's dramatic landscapes, from glaciers to geysers.",
      tags: ["Iceland", "Northern Lights", "Nature", "Winter"]
    },
    {
      id: 5,
      title: "Morocco Desert Trek",
      author: "Aisha Patel",
      location: "Sahara Desert, Morocco",
      image: "https://picsum.photos/400/300?random=5",
      likes: 1678,
      views: 9876,
      description: "A camel trek through the golden dunes of the Sahara, experiencing Berber culture and starlit nights.",
      tags: ["Morocco", "Desert", "Culture", "Adventure"]
    },
    {
      id: 6,
      title: "New Zealand Road Trip",
      author: "James Thompson",
      location: "Queenstown, New Zealand",
      image: "https://picsum.photos/400/300?random=6",
      likes: 2987,
      views: 18765,
      description: "Driving through Middle-earth, from the fjords of Milford Sound to the adventure capital of Queenstown.",
      tags: ["New Zealand", "Road Trip", "Nature", "Adventure"]
    }
  ];

  return (
    <section className="featured-journals-section">
      <div className="journals-container">
        <div className="journals-header">
          <h2 className="journals-title">Featured Travel Journals</h2>
          <p className="journals-subtitle">
            Discover amazing stories from travelers around the world
          </p>
        </div>
        
        <div className="journals-grid">
          {featuredJournals.map((journal, index) => (
            <div
              key={journal.id}
              className={`journal-card ${hoveredCard === journal.id ? 'hovered' : ''}`}
              onMouseEnter={() => setHoveredCard(journal.id)}
              onMouseLeave={() => setHoveredCard(null)}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="journal-image-container">
                <img
                  src={journal.image}
                  alt={journal.title}
                  className="journal-image"
                />
                <div className="journal-overlay">
                  <div className="journal-actions">
                    <button className="action-btn like-btn">
                      <FaHeart />
                      <span>{journal.likes}</span>
                    </button>
                    <button className="action-btn view-btn">
                      <FaEye />
                      <span>{journal.views}</span>
                    </button>
                    <button className="action-btn share-btn">
                      <FaShareAlt />
                    </button>
                  </div>
                </div>
                <div className="journal-location">
                  <FaMapMarkerAlt />
                  <span>{journal.location}</span>
                </div>
              </div>
              
              <div className="journal-content">
                <h3 className="journal-title">{journal.title}</h3>
                <p className="journal-author">by {journal.author}</p>
                <p className="journal-description">{journal.description}</p>
                
                <div className="journal-tags">
                  {journal.tags.map((tag, tagIndex) => (
                    <span key={tagIndex} className="journal-tag">
                      {tag}
                    </span>
                  ))}
                </div>
                
                <button className="read-more-btn">
                  Read Full Story
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="journals-cta">
          <div className="cta-content">
            <h3>Ready to Share Your Story?</h3>
            <p>Join our community of passionate travelers and start documenting your adventures today</p>
            <div className="cta-buttons">
              <button className="cta-primary-btn">
                Create Your Journal
              </button>
              <button className="cta-secondary-btn">
                Explore More Stories
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FeaturedJournals; 