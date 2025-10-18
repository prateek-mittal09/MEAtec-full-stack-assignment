import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { extractUserFromRequest } from '@/lib/middleware';
import { successResponse, ErrorResponses } from '@/lib/response';
import { UpdateTaskRequest } from '@/types';

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const authenticatedUser = await extractUserFromRequest(request);

        if (!authenticatedUser) {
            return ErrorResponses.unauthorized();
        }

        const { id: targetTaskId } = await params;

        const taskRecord = await prisma.task.findUnique({
            where: { id: targetTaskId },
        });

        if (!taskRecord) {
            return ErrorResponses.notFound('Task');
        }

        const isTaskOwner = taskRecord.userId === authenticatedUser.userId;
        if (!isTaskOwner) {
            return ErrorResponses.forbidden('Access denied: This task belongs to another user');
        }

        const updatePayload: UpdateTaskRequest = await request.json();
        const { title: newTitle, description: newDescription, status: newStatus } = updatePayload;

        const hasUpdates = newTitle || newDescription !== undefined || newStatus;
        if (!hasUpdates) {
            return ErrorResponses.invalidInput('Provide at least one field to update');
        }

        const MIN_TITLE_LENGTH = 3;
        if (newTitle !== undefined && newTitle.trim().length < MIN_TITLE_LENGTH) {
            return ErrorResponses.invalidInput(`Title must have at least ${MIN_TITLE_LENGTH} characters`);
        }

        const ALLOWED_STATUSES = ['PENDING', 'COMPLETED'];
        if (newStatus && !ALLOWED_STATUSES.includes(newStatus)) {
            return ErrorResponses.invalidInput(`Status must be: ${ALLOWED_STATUSES.join(' or ')}`);
        }

        const modifications: any = {};
        if (newTitle !== undefined) modifications.title = newTitle.trim();
        if (newDescription !== undefined) modifications.description = newDescription?.trim() || null;
        if (newStatus !== undefined) modifications.status = newStatus;

        const modifiedTask = await prisma.task.update({
            where: { id: targetTaskId },
            data: modifications,
        });

        return successResponse(modifiedTask, 'Task modified successfully');
    } catch (err) {
        console.error('Task update error:', err);
        return ErrorResponses.serverError();
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const authenticatedUser = await extractUserFromRequest(request);

        if (!authenticatedUser) {
            return ErrorResponses.unauthorized();
        }

        const { id: targetTaskId } = await params;

        const taskRecord = await prisma.task.findUnique({
            where: { id: targetTaskId },
        });

        if (!taskRecord) {
            return ErrorResponses.notFound('Task');
        }

        const isTaskOwner = taskRecord.userId === authenticatedUser.userId;
        if (!isTaskOwner) {
            return ErrorResponses.forbidden('Access denied: Cannot delete another user\'s task');
        }

        await prisma.task.delete({
            where: { id: targetTaskId },
        });

        return successResponse(
            { id: targetTaskId },
            'Task removed successfully'
        );
    } catch (err) {
        console.error('Task deletion error:', err);
        return ErrorResponses.serverError();
    }
}