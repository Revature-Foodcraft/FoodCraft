import { documentClient } from "../util/db.js";
import {
    GetCommand,
    PutCommand,
    UpdateCommand,
    ScanCommand,
    QueryCommand,
    DeleteCommand,
    BatchGetCommand,
} from "@aws-sdk/lib-dynamodb";
import { logger } from "../util/logger.js";

const tableName = "FoodCraft";

/*
========================
PROFILE methods
========================
*/

/**
 * @async
 * @function createUser
 * @param {Object} user  - The user object to be created.
 * {
 * username: {string} - (required)
 * password: {string} - (required)
 * account: {
 *
 *      email: {string} - (optional)
 *      first_name: {string} - (optional)
 *      last_name: {string} - (optional)
 *      } - (oprional),
 * picture: {string} - (optional) - name of picture in s3 bucket
 * }
 * @returns {Promise<Object|null>} - Return DynamoDB response object if operation successful or 'null' when there was an error
 *
 * @throws {Error} - Logs an error message if the operation fails.
 */
async function createUser(user) {
    const command = new PutCommand({
        TableName: tableName,
        Item: user,
        ReturnValues: "NONE",
    });

    try {
        await documentClient.send(command);
        logger.info(`Successfully created user ${user.username}`);
        return user;
    } catch (error) {
        logger.error(`Error while creating a user: ${error.message}`);
        return null;
    }
}

/**
 * @async
 * @function getUser
 * @param {string} userId - The id of the requested user
 * @returns {Promise<Object|null>} - object that contains user from db or 'null' if user not exist or an error occurs
 * {
 *
 * PK: {string},
 * SK: "PROFILE",
 * account:{
 *
 *      first_name: {string},
 *      last_name: {string},
 *      email: {string}
 * },
 * fridge:[] - list of objects that contais id of ingredients and amount stored,
 * password:{string},
 * recipes:[] - list of recipe ids,
 * username:{string}
 *
 * }
 *
 * @throws {Error} - Logs an error if there is an issue with the database operation.
 */
async function getUser(userId) {
    const command = new GetCommand({
        TableName: tableName,
        Key: {
            PK: `${userId}`,
            SK: "PROFILE",
        },
    });

    try {
        const response = await documentClient.send(command);
        if (response.Item) {
            logger.info(`Retrieved user: ${JSON.stringify(response.Item)}`);
            return response.Item;
        } else {
            logger.warn(`User with ID ${userId} not found`);
            return null;
        }
    } catch (error) {
        logger.error(`Error getting user ${userId}: ${error.message}`);
        return null;
    }
}

/**
 * @async
 * @function getUserByUsername
 * @param {string} username - The username of the requested user
 * @returns {Promise<Object|null>} - object that contains user from db or 'null' if user not exist or an error occurs
 * @example {
 *
 * PK: {string},
 * SK: "PROFILE",
 * account:{
 *
 *      first_name: {string},
 *      last_name: {string},
 *      email: {string}
 * },
 * fridge:[] - list of objects that contais id of ingredients and amount stored,
 * password:{string},
 * recipes:[] - list of recipe ids,
 * username:{string}
 *
 * }
 *
 * @throws {Error} - Logs an error if there is an issue with the database operation.
 */
async function getUserByUsername(username) {
    const command = new QueryCommand({
        TableName: tableName,
        IndexName: "username-index",
        KeyConditionExpression: "username = :username",
        ExpressionAttributeValues: {
            ":username": username,
        },
    });

    try {
        const response = await documentClient.send(command);
        if (response.Items && response.Items.length > 0) {
            logger.info(`Retrieved user: ${JSON.stringify(response.Items[0])}`);
            return response.Items[0];
        } else {
            logger.warn(`No user found with username ${username}`);
            return null;
        }
    } catch (error) {
        logger.error(
            `Error while getting user with username ${username}`,
            error.message
        );
        return null;
    }
}

/**
 * @async
 * @function updateUser
 * @param {Object} updatedUser - object of upsed with updated info
 * {
 * PK: {string} - (required)
 * ...otherProperties - (optional)
 * }
 * @returns {Promise<Object|null>} object that contain updated user or 'null' if error occured
 * @example
 * {
 *
 * PK: {string},
 * SK: "PROFILE",
 * account:{
 *
 *      first_name: {string},
 *      last_name: {string},
 *      email: {string}
 * },
 * fridge:[] - list of objects that contais id of ingredients and amount stored,
 * password:{string},
 * recipes:[] - list of recipe ids,
 * username:{string}
 *
 * }
 */
