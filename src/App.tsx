import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import AuthForm from './components/AuthForm';
import ToDoList from "./pages/ToDoList";
import { setupTelemetry } from './otel';



const App: React.FC = () => {
    const router = createBrowserRouter([
        { path: '/login', element: <AuthForm /> },
        { path: '/register', element: <AuthForm /> },
        { path: '/todolist', element: <ToDoList /> },
        { path: '*', element: <AuthForm /> },
    ]);

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <RouterProvider router={router} />
        </LocalizationProvider>
    );
};

export default App;