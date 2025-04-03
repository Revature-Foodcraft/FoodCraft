import express from 'express';
import { getRecipe, createRecipe, getSavedRecipes, updateRecipe } from '../Controller/recipeController.js';
import { authenticateToken } from '../Middleware/authTokenMiddleware.js'
const recipeRouter = express.Router();
recipeRouter.post('/addRecipe', createRecipe)
recipeRouter.get('/recipe/:recipeId', getRecipe);
recipeRouter.get('/account/recipes', authenticateToken, getSavedRecipes)
recipeRouter.put("/update/info/:recipeID", updateRecipe)
export default recipeRouter;