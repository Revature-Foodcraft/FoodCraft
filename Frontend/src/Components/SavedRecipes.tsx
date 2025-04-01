import React from 'react';
import RecipeCard from './RecipeCard';
import "../css/SavedRecipes.css"

const SavedRecipes: React.FC = () => {
    return (
        <div className='component-container'>
            <div className='header-text'>
                <h3>Saved Recipes</h3>
            </div>
            <div className='recipe-card-wrapper'>
               <RecipeCard title={'Title'} author={'Author'}/>
               <RecipeCard title={'Title'} author={'Author'}/>
               <RecipeCard title={'Title'} author={'Author'}/>
             
            </div>
            <div >
                <button className='createRecipe-button'>Create new recipe</button>
            </div>
       </div>
    )
}

export default SavedRecipes