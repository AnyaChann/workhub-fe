import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <div className="logo">
            <Link to="/" className="logo-text">WorkHub®</Link>
          </div>
          <nav className="nav">
            <a href="/find-jobs" className="nav-link">Find Jobs</a>
            <Link to="/pricing" className="nav-link">Pricing</Link>
            <Link to="/login" className="nav-link">Login</Link>

            <div className="header-actions">
              <Link to="/register" className="btn-post-job">POST A JOB</Link>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;