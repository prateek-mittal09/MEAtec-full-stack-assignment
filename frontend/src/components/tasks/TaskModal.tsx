import { useEffect } from 'react';
import TaskFormComponent from './TaskForm';
import type { Task } from '../../types';
import type { TaskFormData } from '../../utils/validation';

interface TaskModalProps {
    isOpen: boolean;
    task?: Task | null;
    onClose: () => void;
    onSubmit: (data: TaskFormData) => Promise<void>;
    loading?: boolean;
}

const TaskDialogModal = ({ isOpen, task, onClose, onSubmit, loading = false }: TaskModalProps) => {
    useEffect(() => {
        const handleBodyScroll = () => {
            if (isOpen) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = 'unset';
            }
        };

        handleBodyScroll();

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const modalTitle = task ? 'Modify Task' : 'New Task';

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-screen items-center justify-center p-4">
                <div
                    className="fixed inset-0 bg-gradient-to-br from-indigo-900 to-purple-900 bg-opacity-75 backdrop-blur-sm transition-opacity"
                    onClick={onClose}
                />

                <div className="relative transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-xl">
                    <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-500 to-purple-600"></div>

                    <div className="bg-white px-6 pb-6 pt-8 sm:px-8">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-2xl font-bold gradient-text">
                                {modalTitle}
                            </h3>
                            <button
                                onClick={onClose}
                                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <TaskFormComponent
                            task={task}
                            onSubmit={onSubmit}
                            onCancel={onClose}
                            loading={loading}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaskDialogModal;

