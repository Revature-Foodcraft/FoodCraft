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
        return res.status(400).json({error:messages})
    }

    const user = await userService.createUser(value)

    if(user.success){
        return res.status(201).json({message:"User Created", user:user.user})
    }else{
        return res.status(user.code).json({error:user.message})
    }
}

// 8 char 1 special 1 captial