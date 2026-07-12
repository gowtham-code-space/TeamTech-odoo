import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

export default function MainLayout() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 font-sans antialiased text-slate-600">
      {/* Sidebar Layout */}
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Container */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Navbar */}
        <Navbar onToggleMobile={() => setIsMobileSidebarOpen(true)} />

        {/* Scrollable Workstation Content */}
        <main className="flex-1 overflow-y-auto focus:outline-none p-4 md:p-6 bg-slate-50">
          <div className="max-w-7xl mx-auto w-full h-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
