import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <NavLink to="/" className="logo-link">
            Church Analytics
          </NavLink>
        </div>

        <div className={`navbar-links ${isOpen ? 'open' : ''}`}>
          <ul>
            <li>
              <NavLink 
                to="/" 
                className={({ isActive }) => isActive ? 'active' : ''}
                end
              >
                Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/upload" 
                className={({ isActive }) => isActive ? 'active' : ''}
              >
                Upload Data
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/reports" 
                className={({ isActive }) => isActive ? 'active' : ''}
              >
                Reports
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/settings" 
                className={({ isActive }) => isActive ? 'active' : ''}
              >
                Settings
              </NavLink>
            </li>
          </ul>
        </div>

        <div className="navbar-toggle" onClick={toggleMenu}>
          <div className={`hamburger ${isOpen ? 'open' : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
