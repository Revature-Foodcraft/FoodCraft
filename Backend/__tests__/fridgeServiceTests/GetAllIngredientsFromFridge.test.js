import {getAllIngredientsFromFridge} from "../../src/Services/fridgeService.js"
import * as model from "../../src/Models/model.js"

jest.mock("../../src/Models/model.js");

describe('getAllIngredientsFromFridge', () => {
    afterEach(() => {
        jest.clearAllMocks(); 
    });

    it('should return ingredients successfully when the user has ingredients', async () => {
        const mockFridge = [
            { id: '1', name: 'Carrot', quantity: 3 },
            { id: '2', name: 'Potato', quantity: 5 },
        ];
        model.getAllIngredientsFromFridge.mockResolvedValue(mockFridge);

        const userId = '123';

        const result = await getAllIngredientsFromFridge(userId);

        expect(model.getAllIngredientsFromFridge).toHaveBeenCalledWith(userId);
        expect(result).toEqual({
            success: true,
            code: 200,
            ingredients: mockFridge,
        });
    });

    it('should return a 404 error if the user is not found or has no ingredients', async () => {
        model.getAllIngredientsFromFridge.mockResolvedValue(null);

        const userId = '123';

        const result = await getAllIngredientsFromFridge(userId);

        expect(model.getAllIngredientsFromFridge).toHaveBeenCalledWith(userId);
        expect(result).toEqual({
            success: false,
            code: 404,
            message: "User not found or no ingredients available.",
        });
    });

    it('should return a 500 error with the error message if an exception occurs', async () => {
        const mockError = new Error('Database error');
        model.getAllIngredientsFromFridge.mockRejectedValue(mockError);

        const userId = '123';

        const result = await getAllIngredientsFromFridge(userId);

        expect(model.getAllIngredientsFromFridge).toHaveBeenCalledWith(userId);
        expect(result).toEqual({
            success: false,
            code: 500,
            message: mockError.message,
        });
    });
});