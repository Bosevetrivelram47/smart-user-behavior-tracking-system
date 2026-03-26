import React from "react";
import {
  Box,
  Typography,
  Card,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  TextField,
  InputAdornment,
} from "@mui/material";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { Search as SearchIcon, Timer as TimerIcon } from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { fetchNavLogs } from "../features/navigation/navigationSlice";
import { fetchUsers } from "../features/users/userSlice";
import type { NavLog } from "../features/navigation/navigationSlice";
import Loader from "../components/common/Loader";
import EmptyState from "../components/common/EmptyState";
import ErrorAlert from "../components/common/ErrorAlert";

function formatTime(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}m ${s}s`;
}

export default function NavigationTrackingPage() {
  const dispatch = useAppDispatch();
  const { data: logs, loading, error } = useAppSelector((s) => s.navigation);
  const users = useAppSelector((s) => s.users.data);
  const [userFilter, setUserFilter] = React.useState<number | "ALL">("ALL");
  const [pageSearch, setPageSearch] = React.useState("");

  React.useEffect(() => {
    dispatch(fetchNavLogs());
    dispatch(fetchUsers());
  }, [dispatch]);

  const filtered = logs.filter((l) => {
    const matchUser = userFilter === "ALL" || l.userId === userFilter;
    const matchPage =
      l.pageName.toLowerCase().includes(pageSearch.toLowerCase()) ||
      l.path?.toLowerCase().includes(pageSearch.toLowerCase());
    return matchUser && matchPage;
  });

  const columns: GridColDef<NavLog>[] = [
    {
      field: "userName",
      headerName: "User",
      flex: 1,
      minWidth: 130,
      renderCell: ({ value }) => (
        <Chip
          label={value}
          size="small"
          sx={{
            bgcolor: "rgba(79,70,229,0.1)",
            color: "primary.main",
            fontWeight: 600,
          }}
        />
      ),
    },
    { field: "pageName", headerName: "Page", flex: 1, minWidth: 130 },
    {
      field: "path",
      headerName: "Path",
      flex: 1,
      minWidth: 160,
      renderCell: ({ value }) => (
        <Typography
          variant="body2"
          sx={{
            fontFamily: "monospace",
            fontSize: "0.8rem",
            color: "text.secondary",
          }}
        >
          {value}
        </Typography>
      ),
    },
    {
      field: "timeSpentSeconds",
      headerName: "Time Spent",
      width: 120,
      renderCell: ({ value }) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <TimerIcon fontSize="small" color="action" />
          <Typography variant="body2" fontWeight={600}>
            {formatTime(value)}
          </Typography>
        </Box>
      ),
      sortComparator: (a, b) => a - b,
    },
    {
      field: "visitedAt",
      headerName: "Visited At",
      flex: 1.2,
      minWidth: 170,
      renderCell: ({ value }) => (
        <Typography variant="body2" color="text.secondary">
          {new Date(value).toLocaleString()}
        </Typography>
      ),
    },
  ];

  // Aggregate stats
  const totalVisits = filtered.length;
  const avgTime =
    filtered.length > 0
      ? Math.round(
          filtered.reduce((sum, l) => sum + l.timeSpentSeconds, 0) /
            filtered.length,
        )
      : 0;
  const topPage = filtered.reduce((acc: Record<string, number>, l) => {
    acc[l.pageName] = (acc[l.pageName] || 0) + 1;
    return acc;
  }, {});
  const mostVisited =
    Object.entries(topPage).sort((a, b) => b[1] - a[1])[0]?.[0] || "—";

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight={800}>
          Navigation Tracking
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Monitor user navigation patterns and time spent on each page.
        </Typography>
      </Box>

      <ErrorAlert message={error} />

      {/* Quick Stats */}
      <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
        {[
          { label: "Total Visits", value: totalVisits, color: "#4f46e5" },
          {
            label: "Avg. Time Spent",
            value: formatTime(avgTime),
            color: "#06b6d4",
          },
          { label: "Most Visited Page", value: mostVisited, color: "#10b981" },
        ].map((s) => (
          <Card
            key={s.label}
            sx={{
              flex: "1 1 160px",
              p: 2.5,
              borderTop: `3px solid ${s.color}`,
            }}
          >
            <Typography variant="h5" fontWeight={800} sx={{ color: s.color }}>
              {s.value}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {s.label}
            </Typography>
          </Card>
        ))}
      </Box>

      {/* Filters */}
      <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
        <TextField
          placeholder="Search by page or path..."
          size="small"
          value={pageSearch}
          onChange={(e) => setPageSearch(e.target.value)}
          sx={{ minWidth: 240 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
        />
        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel>Filter by User</InputLabel>
          <Select
            value={userFilter}
            label="Filter by User"
            onChange={(e) =>
              setUserFilter(
                e.target.value === "ALL" ? "ALL" : Number(e.target.value),
              )
            }
          >
            <MenuItem value="ALL">All Users</MenuItem>
            {users.map((u) => (
              <MenuItem key={u.id} value={u.id}>
                {u.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Card sx={{ p: 0, overflow: "hidden" }}>
        {loading ? (
          <Loader message="Loading navigation logs..." />
        ) : filtered.length === 0 ? (
          <EmptyState
            title="No logs found"
            description="No navigation data matches your filters."
          />
        ) : (
          <DataGrid
            sx={{
              "& .MuiDataGrid-columnHeaders": {
                borderRadius: "16px 16px 0 0",
              },
              border: "none"
            }}
            rows={filtered}
            columns={columns}
            getRowId={(row) => row.navigationId}
            autoHeight
            disableRowSelectionOnClick
            initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
            pageSizeOptions={[5, 10, 25]}
          />
        )}
      </Card>
    </Box>
  );
}
