import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <div className="logo">
            <Link to="/" className="logo-text">WorkHub</Link>
          </div>
          <nav className="nav">
            <Link to="#" className="nav-link">
              Find jobs
              <span className="external-icon">↗</span>
            </Link>
            <Link to="#" className="nav-link">Pricing</Link>
            <Link to="#" className="nav-link">Login</Link>
            <div className="header-actions">
              <button className="btn-post-job">Post a job</button>
            </div>
          </nav>

        </div>
      </div>
    </header>
  );
};

export default Header;