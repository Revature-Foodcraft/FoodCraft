import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/RecipeCard.css';

interface RecipeCardProps {
    title: string;
    author: string;
    description?: string;  // Optional additional text
    onDelete?: () => void; // Optional deletion callbac
}

const RecipeCard: React.FC<RecipeCardProps> = ({ title, author, description, onDelete }) => {
    return (
        <div className="card m-1 custom-card">
            <div className="card-body">
                <div className="card-header-section">
                <h4 className="card-title">{title}</h4>
                {onDelete && (
                 <button className="btn btn-sm btn-outline-danger delete-btn" onClick={onDelete}>
                   &#x2715; {/* Unicode cross symbol */}
                     </button>
                    )}
                    <p className="card-text">By: {author}</p>
        {/* Additional description text (red area) */}
        {description && <p className="card-description">{description}</p>}
                </div>
                
            </div>
        </div>
    );
};

export default RecipeCard;