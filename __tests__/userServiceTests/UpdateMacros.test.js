import { updateMacros } from "../../src/Services/userService.js";
import * as model from "../../src/Models/model.js";
import { logger } from "../../src/util/logger.js";

jest.mock("../../src/Models/model.js")
jest.mock("../../src/util/logger.js")

describe('updateMacros', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return an error object if newDailyMacros is missing or not an object', async () => {
        const response = await updateMacros('user1', null);
        expect(response).toEqual({
            success: false,
            code: 500,
            message: "Invalid input: newDailyMacros must be an object"
        });
    });

    it('should return an error object if any required field is not a number', async () => {
        const invalidMacros = { protein: 'invalid', fats: 30, carbs: 40, calories: 2000 };
        const response = await updateMacros('user1', invalidMacros);
        expect(response).toEqual({
            success: false,
            code: 500,
            message: "Invalid input: protein must be a number"
        });
    });

    it('should update macros successfully when valid input is provided', async () => {
        const newDailyMacros = { protein: 150, fats: 70, carbs: 250, calories: 2000 };
        const updatedUserResponse = { daily_macros: newDailyMacros };

        model.updateMacros.mockResolvedValue(updatedUserResponse);

        const response = await updateMacros('user1', newDailyMacros);
        expect(model.updateMacros).toHaveBeenCalledWith('user1', newDailyMacros);
        expect(response).toEqual({
            success: true,
            daily_macros: newDailyMacros
        });
    });

    it('should return an error object if updatedUser does not have daily_macros', async () => {
        const newDailyMacros = { protein: 150, fats: 70, carbs: 250, calories: 2000 };

        model.updateMacros.mockResolvedValue({});

        const response = await updateMacros('user1', newDailyMacros);
        expect(model.updateMacros).toHaveBeenCalledWith('user1', newDailyMacros);
        expect(response).toEqual({
            success: false,
            code: 500,
            message: "Failed updating daily macros"
        });
    });

    it('should handle errors thrown by model.updateMacros gracefully', async () => {
        const newDailyMacros = { protein: 150, fats: 70, carbs: 250, calories: 2000 };

        model.updateMacros.mockRejectedValue(new Error('Database error'));

        const response = await updateMacros('user1', newDailyMacros);
        expect(logger.error).toHaveBeenCalledWith("Error in updateMacros service:", expect.any(Error));
        expect(response).toEqual({
            success: false,
            code: 500,
            message: "Database error"
        });
    });
});