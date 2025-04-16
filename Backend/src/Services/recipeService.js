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
        logger.error("Error fetching recipe:", error);
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
        logger.error("Error creating recipe:", error);
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
        logger.error("Error fetching saved recipes:", error);
        return { success: false, code: 500, message: "Internal server error" };
    }
}

export async function updateRecipe(recipe) {
    const updatedRecipe = await recipeService.updateRecipe(recipe);

    return updatedRecipe;
}

export async function getRecipes(cuisine, category) {
    let recipes;

    if (cuisine || category) {
        recipes = await model.getRecipesByParameters(cuisine, category)
    } else {
        recipes = await model.getAllRecipes()
    }

    if (recipes) {
        return { success: true, recipes: recipes }
    } else {
        return { success: false, message: "Failed to Retrieve All Recipes" }
    }
}

export async function deleteSavedRecipe(userId, recipeId) {
    if (!userId || !recipeId) {
        return { success: false, code: 400, message: "User ID and Recipe ID are required" };
    }

    try {
        const result = await model.deleteSavedRecipe(userId, recipeId);

        if (result) {
            logger.info(`Deleted saved recipe with ID: ${recipeId} for user: ${userId}`);
            return { success: true, message: "Saved recipe deleted successfully" };
        } else {
            logger.warn(`Failed to delete saved recipe with ID: ${recipeId} for user: ${userId}`);
            return { success: false, code: 404, message: "Saved recipe not found" };
        }
    } catch (error) {
        logger.error("Error deleting saved recipe:", error);
        return { success: false, code: 500, message: "Internal server error" };
    }
}