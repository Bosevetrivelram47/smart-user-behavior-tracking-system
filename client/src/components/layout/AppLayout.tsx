import React from 'react';
import { Box, useTheme } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopNavbar from './TopNavbar';
import { SIDEBAR_WIDTH, SIDEBAR_COLLAPSED_WIDTH, NAVBAR_HEIGHT } from '../../utils/constants';

export default function AppLayout() {
    const [collapsed, setCollapsed] = React.useState(false);
    const theme = useTheme();
    const sidebarW = collapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_WIDTH;

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
            <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((p) => !p)} />
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    ml: `${sidebarW}px`,
                    transition: theme.transitions.create('margin', {
                        easing: theme.transitions.easing.sharp,
                        duration: theme.transitions.duration.enteringScreen,
                    }),
                    display: 'flex',
                    flexDirection: 'column',
                    minHeight: '100vh',
                }}
            >
                <TopNavbar sidebarWidth={sidebarW} />
                <Box
                    sx={{
                        flexGrow: 1,
                        mt: `${NAVBAR_HEIGHT}px`,
                        p: { xs: 2, md: 3 },
                        maxWidth: '100%',
                        overflow: 'auto',
                    }}
                >
                    <Outlet />
                </Box>
            </Box>
        </Box>
    );
}
