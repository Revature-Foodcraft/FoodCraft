import { createReview } from "../../src/Services/recipeService.js"
import * as model from "../../src/Models/model.js"
import { logger } from "../../src/util/logger.js";
import { v4 as uuidv4 } from 'uuid';

jest.mock("../../src/Models/model.js");
jest.mock("../../src/util/logger.js")
jest.mock('uuid');

describe('createReview', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return a 400 error if required fields are missing', async () => {
    const input = {
      recipeId: 'recipe1',
      user_id: 'user1',
      comment: '',
      rating: 5,
    };

    const result = await createReview(input);
    expect(result).toEqual({
      success: false,
      code: 400,
      message: "Missing required fields: recipeId, user_id, and comment are required",
    });
  });

  it('should create a review successfully when all required fields are provided', async () => {
    const input = {
      recipeId: 'recipe1',
      user_id: 'user1',
      comment: 'Great recipe!',
      rating: 5,
    };

    const fixedDate = '2025-04-15T20:00:00.000Z';
    jest.spyOn(Date.prototype, 'toISOString').mockReturnValue(fixedDate);

    uuidv4.mockReturnValue('fixed-uuid');

    const expectedReviewObj = {
      PK: `REVIEW#fixed-uuid`,
      SK: "REVIEW",
      recipeId: input.recipeId,
      user_id: input.user_id,
      comment: input.comment,
      rating: input.rating,
      dateCreated: fixedDate,
    };

    model.createReview.mockResolvedValue(true);

    const result = await createReview(input);

    expect(model.createReview).toHaveBeenCalledWith(expectedReviewObj);
    expect(result).toEqual({
      success: true,
      message: "Review created successfully",
      review: expectedReviewObj,
    });
  });

  it('should return a 500 error if model.createReview returns a falsy value', async () => {
    const input = {
      recipeId: 'recipe1',
      user_id: 'user1',
      comment: 'Great recipe!',
      rating: 5,
    };

    const fixedDate = '2025-04-15T20:00:00.000Z';
    jest.spyOn(Date.prototype, 'toISOString').mockReturnValue(fixedDate);
    uuidv4.mockReturnValue('fixed-uuid');

    const expectedReviewObj = {
      PK: `REVIEW#fixed-uuid`,
      SK: "REVIEW",
      recipeId: input.recipeId,
      user_id: input.user_id,
      comment: input.comment,
      rating: input.rating,
      dateCreated: fixedDate,
    };

    model.createReview.mockResolvedValue(false);

    const result = await createReview(input);

    expect(model.createReview).toHaveBeenCalledWith(expectedReviewObj);
    expect(result).toEqual({
      success: false,
      code: 500,
      message: "Failed to create review",
    });
  });

  it('should return a 500 error if an error is thrown when creating a review', async () => {
    const input = {
      recipeId: 'recipe1',
      user_id: 'user1',
      comment: 'Great recipe!',
      rating: 5,
    };

    const fixedDate = '2025-04-15T20:00:00.000Z';
    jest.spyOn(Date.prototype, 'toISOString').mockReturnValue(fixedDate);
    uuidv4.mockReturnValue('fixed-uuid');

    model.createReview.mockRejectedValue(new Error('Database error'));

    const result = await createReview(input);

    expect(logger.error).toHaveBeenCalledWith("Error creating review:", expect.any(Error));
    expect(result).toEqual({
      success: false,
      code: 500,
      message: "Internal server error",
    });
  });
});