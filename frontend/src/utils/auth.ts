import type { JWTPayload } from '../types';

const STORAGE_KEY_TOKEN = 'user_auth_token';

export const saveToken = (token: string): void => {
    localStorage.setItem(STORAGE_KEY_TOKEN, token);
};

export const getToken = (): string | null => {
    return localStorage.getItem(STORAGE_KEY_TOKEN);
};

export const removeToken = (): void => {
    localStorage.removeItem(STORAGE_KEY_TOKEN);
};

export const decodeToken = (token: string): JWTPayload | null => {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error('Error decoding token:', error);
        return null;
    }
};

export const isTokenExpired = (token: string): boolean => {
    const decoded = decodeToken(token);
    if (!decoded) return true;

    return false;
};