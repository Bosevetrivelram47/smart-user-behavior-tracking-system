export const APP_NAME = 'TrackSmart';

export const ROUTES = {
    LOGIN: '/login',
    DASHBOARD: '/dashboard',
    USERS: '/users',
    TASKS: '/tasks',
    ASSIGNMENTS: '/assignments',
    RESOLUTIONS: '/resolutions',
    NAVIGATION_LOGS: '/navigation-logs',
    NOTIFICATIONS: '/notifications',
    UNAUTHORIZED: '/unauthorized',
};

export const ROLES = {
    ADMIN: 'ADMIN',
    USER: 'USER',
} as const;

export type UserRole = typeof ROLES[keyof typeof ROLES];

export const TASK_STATUS = {
    PENDING: 'PENDING',
    IN_PROGRESS: 'IN_PROGRESS',
    COMPLETED: 'COMPLETED',
} as const;

export type TaskStatus = typeof TASK_STATUS[keyof typeof TASK_STATUS];

export const STATUS_COLORS: Record<string, { bg: string; color: string; label: string }> = {
    PENDING: { bg: '#fef3c7', color: '#92400e', label: 'Pending' },
    IN_PROGRESS: { bg: '#dbeafe', color: '#1e40af', label: 'In Progress' },
    COMPLETED: { bg: '#d1fae5', color: '#065f46', label: 'Completed' },
};

export const STATUS_COLORS_DARK: Record<string, { bg: string; color: string }> = {
    PENDING: { bg: '#78350f', color: '#fde68a' },
    IN_PROGRESS: { bg: '#1e3a8a', color: '#93c5fd' },
    COMPLETED: { bg: '#064e3b', color: '#6ee7b7' },
};

export const SIDEBAR_WIDTH = 260;
export const SIDEBAR_COLLAPSED_WIDTH = 72;
export const NAVBAR_HEIGHT = 64;

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

export const STORAGE_KEYS = {
    TOKEN: 'trackSmart_token',
    USER: 'trackSmart_user',
    COLOR_MODE: 'trackSmart_colorMode',
};

export const MOCK_DELAY = 600;
