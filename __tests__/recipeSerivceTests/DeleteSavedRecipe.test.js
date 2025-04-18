import {deleteSavedRecipe} from "../../src/Services/recipeService.js"
import * as model from "../../src/Models/model.js"
import { logger } from "../../src/util/logger.js";

jest.mock("../../src/Models/model.js");
jest.mock('../../src/util/logger.js');

describe('deleteSavedRecipe', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return a 400 error if userId or recipeId is missing', async () => {
        const result = await deleteSavedRecipe(null, null);

        expect(result).toEqual({ success: false, code: 400, message: "User ID and Recipe ID are required" });
        expect(model.deleteSavedRecipe).not.toHaveBeenCalled(); 
        expect(logger.info).not.toHaveBeenCalled(); 
        expect(logger.warn).not.toHaveBeenCalled(); 
    });

    it('should delete a saved recipe successfully and return a success message', async () => {
        model.deleteSavedRecipe.mockResolvedValue(true); 

        const userId = '123';
        const recipeId = '456';

        const result = await deleteSavedRecipe(userId, recipeId);

        expect(model.deleteSavedRecipe).toHaveBeenCalledWith(userId, recipeId);
        expect(logger.info).toHaveBeenCalledWith(`Deleted saved recipe with ID: ${recipeId} for user: ${userId}`);
        expect(result).toEqual({ success: true, message: "Saved recipe deleted successfully" });
    });

    it('should return a 404 error if the saved recipe is not found', async () => {
        model.deleteSavedRecipe.mockResolvedValue(false);

        const userId = '123';
        const recipeId = '456';

        const result = await deleteSavedRecipe(userId, recipeId);

        expect(model.deleteSavedRecipe).toHaveBeenCalledWith(userId, recipeId);
        expect(logger.warn).toHaveBeenCalledWith(`Failed to delete saved recipe with ID: ${recipeId} for user: ${userId}`);
        expect(result).toEqual({ success: false, code: 404, message: "Saved recipe not found" });
    });

    it('should return a 500 error if an internal server error occurs', async () => {
        const mockError = new Error('Database error');
        model.deleteSavedRecipe.mockRejectedValue(mockError); 
        
        const userId = '123';
        const recipeId = '456';

        const result = await deleteSavedRecipe(userId, recipeId);

        expect(model.deleteSavedRecipe).toHaveBeenCalledWith(userId, recipeId);
        expect(logger.info).not.toHaveBeenCalled(); 
        expect(logger.warn).not.toHaveBeenCalled(); 
        expect(result).toEqual({ success: false, code: 500, message: "Internal server error" });
    });
});