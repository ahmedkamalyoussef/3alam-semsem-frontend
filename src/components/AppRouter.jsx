import React, { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import ProtectedRoute from './ProtectedRoute';
import StoreManagement from './StoreManagement';

const AppRouter = () => {
  const { isAuthenticated, loading } = useAuth();

  // Get current path
  const path = window.location.pathname;

  // Redirect authenticated users away from auth pages
  useEffect(() => {
    if (!loading && isAuthenticated && (path === '/login' || path === '/register')) {
      window.location.href = '/dashboard';
    }
  }, [isAuthenticated, loading, path]);

  // Redirect root path to dashboard for authenticated users
  useEffect(() => {
    if (!loading && isAuthenticated && path === '/') {
      window.location.href = '/dashboard';
    }
  }, [isAuthenticated, loading, path]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  // If user is authenticated, show protected content
  if (isAuthenticated) {
    // Handle dashboard route specifically
    if (path === '/dashboard' || path === '/') {
      return (
        <ProtectedRoute>
          <StoreManagement />
        </ProtectedRoute>
      );
    }
    
    // For any other authenticated route, show the main app
    return (
      <ProtectedRoute>
        <StoreManagement />
      </ProtectedRoute>
    );
  }

  // Handle auth routes for non-authenticated users
  if (path === '/register') {
    return <Register />;
  }

  // Default to login for non-authenticated users
  return <Login />;
};

export default AppRouter;
