import * as bcrypt from "../../src/util/bcrypt.js"
import {loginUser} from "../../src/Services/userService.js"
import * as model from "../../src/Models/model.js"
import jwt from "jsonwebtoken"

jest.mock("../../src/util/bcrypt.js")
jest.mock("../../src/Models/model.js")
jest.mock("jsonwebtoken")

describe('loginUser', () => {
    const mockUsername = 'testUser';
    const mockPassword = 'testPassword';

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return success and a token when login is successful', async () => {
        const mockUser = { 
            PK: '123', 
            password: 'hashedPassword' 
        };
        const mockToken = 'mockedToken';

        model.getUserByUsername.mockResolvedValue(mockUser); 
        bcrypt.comparePassword.mockResolvedValue(true); 
        jwt.sign.mockReturnValue(mockToken); 

        const result = await loginUser({ username: mockUsername, password: mockPassword });

        expect(model.getUserByUsername).toHaveBeenCalledWith(mockUsername);
        expect(bcrypt.comparePassword).toHaveBeenCalledWith(mockPassword, mockUser.password);
        expect(jwt.sign).toHaveBeenCalledWith(
            { userId: mockUser.PK },
            process.env.SECRET_KEY,
            { expiresIn: '5h' }
        );
        expect(result).toEqual({
            success: true,
            message: 'Login Successful',
            token: mockToken,
        });
    });

    it('should return failure when username or password is incorrect', async () => {
        model.getUserByUsername.mockResolvedValue(null);

        const result = await loginUser({ username: mockUsername, password: mockPassword });

        expect(model.getUserByUsername).toHaveBeenCalledWith(mockUsername);
        expect(bcrypt.comparePassword).not.toHaveBeenCalled();
        expect(result).toEqual({
            success: false,
            message: 'Login Failed: Incorrect Username or Password',
        });
    });

    it('should return failure when password comparison fails', async () => {
        const mockUser = { 
            PK: '123', 
            password: 'hashedPassword' 
        };

        model.getUserByUsername.mockResolvedValue(mockUser);
        bcrypt.comparePassword.mockResolvedValue(false);

        const result = await loginUser({ username: mockUsername, password: mockPassword });

        expect(model.getUserByUsername).toHaveBeenCalledWith(mockUsername);
        expect(bcrypt.comparePassword).toHaveBeenCalledWith(mockPassword, mockUser.password);
        expect(result).toEqual({
            success: false,
            message: 'Login Failed: Incorrect Username or Password',
        });
    });

    it('should handle errors and return failure message', async () => {
        const mockError = new Error('Something went wrong');
        bcrypt.comparePassword.mockRejectedValue(mockError);

        const result = await loginUser({ username: mockUsername, password: mockPassword });

        expect(model.getUserByUsername).toHaveBeenCalledWith(mockUsername);
        expect(result).toEqual({
            success: false,
            message: 'An error occurred during login',
            error: mockError.message,
        });
    });
});
