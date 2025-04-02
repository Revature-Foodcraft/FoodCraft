import React from "react";

import 'bootstrap/dist/css/bootstrap.min.css';
import '../../css/Ingredient.css'



export interface IngredientType {
  name: string;
  amount: string;
  // Future fields (like expiration date) can be added here.
}

interface IngredientProps {
  ingredient: IngredientType;
  category: string;
  onDelete: (category: string, name: string) => void;
  onUpdate: (category: string, name: string, newAmount: string) => void;
}

const Ingredient: React.FC<IngredientProps> = ({
  ingredient,
  category,
  onDelete,
  onUpdate,
}) => {
  const { name, amount } = ingredient;

  const handleAmountChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    onUpdate(category, name, e.target.value);
  };

  return (
    <div className="d-flex align-items-center justify-content-between bg-light p-2 my-1 rounded">
      <span>
        {name} - {amount}
      </span>
      <input
        type="text"
        placeholder="New amount"
        onChange={handleAmountChange}
        className="form-control me-2"
        style={{ width: "100px" }}
      />
      <button
        className="btn btn-danger"
        onClick={() => onDelete(category, name)}
      >
        Delete
      </button>
    </div>
  );
};

export default Ingredient;