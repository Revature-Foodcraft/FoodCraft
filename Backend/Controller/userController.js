import Joi from "joi";
import * as userService from "../Services/userService.js";

export const register = async (req, res) => {
    const accountSchema = Joi.object({
        username: Joi.string().required(),
        password: Joi.string().pattern(/^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])(?=.{8,})/).required(),
        email: Joi.string().email().optional(),
        firstname: Joi.string().optional(),
        lastname: Joi.string().optional(),
        picture: Joi.string().optional()
    })

    const { error, value } = accountSchema.validate(req.body)

    if (error) {
        const messages = [];

        error.details.forEach(detail => {
            const cleanMsg = detail.message.replace(/"/g, '')
            messages.push(cleanMsg)
        })
        return res.status(400).json({ message: messages })
    }

    const user = await userService.createUser(value)

    if (user.success) {
        return res.status(201).json({ message: "User Created", user: user.user })
    } else {
        return res.status(user.code).json({ message: user.message })
    }
}

export const login = async (req, res) => {
    const loginSchema = Joi.object({
        username: Joi.string().required(),
        password: Joi.string().pattern(/^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])(?=.{8,})/).required()
    })

    const { error, value } = loginSchema.validate(req.body)

    if (error) {
        const messages = [];

        error.details.forEach(detail => {
            const cleanMsg = detail.message.replace(/"/g, '')
            messages.push(cleanMsg)
        })
        return res.status(400).json({ message: messages })
    }

    const user = await userService.loginUser(value)

    if (user.success) {
        res.status(200).json({ message: user.message, token: user.token })
    } else {
        res.status(400).json({ message: user.message })
    }
}
export const getRecipe = async (req, res) => {
    const { recipeId } = req.params;

    if (!recipeId) {
        return res.status(400).json({ message: "Recipe ID is required" });
    }

    try {
        const recipe = await userService.getRecipe({ recipeId });

        if (recipe.success) {
            return res.status(200).json(recipe);
        } else {
            return res.status(404).json({ message: recipe.message });
        }
    } catch (error) {
        console.error("Error fetching recipe:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
export const createRecipe = async (req, res) => {

    //TODO add description and user_id
    const recipeSchema = Joi.object({
        name: Joi.string().required(),
        review_id: Joi.string().optional(),
        ingredients: Joi.array().items(Joi.string()).optional(),
        instructions: Joi.array().items(Joi.string()).optional(),
        pictures: Joi.array().items(
            Joi.object({
                name: Joi.string().required(),
                link: Joi.string().uri().required()
            })
        ).optional(),
        rating: Joi.number().min(1).max(5).optional(),
        macros: Joi.object({
            calories: Joi.number().optional(),
            protein: Joi.number().optional(),
            carbs: Joi.number().optional(),
            fat: Joi.number().optional()
        }).optional()
    });

    const { error, value } = recipeSchema.validate(req.body);
    if (error) {
        const messages = error.details.map(detail => detail.message.replace(/"/g, ''));
        return res.status(400).json({ message: messages });
    }

    const recipeObj = {

        ...value,
        dateCreated: new Date().toISOString()
    };

    try {
        console.log("Saving recipe:", recipeObj);
        const newRecipe = await userService.createRecipe(recipeObj);

        if (!newRecipe) {
            console.error("Database insertion failed:", recipeObj);
            return res.status(500).json({ success: false, message: "Failed to create recipe in database" });
        }

        console.log("Recipe saved successfully:", newRecipe);
        return res.status(201).json({ success: true, message: "Recipe created successfully", recipe: newRecipe });
    } catch (error) {
        console.error("Error creating recipe:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }

};


export const getSavedRecipes = async (req, res) => {
    try {

        const { userId } = req.locals.tokenDetail;
        const responses = await userService.getSavedRecipes(userId);

        if (responses.success) {
            return res.status(200).json({ success: true, recipes: responses.recipes });
        } else {
            return res.status(400).json({ success: false, message: responses.message });
        }
    } catch (error) {
        console.error("Error fetching saved recipes:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};
