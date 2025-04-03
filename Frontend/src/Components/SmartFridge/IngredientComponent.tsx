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
    <div className="card h-100">
  <div className="card-body">
    <h5 className="card-title">{ingredient.name}</h5>
    <p className="card-text">
      Amount:{" "}
      {isEditing ? (
        <>
          <input
            type="text"
            className="form-control d-inline-block w-auto"
            value={editedAmount}
            onChange={(e) => setEditedAmount(e.target.value)}
          />
          <button className="btn btn-success btn-sm ms-2" onClick={handleSave}>
            Save
          </button>
        </>
      ) : (
        <span onClick={() => setIsEditing(true)} style={{ cursor: "pointer", textDecoration: "underline" }}>
          {ingredient.amount}
        </span>
      )}
    </p>
    <button className="btn btn-danger btn-sm" onClick={() => onRemove(ingredient.id)}>
      Delete
    </button>
  </div>
</div>

  );
};

export default IngredientComponent;
