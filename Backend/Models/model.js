import { documentClient } from '../util/db.js';
import { GetCommand, PutCommand, UpdateCommand, ScanCommand, QueryCommand, DeleteCommand, BatchGetCommand } from '@aws-sdk/lib-dynamodb';
import { logger } from '../util/logger.js'


const tableName = "FoodCraft"

//TODO picture upload and change picture view in recipe
/**
 * Asynchronously creates a new user in the database.
 *
 * @async
 * @function createUser
 * @param {Object} user - The user object to be created. 
 * The object should be structured as follows:
 * {
 *   username: {string} - The username of the user (required).
 *   password: {string} - The password for the user (required).
 *   email: {string} - The email of the user (optional).
 *   firstname: {string} - The firstname of the user (optional).
 *   lastname: {string} - The lastname of the user (optional). 
 *   picture: {string} - The url of the profile picture of the user (optional) || later change to picture name that will be in the s3 bucket
 * }
 * @returns {Promise<Object|null>} - Returns the response object from the database operation if successful, 
 * or `null` if an error occurs. The response object from the PutCommand in DynamoDB typically contains:
 * {
 *   $metadata: {
 *     httpStatusCode: {number} - The HTTP status code of the operation.
 *     requestId: {string} - The unique identifier for the request.
 *     extendedRequestId: {string} - Additional request identifier (if available).
 *     cfId: {string} - CloudFront ID (if applicable).
 *     attempts: {number} - The number of retry attempts made.
 *     totalRetryDelay: {number} - The total delay (in milliseconds) due to retries.
 *   }
 * }
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
        logger.info(`Successfully created user ${user.username}`)
        return response
    } catch (error) {
        logger.error(`Error while creating a user: ${error.message}`)
        return null;
    }
}

/**
 * Retrieves a user profile from the database based on the provided user ID.
 *
 * @async
 * @function getUser
 * @param {string} userId - The unique identifier of the user to retrieve.
 * @returns {Promise<Object|null>} A promise that resolves to the user profile object if found,
 * or `null` if the user does not exist or an error occurs.
 *
 * Example structure of `response.Item`:
 * {
 *   PK: "12345",
 *   SK: "PROFILE",
 *   account: {
 *     firstname: "John",
 *     email: "johndoe@example.com",
 *     lastname: "Doe"
 *   },
 *   daily_macros: {},
 *   fridge: [],
 *   password: "some_hashed_password",
 *   recipes: [],
 *   username: "user1"
 * }
 *
 * @throws {Error} Logs an error if there is an issue with the database operation.
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
 * Retrieves a user from the database by their username.
 *
 * This function queries the database using the "username-index" to find a user
 * that matches the provided username. If a user is found, it returns the user object.
 * If no user is found or an error occurs, it logs the appropriate message and returns null.
 *
 * @async
 * @function getUserByUsername
 * @param {string} username - The username of the user to retrieve.
 * @returns {Promise<Object|null>} A promise that resolves to the user object if found,
 * or `null` if the user does not exist or an error occurs.
 *
 * Example structure of `response.Items[0]`:
 * {
 *   PK: "12345",
 *   SK: "PROFILE",
 *   account: {
 *     firstname: "John",
 *     email: "johndoe@example.com",
 *     lastname: "Doe"
 *   },
 *   daily_macros: {},
 *   fridge: [],
 *   password: "some_hashed_password",
 *   recipes: [],
 *   username: "user1"
 * }
 *
 * @throws {Error} Logs an error if there is an issue with the database operation.
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
 * Updates a user in the database with the provided updated user data.
 *
 * @async
 * @function
 * @param {Object} updatedUser - The user object containing updated fields.
 * @param {string} updatedUser.PK - The primary key of the user.
 * @param {string} updatedUser.SK - The sort key of the user (should be "PROFILE").
 * @param {string} [updatedUser.user_id] - The user ID (excluded from update).
 * @param {Object} [updatedUser.<otherFields>] - Other fields to update in the user profile.
 * @returns {Promise<Object|null>} - The updated user attributes if successful, or null if an error occurs.
 * @throws {Error} - Throws an error if the update operation fails.
 *
 * @example
 * const updatedUser = {
 *   PK: "USER#123",
 *   SK: "PROFILE",
 *   name: "John Doe",
 *   email: "john.doe@example.com"
 * };
 * 
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
        logger.info(`Successfully updated user: ${updatedUser.userId}`);
        return response.Attributes;
    } catch (error) {
        logger.error(`Error updating user: ${updatedUser.userId}`, error.message);
        return null;
    }
}


/**
 * Asynchronously creates a new recipe in the database.
 *
 * @async
 * @function createRecipe
 * @param {Object} recipe - The recipe object to be created. 
 * The object should be structured as follows:
 * {
 *   PK: {string} - The unique identifier for the recipe (required).
 *   SK: "RECIPE"
 *   name: {string} - The name of the recipe (required).
 *  
 *   review_id: {string} - The unique identifier for the review associated with the recipe (optional).
 *   ingredients: {Array<string>} - A list of ingredients for the recipe (optional).
 *   instructions: {Array<string>} - A list of instructions for preparing the recipe (optional).
 *   pictures: {Array<Object>} - A list of pictures, where each picture is an object with the following structure (optional):
 *     {
 *       name: {string} - The name of the picture.
 *       link: {string} - The URL link to the picture.
 *     }
 *   rating: {number} - The rating for the recipe (e.g., 1-5 stars) (optional).
 *   macros: {Object} - An object representing the macronutrients of the recipe, with the following structure (optional):
 *     {
 *       calories: {number} - The number of calories.
 *       protein: {number} - The amount of protein in grams.
 *       carbs: {number} - The amount of carbohydrates in grams.
 *       fat: {number} - The amount of fat in grams.
 *     }
 * }
 * @returns {Promise<Object|null>} - Returns the response object from the database operation if successful, 
 * or `null` if an error occurs. The response object from the PutCommand in DynamoDB typically contains:
 * {
 *   $metadata: {
 *     httpStatusCode: {number} - The HTTP status code of the operation.
 *     requestId: {string} - The unique identifier for the request.
 *     extendedRequestId: {string} - Additional request identifier (if available).
 *     cfId: {string} - CloudFront ID (if applicable).
 *     attempts: {number} - The number of retry attempts made.
 *     totalRetryDelay: {number} - The total delay (in milliseconds) due to retries.
 *   }
 * }
 *
 * @throws {Error} - Logs an error message if the operation fails.
 */
