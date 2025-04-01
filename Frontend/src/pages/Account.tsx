import React from 'react';
import SavedRecipes from '../Components/SavedRecipes';
import SmartFridge from '../Components/SmartFridge';
import Header from '../Components/Header';

const styles: { [key: string]: React.CSSProperties } = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        background: '#e0eff4'
    },
    mainContent: {
        padding: '50px',
        display: 'flex',
        flex: 1,
        width: '100%',
    },
    smartFridgeSection: {
        flex: 1,
        padding: '1rem',
        borderRight: '1px solid #ddd',
    },
    savedRecipesSection: {
        flex: 1,
        padding: '1rem',
    },
};

const Account: React.FC = () => {
    return (
        <div style={styles.container}>
            {/* Header */}
            <Header />

            {/* Main Content */}
            <div style={styles.mainContent}>
                {/* SmartFridge Section */}
                <section style={styles.smartFridgeSection}>
                    <SmartFridge />
                </section>

                {/* SavedRecipes Section */}
                <section style={styles.savedRecipesSection}>
                    <SavedRecipes />
                </section>
            </div>
        </div>
    );
};

export default Account;