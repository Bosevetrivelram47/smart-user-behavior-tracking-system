import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { STORAGE_KEYS, MOCK_DELAY } from '../../utils/constants';

export interface AuthUser {
    id: string;
    name: string;
    email: string;
    role: 'ADMIN' | 'USER';
    avatar?: string;
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
    async (credentials: { email: string; password: string }, { rejectWithValue }) => {
        try {
            await new Promise((r) => setTimeout(r, MOCK_DELAY));
            // Mock authentication – in production replace with api.post('/auth/login', credentials)
            if (credentials.email === 'admin@demo.com' && credentials.password === 'admin123') {
                const payload = {
                    token: 'mock-jwt-token-admin-xyz',
                    user: { id: '1', name: 'Alex Admin', email: credentials.email, role: 'ADMIN' as const, avatar: '' },
                };
                localStorage.setItem(STORAGE_KEYS.TOKEN, payload.token);
                localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(payload.user));
                return payload;
            } else if (credentials.email === 'user@demo.com' && credentials.password === 'user123') {
                const payload = {
                    token: 'mock-jwt-token-user-abc',
                    user: { id: '2', name: 'Sam User', email: credentials.email, role: 'USER' as const, avatar: '' },
                };
                localStorage.setItem(STORAGE_KEYS.TOKEN, payload.token);
                localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(payload.user));
                return payload;
            } else {
                return rejectWithValue('Invalid email or password.');
            }
        } catch {
            return rejectWithValue('Network error. Please try again.');
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
