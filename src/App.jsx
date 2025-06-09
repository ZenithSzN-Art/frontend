import './App.css';
import Dashboard from './Components/Dashboard/Dashboard';
import Register from './Components/Register/Register';
import Login from './Components/Login/Login';
import WardenForm from './Components/WardenForm/WardenForm';
import { useState, useEffect } from 'react';
import { useWardens } from './contexts/WardenContext';
import testApiConnection from './test-api';

// Import React router dom
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  Outlet
} from 'react-router-dom';

// Import context providers
import { WardenProvider } from './contexts/WardenContext';
import { LocationProvider } from './contexts/LocationContext';

// Mock authentication service - in a real app this would use JWT tokens, etc.
const useAuth = () => {
  // This is a placeholder. In a real app, you would check localStorage/sessionStorage
  // for a token and validate it, or use a proper auth context.
  const isAuthenticated = sessionStorage.getItem('isAuthenticated') === 'true';
  
  const login = () => {
    sessionStorage.setItem('isAuthenticated', 'true');
    return true;
  };
  
  const logout = () => {
    sessionStorage.removeItem('isAuthenticated');
  };
  
  return { isAuthenticated, login, logout };
};

// Protected route component
const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Outlet /> : <Navigate to="/" replace />;
};

// Layout component that includes the warden form
const DashboardLayout = () => {
  const { addWarden } = useWardens();
  const [showForm, setShowForm] = useState(false);
  
  const handleSubmit = async (formData) => {
    const result = await addWarden(formData);
    if (result.success) {
      setShowForm(false);
    }
  };
  
  return (
    <div className="dashboard-layout">
      <div className="dashboard-header">
        <h1>Fire Warden Management System</h1>
        <button 
          className="add-warden-btn"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : 'Add New Warden'}
        </button>
      </div>
      
      {showForm && (
        <div className="add-warden-form">
          <WardenForm onSubmit={handleSubmit} formType="add" />
        </div>
      )}
      
      <Outlet />
    </div>
  );
};

// Create app router
const router = createBrowserRouter([
  {
    path: '/',
    element: <Login />
  },
  {
    path: '/register',
    element: <Register />
  },
  {
    path: '/dashboard',
    element: <ProtectedRoute />,
    children: [
      {
        path: '',
        element: <DashboardLayout />,
        children: [
          {
            path: '',
            element: <Dashboard />
          }
        ]
      }
    ]
  }
]);

function App() {
  const [apiStatus, setApiStatus] = useState({ tested: false, success: false, message: '' });

  // Test API connection on initial render
  useEffect(() => {
    const testApi = async () => {
      try {
        const result = await testApiConnection();
        setApiStatus({ 
          tested: true, 
          success: result.success, 
          message: result.success 
            ? 'Backend API connection successful!' 
            : `API connection failed: ${result.error}`
        });
      } catch (error) {
        setApiStatus({ 
          tested: true, 
          success: false, 
          message: `API connection failed: ${error.message}`
        });
      }
    };

    testApi();
  }, []);

  return (
    <div className="app">
      <LocationProvider>
        <WardenProvider>
          {apiStatus.tested && !apiStatus.success && (
            <div className="api-error-banner">
              {apiStatus.message}
              <p>Please make sure the backend server is running and correctly configured.</p>
            </div>
          )}
          <RouterProvider router={router} />
        </WardenProvider>
      </LocationProvider>
    </div>
  );
}

export default App;