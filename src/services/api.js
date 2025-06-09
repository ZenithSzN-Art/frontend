// API service for making HTTP requests to the backend

// Get API URL from environment variables or use default
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper function to handle API errors
const handleApiError = async (response) => {
  if (!response.ok) {
    let errorMessage;
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || `Error: ${response.status}`;
    } catch (e) {
      errorMessage = `Server error: ${response.status}`;
    }
    throw new Error(errorMessage);
  }
  return response;
};

// Warden API Service
export const wardenService = {
  // Get all wardens
  getAllWardens: async () => {
    try {
      const response = await fetch(`${API_URL}/wardens`);
      await handleApiError(response);
      return await response.json();
    } catch (error) {
      console.error('Error fetching wardens:', error);
      throw error;
    }
  },

  // Get warden by staff number
  getWardenByStaffNumber: async (staffNumber) => {
    try {
      const response = await fetch(`${API_URL}/wardens/${staffNumber}`);
      await handleApiError(response);
      return await response.json();
    } catch (error) {
      console.error(`Error fetching warden ${staffNumber}:`, error);
      throw error;
    }
  },

  // Add new warden
  addWarden: async (wardenData) => {
    try {
      // Convert to location-based model for current schema
      const apiData = {
        staffNumber: wardenData.staffNumber,
        firstName: wardenData.firstName,
        lastName: wardenData.lastName,
        location: wardenData.location || 'Not Specified'
      };
      
      const response = await fetch(`${API_URL}/wardens`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiData),
      });
      
      await handleApiError(response);
      return await response.json();
    } catch (error) {
      console.error('Error adding warden:', error);
      throw error;
    }
  },

  // Update warden
  updateWarden: async (staffNumber, wardenData) => {
    try {
      // Convert to location-based model for current schema
      const apiData = {
        staffNumber: wardenData.staffNumber,
        firstName: wardenData.firstName,
        lastName: wardenData.lastName,
        location: wardenData.location || 'Not Specified'
      };
      
      const response = await fetch(`${API_URL}/wardens/${staffNumber}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiData),
      });
      
      await handleApiError(response);
      return await response.json();
    } catch (error) {
      console.error(`Error updating warden ${staffNumber}:`, error);
      throw error;
    }
  },

  // Delete warden
  deleteWarden: async (staffNumber) => {
    try {
      const response = await fetch(`${API_URL}/wardens/${staffNumber}`, {
        method: 'DELETE',
      });
      
      await handleApiError(response);
      return await response.json();
    } catch (error) {
      console.error(`Error deleting warden ${staffNumber}:`, error);
      throw error;
    }
  }
};

// Location API Service
export const locationService = {
  // Get all locations
  getAllLocations: async () => {
    try {
      const response = await fetch(`${API_URL}/locations`);
      await handleApiError(response);
      return await response.json();
    } catch (error) {
      console.error('Error fetching locations:', error);
      throw error;
    }
  }
};