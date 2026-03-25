import React from 'react';
import {
    Box, Drawer, List, ListItemButton, ListItemIcon, ListItemText,
    Typography, Tooltip, Divider, IconButton, useTheme, Avatar,
} from '@mui/material';
import {
    Dashboard as DashboardIcon,
    People as PeopleIcon,
    Assignment as TaskIcon,
    AssignmentTurnedIn as AssignIcon,
    CheckCircle as ResolveIcon,
    Navigation as NavIcon,
    Notifications as NotifIcon,
    ChevronLeft as CollapseIcon,
    ChevronRight as ExpandIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../../app/hooks';
import { ROUTES, SIDEBAR_WIDTH, SIDEBAR_COLLAPSED_WIDTH, APP_NAME } from '../../utils/constants';

interface SidebarProps {
    collapsed: boolean;
    onToggle: () => void;
}

interface NavItem {
    label: string;
    path: string;
    icon: React.ReactNode;
    roles: string[];
}

const navItems: NavItem[] = [
    { label: 'Dashboard', path: ROUTES.DASHBOARD, icon: <DashboardIcon />, roles: ['ADMIN', 'USER'] },
    { label: 'Users', path: ROUTES.USERS, icon: <PeopleIcon />, roles: ['ADMIN'] },
    { label: 'Tasks', path: ROUTES.TASKS, icon: <TaskIcon />, roles: ['ADMIN', 'USER'] },
    { label: 'Assignments', path: ROUTES.ASSIGNMENTS, icon: <AssignIcon />, roles: ['ADMIN'] },
    { label: 'Resolutions', path: ROUTES.RESOLUTIONS, icon: <ResolveIcon />, roles: ['ADMIN', 'USER'] },
    { label: 'Navigation Logs', path: ROUTES.NAVIGATION_LOGS, icon: <NavIcon />, roles: ['ADMIN'] },
    { label: 'Notifications', path: ROUTES.NOTIFICATIONS, icon: <NotifIcon />, roles: ['ADMIN', 'USER'] },
];

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
    const theme = useTheme();
    const navigate = useNavigate();
    const location = useLocation();
    const user = useAppSelector((s) => s.auth.user);
    const unreadCount = useAppSelector((s) => s.notifications.data.filter((n) => !n.read).length);
    const isDark = theme.palette.mode === 'dark';

    const filteredItems = navItems.filter((item) =>
        user ? item.roles.includes(user.role) : false
    );

    const sidebarBg = isDark
        ? 'linear-gradient(180deg, #1e1b4b 0%, #0f172a 100%)'
        : 'linear-gradient(180deg, #4338ca 0%, #1e1b4b 100%)';

    return (
        <Drawer
            variant="permanent"
            sx={{
                width: collapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_WIDTH,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: collapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_WIDTH,
                    boxSizing: 'border-box',
                    background: sidebarBg,
                    border: 'none',
                    overflowX: 'hidden',
                    transition: theme.transitions.create('width', {
                        easing: theme.transitions.easing.sharp,
                        duration: theme.transitions.duration.enteringScreen,
                    }),
                },
            }}
        >
            {/* Logo area */}
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: collapsed ? 'center' : 'space-between',
                    px: collapsed ? 1 : 2.5,
                    py: 2,
                    minHeight: 64,
                    borderBottom: '1px solid rgba(255,255,255,0.1)',
                }}
            >
                {!collapsed && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box
                            sx={{
                                width: 36, height: 36, borderRadius: 2,
                                background: 'linear-gradient(135deg, #818cf8, #c084fc)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '18px', fontWeight: 700, color: '#fff', flexShrink: 0,
                            }}
                        >
                            T
                        </Box>
                        <Typography
                            variant="h6"
                            sx={{ color: '#fff', fontWeight: 700, fontSize: '1.1rem', letterSpacing: '-0.02em' }}
                        >
                            {APP_NAME}
                        </Typography>
                    </Box>
                )}
                <IconButton onClick={onToggle} sx={{ color: 'rgba(255,255,255,0.7)', '&:hover': { color: '#fff' } }}>
                    {collapsed ? <ExpandIcon /> : <CollapseIcon />}
                </IconButton>
            </Box>

            {/* User Avatar */}
            {!collapsed && user && (
                <Box sx={{ px: 2.5, py: 2, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar
                            sx={{
                                width: 38, height: 38, bgcolor: 'rgba(255,255,255,0.2)',
                                fontSize: '0.9rem', fontWeight: 700, color: '#fff',
                            }}
                        >
                            {user?.name?.charAt(0) || 'U'}
                        </Avatar>
                        <Box>
                            <Typography sx={{ color: '#fff', fontSize: '0.85rem', fontWeight: 600, lineHeight: 1.2 }}>
                                {user.name}
                            </Typography>
                            <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.7rem' }}>
                                {user.role}
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            )}

            {/* Nav Items */}
            <List sx={{ px: collapsed ? 0.5 : 1.5, py: 1.5, flexGrow: 1 }}>
                {filteredItems.map((item) => {
                    const isActive = location.pathname === item.path ||
                        (item.path !== ROUTES.DASHBOARD && location.pathname.startsWith(item.path));
                    const isNotif = item.path === ROUTES.NOTIFICATIONS && unreadCount > 0;

                    const btn = (
                        <ListItemButton
                            key={item.path}
                            onClick={() => navigate(item.path)}
                            sx={{
                                borderRadius: 2,
                                mb: 0.5,
                                minHeight: 44,
                                px: collapsed ? 1 : 1.5,
                                justifyContent: collapsed ? 'center' : 'flex-start',
                                bgcolor: isActive ? 'rgba(255,255,255,0.15)' : 'transparent',
                                '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' },
                                transition: 'background 0.2s',
                            }}
                        >
                            <ListItemIcon
                                sx={{
                                    minWidth: 0,
                                    mr: collapsed ? 0 : 1.5,
                                    color: isActive ? '#fff' : 'rgba(255,255,255,0.6)',
                                    position: 'relative',
                                }}
                            >
                                {item.icon}
                                {isNotif && (
                                    <Box
                                        sx={{
                                            position: 'absolute', top: -4, right: -4,
                                            width: 8, height: 8, borderRadius: '50%', bgcolor: '#ef4444',
                                        }}
                                    />
                                )}
                            </ListItemIcon>
                            {!collapsed && (
                                <ListItemText
                                    primary={item.label}
                                    primaryTypographyProps={{
                                        fontSize: '0.875rem',
                                        fontWeight: isActive ? 600 : 400,
                                        color: isActive ? '#fff' : 'rgba(255,255,255,0.7)',
                                        noWrap: true,
                                    }}
                                />
                            )}
                            {!collapsed && isNotif && (
                                <Box
                                    sx={{
                                        bgcolor: '#ef4444', color: '#fff', borderRadius: '12px',
                                        px: 0.75, py: 0.1, fontSize: '0.65rem', fontWeight: 700, minWidth: 20, textAlign: 'center',
                                    }}
                                >
                                    {unreadCount}
                                </Box>
                            )}
                        </ListItemButton>
                    );

                    return collapsed ? (
                        <Tooltip key={item.path} title={item.label} placement="right" arrow>
                            {btn}
                        </Tooltip>
                    ) : btn;
                })}
            </List>

            <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)' }} />
            <Box sx={{ px: 2, py: 1.5 }}>
                <Typography sx={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: 1 }}>
                    {collapsed ? 'v1' : 'TrackSmart v1.0'}
                </Typography>
            </Box>
        </Drawer>
    );
}
