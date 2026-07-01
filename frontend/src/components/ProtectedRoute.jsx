import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';

/**
 * Route guard component that protects private pages.
 * Redirects unauthenticated users to the Login page while keeping track of their target route.
 */
const ProtectedRoute = ({ children }) => {
  const { token } = useContext(ShopContext);
  const location = useLocation();

  if (!token) {
    // Store the URL the user was trying to access for redirection after login
    sessionStorage.setItem('returnUrl', location.pathname);
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
