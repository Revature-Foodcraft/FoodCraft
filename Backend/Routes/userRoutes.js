import express from 'express';
import { login, register, getProfile, updateProfile} from '../Controller/userController.js';
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
userRouter.get('/user/profile',authenticateToken, getProfile)

/**
 * @swagger
 * /user/profile:
 *   put:
 *     summary: fetch users username, and account info
 *     responses:
 *       201:
 *         description: User Found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User Created
 *                 user:
 *                   username: string
 *                   firstname: string
 *                   lastname: string
 *                   email: string
 *                   picture: string
 *       :
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
userRouter.put("/user/profile", authenticateToken, upload.single("profilePicture"), updateProfile)
export default userRouter;