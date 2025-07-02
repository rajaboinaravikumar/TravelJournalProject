import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Importing useNavigate
import { useJournal } from "../constext/JournalContext";
import "./CreateJournal.css";

function CreateJournal() {
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [photos, setPhotos] = useState([]);
  const [tags, setTags] = useState([]);
  const [journalEntry, setJournalEntry] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate(); // Hook to navigate to different routes
  const { createJournal } = useJournal();

  const handleFileChange = (e) => {
    const files = e.target.files;
    setPhotos([...photos, ...Array.from(files)]);
  };

  const handleTagChange = (e) => {
    const tagString = e.target.value;
    const tagArray = tagString.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
    setTags(tagArray);
  };

  const handlePublish = async () => {
    if (!title.trim() || !location.trim() || !journalEntry.trim()) {
      setError("Please fill in all required fields (Title, Location, and Journal Entry)");
      return;
    }

    setIsLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("location", location);
    formData.append("entry", journalEntry);
    formData.append("tags", tags.join(","));

    photos.forEach((photo) => {
      formData.append("images", photo); // Must match multer field name
    });

    console.log("Submitting journal:", {
      title,
      location,
      entry: journalEntry,
      tags: tags.join(","),
      photosCount: photos.length
    });

    const success = await createJournal(formData);

    if (success) {
      navigate("/journal-published");
    } else {
      setError("Failed to publish journal. Please try again.");
    }
    
    setIsLoading(false);
  };

  return (
    <div className="create-journal-page">
      <div className="create-journal-container">
        <h1 className="create-journal-title">Create Your Travel Journal</h1>
        <p className="create-subtitle">Share your amazing travel experiences with the world</p>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form className="create-journal-form">
          {/* Title */}
          <div className="form-group">
            <label htmlFor="title" className="form-label">
              Journal Title *
            </label>
            <input
              type="text"
              className="form-input"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Give your journal a memorable title..."
              required
            />
          </div>

          {/* Location */}
          <div className="form-group">
            <label htmlFor="location" className="form-label">
              Location *
            </label>
            <input
              type="text"
              className="form-input"
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Where did you go?"
              required
            />
          </div>

          {/* Photos */}
          <div className="form-group">
            <label htmlFor="photos" className="form-label">
              Photos
            </label>
            <div className="file-upload-container">
              <label htmlFor="photos" className="upload-image-label">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 19V5C21 3.9 20.1 3 19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19ZM8.5 13.5L11 16.51L14.5 12L19 18H5L8.5 13.5Z" fill="currentColor"/>
                </svg>
                Choose Photos
              </label>
              <input
                type="file"
                id="photos"
                multiple
                accept="image/*"
                className="form-input"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
            </div>
            
            {photos.length > 0 && (
              <div className="upload-preview">
                {photos.map((photo, index) => (
                  <img
                    key={index}
                    src={URL.createObjectURL(photo)}
                    alt={`preview-${index}`}
                    className="preview-image"
                  />
                ))}
              </div>
            )}
          </div>

          {/* Tags */}
          <div className="form-group">
            <label htmlFor="tags" className="form-label">
              Tags
            </label>
            <input
              type="text"
              className="form-input"
              id="tags"
              value={tags.join(", ")}
              onChange={handleTagChange}
              placeholder="Add tags (comma separated) - e.g., adventure, culture, food"
            />
            <div className="char-counter">
              {tags.length} tags added
            </div>
          </div>

          {/* Journal Entry */}
          <div className="form-group">
            <label htmlFor="journal-entry" className="form-label">
              Journal Entry *
            </label>
            <textarea
              className="form-textarea"
              id="journal-entry"
              rows="8"
              value={journalEntry}
              onChange={(e) => setJournalEntry(e.target.value)}
              placeholder="Write about your journey, experiences, and memories..."
              required
            />
            <div className="char-counter">
              {journalEntry.length} characters
            </div>
          </div>

          {/* Action Buttons */}
          <div className="form-actions">
            <button
              type="button"
              className="create-journal-btn"
              onClick={handlePublish}
              disabled={isLoading}
            >
              {isLoading ? "Publishing..." : "Publish Journal"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateJournal;
