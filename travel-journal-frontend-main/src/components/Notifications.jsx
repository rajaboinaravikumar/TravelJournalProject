import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaHeart, 
  FaComment, 
  FaBell, 
  FaTimes,
  FaArrowLeft,
  FaUser
} from 'react-icons/fa';
import './Notifications.css';

const serverUrl = "http://localhost:5000";

const Notifications = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await fetch(`${serverUrl}/api/notifications`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch notifications');
      }

      const data = await response.json();
      setNotifications(data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  const handleNotificationClick = (notification) => {
    // Mark notification as read
    markNotificationAsRead(notification._id);
    
    // Navigate to the relevant page
    if (notification.type === 'like' || notification.type === 'comment') {
      navigate(`/journal/${notification.journalId}`);
    }
  };

  const markNotificationAsRead = async (notificationId) => {
    try {
      await fetch(`${serverUrl}/api/notifications/${notificationId}/read`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });
      
      // Update local state
      setNotifications(prev => 
        prev.map(notification => 
          notification._id === notificationId 
            ? { ...notification, read: true }
            : notification
        )
      );
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'like':
        return <FaHeart className="notification-icon like" />;
      case 'comment':
        return <FaComment className="notification-icon comment" />;
      default:
        return <FaBell className="notification-icon" />;
    }
  };

  const getNotificationText = (notification) => {
    switch (notification.type) {
      case 'like':
        return `${notification.senderName} liked your journal "${notification.journalTitle}"`;
      case 'comment':
        return `${notification.senderName} commented on your journal "${notification.journalTitle}"`;
      default:
        return notification.message;
    }
  };

  if (loading) {
    return (
      <div className="notifications-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading notifications...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="notifications-container">
        <div className="error-container">
          <h3>Error Loading Notifications</h3>
          <p>{error}</p>
          <button onClick={fetchNotifications} className="retry-btn">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="notifications-container">
      <div className="notifications-header">
        <button onClick={() => navigate(-1)} className="back-btn">
          <FaArrowLeft /> Back
        </button>
        <h2>Notifications</h2>
      </div>

      <div className="notifications-list">
        {notifications.length === 0 ? (
          <div className="empty-state">
            <FaBell className="empty-icon" />
            <h3>No Notifications</h3>
            <p>You don't have any notifications yet.</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div 
              key={notification._id} 
              className={`notification-item ${notification.read ? 'read' : 'unread'}`}
              onClick={() => handleNotificationClick(notification)}
            >
              <div className="notification-icon-container">
                {getNotificationIcon(notification.type)}
              </div>
              <div className="notification-content">
                <p className="notification-text">{getNotificationText(notification)}</p>
                <span className="notification-time">
                  {new Date(notification.createdAt).toLocaleDateString()}
                </span>
              </div>
              {!notification.read && <div className="unread-indicator" />}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Notifications; 