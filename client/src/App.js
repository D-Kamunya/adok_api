import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Navbar from './components/Navbar/Navbar';
import UploadPage from './components/UploadPage/UploadPage'
import Dashboard from './components/Dashboard/Dashboard';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <ToastContainer autoClose={false} />
        <Navbar/>
        <main className="main-content">
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
