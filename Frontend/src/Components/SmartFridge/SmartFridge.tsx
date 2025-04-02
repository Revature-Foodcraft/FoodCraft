import React, { useState } from "react";
import Ingredient, { IngredientType } from "./Ingredient";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../css/SmartFridge.css";

interface IngredientSection {
  category: string;
  items: IngredientType[];
}

const SmartFridge: React.FC = () => {
  // State holds groups of ingredients sorted by their category.
  const [ingredients, setIngredients] = useState<IngredientSection[]>([]);
  // Controls whether the add form is shown.
  const [isAdding, setIsAdding] = useState<boolean>(false);
  // Form state for the new ingredient.
  const [newIngredient, setNewIngredient] = useState<{
    name: string;
    category: string;
    amount: string;
  }>({ name: "", category: "", amount: "" });

  // Adds an ingredient to its category or creates a new section.
  const addIngredient = (
    name: string,
    amount: string,
    category: string
  ): void => {
    setIngredients((prev) => {
      const section = prev.find(
        (s) => s.category.toLowerCase() === category.toLowerCase()
      );
      if (section) {
        return prev.map((s) =>
          s.category.toLowerCase() === category.toLowerCase()
            ? { ...s, items: [...s.items, { name, amount }] }
            : s
        );
      } else {
        return [...prev, { category, items: [{ name, amount }] }];
      }
    });
  };

  // Deletes an ingredient from a category.
  const deleteIngredient = (category: string, name: string): void => {
    setIngredients((prev) =>
      prev
        .map((section) =>
          section.category.toLowerCase() === category.toLowerCase()
            ? { ...section, items: section.items.filter((item) => item.name !== name) }
            : section
        )
        .filter((section) => section.items.length > 0)
    );
  };

  // Updates the amount for a given ingredient.
  const updateAmount = (
    category: string,
    name: string,
    newAmount: string
  ): void => {
    setIngredients((prev) =>
      prev.map((section) =>
        section.category.toLowerCase() === category.toLowerCase()
          ? {
              ...section,
              items: section.items.map((item) =>
                item.name === name ? { ...item, amount: newAmount } : item
              ),
            }
          : section
      )
    );
  };

  // Handle changes for the add ingredient form.
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewIngredient((prev) => ({ ...prev, [name]: value }));
  };

  // When the form is submitted, add the ingredient and reset form state.
  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (
      newIngredient.name.trim() &&
      newIngredient.category.trim() &&
      newIngredient.amount.trim()
    ) {
      addIngredient(newIngredient.name, newIngredient.amount, newIngredient.category);
      setNewIngredient({ name: "", category: "", amount: "" });
      setIsAdding(false);
    }
  };

  return (
    <div className="container my-5">
      <h1 className="text-center mb-4">Smart Fridge</h1>
      {isAdding ? (
        <form onSubmit={handleFormSubmit} className="mb-4 border p-3 rounded">
          <div className="mb-3">
            <label htmlFor="ingredientName" className="form-label">
              Ingredient Name
            </label>
            <input
              type="text"
              id="ingredientName"
              name="name"
              className="form-control"
              placeholder="Enter ingredient name"
              value={newIngredient.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="ingredientCategory" className="form-label">
              Category
            </label>
            <input
              type="text"
              id="ingredientCategory"
              name="category"
              className="form-control"
              placeholder="Enter category (e.g., Dairy, Meat)"
              value={newIngredient.category}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="ingredientAmount" className="form-label">
              Amount
            </label>
            <input
              type="text"
              id="ingredientAmount"
              name="amount"
              className="form-control"
              placeholder="Enter amount (e.g., 1 qt, 500 g)"
              value={newIngredient.amount}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <button type="submit" className="btn btn-primary me-2">
              Add Ingredient
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setIsAdding(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : ingredients.length === 0 ? (
        <div className="text-center p-4">
          <p>Your fridge is empty.</p>
          <button className="btn btn-primary" onClick={() => setIsAdding(true)}>
            Add Ingredient
          </button>
        </div>
      ) : (
        <>
          {ingredients.map((section) => (
            <div key={section.category} className="mb-4">
              <h2 className="border-bottom pb-2">{section.category}</h2>
              {section.items.map((item) => (
                <Ingredient
                  key={item.name}
                  ingredient={item}
                  category={section.category}
                  onDelete={deleteIngredient}
                  onUpdate={updateAmount}
                />
              ))}
            </div>
          ))}
          {/* Global button to add another ingredient */}
          <div className="text-center mt-4">
            <button className="btn btn-secondary" onClick={() => setIsAdding(true)}>
              Add Ingredient
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default SmartFridge;