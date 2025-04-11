import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // Import useParams
import '../css/Recipe.css';
import lasagna from "../assets/lasagna.jpg";
import orangec from "../assets/orange-chicken.jpg";
import salad from "../assets/salad.jpg";
import pizza from "../assets/pizza.jpg";
import chickens from "../assets/chicken sandwich.jpg";
import fishtacos from "../assets/fishTacos.jpg";


const Recipe: React.FC = () => {
    const { id } = useParams<{ id: string }>(); // Get the recipe ID from the URL
    const [recipe, setRecipe] = useState<any>(null);
    const [isApiRecipe, setIsApiRecipe] = useState(false);

    useEffect(() => {
        if (!id) return;
        if (window.location.pathname.includes("/recipe/api/")) {
          setIsApiRecipe(true);
          fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
            .then(res => res.json())
            .then(data => {
              const meal = data.meals?.[0];
              if (meal) {
                setRecipe({
                  name: meal.strMeal,
                  ingredients: Array.from({ length: 20 }, (_, i) => {
                    const name = meal[`strIngredient${i+1}`];
                    const amount = meal[`strMeasure${i+1}`];
                    return name ? { name, amount, category: "Unknown" } : null;
                  }).filter(Boolean),
                  instructions: meal.strInstructions?.split(". ").filter(Boolean),
                  macros: {
                    calories: "N/A",
                    fat: "N/A",
                    carbs: "N/A",
                    protein: "N/A"
                  },
                  pictures: { link: meal.strMealThumb },
                  user_id: "API"
                });
              }
            });
        } else {
          fetch(`http://localhost:5000/recipes/${id}`)
            .then(response => response.json())
            .then(data => setRecipe(data.recipe))
            .catch(error => console.error("Error fetching recipe:", error));
        }
      }, [id]);

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
                    {recipe.ingredients.map((ingredient: any, index: number) => (
                        <li key={index}>
                            {ingredient.amount} {ingredient.name} ({ingredient.category})
                        </li>
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
                    <img src={recipe.pictures?.link} alt={recipe.name || "Recipe Image"} />
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
