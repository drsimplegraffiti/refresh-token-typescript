import config from 'config';
import { CookieOptions, NextFunction, Request, Response } from 'express';
import { CreateUserInput, LoginUserInput } from '../schema/user.schema';
import {
    createUser,
    findUser,
    findUserById,
    signToken,
} from '../services/user.service';
import redisClient from '../utils/connectRedis';
import { passwordResetToken, signJwt, verifyJwt } from '../utils/jwt';
import AppError from '../utils/app.Error';
import sendEmail from '../utils/mailer';
import { responseHelper } from '../utils/responseHelper';
import { cloudinary } from '../utils/fileupload';
import log from '../utils/logger';


// Exclude this fields from the response
export const excludedFields = ['password', 'passwordResetToken', 'passwordResetTokenExpiresAt'];

// Cookie options
const accessTokenCookieOptions: CookieOptions = {
    expires: new Date(
        Date.now() + config.get<number>('accessTokenExpiresIn') * 60 * 1000
    ),
    maxAge: config.get<number>('accessTokenExpiresIn') * 60 * 1000,
    httpOnly: true,
    sameSite: 'lax',
};

const refreshTokenCookieOptions: CookieOptions = {
    expires: new Date(
        Date.now() + config.get<number>('refreshTokenExpiresIn') * 60 * 1000
    ),
    maxAge: config.get<number>('refreshTokenExpiresIn') * 60 * 1000,
    httpOnly: true,
    sameSite: 'lax',
};

// Only set secure to true in production
if (process.env.NODE_ENV === 'production')
    accessTokenCookieOptions.secure = true;

export const registerHandler = async (
    req: Request<{}, {}, CreateUserInput>,
    res: Response,
    next: NextFunction
) => {
    try {
        const user = await createUser({
            email: req.body.email,
            name: req.body.name,
            password: req.body.password,
        });
        const verification_token = user.verificationToken;
        const url = `${req.protocol}://${req.get(
            'host'
        )}/api/v1/auth/verify-email/${verification_token}`;

        // send email
        await sendEmail({
            from: "abayomiogunnusi@gmail.com",
            to: user.email,
            subject: 'Verify your email address',
            text: `Click on this link to verify your email: ${url}`,
        })

        return responseHelper.createdSuccessResMsg(res, 'user created successfully', user);
    } catch (err: any) {
        if (err.code === 11000) {
            return responseHelper.conflictResMsg(res, 'Email already exist');
        }
        next(err);
    }
};

export const loginHandler = async (
    req: Request<{}, {}, LoginUserInput>,
    res: Response,
    next: NextFunction
) => {
    try {
        const user = await findUser({ email: req.body.email });

        if (
            !user ||
            !(await user.comparePasswords(user.password, req.body.password))
        ) {
            return responseHelper.badRequestResMsg(res, 'Invalid email or password');
        }

        if (!user.verified) {
            return responseHelper.unauthorizedResMsg(res, 'Please verify your email');
        }
        const { access_token, refresh_token } = await signToken(user);

        res.cookie('access_token', access_token, accessTokenCookieOptions);
        res.cookie('refresh_token', refresh_token, refreshTokenCookieOptions);
        res.cookie('logged_in', true, {
            ...accessTokenCookieOptions,
            httpOnly: false,
        });

        return responseHelper.successResMsg(res, 'login successful', { access_token });
    } catch (err: any) {
        next(err);
    }
};

export const verifyUserEmailHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { verification_token } = req.params;
        if (!verification_token) {
            return responseHelper.badRequestResMsg(res, 'token not provided');
        }

        const user = await findUser({ verificationToken: verification_token });

        if (!user) {
            return responseHelper.badRequestResMsg(res, 'Invalid token provided');
        }

        if (user.verified) {
            return next(new AppError('User already verified', 400));
        }

        // verify user
        user.verified = true;
        user.verificationToken = undefined;

        // save user
        await user.save({ validateBeforeSave: false });

        return responseHelper.successResMsg(res, 'User verified successfully');

    } catch (err: any) {
        next(err);
    }
};

