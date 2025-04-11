import React, { useState, useEffect } from "react";
import pictureOne from "../assets/slideshow1.jpg";
import pictureTwo from "../assets/slideshow2.jpg";
import pictureThree from "../assets/slideshow3.jpg";
import pictureFour from "../assets/slideshow4.jpg";
import "../css/Homepage.css"; // Custom styles
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from "react-router-dom";


const Home: React.FC = () => {
  const images = [pictureOne, pictureTwo, pictureThree, pictureFour];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [featureRecipe, setFeatureRecipe] = useState<any>(null)

  const getFeaturedRecipes = async () => {
    try{
      const recipes = [];
      for(let i = 0; i < 8; i++){
        const res = await fetch("https://www.themealdb.com/api/json/v1/1/random.php");
        const json = await res.json();
        recipes.push(json.meals[0]);
      }
      setFeatureRecipe(recipes);
  }catch(err){
      console.log(`Error: ${err}`)
    }
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 10000);
    return () => clearInterval(interval);
  }, [images.length]);
  
  useEffect(() => {
    console.log("Fetching featured recipes")
    getFeaturedRecipes(); // runs once when page loads
  }, []);
  

  return (
    <div className="mainSection container text-center">
      <h1 className="title mb-4">Welcome to FoodCraft</h1>
      
      <div className="slideshow-container mb-5 mx-auto">
        {images.map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`Slideshow picture ${index + 1}`}
            className={`slide-image ${index === currentIndex ? "active" : ""}`}
          />
        ))}
      </div>

      <section className="featuredRecipies">
  <h2 className="mb-4">Featured Recipes</h2>
  <div className="row justify-content-center">
    {featureRecipe && featureRecipe.map((recipe: any, index: number) => (
      <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4" key={index}>
        <Link to={`/recipe/api/${recipe.idMeal}`} style={{ textDecoration: "none", color: "inherit" }}>
          <div className="recipe-card h-100">
            <img
              src={recipe.strMealThumb}
              alt={recipe.strMeal}
              className="recipe-image-placeholder"
              style={{
                width: "100%",
                height: "150px",
                objectFit: "cover",
                borderRadius: "8px",
                marginBottom: "0.75rem"
              }}
            />
            <p className="recipe-title">{recipe.strMeal}</p>
          </div>
        </Link>
      </div>
    ))}
  </div>
</section>


      <section className="bestRecipes mt-5">
        <h2 className="mb-4">Best Recipes by Rating</h2>
        <div className="row justify-content-center">
          {[...Array(8)].map((_, index) => (
            <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4" key={index}>
              <div className="recipe-card h-100">
                <div className="recipe-image-placeholder">Image</div>
                <p className="recipe-title">Recipe Title {index + 1}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
