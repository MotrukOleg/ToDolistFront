import React, { useState, useCallback } from 'react';
import Paper from '@mui/material/Paper';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Background from './BackGround';
import { useDispatch } from 'react-redux';
import { resetRegistrationSuccess } from '../features/authSlice';

const AuthForm: React.FC = () => {
    const [tab, setTab] = useState(0);
    const [successMessage, setSuccessMessage] = useState('');
    const dispatch = useDispatch();

    const handleChange = (_: React.SyntheticEvent, newValue: number) => {
        setTab(newValue);
        if (newValue === 1) {
            dispatch(resetRegistrationSuccess());
            setSuccessMessage('');
        }
    };

    const handleRegistrationSuccess = useCallback(() => {
        setSuccessMessage('Registration successful! Please log in.');
        setTab(0);
    }, []);

    return (
        <Background>
            <Paper elevation={6} sx={{p: 6, minWidth: 400}}>
                {successMessage && (
                    <Alert severity="success" sx={{ mb: 2 }}>
                        {successMessage}
                    </Alert>
                )}
                <Tabs value={tab} onChange={handleChange} centered>
                    <Tab label="Login"/>
                    <Tab label="Register"/>
                </Tabs>
                <Box sx={{mt: 2}}>
                    {tab === 0 ? <Login/> : <Register onRegistrationSuccess={handleRegistrationSuccess} />}
                </Box>
            </Paper>
        </Background>
    );
};

export default AuthForm;