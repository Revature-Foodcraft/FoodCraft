import React, { useState, useContext } from 'react';
import '../css/Header.css';
import LoginRegisterPopup from './LoginRegisterPopup';
import { Link } from "react-router-dom";
import { AuthContext } from './Contexts';
import DisplayRecipe from '../Components/Homepage/DisplayRecipes'; // Import your DisplayRecipe component
import MealTypeSelect from './Homepage/MealTypeSelect';
import CuisineSelect from './Homepage/CuisineSelect';

const Header: React.FC = () => {
    const { isLoggedIn, setLogInStatus } = useContext(AuthContext);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState<string | null>(null);

    const toggleDropdown = () => {
        setIsDropdownOpen(prevState => !prevState); // Toggle dropdown visibility
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value); // Set the search query based on user input
    };

    return (
        <div className='wrapper'>
            <header>
                <div className='titleAndLogoWrapper'>
                    <img src="./src/assets/logo.svg" alt="FoodCraft Logo" />
                    <h1>FoodCraft</h1>
                </div>
                <nav>
                    <ul>
                        <li>
                            <Link to="/">
                                <button>Home</button>
                            </Link>
                        </li>
                        <li>
                            <button onClick={toggleDropdown}>Search</button>
                            {isDropdownOpen && (
                                <div className="dropdownMenu">
                                    <div className="filter-section">
                                    {/* Meal Type Tabs */}
                                    <div className="meal-type-tabs">
                                        <MealTypeSelect />
                                    </div>

                                    {/* Cuisine Checkboxes */}
                                    <div className="cuisine-checkboxes">
                                        <CuisineSelect />
                                    </div>
                                    </div>

                                    <input
                                        type="text"
                                        placeholder="Search for recipes..."
                                        onChange={handleSearchChange} // Handle search input
                                    />
                                    <DisplayRecipe searchQuery={searchQuery} /> {/* Display recipes inside the dropdown */}
                                </div>
                            )}
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
