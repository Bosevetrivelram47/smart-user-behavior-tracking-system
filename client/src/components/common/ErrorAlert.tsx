import React from 'react';
import { Alert, AlertTitle, Collapse, IconButton } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

interface ErrorAlertProps {
    message?: string | null;
    title?: string;
    onClose?: () => void;
}

export default function ErrorAlert({ message, title = 'Error', onClose }: ErrorAlertProps) {
    if (!message) return null;
    return (
        <Collapse in={Boolean(message)}>
            <Alert
                severity="error"
                sx={{ borderRadius: 2, mb: 2 }}
                action={
                    onClose ? (
                        <IconButton size="small" color="inherit" onClick={onClose}>
                            <CloseIcon fontSize="inherit" />
                        </IconButton>
                    ) : undefined
                }
            >
                <AlertTitle>{title}</AlertTitle>
                {message}
            </Alert>
        </Collapse>
    );
}
