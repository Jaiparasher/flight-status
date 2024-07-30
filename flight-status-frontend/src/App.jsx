import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';  // For displaying notifications
import 'react-toastify/dist/ReactToastify.css';  // Import Toastify CSS

import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignUpPage';
import Homepage from './pages/HomePage';
import useAuth from './hooks/useAuth';
import { requestPermission, onMessageListener } from './services/firebaseService';  // Ensure this function is properly implemented
import { disconnectSocket, initializeSocket } from './services/SocketService';

const App = () => {
  const { user, loading } = useAuth();
  
    useEffect(() => {
      const initializeFirebase = async () => {
        try {
          await requestPermission();
          onMessageListener().then((payload) => {
            console.log('Foreground notification received:', payload);
            // Handle notification display or other actions here
          });
        } catch (error) {
          console.error('Error initializing Firebase:', error);
        }
      };
  
      initializeFirebase();
  
      if (user) {
        initializeSocket();
      } else {
        disconnectSocket(); // Clean up if user logs out
      }
  
      return () => {
        disconnectSocket(); // Clean up on component unmount
      };
    }, [user]);
  

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={ <SignupPage />} />
        <Route path="/" element={<Homepage /> } />
      </Routes>
      <ToastContainer />
    </Router>
  );
};

export default App;
