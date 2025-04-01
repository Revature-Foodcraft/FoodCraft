import React from 'react';
import RecipeCard from './RecipeCard';
import 'bootstrap/dist/css/bootstrap.min.css';
import "../css/SavedRecipes.css"

const SavedRecipes: React.FC = () => {
    return (
        <div className='container'>
            <div className='row text-center'>
                <h3>Saved Recipes</h3>
            </div>
            <div className='row' id='card-container'>
                <RecipeCard
                    title={'Title'}
                    author={'Author'}
                    onDelete={() => console.log("Delete recipe!")}
                    description="A simple and tasty pancake recipe, perfect for a weekend breakfast." />
                <RecipeCard
                    title={'Title'}
                    author={'Author'}
                    onDelete={() => console.log("Delete recipe!")}
                    description="A simple and tasty pancake recipe, perfect for a weekend breakfast." />
                <RecipeCard
                    title={'Title'}
                    author={'Author'}
                    onDelete={() => console.log("Delete recipe!")}
                    description="A simple and tasty pancake recipe, perfect for a weekend breakfast." />
            </div>
            <div className='row m-3' >
                <button className='btn btn-warning btn-lg rounded-pill shadow-sm btn-custom'>Create new recipe</button>
            </div>
       </div>
    )
}

export default SavedRecipes