async function updateUser(updatedUser) {
    if (!updatedUser || !updatedUser.PK) {
        logger.error("The 'updatedUser' object must contain a 'PK' field.");
        return null;
    }
    
    let updateExpression = "SET ";
    const ExpressionAttributeNames = {};
    const ExpressionAttributeValues = {};

    Object.keys(updatedUser).forEach((key, index) => {
        if (key !== "user_id" && key !== "PK" && key !== "SK") {
            if(key == "account"){
                Object.keys(updatedUser.account).forEach((key,index)=>{
                    const attributeKey = `#acc${index}`;
                    const attributeValue = `:acc${key}`;
                    updateExpression+= `account.${attributeKey} = ${attributeValue}, `;
                    ExpressionAttributeNames[attributeKey] = key
                    ExpressionAttributeValues[attributeValue] = updatedUser.account[key]
                })
            }else{
                console.log("here")
                const attributeKey = `#key${index}`;
                const attributeValue = `:value${index}`;
                updateExpression += `${attributeKey} = ${attributeValue}, `;
                ExpressionAttributeNames[attributeKey] = key;
                ExpressionAttributeValues[attributeValue] = updatedUser[key];
            }
        }
    });

    updateExpression = updateExpression.slice(0, -2);

    const command = new UpdateCommand({
        TableName: tableName,
        Key: {
            PK: `${updatedUser.PK}`,
            SK: "PROFILE",
        },
        UpdateExpression: updateExpression,
        ExpressionAttributeNames,
        ExpressionAttributeValues,
        ReturnValues: "ALL_NEW",
    });

    try {
        const response = await documentClient.send(command);
        logger.info(`Successfully updated user: ${updatedUser.PK}`);
        return response.Attributes;
    } catch (error) {
        logger.error(`Error updating user: ${updatedUser.PK}`, error);
        return null;
    }
}

/**
 * @async
 * @function getSavedRecipes
 * @param {string} userId - id of the user from whom recipes are requested
 * @returns {Promise<Array|null>} - A promise that resolves to an array of saved recipes or null if an error occurs.
 *
 * @example
 * [
 *       { "PK": "recipe-1",
 *  "SK": "RECIPE",
 * "name": "Pasta",
 * "ingredients": ["9","4","7","2"],
 * description:{"some description"},
 * instruction:["1 instruction","2 instruction"],
 * pictures:[],
 * rating:4.4,
 * macros:{calories:500, fats:20,carbs:20,protein:20},
 * dateCreated:"2025-04-07T14:10:00.000Z"},
 *
 *   { "PK": "recipe-1",
 *  "SK": "RECIPE",
 * "name": "Pasta",
 * "ingredients": ["9","4","7","2"],
 * description:{"some description"},
 * instruction:["1 instruction","2 instruction"],
 * pictures:[],
 * rating:4.4,
 * macros:{calories:500, fats:20,carbs:20,protein:20},
 * dateCreated:"2025-04-07T14:10:00.000Z"}
 *
 */
async function getSavedRecipes(userId) {
    const profileParams = new GetCommand({
        TableName: tableName,
        Key: {
            PK: userId,
            SK: "PROFILE",
        },
    });

    try {
        let profileData;
        try {
            profileData = await documentClient.send(profileParams);
        } catch (err) {
            logger.error(
                `Error fetching user profile for user ${userId}: ${err.message}`
            );
            throw err;
        }
        if (!profileData.Item) {
            throw new Error("User profile not found");
        }

        const savedRecipeIds = profileData.Item.recipes || [];
        if (savedRecipeIds.length === 0) {
            return [];
        }

        const recipeKeys = savedRecipeIds.map((recipeId) => ({
            PK: recipeId,
            SK: "RECIPE",
        }));

        const batchParams = {
            RequestItems: {
                [tableName]: {
                    Keys: recipeKeys,
                },
            },
        };

        let recipesData;
        try {
            recipesData = await documentClient.send(new BatchGetCommand(batchParams));
        } catch (err) {
            logger.error("Error fetching recipes:", err);
            throw err;
        }

        if (Array.isArray(recipesData.Responses[tableName])) {
            return recipesData.Responses[tableName];
        } else {
            logger.warn("Recipes data is not an array or is missing.");
            return [];
        }
    } catch (error) {
        logger.error(
            `Error while fetching saved recipe IDs for user ${userId}: ${error.message}`
        );
        return null;
    }
}



/**
 * @async
 * @function deleteSavedRecipe
 * @description Removes a recipe from the user's saved recipes list.
 * @param {string} userId - The ID of the user.
 * @param {string} recipeId - The ID of the recipe to remove.
 * @returns {Promise<Array|null>} - The updated list of saved recipes or null if an error occurs.
 */
async function deleteSavedRecipe(userId, recipeId) {
    const user = await getUser(userId);
    if (!user || !user.recipes) {
        logger.warn(`User ${userId} not found or no saved recipes.`);
        return null;
    }

    const updatedRecipes = user.recipes.filter((id) => id !== recipeId);

    const command = new UpdateCommand({
        TableName: tableName,
        Key: {
            PK: `${userId}`,
            SK: "PROFILE",
        },
        UpdateExpression: "SET recipes = :updatedRecipes",
        ExpressionAttributeValues: {
            ":updatedRecipes": updatedRecipes,
        },
        ReturnValues: "ALL_NEW",
    });

    try {
        const response = await documentClient.send(command);
        logger.info(`Successfully removed recipe ${recipeId} from user ${userId}'s saved recipes.`);
        return response.Attributes.recipes;
    } catch (error) {
        logger.error(`Error removing recipe ${recipeId} for user ${userId}: ${error.message}`);
        return null;
    }
}



