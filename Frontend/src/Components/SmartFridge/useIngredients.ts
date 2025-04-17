import { useState, useEffect, useCallback } from "react";
import { Ingredient, IngredientCategory } from "../../Types/Ingredient";

const useIngredients = (token: string | null) => {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Stable fetch function with useCallback for proper dependency management
  const fetchIngredients = useCallback(async () => {
    try {
      if (!token) throw new Error("No token found");
      const response = await fetch("http://localhost:5000/fridge/", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      console.log(data);
      
      const ingredientsData: Ingredient[] = data.ingredients
        .filter((item: any) => item && item.category)
        .map((item: any) => ({
          ...item,
          category: item.category as IngredientCategory,
        }));
      setIngredients(ingredientsData);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Initial fetch when the hook mounts or the token changes
  useEffect(() => {
    fetchIngredients();
  }, [fetchIngredients]);

  const addIngredient = async ({ id, amount, category, name, unit }: { id: string; amount: number; category: string; name: string; unit: string }) => {
    try {
      const response = await fetch("http://localhost:5000/fridge/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id, amount, category, name, unit }), // Ensure unit is included
      });
      if (!response.ok) {
        let errorMessage = response.statusText;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || JSON.stringify(errorData);
        } catch (parseError) {
          errorMessage = await response.text();
        }
        throw new Error(`Error: ${response.status} ${response.statusText} - ${errorMessage}`);
      }
      await fetchIngredients();
    } catch (error: any) {
      console.error("Error adding ingredient:", error.message);
    }
  };

  const updateIngredient = async (id: string, newAmount: number, newUnit: string) => {
    try {
      const response = await fetch("http://localhost:5000/fridge/", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id, amount: Number(newAmount), unit: newUnit }), // Ensure amount is sent as a number
      });
      if (!response.ok) throw new Error(`Error: ${response.statusText}`);
      await fetchIngredients();
    } catch (error: any) {
      console.error("Error updating ingredient:", error.message);
    }
  };

  const removeIngredient = async (id: string) => {
    try {
      const response = await fetch("http://localhost:5000/fridge/", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id }),
      });
      if (!response.ok) throw new Error(`Error: ${response.statusText}`);
      await fetchIngredients();
    } catch (error: any) {
      console.error("Error removing ingredient:", error.message);
    }
  };

  return { ingredients, loading, error, addIngredient, updateIngredient, removeIngredient, fetchIngredients };
};

export default useIngredients;
