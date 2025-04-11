import React, { useState, useContext } from 'react';
import '../css/Header.css';
import LoginRegisterPopup from './LoginRegisterPopup';
import { Link } from "react-router-dom";
import { AuthContext } from './Contexts';
import DisplayRecipe from '../Components/Homepage/DisplayRecipes'; // Import your DisplayRecipe component
import CuisineSelect from './Homepage/CuisineSelect';
import MealCategorySelect from './Homepage/MealCategorySelect';
import 'bootstrap/dist/css/bootstrap.min.css';
import SearchDropdownTabs from './Homepage/SearchDropdownTabs';


const Header: React.FC = () => {
    const { isLoggedIn, setLogInStatus } = useContext(AuthContext);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState<string | null>(null);
    const [showCuisineTab, setShowCuisineTab] = useState(false);

    const toggleDropdown = () => {
        setIsDropdownOpen(prevState => !prevState); // Toggle dropdown visibility
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value); // Set the search query based on user input
    };
    const toggleCuisineTab = () => {
        setShowCuisineTab(prev => !prev);
        
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
                                <button className="cuisineButton btn btn-warning mb-3" onClick={toggleCuisineTab}>
                                     Cuisine Filter
                                </button>
                                {showCuisineTab && (
                                    <SearchDropdownTabs/>
                                )}
                                <input
                                    type="text"
                                    placeholder="Search for recipes..."
                                    onChange={handleSearchChange}
                                />
                                <DisplayRecipe searchQuery={searchQuery} />
                                
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
