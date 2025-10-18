import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { JWTPayload } from '@/types';

const AUTH_SECRET_KEY = process.env.JWT_SECRET!;
const TOKEN_VALIDITY_PERIOD = process.env.JWT_EXPIRES_IN!;
const HASH_COMPLEXITY = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10');

export function createAuthToken(credentials: { userId: string; username: string }): string {
    try {
        const tokenPayload = {
            userId: credentials.userId,
            username: credentials.username,
        };

        const authToken = jwt.sign(
            tokenPayload,
            AUTH_SECRET_KEY,
            { expiresIn: TOKEN_VALIDITY_PERIOD } as jwt.SignOptions
        );

        return authToken;
    } catch (err) {
        console.error('Token creation error:', err);
        throw new Error('Unable to create authentication token');
    }
}

export function validateAuthToken(tokenString: string): JWTPayload | null {
    try {
        const decodedPayload = jwt.verify(tokenString, AUTH_SECRET_KEY) as JWTPayload;
        return decodedPayload;
    } catch (err) {
        console.error('Token validation error:', err);
        return null;
    }
}

export async function encryptPassword(plainPassword: string): Promise<string> {
    try {
        const encryptedPassword = await bcrypt.hash(plainPassword, HASH_COMPLEXITY);
        return encryptedPassword;
    } catch (err) {
        console.error('Password encryption error:', err);
        throw new Error('Unable to encrypt password');
    }
}

export async function verifyPassword(plainPassword: string, encryptedPassword: string): Promise<boolean> {
    try {
        const isPasswordValid = await bcrypt.compare(plainPassword, encryptedPassword);
        return isPasswordValid;
    } catch (err) {
        console.error('Password verification error:', err);
        return false;
    }
}