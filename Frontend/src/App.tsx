
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import foodCraftLogo from './assets/FoodCraft-Logo.png';
import Login from './pages/Login';
import Register from './pages/Register';
import Account from './pages/Account';
import Ratings from './pages/Ratings';

// Define the Home component
const Home: React.FC = () => {
  return (
    <div>
      <img className="logo" src={foodCraftLogo} alt="FoodCraft Logo" />
      <h1>Welcome to FoodCraft</h1>
      <Link to="/login">
        <button>Go to Login</button>
      </Link>
      <Link to="/register">
          <button>Register</button>
      </Link>
      <Link to="/account">
          <button>Account</button>
      </Link>
      <Link to="/ratings">
          <button>Ratings</button>
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
        <Route path="/register" element={<Register />} />
        <Route path="/account" element={<Account />} />
        <Route path="/ratings" element={<Ratings />} />
      </Routes>
    </Router>
  );
};

export default App;
