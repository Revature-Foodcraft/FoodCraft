import React from 'react';
import SavedRecipes from '../Components/SavedRecipes';
import SmartFridge from '../Components/SmartFridge';
import Header from '../Components/Header';

const Account: React.FC = () => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
            {/* Header */}
            <Header />

            {/* Main Content */}
            <div style={{ display: 'flex', flex: 1, width: '100%' }}>
                {/* SmartFridge Section */}
                <section style={{ flex: 1, padding: '1rem', borderRight: '1px solid #ddd' }}>
                    <h2>Smart Fridge</h2>
                    <SmartFridge />
                </section>

                {/* SavedRecipes Section */}
                <section style={{ flex: 1, padding: '1rem' }}>
                    <h2>Saved Recipes</h2>
                    <SavedRecipes />
                </section>
            </div>
        </div>
    );
};

export default Account;