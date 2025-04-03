import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../css/SmartFridge/Category.css";
import { Ingredient, IngredientCategory } from "../../Types/Ingredient";
import IngredientComponent from "./IngredientComponent";

interface CategoryItem {
  ingredient: Ingredient;
}

interface CategoryProps {
  category: IngredientCategory;
  // The items here include the ingredient.
  items: CategoryItem[];
  onRemove: (id: string) => void; // onRemove now receives an id.
   onUpdate: (id: string, newAmount: string) => void;
}

const CategoryComponent: React.FC<CategoryProps> = ({ category, items, onRemove, onUpdate }) => (
  <div>
    <h3>{category}</h3>
    {items.map(({ ingredient }) => (
      <IngredientComponent key={ingredient.id} ingredient={ingredient} onRemove={onRemove} onUpdate={onUpdate} />
    ))}
  </div>
);

export default CategoryComponent;
