import { updateSavedRecipeList } from "../../src/Services/recipeService.js"
import * as model from "../../src/Models/model.js"
import { logger } from "../../src/util/logger.js";

jest.mock("../../src/Models/model.js");
jest.mock("../../src/util/logger.js")

describe("updateSavedRecipeList", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should add the recipe ID to the user's saved recipe list and return a success message", async () => {
        const userId = "user1";
        const recipeId = "recipe3";
        const user = { recipes: ["recipe1", "recipe2"] };
        const recipe = { id: recipeId };

        model.getUser.mockResolvedValue(user);
        model.getRecipe.mockResolvedValue(recipe);
        model.updateSavedRecipeList.mockResolvedValue(true);

        const result = await updateSavedRecipeList(recipeId, userId);

        expect(model.getUser).toHaveBeenCalledWith(userId);
        expect(model.getRecipe).toHaveBeenCalledWith(recipeId);
        expect(model.updateSavedRecipeList).toHaveBeenCalledWith(userId, ["recipe1", "recipe2", "recipe3"]);
        expect(logger.info).toHaveBeenCalledWith(
            `Added recipe with ID: ${recipeId}  to save recipe list for user: ${userId}`
        );
        expect(result).toEqual({
            success: true,
            message: "Succcessfully added to saved recipe list"
        });
    });

    it("should return an error if the recipe is already in the user's saved recipe list", async () => {
        const userId = "user1";
        const recipeId = "recipe1";
        const user = { recipes: ["recipe1", "recipe2"] };
        const recipe = { id: recipeId };

        model.getUser.mockResolvedValue(user);
        model.getRecipe.mockResolvedValue(recipe);

        const result = await updateSavedRecipeList(recipeId, userId);

        expect(model.getUser).toHaveBeenCalledWith(userId);
        expect(model.getRecipe).toHaveBeenCalledWith(recipeId);
        expect(result).toEqual({
            success: false,
            code: 400,
            message: "Already in list"
        });
    });

    it("should return an error if the recipe is not found", async () => {
        const userId = "user1";
        const recipeId = "recipe3";
        const user = { recipes: ["recipe1", "recipe2"] };

        model.getUser.mockResolvedValue(user);
        model.getRecipe.mockResolvedValue(null);

        const result = await updateSavedRecipeList(recipeId, userId);

        expect(model.getUser).toHaveBeenCalledWith(userId);
        expect(model.getRecipe).toHaveBeenCalledWith(recipeId);
        expect(result).toEqual({
            success: false,
            code: 400,
            message: "Failed to find recipe"
        });
    });

    it("should return a 404 error if model.updateSavedRecipeList resolves to a falsy value", async () => {
        const userId = "user1";
        const recipeId = "recipe3";
        const user = { recipes: ["recipe1", "recipe2"] };
        const recipe = { id: recipeId };

        model.getUser.mockResolvedValue(user);
        model.getRecipe.mockResolvedValue(recipe);
        model.updateSavedRecipeList.mockResolvedValue(false);

        const result = await updateSavedRecipeList(recipeId, userId);

        expect(model.getUser).toHaveBeenCalledWith(userId);
        expect(model.getRecipe).toHaveBeenCalledWith(recipeId);
        expect(model.updateSavedRecipeList).toHaveBeenCalledWith(userId, ["recipe1", "recipe2", "recipe3"]);
        expect(logger.warn).toHaveBeenCalledWith(
            `Failed to added recipe with ID: ${recipeId} to saved recipe list for user: ${userId}`
        );
        expect(result).toEqual({
            success: false,
            code: 404,
            message: "Saved recipe not found"
        });
    });

    it("should return a 500 error if model.getUser throws an error", async () => {
        const userId = "user1";
        const recipeId = "recipe3";

        model.getUser.mockRejectedValue(new Error("GetUser error"));

        const result = await updateSavedRecipeList(recipeId, userId);

        expect(logger.error).toHaveBeenCalledWith("Error adding to saved recipes:", expect.any(Error));
        expect(result).toEqual({
            success: false,
            code: 500,
            message: "Interal server error"
        });
    });
});