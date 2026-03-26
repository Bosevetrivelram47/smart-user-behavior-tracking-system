import { Chip, useTheme } from '@mui/material';
import { STATUS_COLORS, STATUS_COLORS_DARK } from '../../utils/constants';

interface StatusChipProps {
    status: string;
    size?: 'small' | 'medium';
}

export default function StatusChip({ status, size = 'small' }: StatusChipProps) {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    const colors = isDark ? STATUS_COLORS_DARK : STATUS_COLORS;
    const colorSet = colors[status] || { bg: '#f1f5f9', color: '#64748b' };
    const label = STATUS_COLORS[status]?.label || status;

    return (
        <Chip
            label={label}
            size={size}
            sx={{
                bgcolor: colorSet.bg,
                color: colorSet.color,
                fontWeight: 600,
                fontSize: size === 'small' ? '0.7rem' : '0.8rem',
                height: size === 'small' ? 24 : 28,
                '& .MuiChip-label': { px: 1.2 },
            }}
        />
    );
}
