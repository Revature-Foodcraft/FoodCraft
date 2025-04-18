import {getRecipes} from "../../src/Services/recipeService.js"
import * as model from "../../src/Models/model.js"

jest.mock("../../src/Models/model.js");

describe('getRecipes', () => {
    afterEach(() => {
        jest.clearAllMocks(); 
    });

    it('should fetch recipes by parameters when cuisine or category is provided', async () => {
        const mockRecipes = [
            { id: '1', name: 'Recipe 1', cuisine: 'Italian', category: 'Dessert' },
            { id: '2', name: 'Recipe 2', cuisine: 'Italian', category: 'Main Course' },
        ];
        model.getRecipesByParameters.mockResolvedValue(mockRecipes);

        const cuisine = 'Italian';
        const category = 'Dessert';

        const result = await getRecipes(cuisine, category);

        expect(model.getRecipesByParameters).toHaveBeenCalledWith(cuisine, category);
        expect(model.getAllRecipes).not.toHaveBeenCalled(); // Ensure getAllRecipes is not called
        expect(result).toEqual({ success: true, recipes: mockRecipes });
    });

    it('should fetch all recipes when no parameters are provided', async () => {
        const mockRecipes = [
            { id: '1', name: 'Recipe 1' },
            { id: '2', name: 'Recipe 2' },
        ];
        model.getAllRecipes.mockResolvedValue(mockRecipes);

        const cuisine = null;
        const category = null;

        const result = await getRecipes(cuisine, category);

        expect(model.getAllRecipes).toHaveBeenCalled();
        expect(model.getRecipesByParameters).not.toHaveBeenCalled(); 
        expect(result).toEqual({ success: true, recipes: mockRecipes });
    });

    it('should return failure message if getRecipesByParameters returns falsy', async () => {
        model.getRecipesByParameters.mockResolvedValue(null);

        const cuisine = 'Italian';
        const category = 'Dessert';

        const result = await getRecipes(cuisine, category);

        expect(model.getRecipesByParameters).toHaveBeenCalledWith(cuisine, category);
        expect(result).toEqual({ success: false, message: "Failed to Retrieve All Recipes" });
    });

    it('should return failure message if getAllRecipes returns falsy', async () => {
        model.getAllRecipes.mockResolvedValue(null);

        const cuisine = null;
        const category = null;

        const result = await getRecipes(cuisine, category);

        expect(model.getAllRecipes).toHaveBeenCalled();
        expect(result).toEqual({ success: false, message: "Failed to Retrieve All Recipes" });
    });
});