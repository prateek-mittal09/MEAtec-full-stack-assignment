import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { taskSchema, type TaskFormData } from '../../utils/validation';
import type { Task } from '../../types';

interface TaskFormProps {
    task?: Task | null;
    onSubmit: (data: TaskFormData) => Promise<void>;
    onCancel: () => void;
    loading?: boolean;
}

const TaskFormComponent = ({ task, onSubmit, onCancel, loading = false }: TaskFormProps) => {
    const {
        register,
        handleSubmit,
        formState: { errors: validationErrors },
    } = useForm<TaskFormData>({
        resolver: zodResolver(taskSchema),
        defaultValues: {
            title: task?.title || '',
            description: task?.description || '',
            status: task?.status || 'PENDING',
        },
    });

    const isEditMode = !!task;

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
                <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">
                    Task Title <span className="text-red-500">*</span>
                </label>
                <input
                    {...register('title')}
                    id="title"
                    type="text"
                    className={`w-full px-4 py-3 border-2 rounded-xl transition-all ${validationErrors.title
                        ? 'border-red-400 focus:border-red-500'
                        : 'border-gray-200 focus:border-indigo-500'
                        } focus:outline-none focus:ring-2 focus:ring-indigo-200 text-sm`}
                    placeholder="What needs to be done?"
                />
                {validationErrors.title && (
                    <p className="mt-2 text-xs text-red-600 flex items-center gap-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {validationErrors.title.message}
                    </p>
                )}
            </div>

            <div>
                <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
                    Details (Optional)
                </label>
                <textarea
                    {...register('description')}
                    id="description"
                    rows={4}
                    className={`w-full px-4 py-3 border-2 rounded-xl transition-all ${validationErrors.description
                        ? 'border-red-400 focus:border-red-500'
                        : 'border-gray-200 focus:border-indigo-500'
                        } focus:outline-none focus:ring-2 focus:ring-indigo-200 text-sm resize-none`}
                    placeholder="Add more information about this task..."
                />
                {validationErrors.description && (
                    <p className="mt-2 text-xs text-red-600">{validationErrors.description.message}</p>
                )}
            </div>

            <div>
                <label htmlFor="status" className="block text-sm font-semibold text-gray-700 mb-2">
                    Current Status
                </label>
                <select
                    {...register('status')}
                    id="status"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-sm transition-all"
                >
                    <option value="PENDING">⏳ Active</option>
                    <option value="COMPLETED">✓ Completed</option>
                </select>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-5 py-2.5 text-sm font-semibold text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all"
                >
                    Dismiss
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary px-5 py-2.5 text-sm font-semibold text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                    {loading ? '⏳ Processing...' : isEditMode ? '✓ Save Changes' : '+ Add Task'}
                </button>
            </div>
        </form>
    );
};

export default TaskFormComponent;

