import jwt, { SignOptions } from 'jsonwebtoken';
import crypto from 'crypto';
import config from 'config';

export const signJwt = (
    payload: Object,
    key: 'accessTokenPrivateKey' | 'refreshTokenPrivateKey',
    options: SignOptions = {}
) => {
    const privateKey = Buffer.from(config.get<string>(key), 'base64').toString(
        'ascii'
    );
    return jwt.sign(payload, privateKey, {
        ...(options && options),
        algorithm: 'RS256',
    });
};

export const verifyJwt = <T>(
    token: string,
    key: 'accessTokenPublicKey' | 'refreshTokenPublicKey'
): T | null => {
    try {
        const publicKey = Buffer.from(config.get<string>(key), 'base64').toString(
            'ascii'
        );
        return jwt.verify(token, publicKey) as T;
    } catch (error) {
        return null;
    }
};


export const emailVerificationToken = () => {
    return crypto.randomBytes(32).toString('hex');
};

export const passwordResetToken = () => {
    return crypto.randomBytes(32).toString('hex');
};