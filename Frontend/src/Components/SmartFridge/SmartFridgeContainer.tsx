// SmartFridgeContainer.tsx
import React, { useMemo, useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../css/SmartFridge/SmartFridge.css";
import { Ingredient, IngredientCategory } from "../../Types/Ingredient";
import CategoryComponent from "./CategoryComponent";
import AddIngredientModal from "./AddIngredientModal";
import useIngredients from "./useIngredients";

// Helper for grouping ingredients by category
const groupIngredientsByCategory = (ingredients: Ingredient[]) =>
  ingredients.reduce((acc, ingredient, idx) => {
    if (!ingredient || !ingredient.category) {
      console.error("Skipping invalid ingredient:", ingredient);
      return acc;
    }
    if (!acc[ingredient.category]) {
      acc[ingredient.category] = [];
    }
    acc[ingredient.category].push({ ingredient, index: idx });
    return acc;
  }, {} as Record<IngredientCategory, { ingredient: Ingredient; index: number }[]>);

const SmartFridgeContainer: React.FC = () => {
  const token = localStorage.getItem("token");
  const { ingredients, loading, error, addIngredient, updateIngredient, removeIngredient } = useIngredients(token);
  const [showModal, setShowModal] = useState(false);




  // Group ingredients by category
  const groupedIngredients = useMemo(() => groupIngredientsByCategory(ingredients), [ingredients]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="fridge-container">
      <header className="fridge-header">
        <h3 className="fridge-title">Smart Fridge</h3>
      </header>

      {/* Control for opening the Add Ingredient Modal */}
      {!showModal && (
        <div className="btn-container">
          <button className="btn fridge-btn add-btn" onClick={() => setShowModal(true)}>
            Add Ingredient
          </button>
        </div>
      )}

      {/* Modal for Adding Ingredient */}
      {showModal && (
        <AddIngredientModal
          onCancel={() => setShowModal(false)}
          onSubmit={async ({ id, amount }) => {
            await addIngredient({ id, amount });
            setShowModal(false);
          }}
        />
      )}

      {/* Render Grouped Ingredients */}
      {Object.keys(groupedIngredients).map((catKey) => (
        <CategoryComponent
          key={catKey}
          category={catKey as IngredientCategory}
          items={groupedIngredients[catKey as IngredientCategory]}
          onRemove={removeIngredient}
          onUpdate={updateIngredient}
        />
      ))}
    </div>
  );
};

export default SmartFridgeContainer;
