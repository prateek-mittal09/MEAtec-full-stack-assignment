import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { extractUserFromRequest } from '@/lib/middleware';
import { successResponse, ErrorResponses } from '@/lib/response';
import { CreateTaskRequest } from '@/types';

export async function GET(request: NextRequest) {
    try {
        const authenticatedUser = await extractUserFromRequest(request);

        if (!authenticatedUser) {
            return ErrorResponses.unauthorized();
        }

        const userTasksList = await prisma.task.findMany({
            where: {
                userId: authenticatedUser.userId,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return successResponse(userTasksList, 'Tasks fetched successfully');
    } catch (err) {
        console.error('Task retrieval error:', err);
        return ErrorResponses.serverError();
    }
}

export async function POST(request: NextRequest) {
    try {
        const authenticatedUser = await extractUserFromRequest(request);

        if (!authenticatedUser) {
            return ErrorResponses.unauthorized();
        }

        const taskData: CreateTaskRequest = await request.json();
        const { title: taskTitle, description: taskDescription, status: taskStatus } = taskData;

        if (!taskTitle) {
            return ErrorResponses.missingFields(['title']);
        }

        const cleanedTitle = taskTitle.trim();
        const MINIMUM_TITLE_LENGTH = 3;

        if (cleanedTitle.length < MINIMUM_TITLE_LENGTH) {
            return ErrorResponses.invalidInput(`Title must contain at least ${MINIMUM_TITLE_LENGTH} characters`);
        }

        const VALID_STATUSES = ['PENDING', 'COMPLETED'];
        if (taskStatus && !VALID_STATUSES.includes(taskStatus)) {
            return ErrorResponses.invalidInput(`Status must be one of: ${VALID_STATUSES.join(', ')}`);
        }

        const createdTask = await prisma.task.create({
            data: {
                title: cleanedTitle,
                description: taskDescription?.trim() || null,
                status: taskStatus || 'PENDING',
                userId: authenticatedUser.userId,
            },
        });

        return successResponse(createdTask, 'Task added successfully', 201);
    } catch (err) {
        console.error('Task creation error:', err);
        return ErrorResponses.serverError();
    }
}