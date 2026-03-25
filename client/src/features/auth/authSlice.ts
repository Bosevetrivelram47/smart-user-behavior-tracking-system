import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';
import { STORAGE_KEYS } from '../../utils/constants';

export interface AuthUser {
    id: string;
    name: string;
    email: string;
    role: 'ADMIN' | 'USER';
}

interface AuthState {
    user: AuthUser | null;
    token: string | null;
    loading: boolean;
    error: string | null;
}

const storedUser = localStorage.getItem(STORAGE_KEYS.USER);
const storedToken = localStorage.getItem(STORAGE_KEYS.TOKEN);

const initialState: AuthState = {
    user: storedUser ? JSON.parse(storedUser) : null,
    token: storedToken || null,
    loading: false,
    error: null,
};

export const loginThunk = createAsyncThunk(
    'auth/login',
    async (
        credentials: { email: string; password: string },
        { rejectWithValue }
    ) => {
        try {

            const response = await api.post('/auth/login', credentials);

            const data = response.data;

            const payload = {
                token: data.token,
                user: {
                    id: data.userId,
                    name: data.name,
                    email: data.email,
                    role: data.role
                }
            };

            localStorage.setItem(STORAGE_KEYS.TOKEN, payload.token);
            localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(payload.user));

            return payload;

        } catch (error: any) {

            if (error.response?.data?.message) {
                return rejectWithValue(error.response.data.message);
            }

            return rejectWithValue('Login failed. Please try again.');
        }
    }
);
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout(state) {
            state.user = null;
            state.token = null;
            state.error = null;

            localStorage.removeItem(STORAGE_KEYS.TOKEN);
            localStorage.removeItem(STORAGE_KEYS.USER);
        },
        clearError(state) {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.token = action.payload.token;
                state.user = action.payload.user;
            })
            .addCase(loginThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { logout, clearError } = authSlice.actions;

export default authSlice.reducer;