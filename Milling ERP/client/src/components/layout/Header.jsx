import React from 'react';
import { useLocation } from 'react-router-dom';
import { Bell } from 'lucide-react';

const routeTitles = {
  '/': 'Dashboard',
  '/batches': 'Batch Log',
  '/procurement': 'Procurement',
  '/quality': 'Quality Control',
  '/reports': 'Reports',
  '/settings': 'Settings',
  '/login': 'Login',
};

function formatToday() {
  const now = new Date();
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(now);
}

function Header() {
  const location = useLocation();
  const pathname = location.pathname || '/';
  const title = routeTitles[pathname] ?? 'Mill Ops';
  const today = formatToday();

  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-800 bg-[#0f0d0a] px-6">
      <div>
        <h1 className="text-lg font-semibold text-slate-50">
          {title}
        </h1>
        <p className="text-xs text-slate-400">
          {today}
        </p>
      </div>
      <button
        type="button"
        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-800 bg-slate-900/60 text-slate-300 transition-colors hover:border-[#c9a84c] hover:text-[#c9a84c]"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" aria-hidden="true" />
      </button>
    </header>
  );
}

export default Header;