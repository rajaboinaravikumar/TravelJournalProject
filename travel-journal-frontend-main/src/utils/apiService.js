// utils/apiService.js
import axiosInstance from './axiosInstance';

const API_BASE_URL = 'http://localhost:5000/api';

// Journal API Functions
export const journalAPI = {
  // Create a new journal
  createJournal: async (formData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/journals`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create journal');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating journal:', error);
      throw error;
    }
  },

  // Get user's journals
  getUserJournals: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/journals`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch journals');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching journals:', error);
      throw error;
    }
  },

  // Get specific journal by ID
  getJournalById: async (journalId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/journals/${journalId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch journal');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching journal:', error);
      throw error;
    }
  },

  // Delete journal
  deleteJournal: async (journalId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/journals/${journalId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete journal');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error deleting journal:', error);
      throw error;
    }
  },
};

// User API Functions
export const userAPI = {
  // Get user profile
  getUserProfile: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/profile`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch user profile');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  },

  // Update user profile
  updateUserProfile: async (profileData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(profileData),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update user profile');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  },

  // Update profile image
  updateProfileImage: async (imageFile) => {
    try {
      const formData = new FormData();
      formData.append('profileImage', imageFile);

      const response = await fetch(`${API_BASE_URL}/users/profile-image`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update profile image');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error updating profile image:', error);
      throw error;
    }
  },
};

// Auth API Functions
export const authAPI = {
  // Login user
  login: async (email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }
      
      return data;
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  },

  // Register user
  register: async (userData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }
      
      return data;
    } catch (error) {
      console.error('Error during registration:', error);
      throw error;
    }
  },
};

// Generic API helper functions
export const apiHelpers = {
  // Handle API errors
  handleError: (error) => {
    console.error('API Error:', error);
    return {
      success: false,
      message: error.message || 'An error occurred',
      error: error,
    };
  },

  // Create success response
  createSuccessResponse: (data) => {
    return {
      success: true,
      data: data,
    };
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const token = localStorage.getItem('token');
    return !!token;
  },

  // Get auth headers
  getAuthHeaders: () => {
    const token = localStorage.getItem('token');
    return {
      Authorization: `Bearer ${token}`,
    };
  },
};

export default {
  journalAPI,
  userAPI,
  authAPI,
  apiHelpers,
}; 