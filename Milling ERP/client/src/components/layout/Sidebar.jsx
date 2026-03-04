import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  ClipboardList,
  Package,
  FlaskConical,
  FileText,
  Settings as SettingsIcon,
  Wheat,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import Button from '../shared/Button.jsx';

const navItems = [
  { label: 'Dashboard', to: '/', icon: LayoutDashboard },
  { label: 'Batch Log', to: '/batches', icon: ClipboardList },
  { label: 'Procurement', to: '/procurement', icon: Package },
  { label: 'Quality Control', to: '/quality', icon: FlaskConical },
  { label: 'Reports', to: '/reports', icon: FileText },
  { label: 'Settings', to: '/settings', icon: SettingsIcon },
];

function Sidebar() {
  const { user, logout } = useAuth();

  return (
    <aside className="flex h-screen w-60 flex-col border-r border-slate-800 bg-[#0f0d0a]">
      <div className="border-b border-[#c9a84c]/40 px-5 py-4">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#c9a84c]/10 text-[#c9a84c]">
            <Wheat className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <div className="text-sm font-semibold tracking-wide text-slate-50">
              Mill Ops
            </div>
            <div className="text-[11px] text-slate-400">
              Grain milling control
            </div>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) =>
                    [
                      'group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                      'text-slate-300 hover:bg-slate-800/80 hover:text-slate-50',
                      isActive
                        ? 'border-l-2 border-[#c9a84c] bg-slate-900 text-[#c9a84c]'
                        : 'border-l-2 border-transparent',
                    ].join(' ')
                  }
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  <span>{item.label}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-slate-800 px-4 py-4">
        <div className="mb-3 flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-800 text-slate-200 text-sm">
            {user?.name?.[0]?.toUpperCase() ?? 'U'}
          </div>
          <div className="min-w-0">
            <div className="truncate text-sm font-medium text-slate-100">
              {user?.name ?? 'User'}
            </div>
            <div className="text-xs capitalize text-slate-400">
              {user?.role ?? 'viewer'}
            </div>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-center text-slate-300 hover:text-slate-50"
          onClick={logout}
        >
          <LogOut className="mr-1 h-4 w-4" />
          Logout
        </Button>
      </div>
    </aside>
  );
}

export default Sidebar;