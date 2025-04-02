import React from "react";

import 'bootstrap/dist/css/bootstrap.min.css';
import '../../css/SmartFridge/Ingredient.css'

import { Ingredient } from "../../Types/Ingredient";


interface IngredientProps {
  ingredient: Ingredient;
  index: number; // index in the parent's state array
  onRemove: (index: number) => void;
}



const IngredientComponent: React.FC<IngredientProps> = ({ingredient, index, onRemove}) => {
 

  return (
    <div className="container">
      <div className="ingredient-container">
        <p>{ingredient.name} - Amount {ingredient.amount}</p>
        <button
        onClick={() => onRemove(index)}
        title="Remove Ingredient"
        style={{
          border: 'none',
          background: 'transparent',
          cursor: 'pointer',
          fontSize: '18px',
        }}
      >
        &#x1F5D1;
      </button>
      </div>
    </div>)
};

export default IngredientComponent;