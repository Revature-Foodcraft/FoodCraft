import React, { useEffect, useState } from 'react';
import RecipeCard from './RecipeCard.tsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import "../../css/SavedRecipes.css"
import { Link } from 'react-router-dom';
import blankCookbook from "../../assets/blank_coockbook.png"

import { Outlet } from 'react-router-dom';
interface Recipe {
  PK: string;
  name?: string;
  user_id?: string;
  description?: string;
}


const SavedRecipes: React.FC = () => {

  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error("No token found in localStorage");
        }

        const response = await fetch("http://localhost:5000/user/recipes", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        });

        if (!response.ok) {
          let errorMessage = "";
          try {
            const errorData = await response.json();
            errorMessage = errorData.message ? errorData.message : "";
          } catch (jsonError) {
            errorMessage = "An unknown error occurred";
          }
          throw new Error(`${errorMessage}`);
        }

        const data = await response.json();
        if (!data.recipes) {
          throw new Error("Response does not contain recipes");
        }

        setRecipes(data.recipes);
      } catch (err: any) {
        console.error("Error fetching recipes:", err);
        setError(`Failed to load recipes. ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  const deleteHandler = async (recipeId: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error("No token found in localStorage");
      }

      const response = await fetch("http://localhost:5000/user/recipes", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ recipeId })
      });

      if (!response.ok) {
        let errorMessage = "";
        try {
          const errorData = await response.json();
          errorMessage = errorData.message ? errorData.message : "";
        } catch (jsonError) {
          errorMessage = "An unknown error occurred";
        }
        throw new Error(`${errorMessage}`);
      }

      // Refetch recipes after successful deletion
      const updatedRecipes = recipes.filter(recipe => recipe.PK !== recipeId);
      setRecipes(updatedRecipes);
    } catch (err: any) {
      console.error("Error deleting recipe:", err);
      setError(`Failed to delete recipe. ${err.message}`);
    }
  };


  return (
    <div className='container'>
      <div className='row text-center'>
        <h3>Saved Recipes</h3>
      </div>

      {loading && (
        <div className='row'>
          <p>Loading recipes...</p>
        </div>
      )}
      {error && (
        <div className='row'>
          <p className='text-secondary'>
            Oops! Looks like you haven't saved any recipes yet. Start building your collection now!
          </p>
          <img src={blankCookbook} alt="No Recipes Found" className="empty-recipes-img" />
        </div>
      )}



      <div className="row" id="card-container">
        {recipes.map((recipe) => {
          const title = recipe.name || recipe.name || "Untitled Recipe";
          const author = recipe.user_id || recipe.user_id || "Unknown Author";


          return (
            <RecipeCard
              key={recipe.PK}
              title={title}
              author={author}
              id={recipe.PK}
              description={
                recipe.description ||
                "No description available"
              }
              onDelete={() => deleteHandler(recipe.PK)}
            />
          );
        })}
      </div>

            <div className='row m-3' >
              <Link to="saveRecipe">
                <button className='btn btn-warning btn-lg rounded-pill shadow-sm btn-custom'>Create new recipe</button>
               </Link> 
            </div>
            <Outlet />
       </div>
    )
}

export default SavedRecipes