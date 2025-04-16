import React from 'react';
import SavedRecipes from '../Components/SavedRecipes/SavedRecipes';
import SmartFridge from '../Components/SmartFridge/SmartFridgeContainer';
import MacroTracker from '../Components/MacroTracker/MacroTracker';
import '../css/Account.css';

const Account: React.FC = () => {
    return (
        <div className="account-container">

            {/* Main Content */}
            <div className="main-content">
                <section className="macro-tracker-section">
                    <MacroTracker />
                </section>
                <div className="top-section">
                    {/* SmartFridge Section */}
                    <section className="smart-fridge-section">
                        <SmartFridge />
                    </section>

                    {/* SavedRecipes Section */}
                    <section className="saved-recipes-section">
                        <SavedRecipes />
                    </section>
                </div>

                {/* MacroTracker Section */}

            </div>

        </div>
    );
};

export default Account;