// src/App.jsx
/**
 * Main App Component
 * ------------------
 * Root component with routing configuration
 * 
 * Routes:
 * - / : Home page
 * - /dashboard : User dashboard
 * - /analysis : Video upload and analysis
 * - /results/:id : Analysis results
 * - /history : Analysis history
 * 
 * Providers:
 * - ThemeProvider: Global theme management
 * - BrowserRouter: Client-side routing
 */

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Analysis from './pages/Analysis';
import Results from './pages/Results';
import History from './pages/History';

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/analysis" element={<Analysis />} />
            <Route path="/results/:analysisId" element={<Results />} />
            <Route path="/history" element={<History />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
