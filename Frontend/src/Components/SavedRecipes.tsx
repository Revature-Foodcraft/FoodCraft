import React from 'react';
import RecipeCard from './RecipeCard';
import 'bootstrap/dist/css/bootstrap.min.css';
import "../css/SavedRecipes.css"

interface Recipe {
   PK: string;
  name?: string;
  user_id?: string;
  description?: string;
}
 

const SavedRecipes: React.FC = () => {

    const [recipes, setRecipes] = React.useState<Recipe[]>([]);
      const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');

    React.useEffect(() => {
    const fetchRecipes = async () => {
      try { //TODO change to send info with tocken
        const response = await fetch("http://localhost:5000/account/recipes?userId=fd84e637-be21-43cb-b655-0b9b72433576");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
          const data = await response.json();
          if (!data.recipes) {
          throw new Error("Response does not contain recipes");
        }

        setRecipes(data.recipes);
      } catch (err:any) {
        console.error("Error fetching recipes:", err);
        setError("Failed to load recipes.");
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);


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
          <p className='text-danger'>{error}</p>
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
              onDelete={() => console.log(`Delete recipe with id ${recipe.PK}`)}
            />
          );
        })}
      </div>

            <div className='row m-3' >
                <button className='btn btn-warning btn-lg rounded-pill shadow-sm btn-custom'>Create new recipe</button>
            </div>
       </div>
    )
}

export default SavedRecipes