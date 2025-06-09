// This script tests the API connection between frontend and backend
import { wardenService, locationService } from './services/api';

// Function to test API endpoints
async function testApiConnection() {
  console.log('Testing API connection...');
  console.log('API URL:', import.meta.env.VITE_API_URL || 'http://localhost:5000/api');
  
  try {
    // Test locations endpoint
    console.log('Testing locations endpoint...');
    const locations = await locationService.getAllLocations();
    console.log('Locations API test successful!', locations);
    
    // Test wardens endpoint
    console.log('Testing wardens endpoint...');
    const wardens = await wardenService.getAllWardens();
    console.log('Wardens API test successful!', wardens);
    
    console.log('All API tests completed successfully!');
    return { success: true, locations, wardens };
  } catch (error) {
    console.error('API connection test failed:', error.message);
    return { success: false, error: error.message };
  }
}

// Export the test function
export default testApiConnection;