import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';  // Relative from components/ to contexts/

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div 
        style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh' 
        }} 
        aria-hidden="true"  // Screen readers chill during load
      >
        <div style={{ border: '4px solid #f3f3f3', borderTop: '4px solid #3498db', borderRadius: '50%', width: '40px', height: '40px', animation: 'spin 1s linear infinite' }}></div>
        {/* TODO: Swap for <Spinner /> component when UI lib added */}
      </div>
    ); // Simple spinner placeholder
  }

  return user ? children : <Navigate to="/login" replace />;
}

export default ProtectedRoute;
