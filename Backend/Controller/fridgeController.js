import Joi from "joi";
import * as fridgeService from "../Services/fridgeService.js";

export const addIngredientToFridge = async (req, res) => {
    const ingredientSchema = Joi.object({
      name: Joi.string().required(),
      amount: Joi.string().required(),
      category: Joi.string().required(),
    });
  
    const { error, value } = ingredientSchema.validate(req.body);
  
    if (error) {
      const messages = [];
      error.details.forEach((detail) => {
        const cleanMsg = detail.message.replace(/"/g, "");
        messages.push(cleanMsg);
      });
      return res.status(400).json({ message: messages });
    }
  
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
  
    try {
      const result = await fridgeService.addIngredient(userId, value);
      if (result.success) {
        return res
          .status(200)
          .json({ message: "Ingredient added successfully", ingredient: result.ingredient });
      } else {
        return res.status(result.code).json({ message: result.message });
      }
    } catch (err) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };
  
  export const removeIngredientFromFridge = async (req, res) => {
    const removeSchema = Joi.object({
      name: Joi.string().required(),
    });
  
    const { error, value } = removeSchema.validate(req.body);
  
    if (error) {
      const messages = [];
      error.details.forEach((detail) => {
        const cleanMsg = detail.message.replace(/"/g, "");
        messages.push(cleanMsg);
      });
      return res.status(400).json({ message: messages });
    }
  
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
  
    try {
      const result = await fridgeService.removeIngredient(userId, value.name);
      if (result.success) {
        return res.status(200).json({ message: "Ingredient removed successfully" });
      } else {
        return res.status(result.code).json({ message: result.message });
      }
    } catch (err) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };
  
  export const updateIngredientFromFridge = async (req, res) => {
    const updateSchema = Joi.object({
      name: Joi.string().required(),
      amount: Joi.string().required(),
      category: Joi.string().required(),
    });
  
    const { error, value } = updateSchema.validate(req.body);
   
    if (error) {
      const messages = [];
      error.details.forEach((detail) => {
        const cleanMsg = detail.message.replace(/"/g, "");
        messages.push(cleanMsg);
      });
      return res.status(400).json({ message: messages });
    }
  
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
  
    try {
      // Call your service to update the ingredient.
      const result = await fridgeService.updateIngredientInFridge(userId, value);
      if (result.success) {
        return res
          .status(200)
          .json({ message: "Ingredient updated successfully", ingredient: result.ingredient });
      } else {
        return res.status(result.code).json({ message: result.message });
      }
    } catch (err) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };
  
  // Get all ingredients from the user's fridge.
  export const getAllIngredientsFromFridge = async (req, res) => {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
  
    try {
      // Call your service to retrieve all ingredients.
      const result = await fridgeService.getAllIngredientsFromFridge(userId);
      if (result.success) {
        return res.status(200).json({ ingredients: result.ingredients });
      } else {
        return res.status(result.code).json({ message: result.message });
      }
    } catch (err) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };