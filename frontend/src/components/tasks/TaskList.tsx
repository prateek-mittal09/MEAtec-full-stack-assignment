import { useState, useMemo } from 'react';
import TaskItemRow from './TaskItem';
import type { Task, TaskStatus } from '../../types';

interface TaskListProps {
    tasks: Task[];
    loading: boolean;
    onEdit: (task: Task) => void;
    onDelete: (id: string) => void;
    onToggleStatus: (id: string, status: TaskStatus) => void;
}

type ViewFilter = 'all' | 'pending' | 'completed';

const TaskListView = ({ tasks, loading, onEdit, onDelete, onToggleStatus }: TaskListProps) => {
    const [activeFilter, setActiveFilter] = useState<ViewFilter>('all');

    const displayedTasks = useMemo(() => {
        switch (activeFilter) {
            case 'pending':
                return tasks.filter((item) => item.status === 'PENDING');
            case 'completed':
                return tasks.filter((item) => item.status === 'COMPLETED');
            default:
                return tasks;
        }
    }, [tasks, activeFilter]);

    const taskCounts = useMemo(() => ({
        total: tasks.length,
        pending: tasks.filter((item) => item.status === 'PENDING').length,
        completed: tasks.filter((item) => item.status === 'COMPLETED').length,
    }), [tasks]);

    if (loading) {
        return (
            <div className="flex justify-center items-center py-16">
                <div className="spinner"></div>
            </div>
        );
    }

    const FilterButton = ({ type, label, count }: { type: ViewFilter; label: string; count: number }) => (
        <button
            onClick={() => setActiveFilter(type)}
            className={`px-5 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 ${activeFilter === type
                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
                }`}
        >
            {label} <span className="ml-1">({count})</span>
        </button>
    );

    return (
        <div className="space-y-5">
            <div className="flex flex-wrap gap-3 pb-4">
                <FilterButton type="all" label="Everything" count={taskCounts.total} />
                <FilterButton type="pending" label="Active" count={taskCounts.pending} />
                <FilterButton type="completed" label="Finished" count={taskCounts.completed} />
            </div>

            {displayedTasks.length === 0 ? (
                <div className="text-center py-16">
                    <div className="inline-block p-4 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full mb-4">
                        <svg
                            className="w-12 h-12 text-indigo-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                        </svg>
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 mb-2">Nothing here yet</h3>
                    <p className="text-sm text-gray-500">
                        {activeFilter === 'all'
                            ? 'Start by adding your first task above.'
                            : `No ${activeFilter === 'pending' ? 'active' : 'finished'} tasks at the moment.`}
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {displayedTasks.map((taskItem) => (
                        <TaskItemRow
                            key={taskItem.id}
                            task={taskItem}
                            onEdit={onEdit}
                            onDelete={onDelete}
                            onToggleStatus={onToggleStatus}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default TaskListView;

