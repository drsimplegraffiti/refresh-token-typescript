import { object, string, TypeOf } from 'zod';

export const createUserSchema = object({
    body: object({
        name: string({ required_error: 'Name is required' }),
        email: string({ required_error: 'Email is required' }).email(
            'Invalid email'
        ),
        password: string({ required_error: 'Password is required' })
            .min(8, 'Password must be more than 8 characters')
            .max(32, 'Password must be less than 32 characters'),
        passwordConfirm: string({ required_error: 'Please confirm your password' }),
    }).refine((data) => data.password === data.passwordConfirm, {
        path: ['passwordConfirm'],
        message: 'Passwords do not match',
    }),
});

export const loginUserSchema = object({
    body: object({
        email: string({ required_error: 'Email is required' }).email(
            'Invalid email or password'
        ),
        password: string({ required_error: 'Password is required' }).min(
            8,
            'Invalid email or password'
        ),
    }),
});

export const verifyEmailSchema = object({
    params: object({
        verification_token: string({ required_error: 'Token is required' }),
    }),
});

export const forgotPasswordSchema = object({
    body: object({
        email: string({
            required_error: 'Email is required',
        }).email('Not a valid email'),
    }),
});

export const resetPasswordSchema = object({
    params: object({
        reset_token: string({ required_error: 'Token is required' }),
    }),
    body: object({
        password: string({ required_error: 'Password is required' })
            .min(8, 'Password must be more than 8 characters')
            .max(32, 'Password must be less than 32 characters'),
        passwordConfirm: string({ required_error: 'Please confirm your password' }),
    }).refine((data) => data.password === data.passwordConfirm, {
        path: ['passwordConfirm'],
        message: 'Passwords do not match',
    }),
});

// name?, profilePicture, role
export const updateUserSchema = object({
    body: object({
        name: string(),
        profilePicture: string({ required_error: 'Profile picture is required' }), // coming from req.file.path
        role: string(),
    }),
});




export type CreateUserInput = TypeOf<typeof createUserSchema>['body'];
export type LoginUserInput = TypeOf<typeof loginUserSchema>['body'];
export type VerifyEmailInput = TypeOf<typeof verifyEmailSchema>['params'];
export type ForgotPasswordInput = TypeOf<typeof forgotPasswordSchema>['body'];
export type ResetPasswordInput = TypeOf<typeof resetPasswordSchema>['body'] & TypeOf<typeof resetPasswordSchema>['params'];
export type UpdateUserInput = TypeOf<typeof updateUserSchema>['body'];