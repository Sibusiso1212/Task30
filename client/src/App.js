// Main App component handling routing
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './styles/global.css';
import SearchBox from './components/SearchBox';
import UserDetails from './components/UserDetails';
import LandingPage from './components/LandingPage';
// main component for the application
function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/search" element={<SearchBox />} />
          <Route path="/user/:username" element={<UserDetails />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
