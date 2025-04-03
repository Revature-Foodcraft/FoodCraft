// RecipeCardRating.tsx
import React from "react";
import StarRating from "./StarRating";

interface RecipeCardRatingProps {
  name: string;
  picture: string;
  description: string;
  rating: number;
  ratingCount: number;
}

const RecipeCardRating: React.FC<RecipeCardRatingProps> = ({
  name,
  picture,
  description,
  rating,
  ratingCount,
}) => {
  return (
    <div className="recipe-card" style={{ border: "1px solid #ccc", borderRadius: "8px", padding: "1rem", width: "300px" }}>
      <img src={picture} alt={name} className="recipe-image" style={{ width: "100%", height: "auto", borderRadius: "4px" }} />
      <h3>{name}</h3>
      <p>{description}</p>
      <div className="rating" style={{ display: "flex", alignItems: "center", marginTop: "0.5rem", fontWeight: "bold" }}>
        <StarRating rating={rating} />
        <span style={{ marginLeft: "0.5rem" }}>({ratingCount} ratings)</span>
      </div>
    </div>
  );
};

export default RecipeCardRating;
