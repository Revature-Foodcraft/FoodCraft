import { deleteSavedRecipe } from "../../src/Services/recipeService.js"
import * as model from "../../src/Models/model.js"
import { logger } from "../../src/util/logger.js";

jest.mock("../../src/Models/model.js");
jest.mock('../../src/util/logger.js');

describe('deleteSavedRecipe', () => {
    it('should return error if userId or recipeId is missing', async () => {
        const response = await deleteSavedRecipe(null, 'recipeId');
        expect(response).toEqual({
            success: false,
            code: 400,
            message: 'User ID and Recipe ID are required',
        });
    });

    it('should delete the saved recipe successfully', async () => {
        const userId = 'user1';
        const recipeId = 'recipe1';
        const mockUser = { recipes: ['recipe1', 'recipe2'] };

        model.getUser.mockResolvedValue(mockUser);
        model.updateSavedRecipeList.mockResolvedValue(true);

        const response = await deleteSavedRecipe(userId, recipeId);
        expect(response).toEqual({
            success: true,
            message: 'Saved recipe deleted successfully',
        });
        expect(logger.info).toHaveBeenCalledWith(`Deleted saved recipe with ID: ${recipeId} for user: ${userId}`);
    });

    it('should return error if saved recipe is not found', async () => {
        const userId = 'user1';
        const recipeId = 'recipe3';
        const mockUser = { recipes: ['recipe1', 'recipe2'] };

        model.getUser.mockResolvedValue(mockUser);
        model.updateSavedRecipeList.mockResolvedValue(false);

        const response = await deleteSavedRecipe(userId, recipeId);
        expect(response).toEqual({
            success: false,
            code: 404,
            message: 'Saved recipe not found',
        });
        expect(logger.warn).toHaveBeenCalledWith(`Failed to delete saved recipe with ID: ${recipeId} for user: ${userId}`);
    });

    it('should handle internal server errors', async () => {
        const userId = 'user1';
        const recipeId = 'recipe1';

        model.getUser.mockRejectedValue(new Error('Database error'));

        const response = await deleteSavedRecipe(userId, recipeId);
        expect(response).toEqual({
            success: false,
            code: 500,
            message: 'Internal server error',
        });
        expect(logger.error).toHaveBeenCalledWith('Error deleting saved recipe:', expect.any(Error));
    });
});