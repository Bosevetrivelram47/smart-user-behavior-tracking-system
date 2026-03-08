import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Inbox as InboxIcon } from '@mui/icons-material';

interface EmptyStateProps {
    title?: string;
    description?: string;
    actionLabel?: string;
    onAction?: () => void;
    icon?: React.ReactNode;
}

export default function EmptyState({
    title = 'No data found',
    description = 'There are no items to display here yet.',
    actionLabel,
    onAction,
    icon,
}: EmptyStateProps) {
    return (
        <Box
            sx={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                justifyContent: 'center', py: 8, px: 2, textAlign: 'center',
            }}
        >
            <Box sx={{ color: 'text.disabled', mb: 2, fontSize: 64 }}>
                {icon || <InboxIcon sx={{ fontSize: 64 }} />}
            </Box>
            <Typography variant="h6" fontWeight={600} gutterBottom>
                {title}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: actionLabel ? 3 : 0 }}>
                {description}
            </Typography>
            {actionLabel && onAction && (
                <Button variant="contained" onClick={onAction}>
                    {actionLabel}
                </Button>
            )}
        </Box>
    );
}
