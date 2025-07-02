import React from 'react';
import { useNavigate } from 'react-router-dom';

function JournalPublished() {
  const navigate = useNavigate();

  // This function will be used to navigate to the journal detail page
  const handleViewJournal = () => {
    // For now, assuming a dummy journal ID. You can replace it with actual dynamic data.
    const journalId = 1; // You can dynamically fetch this ID from the journal data.
    navigate(`/journal/${journalId}`);
  };

  return (
    <div className="container mt-5 text-center">
      <div className="col-md-6 mx-auto">
        <div className="alert alert-success" role="alert">
          <h4 className="alert-heading">Journal Published Successfully!</h4>
          <p>Your travel journal is now visible to the public. You can now share your amazing experiences with friends and fellow travelers.</p>
        </div>
        <div className="my-4">
          <button className="btn btn-success mx-2" onClick={handleViewJournal}>View Journal</button>
          <button className="btn btn-primary mx-2" onClick={() => navigate('/dashboard')}>Go to Dashboard</button>
          <button className="btn btn-secondary mx-2" onClick={() => navigate('/create')}>Create New Journal</button>
        </div>
        {/* Removed the 10 second redirection */}
      </div>
    </div>
  );
}

export default JournalPublished;
