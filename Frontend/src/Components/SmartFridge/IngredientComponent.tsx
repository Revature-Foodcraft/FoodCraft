import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../css/SmartFridge/SmartFridge.css";
import { Ingredient } from "../../Types/Ingredient";

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
    <div className="ingredient-card">
      <div className="ingredient-body">
        <h5 className="ingredient-title">{ingredient.name}</h5>
        <p className="ingredient-text">
          Amount:&nbsp;
          {isEditing ? (
            <>
              <input
                type="text"
                className="input-field inline-input"
                value={editedAmount}
                onChange={(e) => setEditedAmount(e.target.value)}
              />
              <button
                className="btn btn-success btn-sm inline-btn"
                onClick={handleSave}
              >
                Save
              </button>
            </>
          ) : (
            <span
              className="editable-text"
              onClick={() => setIsEditing(true)}
            >
              {ingredient.amount}
            </span>
          )}
        </p>
        <button
          className="btn btn-danger btn-sm ingredient-delete"
          onClick={() => onRemove(ingredient.id)}
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default IngredientComponent;
