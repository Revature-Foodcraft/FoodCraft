import { getReviewsByRecipe } from "../../src/Services/recipeService.js"
import * as model from "../../src/Models/model.js"
import { logger } from "../../src/util/logger.js";

jest.mock("../../src/Models/model.js");
jest.mock("../../src/util/logger.js")

describe('getReviewsByRecipe', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return a 400 error if recipeId is missing', async () => {
        const result = await getReviewsByRecipe();
        expect(result).toEqual({
            success: false,
            code: 400,
            message: "Missing required field: recipeId"
        });
    });

    it('should return success and reviews when recipeId is provided', async () => {
        const recipeId = 'recipe-123';
        const mockReviews = [
            { id: "review1", comment: "Great recipe!", rating: 5 },
            { id: "review2", comment: "Could be better", rating: 3 }
        ];

        model.getReviewsByRecipe.mockResolvedValue(mockReviews);

        const result = await getReviewsByRecipe(recipeId);

        expect(model.getReviewsByRecipe).toHaveBeenCalledWith(recipeId);
        expect(result).toEqual({
            success: true,
            reviews: mockReviews
        });
    });

    it('should return a 500 error if model.getReviewsByRecipe throws an error', async () => {
        const recipeId = 'recipe-123';
        const error = new Error("Database error");
        model.getReviewsByRecipe.mockRejectedValue(error);

        const result = await getReviewsByRecipe(recipeId);

        expect(logger.error).toHaveBeenCalledWith(`Error retrieving reviews for recipe ${recipeId}:`, error);
        expect(result).toEqual({
            success: false,
            code: 500,
            message: "Internal server error"
        });
    });
});