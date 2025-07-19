import React, {useState} from 'react';
import Paper from '@mui/material/Paper';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Background from './BackGround';

const AuthForm: React.FC = () => {
    const [tab, setTab] = useState(0);

    const handleChange = (_: React.SyntheticEvent, newValue: number) => {
        setTab(newValue);
    };

    return (
        <Background>
            <Paper elevation={6} sx={{p: 6, minWidth: 400}}>
                <Tabs value={tab} onChange={handleChange} centered>
                    <Tab label="Login"/>
                    <Tab label="Register"/>
                </Tabs>
                <Box sx={{mt: 2}}>
                    {tab === 0 ? <Login/> : <Register/>}
                </Box>
            </Paper>
        </Background>
    );
};

export default AuthForm;