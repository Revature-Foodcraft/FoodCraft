import Joi from "joi";
import * as userService from "../Services/userService.js";
import { logger } from '../util/logger.js';

export const register = async (req, res) => {
  logger.info('Register request received', { username: req.body.username });

  const accountSchema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().pattern(/^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])(?=.{8,})/).required(),
    email: Joi.string().email().optional(),
    firstname: Joi.string().optional(),
    lastname: Joi.string().optional(),
    picture: Joi.string().optional()
  })

  const { error, value } = accountSchema.validate(req.body)

  if (error) {
    const messages = [];

    error.details.forEach(detail => {
      const cleanMsg = detail.message.replace(/"/g, '')
      messages.push(cleanMsg)
    })
    return res.status(400).json({ message: messages })
  }

  const user = await userService.createUser(value)

  if (user.success) {
    logger.info('User registered successfully', { userId: user.user.PK, username: user.user.username });
    return res.status(201).json({ message: "User Created", user: user.user })
  } else {
    logger.error('User registration failed', { error: user.message });
    return res.status(user.code).json({ message: user.message })
  }
}

export const login = async (req, res) => {
  logger.info('Login request received', { username: req.body.username });

  const loginSchema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().pattern(/^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])(?=.{8,})/).required()
  })

  const { error, value } = loginSchema.validate(req.body)

  if (error) {
    const messages = [];

    error.details.forEach(detail => {
      const cleanMsg = detail.message.replace(/"/g, '')
      messages.push(cleanMsg)
    })
    return res.status(400).json({ message: messages })
  }

  const user = await userService.loginUser(value)

  if (user.success) {
    logger.info('User logged in successfully', { userId: user.token });
    res.status(200).json({ message: user.message, token: user.token })
  } else {
    logger.warn('Login failed', { username: req.body.username });
    res.status(400).json({ message: user.message })
  }
}

export const getProfile = async (req, res) => {
  logger.info('Fetching user profile', { userId: req.user?.userId });

  const userInfo = await userService.getUser(req.user?.userId)

  if (userInfo.success) {
    logger.info('User profile fetched successfully', { userId: req.user?.userId });
    res.status(200).json({ username: userInfo.user.username, account: userInfo.user.account, picture: userInfo.user?.picture, googleId: userInfo.user?.googleId })
  } else {
    logger.error('Failed to fetch user profile', { userId: req.user?.userId });
    res.status(500).json({ message: userInfo.message })
  }
}

export const updateProfile = async (req, res) => {
  const updateSchema = Joi.object({
    firstname: Joi.string().optional(),
    lastname: Joi.string().optional(),
    email: Joi.string().email().optional(),
    username: Joi.string().optional()
  })

  const { error, value } = updateSchema.validate(req.body)

  if (error) {
    const messages = [];

    error.details.forEach(detail => {
      const cleanMsg = detail.message.replace(/"/g, '')
      messages.push(cleanMsg)
    })
    return res.status(400).json({ message: messages })
  }
  const updatedUser = await userService.updateProfile(req.user?.userId, value, req.file);

  if (updatedUser.success) {
    return res.status(200).json({ message: "Profile updated successfully", user: updatedUser.user });
  } else {
    return res.status(500).json({ message: updatedUser.message });
  }
}

export const authGoogle = async (req, res) => {
  const user = await userService.getAccount({ email: req.local.email, googleId: req.local.sub, firstname: req.local.given_name, lastname: req.local.family_name })

  if (user.success) {
    res.status(200).json({ message: user.message, token: user.token })
  } else {
    res.status(500).json({ message: user.message })
  }
}

export const linkGoogle = async (req, res) => {
  const user = await userService.linkAccount(req.user?.userId, req.local.sub, req.local.email)

  if (user.success) {
    res.status(200).json({ message: user.message })
  } else {
    res.status(500).json({ message: user.message })
  }
}


export const getDailyMacros = async (req, res) => {
  try {
    const dailyMacros = await userService.getDailyMacros(req.user?.userId);
    if (dailyMacros) {
      return res.status(200).json({ daily_macros: dailyMacros });
    } else {
      return res.status(404).json({ message: "Daily macros not found" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


export const updateMacros = async (req, res) => {
  const macrosSchema = Joi.object({
    protein: Joi.number().optional(),
    fats: Joi.number().optional(),
    carbs: Joi.number().optional(),
    calories: Joi.number().optional(),
  });

  const { error, value } = macrosSchema.validate(req.body);

  if (error) {
    const messages = error.details.map(detail => detail.message.replace(/"/g, ""));
    return res.status(400).json({ message: messages });
  }

  // Ensure at least one field is provided in the request
  if (Object.keys(value).length === 0) {
    return res.status(400).json({ message: "At least one field must be provided." });
  }

  try {
    const currentDailyMacros = await userService.getDailyMacros(req.user?.userId);
    if (!currentDailyMacros) {
      return res.status(404).json({ message: "Daily macros not found" });
    }

    const updatedMacros = {
      ...currentDailyMacros,
      ...value,
    };

    const result = await userService.updateMacros(req.user?.userId, updatedMacros);

    if (result.success) {
      return res.status(200).json({ message: "Macros updated", daily_macros: result.daily_macros });
    } else {
      return res.status(result.code || 500).json({ message: result.message });
    }
  } catch (error) {
    console.error("Error in updateMacros controller:", error);
    return res.status(500).json({ message: error.message });
  }
};

export const updateGoals = async (req, res) => {
  const goalsSchema = Joi.object({
    proteinGoal: Joi.number().required(),
    fatsGoal: Joi.number().required(),
    carbsGoal: Joi.number().required(),
    caloriesGoal: Joi.number().required(), // Add caloriesGoal as required
  });

  const { error, value } = goalsSchema.validate(req.body);

  if (error) {
    const messages = error.details.map(detail => detail.message.replace(/"/g, ''));
    console.error("Validation Error:", messages);
    return res.status(400).json({ message: messages });
  }

  try {
    console.log("Updating goals for user:", req.user?.userId, "with values:", value);
    const result = await userService.updateGoals(req.user?.userId, value);
    if (result.success) {
      console.log("Goals updated successfully for user:", req.user?.userId);
      return res.status(200).json({ message: 'Goals updated successfully' });
    } else {
      console.error("Failed to update goals for user:", req.user?.userId, "Error:", result.message);
      return res.status(result.code || 500).json({ message: result.message });
    }
  } catch (err) {
    console.error("Internal Server Error while updating goals for user:", req.user?.userId, "Error:", err.message);
    return res.status(500).json({ message: err.message });
  }
};


