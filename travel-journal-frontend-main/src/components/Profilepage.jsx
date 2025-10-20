import React, { useState, useEffect } from "react";
import "./ProfilePage.css";
import {
  FaUserCircle,
  FaCog,
  FaBell,
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaCompass,
  FaSignOutAlt,
  FaCamera,
  FaEdit,
  FaSave,
  FaEye,
  FaEyeSlash,
  FaGlobe,
  FaUsers,
  FaLock,
  FaCheckCircle,
  FaBookOpen,
  FaEnvelope,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../constext/AuthContext.tsx";
//import Notification from "./Notification";
import Explore from "./Explore";

const serverUrl = "http://localhost:5000";

// Default profile photo URL
const DEFAULT_PROFILE_IMAGE =
  "https://via.placeholder.com/80/CCCCCC/FFFFFF?Text=User";

const Profilepage = () => {
  const { state, logout, updateProfileImage } = useAuth();
  const navigate = useNavigate();
  const [followingCount, setFollowingCount] = useState(0);
  
  // Debug useEffect to monitor user state changes
  useEffect(() => {
    console.log('Profile page - User state changed:', state.user);
    console.log('Profile page - Profile image:', state.user?.profileImage);
    console.log('Profile page - Profile photo:', state.user?.profilePhoto);
  }, [state.user]);

  // Fetch following count
  useEffect(() => {
    const fetchFollowingCount = async () => {
      try {
        const response = await fetch(`${serverUrl}/api/users/following`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch following users');
        }

        const data = await response.json();
        setFollowingCount(data.length);
      } catch (err) {
        console.error('Error fetching following count:', err);
      }
    };

    fetchFollowingCount();
  }, []);
  
  // Get the current profile image from state, with fallback to default
  const getCurrentProfileImage = () => {
    const imageUrl = state.user?.profileImage || state.user?.profilePhoto || DEFAULT_PROFILE_IMAGE;
    console.log('Current profile image URL:', imageUrl);
    console.log('User state:', state.user);
    return imageUrl;
  };

  const userData = {
    profileImage: getCurrentProfileImage(),
    name: state.user?.firstName || "John Doe",
    bio: "Passionate traveler exploring the world one destination at a time. Love photography and documenting life.",
    email: state.user?.email || "sarah.connor@email.com",
    journalVisibility: "Public",
    profileVisibility: "Everyone",
    connectedAccounts: {
      facebook: "connected",
      instagram: "connect",
      twitter: "connect",
    },
  };

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [journalVisibility, setJournalVisibility] = useState(userData.journalVisibility);
  const [profileVisibility, setProfileVisibility] = useState(userData.profileVisibility);
  const [connectedAccounts, setConnectedAccounts] = useState(userData.connectedAccounts);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isImageUploading, setIsImageUploading] = useState(false);

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    if (name === "currentPassword") {
      setCurrentPassword(value);
    } else if (name === "newPassword") {
      setNewPassword(value);
    }
  };

  const handleVisibilityChange = (e) => {
    const { name, value } = e.target;
    if (name === "journalVisibility") {
      setJournalVisibility(value);
    } else if (name === "profileVisibility") {
      setProfileVisibility(value);
    }
  };

  const handleConnectAccount = (platform) => {
    setConnectedAccounts((prev) => ({
      ...prev,
      [platform]: prev[platform] === "connect" ? "disconnect" : "connect",
    }));
    console.log(
      `${platform} ${
        connectedAccounts[platform] === "connect" ? "connected" : "disconnected"
      }`
    );
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      
      console.log("Saving changes:", {
        currentPassword,
        newPassword,
        journalVisibility,
        profileVisibility,
        connectedAccounts,
      });
    } catch (error) {
      console.error("Error saving changes:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setIsImageUploading(true);
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target.result;
        // Update AuthContext (this will also update localStorage)
        updateProfileImage(imageUrl);
        setIsImageUploading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getVisibilityIcon = (visibility) => {
    switch (visibility) {
      case "Public":
      case "Everyone":
        return <FaGlobe />;
      case "Followers":
        return <FaUsers />;
      case "Private":
      case "Only Me":
        return <FaLock />;
      default:
        return <FaGlobe />;
    }
  };

  const handleShowPeople = (type) => {
    if (type === "following") {
      navigate("/following");
    }
  };

  const [notif, setNotif] = useState(null);

  const showNotification = (msg, type = "info") => {
    setNotif({ message: msg, type });
  };

  return (
    <div className="profile-page-container">
      {/* Header */}
      
       

      <div className="profile-sidebar">
        <div className="sidebar-header">
          <FaCompass className="app-icon" />
          <h3>Travel Journal</h3>
        </div>
        
        <nav className="sidebar-nav">
          <div className="nav-item active">
            <FaUserCircle className="nav-icon" />
            <span>Profile</span>
            
          </div>
         
        </nav>
        
        <button className="logout-btn" onClick={handleLogout}>
          <FaSignOutAlt />
          <span>Logout</span>
        </button>
      </div>

      <div className="profile-main-content">
        <div className="profile-header">
          <h1>Profile Settings</h1>
          <p>Manage your account and privacy preferences</p>
        </div>

        <div className="profile-sections">
          {/* Profile Details Section */}
          <section className="profile-section">
            <div className="section-header">
              <FaUserCircle className="section-icon" />
              <h2>Profile Details</h2>
            </div>
            
            <div className="profile-info-card">
              <div className="profile-image-section">
                <div className="profile-image-container">
                  <img 
                    src={state.user?.profileImage || DEFAULT_PROFILE_IMAGE}
                    alt="Profile" 
                    className={`profile-image ${isImageUploading ? 'uploading' : ''}`}
                  />
                  {isImageUploading && (
                    <div className="upload-overlay">
                      <div className="upload-spinner"></div>
                    </div>
                  )}
                  <label htmlFor="upload-photo" className="change-photo-btn">
                    <FaCamera />
                  </label>
                  <input
                    type="file"
                    id="upload-photo"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ display: "none" }}
                  />
                </div>
                
                <div className="profile-details-section">
                  <h3 className="profile-username">{userData.name}</h3>
                  <p className="profile-bio">{userData.bio}</p>
                  <p className="profile-email"><FaEnvelope /> {userData.email}</p>
                  <div className="profile-stats">
                    <div className="stat" onClick={() => handleShowPeople("following")} style={{ cursor: "pointer" }}>
                      <span className="stat-number">{followingCount}</span>
                      <span className="stat-label">Following</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Account Settings Section */}
          <section className="profile-section">
            <div className="section-header">
              <FaCog className="section-icon" />
              <h2>Account Settings</h2>
            </div>
            
            <div className="settings-card">
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <div className="input-container">
                  <input
                    type="email"
                    id="email"
                    value={userData.email}
                    readOnly
                    className="form-input readonly"
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="currentPassword">Current Password</label>
                <div className="input-container">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    id="currentPassword"
                    name="currentPassword"
                    value={currentPassword}
                    onChange={handlePasswordChange}
                    className="form-input"
                    placeholder="Enter current password"
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="newPassword">New Password</label>
                <div className="input-container">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    id="newPassword"
                    name="newPassword"
                    value={newPassword}
                    onChange={handlePasswordChange}
                    className="form-input"
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Privacy Settings Section */}
          <section className="profile-section">
            <div className="section-header">
              <FaLock className="section-icon" />
              <h2>Privacy Settings</h2>
            </div>
            
            <div className="settings-card">
              <div className="form-group">
                <label htmlFor="journalVisibility">
                  <FaGlobe className="setting-icon" />
                  Journal Visibility
                </label>
                <div className="select-container">
                  <select
                    id="journalVisibility"
                    name="journalVisibility"
                    value={journalVisibility}
                    onChange={handleVisibilityChange}
                    className="form-select"
                  >
                    <option value="Public">Public</option>
                    <option value="Private">Private</option>
                    <option value="Followers">Followers</option>
                  </select>
                  <div className="select-icon">
                    {getVisibilityIcon(journalVisibility)}
                  </div>
                </div>
                <small className="form-help">
                  Control who can see your travel journals.
                </small>
              </div>
              
              <div className="form-group">
                <label htmlFor="profileVisibility">
                  <FaUsers className="setting-icon" />
                  Profile Visibility
                </label>
                <div className="select-container">
                  <select
                    id="profileVisibility"
                    name="profileVisibility"
                    value={profileVisibility}
                    onChange={handleVisibilityChange}
                    className="form-select"
                  >
                    <option value="Everyone">Everyone</option>
                    <option value="Followers">Followers</option>
                    <option value="Only Me">Only Me</option>
                  </select>
                  <div className="select-icon">
                    {getVisibilityIcon(profileVisibility)}
                  </div>
                </div>
                <small className="form-help">
                  Control who can see your profile.
                </small>
              </div>
            </div>
          </section>

          {/* Save Changes Button */}
          <div className="profile-actions">
            <button 
              className={`save-btn ${isSaving ? 'saving' : ''} ${saveSuccess ? 'success' : ''}`}
              onClick={handleSaveChanges}
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <div className="save-spinner"></div>
                  Saving...
                </>
              ) : saveSuccess ? (
                <>
                  <FaCheckCircle />
                  Saved Successfully!
                </>
              ) : (
                <>
                  <FaSave />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      </div>

     

     
    </div>
  );
};

export default Profilepage;
