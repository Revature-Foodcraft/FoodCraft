// SmartFridgeContainer.tsx
import React, { useMemo, useState } from "react";
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
    <div className="fridge-container container">
      <header className="text-center fridge-header">
        <h3 className=" fridge-title">Smart Fridge</h3>
      </header>

      {/* Control for opening the Add Ingredient Modal */}
      {!showModal && (
        <div className="btn-container" style={{ marginTop: '20px' }}>
          <button className="btn btn-warning btn-lg rounded-pill shadow-sm btn-custom" onClick={() => setShowModal(true)}>
            Add Ingredient
          </button>
        </div>
      )}

      {/* Modal for Adding Ingredient */}
      {showModal && (
        <AddIngredientModal
          onCancel={() => setShowModal(false)}
          onSubmit={async ({ id, amount, category, name, unit }) => {
            console.log("Adding Ingredient:", { id, amount, category, name, unit });

            await addIngredient({ id, amount, category, name, unit });
            setShowModal(false);
          }}
        />
      )}

      {/* Wrap grouped ingredients in a scrollable container */}
      <div className="fridge-content">
        {Object.keys(groupedIngredients).map((catKey: string) => (
          <CategoryComponent
            key={catKey}
            category={catKey as IngredientCategory}
            items={groupedIngredients[catKey as IngredientCategory]}
            onRemove={(id: string) => removeIngredient(id)}
            onUpdate={(id: string, newAmount: number, newUnit: string) => updateIngredient(id, newAmount, newUnit)}
          />
        ))}
      </div>
    </div>
  );
};

export default SmartFridgeContainer;
