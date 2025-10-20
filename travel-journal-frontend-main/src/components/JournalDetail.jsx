import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { 
  FaArrowLeft, 
  FaMapMarkerAlt, 
  FaCalendarAlt, 
  FaUser, 
  FaHeart, 
  FaComment, 
  FaShare, 
  FaFacebook, 
  FaTwitter, 
  FaLinkedin,
  FaBookOpen,
  FaTag,
  FaWhatsapp,
  FaTimes,
  FaPaperPlane,
  FaUserPlus,
  FaUserCheck
} from 'react-icons/fa';
import './JournalDetail.css';

function JournalDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [journal, setJournal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState([]);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    const loadJournal = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Use the specific API endpoint to fetch the journal
        const response = await fetch(`http://localhost:5000/api/journals/${id}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          if (response.status === 404) {
            setError('Journal not found');
          } else {
            const errorData = await response.json();
            setError(errorData.error || 'Failed to load journal');
          }
          return;
        }

        const journalData = await response.json();
        setJournal(journalData);
        
        // Check if the current user is following the journal creator
        if (journalData.user && journalData.user._id) {
          const currentUser = JSON.parse(localStorage.getItem('user'));
          if (currentUser && currentUser.following) {
            setIsFollowing(currentUser.following.includes(journalData.user._id));
          }
        }
      } catch (err) {
        console.error('Error loading journal:', err);
        setError('Failed to load journal. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadJournal();
    }
  }, [id]);

  // Function to get a title from the journal entry
  const getJournalTitle = (journal) => {
    if (journal.title) return journal.title;
    // Extract first sentence or first 50 characters as title
    const entry = journal.entry || "";
    const firstSentence = entry.split('.')[0];
    return firstSentence.length > 50 ? firstSentence.substring(0, 50) + '...' : firstSentence;
  };

  // Function to get image URL
  const getJournalImage = (imagePath) => {
    if (!imagePath) return 'https://via.placeholder.com/600x400?text=No+Image';
    // Check if it's already a full URL
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    // Construct the full URL
    return `http://localhost:5000/${imagePath}`;
  };

  // Handle like functionality
  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  // Handle comment functionality
  const handleCommentClick = () => {
    setShowCommentInput(!showCommentInput);
    if (showCommentInput) {
      setCommentText('');
    }
  };

  // Handle comment submission
  const handleCommentSubmit = () => {
    if (commentText.trim()) {
      const newComment = {
        id: Date.now(),
        text: commentText,
        author: 'You',
        timestamp: new Date().toLocaleString()
      };
      setComments([newComment, ...comments]);
      setCommentText('');
      setShowCommentInput(false);
    }
  };

  // Handle share functionality
  const handleShare = (platform) => {
    const journalTitle = getJournalTitle(journal);
    const journalUrl = window.location.href;
    const shareText = `Check out this amazing travel journal: ${journalTitle}`;
    
    let shareUrl = '';
    
    switch (platform) {
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + journalUrl)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(journalUrl)}&quote=${encodeURIComponent(shareText)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(journalUrl)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(journalUrl)}`;
        break;
      default:
        // Copy to clipboard
        navigator.clipboard.writeText(shareText + ' ' + journalUrl);
        alert('Link copied to clipboard!');
        return;
    }
    
    window.open(shareUrl, '_blank', 'width=600,height=400');
    setShowShareOptions(false);
  };

  // Handle follow/unfollow
  const handleFollowToggle = async () => {
    if (!journal || !journal.user) return;

    try {
      const action = isFollowing ? 'unfollow' : 'follow';
      const response = await fetch(`http://localhost:5000/api/users/${action}/${journal.user._id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });
if (!response.ok) {
  if (response.status === 404) {
    setError('Journal not found');
  } else {
    const errorData = await response.json();
    setError(errorData.error || 'Failed to load journal');
  }
  return;
}


      setIsFollowing(!isFollowing);
      
      // Update local storage user data
      const currentUser = JSON.parse(localStorage.getItem('user'));
      if (currentUser) {
        if (isFollowing) {
          currentUser.following = currentUser.following.filter(id => id !== journal.user._id);
        } else {
          currentUser.following = [...(currentUser.following || []), journal.user._id];
        }
        localStorage.setItem('user', JSON.stringify(currentUser));
      }
    } catch (err) {
      console.error(`Error ${isFollowing ? 'unfollowing' : 'following'} user:`, err);
      alert(`Failed to ${isFollowing ? 'unfollow' : 'follow'} user`);
    }
  };

  if (loading) {
    return (
      <div className="journal-detail-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading journal...</p>
        </div>
      </div>
    );
  }

  if (error || !journal) {
    return (
      <div className="journal-detail-container">
        <div className="error-container">
          <h2>Journal Not Found</h2>
          <p>{error || 'The journal you are looking for does not exist.'}</p>
          <button onClick={() => navigate('/dashboard')} className="back-btn">
            <FaArrowLeft /> Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="journal-detail-container">
      {/* Enhanced Back Button */}
      <div className="back-button-container">
        <button onClick={() => navigate('/dashboard')} className="back-btn enhanced-back-btn">
          <FaArrowLeft /> Back to Dashboard
        </button>
      </div>

      {/* Journal Header */}
      <div className="journal-header">
        <div className="journal-header-content">
          <h1 className="journal-title">{getJournalTitle(journal)}</h1>
          <div className="journal-meta">
            <span className="meta-item">
              <FaMapMarkerAlt />
              {journal.location}
            </span>
            <span className="meta-item">
              <FaCalendarAlt />
              {new Date(journal.createdAt).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </span>
          </div>
        </div>
      </div>

      {/* Creator Details Section */}
      {journal && journal.user && (
        <div className="creator-details">
          <div className="creator-info">
            <div className="creator-avatar">
              {journal.user.profileImage || journal.user.profilePhoto ? (
                <img 
                  src={journal.user.profileImage || journal.user.profilePhoto} 
                  alt={journal.user.firstName} 
                />
              ) : (
                <FaUser className="default-avatar" />
              )}
            </div>
            <div className="creator-text">
              <h3 className="creator-name">{journal.user.firstName}</h3>
              <p className="creator-email">@{journal.user.email.split('@')[0]}</p>
            </div>
          </div>
          <button 
            className={`follow-button ${isFollowing ? 'following' : ''}`}
            onClick={handleFollowToggle}
          >
            {isFollowing ? (
              <>
                <FaUserCheck /> Following
              </>
            ) : (
              <>
                <FaUserPlus /> Follow
              </>
            )}
          </button>
        </div>
      )}

      {/* Journal Images */}
      {journal.images && journal.images.length > 0 && (
        <div className="journal-images">
          <div className="images-grid">
            {journal.images.map((image, index) => (
              <div key={index} className="image-container">
                <img 
                  src={getJournalImage(image)} 
                  alt={`Journal image ${index + 1}`} 
                  className="journal-image"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/600x400?text=Image+Not+Found';
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Journal Content */}
      <div className="journal-content">
        <div className="content-section">
          <h2 className="section-title">
            <FaBookOpen /> Journal Entry
          </h2>
          <div className="journal-entry">
            <p>{journal.entry}</p>
          </div>
        </div>

        {/* Tags */}
        {journal.tags && journal.tags.length > 0 && (
          <div className="content-section">
            <h3 className="section-title">
              <FaTag /> Tags
            </h3>
            <div className="tags-container">
              {journal.tags.map((tag, index) => (
                <span key={index} className="tag">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Enhanced Actions */}
        <div className="journal-actions">
          <button 
            className={`action-btn like-btn ${isLiked ? 'liked' : ''}`}
            onClick={handleLike}
          >
            <FaHeart /> {isLiked ? 'Liked' : 'Like'}
          </button>
          <button 
            className="action-btn comment-btn"
            onClick={handleCommentClick}
          >
            <FaComment /> Comment
          </button>
          <button 
            className="action-btn share-btn"
            onClick={() => setShowShareOptions(!showShareOptions)}
          >
            <FaShare /> Share
          </button>
        </div>

        {/* Comment Input */}
        {showCommentInput && (
          <div className="comment-input-container">
            <div className="comment-input-wrapper">
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write your comment..."
                className="comment-textarea"
                rows="3"
              />
              <div className="comment-actions">
                <button 
                  className="comment-submit-btn"
                  onClick={handleCommentSubmit}
                  disabled={!commentText.trim()}
                >
                  <FaPaperPlane /> Post Comment
                </button>
                <button 
                  className="comment-cancel-btn"
                  onClick={() => {
                    setShowCommentInput(false);
                    setCommentText('');
                  }}
                >
                  <FaTimes /> Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Comments Display */}
        {comments.length > 0 && (
          <div className="comments-section">
            <h3 className="section-title">
              <FaComment /> Comments ({comments.length})
            </h3>
            <div className="comments-list">
              {comments.map((comment) => (
                <div key={comment.id} className="comment-item">
                  <div className="comment-header">
                    <span className="comment-author">{comment.author}</span>
                    <span className="comment-timestamp">{comment.timestamp}</span>
                  </div>
                  <p className="comment-text">{comment.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Enhanced Share Options */}
        {showShareOptions && (
          <div className="share-options-overlay" onClick={() => setShowShareOptions(false)}>
            <div className="share-options-modal" onClick={(e) => e.stopPropagation()}>
              <div className="share-options-header">
                <h3>Share this Journal</h3>
                <button 
                  className="close-share-btn"
                  onClick={() => setShowShareOptions(false)}
                >
                  <FaTimes />
                </button>
              </div>
              <div className="share-options-grid">
                <button 
                  className="share-option whatsapp"
                  onClick={() => handleShare('whatsapp')}
                >
                  <FaWhatsapp />
                  <span>WhatsApp</span>
                </button>
                <button 
                  className="share-option facebook"
                  onClick={() => handleShare('facebook')}
                >
                  <FaFacebook />
                  <span>Facebook</span>
                </button>
                <button 
                  className="share-option twitter"
                  onClick={() => handleShare('twitter')}
                >
                  <FaTwitter />
                  <span>Twitter</span>
                </button>
                <button 
                  className="share-option linkedin"
                  onClick={() => handleShare('linkedin')}
                >
                  <FaLinkedin />
                  <span>LinkedIn</span>
                </button>
                <button 
                  className="share-option copy"
                  onClick={() => handleShare('copy')}
                >
                  <FaShare />
                  <span>Copy Link</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default JournalDetail;
