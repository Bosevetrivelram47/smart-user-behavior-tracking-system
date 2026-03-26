import { Button, CircularProgress, type ButtonProps } from '@mui/material';

interface CustomButtonProps extends ButtonProps {
    loading?: boolean;
}

export default function CustomButton({ loading, children, disabled, startIcon, ...props }: CustomButtonProps) {
    return (
        <Button
            {...props}
            disabled={loading || disabled}
            startIcon={loading ? undefined : startIcon}
        >
            {loading ? <CircularProgress size={18} color="inherit" sx={{ mr: 1 }} /> : null}
            {children}
        </Button>
    );
}