/**
 * @async
 * @function getUserByGoogleId
 * @param {int} googleId - The username of the requested user
 * @returns {Promise<Object|null>} - object that contains user from db or 'null' if user not exist or an error occurs
 * @example {
 *
 * PK: {string},
 * SK: "PROFILE",
 * account:{
 *
 *      first_name: {string},
 *      last_name: {string},
 *      email: {string}
 * },
 * fridge:[] - list of objects that contais id of ingredients and amount stored,
 * password:{string},
 * recipes:[] - list of recipe ids,
 * username:{string}
 *
 * }
 *
 * @throws {Error} - Logs an error if there is an issue with the database operation.
 */
async function getUserByGoogleId(googleId) {
    const command = new QueryCommand({
        TableName: tableName,
        IndexName: "SK-index",
        KeyConditionExpression: "SK = :SK",
        FilterExpression: 'googleId = :googleId',
        ExpressionAttributeValues: {
            ":SK": "PROFILE",
            ":googleId":googleId
        },
    });

    try {
        const response = await documentClient.send(command);
        if (response.Items && response.Items.length > 0) {
            logger.info(`Retrieved user: ${JSON.stringify(response.Items[0])}`);
            return response.Items[0];
        } else {
            logger.warn(`No user found with googleId ${googleId}`);
            return null;
        }
    } catch (error) {
        logger.error(
            `Error while getting user with googleId ${googleId}`,
            error.message
        );
        return null;
    }
}

/**
 * @async
 * @function addIngredientToFridge
 * @description Adds an ingredient to the user's fridge if not there. if ingredient already in the fridge add amount to it
 * @param {string} userId - The ID of the user.
 * @param {Object} ingredient - The ingredient object to add.
 * {
 * id:"123",
 * amount:4
 *
 * }
 * @returns {Promise<Array|null>} - Updated fridge array or null if an error occurs.
 */
async function addIngredientToFridge(userId, ingredient) {
    const getCommand = new GetCommand({
        TableName: tableName,
        Key: {
            PK: userId,
            SK: "PROFILE",
        },
        ProjectionExpression: "fridge",
    });

    try {
        const currentResponse = await documentClient.send(getCommand);
        const currentFridge = (currentResponse.Item && currentResponse.Item.fridge) || [];

        const existingIndex = currentFridge.findIndex((item) => item.id === ingredient.id);
        if (existingIndex !== -1) {
            currentFridge[existingIndex].amount += ingredient.amount;
            const updateExistingCommand = new UpdateCommand({
                TableName: tableName,
                Key: {
                    PK: userId,
                    SK: "PROFILE",
                },
                UpdateExpression: "SET fridge = :newFridge",
                ExpressionAttributeValues: {
                    ":newFridge": currentFridge,
                },
                ReturnValues: "ALL_NEW",
            });
            const updateResponse = await documentClient.send(updateExistingCommand);
            logger.info(`Updated ingredient amount in fridge for user ${userId}`);
            return updateResponse.Attributes.fridge;

        }

        const addCommand = new UpdateCommand({
            TableName: tableName,
            Key: {
                PK: userId,
                SK: "PROFILE",
            },
            UpdateExpression:
                "SET fridge = list_append(if_not_exists(fridge, :emptyList), :ingredient)",
            ExpressionAttributeValues: {
                ":ingredient": [ingredient],
                ":emptyList": [],
            },
            ReturnValues: "ALL_NEW",
        });

        const addResponse = await documentClient.send(addCommand);
        logger.info(`Successfully added ingredient to fridge for user ${userId}`);
        return addResponse.Attributes.fridge;
    } catch (error) {
        logger.error(`Error adding ingredient to fridge for user ${userId}: ${error.message}`);
        return null;
    }

}

/**
 * @async
 * @function removeIngredientFromFridge
 * @description Removes a specific ingredient from the user's fridge.
 * @param {string} userId - The ID of the user.
 * @param {string} ingredientId - The ID of the ingredient to remove.
 * @returns {Promise<Array|null>} - The updated fridge array or null if an error occurs.
 */
