import * as model from '../Models/model.js';

export const getAllIngredientsController = async (req, res) => {
    try {
        console.log("getAllIngredientsController: Received request", { query: req.query });

        const searchQuery = req.query.search?.toLowerCase();
        console.log("getAllIngredientsController: Search query", { searchQuery });

        const allIngredients = await model.getAllIngredients();
        if (allIngredients === null) {
            console.error("getAllIngredientsController: Error retrieving ingredients");
            return res.status(500).json({ message: "Error retrieving ingredients" });
        }

        console.log("getAllIngredientsController: Retrieved ingredients", { count: allIngredients.length });

        let ingredients = allIngredients;
        if (searchQuery) {
            ingredients = allIngredients.filter(ingredient =>
                ingredient.name.toLowerCase().includes(searchQuery)
            );
            console.log("getAllIngredientsController: Filtered ingredients", { count: ingredients.length });
        }

        console.log("getAllIngredientsController: Sending response", { count: ingredients.length });
        return res.status(200).json({ ingredients });
    } catch (error) {
        console.error("Error in getAllIngredientsController:", error.message);
        return res.status(500).json({ message: error.message });
    }
};
