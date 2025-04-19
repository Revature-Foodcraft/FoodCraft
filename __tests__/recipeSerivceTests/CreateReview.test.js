import { createReview } from "../../src/Services/recipeService.js"
import * as model from "../../src/Models/model.js"
import { logger } from "../../src/util/logger.js";
import { v4 as uuidv4 } from 'uuid';

jest.mock("../../src/Models/model.js");
jest.mock("../../src/util/logger.js")
jest.mock("uuid", () => ({
  v4: jest.fn(() => "unique-review-id"),
}));

describe("createReview", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return a 400 error if required fields are missing", async () => {
    const result = await createReview({ recipeId: "", user_id: "", comment: "", rating: null });

    expect(result).toEqual({
      success: false,
      code: 400,
      message: "Missing required fields: recipeId, user_id, and comment are required"
    });
  });

  it("should return a 400 error if recipe ID is invalid", async () => {
    const recipeId = "invalid-recipe-id";
    model.getRecipe.mockResolvedValue(null);

    const result = await createReview({
      recipeId,
      user_id: "user1",
      comment: "Great recipe!",
      rating: 5
    });

    expect(model.getRecipe).toHaveBeenCalledWith(recipeId);
    expect(result).toEqual({
      success: false,
      code: 400,
      message: "Invalid RecipeId"
    });
  });

  it("should create a review successfully and return the review object", async () => {
    const recipeId = "recipe123";
    const user_id = "user1";
    const comment = "Delicious!";
    const rating = 5;
    const recipe = { id: recipeId };

    model.getRecipe.mockResolvedValue(recipe);
    model.createReview.mockResolvedValue(true);

    const result = await createReview({ recipeId, user_id, comment, rating });

    expect(model.getRecipe).toHaveBeenCalledWith(recipeId);
    expect(model.createReview).toHaveBeenCalledWith({
      PK: "REVIEW#unique-review-id",
      SK: "REVIEW",
      recipeId,
      user_id,
      comment,
      rating,
      dateCreated: expect.any(String)
    });
    expect(result).toEqual({
      success: true,
      message: "Review created successfully",
      review: {
        PK: "REVIEW#unique-review-id",
        SK: "REVIEW",
        recipeId,
        user_id,
        comment,
        rating,
        dateCreated: expect.any(String)
      }
    });
  });

  it("should return a 500 error if review creation fails", async () => {
    const recipeId = "recipe123";
    const user_id = "user1";
    const comment = "Good recipe!";
    const rating = 4;
    const recipe = { id: recipeId };

    model.getRecipe.mockResolvedValue(recipe);
    model.createReview.mockResolvedValue(false);

    const result = await createReview({ recipeId, user_id, comment, rating });

    expect(model.getRecipe).toHaveBeenCalledWith(recipeId);
    expect(model.createReview).toHaveBeenCalledWith({
      PK: "REVIEW#unique-review-id",
      SK: "REVIEW",
      recipeId,
      user_id,
      comment,
      rating,
      dateCreated: expect.any(String)
    });
    expect(result).toEqual({
      success: false,
      code: 500,
      message: "Failed to create review"
    });
  });

  it("should handle errors thrown by model.createReview gracefully", async () => {
    const recipeId = "recipe123";
    const user_id = "user1";
    const comment = "Excellent recipe!";
    const rating = 5;
    const recipe = { id: recipeId };

    model.getRecipe.mockResolvedValue(recipe);
    model.createReview.mockRejectedValue(new Error("Database error"));

    const result = await createReview({ recipeId, user_id, comment, rating });

    expect(logger.error).toHaveBeenCalledWith("Error creating review:", expect.any(Error));
    expect(result).toEqual({
      success: false,
      code: 500,
      message: "Internal server error"
    });
  });
});