import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../css/SmartFridge/Ingredient.css";
import { Ingredient } from "../../Types/Ingredient";
import { FaTrash } from "react-icons/fa";

interface IngredientProps {
  ingredient: Ingredient;
  onRemove: (id: string) => void;
  onUpdate: (id: string, newAmount: string) => void;
}

function IngredientComponent({ ingredient, onRemove, onUpdate }: IngredientProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedAmount, setEditedAmount] = useState(ingredient.amount);

  const handleSave = () => {
    onUpdate(ingredient.id, editedAmount);
    setIsEditing(false);
  };

  return (
    <li className="ingredient-item">
      <div className="ingredient-info">
        <h5 className="ingredient-title">{ingredient.name}</h5>
        <p className="ingredient-text">
          Amount:&nbsp;
          {isEditing ? (
            <>
              <input
                type="text"
                className="input-field"
                value={editedAmount}
                onChange={(e) => setEditedAmount(e.target.value)}
              />
              <button
                className="btn btn-warning btn-sm rounded-pill shadow-sm btn-custom-inline"
                onClick={handleSave}
              >
                Save
              </button>
            </>
          ) : (
            <span
              className="editable-text highlight-on-hover"
              onClick={() => setIsEditing(true)}
            >
              {ingredient.amount}
            </span>
          )}
        </p>
      </div>
      <button
        className="btn ingredient-delete btn-sm"
        onClick={() => onRemove(ingredient.id)}
      >
        <FaTrash />
      </button>
    </li>
  );
}

export default IngredientComponent;
