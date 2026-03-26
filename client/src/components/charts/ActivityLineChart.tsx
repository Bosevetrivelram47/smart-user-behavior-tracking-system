import {
    XAxis, YAxis, CartesianGrid, Tooltip,
    Legend, ResponsiveContainer, Area, AreaChart,
} from 'recharts';
import { useTheme } from '@mui/material';

const activityData = [
    { day: 'Mon', visits: 12, timeSpent: 45 },
    { day: 'Tue', visits: 19, timeSpent: 78 },
    { day: 'Wed', visits: 14, timeSpent: 52 },
    { day: 'Thu', visits: 22, timeSpent: 91 },
    { day: 'Fri', visits: 18, timeSpent: 68 },
    { day: 'Sat', visits: 8, timeSpent: 30 },
    { day: 'Sun', visits: 10, timeSpent: 38 },
];

export default function ActivityLineChart() {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    const gridColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)';
    const textColor = theme.palette.text.secondary;

    return (
        <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={activityData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <defs>
                    <linearGradient id="visitsGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="timeGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="day" tick={{ fill: textColor as string, fontSize: 12 }} axisLine={false} tickLine={false} />
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
                <Area type="monotone" dataKey="visits" name="Page Visits" stroke="#4f46e5" strokeWidth={2.5} fill="url(#visitsGradient)" dot={{ fill: '#4f46e5', r: 4 }} />
                <Area type="monotone" dataKey="timeSpent" name="Avg. Time (min)" stroke="#10b981" strokeWidth={2.5} fill="url(#timeGradient)" dot={{ fill: '#10b981', r: 4 }} />
            </AreaChart>
        </ResponsiveContainer>
    );
}
