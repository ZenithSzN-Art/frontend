import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWardens } from '../../contexts/WardenContext';
import { authService } from '../../services/authService';
import WardenForm from '../WardenForm/WardenForm';
import './Dashboard.css';

const Dashboard = () => {
  const { wardens, loading, error, updateWarden, deleteWarden } = useWardens();
  const [selectedWarden, setSelectedWarden] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  // Format date for display
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Handle edit button click
  const handleEdit = (warden) => {
    setSelectedWarden(warden);
    setIsEditing(true);
  };

  // Handle delete button click
  const handleDelete = async (staffNumber) => {
    if (window.confirm('Are you sure you want to delete this warden?')) {
      await deleteWarden(staffNumber);
    }
  };

  // Handle form submission for editing
  const handleSubmit = async (formData) => {
    await updateWarden(selectedWarden.staffNumber, formData);
    setIsEditing(false);
    setSelectedWarden(null);
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    setIsEditing(false);
    setSelectedWarden(null);
  };

  // Main dashboard component render
  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="dashboard-title">
          <h1>🔥 Fire Wardens Dashboard</h1>
          <p className="subtitle">Monitor and manage fire warden locations across campus</p>
        </div>
      </div>
      
      {isEditing ? (
        <div className="edit-form-container">
          <WardenForm 
            warden={selectedWarden} 
            onSubmit={handleSubmit} 
            formType="edit" 
          />
          <button className="cancel-button" onClick={handleCancelEdit}>
            Cancel
          </button>
        </div>
      ) : (
        <>
          {loading ? (
            <div className="loading-spinner">
              <div className="spinner"></div>
            </div>
          ) : error ? (
            <p className="error-message">Error: {error}</p>
          ) : (
            <>
              {wardens.length > 0 && (
                <div className="stats-container">
                  <div className="stat-card">
                    <div className="stat-number">{wardens.length}</div>
                    <div className="stat-label">Total Wardens</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-number">{new Set(wardens.map(w => w.location)).size}</div>
                    <div className="stat-label">Locations Covered</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-number">
                      {wardens.filter(w => {
                        const today = new Date().toDateString();
                        const wardenDate = new Date(w.entryDateTime).toDateString();
                        return today === wardenDate;
                      }).length}
                    </div>
                    <div className="stat-label">Active Today</div>
                  </div>
                </div>
              )}
              <div className="wardens-table-container">
              {wardens.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">🏢</div>
                  <h3>No Fire Wardens Registered</h3>
                  <p>Start by adding your first fire warden to track their campus location.</p>
                </div>
              ) : (
                <table className="wardens-table">
                  <thead>
                    <tr>
                      <th>Staff Number</th>
                      <th>Name</th>
                      <th>Location</th>
                      <th>Last Updated</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {wardens.map((warden) => (
                      <tr key={warden.staffNumber}>
                        <td>{warden.staffNumber}</td>
                        <td>{`${warden.firstName} ${warden.lastName}`}</td>
                        <td>{warden.location}</td>
                        <td>{formatDate(warden.entryDateTime)}</td>
                        <td className="action-buttons">
                          <button 
                            className="edit-button" 
                            onClick={() => handleEdit(warden)}
                          >
                            Edit
                          </button>
                          <button 
                            className="delete-button" 
                            onClick={() => handleDelete(warden.staffNumber)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Dashboard;