import axios from 'axios';

export interface LoginData {
    email: string;
    password: string;
}

export interface RegisterData {
    firstName: string;
    email: string;
    password: string;
}

const API_LOGIN_URL = process.env.REACT_APP_API_USER_LOGIN_URL as string;
const API_REGISTER_URL = process.env.REACT_APP_API_USER_REGISTER_URL as string;


export async function login(data: LoginData): Promise<any> {
    try {
        console.log(API_LOGIN_URL);
        const response = await axios.post(API_LOGIN_URL, data, {
            headers: { 'Content-Type': 'application/json' },
        });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Login failed');
    }
}

export async function register(data: RegisterData): Promise<any> {
    try {
        const response = await axios.post(API_REGISTER_URL, data, {
            headers: { 'Content-Type': 'application/json' },
        });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Registration failed');
    }
}