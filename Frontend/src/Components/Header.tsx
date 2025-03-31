import React from 'react';
import '../css/Header.css'; // Import the CSS file

const Header: React.FC = () => {
  return (
      <div className='wrapper'>
          <header>
      <img src="./src/assets/logo.svg" alt="FoodCraft Logo" />
      <nav>
        <ul>
          <li>
            <button>Home</button>
          </li>
          <li>
            <button>About</button>
          </li>
          <li>
            <button>Contact</button>
          </li>
          <li>
            <button>Login</button>
          </li>
        </ul>
      </nav>
      </header>
      </div>
  );
};

export default Header;