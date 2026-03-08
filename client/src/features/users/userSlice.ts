import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { MOCK_DELAY } from '../../utils/constants';

export interface AppUser {
    id: string;
    name: string;
    email: string;
    role: 'ADMIN' | 'USER';
    active: boolean;
    createdAt: string;
    tasksCount: number;
}

interface UserState {
    data: AppUser[];
    loading: boolean;
    error: string | null;
    pagination: { page: number; pageSize: number; total: number };
}

const mockUsers: AppUser[] = [
    { id: '1', name: 'Alex Admin', email: 'admin@demo.com', role: 'ADMIN', active: true, createdAt: '2025-01-10', tasksCount: 12 },
    { id: '2', name: 'Sam User', email: 'user@demo.com', role: 'USER', active: true, createdAt: '2025-02-15', tasksCount: 8 },
    { id: '3', name: 'Jordan Lee', email: 'jordan@demo.com', role: 'USER', active: true, createdAt: '2025-03-01', tasksCount: 5 },
    { id: '4', name: 'Casey Brown', email: 'casey@demo.com', role: 'USER', active: false, createdAt: '2025-01-22', tasksCount: 3 },
    { id: '5', name: 'Riley Smith', email: 'riley@demo.com', role: 'USER', active: true, createdAt: '2025-04-05', tasksCount: 7 },
    { id: '6', name: 'Morgan Davis', email: 'morgan@demo.com', role: 'ADMIN', active: true, createdAt: '2024-12-12', tasksCount: 15 },
];

const initialState: UserState = {
    data: [],
    loading: false,
    error: null,
    pagination: { page: 0, pageSize: 10, total: 0 },
};

export const fetchUsers = createAsyncThunk('users/fetchAll', async () => {
    await new Promise((r) => setTimeout(r, MOCK_DELAY));
    return mockUsers;
});

export const toggleUserActive = createAsyncThunk(
    'users/toggleActive',
    async (userId: string) => {
        await new Promise((r) => setTimeout(r, 300));
        return userId;
    }
);

export const createUser = createAsyncThunk(
    'users/create',
    async (user: Omit<AppUser, 'id' | 'createdAt' | 'tasksCount'>) => {
        await new Promise((r) => setTimeout(r, MOCK_DELAY));
        return {
            ...user,
            id: String(Date.now()),
            createdAt: new Date().toISOString().split('T')[0],
            tasksCount: 0,
        };
    }
);

const userSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        setPage(state, action) { state.pagination.page = action.payload; },
        setPageSize(state, action) { state.pagination.pageSize = action.payload; },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUsers.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
                state.pagination.total = action.payload.length;
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch users';
            })
            .addCase(toggleUserActive.fulfilled, (state, action) => {
                const user = state.data.find((u) => u.id === action.payload);
                if (user) user.active = !user.active;
            })
            .addCase(createUser.fulfilled, (state, action) => {
                state.data.unshift(action.payload);
                state.pagination.total += 1;
            });
    },
});

export const { setPage, setPageSize } = userSlice.actions;
export default userSlice.reducer;
