import {getAccount} from "../../src/Services/userService.js";
import * as model from "../../src/Models/model.js";
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid'; 


jest.mock("../../src/Models/model.js")
jest.mock('jsonwebtoken');
jest.mock('uuid', () => ({
    v4: jest.fn(), 
}));

describe('getAccount', () => {
    afterEach(() => {
        jest.clearAllMocks(); 
    });

    it('should return a token if user already exists', async () => {
        const mockUser = { 
            PK: '123' 
        };
        const mockToken = 'mockedToken';

        model.getUserByGoogleId.mockResolvedValue(mockUser);
        jwt.sign.mockReturnValue(mockToken);

        const input = {
            email: 'test@example.com',
            googleId: 'googleId123',
        };

        const result = await getAccount(input);

        expect(model.getUserByGoogleId).toHaveBeenCalledWith('googleId123');
        expect(jwt.sign).toHaveBeenCalledWith(
            { userId: mockUser.PK },
            process.env.SECRET_KEY,
            { expiresIn: '1h' }
        );
        expect(result).toEqual({
            success: true,
            message: 'User Found',
            token: mockToken,
        });
    });

    it('should create a new account and return a token if user does not exist', async () => {
        const mockToken = 'mockedToken';
        const mockUuid = 'generated-uuid';
        const mockNewUser = { 
            PK: mockUuid, 
            SK: 'PROFILE', 
            username: 'test@example.com' 
        };

        model.getUserByGoogleId.mockResolvedValue(null); 
        model.createUser.mockResolvedValue(mockNewUser); 
        jwt.sign.mockReturnValue(mockToken); 
        uuidv4.mockReturnValue(mockUuid); 

        const input = {
            email: 'test@example.com',
            googleId: 'googleId123',
            firstname: 'John',
            lastname: 'Doe',
        };

        const result = await getAccount(input);

        expect(model.getUserByGoogleId).toHaveBeenCalledWith('googleId123');
        expect(model.createUser).toHaveBeenCalledWith(
            expect.objectContaining({
                PK: mockUuid,
                SK: 'PROFILE',
                username: 'test@example.com',
                googleId: 'googleId123',
                account: {
                    firstname: 'John',
                    lastname: 'Doe',
                    email: 'test@example.com',
                },
                picture: '',
                fridge: [],
                recipes: [],
                daily_macros: {},
            })
        );
        expect(jwt.sign).toHaveBeenCalledWith(
            { userId: mockUuid },
            process.env.SECRET_KEY,
            { expiresIn: '1h' }
        );
        expect(result).toEqual({
            success: true,
            message: 'Account Created',
            token: mockToken,
        });
    });

    it('should return failure if account creation fails', async () => {
        const mockUuid = 'generated-uuid';

        model.getUserByGoogleId.mockResolvedValue(null);
        model.createUser.mockResolvedValue(null); 
        uuidv4.mockReturnValue(mockUuid); 

        const input = {
            email: 'test@example.com',
            googleId: 'googleId123',
        };

        const result = await getAccount(input);

        expect(model.getUserByGoogleId).toHaveBeenCalledWith('googleId123');
        expect(model.createUser).toHaveBeenCalledWith(
            expect.objectContaining({
                PK: mockUuid,
                SK: 'PROFILE',
                username: 'test@example.com',
                googleId: 'googleId123',
            })
        );
        expect(jwt.sign).not.toHaveBeenCalled();
        expect(result).toEqual({
            success: false,
            message: 'Failed to Create Account',
        });
    });
});