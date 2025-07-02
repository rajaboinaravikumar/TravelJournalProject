import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaCompass, FaSearch, FaTimes, FaHeart, FaCommentDots, FaUserCircle, FaMapMarkerAlt, FaCalendarAlt, FaGlobe, FaStar, FaComment, FaShareAlt, FaPaperPlane } from 'react-icons/fa';
import { useAuth } from '../constext/AuthContext';
import './Explore.css';

const serverUrl = "http://localhost:5000";

const recentSearchesData = ['Greece', 'Japan', 'Adventure', 'Northern Lights', 'Desert'];
const filterOptions = ['All', 'Adventure', 'Culture', 'Nature'];

function Explore() {
  const [searchTerm, setSearchTerm] = useState('');
  const [recentSearches, setRecentSearches] = useState(recentSearchesData);
  const [activeFilter, setActiveFilter] = useState('All');
  const [journals, setJournals] = useState([]);
  const [filteredJournals, setFilteredJournals] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const { state: authState } = useAuth();
  const [showCommentInput, setShowCommentInput] = useState(null); // journalId or null
  const [commentText, setCommentText] = useState('');
  const [shareId, setShareId] = useState(null);
  const journalsPerPage = 6;
  const totalPages = Math.ceil(filteredJournals.length / journalsPerPage);
  const paginatedJournals = filteredJournals.slice(
    (currentPage - 1) * journalsPerPage,
    currentPage * journalsPerPage
  );

  const currentUserId = JSON.parse(localStorage.getItem('user'))?.id;

  // Fetch all journals from all users
  const fetchAllJournals = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${serverUrl}/api/journals/all`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      setJournals(Array.isArray(data) ? data : []);
    } catch (err) {
      setJournals([]);
    }
    setLoading(false);
  };

  // Filter journals based on search term and active filter
  const filterJournals = () => {
    let filtered = journals;

    // Filter by search term
    if (searchTerm.trim()) {
      filtered = filtered.filter(journal =>
        journal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        journal.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        journal.entry.toLowerCase().includes(searchTerm.toLowerCase()) ||
        journal.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filter by category
    if (activeFilter !== 'All') {
      filtered = filtered.filter(journal =>
        journal.tags.some(tag => tag.toLowerCase().includes(activeFilter.toLowerCase()))
      );
    }

    setFilteredJournals(filtered);
  };

  useEffect(() => {
    fetchAllJournals();
  }, []);

  useEffect(() => {
    filterJournals();
  }, [searchTerm, activeFilter, journals]);

  // Ensure content is visible after component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleSearchChange = (event) => setSearchTerm(event.target.value);

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    if (searchTerm.trim()) {
      setRecentSearches([searchTerm.trim(), ...recentSearches.slice(0, 4)]);
      setSearchTerm('');
    }
  };

  const handleRecentSearchClick = (search) => {
    setSearchTerm(search);
  };

  const handleFilterChange = (filterName) => {
    setActiveFilter(filterName);
  };

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleJournalClick = (journalId) => {
    navigate(`/journal/${journalId}`);
  };

  const handleAuthorClick = (authorId) => {
    navigate(`/user/${authorId}`);
  };

  // Like handler
  const handleLike = async (journalId) => {
    try {
      const response = await fetch(`${serverUrl}/api/journals/${journalId}/like`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to like journal');
      }

      // Create notification for the journal owner
      await fetch(`${serverUrl}/api/notifications`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'like',
          journalId: journalId,
          message: 'liked your journal'
        }),
      });

      fetchAllJournals();
    } catch (err) {
      alert('Failed to like journal');
    }
  };

  // Comment handler
  const handleCommentSubmit = async (journalId) => {
    if (commentText.trim()) {
      try {
        const response = await fetch(`${serverUrl}/api/journals/${journalId}/comment`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ text: commentText }),
        });

        if (!response.ok) {
          throw new Error('Failed to add comment');
        }

        // Create notification for the journal owner
        await fetch(`${serverUrl}/api/notifications`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type: 'comment',
            journalId: journalId,
            message: 'commented on your journal',
            commentText: commentText
          }),
        });

        setCommentText('');
        setShowCommentInput(null);
        fetchAllJournals();
      } catch (err) {
        alert('Failed to add comment');
      }
    }
  };

  // Share handler
  const handleShare = (journalId) => {
    const url = `${window.location.origin}/journal/${journalId}`;
    navigator.clipboard.writeText(url);
    alert('Journal link copied to clipboard!');
    setShareId(null);
  };

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading travel stories...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5 text-center">
        <div className="alert alert-warning" role="alert">
          <h4>Unable to load journals</h4>
          <p>{error}</p>
          <button className="btn btn-primary" onClick={fetchAllJournals}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  console.log('Journals:', journals);

  return (
    <div className={`container mt-4 explore-page ${isLoaded ? 'explore-loaded' : ''}`} style={{ opacity: isLoaded ? 1 : 0 }}>
      {/* Hero Section */}
      <div className="explore-hero">
        <div className="hero-content">
          <h1 className="hero-title">
            <FaCompass className="hero-icon" />
            Discover Travel Stories
          </h1>
          <p className="hero-subtitle">Explore authentic experiences and get inspired for your next adventure</p>
        </div>
      </div>

      {/* Search */}
      <div className={`mb-4 search-container ${isSearchFocused ? 'focused' : ''}`}>
        <form onSubmit={handleSearchSubmit} className="input-group">
          <input
            type="text"
            className="form-control rounded-start search-input"
            placeholder="Search destinations or experiences..."
            value={searchTerm}
            onChange={handleSearchChange}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
          />
          {searchTerm && (
            <button
              type="button"
              className="btn btn-outline-secondary clear-button"
              onClick={() => setSearchTerm('')}
              aria-label="Clear"
            >
              <FaTimes />
            </button>
          )}
          <button type="submit" className="btn btn-primary rounded-end search-button" aria-label="Search">
            <FaSearch />
          </button>
        </form>
        {recentSearches.length > 0 && (
          <div className="mt-2 recent-searches">
            <p className="text-muted mb-1">Recent:</p>
            <div>
              {recentSearches.map((search, index) => (
                <button
                  key={index}
                  className="btn btn-sm btn-outline-secondary me-2 mb-1 recent-search-item"
                  onClick={() => handleRecentSearchClick(search)}
                >
                  {search}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Simple Filters */}
      <div className="mb-4 filters-container">
        {filterOptions.map(filter => (
          <button
            key={filter}
            className={`btn filter-option ${activeFilter === filter ? 'active' : ''}`}
            onClick={() => handleFilterChange(filter)}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Results Count */}
      <div className="mb-3">
        <p className="text-muted">
          {filteredJournals.length} {filteredJournals.length === 1 ? 'story' : 'stories'} found
        </p>
      </div>

      {/* Journals Grid */}
      {Array.isArray(filteredJournals) && filteredJournals.length > 0 ? (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {paginatedJournals.map((journal) => {
            const userId = journal.user?._id || journal.user;
            const authorName = (journal.user && journal.user.firstName && journal.user.firstName.trim())
              ? journal.user.firstName
              : (journal.user && journal.user.email && journal.user.email.split('@')[0])
              ? journal.user.email.split('@')[0]
              : '';

            // Use the first image in the images array, if available
            const imageUrl = journal.images && journal.images[0]
              ? (journal.images[0].startsWith('http') ? journal.images[0] : `${serverUrl}/${journal.images[0]}`)
              : '';
            return (
              <div key={journal._id} className="col">
                <div className="journal-card journal-card-animated">
                  {imageUrl && (
                    <div className="journal-image-container" onClick={() => handleJournalClick(journal._id)}>
                      <img
                        src={imageUrl}
                        className="journal-image"
                        alt={journal.title}
                      />
                    </div>
                  )}
                  <div className="journal-content">
                    {/* Author and Location section */}
                    <div className="d-flex align-items-center justify-content-between mb-2">
                      <div className="journal-meta d-flex align-items-center">
                        <span
                          style={{ cursor: "pointer", display: "flex", alignItems: "center" }}
                          onClick={() => navigate(`/user/${userId}`)}
                          title="View profile"
                        >
                          {journal.user?.profileImage || journal.user?.profilePhoto ? (
                            <img
                              src={journal.user.profileImage || journal.user.profilePhoto}
                              alt={authorName}
                              className="author-avatar"
                              style={{ width: 40, height: 40, borderRadius: "50%", objectFit: "cover", marginRight: 8, border: "2px solid #eaeaea" }}
                            />
                          ) : (
                            <FaUserCircle className="author-avatar-icon" style={{ fontSize: 40, marginRight: 8 }} />
                          )}
                        </span>
                        <span className="author-name" style={{ fontWeight: 600, color: "#4B3DFE", fontSize: "1rem" }}>
                          {authorName}
                        </span>
                      </div>
                      <div className="journal-location" style={{ display: 'flex', alignItems: 'center', background: '#444', color: '#fff', borderRadius: 22, padding: '6px 18px 6px 14px', fontSize: '1rem', boxShadow: '0 2px 8px rgba(80,80,160,0.10)' }}>
                        <FaMapMarkerAlt className="location-icon" style={{ marginRight: 6, fontSize: '1.1em' }} />
                        <span>{journal.location}</span>
                      </div>
                    </div>
                    <h5
                      className="journal-title"
                      onClick={() => handleJournalClick(journal._id)}
                      style={{ fontSize: '1.25rem', fontWeight: 700, color: '#23235b', marginBottom: 8, cursor: 'pointer', textShadow: '0 2px 8px rgba(80,80,160,0.04)' }}
                    >
                      {journal.title.length > 50 ? journal.title.slice(0, 50) + '...' : journal.title}
                    </h5>
                    <div className="journal-description mb-2" style={{ color: '#444', fontSize: '1rem', marginBottom: '0.5rem', minHeight: 40 }}>
                      {journal.entry?.slice(0, 80)}...
                    </div>
                    <div className="journal-stats d-flex justify-content-between align-items-center mt-3 mb-2">
                      <div className="d-flex gap-2">
                        <button className="like-btn-animated" onClick={() => handleLike(journal._id)} style={{ fontWeight: 500 }}>
                          <FaHeart color="#888" />
                          <span className="ms-1">{journal.likes || 0} Likes</span>
                        </button>
                        <button className="comment-btn-animated" onClick={() => setShowCommentInput(journal._id)} style={{ fontWeight: 500 }}>
                          <FaComment color="#4B3DFE" />
                          <span className="ms-1">{journal.comments || 0} Comments</span>
                        </button>
                        <button className="date-btn-animated" disabled style={{ fontWeight: 500 }}>
                          <FaCalendarAlt color="#4B3DFE" />
                          <span className="ms-1">{journal.createdAt ? new Date(journal.createdAt).toLocaleDateString() : ''}</span>
                        </button>
                        <button className="share-btn-animated" onClick={() => handleShare(journal._id)} style={{ fontWeight: 500 }}>
                          <FaShareAlt color="#4B3DFE" /> Share
                        </button>
                      </div>
                    </div>
                    {showCommentInput === journal._id && (
                      <div className="mt-3">
                        <textarea
                          className="form-control"
                          value={commentText}
                          onChange={e => setCommentText(e.target.value)}
                          placeholder="Add a comment..."
                          rows={2}
                        />
                        <div className="d-flex gap-2 mt-2">
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => handleCommentSubmit(journal._id)}
                            disabled={!commentText.trim()}
                          >
                            <FaPaperPlane /> Post
                          </button>
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => setShowCommentInput(null)}
                          >
                            <FaTimes /> Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center mt-5">
          <FaCompass className="display-1 text-muted mb-3" />
          <h3>No stories found</h3>
          <p className="text-muted">
            {searchTerm || activeFilter !== 'All' 
              ? 'Try adjusting your search or filters'
              : 'Be the first to share your travel story!'
            }
          </p>
          {!searchTerm && activeFilter === 'All' && (
            <Link to="/create" className="btn btn-primary">
              Create Your First Journal
            </Link>
          )}
        </div>
      )}

      {/* Pagination */}
      {Array.isArray(filteredJournals) && filteredJournals.length > 0 && (
        <div className="d-flex justify-content-center mt-5">
          <nav>
            <ul className="pagination justify-content-center">
              {[...Array(totalPages)].map((_, idx) => (
                <li key={idx} className={`page-item ${currentPage === idx + 1 ? 'active' : ''}`}>
                  <button className="page-link" onClick={() => setCurrentPage(idx + 1)}>{idx + 1}</button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}
    </div>
  );
}

export default Explore;