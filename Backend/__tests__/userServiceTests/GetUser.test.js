import { getSignedImageUrl } from '../../src/util/s3.js'; 
import {getUser} from "../../src/Services/userService.js";
import * as model from "../../src/Models/model.js";

jest.mock('../../src/util/s3.js')
jest.mock("../../src/Models/model.js")

describe('getUser', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return user with signed picture URL when user exists', async () => {
        const mockUser = { 
            PK: '123', 
            username: 'testUser', 
            picture: 'user-avatar.jpg' 
        };
        const mockPictureUrl = 'https://signed.url/user-avatar.jpg';

        model.getUser.mockResolvedValue(mockUser);
        getSignedImageUrl.mockResolvedValue(mockPictureUrl);

        const result = await getUser(mockUser.PK);

        expect(model.getUser).toHaveBeenCalledWith(mockUser.PK);
        expect(getSignedImageUrl).toHaveBeenCalledWith('user-avatar.jpg');
        expect(result).toEqual({
            success: true,
            user: {
                ...mockUser,
                picture: mockPictureUrl,
            },
        });
    });

    it('should return user with default avatar when user picture is missing', async () => {
        const mockUser = { 
            PK: '123', 
            username: 'testUser', 
            picture: "" 
        };
        const mockDefaultUrl = 'https://signed.url/default-avatar-icon.jpg';

        model.getUser.mockResolvedValue(mockUser);
        getSignedImageUrl.mockResolvedValue(mockDefaultUrl); 

        const result = await getUser(mockUser.PK);

        expect(model.getUser).toHaveBeenCalledWith(mockUser.PK);
        expect(getSignedImageUrl).toHaveBeenCalledWith('default-avatar-icon.jpg');
        expect(result).toEqual({
            success: true,
            user: {
                ...mockUser,
                picture: mockDefaultUrl,
            },
        });
    });

    it('should return failure message when user does not exist', async () => {
        model.getUser.mockResolvedValue(null);

        const result = await getUser('nonexistentUserId');

        expect(model.getUser).toHaveBeenCalledWith('nonexistentUserId');
        expect(getSignedImageUrl).not.toHaveBeenCalled(); 
        expect(result).toEqual({
            success: false,
            message: 'Failed to get user',
        });
    });

    it('should handle errors gracefully when getUser throws', async () => {
        const mockError = new Error('Database error');
        model.getUser.mockRejectedValue(mockError); 

        await expect(getUser('errorUserId')).rejects.toThrow(mockError);
        expect(model.getUser).toHaveBeenCalledWith('errorUserId');
        expect(getSignedImageUrl).not.toHaveBeenCalled();
    });
});