async function removeIngredientFromFridge(userId, ingredientId) {
    const user = await getUser(userId);
    if (!user || !user.fridge) {
        logger.warn(`User ${userId} not found or fridge is empty.`);
        return null;
    }

    const updatedFridge = user.fridge.filter(
        (ingredient) => ingredient.id !== ingredientId
    );

    const command = new UpdateCommand({
        TableName: tableName,
        Key: {
            PK: `${userId}`,
            SK: "PROFILE",
        },
        UpdateExpression: "SET fridge = :updatedFridge",
        ExpressionAttributeValues: {
            ":updatedFridge": updatedFridge,
        },
        ReturnValues: "ALL_NEW",
    });
    try {
        const response = await documentClient.send(command);
        logger.info(
            `Successfully removed ingredient from fridge for user ${userId}`
        );
        return response.Attributes.fridge;
    } catch (error) {
        logger.error(
            `Error removing ingredient from fridge for user ${userId}: ${error.message}`
        );
        return null;
    }
}

/**
 * @async
 * @description Changes the amount of an ingredient stored in the fridge.
 * @function updateIngredientFromFridge
 * @param {string} userId - The ID of the user.
 * @param {object} ingredient - The ingredient object with updated amount.
 * @example
 * {
 *   id: "123",
 *   amount: 5
 * }
 * @returns {Promise<Array|null>} - The updated fridge array or null if an error occurs.
 */
async function updateIngredientFromFridge(userId, ingredient) {
    const user = await getUser(userId);
    if (!user || !user.fridge) {
        logger.warn(`User ${userId} not found or fridge is empty.`);
        return null;
    }

    const fridgeCopy = [...user.fridge];
    const index = fridgeCopy.findIndex((ing) => ing.id === ingredient.id);
    if (index === -1) {
        logger.warn(
            `Ingredient ${ingredient.id} not found in fridge for user ${userId}`
        );
        return null;
    }

    fridgeCopy[index].amount = ingredient.amount;

    const command = new UpdateCommand({
        TableName: tableName,
        Key: {
            PK: `${userId}`,
            SK: "PROFILE",
        },
        UpdateExpression: "SET fridge = :updatedFridge",
        ExpressionAttributeValues: {
            ":updatedFridge": fridgeCopy,
        },
        ReturnValues: "ALL_NEW",
    });

    try {
        const response = await documentClient.send(command);
        logger.info(`Successfully updated ingredient in fridge for user ${userId}`);
        return response.Attributes.fridge;
    } catch (error) {
        logger.error(
            `Error updating ingredient in fridge for user ${userId}: ${error.message}`
        );
        return null;
    }
}

/**
 * @async
 * @function getAllIngredientsFromFridge
 * @description Retrieves all ingredients from the user's fridge.
 * @param {string} userId - The ID of the user.
 * @returns {Promise<Array|null>} - An array of ingredients from the fridge or null if an error occurs.
 */
async function getAllIngredientsFromFridge(userId) {
    const user = await getUser(userId);
    if (!user) {
        logger.warn(`User ${userId} not found`);
        return null;
    }
    return user.fridge || [];
}


/*
========================
RECIPE methods
========================
*/

/**
 * @async
 * @function createRecipe
 * @description Creates a new recipe in the database.
 * @param {Object} recipe - The recipe object to be created.
 * @example
 * {
 *   PK: "recipe-123",
 *   SK: "RECIPE",
 *   name: "Pasta",
 *   ingredients: [{
 * id:"31",
 * amount:2
 * },
 * {
 * id:"12"
 * amount:5
 * }],
 *   description: "A delicious pasta recipe",
 *   instructions: ["Boil water", "Cook pasta", "Serve"],
 *   pictures: [],
 *   rating: 4.5,
 *   reviews:[],
 *   user_id:"kj124kb1231231jbjk"
 *   macros: { calories: 500, fats: 20, carbs: 60, protein: 15 },
 *   dateCreated: "2025-04-07T14:10:00.000Z"
 *   category:"Pasta",
 */
async function createRecipe(recipe) {
    const command = new PutCommand({
        TableName: tableName,
        Item: recipe,
        ReturnValues: "ALL_NEW", // Ensures attributes are returned
    });



    try {
        const response = await documentClient.send(command);
        logger.info(`Successfully created recipe ${recipe.PK}`);
        return response.Attributes;
    } catch (error) {
        logger.error(`Error while creating a recipe: ${error.message}`);
        return null;
    }
}

/**
 * @async
 * @function getRecipe
 * @description Retrieves a recipe by its ID from the database.
 * @param {string} recipeId - The ID of the recipe to retrieve.
 * @returns {Promise<Object|null>} - The recipe object if found, or null if not found or an error occurs.
 * @example
 * {
 *   PK: "recipe-123",
 *   SK: "RECIPE",
 *   name: "Pasta",
 *   ingredients: [
 *     { id: "31", amount: 2 },
 *     { id: "12", amount: 5 }
 *   ],
 *   description: "A delicious pasta recipe",
 *   instructions: ["Boil water", "Cook pasta", "Serve"],
 *   pictures: [],
 *   rating: 4.5,
 *   reviews: [],
 *   user_id: "kj124kb1231231jbjk",
 *   macros: { calories: 500, fats: 20, carbs: 60, protein: 15 },
 *   dateCreated: "2025-04-07T14:10:00.000Z",
 *   category: "Pasta",
 *   cuisine: "Italian"
 * }
 */
