import { useEffect, useState, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
    loadAllTasks,
    addNewTask,
    modifyTask,
    removeTask,
} from '../store/slices/taskSlice';
import MainLayout from '../components/layout/Layout';
import TaskListView from '../components/tasks/TaskList';
import TaskDialogModal from '../components/tasks/TaskModal';
import type { Task, TaskStatus } from '../types';
import type { TaskFormData } from '../utils/validation';

const WorkspaceView = () => {
    const dispatchAction = useAppDispatch();
    const { tasks: allTasks, loading: isLoading } = useAppSelector((state) => state.tasks);
    const [modalVisible, setModalVisible] = useState(false);
    const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

    useEffect(() => {
        dispatchAction(loadAllTasks());
    }, [dispatchAction]);

    const createNewTask = async (formData: TaskFormData) => {
        setModalVisible(false);
        dispatchAction(addNewTask(formData));
    };

    const updateExistingTask = async (formData: TaskFormData) => {
        if (taskToEdit) {
            setModalVisible(false);
            setTaskToEdit(null);
            dispatchAction(modifyTask({ id: taskToEdit.id, data: formData }));
        }
    };

    const initiateEdit = (task: Task) => {
        setTaskToEdit(task);
        setModalVisible(true);
    };

    const deleteTask = (taskId: string) => {
        dispatchAction(removeTask(taskId));
    };

    const changeTaskStatus = (taskId: string, newStatus: TaskStatus) => {
        dispatchAction(modifyTask({ id: taskId, data: { status: newStatus } }));
    };

    const dismissModal = () => {
        setModalVisible(false);
        setTaskToEdit(null);
    };

    const openNewTaskModal = () => {
        setTaskToEdit(null);
        setModalVisible(true);
    };

    const taskMetrics = useMemo(() => {
        const totalCount = allTasks.length;
        const pendingCount = allTasks.filter((item) => item.status === 'PENDING').length;
        const completedCount = allTasks.filter((item) => item.status === 'COMPLETED').length;
        const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

        return { totalCount, pendingCount, completedCount, progressPercent };
    }, [allTasks]);

    return (
        <MainLayout>
            <div className="min-h-screen">
                <div className="max-w-7xl mx-auto py-8 px-6 sm:px-8 lg:px-10">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-10">
                        <div className="bg-white rounded-2xl shadow-lg p-6 card-hover">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-500 mb-1">All Tasks</p>
                                    <p className="text-3xl font-bold gradient-text">{taskMetrics.totalCount}</p>
                                </div>
                                <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
                                    <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                                        <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-lg p-6 card-hover">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-500 mb-1">In Progress</p>
                                    <p className="text-3xl font-bold text-amber-600">{taskMetrics.pendingCount}</p>
                                </div>
                                <div className="p-3 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl">
                                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-lg p-6 card-hover">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-500 mb-1">Done</p>
                                    <p className="text-3xl font-bold text-emerald-600">{taskMetrics.completedCount}</p>
                                </div>
                                <div className="p-3 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl">
                                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg p-6 card-hover text-white">
                            <div className="flex flex-col justify-between h-full">
                                <div>
                                    <p className="text-sm font-medium text-white text-opacity-90 mb-1">Progress</p>
                                    <p className="text-3xl font-bold">{taskMetrics.progressPercent}%</p>
                                </div>
                                <div className="mt-3">
                                    <div className="w-full bg-white bg-opacity-30 rounded-full h-2">
                                        <div
                                            className="bg-white h-2 rounded-full transition-all duration-500"
                                            style={{ width: `${taskMetrics.progressPercent}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg p-6">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                            <h2 className="text-2xl font-bold text-gray-800">Task Overview</h2>
                            <button
                                onClick={openNewTaskModal}
                                className="btn-primary flex items-center space-x-2 px-5 py-2.5 text-white font-semibold rounded-xl shadow-md"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                <span>Create Task</span>
                            </button>
                        </div>

                        <TaskListView
                            tasks={allTasks}
                            loading={isLoading}
                            onEdit={initiateEdit}
                            onDelete={deleteTask}
                            onToggleStatus={changeTaskStatus}
                        />
                    </div>

                    <TaskDialogModal
                        isOpen={modalVisible}
                        task={taskToEdit}
                        onClose={dismissModal}
                        onSubmit={taskToEdit ? updateExistingTask : createNewTask}
                        loading={isLoading}
                    />
                </div>
            </div>
        </MainLayout>
    );
};

export default WorkspaceView;