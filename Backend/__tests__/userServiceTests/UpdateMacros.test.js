import { updateMacros } from "../../src/Services/userService.js";
import * as model from "../../src/Models/model.js";

jest.mock("../../src/Models/model.js")

describe('updateMacros', () => {
    const userId = '123';
    const newDailyMacros = { 
        protein: 0, 
        fats: 0, 
        carbs: 0 
    };

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return success response when updatedUser has daily_macros', async () => {
        const dummyUpdatedUser = {
            daily_macros: { 
                protein: 100, 
                fats: 50, 
                carbs: 200 
            }
        };
        model.updateMacros.mockResolvedValue(dummyUpdatedUser);

        const result = await updateMacros(userId, newDailyMacros);

        expect(model.updateMacros).toHaveBeenCalledWith(userId, newDailyMacros);
        expect(result).toEqual({
            success: true,
            daily_macros: dummyUpdatedUser.daily_macros,
        });
    });

    it('should return failure when updatedUser does not have daily_macros', async () => {
        model.updateMacros.mockResolvedValue({});

        const result = await updateMacros(userId, newDailyMacros);

        expect(model.updateMacros).toHaveBeenCalledWith(userId, newDailyMacros);
        expect(result).toEqual({
            success: false,
            code: 500,
            message: "Failed updating daily macros",
        });
    });

    it('should handle errors and return failure with error message', async () => {
        const errorMessage = "Database connection failed";
        model.updateMacros.mockRejectedValue(new Error(errorMessage));

        const result = await updateMacros(userId, newDailyMacros);

        expect(model.updateMacros).toHaveBeenCalledWith(userId, newDailyMacros);
        expect(result).toEqual({
            success: false,
            code: 500,
            message: errorMessage,
        });
    });
});