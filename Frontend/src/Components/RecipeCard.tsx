import React from "react";
import '../css/RecipeCard.css';

interface RecipeCardProps {
    title: string;
    author: string;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ title, author }) => {
    return (
        <div className="recipe-card">
            <div className="metadata-text">
                <h4>{title}</h4>
                <p>By: {author}</p>
            </div>
        </div>
    );
};

export default RecipeCard;