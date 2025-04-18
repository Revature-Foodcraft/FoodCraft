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
        const recipesList = (await model.getUser(userId)).recipes
        
        const updatedRecipesList = recipesList.filter(recipe => recipe !== recipeId);

        const result = await model.updateSavedRecipeList(userId, updatedRecipesList);

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
export async function updateSavedRecipeList(recipeId,userId){
    try{
        const recipesList = (await model.getUser(userId)).recipes

        console.log(recipesList)
        recipesList.push(recipeId)

        const result = await model.updateSavedRecipeList(userId,recipesList)
        if(result){
            logger.info(`Added recipe with ID: ${recipeId}  to save recipe list for user: ${userId}`);
            return {success:true, message: "Succcessfully added to saved recipe list"}
        }else{
            logger.warn(`Failed to added recipe with ID: ${recipeId} to saved recipe list for user: ${userId}`);
            return { success: false, code: 404, message: "Saved recipe not found" };
        }
        
    }catch(error){
        logger.error("Error adding to saved recipes:", error)
        return {success:false, code:500, message: "Interal server error"}
    }
}
/**
 * Creates a review as a separate record in the FoodCraft table.
 *
 * @param {Object} reviewData - Contains recipeId, user_id, and comment.
 * @returns {Promise<Object>} Returns an object indicating success or error.
 */
export async function createReview({ recipeId, user_id, comment,rating }) {
    // Validate required fields
    if (!recipeId || !user_id || !comment|| !rating) {
        return {
            success: false,
            code: 400,
            message: "Missing required fields: recipeId, user_id, and comment are required"
        };
    }

    // Build the review object
    const reviewObj = {
        PK: `REVIEW#${uuidv4()}`,      // Create a unique key for the review row.
        SK: "REVIEW",                 // Use a constant to indicate this row is a review.
        recipeId,                     // Include the recipeId so you can later query reviews for that recipe.
        user_id,
        comment,
        rating,
        dateCreated: new Date().toISOString(),
    };

    try {
        const newReview = await model.createReview(reviewObj);
        return newReview
            ? {
                  success: true,
                  message: "Review created successfully",
                  review: reviewObj
              }
            : {
                  success: false,
                  code: 500,
                  message: "Failed to create review"
              };
    } catch (error) {
        logger.error("Error creating review:", error);
        return {
            success: false,
            code: 500,
            message: "Internal server error"
        };
    }
} 

/**
 * Retrieves all reviews for a given recipe.
 *
 * @param {string} recipeId - The ID of the recipe to fetch reviews for.
 * @returns {Promise<Object>} Returns an object with success flag and reviews data.
 */
export async function getReviewsByRecipe(recipeId) {
    if (!recipeId) {
        return { success: false, code: 400, message: "Missing required field: recipeId" };
    }

    try {
        // This model method should query your FoodCraft table using the configured GSI that indexes on recipeId.
        const reviews = await model.getReviewsByRecipe(recipeId);
        return {
            success: true,
            reviews
        };
    } catch (error) {
        logger.error(`Error retrieving reviews for recipe ${recipeId}:`, error);
        return {
            success: false,
            code: 500,
            message: "Internal server error"
        };
    }
}