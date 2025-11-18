import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

// client/src/components/Auth/ProtectedRoute.jsx
// Update the existing component with better role handling

const ProtectedRoute = ({ children, doctorOnly = false }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Redirect if doctor tries to access patient-only routes
  if (doctorOnly && user.role !== 'doctor') {
    return <Navigate to="/" replace />;
  }

  // Redirect if patient tries to access doctor routes without doctorOnly flag
  if (user.role === 'patient' && window.location.pathname.startsWith('/doctor-')) {
    return <Navigate to="/" replace />;
  }

  return children;
};
export default ProtectedRoute;