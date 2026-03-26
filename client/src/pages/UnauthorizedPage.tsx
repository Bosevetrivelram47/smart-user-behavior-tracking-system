import { Box, Typography, Button } from '@mui/material';
import { LockOutlined as LockIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../utils/constants';

export default function UnauthorizedPage() {
    const navigate = useNavigate();
    return (
        <Box
            sx={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                justifyContent: 'center', minHeight: '100vh', textAlign: 'center',
                p: 4, bgcolor: 'background.default',
            }}
        >
            <Box
                sx={{
                    width: 80, height: 80, borderRadius: '50%',
                    bgcolor: 'rgba(239,68,68,0.1)', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', mb: 3,
                }}
            >
                <LockIcon sx={{ fontSize: 40, color: 'error.main' }} />
            </Box>
            <Typography variant="h2" fontWeight={900} sx={{ mb: 1, color: 'error.main' }}>403</Typography>
            <Typography variant="h5" fontWeight={700} sx={{ mb: 1 }}>Access Denied</Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 400 }}>
                You don't have permission to view this page. Please contact your administrator if you think this is a mistake.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
                <Button variant="outlined" onClick={() => navigate(-1)}>Go Back</Button>
                <Button variant="contained" onClick={() => navigate(ROUTES.DASHBOARD)}>Go to Dashboard</Button>
            </Box>
        </Box>
    );
}
