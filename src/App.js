import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './pages/Employer/Home/Home';
import Login from './pages/Auth/Login/Login';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          {/* Future routes */}
          {/* <Route path="/register" element={<Register />} /> */}
          {/* <Route path="/forgot-password" element={<ForgotPassword />} /> */}
          
          {/* 404 route */}
          <Route path="*" element={<div>Page Not Found</div>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;