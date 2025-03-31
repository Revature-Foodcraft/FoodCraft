import { documentClient } from '../util/db.js';
import { GetCommand, PutCommand, UpdateCommand, ScanCommand, QueryCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';
import { logger } from '../util/logger.js'


const tableName = "FoodCraft"

async function createUser(user) {
    const command = new PutCommand({
        TableName: tableName,
        Item: user
    })

    try {
        const response = await documentClient.send(command);
        logger.info(`Succesfully created user ${user.username}`)
        return response
    } catch (error) {
        logger.error(`Error while creating a user: ${error.message}`)
        return null;
    }
}

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

async function createRecipe(recipe) {
    const command = new PutCommand({
        TableName: tableName,
        Item: recipe
    });

    try {
        const response = await documentClient.send(command);
        logger.info(`Successfully created recipe with ID ${recipe.recipe_id}`);
        return response.Attributes;
    } catch (error) {
        logger.error(`Error while creating a recipe: ${error.message}`);
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
        logger.info(`Successfully updated recipe with ID ${recipeId}`);
        return response.Attributes;
    } catch (error) {
        logger.error(`Error updating recipe with ID ${recipeId}`, error.message);
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
    getRecipe
}