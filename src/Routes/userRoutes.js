import express from 'express';
import { login, register, getProfile, updateProfile, getDailyMacros, updateMacros, updateGoals, authGoogle, linkGoogle } from '../Controller/userController.js';
import { getSavedRecipes, deleteSavedRecipe , updateSavedRecipe} from '../Controller/recipeController.js';
import { authenticateToken } from '../Middleware/authTokenMiddleware.js'
import { upload } from '../util/multer.js';
import { authenticateGoogleToken } from '../Middleware/googleAuthMiddleware.js';
const userRouter = express.Router();

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user and store in the database.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: Required username for the user.
 *               password:
 *                 type: string
 *                 description: Must be at least 8 characters, include 1 capital letter, and 1 special character. Required.
 *               firstname:
 *                 type: string
 *                 description: First name of the user. Optional.
 *               lastname:
 *                 type: string
 *                 description: Last name of the user. Optional.
 *               email:
 *                 type: string
 *                 description: Email address of the user. Optional.
 *     responses:
 *       201:
 *         description: User created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User Created
 *                 user:
 *                   type: object
 *                   example: userObj
 *       400:
 *         description: Bad request due to invalid input.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error message
 *       500:
 *         description: Internal server error occurred.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Failed to create user
 */
userRouter.post('/users', register);

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Login for an existing user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: Required username for the user.
 *               password:
 *                 type: string
 *                 description: Must be at least 8 characters, include 1 capital letter, and 1 special character. Required.
 *     responses:
 *       201:
 *         description: Logged in successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User logged in successfully
 *                 token:
 *                   type: string
 *                   example: jwt_token_here
 *       400:
 *         description: Bad request due to invalid input.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error message
 */
userRouter.post('/login', login);
/**
 * @swagger
 * /auth/google:
 *   post:
 *     summary: Decode Google JWT token and create/login user.
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         description: Bearer token received from Google.
 *         schema:
 *           type: string
 *           example: Bearer <google-jwt-token>
 *     responses:
 *       200:
 *         description: User successfully authenticated.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User Logged In Successfully
 *                 token:
 *                   type: string
 *                   example: jwt_token_here
 *       401:
 *         description: Unauthorized due to missing or invalid token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid token or unauthorized access.
 */
userRouter.post('/auth/google', authenticateGoogleToken, authGoogle);

/**
 * @swagger
 * /auth/google:
 *   post:
 *     summary: Decode Google JWT token and link googleId and email to account
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         description: Bearer token received from API.
 *         schema:
 *           type: string
 *           example: Bearer <jwt-token>
 *       - in: header
 *         name: GoogleToken
 *         required: true
 *         description: Bearer token received from Google.
 *         schema:
 *           type: string
 *           example: Bearer <google-jwt-token>
 *     responses:
 *       200:
 *         description: User successfully authenticated.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User Logged In Successfully
 *                 token:
 *                   type: string
 *                   example: jwt_token_here
 *       401:
 *         description: Unauthorized due to missing or invalid token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid token or unauthorized access.
 */
userRouter.put('/auth/google', authenticateToken, authenticateGoogleToken, linkGoogle);

/**
 * @swagger
 * /user/profile:
 *   get:
 *     summary: Fetch user’s username and account info.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 username:
 *                   type: string
 *                 account:
 *                   type: object
 *                 picture:
 *                   type: string
 *       403:
 *         description: Missing token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error message
 */
userRouter.get('/user/profile', authenticateToken, getProfile);

/**
 * @swagger
 * /user/profile:
 *   put:
 *     summary: Update the user's profile information.
 *     description: Allows the user to update their profile details such as first name, last name, email, and profile picture.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               firstname:
 *                 type: string
 *                 description: The user's first name. Optional.
 *               username:
 *                 type: string
 *                 description: The user's username name. Optional.
 *               lastname:
 *                 type: string
 *                 description: The user's last name. Optional.
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The user's email address. Optional.
 *               profilePicture:
 *                 type: string
 *                 format: binary
 *                 description: The user's profile picture. Optional.
 *     responses:
 *       200:
 *         description: Profile updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Profile updated successfully
 *                 user:
 *                   type: object
 *                   properties:
 *                     username:
 *                       type: string
 *                       example: johndoe
 *                     firstname:
 *                       type: string
 *                       example: John
 *                     lastname:
 *                       type: string
 *                       example: Doe
 *                     email:
 *                       type: string
 *                       example: johndoe@example.com
 *                     picture:
 *                       type: string
 *                       example: https://s3.amazonaws.com/bucket-name/user-id/profile-picture.jpg
 *       400:
 *         description: Bad request due to invalid input.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["firstname must be a string", "email must be a valid email"]
 *       401:
 *         description: Unauthorized. Missing or invalid token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Unauthorized
 *       500:
 *         description: Internal server error occurred.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Failed to update profile
 */
userRouter.put("/user/profile", authenticateToken, upload.single("profilePicture"), updateProfile);

/**
 * @swagger
 * /user/recipes:
 *   get:
 *     summary: Retrieve all saved recipes for the authenticated user.
 *     description: Fetches a list of recipes saved by the authenticated user.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of saved recipes for the user.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 recipes:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "recipe-123"
 *                       name:
 *                         type: string
 *                         example: "Pasta"
 *                       description:
 *                         type: string
 *                         example: "A delicious pasta recipe."
 *                       ingredients:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: string
 *                               example: "ingredient-1"
 *                             amount:
 *                               type: number
 *                               example: 2
 *                       instructions:
 *                         type: array
 *                         items:
 *                           type: string
 *                           example: "Boil water"
 *                       rating:
 *                         type: number
 *                         example: 4.5
 *                       category:
 *                         type: string
 *                         example: "Italian"
 *                       dateCreated:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-04-07T14:10:00.000Z"
 *       401:
 *         description: Unauthorized. Missing or invalid token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Unauthorized
 *       500:
 *         description: Internal server error occurred.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Internal server error
 */
