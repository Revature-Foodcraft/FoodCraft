import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../css/SmartFridge/SmartFridge.css";
import { Ingredient, IngredientCategory } from "../../Types/Ingredient";
import CategoryComponent from "./CategoryComponent";




// Group ingredients by category while retaining their original index.
const groupIngredientsByCategory = (ingredients: Ingredient[]): Record<IngredientCategory, { ingredient: Ingredient; index: number }[]> =>
  ingredients.reduce((acc, ingredient, idx) => {
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

     useEffect(() => {
    async function fetchIngredients() {
      try {
        const token = localStorage.getItem('token');
    if (!token) {
      throw new Error("No token found in localStorage");
    }
        const response = await fetch("http://localhost:5000/fridge/", {
  method: "GET",
  headers: {
    Authorization: `Bearer ${token}`, // Replace `token` with the actual token variable
  },
});
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Fetched data:", data);

        // Extract the `ingredients` array from the API response
        const ingredientsData: Ingredient[] = data.ingredients.map((item: any) => ({
          ...item,
          category: item.category as IngredientCategory,
        }));

        setIngredientList(ingredientsData); // Update the state with fetched ingredients
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchIngredients();
  }, []);
    

  // State for the form inputs.
  const [newIngredient, setNewIngredient] = useState({
    name: '',
    category: IngredientCategory.Meat, // default category selection
    amount: "",
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewIngredient((prev) => ({
      ...prev,
      [name]: name === 'amount' ? Number(value) : value,
    }));
  };

  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Append the new ingredient at the end of the parent's list.
    const ingredientToAdd: Ingredient = {
      name: newIngredient.name,
      category: newIngredient.category as IngredientCategory,
      amount: newIngredient.amount,
    };

    setIngredientList((prev) => [...prev, ingredientToAdd]);
    setNewIngredient({ name: '', category: IngredientCategory.Meat, amount: "" });
  };

  // Removal using the parent's index.
  const removeIngredient = (indexToRemove: number) => {
    setIngredientList((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  // Group ingredients by category, retaining each ingredient’s original index.
  const groupedIngredients = groupIngredientsByCategory(ingredientList);

  return (
      <div className="container">
           <div className='row text-center'>
                <h3>Smart Fridge</h3>
          </div>
          <div className="row" id="fridge-container">
<form
        onSubmit={handleFormSubmit}
        style={{ marginBottom: '20px', padding: '10px', border: '1px solid lightgray' }}
      >
        <div style={{ marginBottom: '8px' }}>
          <label>
            Name:&nbsp;
            <input
              type="text"
              name="name"
              value={newIngredient.name}
              onChange={handleInputChange}
              required
            />
          </label>
        </div>
        <div style={{ marginBottom: '8px' }}>
          <label>
            Category:&nbsp;
            <select
              name="category"
              value={newIngredient.category}
              onChange={handleInputChange}
            >
              {Object.values(IngredientCategory).map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div style={{ marginBottom: '8px' }}>
          <label>
            Amount:&nbsp;
            <input
              type="number"
              name="amount"
              value={newIngredient.amount}
              onChange={handleInputChange}
              required
              min="1"
            />
          </label>
        </div>
        <button type="submit" style={{ marginTop: '10px' }}>
          Add Ingredient
        </button>
      </form>

          {Object.keys(groupedIngredients).map((catKey) => (
        <CategoryComponent
          key={catKey}
          category={catKey as IngredientCategory}
          items={groupedIngredients[catKey as IngredientCategory]}
                  onRemove={removeIngredient}
              />
      ))}

            
             
          </div>
      </div>
  );
};

export default SmartFridge;