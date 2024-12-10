import React from 'react';
import { Bell, X, Check, Info, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { useNotificationStore, Notification } from '../store/notificationStore';

export default function NotificationCenter() {
  const [isOpen, setIsOpen] = React.useState(false);
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearAll, getTimeAgo } = useNotificationStore();

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'info':
        return <Info className="h-5 w-5 text-blue-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900"
      >
        <Bell className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg z-50 max-h-[32rem] flex flex-col">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-lg font-semibold">Notificações</h3>
            <div className="flex items-center gap-4">
              <button
                onClick={markAllAsRead}
                className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                <Check className="h-4 w-4" />
                Marcar todas como lidas
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="overflow-y-auto flex-1">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                Nenhuma notificação
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-gray-50 transition-colors ${
                      !notification.read ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => !notification.read && markAsRead(notification.id)}
                  >
                    <div className="flex items-start gap-3">
                      {getIcon(notification.type)}
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{notification.title}</p>
                        <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {getTimeAgo(notification.createdAt)}
                        </p>
                      </div>
                      {!notification.read && (
                        <span className="h-2 w-2 bg-blue-500 rounded-full" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {notifications.length > 0 && (
            <div className="p-4 border-t border-gray-200">
              <button
                onClick={clearAll}
                className="text-sm text-gray-600 hover:text-gray-800"
              >
                Limpar todas as notificações
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}