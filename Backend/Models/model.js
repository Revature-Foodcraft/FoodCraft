import { documentClient } from '../util/db.js';
import { GetCommand, PutCommand, UpdateCommand, ScanCommand, QueryCommand, DeleteCommand, BatchGetCommand } from '@aws-sdk/lib-dynamodb';
import { logger } from '../util/logger.js'

const tableName = "FoodCraft"

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
 *      email: {string} - (oprional)
 *      first_name: {string} - (oprional)
 *      last_name: {strting} - (oprional)
 *      picture: {string} - (optional) - name of picture in s3 bucket
 *      } - (oprional)
 * }
 * @returns {Promise<Object|null>} - Return DynamoDB response object if operation successful or 'null' when there was an error
 * 
 * @throws {Error} - Logs an error message if the operation fails.
 */
async function createUser(user) {
    const command = new PutCommand({
        TableName: tableName,
        Item: user
    })

    try {
        const response = await documentClient.send(command);
        logger.info(`Succesfully created user ${user.username}`)
        return response.Attributes
    } catch (error) {
        logger.error(`Error while creating a user: ${error.message}`)
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
            SK: "PROFILE"
        }
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
        logger.error(`Error getting user ${userId}`, error);
        return null;
    };
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
            ":username": username
        }
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
        logger.error(`Error while getting user with username ${username}`, error.message);
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
    let updateExpression = "SET ";
    const ExpressionAttributeNames = {};
    const ExpressionAttributeValues = {};

    Object.keys(updatedUser).forEach((key, index) => {
        if (key !== "user_id" && key !== "PK" && key !== "SK") {
            const attributeKey = `#key${index}`;
            const attributeValue = `:value${index}`;
            updateExpression += `${attributeKey} = ${attributeValue}, `;
            ExpressionAttributeNames[attributeKey] = key;
            ExpressionAttributeValues[attributeValue] = updatedUser[key];
        }
    });

    updateExpression = updateExpression.slice(0, -2);

    const command = new UpdateCommand({
        TableName: tableName,
        Key: {
            PK: `${updatedUser.PK}`,
            SK: "PROFILE"
        },
        UpdateExpression: updateExpression,
        ExpressionAttributeNames,
        ExpressionAttributeValues,
        ReturnValues: "ALL_NEW"
    });

    try {
        const response = await documentClient.send(command);
        logger.info(`Successfully updated user: ${updatedUser.PK}`);
        return response.Attributes;
    } catch (error) {
        logger.error(`Error updating user: ${updatedUser.PK}`, error.message);
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
 * "ingredients": ["9,4,7,2], 
 * descriiption:{"some description"}, 
 * instruction:["1 instruction","2 instruction"], 
 * pictures:[], 
 * rating:4.4, 
 * macros:{calories:500, fats:20,carbs:20,protein:20}, 
 * dateCreated:"2025-04-07T14:10:00.000Z"},
 * 
 *   { "PK": "recipe-1",
 *  "SK": "RECIPE", 
 * "name": "Pasta", 
 * "ingredients": ["9,4,7,2], 
 * descriiption:{"some description"}, 
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
            SK: "PROFILE"
        },
    });

    try {
        let profileData;
        try {
            profileData = await documentClient.send(profileParams);
        } catch (err) {
            logger.error(`Error fetching user profile for user ${userId}: ${err.message}`);
            throw err;
        }
        if (!profileData.Item) {
            throw new Error("User profile not found");
        }

        const savedRecipeIds = profileData.Item.recipes || [];
        if (savedRecipeIds.length === 0) {
            return [];
        }

        const recipeKeys = savedRecipeIds.map(recipeId => ({
            PK: recipeId,
            SK: "RECIPE"
        }));

        const batchParams = {
            RequestItems: {
                [tableName]: {
                    Keys: recipeKeys,
                }
            }
        };

        let recipesData;
        try {
            recipesData = await documentClient.send(new BatchGetCommand(batchParams));
        } catch (err) {
            logger.error('Error fetching recipes:', err);
            throw err;
        }

        return recipesData.Responses[tableName];

    } catch (error) {
        logger.error(`Error while fetching saved recipe IDs for user ${userId}: ${error.message}`);
        return null;
    }
}



async function addIngredientToFridge(userId, ingredient) {
    const command = new UpdateCommand({
        TableName: tableName,
        Key: {
            PK: userId,
            SK: `PROFILE`
        },
        UpdateExpression: "SET fridge = list_append(if_not_exist(fridge, :emptyList), :ingredient)",
        ExpressionAttributeValues: {
            ":ingredient": [ingredient],
            ":emptyList": []
        },
        ReturnValues: "ALL_NEW"
    });
    try {
        const response = await documentClient.send(command);
        logger.info(`Successfully added ingredient to fridge for user ${userId}`);
        return response.Attributes.fridge;
    } catch (error) {
        logger.error(`Error adding ingredient to fridge for user ${userId}: ${error.message}`);
        return null;
    }

}

async function removeIngredientFromFridge(userId, ingredientId) {
    const user = await getUser(userId);
    if (!user || !user.fridge) {
        logger.warn(`User ${userId} not found or fridge is empty`);
        return null;
    }

    const updatedFridge = user.fridge.filter(ingredient => ingredient.id !== ingredientId);

    const command = new UpdateCommand({
        TableName: tableName,
        Key: {
            PK: `${userId}`,
            SK: "PROFILE"
        },
        UpdateExpression: "SET fridge = :updatedFridge",
        ExpressionAttributeValues: {
            ":updatedFridge": updatedFridge
        },
        ReturnValues: "ALL_NEW"
    });
    try {
        const response = await documentClient.send(command);
        logger.info(`Successfully removed ingredient from fridge for user ${userId}`);
        return response.Attributes.fridge;
    } catch (error) {
        logger.error(`Error removing ingredient from fridge for user ${userId}: ${error.message}`);
        return null;
    }

}

