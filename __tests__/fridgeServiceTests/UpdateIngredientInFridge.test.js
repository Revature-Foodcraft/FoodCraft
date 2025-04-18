import {updateIngredientInFridge} from "../../src/Services/fridgeService.js"
import * as model from "../../src/Models/model.js"

jest.mock("../../src/Models/model.js");

describe('updateIngredientInFridge', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should update an ingredient successfully and return fridge contents', async () => {
        const mockFridge = [
            { id: '1', name: 'Carrot', quantity: 3 },
            { id: '2', name: 'Potato', quantity: 5 },
        ];
        model.updateIngredientFromFridge.mockResolvedValue(mockFridge);

        const userId = '123';
        const ingredientUpdate = { id: '1', quantity: 3 };

        const result = await updateIngredientInFridge(userId, ingredientUpdate);

        expect(model.updateIngredientFromFridge).toHaveBeenCalledWith(userId, ingredientUpdate);
        expect(result).toEqual({
            success: true,
            code: 200,
            message: "Ingredient updated successfully.",
            ingredients: mockFridge,
        });
    });

    it('should return a 404 error if the ingredient is not found or update fails', async () => {
        model.updateIngredientFromFridge.mockResolvedValue(null);

        const userId = '123';
        const ingredientUpdate = { id: '1', quantity: 3 };

        const result = await updateIngredientInFridge(userId, ingredientUpdate);

        expect(model.updateIngredientFromFridge).toHaveBeenCalledWith(userId, ingredientUpdate);
        expect(result).toEqual({
            success: false,
            code: 404,
            message: "Ingredient not found or update failed.",
        });
    });

    it('should return a 500 error with the error message if an exception occurs', async () => {
        const mockError = new Error('Database error');
        model.updateIngredientFromFridge.mockRejectedValue(mockError);

        const userId = '123';
        const ingredientUpdate = { id: '1', quantity: 3 };

        const result = await updateIngredientInFridge(userId, ingredientUpdate);

        expect(model.updateIngredientFromFridge).toHaveBeenCalledWith(userId, ingredientUpdate);
        expect(result).toEqual({
            success: false,
            code: 500,
            message: mockError.message,
        });
    });
});