import express from 'express';
import {authenticateToken} from "../Middleware/authTokenMiddleware.js"

import {addIngredientToFridge, removeIngredientFromFridge, 
    getAllIngredientsFromFridge, updateIngredientFromFridge} from '../Controller/fridgeController.js';

const fridgeRoutes = express.Router();

fridgeRoutes.use(authenticateToken)

fridgeRoutes.post("/", addIngredientToFridge)


fridgeRoutes.delete("/", removeIngredientFromFridge);


fridgeRoutes.get("/", getAllIngredientsFromFridge);


fridgeRoutes.put("/", updateIngredientFromFridge);

export {fridgeRoutes};