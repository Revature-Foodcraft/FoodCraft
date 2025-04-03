import React, { useState, useEffect } from 'react';

import '../css/Recipe.css';
import lasagna from "../assets/lasagna.jpg";
import orangec from "../assets/orange-chicken.jpg";
import salad from "../assets/salad.jpg";
import pizza from "../assets/pizza.jpg";
import chickens from "../assets/chicken sandwich.jpg";
import fishtacos from "../assets/fishTacos.jpg";

const Recipe: React.FC = () => {
    const [recipe, setRecipe] = useState<any>(null);
    
    useEffect(() => {
        fetch('http://localhost:5000/recipe/recipe/2') // Replace with actual API URL
            .then(response => response.json())
            .then(data => setRecipe(data.recipe))
            .catch(error => console.error("Error fetching recipe:", error));
    }, []);

    if (!recipe) {
        return <p>Loading recipe...</p>;
    }

    return (
        <div className="containerRecipe">
         
            <h1>{recipe.name}</h1>
            <div className="recipe-layout">
                <div className="ingredients-instructions">
                    <h3 className="recipe-name text-center">{recipe.name}</h3>
                    <div className="recipe-author">
                        <div className="author-avatar"></div>
                        <p className="author-name">Recipe By: User {recipe.user_id}</p>
                    </div>
                    <h4>Ingredients</h4>
                    <ul className="ingredients-list">
                        {recipe.ingredients.map((ingredient: string, index: number) => (
                            <li key={index}>{ingredient}</li>
                        ))}
                    </ul>
                    <h4>Instructions</h4>
                    <ol className="instructions-list">
                        {recipe.instructions.map((step: string, index: number) => (
                            <li key={index}>{step}</li>
                        ))}
                    </ol>
                    <div className="time-fields">
                        <p><strong>Calories:</strong> {recipe.macros.calories} kcal</p>
                        <p><strong>Fat:</strong> {recipe.macros.fat} g</p>
                        <p><strong>Carbs:</strong> {recipe.macros.carbs} g</p>
                        <p><strong>Protein:</strong> {recipe.macros.protein} g</p>
                    </div>
                </div>
                <div className="middle-section">
                    <div className="middle-top">
                        <div className="review-box">
                            <div className="review-header">
                                <div className="review-avatar"></div>
                                <p className="review-author">Recipe By: Foodcrafter</p>
                            </div>
                            <p className="review-text">"This recipe was amazing! The flavors were perfect."</p>
                            <div className="review-stars">⭐⭐⭐⭐⭐</div>
                        </div>
                    </div>
                    <div className="middle-bottom">Middle Bottom</div>
                </div>
                <div className="food-image">
                    <img src={recipe.pictures[0]?.link} alt={recipe.pictures[0]?.name || "Recipe Image"} />
                </div>
            </div>
            <div className="recipeSuggestions">
                <h2>Similar Recipes</h2>
                <div className="suggestions-container">
                    <div className="suggestion-box"><img src={lasagna} alt="Recipe 1" /><p>Lasagna</p></div>
                    <div className="suggestion-box"><img src={orangec} alt="Recipe 2" /><p>Orange Chicken</p></div>
                    <div className="suggestion-box"><img src={pizza} alt="Recipe 3" /><p>Pizza</p></div>
                    <div className="suggestion-box"><img src={salad} alt="Recipe 4" /><p>Greek Salad</p></div>
                    <div className="suggestion-box"><img src={chickens} alt="Recipe 5" /><p>Chicken Sandwich</p></div>
                    <div className="suggestion-box"><img src={fishtacos} alt="Recipe 6" /><p>Fish Tacos</p></div>
                </div>
            </div>
        </div>
    );
};

export default Recipe;
