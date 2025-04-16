import {linkAccount} from "../../src/Services/userService.js";
import * as model from "../../src/Models/model.js";

jest.mock("../../src/Models/model.js")

describe('linkAccount', () => {
    afterEach(() => {
        jest.clearAllMocks(); 
    });

    it('should update the user and return success', async () => {
        const mockUser = { 
            PK: '123', 
            googleId: 'googleId123', 
            account: { 
                email: 'test@example.com' 
            }
        };
        model.updateUser.mockResolvedValue(mockUser);

        const userId = '123';
        const googleId = 'googleId123';
        const email = 'test@example.com';

        const result = await linkAccount(userId, googleId, email);

        expect(model.updateUser).toHaveBeenCalledWith({
            PK: userId,
            googleId: googleId,
            account: { email },
        }); 
        expect(result).toEqual({
            success: true,
            message: 'Profile updated successfully',
            user: mockUser,
        }); 
    });

    it('should return failure when updateUser fails', async () => {
        model.updateUser.mockResolvedValue(null);

        const userId = '123';
        const googleId = 'googleId123';
        const email = 'test@example.com';

        const result = await linkAccount(userId, googleId, email);

        expect(model.updateUser).toHaveBeenCalledWith({
            PK: userId,
            googleId: googleId,
            account: { email },
        });
        expect(result).toEqual({
            success: false,
            message: 'Failed to update profile',
        });
    });
});