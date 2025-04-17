import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../css/Recipe.css';
import imageNotFound from '../assets/imageNotFound.jpg';

const Recipe: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [recipe, setRecipe] = useState<any>(null);
    const [isApiRecipe, setIsApiRecipe] = useState(false);

    const handleSaveToList = async () => {
        const response = await fetch("")
    }
    useEffect(() => {
        if (!id) return;

        const isApi = window.location.pathname.includes("/recipe/api/");
        setIsApiRecipe(isApi);

        if (isApi) {
            fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
                .then(res => res.json())
                .then(data => {
                    const meal = data.meals?.[0];
                    if (meal) {
                        setRecipe({
                            name: meal.strMeal,
                            ingredients: Array.from({ length: 20 }, (_, i) => {
                                const name = meal[`strIngredient${i + 1}`];
                                const amount = meal[`strMeasure${i + 1}`];
                                return name ? { name, amount, category: "Unknown" } : null;
                            }).filter(Boolean),
                            instructions: meal.strInstructions?.split(". ").filter(Boolean),
                            macros: {
                                calories: "N/A",
                                fat: "N/A",
                                carbs: "N/A",
                                protein: "N/A"
                            },
                            pictures: [ { link: meal.strMealThumb } ],
                            youtube: meal.strYoutube,
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

    // Determine image URL for main image
    const getImageUrl = (image: any) => {
        if (typeof image === 'string') return image;
        if (image?.link) return image.link;
        return imageNotFound;
    };

    // Extract YouTube thumbnail
    const getYouTubeVideoId = (url: string) => {
        if (!url) return null;
        return url.split('v=')[1]?.split('&')[0];
    };
    

    const youtubeVideoId = getYouTubeVideoId(recipe.youtube);


    return (
        <div className="containerRecipe">
            <div className='d-flex justify-content-around'>
                <h1>{recipe.name}</h1>
                <button className='btn' onClick={handleSaveToList}><img src={"/src/assets/floppy.svg"}/> Save To Recipe List</button>
            </div>
            
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
                        <p><strong>Calories:</strong> {recipe.macros?.calories} kcal</p>
                        <p><strong>Fat:</strong> {recipe.macros?.fat} g</p>
                        <p><strong>Carbs:</strong> {recipe.macros?.carbs} g</p>
                        <p><strong>Protein:</strong> {recipe.macros?.protein} g</p>
                    </div>
                </div>
    
                {/* NEW WRAPPER for side content */}
                <div className="side-content-wrapper">
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
                        <div className="middle-bottom">
                            {youtubeVideoId ? (
                                <iframe
                                    src={`https://www.youtube.com/embed/${youtubeVideoId}`}
                                    title="YouTube video player"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    className="youtube-player"
                                ></iframe>
                            ) : (
                                <p>No video available.</p>
                            )}
                        </div>
                    </div>
    
                    <div className="food-image">
                        <img
                            src={getImageUrl(recipe.pictures?.[0] || recipe.pictures)}
                            alt={recipe.name || "Recipe Image"}
                        />
                    </div>
                </div>
            </div>
    
            <div className="recipeSuggestions">
                <h2>Similar Recipes</h2>
                <div className="suggestions-container">
                    <div className="suggestion-box"><p>Lasagna</p></div>
                    <div className="suggestion-box"><p>Orange Chicken</p></div>
                    <div className="suggestion-box"><p>Pizza</p></div>
                    <div className="suggestion-box"><p>Greek Salad</p></div>
                    <div className="suggestion-box"><p>Chicken Sandwich</p></div>
                    <div className="suggestion-box"><p>Fish Tacos</p></div>
                </div>
            </div>
        </div>
    );
}    
export default Recipe;
