import * as bcrypt from "../../src/util/bcrypt.js"
import {createUser} from "../../src/Services/userService.js"
import * as model from "../../src/Models/model.js"
import { v4 as uuidv4 } from 'uuid';

jest.mock("../../src/util/bcrypt.js")
jest.mock("../../src/Models/model.js")
jest.mock('uuid', () => ({
  v4: jest.fn(),
}));

describe('createUser', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a new user successfully when username is not in use', async () => {
    const input = { 
      username: 'testUser', 
      password: 'testPassword', 
      email: 'test@example.com',
      firstname: 'Test', 
      lastname: 'User', 
      picture: 'test.jpg'
    };

    bcrypt.hashPassword.mockResolvedValue('hashedPassword');
    model.getUserByUsername.mockResolvedValue(null);
    uuidv4.mockReturnValue('uuid-123');
    model.createUser.mockResolvedValue(true);

    const result = await createUser(input);

    const expectedUserObj = {
      PK: 'uuid-123',
      SK: 'PROFILE',
      username: input.username,
      password: 'hashedPassword',
      account: {
        firstname: input.firstname,
        lastname: input.lastname,
        email: input.email,
      },
      picture: input.picture,
      fridge: [],
      recipes: [],
      daily_macros: {
        date: expect.any(String),
        protein: 0,
        fats: 0,
        carbs: 0,
        proteinGoal: 120,
        fatsGoal: 70,
        carbsGoal: 200,
      },
    };

    expect(bcrypt.hashPassword).toHaveBeenCalledWith(input.password);
    expect(model.getUserByUsername).toHaveBeenCalledWith(input.username);
    expect(uuidv4).toHaveBeenCalled();
    expect(model.createUser).toHaveBeenCalledWith(expectedUserObj);
    expect(result).toEqual({ success: true, user: expectedUserObj });
  });

  it('should create a new user and use default values for optional fields when not provided', async () => {
    const input = { 
      username: 'defaultUser', 
      password: 'defaultPass'
    };

    bcrypt.hashPassword.mockResolvedValue('hashedPassword');
    model.getUserByUsername.mockResolvedValue(null);
    uuidv4.mockReturnValue('uuid-default');
    model.createUser.mockResolvedValue(true);

    const result = await createUser(input);

    const expectedUserObj = {
      PK: 'uuid-default',
      SK: 'PROFILE',
      username: input.username,
      password: 'hashedPassword',
      account: {
        firstname: "",
        lastname: "",
        email: "",
      },
      picture: "",
      fridge: [],
      recipes: [],
      daily_macros: {
        date: expect.any(String),
        protein: 0,
        fats: 0,
        carbs: 0,
        proteinGoal: 120,
        fatsGoal: 70,
        carbsGoal: 200,
      },
    };

    expect(bcrypt.hashPassword).toHaveBeenCalledWith(input.password);
    expect(model.getUserByUsername).toHaveBeenCalledWith(input.username);
    expect(uuidv4).toHaveBeenCalled();
    expect(model.createUser).toHaveBeenCalledWith(expectedUserObj);
    expect(result).toEqual({ success: true, user: expectedUserObj });
  });

  it('should return failure when model.createUser fails', async () => {
    const input = { 
      username: 'testUser', 
      password: 'testPassword', 
      email: 'test@example.com',
      firstname: 'Test', 
      lastname: 'User', 
      picture: 'test.jpg'
    };

    bcrypt.hashPassword.mockResolvedValue('hashedPassword');
    model.getUserByUsername.mockResolvedValue(null);
    uuidv4.mockReturnValue('uuid-123');
    model.createUser.mockResolvedValue(null);

    const result = await createUser(input);

    expect(result).toEqual({ success: false, code: 500, message: "Failed creating new user" });
  });

  it('should return failure when username is already in use', async () => {
    const input = { 
      username: 'testUser', 
      password: 'testPassword', 
      email: 'test@example.com',
      firstname: 'Test', 
      lastname: 'User', 
      picture: 'test.jpg'
    };

    bcrypt.hashPassword.mockResolvedValue('hashedPassword');
    model.getUserByUsername.mockResolvedValue({ PK: 'existing-user' });

    const result = await createUser(input);

    expect(result).toEqual({ success: false, code: 400, message: "Username is already in use" });
  });
});