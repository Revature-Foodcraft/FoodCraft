import axios from "axios";
import { documentClient } from '../util/db.js';
import { PutCommand, GetCommand } from '@aws-sdk/lib-dynamodb';

async function ingredientUpload() {
    try {
        for (let i = 0; i < 10; i++) {
            const response = await axios.get('https://www.themealdb.com/api/json/v1/1/random.php');

            const recipe = response.data.meals[0];

            const ingredients = [];
            for (let i = 1; i <= 20; i++) {
                const ingredientName = recipe[`strIngredient${i}`];
                const ingredientAmount = recipe[`strMeasure${i}`];
                if (!ingredientName) break;
                ingredients.push({ name: ingredientName, amount: ingredientAmount });
            }

            const instructions = recipe.strInstructions.includes("\r\n\r\n")
                ? recipe.strInstructions.split(/\r\n\r\n/).filter(Boolean)
                : recipe.strInstructions.split(/\./).filter(Boolean);

            const item = {
                PK: recipe.idMeal.toString(),
                SK: 'RECIPE',
                name: recipe.strMeal,
                dateCreated: new Date().toISOString().split('T')[0],
                ingredients: ingredients,
                instructions: instructions,
                pictures: [recipe.strMealThumb],
                rating: 0,
                reviews: [],
                user_id: "e62afb1c-0077-4bdd-a45d-fe1ffd94fd46",
                youtube: recipe.strYoutube,
                category: recipe.strCategory,
                cuisine: recipe.strArea
            };

            // Check if the item already exists in the database
            const getCommand = new GetCommand({
                TableName: 'FoodCraft',
                Key: {
                    PK: item.PK,
                    SK: item.SK
                }
            });

            const existingItem = await documentClient.send(getCommand);

            if (existingItem.Item) {
                console.log(`Item with PK: ${item.PK} and SK: ${item.SK} already exists. Skipping...`);
                continue;
            }

            const putCommand = new PutCommand({
                TableName: 'FoodCraft',
                Item: item,
            });

            // Insert the ingredient into the database
            await documentClient.send(putCommand);
            console.log(`Inserted ${item.name}`);
        }

        console.log('All ingredients have been seeded successfully!');
    } catch (error) {
        console.error('Error seeding ingredients:', error);
    }
}

ingredientUpload();