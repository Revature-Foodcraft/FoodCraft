import React, { useEffect, useState } from 'react';
import '../css/Header.css'; // Import the CSS file
import '../css/Register.module.css';
import LoginRegisterPopup from './LoginRegisterPopup';
import { Link } from "react-router-dom";

const Header: React.FC = () => {
    const [isLoggedIn,setIsLoggin] = useState(false)

    useEffect(()=>{
        if(localStorage.getItem('token')){
            setIsLoggin(true)
        }
    })

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
                        <li>
                            <button>About</button>
                        </li>
                        <li>
                            {isLoggedIn ? (
                                <Link to="/account">
                                    <button>Account</button>
                                </Link>
                            ) :(
                                <LoginRegisterPopup></LoginRegisterPopup>
                                
                            )}
                        </li>
                    </ul>
                </nav>
            </header>
        </div>
    );
};

export default Header;