import express from 'express';
import { login, register, getProfile, updateProfile } from '../Controller/userController.js';
import { getSavedRecipes, deleteSavedRecipe } from '../Controller/recipeController.js';
import { authenticateToken } from '../Middleware/authTokenMiddleware.js'
import { upload } from '../util/multer.js';
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
 *     responses:
 *       201:
 *         description: Successful successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User Created
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
 * /user/profile:
 *   post:
 *     summary: fetch users username, and account info
 *     responses:
 *       201:
 *         description: User Found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   username: string
 *                   firstname: string
 *                   lastname: string
 *                   email: string
 *                   picture: string
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
userRouter.get('/user/profile', authenticateToken, getProfile)

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
userRouter.put("/user/profile", authenticateToken, upload.single("profilePicture"), updateProfile)

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
userRouter.get('/user/recipes', authenticateToken, getSavedRecipes)


userRouter.delete("/user/recipes/:recipeId", authenticateToken, deleteSavedRecipe)

export default userRouter;