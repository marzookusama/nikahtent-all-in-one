import React from 'react';
import { Heart, Store, ShieldCheck, Briefcase } from 'lucide-react';
import { AppViewMode } from './Header';

interface MobileFrameWrapperProps {
  isMobileFrame: boolean;
  currentView: AppViewMode;
  onViewChange: (view: AppViewMode) => void;
  children: React.ReactNode;
}

export const MobileFrameWrapper: React.FC<MobileFrameWrapperProps> = ({
  isMobileFrame,
  currentView,
  onViewChange,
  children
}) => {
  if (!isMobileFrame) {
    return <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">{children}</main>;
  }

  return (
    <div className="py-6 px-2 flex justify-center bg-slate-900/10 dark:bg-black/30 min-h-screen">
      {/* Smartphone Chassis Frame */}
      <div className="relative w-full max-w-[420px] h-[890px] bg-white dark:bg-slate-950 rounded-[48px] shadow-2xl border-[10px] border-slate-900 dark:border-slate-800 flex flex-col overflow-hidden ring-1 ring-white/20">
        {/* Dynamic Island / Speaker Notch */}
        <div className="h-7 w-full bg-slate-900 dark:bg-slate-900 flex items-center justify-center shrink-0 z-50">
          <div className="w-24 h-4 rounded-full bg-black flex items-center justify-end px-3">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-800" />
          </div>
        </div>

        {/* Scrollable Mobile Body */}
        <div className="flex-1 overflow-y-auto px-3.5 pt-3 pb-20">
          {children}
        </div>

        {/* Ergonomic Mobile Bottom Tab Bar (Natural Thumb Zone) */}
        <div className="absolute bottom-0 inset-x-0 h-16 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 grid grid-cols-4 items-center px-1 z-40">
          <button
            onClick={() => onViewChange('matrimony')}
            className={`flex flex-col items-center justify-center h-full transition-colors ${
              currentView === 'matrimony'
                ? 'text-emerald-700 dark:text-emerald-400 font-bold'
                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
            }`}
          >
            <Heart className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">Matrimony</span>
          </button>

          <button
            onClick={() => onViewChange('vendors')}
            className={`flex flex-col items-center justify-center h-full transition-colors ${
              currentView === 'vendors'
                ? 'text-emerald-700 dark:text-emerald-400 font-bold'
                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
            }`}
          >
            <Store className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">Vendors</span>
          </button>

          <button
            onClick={() => onViewChange('admin')}
            className={`flex flex-col items-center justify-center h-full transition-colors ${
              currentView === 'admin'
                ? 'text-amber-600 dark:text-amber-400 font-bold'
                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">Admin</span>
          </button>

          <button
            onClick={() => onViewChange('vendor_dashboard')}
            className={`flex flex-col items-center justify-center h-full transition-colors ${
              currentView === 'vendor_dashboard'
                ? 'text-teal-700 dark:text-teal-400 font-bold'
                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
            }`}
          >
            <Briefcase className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">Studio</span>
          </button>
        </div>

        {/* iOS Home Indicator Bar */}
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-32 h-1 bg-slate-400 dark:bg-slate-600 rounded-full z-50 pointer-events-none" />
      </div>
    </div>
  );
};
