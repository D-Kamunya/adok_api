import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Navbar from './components/Navbar/Navbar';
import UploadPage from './components/UploadPage/UploadPage'
import Dashboard from './components/Dashboard/Dashboard';
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
     <Router>
      <div className="d-flex flex-column min-vh-100 bg-light">
        {/* Toast container */}
        <ToastContainer autoClose={false} />

        {/* Navbar */}
        <Navbar />

        {/* Main content */}
        <main className="flex-grow-1 container py-4">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/upload" element={<UploadPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
