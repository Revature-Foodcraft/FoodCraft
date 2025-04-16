import express from 'express';
import { getRecipe, createRecipe, updateRecipe, getRecipes } from '../Controller/recipeController.js';
import { authenticateToken } from '../Middleware/authTokenMiddleware.js'

/**
 * @swagger
 * /addRecipe:
 *   post:
 *     summary: Add a new recipe.
 *     description: Allows an authenticated user to create a new recipe by providing recipe details.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the recipe. Required.
 *               description:
 *                 type: string
 *                 description: A brief description of the recipe. Optional.
 *               ingredients:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: The ID of the ingredient. Required.
 *                     amount:
 *                       type: number
 *                       description: The amount of the ingredient. Required.
 *               instructions:
 *                 type: array
 *                 items:
 *                   type: string
 *                   description: Step-by-step instructions for the recipe. Required.
 *               pictures:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       description: The name of the picture. Required.
 *                     link:
 *                       type: string
 *                       format: uri
 *                       description: The URL of the picture. Required.
 *               rating:
 *                 type: number
 *                 description: The rating of the recipe. Optional.
 *                 example: 4.5
 *               macros:
 *                 type: object
 *                 properties:
 *                   calories:
 *                     type: number
 *                     description: The number of calories. Optional.
 *                   protein:
 *                     type: number
 *                     description: The amount of protein. Optional.
 *                   carbs:
 *                     type: number
 *                     description: The amount of carbohydrates. Optional.
 *                   fat:
 *                     type: number
 *                     description: The amount of fat. Optional.
 *               category:
 *                 type: string
 *                 description: The category of the recipe. Optional.
 *               cuisine:
 *                 type: string
 *                 description: The cuisine type of the recipe. Optional.
 *     responses:
 *       201:
 *         description: Recipe created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Recipe created successfully
 *                 recipe:
 *                   type: object
 *                   example: {
 *                     "name": "Pasta",
 *                     "description": "A delicious pasta recipe",
 *                     "ingredients": [{"id": "123", "amount": 2}],
 *                     "instructions": ["Boil water", "Cook pasta"],
 *                     "rating": 4.5,
 *                     "category": "Italian",
 *                     "cuisine": "Italian"
 *                   }
 *       400:
 *         description: Bad request due to missing or invalid input.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Missing required fields
 *       401:
 *         description: Unauthorized. Missing or invalid token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Unauthorized
 *       500:
 *         description: Internal server error occurred.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Internal server error
 */

/**
 * @swagger
 * /{recipeId}:
 *   get:
 *     summary: Retrieve a recipe by ID.
 *     description: Fetches the details of a recipe using its unique ID.
 *     parameters:
 *       - in: path
 *         name: recipeId
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique ID of the recipe.
 *     responses:
 *       200:
 *         description: Recipe retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 recipe:
 *                   type: object
 *                   example: {
 *                     "name": "Pasta",
 *                     "description": "A delicious pasta recipe",
 *                     "ingredients": [{"id": "123", "amount": 2}],
 *                     "instructions": ["Boil water", "Cook pasta"],
 *                     "rating": 4.5,
 *                     "category": "Italian",
 *                     "cuisine": "Italian"
 *                   }
 *       400:
 *         description: Bad request due to missing or invalid recipe ID.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Recipe ID is required
 *       404:
 *         description: Recipe not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Recipe not found
 *       500:
 *         description: Internal server error occurred.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Internal server error
 */

/**
 * @swagger
 * /update/info/{recipeID}:
 *   put:
 *     summary: Update a recipe's information.
 *     description: Updates the details of an existing recipe using its unique ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: recipeID
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique ID of the recipe to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The updated name of the recipe. Optional.
 *               description:
 *                 type: string
 *                 description: The updated description of the recipe. Optional.
 *               ingredients:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: The ID of the ingredient. Optional.
 *                     amount:
 *                       type: number
 *                       description: The updated amount of the ingredient. Optional.
 *               instructions:
 *                 type: array
 *                 items:
 *                   type: string
 *                   description: The updated instructions for the recipe. Optional.
 *               rating:
 *                 type: number
 *                 description: The updated rating of the recipe. Optional.
 *               category:
 *                 type: string
 *                 description: The updated category of the recipe. Optional.
 *               cuisine:
 *                 type: string
 *                 description: The updated cuisine type of the recipe. Optional.
 *     responses:
 *       200:
 *         description: Recipe updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Recipe updated successfully
 *                 recipe:
 *                   type: object
 *                   example: {
 *                     "name": "Updated Pasta",
 *                     "description": "An updated delicious pasta recipe",
 *                     "ingredients": [{"id": "123", "amount": 3}],
 *                     "instructions": ["Boil water", "Cook pasta", "Serve"],
 *                     "rating": 4.8,
 *                     "category": "Italian",
 *                     "cuisine": "Italian"
 *                   }
 *       400:
 *         description: Bad request due to missing or invalid input.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Missing required fields
 *       401:
 *         description: Unauthorized. Missing or invalid token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Unauthorized
 *       404:
 *         description: Recipe not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Recipe not found
 *       500:
 *         description: Internal server error occurred.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Internal server error
 */

const recipeRouter = express.Router();
recipeRouter.post('/addRecipe', authenticateToken, createRecipe)
recipeRouter.get('/:recipeId', getRecipe);
recipeRouter.get('/', getRecipes);
recipeRouter.put("/update/:recipeID", authenticateToken, updateRecipe)
export default recipeRouter;