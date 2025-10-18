import { useState } from 'react';
import type { Task } from '../../types';
import { formatDate } from '../../utils/dateFormat';

interface TaskItemProps {
    task: Task;
    onEdit: (task: Task) => void;
    onDelete: (id: string) => void;
    onToggleStatus: (id: string, status: 'PENDING' | 'COMPLETED') => void;
}

const TaskItemRow = ({ task, onEdit, onDelete, onToggleStatus }: TaskItemProps) => {
    const [confirmDelete, setConfirmDelete] = useState(false);

    const processDelete = () => {
        onDelete(task.id);
        setConfirmDelete(false);
    };

    const switchStatus = () => {
        const updatedStatus = task.status === 'PENDING' ? 'COMPLETED' : 'PENDING';
        onToggleStatus(task.id, updatedStatus);
    };

    const isCompleted = task.status === 'COMPLETED';

    return (
        <div className="bg-gradient-to-r from-white to-gray-50 rounded-xl shadow-md p-5 card-hover border-l-4 border-indigo-500">
            <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
                    <button
                        onClick={switchStatus}
                        className={`mt-1 flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${isCompleted
                            ? 'bg-gradient-to-br from-emerald-400 to-teal-500 border-emerald-500 shadow-md'
                            : 'border-gray-300 hover:border-indigo-500 hover:shadow-md'
                            }`}
                    >
                        {isCompleted && (
                            <svg
                                className="w-4 h-4 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={3}
                                    d="M5 13l4 4L19 7"
                                />
                            </svg>
                        )}
                    </button>

                    <div className="flex-1 min-w-0">
                        <h3
                            className={`text-lg font-bold mb-1 ${isCompleted
                                ? 'text-gray-400 line-through'
                                : 'text-gray-800'
                                }`}
                        >
                            {task.title}
                        </h3>
                        {task.description && (
                            <p
                                className={`text-sm mb-2 ${isCompleted ? 'text-gray-400' : 'text-gray-600'
                                    }`}
                            >
                                {task.description}
                            </p>
                        )}
                        <div className="flex items-center gap-3 mt-2">
                            <span
                                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${isCompleted
                                    ? 'bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700'
                                    : 'bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700'
                                    }`}
                            >
                                {isCompleted ? '✓ Done' : '⏳ Active'}
                            </span>
                            <span className="text-xs text-gray-500 flex items-center gap-1">
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                {formatDate(task.createdAt)}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex items-start gap-2">
                    <button
                        onClick={() => onEdit(task)}
                        className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                        title="Modify task"
                    >
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                            />
                        </svg>
                    </button>
                    <button
                        onClick={() => setConfirmDelete(true)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        title="Remove task"
                    >
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>
            </div>

            {confirmDelete && (
                <div className="mt-4 p-4 bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-xl">
                    <p className="text-sm text-red-800 font-semibold mb-3">Confirm task removal?</p>
                    <div className="flex gap-2">
                        <button
                            onClick={processDelete}
                            className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-red-500 to-red-600 rounded-lg hover:from-red-600 hover:to-red-700 transition-all"
                        >
                            Confirm
                        </button>
                        <button
                            onClick={() => setConfirmDelete(false)}
                            className="px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all"
                        >
                            Keep It
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TaskItemRow;

