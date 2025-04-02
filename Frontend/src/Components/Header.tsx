import React from 'react';
import '../css/Header.css'; // Import the CSS file\
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  return (
      <div className='wrapper'>
          <header>
      <img src="./src/assets/logo.svg" alt="FoodCraft Logo" />
      <nav>
        <ul>
          <li>
              <Link to="/"><button>Home</button></Link>
          </li>
          <li>
            <button>About</button>
          </li>
          <li>
            <button>Contact</button>
          </li>
          <li>
            <Link to='/login'>  <button>Login</button></Link>
          </li>
            <li>
              <Link to='/account'><button>Account</button></Link>
              </li>
        </ul>
      </nav>
      </header>
      </div>
  );
};

export default Header;