import { NextFunction, Request, Response } from 'express';
import AppError from '../utils/app.Error';

export const requireUser = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const user = res.locals.user;
        if (!user) {
            return next(new AppError(`Invalid token or session has expired`, 401));
        }

        next();
    } catch (err: any) {
        next(err);
    }
};