async function createRecipe(recipe) {
    console.log(recipe);
    const command = new PutCommand({
        TableName: tableName,
        Item: recipe
    });

    try {
        const response = await documentClient.send(command);
        logger.info(`Successfully created recipe ${recipe.name}`);
        return response;
    } catch (error) {
        logger.error(`Error while creating a recipe: ${error.message}`);
        return null;
    }
}




/**
 * Updates a recipe in the database.
 *
 * This function takes a recipe object and updates the corresponding record in the database.
 * It dynamically generates the update expression and attribute mappings based on the provided
 * recipe object, excluding certain keys like "recipe_id", "PK", and "SK".
 *
 * @async
 * @function
 * @param {Object} recipe - The recipe object containing the updated data.
 * @param {string} recipe.PK - The partition key of the recipe.
 * @param {string} recipe.SK - The sort key of the recipe (should be "RECIPE").
 * @param {string} [recipe.recipe_id] - The unique identifier of the recipe (excluded from updates).
 * @param {Object} recipe - Other key-value pairs representing the fields to update dynamically.
 * @returns {Promise<Object|null>} The updated recipe attributes if successful, or `null` if an error occurs.
 *
 * @throws {Error} If there is an issue with the database update operation.
 *
 * @example
 * const updatedRecipe = {
 *   PK: "RECIPE#123",
 *   SK: "RECIPE",
 *   name: "Updated Recipe Name",
 *   ingredients: ["ingredient1", "ingredient2"],
 *   macros: {
 *     calories: 500,
 *     protein: 30,
 *     carbs: 50,
 *     fat: 20
 *   }
 * };
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



/**
 * Deletes a recipe from the database based on the provided recipe ID.
 *
 * @async
 * @function deleteRecipe
 * @param {string} recipeId - The unique identifier of the recipe to be deleted.
 * @returns {Promise<Object|null>} A promise that resolves to the response object if the recipe was successfully deleted,
 * or `null` if the recipe was not found or an error occurred.
 * @throws {Error} Logs an error message if the deletion fails.
 * 
 * Example of response
 * 
 * {
  "Attributes": {
    "PK": "12345",
    "SK": "RECIPE",
    "Name": "Chocolate Cake",
    "Ingredients": ["Flour", "Sugar", "Cocoa Powder"]
  },
  "ConsumedCapacity": {
    "TableName": "RecipesTable",
    "CapacityUnits": 1
  },
  "ItemCollectionMetrics": {
    "ItemCollectionKey": {
      "PK": "12345"
    },
    "SizeEstimateRangeGB": [0.1, 0.2]
  }
}
 */
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

