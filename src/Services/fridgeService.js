import * as model from "../Models/model.js";

async function addIngredient(userId, ingredient) {
  try {
    const fullIngredient = {
      ...ingredient,
    }
    const fridge = await model.addIngredientToFridge(userId, fullIngredient);
    if (!fridge) {
      return { success: false, code: 500, message: "Unable to add ingredient." };
    }
    return {
      success: true,
      code: 200,
      message: "Ingredient added successfully.",
      ingredients: fridge
    };
  } catch (error) {
    return { success: false, code: 500, message: error.message };
  }
}

async function removeIngredient(userId, ingredientId) {
  try {
    const fridge = await model.removeIngredientFromFridge(userId, ingredientId);
    if (!fridge) {
      return { success: false, code: 500, message: "Unable to remove ingredient." };
    }
    return {
      success: true,
      code: 200,
      message: "Ingredient removed successfully.",
      ingredients: fridge
    };
  } catch (error) {
    return { success: false, code: 500, message: error.message };
  }
}

async function updateIngredientInFridge(userId, ingredientUpdate) {
  try {
    const fridge = await model.updateIngredientFromFridge(userId, ingredientUpdate);
    if (!fridge) {
      return {
        success: false,
        code: 404,
        message: "Ingredient not found or update failed."
      };
    }
    return {
      success: true,
      code: 200,
      message: "Ingredient updated successfully.",
      ingredients: fridge
    };
  } catch (error) {
    return { success: false, code: 500, message: error.message };
  }
}

async function getAllIngredientsFromFridge(userId) {
  try {
    const fridge = await model.getAllIngredientsFromFridge(userId);
    if (fridge === null) {
      return {
        success: false,
        code: 404,
        message: "User not found or no ingredients available."
      };
    }
    return { success: true, code: 200, ingredients: fridge };
  } catch (error) {
    return { success: false, code: 500, message: error.message };
  }
}

export {
  addIngredient,
  removeIngredient,
  updateIngredientInFridge,
  getAllIngredientsFromFridge
};
