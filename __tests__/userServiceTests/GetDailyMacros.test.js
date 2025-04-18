import { getDailyMacros } from "../../src/Services/userService.js";
import * as model from "../../src/Models/model.js";

jest.mock("../../src/Models/model.js")

describe('getDailyMacros', () => {
    const userId = 'user1';
    const fixedTime = new Date('2025-04-18T13:38:41.715Z');

    beforeEach(() => {
        jest.clearAllMocks();
        jest.useFakeTimers('modern');
        jest.setSystemTime(fixedTime);
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it('should return null if model.getDailyMacros returns null', async () => {
        model.getDailyMacros.mockResolvedValue(null);

        const result = await getDailyMacros(userId);
        expect(model.getDailyMacros).toHaveBeenCalledWith(userId);
        expect(result).toBeNull();
    });

    it('should return dailyMacros if the stored date is today', async () => {
        const dailyMacros = {
            date: fixedTime.toISOString(),
            protein: 100,
            fats: 50,
            carbs: 200,
            calories: 1800,
        };

        model.getDailyMacros.mockResolvedValue(dailyMacros);

        const result = await getDailyMacros(userId);
        expect(model.getDailyMacros).toHaveBeenCalledWith(userId);
        expect(model.updateMacros).not.toHaveBeenCalled();
        expect(result).toEqual(dailyMacros);
    });

    it('should reset and update daily_macros if the stored date is not today and updateMacros returns an updated value', async () => {
        const oldMacros = {
            date: '2025-04-17T10:00:00.000Z',
            protein: 120,
            fats: 60,
            carbs: 250,
            calories: 2000,
        };
        model.getDailyMacros.mockResolvedValue(oldMacros);

        const updatedDailyMacros = {
            ...oldMacros,
            date: fixedTime.toISOString(),
            protein: 0,
            fats: 0,
            carbs: 0,
            calories: 0,
        };

        model.updateMacros.mockResolvedValue({ daily_macros: updatedDailyMacros });

        const result = await getDailyMacros(userId);
        expect(model.getDailyMacros).toHaveBeenCalledWith(userId);
        expect(model.updateMacros).toHaveBeenCalledWith(userId, updatedDailyMacros);
        expect(result).toEqual(updatedDailyMacros);
    });

    it('should reset and return updated daily_macros if updateMacros returns a falsy update', async () => {
        const oldMacros = {
            date: '2025-04-17T09:00:00.000Z',
            protein: 150,
            fats: 70,
            carbs: 300,
            calories: 2200,
        };
        model.getDailyMacros.mockResolvedValue(oldMacros);

        const updatedDailyMacros = {
            ...oldMacros,
            date: fixedTime.toISOString(),
            protein: 0,
            fats: 0,
            carbs: 0,
            calories: 0,
        };

        model.updateMacros.mockResolvedValue(null);

        const result = await getDailyMacros(userId);
        expect(model.getDailyMacros).toHaveBeenCalledWith(userId);
        expect(model.updateMacros).toHaveBeenCalledWith(userId, updatedDailyMacros);
        expect(result).toEqual(updatedDailyMacros);
    });
});