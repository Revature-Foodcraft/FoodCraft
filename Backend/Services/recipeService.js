import { v4 as uuidv4 } from 'uuid';
import * as model from "../Models/model.js";
import { logger } from "../util/logger.js";

export async function getRecipe({ recipeId }) {
    if (!recipeId) {
        return { success: false, code: 400, message: "Recipe ID is required" };
    }

    try {
        const recipe = await model.getRecipe(recipeId);
        return recipe
            ? { success: true, recipe }
            : { success: false, code: 404, message: "Recipe not found" };
    } catch (error) {
        console.error("Error fetching recipe:", error);
        return { success: false, code: 500, message: "Internal server error" };
    }
}

export async function createRecipe({
    name,
    description,
    reviews = [],
    ingredients = [],
    instructions = [],
    pictures = [],
    rating = 0,
    macros = {},
    category,
    cuisine
}) {
    if (!name || ingredients.length === 0 || instructions.length === 0) {
        return { success: false, code: 400, message: "Missing required fields" };
    }

    const recipeObj = {
        PK: uuidv4(),
        SK: "RECIPE",
        name,
        reviews,
        description,
        ingredients,
        instructions,
        pictures,
        rating,
        macros,
        category,
        cuisine,
        dateCreated: new Date().toISOString()
    };

    try {
        const newRecipe = await model.createRecipe(recipeObj);
        return newRecipe
            ? { success: true, message: "Recipe created successfully", recipe: recipeObj }
            : { success: false, code: 500, message: "Failed to create recipe" };
    } catch (error) {
        console.error("Error creating recipe:", error);
        return { success: false, code: 500, message: "Internal server error" };
    }
}

export async function getSavedRecipes(userId) {
    if (!userId) {
        return { success: false, code: 400, message: "User ID is required" };
    }

    try {
        const response = await model.getSavedRecipes(userId);

        if (!response || response.length === 0) {
            logger.warn("No saved recipes found for user:", userId);
            return { success: false, code: 404, message: "No saved recipes found" };
        }

        logger.info(`Fetched ${response.length} saved recipes for user: ${userId}`);
        return { success: true, recipes: response };

    } catch (error) {
        console.error("Error fetching saved recipes:", error);
        return { success: false, code: 500, message: "Internal server error" };
    }
}

export async function getAllRecipes() {
    try {
        const recipes = await model.getAllRecipes();

        if (!recipes || recipes.length === 0) {
            logger.warn("No recipes found in the database");
            return { success: false, code: 404, message: "No recipes found" };
        }

        logger.info(`Fetched ${recipes.length} recipes from the database`);
        return { success: true, recipes };

    } catch (error) {
        console.error("Error fetching all recipes:", error);
        return { success: false, code: 500, message: "Internal server error" };
    }
}

export async function getRecipesByCategory(category) {
    if (!category) {
        return { success: false, code: 400, message: "Category is required" };
    }

    try {
        const recipes = await model.getRecipesByCategory(category);

        if (!recipes || recipes.length === 0) {
            logger.warn(`No recipes found for category: ${category}`);
            return { success: false, code: 404, message: "No recipes found for the specified category" };
        }

        logger.info(`Fetched ${recipes.length} recipes for category: ${category}`);
        return { success: true, recipes };

    } catch (error) {
        console.error("Error fetching recipes by category:", error);
        return { success: false, code: 500, message: "Internal server error" };
    }
}

export async function getRecipesByCuisine(cuisine) {
    if (!cuisine) {
        return { success: false, code: 400, message: "Cuisine is required" };
    }

    try {
        const recipes = await model.getRecipesByCuisine(cuisine);

        if (!recipes || recipes.length === 0) {
            logger.warn(`No recipes found for cuisine: ${cuisine}`);
            return { success: false, code: 404, message: "No recipes found for the specified cuisine" };
        }

        logger.info(`Fetched ${recipes.length} recipes for cuisine: ${cuisine}`);
        return { success: true, recipes };

    } catch (error) {
        console.error("Error fetching recipes by cuisine:", error);
        return { success: false, code: 500, message: "Internal server error" };
    }
}
