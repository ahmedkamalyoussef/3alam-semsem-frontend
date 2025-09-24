import React, { createContext, useContext, useState, useEffect } from 'react';
import apiService from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on app start
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        
        if (token && userData) {
          setUser(JSON.parse(userData));
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        // Clear invalid data
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Login: step 1 (send OTP)
  const login = async (email, password) => {
    try {
      const data = await apiService.loginAdmin(email, password);
      return { success: true, message: data.message };
    } catch (error) {
      return { success: false, error: error.message || 'Login failed' };
    }
  };

  // Login: step 2 (verify OTP and get token)
  const verifyLogin = async (email, otp) => {
    try {
      const data = await apiService.verifyAdminLogin(email, otp);
      const userData = { email, name: email.split('@')[0] };
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      return { success: true, message: data.message };
    } catch (error) {
      return { success: false, error: error.message || 'OTP verification failed' };
    }
  };

  // Registration: step 1 (create admin and send OTP)
  const register = async (email, password, confirmPassword) => {
    try {
      const data = await apiService.registerAdmin(email, password, confirmPassword);
      return { success: true, message: data.message, adminId: data.adminId };
    } catch (error) {
      return { success: false, error: error.message || 'Registration failed' };
    }
  };

  // Registration: step 2 (verify OTP)
  const verifyRegistration = async (email, otp) => {
    try {
      const data = await apiService.verifyAdminRegistration(email, otp);
      return { success: true, message: data.message };
    } catch (error) {
      return { success: false, error: error.message || 'OTP verification failed' };
    }
  };

  // Resend OTP
  const resendOTP = async (email, type) => {
    try {
      const data = await apiService.resendOTP(email, type);
      return { success: true, message: data.message };
    } catch (error) {
      return { success: false, error: error.message || 'Failed to resend OTP' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const value = {
    user,
    login,
    verifyLogin,
    register,
    verifyRegistration,
    resendOTP,
    logout,
    loading,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
