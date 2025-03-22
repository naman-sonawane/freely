// src/pages/LandingPage/LandingPage.tsx
import React from 'react';
import Landing from './components/Landing';
import Features from './components/Features';
import NavBar from './components/NavBar';

const LandingPage: React.FC = () => {
  return (
    <div className='w-screen'>
        <NavBar />
        <Landing />
        <Features />
    </div>
  );
};

export default LandingPage;
