import {removeIngredient} from "../../src/Services/fridgeService.js"
import * as model from "../../src/Models/model.js"

jest.mock("../../src/Models/model.js");

describe('removeIngredient', () => {
    afterEach(() => {
        jest.clearAllMocks(); 
    });

    it('should remove an ingredient successfully and return fridge contents', async () => {
        const mockFridge = [
            { id: '1', name: 'Potato', quantity: 3 },
            { id: '2', name: 'Onion', quantity: 5 },
        ];
        model.removeIngredientFromFridge.mockResolvedValue(mockFridge);

        const userId = '123';
        const ingredientId = '1';

        const result = await removeIngredient(userId, ingredientId);

        expect(model.removeIngredientFromFridge).toHaveBeenCalledWith(userId, ingredientId);
        expect(result).toEqual({
            success: true,
            code: 200,
            message: "Ingredient removed successfully.",
            ingredients: mockFridge,
        });
    });

    it('should return a 500 error if unable to remove the ingredient', async () => {
        model.removeIngredientFromFridge.mockResolvedValue(null);

        const userId = '123';
        const ingredientId = '1';

        const result = await removeIngredient(userId, ingredientId);

        expect(model.removeIngredientFromFridge).toHaveBeenCalledWith(userId, ingredientId);
        expect(result).toEqual({
            success: false,
            code: 500,
            message: "Unable to remove ingredient.",
        });
    });

    it('should return a 500 error with the error message if an exception occurs', async () => {
        const mockError = new Error('Database error');
        model.removeIngredientFromFridge.mockRejectedValue(mockError);

        const userId = '123';
        const ingredientId = '1';

        const result = await removeIngredient(userId, ingredientId);

        expect(model.removeIngredientFromFridge).toHaveBeenCalledWith(userId, ingredientId);
        expect(result).toEqual({
            success: false,
            code: 500,
            message: mockError.message,
        });
    });
});