import {getDailyMacros} from "../../src/Services/userService.js";
import * as model from "../../src/Models/model.js";

jest.mock("../../src/Models/model.js")

describe('getDailyMacros', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return null if no daily_macros are found for the user', async () => {
        model.getDailyMacros.mockResolvedValue(null); 

        const userId = '123';

        const result = await getDailyMacros(userId);

        expect(model.getDailyMacros).toHaveBeenCalledWith(userId); 
        expect(result).toBeNull();
    });

    it('should return the daily_macros as-is if the stored date is today', async () => {
        const today = new Date().toISOString();
        const mockDailyMacros = {
            date: today,
            protein: 50,
            fats: 20,
            carbs: 100,
        };

        model.getDailyMacros.mockResolvedValue(mockDailyMacros); 

        const userId = '123';

        const result = await getDailyMacros(userId);

        expect(model.getDailyMacros).toHaveBeenCalledWith(userId);
        expect(result).toEqual(mockDailyMacros); 
    });

    it('should reset and update daily_macros if the stored date is not today', async () => {
        const fixedTimestamp = '2025-04-15T20:26:38.564Z';
        jest.spyOn(Date, 'now').mockReturnValue(new Date(fixedTimestamp).getTime());

        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const mockDailyMacros = {
            date: yesterday.toISOString(),
            protein: 50,
            fats: 20,
            carbs: 100,
        };

        const updatedDailyMacros = {
            ...mockDailyMacros,
            date: new Date().toISOString(),
            protein: 0,
            fats: 0,
            carbs: 0,
        };

        const mockUpdateResult = { daily_macros: updatedDailyMacros };

        model.getDailyMacros.mockResolvedValue(mockDailyMacros); 
        model.updateMacros.mockResolvedValue(mockUpdateResult); 

        const userId = '123';

        const result = await getDailyMacros(userId);

        expect(model.getDailyMacros).toHaveBeenCalledWith(userId);
        expect(model.updateMacros).toHaveBeenCalledWith(userId, updatedDailyMacros);
        expect(result).toEqual(updatedDailyMacros); 
    });

    it('should return the updated daily_macros if updateMacros fails but values were reset', async () => {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const mockDailyMacros = {
            date: yesterday.toISOString(),
            protein: 50,
            fats: 20,
            carbs: 100,
        };

        const updatedDailyMacros = {
            ...mockDailyMacros,
            date: new Date().toISOString(),
            protein: 0,
            fats: 0,
            carbs: 0,
        };

        model.getDailyMacros.mockResolvedValue(mockDailyMacros); 
        model.updateMacros.mockResolvedValue(null); 

        const userId = '123';


        const result = await getDailyMacros(userId);


        expect(model.getDailyMacros).toHaveBeenCalledWith(userId);
        expect(model.updateMacros).toHaveBeenCalledWith(userId, updatedDailyMacros);
        expect(result).toEqual(updatedDailyMacros); 
    });
});