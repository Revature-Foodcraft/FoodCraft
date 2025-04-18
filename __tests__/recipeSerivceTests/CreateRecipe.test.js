import {createRecipe} from "../../src/Services/recipeService.js"
import * as model from "../../src/Models/model.js"
import { v4 as uuidv4 } from 'uuid';

jest.mock("../../src/Models/model.js");
jest.mock('uuid', () => ({
    v4: jest.fn(),
}));

describe('createRecipe', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return a 400 error if required fields are missing', async () => {
        const result = await createRecipe({
            name: '',
            ingredients: [],
            instructions: []
        });

        expect(result).toEqual({ success: false, code: 400, message: "Missing required fields" });
        expect(model.createRecipe).not.toHaveBeenCalled(); 
    });

    it('should create a recipe successfully if all required fields are provided', async () => {
        const input = {
            name: 'Test Recipe',
            description: 'This is a test recipe',
            ingredients: ['Ingredient 1', 'Ingredient 2'],
            instructions: ['Step 1', 'Step 2'],
            pictures: [],
            reviews: [],
            rating: 0,
            macros: { protein: 10, carbs: 5, fats: 3 },
            category: 'Dessert',
            cuisine: 'International'
        };

        const mockUuid = '123-uuid';
        const mockDate = '2025-04-15T20:00:00.000Z';
        uuidv4.mockReturnValue(mockUuid);
        jest.spyOn(Date.prototype, 'toISOString').mockReturnValue(mockDate); 

        const mockRecipe = { ...input, PK: mockUuid, SK: 'RECIPE', dateCreated: mockDate };
        model.createRecipe.mockResolvedValue(true); 

        const result = await createRecipe(input);

        expect(uuidv4).toHaveBeenCalled();
        expect(model.createRecipe).toHaveBeenCalledWith(mockRecipe);
        expect(result).toEqual({ success: true, message: "Recipe created successfully", recipe: mockRecipe });
    });

    it('should return a 500 error if recipe creation fails', async () => {
        const input = {
            name: 'Test Recipe',
            description: 'This is a test recipe',
            ingredients: ['Ingredient 1', 'Ingredient 2'],
            instructions: ['Step 1', 'Step 2'],
            pictures: [],
            reviews: [],
            rating: 0,
            macros: { protein: 10, carbs: 5, fats: 3 },
            category: 'Dessert',
            cuisine: 'International'
        };

        const mockUuid = '123-uuid';
        const mockDate = '2025-04-15T20:00:00.000Z';
        uuidv4.mockReturnValue(mockUuid); 
        jest.spyOn(Date.prototype, 'toISOString').mockReturnValue(mockDate);

        const mockRecipe = { ...input, PK: mockUuid, SK: 'RECIPE', dateCreated: mockDate };
        model.createRecipe.mockResolvedValue(null); 

        const result = await createRecipe(input);

        expect(uuidv4).toHaveBeenCalled();
        expect(model.createRecipe).toHaveBeenCalledWith(mockRecipe);
        expect(result).toEqual({ success: false, code: 500, message: "Failed to create recipe" });
    });

    it('should return a 500 error if an internal server error occurs', async () => {
        const input = {
            name: 'Test Recipe',
            description: 'This is a test recipe',
            ingredients: ['Ingredient 1', 'Ingredient 2'],
            instructions: ['Step 1', 'Step 2'],
            pictures: [],
            reviews: [],
            rating: 0,
            macros: { protein: 10, carbs: 5, fats: 3 },
            category: 'Dessert',
            cuisine: 'International'
        };

        const mockError = new Error('Database error');
        model.createRecipe.mockRejectedValue(mockError);

        const result = await createRecipe(input);

        expect(model.createRecipe).toHaveBeenCalled();
        expect(result).toEqual({ success: false, code: 500, message: "Internal server error" });
    });
});