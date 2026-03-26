import React from "react";
import {
  Box,
  Typography,
  Button,
  Chip,
  Switch,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  InputAdornment,
  Tooltip,
  IconButton,
  Card,
} from "@mui/material";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import {
  Add as AddIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  fetchUsers,
  toggleUserActive,
  createUser,
} from "../features/users/userSlice";
import type { AppUser } from "../features/users/userSlice";
import CustomButton from "../components/common/CustomButton";
import Loader from "../components/common/Loader";
import EmptyState from "../components/common/EmptyState";
import ErrorAlert from "../components/common/ErrorAlert";

const schema = yup.object({
  name: yup.string().required().min(2),
  email: yup.string().email().required(),
  password: yup.string().min(6).required(),
  role: yup.mixed<"ADMIN" | "USER">().oneOf(["ADMIN", "USER"]).required(),
});
type FormData = yup.InferType<typeof schema>;

export default function UserManagementPage() {
  const dispatch = useAppDispatch();
  const { data: users, loading, error } = useAppSelector((s) => s.users);
  const [search, setSearch] = React.useState("");
  const [roleFilter, setRoleFilter] = React.useState<string>("ALL");
  const [createOpen, setCreateOpen] = React.useState(false);
  const [creating, setCreating] = React.useState(false);

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: { role: "USER" },
  });

  React.useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const filtered = users.filter((u) => {
    const matchSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "ALL" || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const handleToggle = (user: AppUser) =>
    dispatch(toggleUserActive({ id: user.id, active: user.active }));

  const onCreateSubmit = async (data: FormData) => {
    setCreating(true);
    await dispatch(
      createUser({
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role,
      }),
    );
    setCreating(false);
    setCreateOpen(false);
    reset();
  };

  const columns: GridColDef<AppUser>[] = [
    { field: "name", headerName: "Name", flex: 1, minWidth: 150 },
    { field: "email", headerName: "Email", flex: 1.5, minWidth: 200 },
    {
      field: "role",
      headerName: "Role",
      width: 110,
      renderCell: ({ value }) => (
        <Chip
          label={value}
          size="small"
          sx={{
            bgcolor:
              value === "ADMIN"
                ? "rgba(79,70,229,0.12)"
                : "rgba(6,182,212,0.12)",
            color: value === "ADMIN" ? "#4f46e5" : "#0891b2",
            fontWeight: 700,
            fontSize: "0.7rem",
          }}
        />
      ),
    },
    {
      field: "active",
      headerName: "Status",
      width: 100,
      renderCell: ({ row }) => (
        <Tooltip title={row.active ? "Deactivate user" : "Activate user"}>
          <Switch
            checked={row.active}
            onChange={() => handleToggle(row)}
            size="small"
            color="success"
          />
        </Tooltip>
      ),
    },
  ];

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
          <Typography className="page-title" variant="h4">
            User Management
          </Typography>
          <Typography className="page-subtitle" color="text.secondary">
            Manage all platform users and their roles.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setCreateOpen(true)}
        >
          Create User
        </Button>
      </Box>

      <ErrorAlert message={error} />

      {/* Filters */}
      <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
        <TextField
          placeholder="Search users..."
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ minWidth: 250 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
        />
        <FormControl size="small" sx={{ minWidth: 130 }}>
          <InputLabel>Role</InputLabel>
          <Select
            value={roleFilter}
            label="Role"
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <MenuItem value="ALL">All Roles</MenuItem>
            <MenuItem value="ADMIN">Admin</MenuItem>
            <MenuItem value="USER">User</MenuItem>
          </Select>
        </FormControl>
        <Tooltip title="Refresh">
          <IconButton
            onClick={() => dispatch(fetchUsers())}
            sx={{ border: 1, borderColor: "divider" }}
          >
            <RefreshIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>

      <Card sx={{ p: 0, overflow: "hidden" }}>
        {loading ? (
          <Loader message="Loading users..." />
        ) : filtered.length === 0 ? (
          <EmptyState
            title="No users found"
            description="Try adjusting your filters."
          />
        ) : (
          <DataGrid
            sx={{
              "& .MuiDataGrid-columnHeaders": {
                borderRadius: "16px 16px 0 0",
              },
              border: "none",
            }}
            rows={filtered}
            columns={columns}
            autoHeight
            disableRowSelectionOnClick
            initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
            pageSizeOptions={[5, 10, 25]}
          />
        )}
      </Card>

      {/* Create User Dialog */}
      <Dialog
        open={createOpen}
        onClose={() => {
          setCreateOpen(false);
          reset();
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Create New User</DialogTitle>
        <DialogContent>
          <Box
            component="form"
            sx={{ display: "flex", flexDirection: "column", gap: 2.5, pt: 1 }}
          >
            <TextField
              label="Full Name"
              fullWidth
              {...register("name")}
              error={Boolean(errors.name)}
              helperText={errors.name?.message}
            />
            <TextField
              label="Email Address"
              fullWidth
              type="email"
              {...register("email")}
              error={Boolean(errors.email)}
              helperText={errors.email?.message}
            />
            <Controller
              name="role"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth error={Boolean(errors.role)}>
                  <InputLabel>Role</InputLabel>
                  <Select {...field} label="Role">
                    <MenuItem value="ADMIN">Admin</MenuItem>
                    <MenuItem value="USER">User</MenuItem>
                  </Select>
                </FormControl>
              )}
            />

            <TextField
              label="Password"
              type="password"
              fullWidth
              {...register("password")}
              error={Boolean(errors.password)}
              helperText={errors.password?.message}
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
            onClick={handleSubmit(onCreateSubmit)}
          >
            Create User
          </CustomButton>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
