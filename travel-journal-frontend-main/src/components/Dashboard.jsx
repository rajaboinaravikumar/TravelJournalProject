import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { 
  FaCompass, 
  FaUserCircle, 
  FaPlus, 
  FaSearch, 
  FaEdit, 
  FaEye, 
  FaHeart, 
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaImages,
  FaGlobe,
  FaBookOpen,
  FaRoute,
  FaComment
} from "react-icons/fa";
import "./Dashboard.css";
import { useAuth } from "../constext/AuthContext";
import { useJournal } from "../constext/JournalContext";

const Dashboard = () => {
  const navigate = useNavigate();
  const { state: authState } = useAuth();
  const { state: journalState, fetchUserJournals } = useJournal();
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userName = authState.user ? authState.user.firstName : "User";

  // Fetch user's journals when component mounts
  useEffect(() => {
    const loadJournals = async () => {
      try {
        setLoading(true);
        setError(null);
        await fetchUserJournals();
        console.log("Journals after fetch:", journalState.journals);
      } catch (err) {
        setError("Failed to load journals. Please try again later.");
        console.error("Error loading journals:", err);
      } finally {
        setLoading(false);
      }
    };

    if (authState.isAuthenticated) {
      loadJournals();
    }
  }, [authState.isAuthenticated]);

  // Filter journals based on search term
  const filteredJournals = journalState.journals.filter((journal) =>
    journal.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    journal.entry.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (journal.tags && journal.tags.some(tag => 
      tag.toLowerCase().includes(searchTerm.toLowerCase())
    ))
  );

  // Calculate stats
  const stats = {
    totalJournals: journalState.journals.length,
    uniqueLocations: new Set(journalState.journals.map(j => j.location)).size,
    totalPhotos: journalState.journals.reduce((acc, journal) => 
      acc + (journal.images ? journal.images.length : 0), 0
    ),
  };

  // Helper functions
  const getJournalImage = (journal) => {
    if (journal.images && journal.images.length > 0) {
      return journal.images[0].startsWith('http') 
        ? journal.images[0] 
        : `http://localhost:5000/${journal.images[0]}`;
    }
    return "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80";
  };

  const getJournalTitle = (journal) => {
    return journal.title || `Journey to ${journal.location}`;
  };

  const getJournalDescription = (journal) => {
    return journal.entry?.length > 100 
      ? `${journal.entry.substring(0, 100)}...` 
      : journal.entry;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const goToProfile = () => {
    navigate("/Profilepage");
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        {/* Welcome Section */}
        <section className="welcome-section">
          <div className="welcome-content">
            <h1 className="welcome-title">
              Welcome back, <span className="user-name">{userName}</span>!
            </h1>
            <p className="welcome-subtitle">Your personal travel stories</p>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">
                  <FaBookOpen />
                </div>
                <div className="stat-content">
                  <h3>{stats.totalJournals}</h3>
                  <p>Your Journals</p>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">
                  <FaMapMarkerAlt />
                </div>
                <div className="stat-content">
                  <h3>{stats.uniqueLocations}</h3>
                  <p>Places Visited</p>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">
                  <FaImages />
                </div>
                <div className="stat-content">
                  <h3>{stats.totalPhotos}</h3>
                  <p>Photos Shared</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Search Section */}
        <section className="search-section">
          <div className="search-container">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search your journals..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </section>

        {/* Journals Section */}
        <section className="journals-section">
          <div className="section-header">
            <h2>Your Journals</h2>
            <Link to="/create-journal" className="create-journal-btn">
              <FaPlus /> New Journal
            </Link>
          </div>

          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading your journals...</p>
            </div>
          ) : error ? (
            <div className="error-container">
              <p className="error-message">{error}</p>
              <button onClick={() => fetchUserJournals()} className="retry-btn">
                Retry
              </button>
            </div>
          ) : filteredJournals.length === 0 ? (
            <div className="empty-state">
              <FaBookOpen className="empty-icon" />
              <h3>No Journals Yet</h3>
              <p>Start documenting your travels by creating your first journal!</p>
              <Link to="/create-journal" className="create-first-btn">
                Create Your First Journal
              </Link>
            </div>
          ) : (
            <div className="journals-grid">
              {filteredJournals.map((journal) => (
                <div key={journal._id} className="journal-card">
                  <div className="journal-image">
                    <img src={getJournalImage(journal)} alt={journal.location} />
                    <div className="journal-location">
                      <FaMapMarkerAlt />
                      <span>{journal.location}</span>
                    </div>
                  </div>
                  <div className="journal-content">
                    <h3>{getJournalTitle(journal)}</h3>
                    <p>{getJournalDescription(journal)}</p>
                    <div className="journal-meta">
                      <span className="journal-date">
                        <FaCalendarAlt />
                        {formatDate(journal.createdAt)}
                      </span>
                      <div className="journal-stats">
                        <span>
                          <FaHeart />
                          {journal.likes}
                        </span>
                        <span>
                          <FaComment />
                          {journal.comments}
                        </span>
                      </div>
                    </div>
                    <div className="journal-tags">
                      {journal.tags?.map((tag, index) => (
                        <span key={index} className="tag">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="journal-actions">
                    <Link
                      to={`/journal/${journal._id}`}
                      className="view-btn"
                    >
                      <FaEye /> View
                    </Link>
                    <Link
                      to={`/edit-journal/${journal._id}`}
                      className="edit-btn"
                    >
                      <FaEdit /> Edit
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
