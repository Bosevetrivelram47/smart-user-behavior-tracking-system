import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { MOCK_DELAY } from '../../utils/constants';

export interface Assignment {
    id: string;
    taskId: string;
    taskTitle: string;
    userId: string;
    userName: string;
    assignedAt: string;
    assignedBy: string;
}

interface AssignmentState {
    data: Assignment[];
    loading: boolean;
    error: string | null;
    pagination: { page: number; pageSize: number; total: number };
}

const mockAssignments: Assignment[] = [
    { id: 'a1', taskId: 't1', taskTitle: 'Design Login UI', userId: '2', userName: 'Sam User', assignedAt: '2025-01-10', assignedBy: 'Alex Admin' },
    { id: 'a2', taskId: 't2', taskTitle: 'Setup Redux Store', userId: '3', userName: 'Jordan Lee', assignedAt: '2025-01-16', assignedBy: 'Alex Admin' },
    { id: 'a3', taskId: 't3', taskTitle: 'Build Dashboard', userId: '2', userName: 'Sam User', assignedAt: '2025-02-02', assignedBy: 'Morgan Davis' },
    { id: 'a4', taskId: 't4', taskTitle: 'User Management CRUD', userId: '5', userName: 'Riley Smith', assignedAt: '2025-02-11', assignedBy: 'Alex Admin' },
    { id: 'a5', taskId: 't6', taskTitle: 'Notification System', userId: '3', userName: 'Jordan Lee', assignedAt: '2025-03-06', assignedBy: 'Morgan Davis' },
];

const initialState: AssignmentState = {
    data: [],
    loading: false,
    error: null,
    pagination: { page: 0, pageSize: 10, total: 0 },
};

export const fetchAssignments = createAsyncThunk('assignments/fetchAll', async () => {
    await new Promise((r) => setTimeout(r, MOCK_DELAY));
    return mockAssignments;
});

export const createAssignment = createAsyncThunk(
    'assignments/create',
    async (assignment: Omit<Assignment, 'id' | 'assignedAt'>) => {
        await new Promise((r) => setTimeout(r, MOCK_DELAY));
        return { ...assignment, id: `a${Date.now()}`, assignedAt: new Date().toISOString().split('T')[0] };
    }
);

const assignmentSlice = createSlice({
    name: 'assignments',
    initialState,
    reducers: {
        setPage(state, action) { state.pagination.page = action.payload; },
        setPageSize(state, action) { state.pagination.pageSize = action.payload; },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAssignments.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchAssignments.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
                state.pagination.total = action.payload.length;
            })
            .addCase(fetchAssignments.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch assignments';
            })
            .addCase(createAssignment.fulfilled, (state, action) => {
                state.data.unshift(action.payload);
                state.pagination.total += 1;
            });
    },
});

export const { setPage, setPageSize } = assignmentSlice.actions;
export default assignmentSlice.reducer;
