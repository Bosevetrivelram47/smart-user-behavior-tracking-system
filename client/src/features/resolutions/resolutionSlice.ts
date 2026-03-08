import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { MOCK_DELAY } from '../../utils/constants';

export interface Resolution {
    id: string;
    taskId: string;
    taskTitle: string;
    userId: string;
    userName: string;
    remarks: string;
    resolvedAt: string;
}

interface ResolutionState {
    data: Resolution[];
    loading: boolean;
    error: string | null;
    pagination: { page: number; pageSize: number; total: number };
}

const mockResolutions: Resolution[] = [
    { id: 'r1', taskId: 't1', taskTitle: 'Design Login UI', userId: '2', userName: 'Sam User', remarks: 'Completed wireframes and final UI approved by stakeholders.', resolvedAt: '2025-01-20' },
    { id: 'r2', taskId: 't2', taskTitle: 'Setup Redux Store', userId: '3', userName: 'Jordan Lee', remarks: 'Redux Toolkit configured with all 7 slices. Tests passing.', resolvedAt: '2025-01-25' },
    { id: 'r3', taskId: 't3', taskTitle: 'Build Dashboard', userId: '2', userName: 'Sam User', remarks: 'Dashboard with Recharts analytics. Pending minor chart tweaks.', resolvedAt: '2025-02-14' },
];

const initialState: ResolutionState = {
    data: [],
    loading: false,
    error: null,
    pagination: { page: 0, pageSize: 10, total: 0 },
};

export const fetchResolutions = createAsyncThunk('resolutions/fetchAll', async () => {
    await new Promise((r) => setTimeout(r, MOCK_DELAY));
    return mockResolutions;
});

export const createResolution = createAsyncThunk(
    'resolutions/create',
    async (resolution: Omit<Resolution, 'id' | 'resolvedAt'>) => {
        await new Promise((r) => setTimeout(r, MOCK_DELAY));
        return { ...resolution, id: `r${Date.now()}`, resolvedAt: new Date().toISOString().split('T')[0] };
    }
);

const resolutionSlice = createSlice({
    name: 'resolutions',
    initialState,
    reducers: {
        setPage(state, action) { state.pagination.page = action.payload; },
        setPageSize(state, action) { state.pagination.pageSize = action.payload; },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchResolutions.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchResolutions.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
                state.pagination.total = action.payload.length;
            })
            .addCase(fetchResolutions.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch resolutions';
            })
            .addCase(createResolution.fulfilled, (state, action) => {
                state.data.unshift(action.payload);
                state.pagination.total += 1;
            });
    },
});

export const { setPage, setPageSize } = resolutionSlice.actions;
export default resolutionSlice.reducer;
