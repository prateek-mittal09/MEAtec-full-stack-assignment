import { prisma } from '@/lib/prisma';
import { verifyPassword, createAuthToken } from '@/lib/auth';
import { successResponse, ErrorResponses } from '@/lib/response';
import { LoginRequest, UserResponse } from '@/types';

export async function POST(request: Request) {
    try {
        const requestBody: LoginRequest = await request.json();
        const { username: userIdentifier, password: userPassword } = requestBody;

        if (!userIdentifier || !userPassword) {
            return ErrorResponses.missingFields(['username', 'password']);
        }

        const userRecord = await prisma.user.findUnique({
            where: { username: userIdentifier },
        });

        if (!userRecord) {
            return ErrorResponses.unauthorized('Credentials are incorrect');
        }

        const passwordMatches = await verifyPassword(userPassword, userRecord.password);

        if (!passwordMatches) {
            return ErrorResponses.unauthorized('Credentials are incorrect');
        }

        const accessToken = createAuthToken({
            userId: userRecord.id,
            username: userRecord.username,
        });

        const userDetails: UserResponse = {
            id: userRecord.id,
            username: userRecord.username,
            createdAt: userRecord.createdAt,
            updatedAt: userRecord.updatedAt,
        };

        return successResponse(
            {
                token: accessToken,
                user: userDetails,
            },
            'Authentication successful'
        );
    } catch (err) {
        console.error('Login processing error:', err);
        return ErrorResponses.serverError();
    }
}