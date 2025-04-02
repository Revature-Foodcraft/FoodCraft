import React from "react";

import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/RecipeCard.css';
import { useNavigate } from "react-router-dom";

interface RecipeCardProps {
    id: string;
    title: string;
    author: string;
    description?: string;  // Optional additional text
    onDelete?: () => void; // Optional deletion callbac
}

const RecipeCard: React.FC<RecipeCardProps> = ({ title, author, description, onDelete , id}) => {
   
     const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/recipes/${id}`); // or navigate(`/recipe/${id}`) if you have an ID
  };
   
    return (
         <div onClick={handleCardClick} className="card m-1 custom-card">
      <div className="card-body">
        <h4 className="card-title">{title}</h4>
        <p className="card-text">By: {author}</p>
        {description && <p className="card-description">{description}</p>}
      </div>
      {onDelete && (
        <button className="btn btn-sm btn-outline-danger delete-btn" onClick={onDelete}>
          &#x2715;
        </button>
      )}
        </div>
      
    );
};

export default RecipeCard;