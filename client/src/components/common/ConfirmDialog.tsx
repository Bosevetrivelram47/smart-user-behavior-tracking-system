import {
    Dialog, DialogTitle, DialogContent, DialogContentText,
    DialogActions, Button,
} from '@mui/material';
import CustomButton from './CustomButton';

interface ConfirmDialogProps {
    open: boolean;
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    loading?: boolean;
    onConfirm: () => void;
    onCancel: () => void;
    severity?: 'error' | 'warning' | 'info';
}

export default function ConfirmDialog({
    open, title, message, confirmLabel = 'Confirm', cancelLabel = 'Cancel',
    loading, onConfirm, onCancel, severity = 'error',
}: ConfirmDialogProps) {
    return (
        <Dialog open={open} onClose={onCancel} maxWidth="xs" fullWidth>
            <DialogTitle sx={{ fontWeight: 700 }}>{title}</DialogTitle>
            <DialogContent>
                <DialogContentText>{message}</DialogContentText>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
                <Button onClick={onCancel} variant="outlined" color="inherit" disabled={loading}>
                    {cancelLabel}
                </Button>
                <CustomButton
                    onClick={onConfirm}
                    variant="contained"
                    color={severity}
                    loading={loading}
                >
                    {confirmLabel}
                </CustomButton>
            </DialogActions>
        </Dialog>
    );
}
