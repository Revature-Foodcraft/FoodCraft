import express from 'express';
import {authenticateToken} from "../Middleware/authTokenMiddleware.js"

import {addIngredientToFridge, removeIngredientFromFridge, 
    getAllIngredientsFromFridge, updateIngredientFromFridge} from '../Controller/fridgeController.js';

const fridgeRoutes = express.Router();

fridgeRoutes.use(authenticateToken)

/**
 * @swagger
 * /fridge:
 *   post:
 *     summary: Create a new ingredient and store in the database.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Required name for the ingredient.
 *               amount:
 *                 type: string
 *                 description: Amount of certain ingredient.
 *               category:
 *                 type: string
 *                 description: Category the ingredient belongs to.
 *   
 *     responses:
 *       200:
 *         description: Ingredient added successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Ingredient added successfully
 *                 ingredient:
 *                   type: object
 *                   example: {"name":"beef", "amount": "1kg", "category": "meat"}
 *       400:
 *         description: Bad request due to invalid input.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error message
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error message
 *       500:
 *         description: Internal server error occurred.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal Server Error
 */
fridgeRoutes.post("/", addIngredientToFridge);


/**
 * @swagger
 * /fridge:
 *   delete:
 *     summary: Remove an ingredient from the user's fridge.
 *     description: Removes an ingredient from the fridge by its name.
 *     parameters:
 *       - in: query
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: The name of the ingredient to remove.
 *     responses:
 *       200:
 *         description: Ingredient removed successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Ingredient removed successfully
 *                 ingredients:
 *                   type: array
 *                   items:
 *                     type: object
 *                     example: {"name": "beef", "amount": "1kg", "category": "meat"}
 *       400:
 *         description: Bad request due to invalid input.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error message
 *       401:
 *         description: Unauthorized.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
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
 *                 message:
 *                   type: string
 *                   example: Internal Server Error
 */
fridgeRoutes.delete("/", removeIngredientFromFridge);

/**
 * @swagger
 * /fridge:
 *   get:
 *     summary: Retrieve all ingredients from the user's fridge.
 *     responses:
 *       200:
 *         description: A list of ingredients from the fridge.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ingredients:
 *                   type: array
 *                   items:
 *                     type: object
 *                     example: {"name": "beef", "amount": "1kg", "category": "meat"}
 *       401:
 *         description: Unauthorized.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
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
 *                 message:
 *                   type: string
 *                   example: Internal Server Error
 */
fridgeRoutes.get("/", getAllIngredientsFromFridge);

/**
 * @swagger
 * /fridge:
 *   put:
 *     summary: Update an ingredient in the user's fridge.
 *     description: Updates the amount and category of an ingredient by its name.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the ingredient to update.
 *               amount:
 *                 type: string
 *                 description: The new amount for the ingredient.
 *               category:
 *                 type: string
 *                 description: The new category for the ingredient.
 *     responses:
 *       200:
 *         description: Ingredient updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Ingredient updated successfully
 *                 ingredient:
 *                   type: object
 *                   example: {"name": "beef", "amount": "500g", "category": "meat"}
 *       400:
 *         description: Bad request due to invalid input.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error message
 *       401:
 *         description: Unauthorized.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
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
 *                 message:
 *                   type: string
 *                   example: Internal Server Error
 */
fridgeRoutes.put("/", updateIngredientFromFridge);

export { fridgeRoutes };