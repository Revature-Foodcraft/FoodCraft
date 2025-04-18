import { updateSavedRecipeList } from "../../src/Services/recipeService.js"
import * as model from "../../src/Models/model.js"
import { logger } from "../../src/util/logger.js";

jest.mock("../../src/Models/model.js");
jest.mock("../../src/util/logger.js")

describe('updateSavedRecipeList', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should add the recipe id to the user\'s saved recipe list and return a success message', async () => {
        const userId = 'user1';
        const recipeId = 'recipe3';

        const user = { recipes: ['recipe1', 'recipe2'] };

        model.getUser.mockResolvedValue(user);
        model.updateSavedRecipeList.mockResolvedValue(true);

        const result = await updateSavedRecipeList(recipeId, userId);


        expect(model.getUser).toHaveBeenCalledWith(userId);

        expect(model.updateSavedRecipeList).toHaveBeenCalledWith(userId, ['recipe1', 'recipe2', recipeId]);

        expect(logger.info).toHaveBeenCalledWith(
            `Added recipe with ID: ${recipeId}  to save recipe list for user: ${userId}`
        );

        expect(result).toEqual({
            success: true,
            message: "Succcessfully added to saved recipe list"
        });
    });

    it('should return a 404 error if model.updateSavedRecipeList returns a falsy value', async () => {
        const userId = 'user1';
        const recipeId = 'recipe3';
        const user = { recipes: ['recipe1', 'recipe2'] };

        model.getUser.mockResolvedValue(user);
        model.updateSavedRecipeList.mockResolvedValue(false);

        const result = await updateSavedRecipeList(recipeId, userId);

        expect(model.getUser).toHaveBeenCalledWith(userId);
        expect(model.updateSavedRecipeList).toHaveBeenCalledWith(userId, ['recipe1', 'recipe2', recipeId]);
        expect(logger.warn).toHaveBeenCalledWith(
            `Failed to added recipe with ID: ${recipeId} to saved recipe list for user: ${userId}`
        );
        expect(result).toEqual({
            success: false,
            code: 404,
            message: "Saved recipe not found"
        });
    });

    it('should handle errors if model.getUser throws an error', async () => {
        const userId = 'user1';
        const recipeId = 'recipe3';

        model.getUser.mockRejectedValue(new Error('GetUser error'));

        const result = await updateSavedRecipeList(recipeId, userId);

        expect(logger.error).toHaveBeenCalledWith("Error adding to saved recipes:", expect.any(Error));
        expect(result).toEqual({
            success: false,
            code: 500,
            message: "Interal server error"
        });
    });

    it('should handle errors if model.updateSavedRecipeList throws an error', async () => {
        const userId = 'user1';
        const recipeId = 'recipe3';
        const user = { recipes: ['recipe1', 'recipe2'] };

        model.getUser.mockResolvedValue(user);
        model.updateSavedRecipeList.mockRejectedValue(new Error('Update error'));

        const result = await updateSavedRecipeList(recipeId, userId);

        expect(model.getUser).toHaveBeenCalledWith(userId);
        expect(logger.error).toHaveBeenCalledWith("Error adding to saved recipes:", expect.any(Error));
        expect(result).toEqual({
            success: false,
            code: 500,
            message: "Interal server error"
        });
    });
});