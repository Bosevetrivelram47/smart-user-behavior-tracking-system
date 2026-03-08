import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ROUTES } from '../utils/constants';
import ProtectedRoute from './ProtectedRoute';
import AppLayout from '../components/layout/AppLayout';
import LoginPage from '../pages/LoginPage';
import DashboardPage from '../pages/DashboardPage';
import UserManagementPage from '../pages/UserManagementPage';
import TaskManagementPage from '../pages/TaskManagementPage';
import TaskAssignmentPage from '../pages/TaskAssignmentPage';
import TaskResolutionPage from '../pages/TaskResolutionPage';
import NavigationTrackingPage from '../pages/NavigationTrackingPage';
import NotificationPage from '../pages/NotificationPage';
import UnauthorizedPage from '../pages/UnauthorizedPage';

export default function AppRoutes() {
    return (
        <Routes>
            {/* Public */}
            <Route path={ROUTES.LOGIN} element={<LoginPage />} />
            <Route path={ROUTES.UNAUTHORIZED} element={<UnauthorizedPage />} />

            {/* Authenticated Layout */}
            <Route
                path="/"
                element={
                    <ProtectedRoute>
                        <AppLayout />
                    </ProtectedRoute>
                }
            >
                {/* Default redirect */}
                <Route index element={<Navigate to={ROUTES.DASHBOARD} replace />} />

                {/* Shared routes (ADMIN + USER) */}
                <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
                <Route path={ROUTES.TASKS} element={<TaskManagementPage />} />
                <Route path={ROUTES.RESOLUTIONS} element={<TaskResolutionPage />} />
                <Route path={ROUTES.NOTIFICATIONS} element={<NotificationPage />} />

                {/* Admin-only routes */}
                <Route
                    path={ROUTES.USERS}
                    element={
                        <ProtectedRoute allowedRoles={['ADMIN']}>
                            <UserManagementPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path={ROUTES.ASSIGNMENTS}
                    element={
                        <ProtectedRoute allowedRoles={['ADMIN']}>
                            <TaskAssignmentPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path={ROUTES.NAVIGATION_LOGS}
                    element={
                        <ProtectedRoute allowedRoles={['ADMIN']}>
                            <NavigationTrackingPage />
                        </ProtectedRoute>
                    }
                />
            </Route>

            {/* Catch-all → dashboard */}
            <Route path="*" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
        </Routes>
    );
}
