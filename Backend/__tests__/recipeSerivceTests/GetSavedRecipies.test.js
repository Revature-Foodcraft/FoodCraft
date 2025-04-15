import {getSavedRecipes} from "../../src/Services/recipeService.js"
import * as model from "../../src/Models/model.js"
import { logger } from "../../src/util/logger.js";

jest.mock("../../src/Models/model.js");
jest.mock("../../src/util/logger.js");

describe('getSavedRecipes', () => {
    afterEach(() => {
        jest.clearAllMocks(); 
    });

    it('should return a 400 error if no userId is provided', async () => {
        const result = await getSavedRecipes(null);

        expect(result).toEqual({ success: false, code: 400, message: "User ID is required" });
        expect(model.getSavedRecipes).not.toHaveBeenCalled(); 
        expect(logger.warn).not.toHaveBeenCalled(); 
        expect(logger.info).not.toHaveBeenCalled();
    });

    it('should return a 404 error if no saved recipes are found', async () => {
        model.getSavedRecipes.mockResolvedValue([]); 

        const userId = '123';

        const result = await getSavedRecipes(userId);

        expect(model.getSavedRecipes).toHaveBeenCalledWith(userId);
        expect(logger.warn).toHaveBeenCalledWith("No saved recipes found for user:", userId);
        expect(result).toEqual({ success: false, code: 404, message: "No saved recipes found" });
    });

    it('should return the saved recipes if they exist', async () => {
        const mockRecipes = [
            { id: '1', name: 'Recipe 1' },
            { id: '2', name: 'Recipe 2' }
        ];
        model.getSavedRecipes.mockResolvedValue(mockRecipes);

        const userId = '123';

        const result = await getSavedRecipes(userId);

        expect(model.getSavedRecipes).toHaveBeenCalledWith(userId);
        expect(logger.info).toHaveBeenCalledWith(`Fetched ${mockRecipes.length} saved recipes for user: ${userId}`);
        expect(result).toEqual({ success: true, recipes: mockRecipes });
    });

    it('should return a 500 error if an internal server error occurs', async () => {
        const mockError = new Error('Database error');
        model.getSavedRecipes.mockRejectedValue(mockError); 
        const userId = '123';

        const result = await getSavedRecipes(userId);

        expect(model.getSavedRecipes).toHaveBeenCalledWith(userId);
        expect(logger.info).not.toHaveBeenCalled(); 
        expect(logger.warn).not.toHaveBeenCalled(); 
        expect(result).toEqual({ success: false, code: 500, message: "Internal server error" });
    });
});