async function updateIngredientFromFridge(userId, ingredient) {
    const user = await getUser(userId);
    if (!user || !user.fridge) {
        logger.warn(`User ${userId} not found or fridge is empty`);
        return null;
    }

    const index = user.fridge.findIndex(ing => ing.id === ingredient.id);
    if (index === -1) {
        logger.warn(`Ingredient ${ingredient.id} not found in fridge for user ${userId}`);
        return null;
    }

    user.fridge[index].amount = ingredient.amount;

    const command = new UpdateCommand({
        TableName: tableName,
        Key: {
            PK: `${userId}`,
            SK: "PROFILE"
        },
        UpdateExpression: "SET fridge = :updatedFridge",
        ExpressionAttributeValues: {
            ":updateFridge": user.fridge
        },
        ReturnValues: "ALL_NEW"
    })


    try {
        const response = await documentClient.send(command);
        logger.info(`Successfully updated ingredient in fridge for user ${userId}`);
        return response.Attributes.fridge;
    } catch (error) {
        logger.error(`Error updating ingredient in fridge for user ${userId}: ${error.message}`);
        return null;
    }
}

async function getAllIngredientsFromFridge(userId) {
    const user = await getUser(userId);
    if (!user) {
        logger.warn(`User ${userId} not found`);
        return null;
    };
    return user.fridge || [];
}

/*
========================
RECIPE methods
========================
*/


async function createRecipe(recipe) {
    const command = new PutCommand({
        TableName: tableName,
        Item: recipe
    })

    try {
        const response = await documentClient.send(command);
        logger.info(`Succesfully created recipe ${recipe.PK}`)
        return response.Attributes
    } catch (error) {
        logger.error(`Error while creating a recipe: ${error.message}`)
        return null;
    }
}




async function getRecipe(recipeId) {
    const command = new GetCommand({
        TableName: tableName,
        Key: {
            PK: `${recipeId}`,
            SK: "RECIPE"
        }
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
            SK: "RECIPE"
        },
        UpdateExpression: updateExpression,
        ExpressionAttributeNames,
        ExpressionAttributeValues,
        ReturnValues: "ALL_NEW"
    });

    try {
        const response = await documentClient.send(command);
        logger.info(`Successfully updated recipe with ID ${recipe.PK}`);
        return response.Attributes;
    } catch (error) {
        logger.error(`Error updating recipe with ID ${recipe.PK}`, error.message);
        return null;
    }
}


async function deleteRecipe(recipeId) {
    const command = new DeleteCommand({
        TableName: tableName,
        Key: {
            PK: `${recipeId}`,
            SK: "RECIPE"
        }
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

async function getAllRecipes() {
    const command = new QueryCommand({
        TableName: tableName,
        IndexName: "SK-index",
        KeyConditionExpression: "SK = :sk",
        ExpressionAttributeValues: {
            ":sk": "RECIPE"
        }
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


/* 
========================
REVIEW methods
========================
*/



async function createReview(review) {
    const command = new PutCommand({
        TableName: tableName,
        Item: review
    })

    try {
        const response = await documentClient.send(command);
        logger.info(`Succesfully created review ${review.PK}`)
        return response.Attributes
    } catch (error) {
        logger.error(`Error while creating a review: ${error.message}`)
        return null;
    }
}


async function getReview(reviewId) {
    const command = new GetCommand({
        TableName: tableName,
        Key: {
            PK: `${reviewId}`,
            SK: "REVIEW"
        }
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


async function getAllReviews() {
    const command = new ScanCommand({
        TableName: tableName,
        FilterExpression: "begins_with(SK, :review)",
        ExpressionAttributeValues: {
            ":review": "REVIEW"
        }
    });

    try {
        const response = await documentClient.send(command);
        if (response.Items && response.Items.length > 0) {
            logger.info(`Retrieved all reviews: ${JSON.stringify(response.Items)}`);
            return response.Items;
        } else {
            logger.warn("No reviews found in the database");
            return [];
        }
    } catch (error) {
        logger.error(`Error while retrieving all reviews: ${error.message}`);
        return [];
    }
}


async function deleteReview(reviewId) {
    const command = new DeleteCommand({
        TableName: tableName,
        Key: {
            PK: `${reviewId}`,
            SK: "REVIEW"
        }
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
 *   unit:{string} - (optional) unit of mesurement(lb, qt, etc.)
 * }
 * @returns {Promise<Object|null>} - Returns the dynamoDb response object or null if an error occurs.
 * 
 * @throws {Error} - Logs an error message if the operation fails.
 */
async function createIngredient(ingredient) {
    const command = new PutCommand({
        TableName: tableName,
        Item: ingredient
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
            ":name": name
        }
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
        logger.error(`Error while getting ingredient with name ${name}: ${error.message}`);
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
            ":sk": "INGREDIENT"
        }
    });

    try {
        const response = await documentClient.send(command);
        if (response.Items && response.Items.length > 0) {
            logger.info(`Retrieved all ingredients: ${JSON.stringify(response.Items)}`);
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

export {
    createUser,
    getUser,
    getUserByUsername,
    updateUser,
    getSavedRecipes,
    createRecipe,
    getRecipe,
    updateRecipe,
    deleteRecipe,
    getAllRecipes,
    createReview,
    getReview,
    getAllReviews,
    deleteReview,
    createIngredient,
    getIngredientByName,
    getAllIngredients,
    addIngredientToFridge,
    removeIngredientFromFridge,
    updateIngredientFromFridge,
    getAllIngredientsFromFridge
}

//TODO

//TODO