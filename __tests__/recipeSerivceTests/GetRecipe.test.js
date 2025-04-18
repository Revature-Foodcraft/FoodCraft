import {getRecipe} from "../../src/Services/recipeService.js"
import * as model from "../../src/Models/model.js"

jest.mock("../../src/Models/model.js");

describe('getRecipe', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return a 400 error if no recipeId is provided', async () => {
        const result = await getRecipe({ recipeId: null });

        expect(result).toEqual({ success: false, code: 400, message: "Recipe ID is required" });
        expect(model.getRecipe).not.toHaveBeenCalled(); 
    });

    it('should return the recipe if it exists in the database', async () => {
        const mockRecipe = { 
            id: '123', 
            name: 'Mock Recipe', 
            ingredients: [
                'ingredient1', 
                'ingredient2'
            ] 
        };
        model.getRecipe.mockResolvedValue(mockRecipe);

        const recipeId = '123';

        const result = await getRecipe({ recipeId });

        expect(model.getRecipe).toHaveBeenCalledWith(recipeId);
        expect(result).toEqual({ success: true, recipe: mockRecipe });
    });

    it('should return a 404 error if the recipe is not found', async () => {
        model.getRecipe.mockResolvedValue(null);
        const recipeId = '123';

        const result = await getRecipe({ recipeId });

        expect(model.getRecipe).toHaveBeenCalledWith(recipeId);
        expect(result).toEqual({ success: false, code: 404, message: "Recipe not found" });
    });

    it('should return a 500 error if there is an internal server error', async () => {
        const mockError = new Error('Database failure');
        model.getRecipe.mockRejectedValue(mockError); 
        const recipeId = '123';

        const result = await getRecipe({ recipeId });

        expect(model.getRecipe).toHaveBeenCalledWith(recipeId);
        expect(result).toEqual({ success: false, code: 500, message: "Internal server error" });
    });
});