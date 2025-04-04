import { hashPassword } from "../util/bcyrpt.js"
import * as model from "../Models/model.js"
import { v4 as uuidv4 } from 'uuid';
import { comparePassword } from "../util/bcyrpt.js";
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import { logger } from "../util/logger.js";

dotenv.config({ override: true })

export async function createUser({ username, password, email = "", firstname = "", lastname = "", picture = "" }) {
    const hashPass = await hashPassword(password)

    const exist = await model.getUserByUsername(username)

    if (!exist) {
        const userObj = {
            PK: uuidv4(),
            SK: "PROFILE",
            username,
            password: hashPass,
            account: {
                firstname,
                lastname,
                email
            },
            picture,
            fridge: [],
            recipes: [],
            daily_macros: {}
        }

        const newUser = await model.createUser(userObj)

        if (newUser) {
            return { success: true, user: userObj }
        } else {
            return { success: false, code: 500, message: "Failed creating new user" }
        }
    } else {
        return { success: false, code: 400, message: "Username is already in use" }
    }
}

export async function loginUser({ username, password }) {
    const user = await model.getUserByUsername(username)

    if (user && await comparePassword(password, user.password)) {
        const token = jwt.sign({
            userId: user.PK
        },
            process.env.SECRET_KEY,
            {
                expiresIn: '1h'
            })

        return { success: true, message: "Login Successful", token: token }
    } else {
        return { success: false, message: "Login Failed: Incorrect Username or Password" }
    }
}
