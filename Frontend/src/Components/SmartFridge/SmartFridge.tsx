import React, { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../css/SmartFridge/SmartFridge.css";
import { Ingredient, IngredientCategory } from "../../Types/Ingredient";
import CategoryComponent from "./CategoryComponent";

// Group ingredients by category while retaining their original index.
// (The index is still produced by grouping, but we now use the ID for deletion.)
const groupIngredientsByCategory = (
  ingredients: Ingredient[]
): Record<IngredientCategory, { ingredient: Ingredient; index: number }[]> =>
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

const SmartFridge: React.FC = () => {
  const [ingredientList, setIngredientList] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // State for the form inputs.
  const [newIngredient, setNewIngredient] = useState({
    name: "",
    category: IngredientCategory.Meat, // Default category selection
    amount: "", // Free-form text
  });

  // State for showing the modal.
  const [showModal, setShowModal] = useState(false);


  const token = localStorage.getItem("token");

  const fetchIngredients = async () => {
    try {
      if (!token) {
        throw new Error("No token found in localStorage");
      }
      const response = await fetch("http://localhost:5000/fridge/", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Fetched data:", data);
      const ingredientsData: Ingredient[] = data.ingredients
        .filter((item: any) => item && item.category)
        .map((item: any) => ({
          ...item,
          category: item.category as IngredientCategory,
        }));
      setIngredientList(ingredientsData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch ingredients when the component mounts.
  useEffect(() => {
    fetchIngredients();
  }, []);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    // Only update the form state; this does not affect the ingredient list.
    setNewIngredient((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Create new ingredient without an id (the backend will generate one).
    const ingredientToAdd = {
      name: newIngredient.name,
      category: newIngredient.category as IngredientCategory,
      amount: newIngredient.amount,
    };

    if (!ingredientToAdd.name || !ingredientToAdd.category || !ingredientToAdd.amount) {
      console.error("Invalid ingredient:", ingredientToAdd);
      return; // Abort submission
    }

    try {
      console.log("Adding ingredient:", JSON.stringify(ingredientToAdd));
      const response = await fetch("http://localhost:5000/fridge/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(ingredientToAdd),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      // Refresh the ingredient list after successfully adding.
      await fetchIngredients();

      // Reset the form inputs.
      setNewIngredient({ name: "", category: IngredientCategory.Meat, amount: "" });
       setShowModal(false); // close modal on successful submit
    } catch (error: any) {
      console.error("Error adding ingredient:", error.message);
    }
  };



  const updateIngredient = async (id: string, newAmount: string) => {
    if (!id) {
      console.error("No valid ingredient ID to update");
      return;
    }
    console.log("Updating ingredient with id:", id, "to new amount:", newAmount);
    try {
      const response = await fetch("http://localhost:5000/fridge/", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id, amount: newAmount }),
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const data = await response.json();
      console.log(data.message);
      await fetchIngredients();
    } catch (error: any) {
      console.error("Error updating ingredient:", error.message);
    }
  };

  // Removal function now accepts the ingredient's unique id.
 const removeIngredient = async (id: string) => {
  if (!id) {
    console.error("No valid ingredient ID to delete");
    return;
  }
  console.log("Deleting ingredient with id:", id);
  try {
    const response = await fetch("http://localhost:5000/fridge/", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id }),
    });
    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }
    const data = await response.json();
    console.log(data.message);
    await fetchIngredients();
  } catch (error: any) {
    console.error("Error removing ingredient:", error.message);
  }
};

  // Group ingredients by category (recalculated only when ingredientList changes)
  const groupedIngredients = useMemo(
    () => groupIngredientsByCategory(ingredientList),
    [ingredientList]
  );

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  
return (
  <div className="container mt-5">
    <div className="row text-center mb-4">
      <h3 className="display-6">Smart Fridge</h3>
    </div>

    {/* Add Ingredient Button */}
    {!showModal && (
      <div className="text-center mb-4">
        <button className="btn btn-primary btn-lg" onClick={() => setShowModal(true)}>
          Add Ingredient
        </button>
      </div>
    )}

    {/* Modal Overlay for Adding Ingredient */}
    {showModal && (
      <div className="modal-overlay" onClick={() => setShowModal(false)}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h5 className="modal-title">Add Ingredient</h5>
            <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleFormSubmit}>
              <div className="form-group mb-3">
                <label>Name:</label>
                <input type="text" name="name" value={newIngredient.name} onChange={handleInputChange} className="form-control" required />
              </div>
              <div className="form-group mb-3">
                <label>Category:</label>
                <select name="category" value={newIngredient.category} onChange={handleInputChange} className="form-select">
                  {Object.values(IngredientCategory).map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div className="form-group mb-3">
                <label>Amount:</label>
                <input type="text" name="amount" value={newIngredient.amount} onChange={handleInputChange} className="form-control" required />
              </div>
              <div className="text-end">
                <button type="button" className="btn btn-secondary me-2" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">Save</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    )}

    {/* Display Categories and Ingredients */}
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
export default SmartFridge;
