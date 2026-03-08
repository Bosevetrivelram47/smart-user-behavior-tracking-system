import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { MOCK_DELAY } from '../../utils/constants';

export interface Task {
    id: string;
    title: string;
    description: string;
    status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
    priority: 'LOW' | 'MEDIUM' | 'HIGH';
    assignedTo: string | null;
    createdAt: string;
    dueDate: string;
}

interface TaskState {
    data: Task[];
    loading: boolean;
    error: string | null;
    pagination: { page: number; pageSize: number; total: number };
}

const mockTasks: Task[] = [
    { id: 't1', title: 'Design Login UI', description: 'Create wireframes and mockups for login screen.', status: 'COMPLETED', priority: 'HIGH', assignedTo: '2', createdAt: '2025-01-10', dueDate: '2025-01-20' },
    { id: 't2', title: 'Setup Redux Store', description: 'Configure Redux Toolkit with all required slices.', status: 'COMPLETED', priority: 'HIGH', assignedTo: '3', createdAt: '2025-01-15', dueDate: '2025-01-25' },
    { id: 't3', title: 'Build Dashboard', description: 'Implement analytics dashboard with charts.', status: 'IN_PROGRESS', priority: 'HIGH', assignedTo: '2', createdAt: '2025-02-01', dueDate: '2025-02-15' },
    { id: 't4', title: 'User Management CRUD', description: 'Implement user listing, create, toggle active.', status: 'IN_PROGRESS', priority: 'MEDIUM', assignedTo: '5', createdAt: '2025-02-10', dueDate: '2025-02-28' },
    { id: 't5', title: 'Navigation Tracking', description: 'Log page navigation events for all users.', status: 'PENDING', priority: 'MEDIUM', assignedTo: null, createdAt: '2025-03-01', dueDate: '2025-03-20' },
    { id: 't6', title: 'Notification System', description: 'Build real-time notification badge and list.', status: 'PENDING', priority: 'LOW', assignedTo: '3', createdAt: '2025-03-05', dueDate: '2025-03-25' },
    { id: 't7', title: 'API Integration', description: 'Replace mock data with real backend API calls.', status: 'PENDING', priority: 'HIGH', assignedTo: null, createdAt: '2025-03-10', dueDate: '2025-04-01' },
    { id: 't8', title: 'Write Unit Tests', description: 'Add Jest + React Testing Library test coverage.', status: 'PENDING', priority: 'LOW', assignedTo: '5', createdAt: '2025-03-15', dueDate: '2025-04-10' },
];

const initialState: TaskState = {
    data: [],
    loading: false,
    error: null,
    pagination: { page: 0, pageSize: 10, total: 0 },
};

export const fetchTasks = createAsyncThunk('tasks/fetchAll', async () => {
    await new Promise((r) => setTimeout(r, MOCK_DELAY));
    return mockTasks;
});

export const createTask = createAsyncThunk(
    'tasks/create',
    async (task: Omit<Task, 'id' | 'createdAt'>) => {
        await new Promise((r) => setTimeout(r, MOCK_DELAY));
        return { ...task, id: `t${Date.now()}`, createdAt: new Date().toISOString().split('T')[0] };
    }
);

export const updateTaskStatus = createAsyncThunk(
    'tasks/updateStatus',
    async ({ id, status }: { id: string; status: Task['status'] }) => {
        await new Promise((r) => setTimeout(r, 300));
        return { id, status };
    }
);

const taskSlice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {
        setPage(state, action) { state.pagination.page = action.payload; },
        setPageSize(state, action) { state.pagination.pageSize = action.payload; },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTasks.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchTasks.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
                state.pagination.total = action.payload.length;
            })
            .addCase(fetchTasks.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch tasks';
            })
            .addCase(createTask.fulfilled, (state, action) => {
                state.data.unshift(action.payload);
                state.pagination.total += 1;
            })
            .addCase(updateTaskStatus.fulfilled, (state, action) => {
                const task = state.data.find((t) => t.id === action.payload.id);
                if (task) task.status = action.payload.status;
            });
    },
});

export const { setPage, setPageSize } = taskSlice.actions;
export default taskSlice.reducer;
