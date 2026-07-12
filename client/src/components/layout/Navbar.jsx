import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { ROLE_LABELS } from '../../utils/constants';
import {
  RiMenuLine,
  RiNotification3Line,
  RiLogoutBoxRLine,
  RiSettings4Line,
  RiSunLine,
  RiMoonLine,
  RiComputerLine,
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
  '/admin/users': 'User Management Directory',
};

export default function Navbar({ onToggleMobile }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, role, logout } = useAuthStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'system';
  });

  // Sync theme changes
  const applyTheme = (selectedTheme) => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    
    if (selectedTheme === 'dark') {
      root.classList.add('dark');
    } else if (selectedTheme === 'light') {
      root.classList.add('light');
    } else {
      const isSystemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.classList.add(isSystemDark ? 'dark' : 'light');
    }
  };

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme);
    setThemeDropdownOpen(false);
  };

  // Derive current page title dynamically from route path
  const currentPath = location.pathname;
  const pageTitle = pathTitleMap[currentPath] || 'AssetFlow ERP';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getThemeIcon = () => {
    switch (theme) {
      case 'light': return <RiSunLine className="w-5 h-5 text-amber-500" />;
      case 'dark': return <RiMoonLine className="w-5 h-5 text-indigo-400" />;
      default: return <RiComputerLine className="w-5 h-5 text-slate-400" />;
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 h-16 px-4 md:px-6 flex items-center justify-between shadow-sm transition-colors duration-200">
      {/* Mobile & Left Section */}
      <div className="flex items-center gap-4">
        {/* Mobile Toggle Trigger */}
        <button
          onClick={onToggleMobile}
          className="md:hidden p-2 rounded-lg text-slate-600 dark:text-slate-350 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Open Menu"
        >
          <RiMenuLine className="w-5 h-5" />
        </button>
        {/* Page Title */}
        <h1 className="text-base md:text-lg font-bold text-slate-800 dark:text-white tracking-tight truncate">
          {pageTitle}
        </h1>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Theme Toggle Trigger */}
        <div className="relative">
          <button
            onClick={() => setThemeDropdownOpen(!themeDropdownOpen)}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-350 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200 flex items-center justify-center cursor-pointer"
            title="Switch Theme"
          >
            {getThemeIcon()}
          </button>

          {themeDropdownOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setThemeDropdownOpen(false)} />
              <div className="absolute right-0 mt-2.5 w-36 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl dark:shadow-2xl py-1.5 z-50 animate-fade-in text-left">
                <button
                  onClick={() => handleThemeChange('light')}
                  className={`flex w-full items-center gap-2.5 px-3.5 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                    theme === 'light'
                      ? 'text-indigo-650 bg-indigo-50 dark:bg-slate-800'
                      : 'text-slate-600 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <RiSunLine className="w-4 h-4 text-amber-500" />
                  <span>Light</span>
                </button>
                <button
                  onClick={() => handleThemeChange('dark')}
                  className={`flex w-full items-center gap-2.5 px-3.5 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                    theme === 'dark'
                      ? 'text-indigo-650 bg-indigo-50 dark:bg-slate-800'
                      : 'text-slate-600 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <RiMoonLine className="w-4 h-4 text-indigo-400" />
                  <span>Dark</span>
                </button>
                <button
                  onClick={() => handleThemeChange('system')}
                  className={`flex w-full items-center gap-2.5 px-3.5 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                    theme === 'system'
                      ? 'text-indigo-650 bg-indigo-50 dark:bg-slate-800'
                      : 'text-slate-600 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <RiComputerLine className="w-4 h-4 text-slate-400" />
                  <span>System</span>
                </button>
              </div>
            </>
          )}
        </div>

        {/* Notifications Icon */}
        <button
          onClick={() => navigate('/notifications')}
          className="relative p-2 rounded-xl text-slate-600 dark:text-slate-350 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200 cursor-pointer"
          title="View Notifications"
        >
          <RiNotification3Line className="w-[22px] h-[22px]" />
          <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-indigo-600 text-white rounded-full flex items-center justify-center text-[9px] font-bold">
            3
          </span>
        </button>

        <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 mx-1" />

        {/* User Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200 group text-left cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/30 flex items-center justify-center font-bold text-indigo-600 dark:text-indigo-400 shadow-inner group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/50 transition-colors uppercase">
              {user?.name ? user.name.slice(0, 2) : role ? role.charAt(0) : 'U'}
            </div>
            <div className="hidden lg:block min-w-0 pr-1">
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-250 leading-tight truncate">
                {user?.name || user?.email || 'System User'}
              </p>
              <p className="text-xs font-medium text-slate-400 dark:text-slate-500 truncate">
                {ROLE_LABELS[role] || 'Viewer'}
              </p>
            </div>
          </button>

          {/* Dropdown Menu Overlay */}
          {dropdownOpen && (
            <>
              {/* Invisible Close Overlay */}
              <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
              
              <div className="absolute right-0 mt-2.5 w-56 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl dark:shadow-2xl py-2 z-50 animate-fade-in">
                {/* User Header */}
                <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-850">
                  <p className="text-sm font-bold text-slate-800 dark:text-white truncate">
                    {user?.name || 'AssetFlow User'}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                    {user?.email || 'user@assetflow.com'}
                  </p>
                  <span className="inline-block mt-2 px-2 py-0.5 text-[10px] font-bold tracking-wide uppercase rounded bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/30">
                    {ROLE_LABELS[role] || role}
                  </span>
                </div>

                {/* Dropdown Action Items */}
                <div className="p-1">
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      navigate('/notifications');
                    }}
                    className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-slate-600 dark:text-slate-350 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                  >
                    <RiNotification3Line className="w-4 h-4 text-slate-400" />
                    <span>Notifications</span>
                  </button>
                  
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                    }}
                    className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-slate-600 dark:text-slate-350 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                  >
                    <RiSettings4Line className="w-4 h-4 text-slate-400" />
                    <span>Preferences</span>
                  </button>
                </div>

                <div className="border-t border-slate-100 dark:border-slate-850 my-1" />

                {/* Logout Button */}
                <div className="p-1">
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      handleLogout();
                    }}
                    className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-colors font-medium cursor-pointer"
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
