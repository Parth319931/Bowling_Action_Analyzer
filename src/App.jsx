import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import KinogramAnalysis from './components/KinogramAnalysis';
import VideoDemo from './components/VideoDemo';
import Reports from './components/Reports';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <KinogramAnalysis />
      <VideoDemo />
      <Reports />
      <Footer />
    </div>
  );
}

export default App;