/**
 * Creates a new review in the database.
 *
 * @async
 * @function createReview
 * @param {Object} review - The review object to be created. 
 * The object should be structured as follows:
 * {
 *   user_id: {string} - The ID of the user creating the review (required).
 *   recipe_id: {string} - The ID of the recipe being reviewed (required).
 *   text: {string} - The text content of the review (optional).
 *   rating: {number} - The rating given to the recipe (e.g., 1-5) (optional).
 *   review_id: {string} - The unique identifier for the review (required).
 * }
 * @returns {Promise<Object|null>} The created review object if successful, or null if an error occurs.
 */
async function createReview(review) {
    const command = new PutCommand({
        TableName: tableName,
        Item: review
    });

    try {
        const response = await documentClient.send(command);
        logger.info(`Successfully created review with ID ${review.review_id}`);
        return response.Attributes;
    } catch (error) {
        logger.error(`Error while creating a review: ${error.message}`);
        return null;
    }
}

/**
 * Retrieves all recipes from the database.
 *
 * This function scans the database table for items where the sort key (SK)
 * begins with the prefix "RECIPE". It returns an array of recipe items if found,
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
async function getAllRecipes() {
    const command = new ScanCommand({
        TableName: tableName,
        FilterExpression: "begins_with(SK, :recipe)",
        ExpressionAttributeValues: {
            ":recipe": "RECIPE"
        }
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

//TODO write methods for more precice recipe fetching

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



async function getSavedRecipeIds(userId) {


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



/**
 * Retrieves a review from the database based on the provided review ID.
 *
 * @async
 * @function getReview
 * @param {string} reviewId - The unique identifier of the review to retrieve.
 * @returns {Promise<Object|null>} A promise that resolves to the review object if found,
 * or `null` if the review does not exist or an error occurs.
 *
 * Example response:
 * {
 *   PK: "1",
 *   SK: "REVIEW",
 *   user_id: "123",
 *   recipe_id: "456",
 *   text: "This recipe was amazing!",
 *   rating: 5,
 * }
 */
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
/**
 * Retrieves all reviews from the database.
 *
 * This function scans the database table for items where the sort key (SK)
 * begins with the prefix "REVIEW". It returns an array of review items if found,
 * or an empty array if no reviews are present.
 *
 * @async
 * @function getAllReviews
 * @returns {Promise<Object[]>} A promise that resolves to an array of review objects.
 *                              Returns an empty array if no reviews are found.
 *
 * Example response:
 * [
 *   {
 *     PK: "REVIEW#001",
 *     SK: "REVIEW",
 *     user_id: "USER#123",
 *     recipe_id: "RECIPE#456",
 *     text: "This recipe was amazing!",
 *     rating: 5
 *   },
 *   {
 *     PK: "REVIEW#002",
 *     SK: "REVIEW",
 *     user_id: "USER#124",
 *     recipe_id: "RECIPE#457",
 *     text: "Not bad, but could use more seasoning.",
 *     rating: 3
 *   }
 * ]
 */
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

/**
 * Deletes a review from the database based on the provided review ID.
 *
 * @async
 * @function deleteReview
 * @param {string} reviewId - The unique identifier of the review to be deleted.
 * @returns {Promise<Object|null>} A promise that resolves to the response object if the review was successfully deleted,
 * or `null` if the review was not found or an error occurred.
 */
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

/**
 * Adds an ingredient to the user's fridge.
 *
 * @async
 * @function addIngredientToFridge
 * @param {string} userId - The unique identifier of the user.
 * @param {Object} ingredient - The ingredient object to add.
 * @param {string} ingredient.name - The name of the ingredient.
 * @param {number} ingredient.amount - The amount of the ingredient.
 * @param {string} ingredient.category - The category of the ingredient.
 * @returns {Promise<Object|null>} The updated fridge array if successful, or `null` if an error occurs.
 */
