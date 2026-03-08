import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { MOCK_DELAY } from '../../utils/constants';

export interface Notification {
    id: string;
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
    read: boolean;
    createdAt: string;
    userId: string;
}

interface NotificationState {
    data: Notification[];
    loading: boolean;
    error: string | null;
    pagination: { page: number; pageSize: number; total: number };
}

const mockNotifications: Notification[] = [
    { id: 'notif1', title: 'Task Assigned', message: 'You have been assigned "Build Dashboard" task.', type: 'info', read: false, createdAt: '2026-03-04T08:00:00', userId: '2' },
    { id: 'notif2', title: 'Task Completed', message: '"Design Login UI" has been marked as completed.', type: 'success', read: false, createdAt: '2026-03-04T09:00:00', userId: '2' },
    { id: 'notif3', title: 'New User Registered', message: 'Riley Smith has joined the platform.', type: 'info', read: true, createdAt: '2026-03-03T14:00:00', userId: '1' },
    { id: 'notif4', title: 'Task Overdue', message: '"API Integration" task is past its due date.', type: 'warning', read: false, createdAt: '2026-03-03T10:00:00', userId: '1' },
    { id: 'notif5', title: 'Account Deactivated', message: 'Casey Brown account has been deactivated.', type: 'warning', read: true, createdAt: '2026-03-02T16:00:00', userId: '1' },
    { id: 'notif6', title: 'System Alert', message: 'Scheduled maintenance in 30 minutes.', type: 'error', read: false, createdAt: '2026-03-04T11:30:00', userId: '2' },
];

const initialState: NotificationState = {
    data: [],
    loading: false,
    error: null,
    pagination: { page: 0, pageSize: 10, total: 0 },
};

export const fetchNotifications = createAsyncThunk('notifications/fetchAll', async () => {
    await new Promise((r) => setTimeout(r, MOCK_DELAY));
    return mockNotifications;
});

export const markAsRead = createAsyncThunk(
    'notifications/markAsRead',
    async (notifId: string) => {
        await new Promise((r) => setTimeout(r, 200));
        return notifId;
    }
);

export const markAllAsRead = createAsyncThunk('notifications/markAllAsRead', async () => {
    await new Promise((r) => setTimeout(r, 300));
});

const notificationSlice = createSlice({
    name: 'notifications',
    initialState,
    reducers: {
        setPage(state, action) { state.pagination.page = action.payload; },
        setPageSize(state, action) { state.pagination.pageSize = action.payload; },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchNotifications.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchNotifications.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
                state.pagination.total = action.payload.length;
            })
            .addCase(fetchNotifications.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch notifications';
            })
            .addCase(markAsRead.fulfilled, (state, action) => {
                const notif = state.data.find((n) => n.id === action.payload);
                if (notif) notif.read = true;
            })
            .addCase(markAllAsRead.fulfilled, (state) => {
                state.data.forEach((n) => { n.read = true; });
            });
    },
});

export const { setPage, setPageSize } = notificationSlice.actions;
export default notificationSlice.reducer;
