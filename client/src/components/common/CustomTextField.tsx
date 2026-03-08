import React from 'react';
import { TextField, type TextFieldProps } from '@mui/material';
import type { UseFormRegisterReturn } from 'react-hook-form';

interface CustomTextFieldProps extends Omit<TextFieldProps, 'error'> {
    register?: UseFormRegisterReturn;
    error?: boolean | string;
}

export default function CustomTextField({ register, error, helperText, ...props }: CustomTextFieldProps) {
    return (
        <TextField
            {...props}
            {...(register || {})}
            error={Boolean(error)}
            helperText={typeof error === 'string' ? error : helperText}
            fullWidth
            variant="outlined"
            size="medium"
        />
    );
}