async function addIngredientToFridge(userId, ingredient) {
    const command = new UpdateCommand({
        TableName: tableName,
        Key: {
            PK: `${userId}`,
            SK: "PROFILE"
        },
        UpdateExpression: "SET fridge = list_append(if_not_exists(fridge, :emptyList), :ingredient)",
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

/**
 * Removes an ingredient from the user's fridge by name.
 *
 * @async
 * @function removeIngredientFromFridge
 * @param {string} userId - The unique identifier of the user.
 * @param {string} ingredientName - The name of the ingredient to remove.
 * @returns {Promise<Object|null>} The updated fridge array if successful, or `null` if an error occurs.
 */
async function removeIngredientFromFridge(userId, ingredientName) {
    const user = await getUser(userId);
    if (!user || !user.fridge) {
        logger.warn(`User ${userId} not found or fridge is empty`);
        return null;
    }

    const updatedFridge = user.fridge.filter(ingredient => ingredient.name !== ingredientName);

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

/**
 * Updates an ingredient in the user's fridge.
 * Only the amount and category of the ingredient will be updated.
 *
 * @async
 * @function updateIngredientFromFridge
 * @param {string} userId - The unique identifier of the user.
 * @param {Object} ingredientUpdate - The update data for the ingredient.
 * @param {string} ingredientUpdate.name - The name of the ingredient to update.
 * @param {number} ingredientUpdate.amount - The new amount of the ingredient.
 * @param {string} ingredientUpdate.category - The new category of the ingredient.
 * @returns {Promise<Object|null>} The updated fridge array if successful, or `null` if an error occurs.
 */
async function updateIngredientFromFridge(userId, ingredientUpdate) {
    // Retrieve the user data (assuming getUser is defined elsewhere in your DAO)
    const user = await getUser(userId);
    if (!user || !user.fridge) {
        logger.warn(`User ${userId} not found or fridge is empty`);
        return null;
    }

    // Find the index of the ingredient to update using its name
    const index = user.fridge.findIndex(ing => ing.name === ingredientUpdate.name);
    if (index === -1) {
        logger.warn(`Ingredient ${ingredientUpdate.name} not found in fridge for user ${userId}`);
        return null;
    }

    // Update the ingredient's amount and category
    user.fridge[index].amount = ingredientUpdate.amount;
    user.fridge[index].category = ingredientUpdate.category;

    // Build the update command to update the entire fridge list
    const command = new UpdateCommand({
        TableName: tableName,
        Key: {
            PK: `${userId}`,
            SK: "PROFILE"
        },
        UpdateExpression: "SET fridge = :updatedFridge",
        ExpressionAttributeValues: {
            ":updatedFridge": user.fridge
        },
        ReturnValues: "ALL_NEW"
    });

    try {
        const response = await documentClient.send(command);
        logger.info(`Successfully updated ingredient in fridge for user ${userId}`);
        return response.Attributes.fridge;
    } catch (error) {
        logger.error(`Error updating ingredient in fridge for user ${userId}: ${error.message}`);
        return null;
    }
}

/**
 * Retrieves all ingredients from the user's fridge.
 *
 * @async
 * @function getAllIngredientsFromFridge
 * @param {string} userId - The unique identifier of the user.
 * @returns {Promise<Array|null>} The array of ingredients if successful, or `null` if an error occurs.
 */
async function getAllIngredientsFromFridge(userId) {
    // Retrieve the user data (assuming getUser is defined elsewhere in your DAO)
    const user = await getUser(userId);
    if (!user) {
        logger.warn(`User ${userId} not found`);
        return null;
    }

    // Return the fridge array or an empty list if it doesn't exist
    return user.fridge || [];
}



export {
    createUser,
    getUser,
    getUserByUsername,
    updateUser,
    createRecipe,
    updateRecipe,
    deleteRecipe,
    createReview,
    getAllRecipes,
    getRecipe,
    getReview,
    getAllReviews,
    deleteReview,
    getSavedRecipeIds,
    addIngredientToFridge,
    removeIngredientFromFridge,
    getAllIngredientsFromFridge,
    updateIngredientFromFridge
}