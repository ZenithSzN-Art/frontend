import { createContext, useState, useContext, useEffect } from 'react';
import { locationService } from '../services/api';

const LocationContext = createContext();

export const useLocations = () => useContext(LocationContext);

export const LocationProvider = ({ children }) => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all locations
  const fetchLocations = async () => {
    try {
      setLoading(true);
      const data = await locationService.getAllLocations();
      setLocations(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch locations');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Load locations on initial render
  useEffect(() => {
    fetchLocations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = {
    locations,
    loading,
    error,
    fetchLocations
  };

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
};