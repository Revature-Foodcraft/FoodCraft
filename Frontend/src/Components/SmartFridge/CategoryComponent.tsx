import "bootstrap/dist/css/bootstrap.min.css";
import "../../css/SmartFridge/Category.css";
import { Ingredient, IngredientCategory } from "../../Types/Ingredient";
import IngredientComponent from "./IngredientComponent";

interface CategoryItem {
  ingredient: Ingredient;
}

interface CategoryProps {
  category: IngredientCategory;
  items: CategoryItem[];
  onRemove: (id: string) => void;
  onUpdate: (id: string, newAmount: number, newUnit: string) => Promise<void>; // Updated to handle asynchronous functions
}

function CategoryComponent({ category, items, onRemove, onUpdate }: CategoryProps) {
  return (
    <div className="mb-4">
      <h4 className="mb-3 text-uppercase">{category}</h4>
      <ul className="ingredient-list"> {/* Replace grid with list */}
        {items.map(({ ingredient }) => (
          <IngredientComponent
            key={ingredient.id}
            ingredient={ingredient}
            onRemove={onRemove}
            onUpdate={onUpdate}
          />
        ))}
      </ul>
    </div>


  );
}

export default CategoryComponent;
