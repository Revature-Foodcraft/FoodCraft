import { deleteImage, uploadImage } from '../../src/util/s3.js'; 
import {updateProfile} from "../../src/Services/userService.js";
import * as model from "../../src/Models/model.js";

jest.mock('../../src/util/s3.js')
jest.mock("../../src/Models/model.js")

describe('updateProfile', () => {
    afterEach(() => {
        jest.clearAllMocks(); 
    });

    it('should update profile successfully with all fields provided', async () => {
        const mockUser = { 
            PK: '123', 
            picture: 'existing-avatar.jpg' 
        };
        const mockUpdatedUser = { 
            PK: '123', 
            username: 'newUsername', 
            account: { 
                firstname: 'John', 
                lastname: 'Doe', 
                email: 'john.doe@example.com' 
            }, 
            picture: expect.stringMatching(/123\/\d+_new-avatar\.jpg/) 
        };

        model.getUser.mockResolvedValue(mockUser);
        model.getUserByUsername.mockResolvedValue(null); 
        model.updateUser.mockResolvedValue(mockUpdatedUser); 
        uploadImage.mockResolvedValue(); 
        deleteImage.mockResolvedValue(); 

        const userId = '123';
        const updateFields = { 
            username: 'newUsername', 
            firstname: 'John', 
            lastname: 'Doe', 
            email: 'john.doe@example.com' 
        };
        const picture = {
            originalname: 'new-avatar.jpg',
            buffer: Buffer.from('mockImageData'),
            mimeType: 'image/jpeg',
        };

        const result = await updateProfile(userId, updateFields, picture);

        expect(model.getUser).toHaveBeenCalledWith(userId);
        expect(model.getUserByUsername).toHaveBeenCalledWith('newUsername');
        expect(deleteImage).toHaveBeenCalledWith('existing-avatar.jpg');
        expect(uploadImage).toHaveBeenCalledWith(expect.any(String), picture.buffer, picture.mimeType);
        expect(model.updateUser).toHaveBeenCalledWith(mockUpdatedUser);
        expect(result).toEqual({ success: true, message: 'Profile updated successfully', user: mockUpdatedUser });
    });

    it('should return failure when username is already in use', async () => {
        const mockUser = { 
            PK: '123' 
        };
        model.getUser.mockResolvedValue(mockUser);
        model.getUserByUsername.mockResolvedValue({ PK: '456' });

        const userId = '123';
        const updateFields = { 
            username: 'existingUsername' 
        };

        const result = await updateProfile(userId, updateFields, null);

        expect(model.getUser).toHaveBeenCalledWith(userId);
        expect(model.getUserByUsername).toHaveBeenCalledWith('existingUsername');
        expect(result).toEqual({ success: false, message: 'username in use' });
    });

    it('should update account fields without a username or picture', async () => {
        const mockUser = { 
            PK: '123' 
        };
        const mockUpdatedUser = { 
            PK: '123', 
            account: { 
                firstname: 'Jane', 
                lastname: 'Smith', 
                email: 'jane.smith@example.com' 
            } 
        };

        model.getUser.mockResolvedValue(mockUser);
        model.updateUser.mockResolvedValue(mockUpdatedUser);

        const userId = '123';
        const updateFields = { 
            firstname: 'Jane', 
            lastname: 'Smith', 
            email: 'jane.smith@example.com' 
        };

        const result = await updateProfile(userId, updateFields, null);

        expect(model.getUser).toHaveBeenCalledWith(userId);
        expect(model.updateUser).toHaveBeenCalledWith(expect.objectContaining({ account: updateFields }));
        expect(result).toEqual({ success: true, message: 'Profile updated successfully', user: mockUpdatedUser });
    });

    it('should return failure when uploadImage throws an error', async () => {
        const mockUser = { 
            PK: '123', 
            picture: null 
        };
        const mockPicture = {
            originalname: 'new-avatar.jpg',
            buffer: Buffer.from('mockImageData'),
            mimeType: 'image/jpeg',
        };

        model.getUser.mockResolvedValue(mockUser);
        uploadImage.mockRejectedValue(new Error('Upload failed'));

        const userId = '123';
        const updateFields = {};
        const picture = mockPicture;

        const result = await updateProfile(userId, updateFields, picture);

        expect(model.getUser).toHaveBeenCalledWith(userId);
        expect(uploadImage).toHaveBeenCalledWith(expect.any(String), picture.buffer, picture.mimeType);
        expect(result).toEqual({ success: false, message: 'Failed to upload picture', error: 'Upload failed' });
    });

    it('should update profile successfully missing lastname and email field', async () => {
        const mockUser = { 
            PK: '123', 
            picture: 'existing-avatar.jpg' 
        };
        const mockUpdatedUser = { 
            PK: '123', 
            username: 'newUsername', 
            account: { 
                firstname: 'John', 
            }, 
            picture: expect.stringMatching(/123\/\d+_new-avatar\.jpg/) 
        };

        model.getUser.mockResolvedValue(mockUser);
        model.getUserByUsername.mockResolvedValue(null); 
        model.updateUser.mockResolvedValue(mockUpdatedUser); 
        uploadImage.mockResolvedValue(); 
        deleteImage.mockResolvedValue(); 

        const userId = '123';
        const updateFields = { 
            username: 'newUsername', 
            firstname: 'John', 
        };
        const picture = {
            originalname: 'new-avatar.jpg',
            buffer: Buffer.from('mockImageData'),
            mimeType: 'image/jpeg',
        };

        const result = await updateProfile(userId, updateFields, picture);

        expect(model.getUser).toHaveBeenCalledWith(userId);
        expect(model.getUserByUsername).toHaveBeenCalledWith('newUsername');
        expect(deleteImage).toHaveBeenCalledWith('existing-avatar.jpg');
        expect(uploadImage).toHaveBeenCalledWith(expect.any(String), picture.buffer, picture.mimeType);
        expect(model.updateUser).toHaveBeenCalledWith(mockUpdatedUser);
        expect(result).toEqual({ success: true, message: 'Profile updated successfully', user: mockUpdatedUser });
    });
    it('should return failure when updating the user fails', async () => {
        const mockUser = { 
            PK: '123' 
        };
        model.getUser.mockResolvedValue(mockUser);
        model.updateUser.mockResolvedValue(null);

        const userId = '123';
        const updateFields = { 
            lastname: 'testlastname' 
        };

        const result = await updateProfile(userId, updateFields, null);

        expect(model.getUser).toHaveBeenCalledWith(userId);
        expect(model.updateUser).toHaveBeenCalledWith(expect.objectContaining({"PK": "123", "account": {"lastname": "testlastname"}}));
        expect(result).toEqual({ success: false, message: 'Failed to update profile' });
    });
});
