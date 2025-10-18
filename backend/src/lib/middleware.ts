import { NextRequest } from 'next/server';
import { validateAuthToken } from './auth';
import { JWTPayload } from '@/types';

export interface AuthenticatedRequest extends NextRequest {
    userId?: string;
    username?: string;
}

export function checkAuthentication(request: NextRequest): {
    authenticated: boolean;
    userId?: string;
    username?: string;
    error?: string;
} {
    try {
        const authorizationHeader = request.headers.get('authorization');

        if (!authorizationHeader) {
            return {
                authenticated: false,
                error: 'Authorization header missing',
            };
        }

        const isBearerToken = authorizationHeader.startsWith('Bearer ');

        if (!isBearerToken) {
            return {
                authenticated: false,
                error: 'Authorization format invalid. Expected: Bearer <token>',
            };
        }

        const extractedToken = authorizationHeader.substring(7);

        if (!extractedToken) {
            return {
                authenticated: false,
                error: 'Token not found in header',
            };
        }

        const tokenPayload = validateAuthToken(extractedToken);

        if (!tokenPayload) {
            return {
                authenticated: false,
                error: 'Token is invalid or has expired',
            };
        }

        return {
            authenticated: true,
            userId: tokenPayload.userId,
            username: tokenPayload.username,
        };
    } catch (err) {
        console.error('Authentication check error:', err);
        return {
            authenticated: false,
            error: 'Authentication process failed',
        };
    }
}

export async function extractUserFromRequest(request: NextRequest): Promise<{
    userId: string;
    username: string;
} | null> {
    const authResult = checkAuthentication(request);

    if (!authResult.authenticated || !authResult.userId || !authResult.username) {
        return null;
    }

    return {
        userId: authResult.userId,
        username: authResult.username,
    };
}