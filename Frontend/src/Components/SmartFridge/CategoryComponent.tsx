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
  items: CategoryItem[];
  onRemove: (id: string) => void;
  onUpdate: (id: string, newAmount: string) => void;
}

function CategoryComponent({ category, items, onRemove, onUpdate }: CategoryProps) {
  return (
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
}

export default CategoryComponent;
