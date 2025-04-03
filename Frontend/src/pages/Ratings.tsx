// Ratings.tsx
import React, { useEffect, useState } from "react";
import RecipeCardRating from "../Components/RecipeCardRating";
import Header from "../Components/Header";
import "../css/Ratings.css"; // Ensure this path is correct

export interface Recipe {
  recipeId: string;
  name: string;
  picture: string;
  description: string;
  rating: number;
  ratingCount: number;
}

const dummyRecipes: Recipe[] = [
  {
    recipeId: "1",
    name: "Spaghetti Carbonara",
    picture: "https://via.placeholder.com/300x200.png?text=Spaghetti+Carbonara",
    description:
      "A classic Italian pasta dish with eggs, cheese, pancetta, and pepper.",
    rating: 4.5,
    ratingCount: 150,
  },
  {
    recipeId: "2",
    name: "Chicken Curry",
    picture: "https://via.placeholder.com/300x200.png?text=Chicken+Curry",
    description:
      "A spicy and flavorful curry dish with tender chicken pieces.",
    rating: 4.2,
    ratingCount: 120,
  },
  {
    recipeId: "3",
    name: "Vegetable Stir Fry",
    picture: "https://via.placeholder.com/300x200.png?text=Vegetable+Stir+Fry",
    description: "A quick and healthy stir-fry of fresh vegetables.",
    rating: 4.0,
    ratingCount: 90,
  },
  {
    recipeId: "4",
    name: "Beef Stroganoff",
    picture: "https://via.placeholder.com/300x200.png?text=Beef+Stroganoff",
    description: "Tender beef strips in a creamy mushroom sauce.",
    rating: 4.3,
    ratingCount: 110,
  },
  {
    recipeId: "5",
    name: "Fish Tacos",
    picture: "https://via.placeholder.com/300x200.png?text=Fish+Tacos",
    description:
      "Crispy fish with fresh slaw and zesty lime crema.",
    rating: 4.4,
    ratingCount: 95,
  },
  {
    recipeId: "6",
    name: "Margherita Pizza",
    picture: "https://via.placeholder.com/300x200.png?text=Margherita+Pizza",
    description:
      "Classic pizza with tomatoes, mozzarella, and fresh basil.",
    rating: 4.7,
    ratingCount: 200,
  },
  {
    recipeId: "7",
    name: "Pad Thai",
    picture: "https://via.placeholder.com/300x200.png?text=Pad+Thai",
    description:
      "Thai stir-fried noodles with tamarind sauce, shrimp, and peanuts.",
    rating: 4.6,
    ratingCount: 180,
  },
  {
    recipeId: "8",
    name: "Caesar Salad",
    picture: "https://via.placeholder.com/300x200.png?text=Caesar+Salad",
    description:
      "Fresh romaine lettuce with Caesar dressing, croutons, and Parmesan cheese.",
    rating: 4.1,
    ratingCount: 75,
  },
  {
    recipeId: "9",
    name: "Lemon Garlic Shrimp",
    picture: "https://via.placeholder.com/300x200.png?text=Lemon+Garlic+Shrimp",
    description:
      "Succulent shrimp in a zesty lemon garlic sauce.",
    rating: 4.5,
    ratingCount: 130,
  },
  {
    recipeId: "10",
    name: "Fluffy Pancakes",
    picture: "https://via.placeholder.com/300x200.png?text=Fluffy+Pancakes",
    description:
      "Light and fluffy pancakes served with maple syrup.",
    rating: 4.3,
    ratingCount: 140,
  },
  {
    recipeId: "11",
    name: "Chocolate Cake",
    picture: "https://via.placeholder.com/300x200.png?text=Chocolate+Cake",
    description:
      "Rich and moist chocolate cake with a silky ganache.",
    rating: 4.8,
    ratingCount: 220,
  },
  {
    recipeId: "12",
    name: "Grilled Salmon",
    picture: "https://via.placeholder.com/300x200.png?text=Grilled+Salmon",
    description:
      "Perfectly grilled salmon with a lemon butter sauce.",
    rating: 4.7,
    ratingCount: 160,
  },
  {
    recipeId: "13",
    name: "Veggie Burger",
    picture: "https://via.placeholder.com/300x200.png?text=Veggie+Burger",
    description:
      "A hearty veggie burger with all the fixings.",
    rating: 4.2,
    ratingCount: 100,
  },
  {
    recipeId: "14",
    name: "Quinoa Salad",
    picture: "https://via.placeholder.com/300x200.png?text=Quinoa+Salad",
    description:
      "A refreshing salad with quinoa, vegetables, and a light vinaigrette.",
    rating: 4.0,
    ratingCount: 80,
  },
  {
    recipeId: "15",
    name: "Pesto Pasta",
    picture: "https://via.placeholder.com/300x200.png?text=Pesto+Pasta",
    description:
      "Pasta tossed in a vibrant basil pesto sauce.",
    rating: 4.4,
    ratingCount: 105,
  },
  {
    recipeId: "16",
    name: "BBQ Ribs",
    picture: "https://via.placeholder.com/300x200.png?text=BBQ+Ribs",
    description:
      "Slow-cooked ribs with a smoky BBQ sauce.",
    rating: 4.6,
    ratingCount: 135,
  },
  {
    recipeId: "17",
    name: "Fried Rice",
    picture: "https://via.placeholder.com/300x200.png?text=Fried+Rice",
    description:
      "Classic fried rice with vegetables and eggs.",
    rating: 4.1,
    ratingCount: 95,
  },
  {
    recipeId: "18",
    name: "Tiramisu",
    picture: "https://via.placeholder.com/300x200.png?text=Tiramisu",
    description:
      "A popular Italian dessert with coffee-soaked ladyfingers.",
    rating: 4.8,
    ratingCount: 180,
  },
  {
    recipeId: "19",
    name: "Lobster Bisque",
    picture: "https://via.placeholder.com/300x200.png?text=Lobster+Bisque",
    description:
      "A smooth and creamy lobster bisque.",
    rating: 4.5,
    ratingCount: 110,
  },
  {
    recipeId: "20",
    name: "Avocado Toast",
    picture: "https://via.placeholder.com/300x200.png?text=Avocado+Toast",
    description:
      "Toasted bread topped with mashed avocado and seasonings.",
    rating: 4.0,
    ratingCount: 85,
  },
];

const Ratings: React.FC = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 15;

  useEffect(() => {
    // Simulate an API call delay
    setTimeout(() => {
      setRecipes(dummyRecipes);
    }, 500);
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  // Pagination calculations
  const totalPages = Math.ceil(recipes.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentRecipes = recipes.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="ratings-page">
      <Header />
      <h2>Recipe Ratings</h2>
      <div className="recipe-cards-container">
        {currentRecipes.map((recipe) => (
          <RecipeCardRating
            key={recipe.recipeId}
            name={recipe.name}
            picture={recipe.picture}
            description={recipe.description}
            rating={recipe.rating}
            ratingCount={recipe.ratingCount}
          />
        ))}
      </div>
      {totalPages > 1 && (
        <div className="pagination">
          <button
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            Prev
          </button>
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              className={currentPage === index + 1 ? "active" : ""}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </button>
          ))}
          <button
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Ratings;
