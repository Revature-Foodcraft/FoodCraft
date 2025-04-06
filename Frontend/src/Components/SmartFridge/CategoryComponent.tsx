import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../css/SmartFridge/SmartFridge.css";
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
  <div className="mb-4">
  <h4 className="mb-3 text-uppercase">{category}</h4>
  <div className="row">
    {items.map(({ ingredient }) => (
      <div key={ingredient.id} className="col-md-4 mb-3">
        <IngredientComponent ingredient={ingredient} onRemove={onRemove} onUpdate={onUpdate} />
      </div>
    ))}
  </div>
</div>

);

export default CategoryComponent;
