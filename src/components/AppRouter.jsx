import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import ProtectedRoute from './ProtectedRoute';
import StoreManagement from './StoreManagement';

const AppRouter = () => {
  const { isAuthenticated, loading } = useAuth();

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

  // Get current path
  const path = window.location.pathname;

  // Handle auth routes
  if (path === '/register') {
    return <Register />;
  }

  if (path === '/login' || !isAuthenticated) {
    return <Login />;
  }

  // Protected routes
  return (
    <ProtectedRoute>
      <StoreManagement />
    </ProtectedRoute>
  );
};

export default AppRouter;
