import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../css/SmartFridge/Ingredient.css";
import { Ingredient } from "../../Types/Ingredient";

interface IngredientProps {
  ingredient: Ingredient;
  onRemove: (id: string) => void; // onRemove receives the id.
    onUpdate: (id: string, newAmount: string) => void;
}

const IngredientComponent: React.FC<IngredientProps> = ({ ingredient, onRemove, onUpdate }) => {

  const [isEditing, setIsEditing] = useState(false);
  const [editedAmount, setEditedAmount] = useState(ingredient.amount);

  
  const handleSave = () => {
    // Call the parent's update function with the new amount.
    onUpdate(ingredient.id, editedAmount);
    setIsEditing(false);
  };

  return (
    <div className="container">
      <div className="ingredient-container">
        <p>
          {ingredient.name} - Amount&nbsp;
          {isEditing ? (
            <>
              <input
                type="text"
                value={editedAmount}
                onChange={(e) => setEditedAmount(e.target.value)}
              />
              <button onClick={handleSave} style={{ marginLeft: "5px" }}>
                Save
              </button>
            </>
          ) : (
            <span
              onClick={() => setIsEditing(true)}
              style={{ cursor: "pointer", textDecoration: "underline" }}
            >
              {ingredient.amount}
            </span>
          )}
        </p>
        <button
          onClick={() => onRemove(ingredient.id)}
          title="Remove Ingredient"
          style={{
            border: "none",
            background: "transparent",
            cursor: "pointer",
            fontSize: "18px",
          }}
        >
          &#x1F5D1;
        </button>
      </div>
    </div>
  );
};

export default IngredientComponent;
