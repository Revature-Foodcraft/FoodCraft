import React from 'react';
import RecipeCard from './RecipeCard';

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
            <div className='createRecipe-button'>
                <button>Create new recipe</button>
            </div>
       </div>
    )
}

export default SavedRecipes