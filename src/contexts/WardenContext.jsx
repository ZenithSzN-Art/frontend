import { createContext, useState, useContext, useEffect } from 'react';
import { wardenService } from '../services/api';

const WardenContext = createContext();

export const useWardens = () => useContext(WardenContext);

export const WardenProvider = ({ children }) => {
  const [wardens, setWardens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all wardens
  const fetchWardens = async () => {
    try {
      setLoading(true);
      const data = await wardenService.getAllWardens();
      setWardens(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch wardens');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Add a new warden
  const addWarden = async (wardenData) => {
    try {
      setLoading(true);
      await wardenService.addWarden(wardenData);
      await fetchWardens(); // Refresh the list
      return { success: true };
    } catch (err) {
      setError('Failed to add warden');
      console.error(err);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Update a warden
  const updateWarden = async (staffNumber, wardenData) => {
    try {
      setLoading(true);
      await wardenService.updateWarden(staffNumber, wardenData);
      await fetchWardens(); // Refresh the list
      return { success: true };
    } catch (err) {
      setError('Failed to update warden');
      console.error(err);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Delete a warden
  const deleteWarden = async (staffNumber) => {
    try {
      setLoading(true);
      await wardenService.deleteWarden(staffNumber);
      await fetchWardens(); // Refresh the list
      return { success: true };
    } catch (err) {
      setError('Failed to delete warden');
      console.error(err);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Load wardens on initial render
  useEffect(() => {
    fetchWardens();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = {
    wardens,
    loading,
    error,
    fetchWardens,
    addWarden,
    updateWarden,
    deleteWarden
  };

  return (
    <WardenContext.Provider value={value}>
      {children}
    </WardenContext.Provider>
  );
};