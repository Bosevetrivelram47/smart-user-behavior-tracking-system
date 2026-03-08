import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { MOCK_DELAY } from '../../utils/constants';

export interface NavLog {
    id: string;
    userId: string;
    userName: string;
    page: string;
    path: string;
    timeSpent: number; // seconds
    visitedAt: string;
}

interface NavigationState {
    data: NavLog[];
    loading: boolean;
    error: string | null;
    pagination: { page: number; pageSize: number; total: number };
}

const mockNavLogs: NavLog[] = [
    { id: 'n1', userId: '2', userName: 'Sam User', page: 'Dashboard', path: '/dashboard', timeSpent: 245, visitedAt: '2026-03-04T08:00:00' },
    { id: 'n2', userId: '2', userName: 'Sam User', page: 'My Tasks', path: '/tasks', timeSpent: 412, visitedAt: '2026-03-04T08:05:00' },
    { id: 'n3', userId: '3', userName: 'Jordan Lee', page: 'Dashboard', path: '/dashboard', timeSpent: 130, visitedAt: '2026-03-04T09:00:00' },
    { id: 'n4', userId: '3', userName: 'Jordan Lee', page: 'Notifications', path: '/notifications', timeSpent: 65, visitedAt: '2026-03-04T09:03:00' },
    { id: 'n5', userId: '1', userName: 'Alex Admin', page: 'Users', path: '/users', timeSpent: 512, visitedAt: '2026-03-04T09:30:00' },
    { id: 'n6', userId: '1', userName: 'Alex Admin', page: 'Tasks', path: '/tasks', timeSpent: 380, visitedAt: '2026-03-04T09:45:00' },
    { id: 'n7', userId: '5', userName: 'Riley Smith', page: 'Dashboard', path: '/dashboard', timeSpent: 210, visitedAt: '2026-03-04T10:00:00' },
    { id: 'n8', userId: '5', userName: 'Riley Smith', page: 'My Tasks', path: '/tasks', timeSpent: 650, visitedAt: '2026-03-04T10:05:00' },
    { id: 'n9', userId: '2', userName: 'Sam User', page: 'Notifications', path: '/notifications', timeSpent: 90, visitedAt: '2026-03-04T10:30:00' },
    { id: 'n10', userId: '1', userName: 'Alex Admin', page: 'Navigation Logs', path: '/navigation-logs', timeSpent: 720, visitedAt: '2026-03-04T11:00:00' },
];

const initialState: NavigationState = {
    data: [],
    loading: false,
    error: null,
    pagination: { page: 0, pageSize: 10, total: 0 },
};

export const fetchNavLogs = createAsyncThunk('navigation/fetchAll', async () => {
    await new Promise((r) => setTimeout(r, MOCK_DELAY));
    return mockNavLogs;
});

const navigationSlice = createSlice({
    name: 'navigation',
    initialState,
    reducers: {
        setPage(state, action) { state.pagination.page = action.payload; },
        setPageSize(state, action) { state.pagination.pageSize = action.payload; },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchNavLogs.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchNavLogs.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
                state.pagination.total = action.payload.length;
            })
            .addCase(fetchNavLogs.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch navigation logs';
            });
    },
});

export const { setPage, setPageSize } = navigationSlice.actions;
export default navigationSlice.reducer;
