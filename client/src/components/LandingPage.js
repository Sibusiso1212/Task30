import React from 'react';
import '../styles/LandingPage.css';

import { Link } from 'react-router-dom';
import SearchBox from './SearchBox';
//Landing page component
const LandingPage = () => {
  return (
    <div className="landing-page">
      <header>
        <h1>GitHub Explorer</h1>
        <p>Search and explore GitHub users and their repositories</p>
      </header>
      
      <main>
        <SearchBox />
      </main>
      
      <footer>
        <p>Built with React and GitHub API</p>
      </footer>
    </div>
  );
};

export default LandingPage;
