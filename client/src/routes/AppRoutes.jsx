import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import MainLayout from '../components/layout/MainLayout';

// Import all pages
import Login from '../pages/auth/Login';
import Signup from '../pages/auth/Signup';
import Dashboard from '../pages/Dashboard';
import Organization from '../pages/Organization';
import Assets from '../pages/Assets';
import Allocation from '../pages/Allocation';
import Booking from '../pages/Booking';
import Maintenance from '../pages/Maintenance';
import Audit from '../pages/Audit';
import Reports from '../pages/Reports';
import Notifications from '../pages/Notifications';
import AdminUsers from '../pages/AdminUsers'; // New administration page

// Roles synchronized with database uppercase strings
const ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  ADMIN: 'ADMIN',
  ASSET_MANAGER: 'ASSET_MANAGER',
  DEPARTMENT_HEAD: 'DEPARTMENT_HEAD',
  EMPLOYEE: 'EMPLOYEE',
};

// Route protection for authenticated users
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

// Redirect authenticated users away from auth pages (login/signup)
function PublicRoute({ children }) {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
}

// Role-based route guard
function RoleGuard({ children, allowedRoles }) {
  const { role } = useAuthStore();
  if (!allowedRoles.includes(role)) {
    // If not authorized, redirect back to dashboard
    return <Navigate to="/dashboard" replace />;
  }
  return children;
}

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Pages */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/signup"
        element={
          <PublicRoute>
            <Signup />
          </PublicRoute>
        }
      />

      {/* Protected App Pages Layout wrapper */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        {/* Default route redirect */}
        <Route index element={<Navigate to="/dashboard" replace />} />

        {/* Dashboard (Available to all logged-in roles) */}
        <Route path="dashboard" element={<Dashboard />} />

        {/* Organization (Admin, Asset Manager, Dept Head) */}
        <Route
          path="organization"
          element={
            <RoleGuard allowedRoles={[ROLES.ADMIN, ROLES.ASSET_MANAGER, ROLES.DEPARTMENT_HEAD]}>
              <Organization />
            </RoleGuard>
          }
        />

        {/* Assets (Available to all roles) */}
        <Route path="assets" element={<Assets />} />

        {/* Allocation (Admin, Asset Manager, Dept Head) */}
        <Route
          path="allocation"
          element={
            <RoleGuard allowedRoles={[ROLES.ADMIN, ROLES.ASSET_MANAGER, ROLES.DEPARTMENT_HEAD]}>
              <Allocation />
            </RoleGuard>
          }
        />

        {/* Booking (Available to all roles) */}
        <Route path="booking" element={<Booking />} />

        {/* Maintenance (Available to all roles) */}
        <Route path="maintenance" element={<Maintenance />} />

        {/* Audit Logs (Admin, Asset Manager) */}
        <Route
          path="audit"
          element={
            <RoleGuard allowedRoles={[ROLES.ADMIN, ROLES.ASSET_MANAGER]}>
              <Audit />
            </RoleGuard>
          }
        />

        {/* Reports (Admin, Asset Manager) */}
        <Route
          path="reports"
          element={
            <RoleGuard allowedRoles={[ROLES.ADMIN, ROLES.ASSET_MANAGER]}>
              <Reports />
            </RoleGuard>
          }
        />

        {/* Notifications (Available to all roles) */}
        <Route path="notifications" element={<Notifications />} />

        {/* Admin Directory Page (ADMIN only) */}
        <Route
          path="admin/users"
          element={
            <RoleGuard allowedRoles={[ROLES.ADMIN]}>
              <AdminUsers />
            </RoleGuard>
          }
        />
      </Route>

      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
