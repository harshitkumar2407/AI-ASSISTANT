import express from 'express';
import {    register,
            emailVerification,
            login,
            getMe
         } from '../controllers/auth.controller.js';

import {    loginValidator,
            registerValidator,
             } from '../middleware/validation.middleware.js';
import { authUser } from '../middleware/auth.middleware.js';
const AuthRouter = express.Router();


/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 * @body { username, email, password, confirmPassword }
 */
AuthRouter.post('/register', registerValidator, register);

AuthRouter.get('/health', (req, res) => {
  res.status(200).json({ message: 'Auth route is working', status: 'OK' });
});

/**
 * @route GET /api/auth/verify-email
 * @desc Verify user's email address
 * @access Public
 * @body { token }
 */
AuthRouter.get('/verify-email',emailVerification);

/**
 * @route POST /api/auth/login
 * @desc Login an existing user
 * @access Public
 * @body { email, password }
 */
AuthRouter.post('/login',loginValidator, login);

/**
 * @route GET /api/auth/me
 * @desc Get current user's profile
 * @access Private
 * 
 */
AuthRouter.get('/me',authUser, getMe);

export default AuthRouter;
