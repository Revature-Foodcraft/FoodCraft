import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../css/SmartFridge/Ingredient.css";
import { Ingredient } from "../../Types/Ingredient";
import { FaTrash } from "react-icons/fa";

interface IngredientProps {
  ingredient: Ingredient;
  onRemove: (id: string) => void;
  onUpdate: (id: string, newAmount: number, newUnit: string) => void;
}

function IngredientComponent({ ingredient, onRemove, onUpdate }: IngredientProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedAmount, setEditedAmount] = useState<number>(ingredient.amount);
  const [editedUnit, setEditedUnit] = useState<string>(ingredient.unit || "g");

  const handleSave = () => {
    // Convert editedAmount to string before passing to onUpdate
    onUpdate(ingredient.id, editedAmount, editedUnit);
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
                type="number"
                className="input-field"
                value={editedAmount}
                onChange={(e) => setEditedAmount(Number(e.target.value))}
              />
              <select
                className="unit-dropdown"
                value={editedUnit}
                onChange={(e) => setEditedUnit(e.target.value)}
              >
                <option value="g">g</option>
                <option value="kg">kg</option>
                <option value="oz">oz</option>
                <option value="lb">lb</option>
                <option value="ml">ml</option>
                <option value="l">l</option>
                <option value="qt">qt</option>
              </select>
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
              {ingredient.amount} {ingredient.unit || "g"}
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
