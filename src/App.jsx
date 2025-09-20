import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './contexts/AuthContext';
import AppRouter from './components/AppRouter';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <AppRouter />
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar rtl newestOnTop closeOnClick pauseOnFocusLoss draggable pauseOnHover />
    </AuthProvider>
  );
}

export default App;
