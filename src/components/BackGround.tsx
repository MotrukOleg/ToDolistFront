import React from 'react';
import Box from '@mui/material/Box';

const BackGround: React.FC<{ children: React.ReactNode }> = ({children}) => (
    <Box
        sx={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        }}
    >
        {children}
    </Box>
);

export default BackGround;