userRouter.get('/user/recipes', authenticateToken, getSavedRecipes);

/**
 * @swagger
 * /macros:
 *   get:
 *     summary: Retrieve daily macros for the authenticated user.
 *     description: Retrieves the user's daily macros. If the stored date is not today's date, it resets protein, fats, and carbs to 0 and updates the date.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Daily macros retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 daily_macros:
 *                   type: object
 *                   properties:
 *                     date:
 *                       type: string
 *                       format: date-time
 *                       example: 2025-04-14T00:00:00.000Z
 *                     protein:
 *                       type: number
 *                       example: 80
 *                     fats:
 *                       type: number
 *                       example: 60
 *                     carbs:
 *                       type: number
 *                       example: 160
 *                     proteinGoal:
 *                       type: number
 *                       example: 120
 *                     fatsGoal:
 *                       type: number
 *                       example: 70
 *                     carbsGoal:
 *                       type: number
 *                       example: 200
 *       401:
 *         description: Unauthorized. Missing or invalid token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Unauthorized
 *       500:
 *         description: Internal server error occurred.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error occurred.
 */
userRouter.get('/macros', authenticateToken, getDailyMacros);

/**
 * @swagger
 * /macros:
 *   put:
 *     summary: Update daily macros for the authenticated user.
 *     description: Updates the user's daily macros by adding the provided values to the current values.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               protein:
 *                 type: number
 *                 example: 80
 *               fats:
 *                 type: number
 *                 example: 60
 *               carbs:
 *                 type: number
 *                 example: 160
 *             required:
 *               - protein
 *               - fats
 *               - carbs
 *     responses:
 *       200:
 *         description: Daily macros updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Macros updated successfully
 *                 daily_macros:
 *                   type: object
 *                   properties:
 *                     date:
 *                       type: string
 *                       format: date-time
 *                       example: 2025-04-14T00:00:00.000Z
 *                     protein:
 *                       type: number
 *                       example: 80
 *                     fats:
 *                       type: number
 *                       example: 60
 *                     carbs:
 *                       type: number
 *                       example: 160
 *                     proteinGoal:
 *                       type: number
 *                       example: 120
 *                     fatsGoal:
 *                       type: number
 *                       example: 70
 *                     carbsGoal:
 *                       type: number
 *                       example: 200
 *       400:
 *         description: Bad request due to invalid input.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid input provided
 *       401:
 *         description: Unauthorized. Missing or invalid token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Unauthorized
 *       500:
 *         description: Internal server error occurred.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error occurred.
 */
userRouter.put('/macros', authenticateToken, updateMacros);

/**
 * @swagger
 * /macros/goals:
 *   put:
 *     summary: Update macro goals for the authenticated user.
 *     description: Updates the user's macro goals for protein, fats, and carbs.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               proteinGoal:
 *                 type: number
 *                 example: 120
 *               fatsGoal:
 *                 type: number
 *                 example: 70
 *               carbsGoal:
 *                 type: number
 *                 example: 200
 *             required:
 *               - proteinGoal
 *               - fatsGoal
 *               - carbsGoal
 *     responses:
 *       200:
 *         description: Macro goals updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Macro goals updated successfully
 *                 macro_goals:
 *                   type: object
 *                   properties:
 *                     proteinGoal:
 *                       type: number
 *                       example: 120
 *                     fatsGoal:
 *                       type: number
 *                       example: 70
 *                     carbsGoal:
 *                       type: number
 *                       example: 200
 *       400:
 *         description: Bad request due to invalid input.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid input provided
 *       401:
 *         description: Unauthorized. Missing or invalid token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Unauthorized
 *       500:
 *         description: Internal server error occurred.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error occurred.
 */
userRouter.put('/macros/goals', authenticateToken, updateGoals);

/**
 * @swagger
 * /user/recipes:
 *   post:
 *     summary: Retrieve all saved recipes for the authenticated user.
 *     description: Fetches a list of recipes saved by the authenticated user.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               recipeId:
 *                 type: string
 *                 description: Recipe ID. Required.
 *     responses:
 *       200:
 *         description: Message saying successfully added
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Recipe successfully added to list
 *       401:
 *         description: Unauthorized. Missing or invalid token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Unauthorized
 *       500:
 *         description: Internal server error occurred.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Internal server error
 */
userRouter.post('/user/recipes', authenticateToken, updateSavedRecipe);

/**
 * @swagger
 * /user/recipes:
 *   delete:
 *     summary: Delete recipe from the list
 *     description: Delete recipe from the saved list
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               recipeId:
 *                 type: string
 *                 description: Recipe ID. Required.
 *     responses:
 *       200:
 *         description: Message saying successfully deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Recipe successfully deleted from list
 *       401:
 *         description: Unauthorized. Missing or invalid token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Unauthorized
 *       500:
 *         description: Internal server error occurred.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Internal server error
 */

userRouter.delete('/user/recipes', authenticateToken, deleteSavedRecipe);
export default userRouter;