async function getRecipe(recipeId) {
    const command = new GetCommand({
        TableName: tableName,
        Key: {
            PK: `${recipeId}`,
            SK: "RECIPE",
        },
    });

    try {
        const response = await documentClient.send(command);
        if (response.Item) {
            logger.info(`Retrieved recipe: ${JSON.stringify(response.Item)}`);
            return response.Item;
        } else {
            logger.warn(`Recipe with ID ${recipeId} not found`);
            return null;
        }
    } catch (error) {
        logger.error(`Error getting recipe with ID ${recipeId}: ${error.message}`);
        return null;
    }
}


/**
 * @async
 * @function updateRecipe
 * @description Modifies an existing recipe in the database with new values.
 * @param {Object} recipe - The recipe object containing updated fields.
 * @example
 * {
 *   PK: "recipe-123", // (required)
 *   ...otherParams // Fields to be updated (at least one is required)
 * }
 * @returns {Promise<Object|null>} - The updated recipe object, or null if an error occurs.
 * @example
 * {
 *   PK: "recipe-123",
 *   SK: "RECIPE",
 *   name: "Updated Pasta",
 *   ingredients: [
 *     { id: "31", amount: 3 },
 *     { id: "12", amount: 6 }
 *   ],
 *   description: "An updated delicious pasta recipe",
 *   instructions: ["Boil water", "Cook pasta", "Serve with sauce"],
 *   pictures: [],
 *   rating: 4.8,
 *   reviews: [],
 *   user_id: "kj124kb1231231jbjk",
 *   macros: { calories: 520, fats: 22, carbs: 62, protein: 16 },
async function updateRecipe(recipe) {
    if (!recipe || !recipe.PK) {
        logger.error("Invalid recipe object. 'PK' is required.");
        return null;
    }

    let updateExpression = "SET ";
    const ExpressionAttributeNames = {};
    const ExpressionAttributeValues = {};
 */
async function updateRecipe(recipe) {
    let updateExpression = "SET ";
    const ExpressionAttributeNames = {};
    const ExpressionAttributeValues = {};

    Object.keys(recipe).forEach((key, index) => {
        if (key !== "recipe_id" && key !== "PK" && key !== "SK") {
            const attributeKey = `#key${index}`;
            const attributeValue = `:value${index}`;
            updateExpression += `${attributeKey} = ${attributeValue}, `;
            ExpressionAttributeNames[attributeKey] = key;
            ExpressionAttributeValues[attributeValue] = recipe[key];
        }
    });

    updateExpression = updateExpression.slice(0, -2);

    const command = new UpdateCommand({
        TableName: tableName,
        Key: {
            PK: `${recipe.PK}`,
            SK: "RECIPE",
        },
        UpdateExpression: updateExpression,
        ExpressionAttributeNames,
        ExpressionAttributeValues,
        ReturnValues: "ALL_NEW",
    });

    try {
        const response = await documentClient.send(command);
        logger.info(`Successfully updated recipe with ID ${recipe.PK}`);
        return response.Attributes;
    } catch (error) {
        logger.error(`Error updating recipe with ID ${recipe.PK}: ${error.message}`);
        return null;
    }
}

/**
 * @async
 * @function deleteRecipe
 * @description Deletes a recipe from the database by its ID.
 * @param {string} recipeId - The ID of the recipe to delete.
 * @returns {Promise<Object|null>} - The response from DynamoDB if successful, or null if an error occurs.
 */
async function deleteRecipe(recipeId) {
    const command = new DeleteCommand({
        TableName: tableName,
        Key: {
            PK: `${recipeId}`,
            SK: "RECIPE",
        },
        ReturnValues: "ALL_OLD",
    });

    try {
        const response = await documentClient.send(command);
        if (!response.Attributes) {
            logger.warn(`Recipe with ID ${recipeId} not found in the database`);
            return null;
        }
        logger.info(`Successfully deleted recipe with ID ${recipeId}`);
        return response;
    } catch (error) {
        logger.error(`Error deleting recipe with ID ${recipeId}: ${error.message}`);
        return null;
    }
}


/**
 * Retrieves all recipes from the database.
 *
 * This function query the database table for items that has RECIPES for the GSI. It returns an array of recipe items if found,
 * or an empty array if no recipes are present.
 *
 * @async
 * @function
 * @returns {Promise<Object[]>} A promise that resolves to an array of recipe objects.
 *                              Returns an empty array if no recipes are found.
 * @throws {Error} Logs and returns an empty array if an error occurs during the database scan.
 *
 * Example response:
 * [
 *   {
 *     recipe_id: "RECIPE#001",
 *     name: "Spaghetti Bolognese",
 *     review_id: "REVIEW#001",
 *     ingredients: ["Spaghetti", "Ground Beef", "Tomato Sauce", "Onion", "Garlic"],
 *     instructions: ["Boil spaghetti", "Cook beef", "Mix with sauce"],
 *     pictures: [
 *       { name: "spaghetti.jpg", link: "https://example.com/spaghetti.jpg" }
 *     ],
 *     rating: 4.5,
 *     reviews: [],
 *     user_id: "kj124kb1231231jbjk",
 *     macros: { calories: 500, fats: 20, carbs: 60, protein: 15 },
 *     dateCreated: "2025-04-07T14:10:00.000Z",
 *     category: "Pasta",
 *     cuisine: "Italian"
 *   }
 * ]
 */
