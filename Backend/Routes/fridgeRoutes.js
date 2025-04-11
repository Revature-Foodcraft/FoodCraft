import express from 'express';
import { authenticateToken } from "../Middleware/authTokenMiddleware.js"

import {
    addIngredientToFridge, removeIngredientFromFridge,
    getAllIngredientsFromFridge, updateIngredientFromFridge
} from '../Controller/fridgeController.js';

const fridgeRoutes = express.Router();

fridgeRoutes.use(authenticateToken)

/**
 * @swagger
 * /fridge:
 *   post:
 *     summary: Add a new ingredient to the user's fridge.
 *     description: Adds a new ingredient to the user's fridge. If the ingredient already exists, its amount will be updated.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 description: The unique ID of the ingredient. Required.
 *               amount:
 *                 type: number
 *                 description: The amount of the ingredient. Required.
 *     responses:
 *       200:
 *         description: Ingredient added or updated successfully.
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
 *                   example: {"id": "123", "name": "beef", "amount": 1, "category": "meat"}
 *       400:
 *         description: Bad request due to invalid input.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["id is required", "amount must be a number"]
 *       401:
 *         description: Unauthorized. Missing or invalid token.
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
fridgeRoutes.post("/", addIngredientToFridge);

/**
 * @swagger
 * /fridge:
 *   delete:
 *     summary: Remove an ingredient from the user's fridge.
 *     description: Removes an ingredient from the user's fridge by its ID.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 description: The ID of the ingredient to remove. Required.
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
 *                     example: {"id": "123", "name": "beef", "amount": 1, "category": "meat"}
 *       400:
 *         description: Bad request due to invalid input.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["id is required"]
 *       401:
 *         description: Unauthorized. Missing or invalid token.
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
 *     description: Fetches a list of all ingredients currently stored in the user's fridge.
 *     security:
 *       - bearerAuth: []
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
 *                     example: {"id": "123", "name": "beef", "amount": 1, "category": "meat"}
 *       401:
 *         description: Unauthorized. Missing or invalid token.
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
 *     description: Updates the amount of an ingredient by its ID.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 description: The ID of the ingredient to update. Required.
 *               amount:
 *                 type: number
 *                 description: The new amount for the ingredient. Required.
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
 *                   example: {"id": "123", "name": "beef", "amount": 2, "category": "meat"}
 *       400:
 *         description: Bad request due to invalid input.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["id is required", "amount must be a number"]
 *       401:
 *         description: Unauthorized. Missing or invalid token.
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