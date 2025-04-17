import React, { useState, useContext } from 'react';
import '../css/Header.css';
import LoginRegisterPopup from './LoginRegisterPopup';
import { Link } from "react-router-dom";
import { AuthContext, DisplayContext } from './Contexts';
import DisplayRecipe from '../Components/Homepage/DisplayRecipes'; // Import your DisplayRecipe component
import CuisineSelect from './Homepage/CuisineSelect';
import MealCategorySelect from './Homepage/MealCategorySelect';
import 'bootstrap/dist/css/bootstrap.min.css';
import SearchDropdownTabs from './Homepage/SearchDropdownTabs';
import SortByDropdown from './Homepage/SortByDropdown';


const Header: React.FC = () => {
    const { isLoggedIn, setLogInStatus } = useContext(AuthContext);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState<string | null>(null);
    const [showCuisineTab, setShowCuisineTab] = useState(false);
    
    const [mealCategory,setMealCategorySelect] = useState("")
    const [selectedCuisine,setSelectedCuisine] = useState("")
    const [invert,setInvert] = useState(false)
    const [sortBy,setSortBy] = useState("Recently Added")

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
                                <DisplayContext.Provider value={{mealCategory,setMealCategorySelect,selectedCuisine,setSelectedCuisine,invert,setInvert, sortBy,setSortBy}}>
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
                                <SortByDropdown/>
                                <DisplayRecipe searchQuery={searchQuery} />
                                
                                </DisplayContext.Provider>
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
