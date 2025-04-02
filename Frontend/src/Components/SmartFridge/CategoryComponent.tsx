import React from "react";

import 'bootstrap/dist/css/bootstrap.min.css';
import '../../css/SmartFridge/Category.css'
import { Ingredient, IngredientCategory } from "../../Types/Ingredient";
import IngredientComponent from "./IngredientComponent";

interface CategoryItem {
  ingredient: Ingredient;
  index: number;
}

interface CategoryProps {
  category: IngredientCategory;
  // The items here include both the ingredient and its parent's index.
  items: CategoryItem[];
  onRemove: (index: number) => void;
}
const CategoryComponent: React.FC<CategoryProps> = ({ category, items, onRemove }) => (

  <div>
    <h3>{category}</h3>
      {items.map(({ ingredient, index }) => (
        <IngredientComponent key={index} ingredient={ingredient} index={index} onRemove={onRemove} />
      ))}
  </div>
)

export default CategoryComponent;
