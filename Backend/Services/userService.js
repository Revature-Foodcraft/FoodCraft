import { hashPassword } from "../util/bcyrpt.js"
import * as model from "../Models/model.js"
import { v4 as uuidv4 } from 'uuid';
import { comparePassword } from "../util/bcyrpt.js";
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import { logger } from "../util/logger.js";

dotenv.config({ override: true })

export async function createUser({ username, password, email = "", firstname = "", lastname = "", picture = "" }) {
    const hashPass = await hashPassword(password)

    const exist = await model.getUserByUsername(username)

    if (!exist) {
        const userObj = {
            PK: uuidv4(),
            SK: "PROFILE",
            username,
            password: hashPass,
            account: {
                firstname,
                lastname,
                email
            },
            picture,
            fridge: [],
            recipes: [],
            daily_macros: {}
        }

        const newUser = await model.createUser(userObj)

        if (newUser) {
            return { success: true, user: userObj }
        } else {
            return { success: false, code: 500, message: "Failed creating new user" }
        }
    } else {
        return { success: false, code: 400, message: "Username is already in use" }
    }
}

export async function loginUser({ username, password }) {
    const user = await model.getUserByUsername(username)

    if (user && await comparePassword(password, user.password)) {
        const token = jwt.sign({
            userId: user.PK
        },
            process.env.SECRET_KEY,
            {
                expiresIn: '1h'
            })

        return { success: true, message: "Login Successful", token: token }
    } else {
        return { success: false, message: "Login Failed: Incorrect Username or Password" }
    }
}
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
        console.error("Error fetching recipe:", error);
        return { success: false, code: 500, message: "Internal server error" };
    }
}
export async function createRecipe({
    name,
    review_id = null,
    ingredients = [],
    instructions = [],
    pictures = [],
    rating = null,
    macros = {}
}) {
    if (!name || ingredients.length === 0 || instructions.length === 0) {
        return { success: false, code: 400, message: "Missing required fields" };
    }

    const recipeObj = {
        PK: uuidv4(),
        SK: "RECIPE",
        name,
        review_id,
        ingredients,
        instructions,
        pictures,
        rating,
        macros,
        dateCreated: new Date().toISOString()
    };

    try {
        const newRecipe = await model.createRecipe(recipeObj);
        return newRecipe
            ? { success: true, message: "Recipe created successfully", recipe: recipeObj }
            : { success: false, code: 500, message: "Failed to create recipe" };
    } catch (error) {
        console.error("Error creating recipe:", error);
        return { success: false, code: 500, message: "Internal server error" };
    }
}


export async function getSavedRecipes(userId) {
    if (!userId) {
        return { success: false, code: 400, message: "User ID is required" };
    }

    try {
        const response = await model.getSavedRecipeIds(userId);

        if (!response || response.length === 0) {
            logger.warn("No saved recipes found for user:", userId);
            return { success: false, code: 404, message: "No saved recipes found" };
        }

        logger.info(`Fetched ${response.length} saved recipes for user: ${userId}`);
        return { success: true, recipes: response }

    } catch (error) {
        console.error("Error fetching saved recipes:", error);
        return { success: false, code: 500, message: "Internal server error" };
    }
}