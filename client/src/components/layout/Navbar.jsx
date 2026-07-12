import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import {
  RiMenuLine,
  RiNotification3Line,
  RiLogoutBoxRLine,
  RiSettings4Line,
} from 'react-icons/ri';

const pathTitleMap = {
  '/dashboard': 'Dashboard Overview',
  '/organization': 'Organization Management',
  '/assets': 'Asset Registry',
  '/allocation': 'Asset Allocations',
  '/booking': 'Resource Bookings',
  '/maintenance': 'Maintenance Requests',
  '/audit': 'Compliance & Audit',
  '/reports': 'System Reports',
  '/notifications': 'Notifications Inbox',
};

export default function Navbar({ onToggleMobile }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, role, logout } = useAuthStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Derive current page title dynamically from route path
  const currentPath = location.pathname;
  const pageTitle = pathTitleMap[currentPath] || 'AssetFlow ERP';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 h-16 px-4 md:px-6 flex items-center justify-between shadow-sm">
      {/* Mobile & Left Section */}
      <div className="flex items-center gap-4">
        {/* Mobile Toggle Trigger */}
        <button
          onClick={onToggleMobile}
          className="md:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          title="Open Menu"
        >
          <RiMenuLine className="w-5 h-5" />
        </button>
        {/* Page Title */}
        <h1 className="text-base md:text-lg font-bold text-slate-800 tracking-tight truncate">
          {pageTitle}
        </h1>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Notifications Icon (Directly Navigates to Notifications Page) */}
        <button
          onClick={() => navigate('/notifications')}
          className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all duration-200"
          title="View Notifications"
        >
          <RiNotification3Line className="w-[22px] h-[22px]" />
          {/* Mock notification badge - dynamic in later phases */}
          <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-indigo-600 text-white rounded-full flex items-center justify-center text-[9px] font-bold">
            3
          </span>
        </button>

        <div className="h-6 w-px bg-slate-200 mx-1" />

        {/* User Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-slate-100 transition-all duration-200 group text-left"
          >
            <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center font-bold text-indigo-600 shadow-inner group-hover:bg-indigo-100 transition-colors uppercase">
              {user?.name ? user.name.slice(0, 2) : role ? role.charAt(0) : 'U'}
            </div>
            <div className="hidden lg:block min-w-0 pr-1">
              <p className="text-sm font-semibold text-slate-800 leading-tight truncate">
                {user?.name || user?.email || 'System User'}
              </p>
              <p className="text-xs font-medium text-slate-400 truncate">
                {role || 'Viewer'}
              </p>
            </div>
          </button>

          {/* Dropdown Menu Overlay */}
          {dropdownOpen && (
            <>
              {/* Invisible Close Overlay */}
              <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
              
              <div className="absolute right-0 mt-2.5 w-56 rounded-xl bg-white border border-slate-200 shadow-xl py-2 z-50 animate-fade-in">
                {/* User Header */}
                <div className="px-4 py-2 border-b border-slate-100">
                  <p className="text-sm font-bold text-slate-800 truncate">
                    {user?.name || 'AssetFlow User'}
                  </p>
                  <p className="text-xs text-slate-500 truncate mt-0.5">
                    {user?.email || 'user@assetflow.com'}
                  </p>
                  <span className="inline-block mt-2 px-2 py-0.5 text-[10px] font-bold tracking-wide uppercase rounded bg-indigo-50 text-indigo-600 border border-indigo-100">
                    {role}
                  </span>
                </div>

                {/* Dropdown Action Items */}
                <div className="p-1">
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      navigate('/notifications');
                    }}
                    className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors"
                  >
                    <RiNotification3Line className="w-4 h-4 text-slate-400" />
                    <span>Notifications</span>
                  </button>
                  
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      // In later phases navigate to settings
                    }}
                    className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors"
                  >
                    <RiSettings4Line className="w-4 h-4 text-slate-400" />
                    <span>Preferences</span>
                  </button>
                </div>

                <div className="border-t border-slate-100 my-1" />

                {/* Logout Button */}
                <div className="p-1">
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      handleLogout();
                    }}
                    className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-rose-600 hover:bg-rose-50 rounded-lg transition-colors font-medium"
                  >
                    <RiLogoutBoxRLine className="w-4 h-4 text-rose-400" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