// forgot password handler
export const forgotPasswordHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const message = "If a user with this email exists, you will receive a password reset link shortly";
        const { email } = req.body;

        // check if email is provided
        if (!email) {
            return responseHelper.badRequestResMsg(res, 'Email not provided');
        }
        let user = await findUser({ email: email });

        if (!user) {
            return responseHelper.notFoundResMsg(res, message);
        }

        const reset_token = await passwordResetToken();
        user.passwordResetToken = reset_token;

        await user.save({ validateBeforeSave: false });

        const reset_url = `${req.protocol}://${req.get(
            'host'
        )}/api/v1/auth/reset-password/${reset_token}`;

        await sendEmail({
            from: "abayomiogunnusi@gmail.com",
            to: user.email,
            subject: 'Password reset token',
            text: `Click on this link to reset your password: ${reset_url}`,
        })
        return responseHelper.successResMsg(res, message);

    } catch (err: any) {
        next(err);
    }
};

// reset password handler
export const resetPasswordHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const message = "Password reset successful";
        const { password } = req.body;
        const { reset_token } = req.params;

        if (!password || !reset_token) {
            return responseHelper.badRequestResMsg(res, 'Password or reset token not provided');
        }

        let user = await findUser({ passwordResetToken: reset_token });

        if (!user) {
            return responseHelper.badRequestResMsg(res, 'Invalid token provided');
        }

        if (user.passwordResetTokenExpiresAt && user.passwordResetTokenExpiresAt.getTime() < Date.now()) {
            return responseHelper.badRequestResMsg(res, 'Token has expired');
        }

        user.passwordResetToken = undefined;
        user.passwordResetTokenExpiresAt = null;

        user.password = password;

        await user.save({ validateBeforeSave: false });
        return responseHelper.successResMsg(res, message);

    } catch (err: any) {
        next(err);
    }
};



// Refresh tokens
const logout = (res: Response) => {
    res.cookie('access_token', '', { maxAge: 1 });
    res.cookie('refresh_token', '', { maxAge: 1 });
    res.cookie('logged_in', '', {
        maxAge: 1,
    });
};

export const refreshAccessTokenHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        // Get the refresh token from cookie
        const refresh_token = req.cookies.refresh_token as string;

        // Validate the Refresh token
        const decoded = verifyJwt<{ sub: string }>(
            refresh_token,
            'refreshTokenPublicKey'
        );
        const message = 'Could not refresh access token';
        if (!decoded) {
            // return next(new AppError(message, 403));
            return responseHelper.unauthorizedResMsg(res, message);
        }

        // Check if the user has a valid session
        const session = await redisClient.get(decoded.sub);
        if (!session) {
            // return next(new AppError(message, 403));
            return responseHelper.unauthorizedResMsg(res, message);
        }

        // Check if the user exist
        const user = await findUserById(JSON.parse(session)._id);

        if (!user) {
            // return next(new AppError(message, 403));
            return responseHelper.unauthorizedResMsg(res, message);
        }

        // Sign new access token
        const access_token = signJwt({ sub: user._id }, 'accessTokenPrivateKey', {
            expiresIn: `${config.get<number>('accessTokenExpiresIn')}m`,
        });

        // Send the access token as cookie
        res.cookie('access_token', access_token, accessTokenCookieOptions);
        res.cookie('logged_in', true, {
            ...accessTokenCookieOptions,
            httpOnly: false,
        });
        return responseHelper.successResMsg(res, 'Access token refreshed successfully', { access_token });
    } catch (err: any) {
        next(err);
    }
};

export const logoutHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const user = res.locals.user;
        await redisClient.del(user._id);
        logout(res);
        return res.status(200).json({ status: 'success' });
    } catch (err: any) {
        next(err);
    }
};

interface FileWithMetadata extends Express.Multer.File {
    path: string;
}

// update user profile with image
export const updateUserProfileHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const user = res.locals.user;

        // get the image from req.file
        const image = req.file as FileWithMetadata;

        if (!image) {
            return responseHelper.badRequestResMsg(res, 'Image not provided');
        }

        const result = await cloudinary.uploader.upload(image.path);

        // find user and update profile
        const foundUser = await findUser({ _id: user._id })

        if (!foundUser) {
            return responseHelper.notFoundResMsg(res, 'User not found');
        }

        foundUser.profilePicture = result.secure_url;

         await foundUser.save({ validateBeforeSave: false});

        return responseHelper.successResMsg(res, 'Profile updated successfully', { profile: user.profile });

    } catch (err: any) {
        log.error(err);
        next(err);
    }
};