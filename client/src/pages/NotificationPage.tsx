import React from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Button,
  Chip,
  Divider,
  Card,
  CardContent,
  Tooltip,
} from "@mui/material";
import {
  Notifications as NotifIcon,
  Info as InfoIcon,
  CheckCircle as SuccessIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  DoneAll as MarkAllIcon,
  Circle as UnreadDot,
} from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  fetchNotifications,
  markAsRead,
  markAllAsRead,
} from "../features/notifications/notificationSlice";
import Loader from "../components/common/Loader";
import EmptyState from "../components/common/EmptyState";
import ErrorAlert from "../components/common/ErrorAlert";

const typeConfig = {
  info: { icon: <InfoIcon />, color: "#3b82f6", bg: "rgba(59,130,246,0.1)" },
  success: {
    icon: <SuccessIcon />,
    color: "#10b981",
    bg: "rgba(16,185,129,0.1)",
  },
  warning: {
    icon: <WarningIcon />,
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.1)",
  },
  error: { icon: <ErrorIcon />, color: "#ef4444", bg: "rgba(239,68,68,0.1)" },
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export default function NotificationPage() {
  const dispatch = useAppDispatch();
  const {
    data: notifications,
    loading,
    error,
  } = useAppSelector((s) => s.notifications);
  const unreadCount = notifications.filter((n) => !n.read).length;

  React.useEffect(() => {
    dispatch(fetchNotifications(2));
  }, [dispatch]);

  const handleMarkRead = (id: string) => dispatch(markAsRead(Number(id)));
  const handleMarkAll = () => dispatch(markAllAsRead());

  function getNotificationMeta(message: string) {
    if (message.toLowerCase().includes("assigned"))
      return { title: "Task Assigned", type: "info" };

    if (message.toLowerCase().includes("completed"))
      return { title: "Task Completed", type: "success" };

    if (message.toLowerCase().includes("overdue"))
      return { title: "Task Overdue", type: "warning" };

    return { title: "Notification", type: "info" };
  }

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
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Typography variant="h4" fontWeight={800}>
              Notifications
            </Typography>
            {unreadCount > 0 && (
              <Chip
                label={`${unreadCount} new`}
                size="small"
                color="error"
                sx={{ fontWeight: 700 }}
              />
            )}
          </Box>
          <Typography variant="body2" color="text.secondary">
            Stay updated with the latest activity.
          </Typography>
        </Box>
        {unreadCount > 0 && (
          <Button
            variant="outlined"
            startIcon={<MarkAllIcon />}
            onClick={handleMarkAll}
            size="small"
          >
            Mark All as Read
          </Button>
        )}
      </Box>

      <ErrorAlert message={error} />

      <Card>
        {loading ? (
          <Loader message="Loading notifications..." />
        ) : notifications.length === 0 ? (
          <EmptyState
            title="No notifications"
            description="You're all caught up! Check back later."
            icon={<NotifIcon sx={{ fontSize: 64 }} />}
          />
        ) : (
          <List disablePadding>
            {notifications.map((notif, idx) => {
              const { title, type } = getNotificationMeta(notif.message);
              const config = typeConfig[type as keyof typeof typeConfig];
              return (
                <React.Fragment key={notif.notificationId}>
                  <ListItem
                    alignItems="flex-start"
                    sx={{
                      px: 3,
                      py: 2,
                      bgcolor: !notif.read ? "action.hover" : "transparent",
                      transition: "background 0.2s",
                      "&:hover": { bgcolor: "action.hover" },
                    }}
                    secondaryAction={
                      !notif.read ? (
                        <Tooltip title="Mark as read">
                          <IconButton
                            size="small"
                            onClick={() => handleMarkRead(String(notif.notificationId))}
                          >
                            <UnreadDot fontSize="small" color="primary" />
                          </IconButton>
                        </Tooltip>
                      ) : null
                    }
                  >
                    <ListItemIcon sx={{ mt: 0.5, minWidth: 44 }}>
                      <Box
                        sx={{
                          width: 36,
                          height: 36,
                          borderRadius: 2,
                          bgcolor: config.bg,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: config.color,
                          flexShrink: 0,
                        }}
                      >
                        {config.icon}
                      </Box>
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            mb: 0.3,
                          }}
                        >
                          <Typography
                            variant="body2"
                            fontWeight={notif.read ? 500 : 700}
                          >
                            {title}
                          </Typography>
                          {!notif.read && (
                            <Box
                              sx={{
                                width: 7,
                                height: 7,
                                borderRadius: "50%",
                                bgcolor: "error.main",
                                flexShrink: 0,
                              }}
                            />
                          )}
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mb: 0.5 }}
                          >
                            {notif.message}
                          </Typography>
                          <Typography variant="caption" color="text.disabled">
                            {timeAgo(notif.createdAt)}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                  {idx < notifications.length - 1 && <Divider />}
                </React.Fragment>
              );
            })}
          </List>
        )}
      </Card>
    </Box>
  );
}
