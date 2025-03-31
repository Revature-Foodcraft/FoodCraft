import express from 'express';
import {login, register } from '../Controller/userController.js';

const userRouter = express.Router();

userRouter.post('/users', register);
userRouter.post('/login', login);

export default userRouter;