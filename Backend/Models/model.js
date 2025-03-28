import { documentClient } from '../util/db.js';
import { GetCommand, PutCommand, UpdateCommand, ScanCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';
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
            PK: `USER#${userId}`,
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
        logger.error(`Error while getting user with username ${username}`, error);
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
            PK: `USER#${updatedUser.user_id}`,
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
        logger.error(`Error updating user: ${updatedUser.userId}`, error);
        return null;
    }
}

async function createRecipe(recipe) {

}

async function updateRecipe(params) {

}

async function deleteRecipe(params) {

}

async function createReview(params) {

}

async function getAllRecipes(params) {

}

async function getRecipe(params) {

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