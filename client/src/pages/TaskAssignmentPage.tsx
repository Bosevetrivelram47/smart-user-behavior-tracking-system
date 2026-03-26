import React from "react";
import Grid from "@mui/material/Grid";
import {
  Box,
  Typography,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer
} from "@mui/material";
import { AssignmentTurnedIn as AssignIcon } from "@mui/icons-material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  fetchAssignments,
  createAssignment,
} from "../features/assignments/assignmentSlice";
import { fetchUsers } from "../features/users/userSlice";
import { fetchTasks } from "../features/tasks/taskSlice";
import CustomButton from "../components/common/CustomButton";
import Loader from "../components/common/Loader";
import EmptyState from "../components/common/EmptyState";
import ErrorAlert from "../components/common/ErrorAlert";

const schema = yup.object({
  taskId: yup.string().required("Please select a task"),
  userId: yup.string().required("Please select a user"),
});
type FormData = yup.InferType<typeof schema>;

export default function TaskAssignmentPage() {
  const dispatch = useAppDispatch();
  const {
    data: assignments,
    loading,
    error,
  } = useAppSelector((s) => s.assignments);
  const users = useAppSelector((s) => s.users.data);
  const tasks = useAppSelector((s) => s.tasks.data);
  const currentUser = useAppSelector((s) => s.auth.user);
  const [assigning, setAssigning] = React.useState(false);
  const [successMsg, setSuccessMsg] = React.useState("");

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  React.useEffect(() => {
    if (currentUser) {
      dispatch(fetchAssignments(Number(currentUser.id)));
    }
    dispatch(fetchUsers());
    dispatch(fetchTasks());
  }, [dispatch, currentUser]);

  const unassignedTasks = tasks.filter((t) => t.status !== "COMPLETED");
  const activeUsers = users.filter((u) => u.active && u.role === "USER");

  const onSubmit = async (data: FormData) => {
    setAssigning(true);

    const task = tasks.find((t) => t.taskId === Number(data.taskId));
    const user = users.find((u) => u.id === Number(data.userId));

    if (task && user && currentUser) {
      await dispatch(
        createAssignment({
          taskId: Number(data.taskId),
          assignedToUserId: Number(data.userId),
          assignedByUserId: Number(currentUser.id),
        }),
      );

      // ✅ REFRESH ASSIGNMENTS
      dispatch(fetchAssignments(Number(currentUser.id)));

      setSuccessMsg(`"${task.title}" assigned to ${user.name} successfully.`);
      setTimeout(() => setSuccessMsg(""), 3000);
    }

    setAssigning(false);
    reset();
  };
  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight={800}>
          Task Assignments
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Assign tasks to users and track assignment history.
        </Typography>
      </Box>

      <ErrorAlert message={error} />

      <Grid container spacing={3}>
        {/* Assignment Form */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}
              >
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 2,
                    bgcolor: "primary.main",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                  }}
                >
                  <AssignIcon fontSize="small" />
                </Box>
                <Typography variant="h6" fontWeight={700}>
                  Assign Task
                </Typography>
              </Box>

              {successMsg && (
                <Box
                  sx={{
                    bgcolor: "rgba(16,185,129,0.1)",
                    border: "1px solid rgba(16,185,129,0.3)",
                    borderRadius: 2,
                    p: 1.5,
                    mb: 2,
                  }}
                >
                  <Typography
                    variant="body2"
                    color="success.main"
                    fontWeight={600}
                  >
                    {successMsg}
                  </Typography>
                </Box>
              )}

              <Box
                component="form"
                onSubmit={handleSubmit(onSubmit)}
                sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}
              >
                <Controller
                  name="taskId"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth error={Boolean(errors.taskId)}>
                      <InputLabel>Select Task</InputLabel>
                      <Select {...field} label="Select Task">
                        {unassignedTasks.map((t) => (
                          <MenuItem key={t.taskId} value={t.taskId}>
                            <Box>
                              <Typography variant="body2" fontWeight={600}>
                                {t.title}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {t.status}
                              </Typography>
                            </Box>
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.taskId && (
                        <Typography
                          variant="caption"
                          color="error"
                          sx={{ mt: 0.5, ml: 1.5 }}
                        >
                          {errors.taskId.message}
                        </Typography>
                      )}
                    </FormControl>
                  )}
                />

                <Controller
                  name="userId"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth error={Boolean(errors.userId)}>
                      <InputLabel>Select User</InputLabel>
                      <Select {...field} label="Select User">
                        {activeUsers.map((u) => (
                          <MenuItem key={u.id} value={u.id}>
                            <Box>
                              <Typography variant="body2" fontWeight={600}>
                                {u.name}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {u.email}
                              </Typography>
                            </Box>
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.userId && (
                        <Typography
                          variant="caption"
                          color="error"
                          sx={{ mt: 0.5, ml: 1.5 }}
                        >
                          {errors.userId.message}
                        </Typography>
                      )}
                    </FormControl>
                  )}
                />

                <CustomButton
                  type="submit"
                  variant="contained"
                  loading={assigning}
                  fullWidth
                  sx={{ py: 1.3 }}
                >
                  Assign Task
                </CustomButton>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Assignment History */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                Assignment History
              </Typography>
              {loading ? (
                <Loader message="Loading assignments..." />
              ) : assignments.length === 0 ? (
                <EmptyState
                  title="No assignments yet"
                  description="Assign a task to see the history here."
                />
              ) : (
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ "& th": { fontWeight: 700 } }}>
                        <TableCell>Task</TableCell>
                        <TableCell>Assigned To</TableCell>
                        <TableCell>Assigned By</TableCell>
                        <TableCell>Date</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {assignments.map((a) => (
                        <TableRow key={a.assignmentId} hover>
                          <TableCell>
                            <Typography variant="body2" fontWeight={600}>
                              {a.taskTitle}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {a.assignedToUserName}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" color="text.secondary">
                              {a.assignedByUserName}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" color="text.secondary">
                              {a.assignedAt}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
