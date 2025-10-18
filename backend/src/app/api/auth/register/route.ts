import { prisma } from '@/lib/prisma';
import { encryptPassword } from '@/lib/auth';
import { successResponse, ErrorResponses } from '@/lib/response';
import { RegisterRequest } from '@/types';

export async function POST(request: Request) {
    try {
        const registrationData: RegisterRequest = await request.json();
        const { username: desiredUsername, password: desiredPassword } = registrationData;

        if (!desiredUsername || !desiredPassword) {
            return ErrorResponses.missingFields(['username', 'password']);
        }

        const MIN_USERNAME_LENGTH = 3;
        if (desiredUsername.length < MIN_USERNAME_LENGTH) {
            return ErrorResponses.invalidInput(`Username requires at least ${MIN_USERNAME_LENGTH} characters`);
        }

        const MIN_PASSWORD_LENGTH = 4;
        if (desiredPassword.length < MIN_PASSWORD_LENGTH) {
            return ErrorResponses.invalidInput(`Password requires at least ${MIN_PASSWORD_LENGTH} characters`);
        }

        const userExists = await prisma.user.findUnique({
            where: { username: desiredUsername },
        });

        if (userExists) {
            return ErrorResponses.conflict('This username is already taken');
        }

        const securePassword = await encryptPassword(desiredPassword);

        const newUserAccount = await prisma.user.create({
            data: {
                username: desiredUsername,
                password: securePassword,
            },
        });

        return successResponse(
            {
                id: newUserAccount.id,
                username: newUserAccount.username,
                createdAt: newUserAccount.createdAt,
            },
            'Account created successfully',
            201
        );
    } catch (err) {
        console.error('Registration processing error:', err);
        return ErrorResponses.serverError();
    }
}