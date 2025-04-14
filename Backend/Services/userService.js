import { hashPassword, comparePassword } from "../util/bcrypt.js"
import * as model from "../Models/model.js"
import { v4 as uuidv4 } from 'uuid';
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import { uploadImage, getSignedImageUrl, deleteImage } from "../util/s3.js";

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

    try {
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
    } catch (error) {
        return { success: false, message: "An error occurred during login", error: error.message }
    }
}

export async function getUser(userId) {
    const user = await model.getUser(userId)

    const pictureUrl = await getSignedImageUrl(user.picture || "default-avatar-icon.jpg");
    user.picture = pictureUrl;
    if (user) {
        return { success: true, user: user }
    } else {
        return { success: false, message: "Failed to get user" }
    }
}

export async function updateProfile(userId,{ username, firstname, lastname, email },picture) {
    const userDB = await model.getUser(userId);
    const updateUser = {
        PK: userDB.PK
    }

    if (username) {
        const exist = await model.getUserByUsername(username)
        if (!exist) {
            updateUser.username = username;
        } else {
            return { success: false, message: "username in use" }
        }
    }
    if(firstname || lastname || email){
        updateUser.account = {}
        if (firstname) {
        updateUser.account.firstname = firstname;
        }
        if (lastname) {
            updateUser.account.lastname = lastname;
        }
        if (email) {
            updateUser.account.email = email;
        }
    }
    
    if (picture) {
        const hasPicture = await model.getUser(userId)
        if (hasPicture.picture) {
            await deleteImage(hasPicture.picture)
        }
        const filename = `${userId}/${Date.now()}_${picture.originalname}`;
        try {
            await uploadImage(filename, picture.buffer, picture.mimeType);
            updateUser.picture = filename;
        } catch (error) {
            return { success: false, message: "Failed to upload picture", error: error.message };
        }
    }

    const user = await model.updateUser(updateUser)

    if (user) {
        return { success: true, message: "Profile updated successfully", user };
    } else {
        return { success: false, message: "Failed to update profile" };
    }
}

export async function getAccount({email,googleId,firstname,lastname}) {
    const user = await model.getUserByGoogleId(googleId)

    if(user){
        const token = jwt.sign({
            userId: user.PK
        },
            process.env.SECRET_KEY,
            {
                expiresIn: '1h'
            })
        
        return {success:true, message:"User Found", token:token}
    }else{
        const userObj = {
            PK: uuidv4(),
            SK: "PROFILE",
            username:email,
            googleId,
            account: {
                firstname,
                lastname,
                email,
            },
            picture:"",
            fridge: [],
            recipes: [],
            daily_macros: {}
        }
        
        const newUser = await model.createUser(userObj)

        if(newUser){
            const token = jwt.sign({
                userId: userObj.PK
            },
                process.env.SECRET_KEY,
                {
                    expiresIn: '1h'
                })

            return {success:true, message:"Account Created",token:token}
        }else{
            return {success:false, message:"Failed to Create Account"}
        }
    }
}
