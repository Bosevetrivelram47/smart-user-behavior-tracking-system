import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
    Legend, ResponsiveContainer
} from 'recharts';
import { useTheme } from '@mui/material';
import type { AppUser } from '../../features/users/userSlice';
import type { Task } from '../../features/tasks/taskSlice';

interface Props {
    users: AppUser[];
    tasks: Task[];
}

export default function UserActivityBarChart({ users, tasks }: Props) {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    const data = users.slice(0, 6).map((u) => ({
        name: u.name.split(' ')[0],
        completed: tasks.filter((t) => t.assignedToUserId === u.id && t.status === 'COMPLETED').length,
        inProgress: tasks.filter((t) => t.assignedToUserId === u.id && t.status === 'IN_PROGRESS').length,
        pending: tasks.filter((t) => t.assignedToUserId === u.id && t.status === 'PENDING').length,
    }));

    const gridColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)';
    const textColor = theme.palette.text.secondary;

    return (
        <ResponsiveContainer width="100%" height={280}>
            <BarChart data={data} margin={{ top: 5, right: 30, left: 5, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="name" tick={{ fill: textColor as string, fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: textColor as string, fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip
                    contentStyle={{
                        borderRadius: 8, border: 'none',
                        background: isDark ? '#1e293b' : '#fff',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                        color: theme.palette.text.primary,
                    }}
                />
                <Legend iconType="circle" iconSize={10} />
                <Bar dataKey="completed" name="Completed" fill={isDark ? '#6ee7b7' : '#10b981'} radius={[4, 4, 0, 0]} />
                <Bar dataKey="inProgress" name="In Progress" fill={isDark ? '#93c5fd' : '#3b82f6'} radius={[4, 4, 0, 0]} />
                <Bar dataKey="pending" name="Pending" fill={isDark ? '#fde68a' : '#f59e0b'} radius={[4, 4, 0, 0]} />
            </BarChart>
        </ResponsiveContainer>
    );
}
