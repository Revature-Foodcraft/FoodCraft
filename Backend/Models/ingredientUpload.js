import axios from "axios";
import { documentClient } from '../util/db.js';
import { PutCommand } from '@aws-sdk/lib-dynamodb';

async function ingredientUpload() {
    try {
        const response = await axios.get('https://www.themealdb.com/api/json/v1/1/list.php?i=list');

        const ingredients = response.data.meals;

        for (const ingr of ingredients) {
            const item = {
                PK: ingr.idIngredient.toString(),
                SK: 'INGREDIENT',
                name: ingr.strIngredient,
                unit: "N/A"
            };

            const command = new PutCommand({
                TableName: 'FoodCraft',
                Item: item,
            });

            // Insert the ingredient into the database
            await documentClient.send(command);
            console.log(`Inserted ${item.name}`);
        }

        console.log('All ingredients have been seeded successfully!');
    } catch (error) {
        console.error('Error seeding ingredients:', error);
    }

}

ingredientUpload()