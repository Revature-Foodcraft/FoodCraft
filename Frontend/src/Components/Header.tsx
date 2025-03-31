import React from 'react';

const Header: React.FC = () => {
    return (
        <header>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px', backgroundColor: '#5B3E18' }}>
            <img src="./src/assets/logo.svg" alt="FoodCraft Logo" style={{ height: '50px', filter: 'invert(85%) sepia(20%) saturate(500%) hue-rotate(10deg) brightness(100%) contrast(90%)' }} />
            <nav>
            <ul style={{ display: 'flex', listStyle: 'none', margin: 0, padding: 0, color: '#EDD2A8' }}>
            <li style={{ margin: '0 10px' }}>
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#EDD2A8' }} onClick={() => window.location.href = '/'}>Home</button>
            </li>
            <li style={{ margin: '0 10px' }}>
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#EDD2A8' }}>Recipes</button>
            </li>
            <li style={{ margin: '0 10px' }}>
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#EDD2A8' }}>Meal Planner</button>
            </li>
            <li style={{ margin: '0 10px' }}>
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#EDD2A8' }} onClick={() => window.location.href = '/account'}>Account</button>
            </li>
            </ul>
            </nav>
        </div>
        </header>
    );
};

export default Header;