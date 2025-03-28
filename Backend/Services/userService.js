import { hashPassword } from "../util/bcyrpt.js"
import * as model from "../Models/model.js"
import { v4 as uuidv4 } from 'uuid';

export async function createUser ({username,password,email,firstname,lastname,picture}){
    const hashPass = await hashPassword(password)

    const exist = await model.getUserByUsername(username)

    if(!exist){
        const userObj = {
            PK:uuidv4(),
            SK:"PROFILE",
            username,
            hashPass,
            account:{
                firstname,
                lastname,
                email
            },
            picture,
            fridge:[],
            recipes:[],
            daily_macros:{}
        }

        const newUser = await model.createUser(userObj)

        if(newUser){
            return {success:true, user:userObj}
        }else{
            return {success:false, code: 500, message:"Failed creating new user"}
        }
    }else{
        return {success:false, code:400, message:"Username is already in use"}
    }
}
