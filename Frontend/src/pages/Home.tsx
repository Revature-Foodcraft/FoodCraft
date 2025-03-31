import React from "react";
import { Link } from "react-router-dom";
import foodCraftLogo from '../assets/FoodCraft-Logo.png';
import Header from '../Components/Header'
// Define the Home component
const Home: React.FC = () => {
    return (
      <div>
        <Header/>
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
      </div>
    );
  };

export default Home