async function getAllRecipes() {
    const command = new QueryCommand({
        TableName: tableName,
        IndexName: "SK-index",
        KeyConditionExpression: "SK = :sk",
        ExpressionAttributeValues: {
            ":sk": "RECIPE",
        },
    });

    try {
        const response = await documentClient.send(command);
        if (response.Items && response.Items.length > 0) {
            logger.info(`Retrieved all recipes: ${JSON.stringify(response.Items)}`);
            return response.Items;
        } else {
            logger.warn("No recipes found");
            return [];
        }
    } catch (error) {
        logger.error(`Error while retrieving all recipes: ${error.message}`);
        return null;
    }
}

/**
 * Retrieves all recipes from the database depending on cuisine and category.
 *
 * This function query the database table for items that has RECIPES for the GSI. It returns an array of recipe items if found,
 * or an empty array if no recipes are present.
 *
 * @async
 * @function
 * @returns {Promise<Object[]>} A promise that resolves to an array of recipe objects.
 *                              Returns an empty array if no recipes are found.
 * @throws {Error} Logs and returns an empty array if an error occurs during the database scan.
 *
 * Example response:
 * [
 *   {
 *     recipe_id: "RECIPE#001",
 *     name: "Spaghetti Bolognese",
 *     review_id: "REVIEW#001",
 *     ingredients: ["Spaghetti", "Ground Beef", "Tomato Sauce", "Onion", "Garlic"],
 *     instructions: ["Boil spaghetti", "Cook beef", "Mix with sauce"],
 *     pictures: [
 *       { name: "spaghetti.jpg", link: "https://example.com/spaghetti.jpg" }
 *     ],
 *     rating: 4.5,
 *     macros: {
 *       calories: 600,
 *       protein: 25,
 *       carbs: 75,
 *       fat: 20
 *     }
 *   },
 *   {
 *     recipe_id: "RECIPE#002",
 *     name: "Chicken Salad",
 *     review_id: "REVIEW#002",
 *     ingredients: ["Chicken Breast", "Lettuce", "Tomatoes", "Cucumber", "Dressing"],
 *     instructions: ["Grill chicken", "Chop vegetables", "Mix together"],
 *     pictures: [
 *       { name: "chickensalad.jpg", link: "https://example.com/chickensalad.jpg" }
 *     ],
 *     rating: 4.8,
 *     macros: {
 *       calories: 350,
 *       protein: 30,
 *       carbs: 10,
 *       fat: 15
 *     }
 *   }
 * ]
 */
async function getRecipesByParameters(cuisine, category) {
    const filterExpression = [];
    const expressionAttributeValue = {
        ":SK": "RECIPE"
    };

    if (cuisine) {
        filterExpression.push("cuisine = :cuisine");
        expressionAttributeValue[":cuisine"] = cuisine;
    }
    if (category) {
        filterExpression.push("category = :category");
        expressionAttributeValue[":category"] = category;
    }
    const command = new QueryCommand({
        TableName: tableName,
        IndexName: "SK-index",
        KeyConditionExpression: "SK = :SK",
        FilterExpression: filterExpression.join(" AND "),
        ExpressionAttributeValues: expressionAttributeValue
    });

    try {
        const response = await documentClient.send(command);
        if (response.Items && response.Items.length > 0) {
            logger.info(`Retrieved all recipes: ${JSON.stringify(response.Items)}`);
            return response.Items;
        } else {
            logger.warn("No recipes found in the database");
            return [];
        }
    } catch (error) {
        logger.error(`Error while retrieving all recipes: ${error.message}`);
        return [];
    }
}


/* 
========================
REVIEW methods
========================
*/
/**
 * @async
 * @function createReview
 * @description Creates a new review in the database.
 * @param {Object} review - The review object to be created.
 * @example
 * {
 *   PK: "review-123",
 *   SK: "REVIEW",
 *   userId: "456",
 *   recipeId: "789",
 *   rating: 4.5,
 *   comment: "Delicious recipe!",
 *   dateCreated: "2025-04-07T14:10:00.000Z"
 * }
 * @returns {Promise<Object|null>} - Returns the DynamoDB response object or null if an error occurs.
 */
async function createReview(review) {
    const command = new PutCommand({
        TableName: tableName,
        Item: review,
    });

    try {
        const response = await documentClient.send(command);
        logger.info(`Succesfully created review ${review.PK}`);
        return response.Attributes;
    } catch (error) {
        logger.error(`Error while creating a review: ${error.message}`);
        return null;
    }
}


