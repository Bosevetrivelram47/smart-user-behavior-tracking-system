import React from 'react';
import {
    Box, Typography, Card, CardContent, Grid, Button, Dialog,
    DialogTitle, DialogContent, DialogActions, TextField, FormControl,
    InputLabel, Select, MenuItem, Table, TableHead, TableBody,
    TableRow, TableCell, TableContainer, Chip,
} from '@mui/material';
import { CheckCircle as ResolveIcon } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchResolutions, createResolution } from '../features/resolutions/resolutionSlice';
import { fetchTasks } from '../features/tasks/taskSlice';
import { fetchUsers } from '../features/users/userSlice';
import CustomButton from '../components/common/CustomButton';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';
import ErrorAlert from '../components/common/ErrorAlert';

const schema = yup.object({
    taskId: yup.string().required('Please select a task'),
    remarks: yup.string().required('Remarks are required').min(10, 'Please provide at least 10 characters'),
});
type FormData = yup.InferType<typeof schema>;

export default function TaskResolutionPage() {
    const dispatch = useAppDispatch();
    const { data: resolutions, loading, error } = useAppSelector((s) => s.resolutions);
    const tasks = useAppSelector((s) => s.tasks.data);
    const currentUser = useAppSelector((s) => s.auth.user);
    const [open, setOpen] = React.useState(false);
    const [resolving, setResolving] = React.useState(false);

    const { control, register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
        resolver: yupResolver(schema),
    });

    React.useEffect(() => {
        dispatch(fetchResolutions());
        dispatch(fetchTasks());
        dispatch(fetchUsers());
    }, [dispatch]);

    const resolveableTasks = tasks.filter((t) => t.status !== 'COMPLETED');

    const onSubmit = async (data: FormData) => {
        setResolving(true);
        const task = tasks.find((t) => t.id === data.taskId);
        if (task && currentUser) {
            await dispatch(createResolution({
                taskId: data.taskId,
                taskTitle: task.title,
                userId: currentUser.id,
                userName: currentUser.name,
                remarks: data.remarks,
            }));
        }
        setResolving(false);
        setOpen(false);
        reset();
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3, flexWrap: 'wrap', gap: 2 }}>
                <Box>
                    <Typography variant="h4" fontWeight={800}>Task Resolutions</Typography>
                    <Typography variant="body2" color="text.secondary">Resolve tasks and document completion remarks.</Typography>
                </Box>
                <Button variant="contained" color="success" startIcon={<ResolveIcon />} onClick={() => setOpen(true)}>
                    Resolve Task
                </Button>
            </Box>

            <ErrorAlert message={error} />

            {/* Stats */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
                {[
                    { label: 'Total Resolved', value: resolutions.length, color: '#10b981' },
                    { label: 'Pending Resolution', value: resolveableTasks.length, color: '#f59e0b' },
                    { label: 'Resolved This Month', value: resolutions.filter(r => r.resolvedAt.startsWith('2026')).length, color: '#4f46e5' },
                ].map((s) => (
                    <Grid item xs={12} sm={4} key={s.label}>
                        <Card sx={{ p: 2, borderLeft: `4px solid ${s.color}` }}>
                            <Typography variant="h4" fontWeight={800} sx={{ color: s.color }}>{s.value}</Typography>
                            <Typography variant="body2" color="text.secondary">{s.label}</Typography>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Resolution History */}
            <Card>
                <CardContent sx={{ p: 0 }}>
                    <Box sx={{ p: 3, pb: 2 }}>
                        <Typography variant="h6" fontWeight={700}>Resolution History</Typography>
                    </Box>
                    {loading ? <Loader message="Loading resolutions..." /> : resolutions.length === 0 ? (
                        <EmptyState title="No resolutions yet" description="Resolve a task to see history here." />
                    ) : (
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow sx={{ '& th': { fontWeight: 700 } }}>
                                        <TableCell>Task</TableCell>
                                        <TableCell>Resolved By</TableCell>
                                        <TableCell>Remarks</TableCell>
                                        <TableCell>Resolved On</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {resolutions.map((r) => (
                                        <TableRow key={r.id} hover>
                                            <TableCell>
                                                <Typography variant="body2" fontWeight={600}>{r.taskTitle}</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Chip label={r.userName} size="small" sx={{ bgcolor: 'rgba(79,70,229,0.1)', color: 'primary.main', fontWeight: 600 }} />
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 350 }}>
                                                    {r.remarks}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2" color="text.secondary">{r.resolvedAt}</Typography>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </CardContent>
            </Card>

            {/* Resolve Task Dialog */}
            <Dialog open={open} onClose={() => { setOpen(false); reset(); }} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ fontWeight: 700 }}>Resolve Task</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 1 }}>
                        <Controller
                            name="taskId"
                            control={control}
                            render={({ field }) => (
                                <FormControl fullWidth error={Boolean(errors.taskId)}>
                                    <InputLabel>Select Task to Resolve</InputLabel>
                                    <Select {...field} label="Select Task to Resolve">
                                        {resolveableTasks.map((t) => (
                                            <MenuItem key={t.id} value={t.id}>{t.title}</MenuItem>
                                        ))}
                                    </Select>
                                    {errors.taskId && <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>{errors.taskId.message}</Typography>}
                                </FormControl>
                            )}
                        />
                        <TextField
                            label="Resolution Remarks"
                            multiline
                            rows={4}
                            fullWidth
                            placeholder="Describe what was done to resolve this task..."
                            {...register('remarks')}
                            error={Boolean(errors.remarks)}
                            helperText={errors.remarks?.message}
                        />
                    </Box>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={() => { setOpen(false); reset(); }} variant="outlined" color="inherit">Cancel</Button>
                    <CustomButton variant="contained" color="success" loading={resolving} onClick={handleSubmit(onSubmit)}>
                        Mark as Resolved
                    </CustomButton>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
