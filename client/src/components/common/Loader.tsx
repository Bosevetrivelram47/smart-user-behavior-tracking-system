import { Box, CircularProgress, Typography } from '@mui/material';

interface LoaderProps {
    message?: string;
    fullPage?: boolean;
}

export default function Loader({ message, fullPage }: LoaderProps) {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 2,
                ...(fullPage && { minHeight: '60vh' }),
                py: fullPage ? 0 : 6,
            }}
        >
            <CircularProgress size={40} thickness={4} />
            {message && (
                <Typography variant="body2" color="text.secondary">
                    {message}
                </Typography>
            )}
        </Box>
    );
}
