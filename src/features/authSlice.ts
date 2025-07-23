import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {login, register} from '../services/authService';

export const registerUser = createAsyncThunk(
    'auth/registerUser',
    async (values: { firstName: string; lastName:string , email: string; password: string }, {rejectWithValue}) => {
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
        registrationSuccess: false,
    },
    reducers: {
        logout(state) {
            state.user = null;
            state.token = null;
            state.error = '';
            state.registrationSuccess = false;
        },
        resetRegistrationSuccess(state) {
            state.registrationSuccess = false;
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
                state.registrationSuccess = false;

            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.error = '';
                state.registrationSuccess = true;

            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
                state.registrationSuccess = false;

            })
    },
});

export const {logout , resetRegistrationSuccess} = authSlice.actions;
export default authSlice.reducer;