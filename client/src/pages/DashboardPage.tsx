import React from 'react';
import {
    Grid, Card, CardContent, Typography, Box, useTheme, Divider,
} from '@mui/material';
import {
    People as PeopleIcon,
    Assignment as TaskIcon,
    PendingActions as PendingIcon,
    CheckCircle as CompletedIcon,
    NotificationsActive as NotifIcon,
    PersonOutline as ActiveIcon,
} from '@mui/icons-material';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import { fetchUsers } from '../features/users/userSlice';
import { fetchTasks } from '../features/tasks/taskSlice';
import { fetchNotifications } from '../features/notifications/notificationSlice';
import TaskStatusPieChart from '../components/charts/TaskStatusPieChart';
import UserActivityBarChart from '../components/charts/UserActivityBarChart';
import ActivityLineChart from '../components/charts/ActivityLineChart';
import Loader from '../components/common/Loader';

interface StatCardProps {
    title: string;
    value: number | string;
    icon: React.ReactNode;
    color: string;
    subtitle?: string;
    gradient: string;
}

function StatCard({ title, value, icon, color, subtitle, gradient }: StatCardProps) {
    const theme = useTheme();
    return (
        <Card
            sx={{
                height: '100%',
                position: 'relative',
                overflow: 'hidden',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 8px 25px rgba(0,0,0,0.12)' },
            }}
        >
            <Box
                sx={{
                    position: 'absolute', top: -20, right: -20,
                    width: 100, height: 100, borderRadius: '50%',
                    background: gradient, opacity: 0.15,
                }}
            />
            <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box>
                        <Typography variant="body2" color="text.secondary" fontWeight={500} sx={{ mb: 0.5 }}>
                            {title}
                        </Typography>
                        <Typography variant="h4" fontWeight={800} sx={{ lineHeight: 1, mb: 0.5 }}>
                            {value}
                        </Typography>
                        {subtitle && (
                            <Typography variant="caption" color="text.secondary">
                                {subtitle}
                            </Typography>
                        )}
                    </Box>
                    <Box
                        sx={{
                            width: 48, height: 48, borderRadius: 2,
                            background: gradient, display: 'flex',
                            alignItems: 'center', justifyContent: 'center',
                            color: '#fff', flexShrink: 0,
                        }}
                    >
                        {icon}
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
}

export default function DashboardPage() {
    const dispatch = useAppDispatch();
    const users = useAppSelector((s) => s.users.data);
    const tasks = useAppSelector((s) => s.tasks.data);
    const notifications = useAppSelector((s) => s.notifications.data);
    const usersLoading = useAppSelector((s) => s.users.loading);
    const tasksLoading = useAppSelector((s) => s.tasks.loading);
    const user = useAppSelector((s) => s.auth.user);

    React.useEffect(() => {
        dispatch(fetchUsers());
        dispatch(fetchTasks());
        dispatch(fetchNotifications());
    }, [dispatch]);

    const activeUsers = users.filter((u) => u.active).length;
    const pendingTasks = tasks.filter((t) => t.status === 'PENDING').length;
    const inProgressTasks = tasks.filter((t) => t.status === 'IN_PROGRESS').length;
    const completedTasks = tasks.filter((t) => t.status === 'COMPLETED').length;
    const unreadNotifs = notifications.filter((n) => !n.read).length;

    const isLoading = usersLoading || tasksLoading;

    const stats = [
        { title: 'Total Users', value: users.length, icon: <PeopleIcon />, color: '#4f46e5', gradient: 'linear-gradient(135deg, #4f46e5, #7c3aed)', subtitle: `${activeUsers} active` },
        { title: 'Active Users', value: activeUsers, icon: <ActiveIcon />, color: '#06b6d4', gradient: 'linear-gradient(135deg, #06b6d4, #0ea5e9)', subtitle: `${users.length - activeUsers} inactive` },
        { title: 'Total Tasks', value: tasks.length, icon: <TaskIcon />, color: '#f59e0b', gradient: 'linear-gradient(135deg, #f59e0b, #f97316)', subtitle: `${inProgressTasks} in progress` },
        { title: 'Pending Tasks', value: pendingTasks, icon: <PendingIcon />, color: '#ef4444', gradient: 'linear-gradient(135deg, #ef4444, #f87171)', subtitle: 'awaiting action' },
        { title: 'Completed Tasks', value: completedTasks, icon: <CompletedIcon />, color: '#10b981', gradient: 'linear-gradient(135deg, #10b981, #34d399)', subtitle: 'tasks done' },
        { title: 'Unread Notifications', value: unreadNotifs, icon: <NotifIcon />, color: '#8b5cf6', gradient: 'linear-gradient(135deg, #8b5cf6, #a78bfa)', subtitle: 'need attention' },
    ];

    if (isLoading) return <Loader message="Loading dashboard..." fullPage />;

    return (
        <Box>
            {/* Header */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" fontWeight={800} gutterBottom>
                    Welcome back, {user?.name?.split(' ')[0]}! 👋
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Here's what's happening in your workspace today.
                </Typography>
            </Box>

            {/* Stat Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                {stats.map((stat) => (
                    <Grid item xs={12} sm={6} md={4} lg={2} key={stat.title}>
                        <StatCard {...stat} />
                    </Grid>
                ))}
            </Grid>

            {/* Charts Row */}
            <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                    <Card sx={{ height: '100%' }}>
                        <CardContent sx={{ p: 3 }}>
                            <Typography variant="h6" fontWeight={700} gutterBottom>
                                User Activity (Last 7 Days)
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                Page visits and time spent by user
                            </Typography>
                            <ActivityLineChart />
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Card sx={{ height: '100%' }}>
                        <CardContent sx={{ p: 3 }}>
                            <Typography variant="h6" fontWeight={700} gutterBottom>
                                Task Status Distribution
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                Current task breakdown
                            </Typography>
                            <TaskStatusPieChart
                                pending={pendingTasks}
                                inProgress={inProgressTasks}
                                completed={completedTasks}
                            />
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12}>
                    <Card>
                        <CardContent sx={{ p: 3 }}>
                            <Typography variant="h6" fontWeight={700} gutterBottom>
                                Tasks Completed per User
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                Individual performance overview
                            </Typography>
                            <UserActivityBarChart users={users} tasks={tasks} />
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}
