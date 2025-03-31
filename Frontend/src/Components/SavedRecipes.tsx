import React from 'react';

const SavedRecipes: React.FC = () => {
    return (
        <div style={{ padding: '20px', backgroundColor: '#F9F9F9', borderRadius: '10px', maxWidth: '400px', margin: '0 auto' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#333' }}>Saved Recipes</h2>
            <div style={{ backgroundColor: '#EFEFEF', padding: '10px', borderRadius: '5px', marginBottom: '10px' }}>
            <h3 style={{ color: '#555' }}>Recipe Title</h3>
            <p><strong>Author:</strong> <span style={{ color: '#777' }}>Author Name</span></p>
            <p><strong>Ingredients:</strong></p>
            <ul>
            <li style={{ color: '#555' }}>Ingredient 1</li>
            <li style={{ color: '#555' }}>Ingredient 2</li>
            <li style={{ color: '#555' }}>Ingredient 3</li>
            </ul>
            </div>
            <div style={{ backgroundColor: '#EFEFEF', padding: '10px', borderRadius: '5px', marginBottom: '10px' }}>
            <h3 style={{ color: '#555' }}>Recipe Title</h3>
            <p><strong>Author:</strong> <span style={{ color: '#777' }}>Author Name</span></p>
            <p><strong>Ingredients:</strong></p>
            <ul>
            <li style={{ color: '#555' }}>Ingredient 1</li>
            <li style={{ color: '#555' }}>Ingredient 2</li>
            <li style={{ color: '#555' }}>Ingredient 3</li>
            </ul>
            </div>
            <div style={{ backgroundColor: '#EFEFEF', padding: '10px', borderRadius: '5px', marginBottom: '10px' }}>
            <h3 style={{ color: '#555' }}>Recipe Title</h3>
            <p><strong>Author:</strong> <span style={{ color: '#777' }}>Author Name</span></p>
            <p><strong>Ingredients:</strong></p>
            <ul>
            <li style={{ color: '#555' }}>Ingredient 1</li>
            <li style={{ color: '#555' }}>Ingredient 2</li>
            <li style={{ color: '#555' }}>Ingredient 3</li>
            </ul>
            </div>
            <button style={{ display: 'block', width: '100%', padding: '10px', backgroundColor: '#D4A373', border: 'none', borderRadius: '5px', cursor: 'pointer', marginTop: '20px', color: '#FFF' }}>
            Create new recipe
            </button>
        </div>
    )
}

export default SavedRecipes