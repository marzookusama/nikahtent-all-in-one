import React from 'react';
import { 
  Heart, 
  Store, 
  ShieldCheck, 
  Briefcase, 
  Bell, 
  Smartphone, 
  Monitor, 
  Sparkles, 
  UserCheck
} from 'lucide-react';
import { SystemNotification } from '../types';

export type AppViewMode = 'matrimony' | 'vendors' | 'admin' | 'vendor_dashboard';

interface HeaderProps {
  currentView: AppViewMode;
  onViewChange: (view: AppViewMode) => void;
  isMobileFrame: boolean;
  onToggleMobileFrame: () => void;
  notifications: SystemNotification[];
  onOpenNotifications: () => void;
  unreadCount: number;
  userRole: 'member' | 'admin' | 'vendor';
  onRoleChange: (role: 'member' | 'admin' | 'vendor') => void;
  onOpenProfileCreator: () => void;
  onOpenTierModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onViewChange,
  isMobileFrame,
  onToggleMobileFrame,
  notifications,
  onOpenNotifications,
  unreadCount,
  userRole,
  onRoleChange,
  onOpenProfileCreator,
  onOpenTierModal
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-2">
        {/* Zone 1: Single element brand wordmark */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => onViewChange('matrimony')}
            className="flex items-center gap-2 group text-left"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-700 to-teal-800 flex items-center justify-center text-white shadow-sm shadow-emerald-900/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white font-['Plus_Jakarta_Sans'] flex items-center gap-1">
                Nikahtent
                <span className="text-xs font-semibold px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 ml-1">
                  LK
                </span>
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Navigation Hub Links */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl">
          <button
            onClick={() => {
              onViewChange('matrimony');
              if (userRole !== 'member') onRoleChange('member');
            }}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap ${
              currentView === 'matrimony'
                ? 'bg-white dark:bg-slate-800 text-emerald-700 dark:text-emerald-400 shadow-sm font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Heart className="w-3.5 h-3.5" />
            <span>Matrimony Hub</span>
          </button>

          <button
            onClick={() => {
              onViewChange('vendors');
              if (userRole !== 'member') onRoleChange('member');
            }}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap ${
              currentView === 'vendors'
                ? 'bg-white dark:bg-slate-800 text-emerald-700 dark:text-emerald-400 shadow-sm font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Store className="w-3.5 h-3.5" />
            <span>Wedding Vendors</span>
          </button>

          <button
            onClick={() => {
              onViewChange('admin');
              onRoleChange('admin');
            }}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap ${
              currentView === 'admin'
                ? 'bg-white dark:bg-slate-800 text-amber-600 dark:text-amber-400 shadow-sm font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Admin Web Portal</span>
          </button>

          <button
            onClick={() => {
              onViewChange('vendor_dashboard');
              onRoleChange('vendor');
            }}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap ${
              currentView === 'vendor_dashboard'
                ? 'bg-white dark:bg-slate-800 text-teal-700 dark:text-teal-400 shadow-sm font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Vendor Studio</span>
          </button>
        </nav>

        {/* Zone 3: Primary Actions & Device Simulator Toggle */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Notifications Trigger */}
          <button
            onClick={onOpenNotifications}
            className="relative p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
            title="Notifications & Image Approval Updates"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-950 animate-pulse" />
            )}
          </button>

          {/* Role Switcher Pill */}
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 dark:bg-slate-900 rounded-lg text-xs">
            <span className="text-slate-500">Role:</span>
            <select
              value={userRole}
              onChange={(e) => {
                const newRole = e.target.value as 'member' | 'admin' | 'vendor';
                onRoleChange(newRole);
                if (newRole === 'admin') onViewChange('admin');
                else if (newRole === 'vendor') onViewChange('vendor_dashboard');
                else onViewChange('matrimony');
              }}
              className="bg-transparent font-medium text-slate-800 dark:text-slate-200 outline-none cursor-pointer"
            >
              <option value="member" className="dark:bg-slate-900">Member / Seeker</option>
              <option value="admin" className="dark:bg-slate-900">Admin Moderator</option>
              <option value="vendor" className="dark:bg-slate-900">Registered Vendor</option>
            </select>
          </div>

          {/* Desktop vs Mobile Device View Simulator Toggle */}
          <button
            onClick={onToggleMobileFrame}
            className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
              isMobileFrame
                ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
                : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900'
            }`}
            title="Toggle between Responsive Web and Mobile Touch Frame"
          >
            {isMobileFrame ? <Monitor className="w-3.5 h-3.5" /> : <Smartphone className="w-3.5 h-3.5" />}
            <span>{isMobileFrame ? 'Exit Mobile Frame' : 'Mobile Preview'}</span>
          </button>

          {/* Register / Profile CTA */}
          <button
            onClick={onOpenProfileCreator}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-sm transition-colors whitespace-nowrap"
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Create Profile</span>
          </button>
        </div>
      </div>

      {/* Mobile Secondary Navigation Row (for viewports < 768px) */}
      <div className="md:hidden border-t border-slate-100 dark:border-slate-800 px-4 py-2 flex items-center justify-between gap-1 overflow-x-auto text-xs">
        <button
          onClick={() => {
            onViewChange('matrimony');
            onRoleChange('member');
          }}
          className={`px-3 py-1 rounded-full whitespace-nowrap font-medium ${
            currentView === 'matrimony' ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300' : 'text-slate-600'
          }`}
        >
          Matrimony
        </button>
        <button
          onClick={() => {
            onViewChange('vendors');
            onRoleChange('member');
          }}
          className={`px-3 py-1 rounded-full whitespace-nowrap font-medium ${
            currentView === 'vendors' ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300' : 'text-slate-600'
          }`}
        >
          Wedding Vendors
        </button>
        <button
          onClick={() => {
            onViewChange('admin');
            onRoleChange('admin');
          }}
          className={`px-3 py-1 rounded-full whitespace-nowrap font-medium ${
            currentView === 'admin' ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300' : 'text-slate-600'
          }`}
        >
          Admin Portal
        </button>
        <button
          onClick={() => {
            onViewChange('vendor_dashboard');
            onRoleChange('vendor');
          }}
          className={`px-3 py-1 rounded-full whitespace-nowrap font-medium ${
            currentView === 'vendor_dashboard' ? 'bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300' : 'text-slate-600'
          }`}
        >
          Vendor Studio
        </button>
      </div>
    </header>
  );
};
