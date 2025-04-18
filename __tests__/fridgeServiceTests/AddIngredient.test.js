import {addIngredient} from "../../src/Services/fridgeService.js"
import * as model from "../../src/Models/model.js"

jest.mock("../../src/Models/model.js");

describe('addIngredient', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should add an ingredient successfully and return fridge contents', async () => {
        const mockFridge = [
            { id: '1', name: 'Carrot', quantity: 2 },
            { id: '2', name: 'Potato', quantity: 3 },
        ];
        model.addIngredientToFridge.mockResolvedValue(mockFridge);

        const userId = '123';
        const ingredient = { 
            name: 'Carrot', 
            quantity: 2 
        };

        const result = await addIngredient(userId, ingredient);

        expect(model.addIngredientToFridge).toHaveBeenCalledWith(userId, ingredient);
        expect(result).toEqual({
            success: true,
            code: 200,
            message: "Ingredient added successfully.",
            ingredients: mockFridge,
        });
    });

    it('should return a 500 error if unable to add ingredient', async () => {
        model.addIngredientToFridge.mockResolvedValue(null);

        const userId = '123';
        const ingredient = { name: 'Carrot', quantity: 2 };

        const result = await addIngredient(userId, ingredient);

        expect(model.addIngredientToFridge).toHaveBeenCalledWith(userId, ingredient);
        expect(result).toEqual({
            success: false,
            code: 500,
            message: "Unable to add ingredient.",
        });
    });

    it('should return a 500 error with the error message if an exception occurs', async () => {
        const mockError = new Error('Database error');
        model.addIngredientToFridge.mockRejectedValue(mockError);

        const userId = '123';
        const ingredient = { name: 'Carrot', quantity: 2 };

        const result = await addIngredient(userId, ingredient);

        expect(model.addIngredientToFridge).toHaveBeenCalledWith(userId, ingredient);
        expect(result).toEqual({
            success: false,
            code: 500,
            message: mockError.message,
        });
    });
});