import React from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import MainLayout from '../components/layout/MainLayout';
import {
  RiLockLine,
  RiArrowLeftLine,
  RiSearchLine,
  RiHomeLine,
} from 'react-icons/ri';

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
import AdminUsers from '../pages/AdminUsers';

// Roles synchronized with database uppercase ENUM strings
const ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  ADMIN: 'ADMIN',
  ASSET_MANAGER: 'ASSET_MANAGER',
  DEPARTMENT_HEAD: 'DEPARTMENT_HEAD',
  EMPLOYEE: 'EMPLOYEE',
};

// ---------------------------------------------------------------
// Inline 403 Unauthorized Page
// ---------------------------------------------------------------
function UnauthorizedPage() {
  return (
    <div className="min-h-full flex items-center justify-center px-4">
      <div className="text-center max-w-md space-y-6">
        {/* Icon */}
        <div className="flex items-center justify-center mx-auto w-20 h-20 rounded-3xl bg-rose-500/10 border border-rose-500/20">
          <RiLockLine className="w-10 h-10 text-rose-500" />
        </div>

        {/* Status code */}
        <div>
          <p className="text-xs font-black uppercase tracking-widest text-rose-500 mb-2">
            Error 403 — Unauthorized
          </p>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Access Denied
          </h1>
          <p className="text-slate-500 text-sm mt-3 leading-relaxed">
            You do not have the required permissions to access this page.
            Contact your Administrator to request elevated access.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/dashboard"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold rounded-xl transition-colors shadow-md shadow-indigo-600/10"
          >
            <RiHomeLine className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold rounded-xl transition-colors cursor-pointer"
          >
            <RiArrowLeftLine className="w-4 h-4" />
            <span>Go Back</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------
// Inline 404 Not Found Page
// ---------------------------------------------------------------
function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-slate-50">
      <div className="text-center max-w-md space-y-6">
        {/* Icon */}
        <div className="flex items-center justify-center mx-auto w-20 h-20 rounded-3xl bg-slate-200/60 border border-slate-300/40">
          <RiSearchLine className="w-10 h-10 text-slate-400" />
        </div>

        {/* Large 404 numeral */}
        <p className="text-8xl font-black text-slate-200 select-none leading-none">
          404
        </p>

        {/* Status code */}
        <div>
          <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">
            Page Not Found
          </p>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Oops! Wrong Turn
          </h1>
          <p className="text-slate-500 text-sm mt-3 leading-relaxed">
            The page you are looking for does not exist or has been moved.
            Please check the URL or return to the dashboard.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/dashboard"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold rounded-xl transition-colors shadow-md shadow-indigo-600/10"
          >
            <RiHomeLine className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold rounded-xl transition-colors cursor-pointer"
          >
            <RiArrowLeftLine className="w-4 h-4" />
            <span>Go Back</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------
// Route Guards
// ---------------------------------------------------------------

// Redirect unauthenticated users to login
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

// Redirect already-authenticated users away from login/signup
function PublicRoute({ children }) {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
}

// Role-based access guard — redirects to /unauthorized on role mismatch
function RoleGuard({ children, allowedRoles }) {
  const { role } = useAuthStore();
  if (!allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }
  return children;
}

// ---------------------------------------------------------------
// AppRoutes
// ---------------------------------------------------------------
export default function AppRoutes() {
  return (
    <Routes>
      {/* ---- Public Routes ---- */}
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

      {/* ---- Standalone 404 (outside layout, no auth required) ---- */}
      <Route path="/not-found" element={<NotFoundPage />} />

      {/* ---- Protected App Shell (MainLayout) ---- */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        {/* Default root → dashboard */}
        <Route index element={<Navigate to="/dashboard" replace />} />

        {/* Dashboard — all authenticated roles */}
        <Route path="dashboard" element={<Dashboard />} />

        {/* Organization — SUPER_ADMIN, ADMIN only */}
        <Route
          path="organization"
          element={
            <RoleGuard allowedRoles={[ROLES.SUPER_ADMIN, ROLES.ADMIN]}>
              <Organization />
            </RoleGuard>
          }
        />

        {/* Assets — ADMIN, ASSET_MANAGER, DEPARTMENT_HEAD */}
        <Route
          path="assets"
          element={
            <RoleGuard allowedRoles={[ROLES.ADMIN, ROLES.ASSET_MANAGER, ROLES.DEPARTMENT_HEAD]}>
              <Assets />
            </RoleGuard>
          }
        />

        {/* Allocation — ADMIN, ASSET_MANAGER, DEPARTMENT_HEAD */}
        <Route
          path="allocation"
          element={
            <RoleGuard allowedRoles={[ROLES.ADMIN, ROLES.ASSET_MANAGER, ROLES.DEPARTMENT_HEAD]}>
              <Allocation />
            </RoleGuard>
          }
        />

        {/* Booking — all authenticated roles */}
        <Route path="booking" element={<Booking />} />

        {/* Maintenance — all authenticated roles */}
        <Route path="maintenance" element={<Maintenance />} />

        {/* Audit — ADMIN, ASSET_MANAGER */}
        <Route
          path="audit"
          element={
            <RoleGuard allowedRoles={[ROLES.ADMIN, ROLES.ASSET_MANAGER]}>
              <Audit />
            </RoleGuard>
          }
        />

        {/* Reports — SUPER_ADMIN, ADMIN, ASSET_MANAGER */}
        <Route
          path="reports"
          element={
            <RoleGuard allowedRoles={[ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.ASSET_MANAGER]}>
              <Reports />
            </RoleGuard>
          }
        />

        {/* Notifications — all authenticated roles */}
        <Route path="notifications" element={<Notifications />} />

        {/* Admin User Directory — SUPER_ADMIN, ADMIN */}
        <Route
          path="admin/users"
          element={
            <RoleGuard allowedRoles={[ROLES.SUPER_ADMIN, ROLES.ADMIN]}>
              <AdminUsers />
            </RoleGuard>
          }
        />

        {/* 403 Unauthorized — renders inside layout so layout is visible */}
        <Route path="unauthorized" element={<UnauthorizedPage />} />
      </Route>

      {/* ---- Global 404 Catch-All ---- */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
