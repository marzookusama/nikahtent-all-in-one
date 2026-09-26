import React from 'react';
import { X, Bell, CheckCircle2, AlertTriangle, ShieldCheck, Heart, Trash2 } from 'lucide-react';
import { SystemNotification } from '../types';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: SystemNotification[];
  onMarkAllAsRead: () => void;
  onClearAll: () => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllAsRead,
  onClearAll
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end p-4 sm:p-6 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-md shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden mt-12">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-emerald-600" />
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              System Notifications
            </h3>
            {notifications.some((n) => !n.isRead) && (
              <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                New Alerts
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={onMarkAllAsRead}
              className="text-[11px] text-emerald-600 hover:text-emerald-700 font-medium px-2 py-1 rounded"
            >
              Mark read
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="max-h-[60vh] overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              No notifications right now.
            </div>
          ) : (
            notifications.map((notif) => {
              const isImageStatus = notif.type === 'image_status';
              const isRequest = notif.type === 'connection_request' || notif.type === 'connection_accepted';

              return (
                <div
                  key={notif.id}
                  className={`p-4 transition-colors ${
                    notif.isRead
                      ? 'bg-transparent'
                      : 'bg-emerald-50/40 dark:bg-emerald-950/20'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`p-2 rounded-xl shrink-0 ${
                        isImageStatus
                          ? 'bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-300'
                          : isRequest
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-300'
                          : 'bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-300'
                      }`}
                    >
                      {isImageStatus ? (
                        <ShieldCheck className="w-4 h-4" />
                      ) : isRequest ? (
                        <Heart className="w-4 h-4" />
                      ) : (
                        <AlertTriangle className="w-4 h-4" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {notif.title}
                        </h4>
                        <span className="text-[10px] text-slate-400 shrink-0">
                          {notif.timestamp}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                        {notif.message}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="p-3 bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs">
            <span className="text-slate-400 text-[11px]">
              Automated image status push updates
            </span>
            <button
              onClick={onClearAll}
              className="text-[11px] text-red-500 hover:text-red-600 flex items-center gap-1"
            >
              <Trash2 className="w-3 h-3" />
              <span>Clear</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
