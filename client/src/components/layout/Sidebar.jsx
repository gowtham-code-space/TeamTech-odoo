import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { ROLES } from '../../utils/constants';
import {
  RiDashboardLine,
  RiBuildingLine,
  RiCpuLine,
  RiExchangeLine,
  RiCalendarCheckLine,
  RiToolsLine,
  RiShieldCheckLine,
  RiPieChartLine,
  RiNotification4Line,
  RiMenuFoldLine,
  RiMenuUnfoldLine,
  RiUserSharedLine,
} from 'react-icons/ri';

const menuItems = [
  { path: '/dashboard', label: 'Dashboard', icon: RiDashboardLine, roles: [ROLES.ADMIN, ROLES.ASSET_MANAGER, ROLES.DEPARTMENT_HEAD, ROLES.EMPLOYEE] },
  { path: '/organization', label: 'Organization', icon: RiBuildingLine, roles: [ROLES.ADMIN, ROLES.ASSET_MANAGER, ROLES.DEPARTMENT_HEAD] },
  { path: '/assets', label: 'Assets', icon: RiCpuLine, roles: [ROLES.ADMIN, ROLES.ASSET_MANAGER, ROLES.DEPARTMENT_HEAD, ROLES.EMPLOYEE] },
  { path: '/allocation', label: 'Allocation', icon: RiExchangeLine, roles: [ROLES.ADMIN, ROLES.ASSET_MANAGER, ROLES.DEPARTMENT_HEAD] },
  { path: '/booking', label: 'Booking', icon: RiCalendarCheckLine, roles: [ROLES.ADMIN, ROLES.ASSET_MANAGER, ROLES.DEPARTMENT_HEAD, ROLES.EMPLOYEE] },
  { path: '/maintenance', label: 'Maintenance', icon: RiToolsLine, roles: [ROLES.ADMIN, ROLES.ASSET_MANAGER, ROLES.DEPARTMENT_HEAD, ROLES.EMPLOYEE] },
  { path: '/audit', label: 'Audit', icon: RiShieldCheckLine, roles: [ROLES.ADMIN, ROLES.ASSET_MANAGER] },
  { path: '/reports', label: 'Reports', icon: RiPieChartLine, roles: [ROLES.ADMIN, ROLES.ASSET_MANAGER] },
  { path: '/notifications', label: 'Notifications', icon: RiNotification4Line, roles: [ROLES.ADMIN, ROLES.ASSET_MANAGER, ROLES.DEPARTMENT_HEAD, ROLES.EMPLOYEE] },
  { path: '/admin/users', label: 'User Directory', icon: RiUserSharedLine, roles: [ROLES.ADMIN] },
];

export default function Sidebar({ isCollapsed, onToggle, isOpenMobile, onCloseMobile }) {
  const { role } = useAuthStore();

  // Filter menu items by user's role
  const allowedMenuItems = menuItems.filter((item) => item.roles.includes(role));

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white text-slate-700 border-r border-slate-200 transition-all duration-300">
      {/* Brand Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200 h-16 shrink-0">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="bg-gradient-to-tr from-indigo-550 to-violet-550 p-2 rounded-lg text-white font-bold text-lg leading-none shrink-0 shadow-lg shadow-indigo-650/15">
            AF
          </div>
          {(!isCollapsed || isOpenMobile) && (
            <span className="font-extrabold text-lg tracking-tight text-slate-900 transition-opacity duration-300 whitespace-nowrap">
              AssetFlow
            </span>
          )}
        </div>
        {/* Desktop Collapse Trigger */}
        {!isOpenMobile && (
          <button
            onClick={onToggle}
            className="hidden md:flex items-center justify-center p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {isCollapsed ? <RiMenuUnfoldLine className="w-5 h-5" /> : <RiMenuFoldLine className="w-5 h-5" />}
          </button>
        )}
      </div>

      {/* Navigation Menus */}
      <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1.5 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
        {allowedMenuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onCloseMobile}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-3 rounded-xl font-medium text-sm transition-all duration-200 group relative ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-650 shadow-sm border border-indigo-100/50'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-indigo-650' : 'text-slate-450 group-hover:text-slate-700'}`} />
                  {(!isCollapsed || isOpenMobile) ? (
                    <span className="truncate">{item.label}</span>
                  ) : (
                    <span className="absolute left-14 bg-slate-900 text-white text-xs font-semibold px-2.5 py-1.5 rounded-md opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-150 shadow-md border border-slate-800 z-50 whitespace-nowrap">
                      {item.label}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* User Info / Role Footer */}
      {(!isCollapsed || isOpenMobile) && (
        <div className="p-4 border-t border-slate-200 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center font-bold text-indigo-600 shrink-0 uppercase">
              {role ? role.charAt(0) : 'U'}
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest truncate">Current Role</p>
              <p className="text-sm font-bold text-slate-800 truncate">{role || 'Not Logged In'}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (persistent, collapsible) */}
      <div className={`hidden md:block h-screen sticky top-0 shrink-0 ${isCollapsed ? 'w-20' : 'w-64'} transition-all duration-300`}>
        {sidebarContent}
      </div>

      {/* Mobile Drawer (overlay, slide-out) */}
      {isOpenMobile && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onCloseMobile} />
          {/* Menu Drawer */}
          <div className="relative w-64 max-w-xs h-full animate-slide-in-left">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
