import React from 'react';
import {
    AppBar, Toolbar, IconButton, Typography, Badge, Avatar,
    Menu, MenuItem, ListItemIcon, Divider, Tooltip, Box, useTheme,
} from '@mui/material';
import {
    Notifications as NotifIcon,
    LightMode as LightIcon,
    DarkMode as DarkIcon,
    Logout as LogoutIcon,
    AccountCircle as ProfileIcon,
    Menu as MenuIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { logout } from '../../features/auth/authSlice';
import { useColorMode } from '../../theme/theme';
import { ROUTES, NAVBAR_HEIGHT } from '../../utils/constants';

interface TopNavbarProps {
    sidebarWidth: number;
}

export default function TopNavbar({ sidebarWidth }: TopNavbarProps) {
    const theme = useTheme();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { toggleColorMode } = useColorMode();
    const user = useAppSelector((s) => s.auth.user);
    const unreadCount = useAppSelector((s) => s.notifications.data.filter((n) => !n.read).length);
    const isDark = theme.palette.mode === 'dark';

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const profileOpen = Boolean(anchorEl);

    const handleLogout = () => {
        dispatch(logout());
        navigate(ROUTES.LOGIN);
        setAnchorEl(null);
    };

    const pageTitles: Record<string, string> = {
        '/dashboard': 'Dashboard',
        '/users': 'User Management',
        '/tasks': 'Task Management',
        '/assignments': 'Task Assignments',
        '/resolutions': 'Task Resolutions',
        '/navigation-logs': 'Navigation Tracking',
        '/notifications': 'Notifications',
    };
    const currentPath = window.location.pathname;
    const pageTitle = pageTitles[currentPath] || 'TrackSmart';

    return (
        <AppBar
            position="fixed"
            elevation={0}
            sx={{
                width: `calc(100% - ${sidebarWidth}px)`,
                ml: `${sidebarWidth}px`,
                transition: theme.transitions.create(['width', 'margin'], {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.enteringScreen,
                }),
                bgcolor: isDark ? 'rgba(15,23,42,0.92)' : 'rgba(255,255,255,0.92)',
                backdropFilter: 'blur(12px)',
                borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}`,
                height: NAVBAR_HEIGHT,
                color: 'text.primary',
            }}
        >
            <Toolbar sx={{ height: NAVBAR_HEIGHT, px: { xs: 2, md: 3 } }}>
                <Typography
                    variant="h6"
                    sx={{ flexGrow: 1, fontWeight: 700, fontSize: '1.1rem', color: 'text.primary' }}
                >
                    {pageTitle}
                </Typography>

                {/* Dark mode toggle */}
                <Tooltip title={isDark ? 'Switch to Light' : 'Switch to Dark'}>
                    <IconButton onClick={toggleColorMode} sx={{ mr: 0.5 }}>
                        {isDark ? <LightIcon sx={{ color: '#f59e0b' }} /> : <DarkIcon />}
                    </IconButton>
                </Tooltip>

                {/* Notification bell */}
                <Tooltip title="Notifications">
                    <IconButton onClick={() => navigate(ROUTES.NOTIFICATIONS)} sx={{ mr: 0.5 }}>
                        <Badge badgeContent={unreadCount} color="error" max={99}>
                            <NotifIcon />
                        </Badge>
                    </IconButton>
                </Tooltip>

                {/* Profile */}
                <Tooltip title="Account">
                    <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} sx={{ ml: 0.5 }}>
                        <Avatar
                            sx={{
                                width: 34, height: 34,
                                bgcolor: 'primary.main',
                                fontSize: '0.85rem', fontWeight: 700,
                            }}
                        >
                            {user?.name?.charAt(0) || 'U'}
                        </Avatar>
                    </IconButton>
                </Tooltip>

                <Menu
                    anchorEl={anchorEl}
                    open={profileOpen}
                    onClose={() => setAnchorEl(null)}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                    PaperProps={{
                        elevation: 4,
                        sx: { mt: 1, minWidth: 200, borderRadius: 2, overflow: 'visible' },
                    }}
                >
                    <Box sx={{ px: 2, py: 1.5 }}>
                        <Typography variant="subtitle2" fontWeight={700}>{user?.name}</Typography>
                        <Typography variant="caption" color="text.secondary">{user?.email}</Typography>
                    </Box>
                    <Divider />
                    <MenuItem onClick={() => setAnchorEl(null)} sx={{ gap: 1.5, py: 1.2 }}>
                        <ListItemIcon><ProfileIcon fontSize="small" /></ListItemIcon>
                        Profile
                    </MenuItem>
                    <MenuItem onClick={handleLogout} sx={{ gap: 1.5, py: 1.2, color: 'error.main' }}>
                        <ListItemIcon><LogoutIcon fontSize="small" color="error" /></ListItemIcon>
                        Logout
                    </MenuItem>
                </Menu>
            </Toolbar>
        </AppBar>
    );
}
