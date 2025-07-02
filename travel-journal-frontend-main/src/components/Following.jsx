import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaUser, FaImage, FaCompass, FaHeart, FaUserPlus, FaUserCheck, FaComment } from 'react-icons/fa';
import { useAuth } from '../constext/AuthContext';
import './Following.css';

const serverUrl = "http://localhost:5000";

const Following = () => {
  const [followingUsers, setFollowingUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [followStatus, setFollowStatus] = useState({});
  const gridRef = useRef(null);
  const cardRefs = useRef([]);
  const navigate = useNavigate();
  const { state: authState } = useAuth();
  const [showCommentInput, setShowCommentInput] = useState(null);
  const [commentText, setCommentText] = useState('');
  const currentUserId = JSON.parse(localStorage.getItem('user'))?.id;

  // Fetch following users from the database
  const fetchFollowingUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${serverUrl}/api/users/following`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch following users');
      }

      const data = await response.json();
      console.log('Fetched following users:', data);
      
      // Transform the data to match our component's expected format
      const transformedUsers = data.map(user => ({
        id: user._id || user.id,
        username: user.username || user.email?.split('@')[0] || 'user',
        name: user.firstName || user.name || 'Anonymous User',
        bio: user.bio || 'Travel enthusiast sharing adventures around the world',
        journalCount: user.journalCount || 0,
        followerCount: user.followerCount || 0,
        profileImage: user.profileImage || user.profilePhoto || `https://picsum.photos/id/${Math.floor(Math.random() * 100)}/80/80`,
        isFollowing: true
      }));

      setFollowingUsers(transformedUsers);
      
      // Initialize follow status
      const statusMap = {};
      transformedUsers.forEach(user => {
        statusMap[user.id] = true;
      });
      setFollowStatus(statusMap);
    } catch (err) {
      console.error('Error fetching following users:', err);
      setError(err.message);
      setFollowingUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle follow/unfollow action
  const handleFollowToggle = async (userId, currentStatus) => {
    try {
      const action = currentStatus ? 'unfollow' : 'follow';
      const response = await fetch(`${serverUrl}/api/users/${action}/${userId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to ${action} user`);
      }

      // Update local state
      setFollowStatus(prev => ({
        ...prev,
        [userId]: !currentStatus
      }));

      // If unfollowing, remove from following list
      if (currentStatus) {
        setFollowingUsers(prev => prev.filter(user => user.id !== userId));
      }

      // Update follower count for the user
      setFollowingUsers(prev => prev.map(user => {
        if (user.id === userId) {
          return {
            ...user,
            followerCount: currentStatus ? user.followerCount - 1 : user.followerCount + 1
          };
        }
        return user;
      }));

    } catch (err) {
      console.error(`Error ${currentStatus ? 'unfollowing' : 'following'} user:`, err);
    }
  };

  const handleViewProfile = (username) => {
    navigate(`/user/${username}`);
  };

  useEffect(() => {
    fetchFollowingUsers();
  }, []);

  useEffect(() => {
    const handleMouseMove = (event) => {
      if (!gridRef.current) return;

      const gridRect = gridRef.current.getBoundingClientRect();

      cardRefs.current.forEach((card) => {
        if (card) {
          const cardRect = card.getBoundingClientRect();
          const centerX = cardRect.left + cardRect.width / 2;
          const centerY = cardRect.top + cardRect.height / 2;
          const mouseX = event.clientX - centerX;
          const mouseY = event.clientY - centerY;

          const rotateY = (mouseX / (cardRect.width / 2)) * 10;
          const rotateX = (mouseY / (cardRect.height / 2)) * -10;

          card.style.setProperty('--rotateY', `${rotateY}deg`);
          card.style.setProperty('--rotateX', `${rotateX}deg`);
          card.classList.add('active-tilt');
        }
      });
    };

    const handleMouseLeave = () => {
      cardRefs.current.forEach((card) => {
        if (card) {
          card.style.setProperty('--rotateY', '0deg');
          card.style.setProperty('--rotateX', '0deg');
          card.classList.remove('active-tilt');
        }
      });
    };

    if (gridRef.current) {
      gridRef.current.addEventListener('mousemove', handleMouseMove);
      gridRef.current.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      if (gridRef.current) {
        gridRef.current.removeEventListener('mousemove', handleMouseMove);
        gridRef.current.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [followingUsers]);

  const handleLike = async (journalId) => {
    try {
      const response = await fetch(`${serverUrl}/api/journals/${journalId}/like`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        // Optionally, refetch journals or update the state for this journal
        fetchFollowingUsers(); // or update the specific journal in state
      }
    } catch (err) {
      alert('Failed to like journal');
    }
  };

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
        if (response.ok) {
          setCommentText('');
          setShowCommentInput(null);
          fetchFollowingUsers(); // or update the specific journal in state
        }
      } catch (err) {
        alert('Failed to add comment');
      }
    }
  };

  if (loading) {
    return (
      <div className="container mt-5 text-center loading-spinner">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading followed users...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5 text-center">
        <div className="alert alert-warning" role="alert">
          <h4>Unable to load following list</h4>
          <p>{error}</p>
          <button className="btn btn-primary" onClick={fetchFollowingUsers}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="following-page fade-in">
      <div className="container mt-5 pt-4">
        <h2 className="mb-4 page-title element-load-slide-down">Following</h2>
        
        {followingUsers.length > 0 ? (
          <>
            <div className="row row-cols-1 row-cols-md-3 g-4" ref={gridRef}>
              {followingUsers.map((user, index) => (
                <div key={user.id} className="col user-card-wrapper" ref={(el) => (cardRefs.current[index] = el)}>
                  <div className="card shadow-sm user-card hover-lift">
                    <div className="card-body text-center">
                      <div className="profile-image-container hover-scale">
                        <img
                          src={user.profileImage}
                          alt={user.name}
                          className="rounded-circle profile-image"
                          onClick={() => handleViewProfile(user.username)}
                          style={{ cursor: 'pointer' }}
                        />
                      </div>
                      <h5 
                        className="card-title user-name hover-color-primary"
                        onClick={() => handleViewProfile(user.username)}
                        style={{ cursor: 'pointer' }}
                      >
                        {user.name}
                      </h5>
                      <p className="card-subtitle mb-2 text-muted user-username hover-scale">@{user.username}</p>
                      <p className="card-text small user-bio">{user.bio}</p>
                      <div className="d-flex justify-content-around user-stats element-load-fade-in">
                        <small><FaImage className="me-1" /> <strong className="hover-scale">{user.journalCount}</strong> Journals</small>
                        <small><FaUser className="me-1" /> <strong className="hover-scale">{user.followerCount}</strong> Followers</small>
                      </div>
                      <div className="mt-3 d-flex gap-2">
                        <button 
                          className="btn btn-outline-primary btn-sm view-profile-button hover-shadow hover-translate-y flex-fill"
                          onClick={() => handleViewProfile(user.username)}
                        >
                          View Profile
                        </button>
                        <button 
                          className={`btn btn-sm ${followStatus[user.id] ? 'btn-danger' : 'btn-success'} follow-button hover-shadow hover-translate-y`}
                          onClick={() => handleFollowToggle(user.id, followStatus[user.id])}
                        >
                          {followStatus[user.id] ? (
                            <>
                              <FaUserCheck className="me-1" />
                              Following
                            </>
                          ) : (
                            <>
                              <FaUserPlus className="me-1" />
                              Follow
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-3 load-more-container element-load-slide-up">
              <button className="btn btn-outline-secondary btn-sm load-more-button hover-shadow hover-translate-y">Load More</button>
            </div>
          </>
        ) : (
          <div className="text-center mt-5">
            <FaCompass className="display-1 text-muted mb-3" />
            <h3>Not following anyone yet</h3>
            <p className="text-muted mb-4">
              Start following other travelers to see their stories here!
            </p>
            <Link to="/explore" className="btn btn-primary me-2">
              Explore Stories
            </Link>
            <Link to="/dashboard" className="btn btn-outline-primary">
              Go to Dashboard
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Following;