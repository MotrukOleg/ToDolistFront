import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {login, register} from '../services/authService';

export const registerUser = createAsyncThunk(
    'auth/registerUser',
    async (values: { FirstName: string; LastName:string , email: string; password: string }, {rejectWithValue}) => {
        try {
            const data = await register(values);
            return data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Registration failed');
        }
    }
);

export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async (values: { email: string; password: string }, {rejectWithValue}) => {
        try {
            const data = await login(values);
            return data;
        } catch (err: any) {
            return rejectWithValue(err.response?.status === 401 ? 'Invalid email or password' : 'Login failed');
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        token: null,
        loading: false,
        error: '',
    },
    reducers: {
        logout(state) {
            state.user = null;
            state.token = null;
            state.error = '';
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = '';
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.error = '';
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = '';
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.error = '';
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
    },
});

export const {logout} = authSlice.actions;
export default authSlice.reducer;