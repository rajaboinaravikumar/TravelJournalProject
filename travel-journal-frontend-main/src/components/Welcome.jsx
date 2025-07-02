import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function Welcome() {
  const location = useLocation();
  const navigate = useNavigate();  // For navigation
  const userName = location.state ? location.state.name : 'Guest';

  // Handle the click event for "Create Your First Journal" button
  const handleCreateJournalClick = () => {
    navigate('/create');  // Navigate to Create Journal page
  };

  return (
    <div className="container mt-5">
      <div className="row text-center mb-5">
        <div className="col-md-12">
          <h2>Welcome to Travel Journal, {userName}!</h2>
          <p>Your journey of documenting amazing adventures starts here</p>
        </div>
      </div>

      {/* Create Your First Journal Button */}
      <div className="text-center mb-5">
        <button className="btn btn-primary btn-lg" onClick={handleCreateJournalClick}>
          + Create Your First Journal
        </button>
      </div>

      {/* Feature Cards */}
      <div className="row text-center mb-5">
        <div className="col-md-4">
          <div className="card p-4">
            <i className="fas fa-map-marker-alt fa-3x mb-3"></i>
            <h5>Location Tagging</h5>
            <p>Pin your memories to exact locations and create your personal travel map.</p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card p-4">
            <i className="fas fa-camera-retro fa-3x mb-3"></i>
            <h5>Photo Galleries</h5>
            <p>Create beautiful photo collections for each destination you visit.</p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card p-4">
            <i className="fas fa-share-alt fa-3x mb-3"></i>
            <h5>Easy Sharing</h5>
            <p>Share your travel stories with friends and family in one click.</p>
          </div>
        </div>
      </div>

      {/* Quick Start Guide */}
      <div className="row text-center">
        <div className="col-md-12">
          <h4>Quick Start Guide</h4>
        </div>
        <div className="col-md-4">
          <p><strong>1</strong> Click on "Create Your First Journal" to start a new travel diary</p>
        </div>
        <div className="col-md-4">
          <p><strong>2</strong> Add your destination, dates, and upload your favorite photos</p>
        </div>
        <div className="col-md-4">
          <p><strong>3</strong> Write your memories and share them with your loved ones</p>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center mt-5">
        <p>© 2025 Travel Journal. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Welcome;
