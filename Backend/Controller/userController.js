import Joi from "joi"
import * as userService from "../Services/userService.js"

export const register = async (req,res) =>{
    const accountSchema = Joi.object({
        username: Joi.string().required(),
        password: Joi.string().pattern(/^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])(?=.{8,})/).required(),
        email: Joi.string().email().optional(),
        firstname: Joi.string().optional(),
        lastname: Joi.string().optional(),
        picture: Joi.string().optional()
    })

    const {error,value} = accountSchema.validate(req.body)

    if(error){
        const messages = [];

        error.details.forEach(detail =>{
            const cleanMsg = detail.message.replace(/"/g,'')
            messages.push(cleanMsg)
        })
        return res.status(400).json({message:messages})
    }

    const user = await userService.createUser(value)

    if(user.success){
        return res.status(201).json({message:"User Created", user:user.user})
    }else{
        return res.status(user.code).json({message:user.message})
    }
}

export const login = async (req,res)=>{
    const loginSchema = Joi.object({
        username: Joi.string().required(),
        password: Joi.string().pattern(/^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])(?=.{8,})/).required()
    })

    const {error, value} = loginSchema.validate(req.body)

    if(error){
        const messages = [];

        error.details.forEach(detail =>{
            const cleanMsg = detail.message.replace(/"/g,'')
            messages.push(cleanMsg)
        })
        return res.status(400).json({message:messages})
    }

    const user = await userService.loginUser(value)

    if(user.success){
        res.status(200).json({message:user.message,token:user.token})
    }else{
        res.status(400).json({message:user.message})
    }
}
