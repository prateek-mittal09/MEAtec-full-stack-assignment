import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { TaskState, Task, CreateTaskRequest, UpdateTaskRequest, ApiResponse } from '../../types';
import { getToken } from '../../utils/auth';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const defaultTaskState: TaskState = {
    tasks: [],
    selectedTask: null,
    loading: false,
    error: null,
};

const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
    const token = getToken();
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
        ...options,
        headers,
    });

    if (response.status === 401) {
        localStorage.removeItem('user_auth_token');
        localStorage.removeItem('user_data');
        window.location.href = '/login';
        throw new Error('Session expired');
    }

    return response;
};

export const loadAllTasks = createAsyncThunk(
    'taskManager/loadAll',
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetchWithAuth(`${API_BASE_URL}/api/tasks`);
            const data: ApiResponse<Task[]> = await response.json();

            if (!response.ok) {
                return rejectWithValue(data.error || 'Unable to load tasks');
            }

            if (data.success && data.data) {
                return data.data;
            }

            return rejectWithValue(data.error || 'Unable to load tasks');
        } catch (err: unknown) {
            if (err instanceof Error) {
                return rejectWithValue(err.message);
            }
            return rejectWithValue('Network error occurred');
        }
    }
);

export const addNewTask = createAsyncThunk(
    'taskManager/addNew',
    async (newTaskData: CreateTaskRequest, { rejectWithValue }) => {
        try {
            const response = await fetchWithAuth(`${API_BASE_URL}/api/tasks`, {
                method: 'POST',
                body: JSON.stringify(newTaskData),
            });

            const data: ApiResponse<Task> = await response.json();

            if (!response.ok) {
                return rejectWithValue(data.error || 'Unable to add task');
            }

            if (data.success && data.data) {
                return data.data;
            }

            return rejectWithValue(data.error || 'Unable to add task');
        } catch (err: unknown) {
            if (err instanceof Error) {
                return rejectWithValue(err.message);
            }
            return rejectWithValue('Network error occurred');
        }
    }
);

export const modifyTask = createAsyncThunk(
    'taskManager/modify',
    async ({ id: taskId, data: updates }: { id: string; data: UpdateTaskRequest }, { rejectWithValue }) => {
        try {
            const response = await fetchWithAuth(`${API_BASE_URL}/api/tasks/${taskId}`, {
                method: 'PUT',
                body: JSON.stringify(updates),
            });

            const data: ApiResponse<Task> = await response.json();

            if (!response.ok) {
                return rejectWithValue(data.error || 'Unable to modify task');
            }

            if (data.success && data.data) {
                return data.data;
            }

            return rejectWithValue(data.error || 'Unable to modify task');
        } catch (err: unknown) {
            if (err instanceof Error) {
                return rejectWithValue(err.message);
            }
            return rejectWithValue('Network error occurred');
        }
    }
);

export const removeTask = createAsyncThunk(
    'taskManager/remove',
    async (taskId: string, { rejectWithValue }) => {
        try {
            const response = await fetchWithAuth(`${API_BASE_URL}/api/tasks/${taskId}`, {
                method: 'DELETE',
            });

            const data: ApiResponse<{ id: string }> = await response.json();

            if (!response.ok) {
                return rejectWithValue(data.error || 'Unable to remove task');
            }

            if (data.success) {
                return taskId;
            }

            return rejectWithValue(data.error || 'Unable to remove task');
        } catch (err: unknown) {
            if (err instanceof Error) {
                return rejectWithValue(err.message);
            }
            return rejectWithValue('Network error occurred');
        }
    }
);

const taskManagerSlice = createSlice({
    name: 'taskManager',
    initialState: defaultTaskState,
    reducers: {
        selectTask: (state, action: PayloadAction<Task | null>) => {
            state.selectedTask = action.payload;
        },
        resetError: (state) => {
            state.error = null;
        },
        resetAllTasks: (state) => {
            state.tasks = [];
            state.selectedTask = null;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        // Load tasks handlers
        builder
            .addCase(loadAllTasks.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loadAllTasks.fulfilled, (state, action) => {
                state.loading = false;
                state.tasks = action.payload;
                state.error = null;
            })
            .addCase(loadAllTasks.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });

        // Add task handlers
        builder
            .addCase(addNewTask.pending, (state, action) => {
                const placeholderTask: Task = {
                    id: `placeholder-${Date.now()}`,
                    title: action.meta.arg.title || '',
                    description: action.meta.arg.description || '',
                    status: action.meta.arg.status || 'PENDING',
                    userId: '',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                };
                state.tasks.unshift(placeholderTask);
                state.error = null;
            })
            .addCase(addNewTask.fulfilled, (state, action) => {
                const placeholderIdx = state.tasks.findIndex(item => item.id.startsWith('placeholder-'));
                if (placeholderIdx !== -1) {
                    state.tasks[placeholderIdx] = action.payload;
                } else {
                    state.tasks.unshift(action.payload);
                }
                state.error = null;
            })
            .addCase(addNewTask.rejected, (state, action) => {
                state.tasks = state.tasks.filter(item => !item.id.startsWith('placeholder-'));
                state.error = action.payload as string;
            });

        // Modify task handlers
        builder
            .addCase(modifyTask.pending, (state, action) => {
                const taskIdx = state.tasks.findIndex((item) => item.id === action.meta.arg.id);
                if (taskIdx !== -1) {
                    state.tasks[taskIdx] = {
                        ...state.tasks[taskIdx],
                        ...action.meta.arg.data,
                        updatedAt: new Date().toISOString(),
                    };
                }
                if (state.selectedTask?.id === action.meta.arg.id) {
                    state.selectedTask = {
                        ...state.selectedTask,
                        ...action.meta.arg.data,
                        updatedAt: new Date().toISOString(),
                    };
                }
                state.error = null;
            })
            .addCase(modifyTask.fulfilled, (state, action) => {
                const taskIdx = state.tasks.findIndex((item) => item.id === action.payload.id);
                if (taskIdx !== -1) {
                    state.tasks[taskIdx] = action.payload;
                }
                if (state.selectedTask?.id === action.payload.id) {
                    state.selectedTask = action.payload;
                }
                state.error = null;
            })
            .addCase(modifyTask.rejected, (state, action) => {
                state.error = action.payload as string;
            });

        // Remove task handlers
        builder
            .addCase(removeTask.pending, (state, action) => {
                state.tasks = state.tasks.filter((item) => item.id !== action.meta.arg);
                if (state.selectedTask?.id === action.meta.arg) {
                    state.selectedTask = null;
                }
                state.error = null;
            })
            .addCase(removeTask.fulfilled, (state) => {
                state.error = null;
            })
            .addCase(removeTask.rejected, (state, action) => {
                state.error = action.payload as string;
            });
    },
});

export const { selectTask, resetError, resetAllTasks } = taskManagerSlice.actions;
export default taskManagerSlice.reducer;

