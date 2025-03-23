// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage/LandingPage';
import SignUpPage from './pages/Sign Up/SignUp';
import LoginPage from './pages/Log In/LogIn';
import ProfilePage from './pages/Profile/Profile'; // Import the Profile component
import ForYouPage from './pages/ForYouPage/ForYouPage';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/profile" element={<ProfilePage />} /> {/* Add the profile route */}
        <Route path="/fyp" element={<ForYouPage />} />
      </Routes>
    </Router>
  );
}

export default App;
