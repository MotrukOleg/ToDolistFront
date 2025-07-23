import {useDispatch} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import {logout} from '../features/authSlice';
import { Button } from '@mui/material';
import React from 'react';

const LogoutButton = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logout());
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <Button
            variant="contained"
            color="secondary"
            onClick={handleLogout}
            sx={{
                borderRadius: 2,
                boxShadow: 2,
                textTransform: 'none',
                fontWeight: 600,
                px: 3,
                py: 1,
                fontSize: 16,
            }}
        >
            Logout
        </Button>
    );
};

export default LogoutButton;