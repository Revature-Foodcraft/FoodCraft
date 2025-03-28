
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';
import foodcraftLogo from './assets/FoodCraft-Logo.png';
import Login from './pages/Login'

// Define the Home component
const Home: React.FC = () => {
  return (
    <div>
      <h1>Welcome to FoodCraft</h1>
      <img className="logo" src={foodcraftLogo} alt="FoodCraft Logo" />
      <Link to="/login">
        <button>Go to Login</button>
      </Link>
    </div>
  );
};

// Main App component with routing
const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
};

export default App;