/**
 * @async
 * @function getReview
 * @description Retrieves a review by its ID from the database.
 * @param {string} reviewId - The ID of the review to retrieve.
 * @returns {Promise<Object|null>} - The review object if found, or null if not found or an error occurs.
 * @example
 * {
 *   PK: "review-123",
 *   SK: "REVIEW",
 *   userId: "456",
 *   recipeId: "789",
 *   rating: 4.5,
 *   comment: "Delicious recipe!",
 *   dateCreated: "2025-04-07T14:10:00.000Z"
 * }
 */
async function getReview(reviewId) {
    const command = new GetCommand({
        TableName: tableName,
        Key: {
            PK: `${reviewId}`,
            SK: "REVIEW",
        },
    });

    try {
        const response = await documentClient.send(command);
        if (response.Item) {
            logger.info(`Retrieved review: ${JSON.stringify(response.Item)}`);
            return response.Item;
        } else {
            logger.warn(`Review with ID ${reviewId} not found`);
            return null;
        }
    } catch (error) {
        logger.error(`Error getting review with ID ${reviewId}: ${error.message}`);
        return null;
    }
}

/**
 * @async
 * @function getAllReviews
 * @description Retrieves all reviews for a specific recipe.
 * @param {string} recipeId - The ID of the recipe for which reviews are requested.
 * @returns {Promise<Array|null>} - An array of reviews or null if an error occurs or no reviews are found.
 * @example
 * [
 *   {
 *     PK: "review-123",
 *     SK: "REVIEW",
 *     userId: "456",
 *     recipeId: "789",
 *     rating: 4.5,
 *     comment: "Delicious recipe!",
 *     dateCreated: "2025-04-07T14:10:00.000Z"
 *   },
 *   {
 *     PK: "review-124",
 *     SK: "REVIEW",
 *     userId: "457",
 *     recipeId: "789",
 *     rating: 4.0,
 *     comment: "Tasty but could use more seasoning.",
 *     dateCreated: "2025-04-08T10:15:00.000Z"
 *   }
 * ]
 */
async function getAllReviews(recipeId) {
    const recipe = await getRecipe(recipeId);
    if (!recipe) {
        logger.warn(`Recipe with ID ${recipeId} not found`);
        return null;
    }
    if (!recipe.reviews || recipe.reviews.length === 0) {
        logger.info(`No reviews found for recipe ${recipeId}`);
        return [];
    }
    logger.info(`Successfully retrieved all reviews for recipe ${recipeId}`);
    return recipe.reviews;
}

/**
 * @async
 * @function deleteReview
 * @description Deletes a review from the database by its ID.
 * @param {string} reviewId - The ID of the review to delete.
 * @returns {Promise<Object|null>} - The response from DynamoDB if successful, or null if an error occurs.
 */
async function deleteReview(reviewId) {
    const command = new DeleteCommand({
        TableName: tableName,
        Key: {
            PK: `${reviewId}`,
            SK: "REVIEW",
        },
        ReturnValues: "ALL_OLD",
    });

    try {
        const response = await documentClient.send(command);
        if (!response.Attributes) {
            logger.warn(`Review with ID ${reviewId} not found in the database`);
            return null;
        }
        logger.info(`Successfully deleted review with ID ${reviewId}`);
        return response;
    } catch (error) {
        logger.error(`Error deleting review with ID ${reviewId}: ${error.message}`);
        return null;
    }
}

/*
========================
INGREDIENT methods
========================
*/

/**
 * @async
 * @function createIngredient
 * @param {Object} ingredient - The ingredient object to be created.
 * {
 *   PK: {string} - autogenerated by service,
 *   SK: "INGREDIENT" - (required) unique identifier for the ingredient,
 *   name: {string} - (required) name of the ingredient,
 *   unit:{string} - (optional) unit of measurement(lb, qt, etc.)
 * }
 * @returns {Promise<Object|null>} - Returns the dynamoDb response object or null if an error occurs.
 *
 * @throws {Error} - Logs an error message if the operation fails.
 */
async function createIngredient(ingredient) {
    const command = new PutCommand({
        TableName: tableName,
        Item: ingredient,
    });

    try {
        const response = await documentClient.send(command);
        logger.info(`Successfully created ingredient ${ingredient.name}`);
        return response.Attributes;
    } catch (error) {
        logger.error(`Error while creating an ingredient: ${error.message}`);
        return null;
    }
}
/**
 * @async
 * @function getIngredientByName
 * @param {string} name - name of the ingredient
 * @returns {Promise<Object|null>} - ingredient object or 'null' if no ingredient found or error occur
 * @example
 * {
 *   PK: '124',
 *   SK: "INGREDIENT",
 *   name: "Red onions",
 *   unit: 'lb'
 * }
 */
