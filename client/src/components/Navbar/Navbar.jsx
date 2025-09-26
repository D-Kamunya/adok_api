import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm sticky-top">
      <div className="container">
        {/* Brand */}
        <NavLink to="/" className="navbar-brand fw-bold">
          Church Analytics
        </NavLink>

        {/* Toggler */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Links */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <NavLink 
                to="/" 
                end
                className={({ isActive }) => 
                  isActive ? "nav-link active text-primary" : "nav-link"
                }
              >
                Dashboard
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink 
                to="/upload" 
                className={({ isActive }) => 
                  isActive ? "nav-link active text-primary" : "nav-link"
                }
              >
                Upload Data
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink 
                to="/reports" 
                className={({ isActive }) => 
                  isActive ? "nav-link active text-primary" : "nav-link"
                }
              >
                Reports
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink 
                to="/settings" 
                className={({ isActive }) => 
                  isActive ? "nav-link active text-primary" : "nav-link"
                }
              >
                Settings
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
