// routes/ingredientRoutes.js
import express from "express";
import { authenticateToken } from "../Middleware/authTokenMiddleware.js"
import { getAllIngredientsController } from "../Controller/ingredientController.js";

const router = express.Router();
//router.use(authenticateToken)


// This route will handle fetching all available ingredients
router.get("/", getAllIngredientsController);

export default router;