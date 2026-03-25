import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

export interface AppUser {
    id: number;
    name: string;
    email: string;
    role: 'ADMIN' | 'USER';
    active: boolean;
}

interface UserState {
    data: AppUser[];
    loading: boolean;
    error: string | null;
    pagination: { page: number; pageSize: number; total: number };
}

const initialState: UserState = {
    data: [],
    loading: false,
    error: null,
    pagination: { page: 0, pageSize: 10, total: 0 },
};

export const fetchUsers = createAsyncThunk(
    'users/fetchAll',
    async (_, { rejectWithValue }) => {
        try {

            const response = await api.get('/users');

            return response.data.map((u: any) => ({
                id: u.userId,
                name: u.name,
                email: u.email,
                role: u.role,
                active: u.active
            }));

        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch users');
        }
    }
);

export const toggleUserActive = createAsyncThunk(
    'users/toggleActive',
    async ({ id, active }: { id: number; active: boolean }, { rejectWithValue }) => {
        try {

            const url = active
                ? `/users/${id}/deactivate`
                : `/users/${id}/activate`;

            const response = await api.put(url);

            return {
                id: response.data.userId,
                active: response.data.active
            };

        } catch (error: any) {
            return rejectWithValue('Failed to update user status');
        }
    }
);

export const createUser = createAsyncThunk(
    'users/create',
    async (
        user: { name: string; email: string; password: string; role: string },
        { rejectWithValue }
    ) => {
        try {

            const response = await api.post('/users', user);

            const u = response.data;

            return {
                id: u.userId,
                name: u.name,
                email: u.email,
                role: u.role,
                active: u.active
            };

        } catch (error: any) {
            return rejectWithValue('Failed to create user');
        }
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
                const user = state.data.find((u) => u.id === action.payload.id);
                if (user) {
                    user.active = action.payload.active;
                }
            })
            .addCase(createUser.fulfilled, (state, action) => {
                state.data.unshift(action.payload);
                state.pagination.total += 1;
            });
    },
});

export const { setPage, setPageSize } = userSlice.actions;
export default userSlice.reducer;