async function getIngredientByName(name) {
    const command = new QueryCommand({
        TableName: tableName,
        IndexName: "SK-name-index",
        KeyConditionExpression: "SK = :sk AND name = :name",
        ExpressionAttributeValues: {
            ":sk": "INGREDIENT",
            ":name": name,
        },
    });

    try {
        const response = await documentClient.send(command);
        if (response.Items && response.Items.length > 0) {
            logger.info(`Retrieved ingredient: ${JSON.stringify(response.Items[0])}`);
            return response.Items[0];
        } else {
            logger.warn(`No ingredient found with name ${name}`);
            return null;
        }
    } catch (error) {
        logger.error(
            `Error while getting ingredient with name ${name}: ${error.message}`
        );
        return null;
    }
}

/**
 * @async
 * @function getAllIngredients
 * @description Retrieves all ingredients from the database.
 * @returns {Promise<Array|null>} - A promise that resolves to an array of ingredient objects or null if an error occurs.
 * @example
 * [
 *   { PK: '123', SK: 'INGREDIENT', name: 'Tomato', unit: 'lb' },
 *   { PK: '124', SK: 'INGREDIENT', name: 'Onion', unit: 'lb' }
 * ]
 */
async function getAllIngredients() {
    const command = new QueryCommand({
        TableName: tableName,
        IndexName: "SK-index",
        KeyConditionExpression: "SK = :sk",
        ExpressionAttributeValues: {
            ":sk": "INGREDIENT",
        },
    });

    try {
        const response = await documentClient.send(command);
        if (response.Items && response.Items.length > 0) {
            logger.info(
                `Retrieved all ingredients: ${JSON.stringify(response.Items)}`
            );
            return response.Items;
        } else {
            logger.warn("No ingredients found");
            return [];
        }
    } catch (error) {
        logger.error(`Error while retrieving all ingredients: ${error.message}`);
        return null;
    }
}

/**
 * Updates the daily_macros for a user.
 * @param {string} userId - The unique identifier for the user.
 * @param {object} newDailyMacros - The updated daily macros object.
 *        Example:
 *        {
 *          date: "2025-04-14T00:00:00.000Z",
 *          protein: 0,
 *          fats: 0,
 *          carbs: 0,
 *          proteinGoal: 120,
 *          fatsGoal: 70,
 *          carbsGoal: 200
 *        }
 * @returns {Promise<object|null>} - Returns the updated user attributes if successful or null if not.
 */
async function updateMacros(userId, newDailyMacros) {
    const command = new UpdateCommand({
      TableName: tableName,
      Key: {
        PK: userId,
        SK: "PROFILE",
      },
      UpdateExpression: "set daily_macros = :macros",
      ExpressionAttributeValues: {
        ":macros": newDailyMacros,
      },
      ReturnValues: "ALL_NEW",
    });
  
    try {
      const response = await documentClient.send(command);
      if (response.Attributes) {
        logger.info(`Updated daily_macros for user ${userId}: ${JSON.stringify(response.Attributes)}`);
        return response.Attributes;
      } else {
        logger.warn(`No Attributes returned after updating macros for user ${userId}`);
        return null;
      }
    } catch (error) {
      logger.error(`Error updating macros for user ${userId}: ${error.message}`);
      return null;
    }
  }

  /**
 * Retrieves the daily_macros for the current user.
 * @param {string} userId - The unique identifier for the user.
 * @returns {Promise<object|null>} - The daily_macros object if found; otherwise, null.
 */
async function getDailyMacros(userId) {
    const command = new GetCommand({
      TableName: tableName,
      Key: {
        PK: userId,
        SK: "PROFILE",
      },
    });
  
    try {
      const response = await documentClient.send(command);
      if (response.Item && response.Item.daily_macros) {
        logger.info(`Retrieved daily_macros for user ${userId}: ${JSON.stringify(response.Item.daily_macros)}`);
        return response.Item.daily_macros;
      } else {
        logger.warn(`User ${userId} or daily_macros not found`);
        return null;
      }
    } catch (error) {
      logger.error(`Error retrieving daily_macros for user ${userId}: ${error.message}`);
      return null;
    }
  }
  

export {
    // User-related functions
    createUser,
    getUser,
    getUserByUsername,
    updateUser,
    getSavedRecipes,
    deleteSavedRecipe,
    getUserByGoogleId,


    // Recipe-related functions
    createRecipe,
    getRecipe,
    updateRecipe,
    deleteRecipe,
    getAllRecipes,
    getRecipesByParameters,

    // Review-related functions
    createReview,
    getReview,
    getAllReviews,
    deleteReview,

    // Ingredient-related functions
    createIngredient,
    getIngredientByName,
    getAllIngredients,
    addIngredientToFridge,
    removeIngredientFromFridge,
    updateIngredientFromFridge,
    getAllIngredientsFromFridge,

    //Macro Functions
    updateMacros,
    getDailyMacros
};


