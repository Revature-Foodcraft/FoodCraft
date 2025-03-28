import express from 'express';
import { register } from '../Controller/userController.js';

// Define userRouter
const userRouter = express.Router();

// Define the route
userRouter.post('/users', register);

// Export the router
export default userRouter;