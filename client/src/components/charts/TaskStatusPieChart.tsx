import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useTheme } from '@mui/material';

interface Props {
    pending: number;
    inProgress: number;
    completed: number;
}

export default function TaskStatusPieChart({ pending, inProgress, completed }: Props) {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    const data = [
        { name: 'Pending', value: pending, color: isDark ? '#fde68a' : '#f59e0b' },
        { name: 'In Progress', value: inProgress, color: isDark ? '#93c5fd' : '#3b82f6' },
        { name: 'Completed', value: completed, color: isDark ? '#6ee7b7' : '#10b981' },
    ].filter((d) => d.value > 0);

    if (data.length === 0) {
        return <div style={{ textAlign: 'center', color: theme.palette.text.secondary, paddingTop: 40 }}>No task data</div>;
    }

    return (
        <ResponsiveContainer width="100%" height={220}>
            <PieChart>
                <Pie data={data} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
                    {data.map((entry, i) => (
                        <Cell key={i} fill={entry.color} stroke="none" />
                    ))}
                </Pie>
                <Tooltip
                    contentStyle={{
                        borderRadius: 8,
                        border: 'none',
                        background: isDark ? '#1e293b' : '#fff',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                        color: theme.palette.text.primary,
                    }}
                />
                <Legend iconType="circle" iconSize={10} />
            </PieChart>
        </ResponsiveContainer>
    );
}
