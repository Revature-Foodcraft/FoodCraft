import Joi from "joi";
import * as userService from "../Services/userService.js";

export const register = async (req, res) => {
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
        return res.status(201).json({ message: "User Created", user: user.user })
    } else {
        return res.status(user.code).json({ message: user.message })
    }
}

export const login = async (req, res) => {
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
        res.status(200).json({ message: user.message, token: user.token })
    } else {
        res.status(400).json({ message: user.message })
    }
}

export const getProfile = async (req, res) => {
    const userInfo = await userService.getUser(req.user?.userId)

    if (userInfo.success) {
        res.status(200).json({ username: userInfo.user.username, account: userInfo.user.account, picture: userInfo.user?.picture, googleId:userInfo.user?.googleId })
    } else {
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

export const authGoogle = async (req,res) =>{
    const user = await userService.getAccount({email:req.local.email,googleId:req.local.sub,firstname:req.local.given_name,lastname:req.local.family_name})
    
    if(user.success){
        res.status(200).json({message:user.message,token:user.token})
    }else{
        res.status(500).json({message:user.message})
    }
}

export const linkGoogle = async (req,res) =>{
    const user = await userService.linkAccount(req.user?.userId, req.local.sub, req.local.email)

    if(user.success){
        res.status(200).json({message:user.message})
    }else{
        res.status(500).json({message:user.message})
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
      protein: Joi.number().required(),
      fats: Joi.number().required(),
      carbs: Joi.number().required(),
    });
  
    const { error, value } = macrosSchema.validate(req.body);
  
    if (error) {
      const messages = [];
      error.details.forEach(detail => {
        messages.push(detail.message.replace(/"/g, ""));
      });
      return res.status(400).json({ message: messages });
    }
  
    try {
      const currentDailyMacros = await userService.getDailyMacros(req.user?.userId);
      if (!currentDailyMacros) {
        return res.status(404).json({ message: "Daily macros not found" });
      }
  
      const updatedMacros = {
        ...currentDailyMacros,
        protein: value.protein,
        fats: value.fats,
        carbs: value.carbs,
      };
  
      const result = await userService.updateMacros(req.user?.userId, updatedMacros);
  
      if (result.success) {
        return res
          .status(200)
          .json({ message: "Macros updated", daily_macros: result.daily_macros });
      } else {
        return res.status(result.code || 500).json({ message: result.message });
      }
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };

