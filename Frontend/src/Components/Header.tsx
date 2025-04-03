import React, { useContext, useEffect } from 'react';
import '../css/Header.css'; // Import the CSS file\
import LoginRegisterPopup from './LoginRegisterPopup';
import { Link } from "react-router-dom";
import { AuthContext } from './Contexts';

const Header: React.FC = () => {
    const {isLoggedIn,setLogInStatus} = useContext(AuthContext)

    return (
        <div className='wrapper'>
            
            <header>
                <div className='titleAndLogoWrapper'>
                    <img src="./src/assets/logo.svg" alt="FoodCraft Logo" />
                    <h1 >FoodCraft</h1>
                </div>
                <nav>
                    <ul>
                        <li>
                            <Link to="/">
                                <button>Home</button>
                            </Link>
                        </li>
                        {isLoggedIn ? (
                            <>
                                <li>
                                    <Link to="/profile">
                                        <button>Profile</button>
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/account">
                                        <button>Account</button>
                                    </Link>
                                </li>
                            </>
                        ) : (
                            <li>
                                <LoginRegisterPopup />
                            </li>
                        )}
                    </ul>
                </nav>
            </header>
        </div>
    );
};

export default Header;