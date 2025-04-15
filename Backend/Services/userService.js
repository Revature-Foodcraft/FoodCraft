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
            daily_macros: {
                date: new Date().toISOString(),
                
                protein: 0,
                fats: 0,
                carbs: 0,

                proteinGoal: 120,
                fatsGoal: 70,
                carbsGoal: 200
            }
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

export async function getAccount({email,googleId,firstname ='',lastname =''}) {
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

export async function linkAccount(userId,googleId,email) {
    const updateUser = {
        PK: userId,
        googleId: googleId,
        account:{
            email
        }
    }

    const user = await model.updateUser(updateUser)

    if (user) {
        return { success: true, message: "Profile updated successfully", user };
    } else {
        return { success: false, message: "Failed to update profile" };
    }
}

/**
 * Retrieves and conditionally resets the user's daily_macros if the stored date
 * is not equal to today's date.
 *
 * @param {string} userId - The unique identifier for the user.
 * @returns {Promise<Object|null>} A promise that resolves to the daily_macros object or null if not found.
 */
export async function getDailyMacros(userId) {
    // Get the current daily_macros from the model
    const dailyMacros = await model.getDailyMacros(userId);
    
    if (!dailyMacros) {
      // User not found or no daily_macros present
      return null;
    }
  
    // Compare the stored date and today's date (only the date part)
    const storedDate = new Date(dailyMacros.date).toDateString();
    const today = new Date().toDateString();
  
    if (storedDate !== today) {
      // It's a new day so reset consumed values and update the date.
      const updatedDailyMacros = {
        ...dailyMacros,
        date: new Date().toISOString(),
        protein: 0,
        fats: 0,
        carbs: 0
      };
  
      // Update the record using the model's updateMacros function.
      const result = await model.updateMacros(userId, updatedDailyMacros);
      
      // Return the updated daily_macros object if available.
      return result && result.daily_macros ? result.daily_macros : updatedDailyMacros;
    }
  
    // If the stored date is already today's, return the daily_macros as-is.
    return dailyMacros;
  }

  /**
 * Updates the daily_macros for a user using the model's updateMacros function.
 *
 * @param {string} userId - The unique identifier for the user.
 * @param {object} newDailyMacros - The updated daily_macros object.
 *   Example:
 *   {
 *     date: "2025-04-14T00:00:00.000Z",
 *     protein: 80,
 *     fats: 60,
 *     carbs: 160,
 *     proteinGoal: 120,
 *     fatsGoal: 70,
 *     carbsGoal: 200
 *   }
 * @returns {Promise<object>} Returns an object indicating success status and the updated daily_macros.
 */
export async function updateMacros(userId, newDailyMacros) {
    try {
      const updatedUser = await model.updateMacros(userId, newDailyMacros);
  
      if (updatedUser && updatedUser.daily_macros) {
        return { success: true, daily_macros: updatedUser.daily_macros };
      } else {
        return { success: false, code: 500, message: "Failed updating daily macros" };
      }
    } catch (error) {
      return { success: false, code: 500, message: error.message };
    }
  }