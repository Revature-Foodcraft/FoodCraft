import Joi from "joi";
import * as userService from "../Services/userService.js";
import multer from "multer"

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
        res.status(200).json({ username: userInfo.user.username, account: userInfo.user.account, picture: userInfo.user?.picture })
    } else {
        res.status(500).json({ message: userInfo.message })
    }
}

export const updateProfile = async (req, res) => {
    const updateSchema = Joi.object({
        firstname: Joi.string().optional(),
        lastname: Joi.string().optional(),
        email: Joi.string().email().optional(),

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

    const updatedUser = await userService.updateUser(req.user?.userId, value);

    if (updatedUser.success) {
        return res.status(200).json({ message: "Profile updated successfully", user: updatedUser.user });
    } else {
        return res.status(500).json({ message: updatedUser.message });
    }
}

export const authGoogle = (req,res) =>{
    const user = userService.getAccount({email:req.user.email,googleId:req.user.sub,firstname:req.user.given_name,lastname:req.user.family_name,picture:req.user.picture})
}