import express from 'express';
import {
    forgotPasswordHandler,
    loginHandler,
    logoutHandler,
    refreshAccessTokenHandler,
    registerHandler,
    resetPasswordHandler,
    verifyUserEmailHandler,
} from '../controllers/auth.controller';
import { requireUser } from '../middleware/requireUser';
import { validate } from '../middleware/validate';
import { createUserSchema, forgotPasswordSchema, loginUserSchema, resetPasswordSchema, verifyEmailSchema } from '../schema/user.schema';
import { deserializeUser } from '../middleware/deserialiseUser';

const router = express.Router();

// Register user route
router.post('/register', validate(createUserSchema), registerHandler);

// Login user route
router.post('/login', validate(loginUserSchema), loginHandler);

// Verify email route
router.get('/verify-email/:verification_token', validate(verifyEmailSchema), verifyUserEmailHandler);


// Forgot password route
router.post('/forgot-password', validate(forgotPasswordSchema), forgotPasswordHandler);

// Reset password route
router.post('/reset-password/:reset_token', validate(resetPasswordSchema), resetPasswordHandler);

// Refresh access toke route
router.get('/refresh', refreshAccessTokenHandler);


router.use(deserializeUser, requireUser);

// Logout User
router.get('/logout', logoutHandler);

export default router;
