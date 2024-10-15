import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/auth/check-auth', {
          method: 'GET',
          credentials: 'include', // Include session cookie
        });
        const data = await response.json();
        setIsAuthenticated(data.isAuthenticated);
      } catch (error) {
        console.error('Error checking authentication:', error);
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  if (isAuthenticated === null) {
    // Loading state, can be a spinner or nothing
    return <div>Loading...</div>;
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/Login" />;
};

export default ProtectedRoute;
