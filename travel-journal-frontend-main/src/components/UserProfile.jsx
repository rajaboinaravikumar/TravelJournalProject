import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  FaUser, 
  FaImage, 
  FaMapMarkerAlt, 
  FaHeart, 
  FaCommentDots, 
  FaCompass, 
  FaFileAlt, 
  FaGlobe, 
  FaCamera, 
  FaCalendarAlt, 
  FaArrowLeft,
  FaTimes,
  FaPaperPlane,
  FaCheck,
  FaUserPlus
} from 'react-icons/fa';
import './UserProfile.css';

const serverUrl = "http://localhost:5000";

const UserProfile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState(null);
  const [journals, setJournals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('journals');
  const [isFollowing, setIsFollowing] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [messageSent, setMessageSent] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch user profile
        const profileResponse = await fetch(`${serverUrl}/api/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (!profileResponse.ok) {
          throw new Error('Failed to fetch user profile');
        }

        const profileData = await profileResponse.json();
        setUserProfile(profileData);

        // Check if current user is following this user
        const currentUser = JSON.parse(localStorage.getItem('user'));
        if (currentUser && currentUser.following) {
          setIsFollowing(currentUser.following.includes(userId));
        }

        // Fetch user's journals
        const journalsResponse = await fetch(`${serverUrl}/api/journals/all`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (!journalsResponse.ok) {
          throw new Error('Failed to fetch journals');
        }

        const journalsData = await journalsResponse.json();
        const userJournals = journalsData.filter(journal => 
          (journal.user && typeof journal.user === 'object' && journal.user._id === userId) ||
          (typeof journal.user === 'string' && journal.user === userId)
        );
        setJournals(userJournals);
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  // Handle follow/unfollow
  const handleFollowToggle = async () => {
    try {
      const action = isFollowing ? 'unfollow' : 'follow';
      const response = await fetch(`${serverUrl}/api/users/${action}/${userId}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to ${action} user`);
      }

      setIsFollowing(!isFollowing);
      
      // Update local storage user data
      const currentUser = JSON.parse(localStorage.getItem('user'));
      if (currentUser) {
        if (isFollowing) {
          currentUser.following = currentUser.following.filter(id => id !== userId);
        } else {
          currentUser.following = [...(currentUser.following || []), userId];
        }
        localStorage.setItem('user', JSON.stringify(currentUser));
      }
    } catch (err) {
      console.error(`Error ${isFollowing ? 'unfollowing' : 'following'} user:`, err);
      alert(`Failed to ${isFollowing ? 'unfollow' : 'follow'} user`);
    }
  };

  // Handle message modal
  const handleMessageClick = () => {
    setShowMessageModal(true);
    setMessageSent(false);
    setMessageText('');
  };

  // Handle message submission
  const handleSendMessage = () => {
    if (messageText.trim()) {
      setMessageSent(true);
      setTimeout(() => {
        setShowMessageModal(false);
        setMessageSent(false);
        setMessageText('');
      }, 2000);
    }
  };

  // Handle modal close
  const handleCloseModal = () => {
    setShowMessageModal(false);
    setMessageSent(false);
    setMessageText('');
  };

  if (loading) {
    return (
      <div className="user-profile-loading">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error || !userProfile) {
    return (
      <div className="user-profile-error">
        <div className="error-container">
          <h2>User Not Found</h2>
          <p>{error}</p>
          <button onClick={() => navigate('/explore')} className="back-btn">
            <FaArrowLeft /> Back to Explore
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="user-profile-page">
      {/* Back Button */}
      <div className="back-button-container">
        <button onClick={() => navigate('/explore')} className="back-btn">
          <FaArrowLeft /> Back to Explore
        </button>
      </div>

      {/* Cover Image */}
      <div className="profile-cover">
        <img src={userProfile.profileImage || userProfile.profilePhoto || 'https://via.placeholder.com/1200x300'} alt="Cover" className="cover-image" />
        <div className="cover-overlay"></div>
      </div>

      {/* Profile Header */}
      <div className="profile-header">
        <div className="container">
          <div className="profile-info">
            <div className="profile-avatar">
              <img src={userProfile.profileImage || userProfile.profilePhoto || 'https://via.placeholder.com/200'} alt={userProfile.firstName || 'User'} />
            </div>
            <div className="profile-details">
              <h1 className="profile-name">{userProfile.firstName || userProfile.email?.split('@')[0]}</h1>
              <p className="profile-username">@{userProfile.email}</p>
              <div className="profile-location">
                <FaMapMarkerAlt /> {userProfile.location || 'No location specified'}
              </div>
              <div className="profile-joined">
                <FaCalendarAlt /> Joined {userProfile.createdAt ? new Date(userProfile.createdAt).toLocaleDateString() : 'N/A'}
              </div>
            </div>
            <div className="profile-actions">
              <button 
                className={`btn ${isFollowing ? 'btn-success' : 'btn-primary'} follow-btn ${isFollowing ? 'following' : ''}`}
                onClick={handleFollowToggle}
              >
                {isFollowing ? (
                  <>
                    <FaUserPlus /> Following
                  </>
                ) : (
                  <>
                    <FaUserPlus /> Follow
                  </>
                )}
              </button>
              <button 
                className="btn btn-outline-secondary message-btn"
                onClick={handleMessageClick}
              >
                Message
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="profile-stats">
            <div className="stat-item">
              <span className="stat-number">{journals.length}</span>
              <span className="stat-label">Posts</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{userProfile.followers?.length || 0}</span>
              <span className="stat-label">Followers</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{userProfile.following?.length || 0}</span>
              <span className="stat-label">Following</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content Tabs */}
      <div className="content-tabs">
        <div className="container">
          <div className="tabs">
            <button 
              className={`tab ${activeTab === 'journals' ? 'active' : ''}`}
              onClick={() => setActiveTab('journals')}
            >
              <FaFileAlt /> Journals
            </button>
            <button 
              className={`tab ${activeTab === 'about' ? 'active' : ''}`}
              onClick={() => setActiveTab('about')}
            >
              <FaUser /> About
            </button>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="content-area">
        <div className="container">
          {activeTab === 'journals' ? (
            <div className="journals-grid">
              {journals.length > 0 ? (
                journals.map(journal => (
                  <div key={journal._id} className="journal-card">
                    <div className="journal-image">
                      <img 
                        src={journal.images && journal.images[0] 
                          ? (journal.images[0].startsWith('http') 
                            ? journal.images[0] 
                            : `${serverUrl}/${journal.images[0]}`)
                          : 'https://via.placeholder.com/400x300?text=No+Image'} 
                        alt={journal.title} 
                      />
                      <div className="journal-location">
                        <FaMapMarkerAlt /> {journal.location}
                      </div>
                    </div>
                    <div className="journal-content">
                      <h3 className="journal-title">{journal.title}</h3>
                      <p className="journal-description">{journal.entry}</p>
                      <div className="journal-tags">
                        {journal.tags && journal.tags.map((tag, index) => (
                          <span key={index} className="tag">{tag}</span>
                        ))}
                      </div>
                      <div className="journal-date">{new Date(journal.createdAt).toLocaleDateString()}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-journals">
                  <FaFileAlt className="no-journals-icon" />
                  <h3>No Journals Yet</h3>
                  <p>This user hasn't shared any travel stories yet.</p>
                </div>
              )}
            </div>
          ) : (
            <div className="about-section">
              <div className="about-card">
                <h3>About {userProfile.firstName || userProfile.email?.split('@')[0]}</h3>
                <p className="bio">{userProfile.bio || 'No bio available'}</p>
                <div className="about-details">
                  <div className="detail-item">
                    <FaGlobe /> <span>Member since {new Date(userProfile.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="detail-item">
                    <FaMapMarkerAlt /> <span>{userProfile.location || 'Location not specified'}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Message Modal */}
      {showMessageModal && (
        <div className="message-modal-overlay" onClick={handleCloseModal}>
          <div className="message-modal" onClick={(e) => e.stopPropagation()}>
            <div className="message-modal-header">
              <h3>Send Message to {userProfile.firstName || userProfile.email}</h3>
              <button className="close-modal-btn" onClick={handleCloseModal}>
                <FaTimes />
              </button>
            </div>
            {!messageSent ? (
              <>
                <div className="message-modal-body">
                  <textarea
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder="Write your message here..."
                    className="message-textarea"
                    rows="4"
                  />
                </div>
                <div className="message-modal-footer">
                  <button 
                    className="send-message-btn"
                    onClick={handleSendMessage}
                    disabled={!messageText.trim()}
                  >
                    <FaPaperPlane /> Send Message
                  </button>
                  <button className="cancel-message-btn" onClick={handleCloseModal}>
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <div className="message-success">
                <FaCheck className="success-icon" />
                <h4>Message Sent!</h4>
                <p>Your message has been sent to {userProfile.firstName || userProfile.email}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;