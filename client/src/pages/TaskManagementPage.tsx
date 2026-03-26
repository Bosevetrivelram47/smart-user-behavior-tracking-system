import React from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
} from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  fetchTasks,
  createTask,
  updateTaskStatus,
} from "../features/tasks/taskSlice";
import type { Task } from "../features/tasks/taskSlice";
import StatusChip from "../components/common/StatusChip";
import CustomButton from "../components/common/CustomButton";
import Loader from "../components/common/Loader";
import EmptyState from "../components/common/EmptyState";
import ErrorAlert from "../components/common/ErrorAlert";

const schema = yup.object({
  title: yup.string().required("Title is required"),
  description: yup.string().required("Description is required"),
  priority: yup
    .mixed<"LOW" | "MEDIUM" | "HIGH">()
    .oneOf(["LOW", "MEDIUM", "HIGH"])
    .required(),
  dueDate: yup.string().required("Due date is required"),
});
type FormData = yup.InferType<typeof schema>;

const priorityColors: Record<string, { bg: string; color: string }> = {
  HIGH: { bg: "rgba(239,68,68,0.1)", color: "#ef4444" },
  MEDIUM: { bg: "rgba(245,158,11,0.1)", color: "#f59e0b" },
  LOW: { bg: "rgba(16,185,129,0.1)", color: "#10b981" },
};

export default function TaskManagementPage() {
  const dispatch = useAppDispatch();
  const { data: tasks, loading, error } = useAppSelector((s) => s.tasks);
  const currentUser = useAppSelector((s) => s.auth.user);
  const [statusFilter, setStatusFilter] = React.useState<string>("ALL");
  const [createOpen, setCreateOpen] = React.useState(false);
  const [creating, setCreating] = React.useState(false);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: { priority: "MEDIUM" },
  });

  React.useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  const filtered = tasks.filter(
    (t) => statusFilter === "ALL" || t.status === statusFilter,
  );

  const handleStatusUpdate = (id: number, status: Task["status"]) => {
    if (!currentUser) return;

    dispatch(
      updateTaskStatus({
        id,
        status,
        updatedByUserId: Number(currentUser.id),
      }),
    );
  };

  const onSubmit = async (data: FormData) => {
    if (!currentUser) return;

    setCreating(true);

    await dispatch(
      createTask({
        title: data.title,
        description: data.description,
        priority: data.priority!,
        createdByUserId: Number(currentUser.id),
      }),
    );

    setCreating(false);
    setCreateOpen(false);
    reset();
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 3,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box>
          <Typography variant="h4" fontWeight={800}>
            Task Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Create, manage, and track all tasks.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setCreateOpen(true)}
        >
          Create Task
        </Button>
      </Box>

      <ErrorAlert message={error} />

      {/* Status filter chips */}
      <Box sx={{ display: "flex", gap: 1, mb: 3, flexWrap: "wrap" }}>
        {["ALL", "PENDING", "IN_PROGRESS", "COMPLETED"].map((s) => (
          <Chip
            key={s}
            label={s === "ALL" ? "All Tasks" : s.replace("_", " ")}
            onClick={() => setStatusFilter(s)}
            variant={statusFilter === s ? "filled" : "outlined"}
            color={statusFilter === s ? "primary" : "default"}
            sx={{ fontWeight: 600, cursor: "pointer" }}
          />
        ))}
      </Box>

      <Card>
        {loading ? (
          <Loader message="Loading tasks..." />
        ) : filtered.length === 0 ? (
          <EmptyState
            title="No tasks found"
            description="No tasks match the current filter."
          />
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow
                  sx={{ "& th": { fontWeight: 700, whiteSpace: "nowrap" } }}
                >
                  <TableCell>Title</TableCell>
                  <TableCell>Priority</TableCell>
                  <TableCell>Status</TableCell>
                  {/* <TableCell>Due Date</TableCell> */}
                  <TableCell>Created</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filtered.map((task) => (
                  <TableRow key={task.taskId} hover>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" fontWeight={600}>
                          {task.title}
                        </Typography>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{
                            display: "block",
                            maxWidth: 250,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {task.description}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={task.priority}
                        size="small"
                        sx={{
                          bgcolor: priorityColors[task.priority]?.bg,
                          color: priorityColors[task.priority]?.color,
                          fontWeight: 700,
                          fontSize: "0.7rem",
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <StatusChip status={task.status} />
                    </TableCell>
                    {/* <TableCell>
                      <Typography variant="body2">{task.dueDate}</Typography>
                    </TableCell> */}
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {new Date(task.createdAt).toLocaleDateString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <FormControl size="small" sx={{ minWidth: 140 }}>
                        <Select
                          value={task.status}
                          onChange={(e) =>
                            handleStatusUpdate(
                              task.taskId,
                              e.target.value as Task["status"],
                            )
                          }
                          sx={{ fontSize: "0.75rem" }}
                        >
                          <MenuItem value="PENDING">Pending</MenuItem>
                          <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
                          <MenuItem value="COMPLETED">Completed</MenuItem>
                        </Select>
                      </FormControl>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Card>

      {/* Create Task Dialog */}
      <Dialog
        open={createOpen}
        onClose={() => {
          setCreateOpen(false);
          reset();
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Create New Task</DialogTitle>
        <DialogContent>
          <Box
            sx={{ display: "flex", flexDirection: "column", gap: 2.5, pt: 1 }}
          >
            <TextField
              label="Task Title"
              fullWidth
              {...register("title")}
              error={Boolean(errors.title)}
              helperText={errors.title?.message}
            />
            <TextField
              label="Description"
              fullWidth
              multiline
              rows={3}
              {...register("description")}
              error={Boolean(errors.description)}
              helperText={errors.description?.message}
            />
            <Controller
              name="priority"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth>
                  <InputLabel>Priority</InputLabel>
                  <Select {...field} label="Priority">
                    <MenuItem value="LOW">Low</MenuItem>
                    <MenuItem value="MEDIUM">Medium</MenuItem>
                    <MenuItem value="HIGH">High</MenuItem>
                  </Select>
                </FormControl>
              )}
            />
            <TextField
              label="Due Date"
              fullWidth
              type="date"
              InputLabelProps={{ shrink: true }}
              {...register("dueDate")}
              error={Boolean(errors.dueDate)}
              helperText={errors.dueDate?.message}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => {
              setCreateOpen(false);
              reset();
            }}
            variant="outlined"
            color="inherit"
          >
            Cancel
          </Button>
          <CustomButton
            variant="contained"
            loading={creating}
            onClick={handleSubmit(onSubmit)}
          >
            Create Task
          </CustomButton>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
