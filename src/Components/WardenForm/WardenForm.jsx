import { useState, useEffect } from 'react';
import './WardenForm.css';

const WardenForm = ({ warden, onSubmit, formType }) => {
  const [formData, setFormData] = useState({
    staffNumber: '',
    firstName: '',
    lastName: '',
    location: ''
  });
  const [errors, setErrors] = useState({});

  // List of university locations
  const locations = [
    'Alwyn Hall',
    'Beech Glade',
    'Bowers Building',
    'Burma Road Student Village',
    'Centre for Sport',
    'Chapel',
    'The Cottage',
    'Fred Wheeler Building',
    'Herbert Jarman Building',
    'King Alfred Centre',
    'Martial Rose Library',
    'Medecroft',
    'The Stripe',
    'Business School',
    'West Downs Centre',
    'Not on campus'
  ];

  // If editing, populate form with warden data
  useEffect(() => {
    if (warden && formType === 'edit') {
      setFormData({
        staffNumber: warden.staffNumber || '',
        firstName: warden.firstName || '',
        lastName: warden.lastName || '',
        location: warden.location || ''
      });
    }
  }, [warden, formType]);

  const validate = () => {
    const newErrors = {};
    
    if (!formData.staffNumber.trim()) {
      newErrors.staffNumber = 'Staff number is required';
    }
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    if (!formData.location) {
      newErrors.location = 'Location is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is being edited
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <div className="warden-form-container">
      <h2>{formType === 'add' ? 'Add New Warden' : 'Update Warden'}</h2>
      <form onSubmit={handleSubmit} className="warden-form">
        <div className="form-group">
          <label htmlFor="staffNumber">Staff Number</label>
          <input
            type="text"
            id="staffNumber"
            name="staffNumber"
            value={formData.staffNumber}
            onChange={handleChange}
            disabled={formType === 'edit'} // Disable staff number editing
            className={errors.staffNumber ? 'error' : ''}
          />
          {errors.staffNumber && <span className="error-message">{errors.staffNumber}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="firstName">First Name</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className={errors.firstName ? 'error' : ''}
          />
          {errors.firstName && <span className="error-message">{errors.firstName}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="lastName">Last Name</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className={errors.lastName ? 'error' : ''}
          />
          {errors.lastName && <span className="error-message">{errors.lastName}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="location">Working Location</label>
          <select
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className={errors.location ? 'error' : ''}
          >
            <option value="">Select a location</option>
            {locations.map((location, index) => (
              <option key={index} value={location}>
                {location}
              </option>
            ))}
          </select>
          {errors.location && <span className="error-message">{errors.location}</span>}
        </div>

        <button type="submit" className="submit-button">
          {formType === 'add' ? 'Add Warden' : 'Update Warden'}
        </button>
      </form>
    </div>
  );
};

export default WardenForm;