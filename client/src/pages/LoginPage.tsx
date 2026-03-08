import React from 'react';
import {
    Box, Card, CardContent, Typography, InputAdornment,
    IconButton, Divider, useTheme, Alert,
} from '@mui/material';
import { Email as EmailIcon, Lock as LockIcon, Visibility, VisibilityOff } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { loginThunk, clearError } from '../features/auth/authSlice';
import CustomTextField from '../components/common/CustomTextField';
import CustomButton from '../components/common/CustomButton';
import { ROUTES, APP_NAME } from '../utils/constants';

const schema = yup.object({
    email: yup.string().email('Enter a valid email').required('Email is required'),
    password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

type FormData = yup.InferType<typeof schema>;

export default function LoginPage() {
    const theme = useTheme();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { loading, error, token } = useAppSelector((s) => s.auth);
    const [showPassword, setShowPassword] = React.useState(false);
    const isDark = theme.palette.mode === 'dark';

    const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: yupResolver(schema),
    });

    React.useEffect(() => {
        if (token) navigate(ROUTES.DASHBOARD, { replace: true });
    }, [token, navigate]);

    const onSubmit = async (data: FormData) => {
        dispatch(clearError());
        const result = await dispatch(loginThunk(data));
        if (loginThunk.fulfilled.match(result)) {
            navigate(ROUTES.DASHBOARD, { replace: true });
        }
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: isDark
                    ? 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)'
                    : 'linear-gradient(135deg, #4338ca 0%, #7c3aed 50%, #0ea5e9 100%)',
                p: 2,
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            {/* Background blobs */}
            <Box sx={{
                position: 'absolute', top: -100, right: -100,
                width: 400, height: 400, borderRadius: '50%',
                background: 'rgba(255,255,255,0.05)', pointerEvents: 'none',
            }} />
            <Box sx={{
                position: 'absolute', bottom: -80, left: -80,
                width: 300, height: 300, borderRadius: '50%',
                background: 'rgba(255,255,255,0.05)', pointerEvents: 'none',
            }} />

            <Card
                sx={{
                    width: '100%', maxWidth: 440,
                    backdropFilter: 'blur(20px)',
                    bgcolor: isDark ? 'rgba(30,41,59,0.85)' : 'rgba(255,255,255,0.95)',
                    border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.6)'}`,
                    boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
                    zIndex: 1,
                }}
            >
                <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
                    {/* Logo */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
                        <Box
                            sx={{
                                width: 56, height: 56, borderRadius: 3,
                                background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: 28, fontWeight: 800, color: '#fff', mb: 2,
                                boxShadow: '0 8px 20px rgba(79,70,229,0.4)',
                            }}
                        >
                            T
                        </Box>
                        <Typography variant="h5" fontWeight={800} gutterBottom>
                            Welcome back
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Sign in to {APP_NAME} dashboard
                        </Typography>
                    </Box>

                    {error && (
                        <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }} onClose={() => dispatch(clearError())}>
                            {error}
                        </Alert>
                    )}

                    {/* Demo creds hint */}
                    <Alert severity="info" sx={{ mb: 3, borderRadius: 2, fontSize: '0.75rem' }}>
                        <strong>Admin:</strong> admin@demo.com / admin123 &nbsp;|&nbsp; <strong>User:</strong> user@demo.com / user123
                    </Alert>

                    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                            <CustomTextField
                                label="Email Address"
                                type="email"
                                placeholder="Enter your email"
                                register={register('email')}
                                error={errors.email?.message}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <EmailIcon fontSize="small" color="action" />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <CustomTextField
                                label="Password"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Enter your password"
                                register={register('password')}
                                error={errors.password?.message}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <LockIcon fontSize="small" color="action" />
                                        </InputAdornment>
                                    ),
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton size="small" onClick={() => setShowPassword((p) => !p)} edge="end">
                                                {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />

                            <CustomButton
                                type="submit"
                                variant="contained"
                                size="large"
                                loading={loading}
                                fullWidth
                                sx={{
                                    py: 1.5,
                                    background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                                    '&:hover': { background: 'linear-gradient(135deg, #4338ca, #6d28d9)' },
                                    boxShadow: '0 4px 15px rgba(79,70,229,0.4)',
                                    mt: 0.5,
                                }}
                            >
                                {loading ? 'Signing in...' : 'Sign In'}
                            </CustomButton>
                        </Box>
                    </Box>

                    <Divider sx={{ my: 3 }} />
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center' }}>
                        Smart User Behavior Tracking System © 2026
                    </Typography>
                </CardContent>
            </Card>
        </Box>
    );
}
