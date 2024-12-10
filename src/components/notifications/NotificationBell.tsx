import React from 'react';
import { Bell } from 'lucide-react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../../lib/firebase/config';
import { NotificationService } from '../../services/NotificationService';
import { useAuthContext } from '../../contexts/AuthContext';

interface Notification {
  id?: string;
  title: string;
  message: string;
  createdAt: Date;
  read: boolean;
}

export default function NotificationBell() {
  const { user } = useAuthContext();
  const [notifications, setNotifications] = React.useState<Notification[]>([]);
  const [isOpen, setIsOpen] = React.useState(false);

  React.useEffect(() => {
    if (!user) return;

    const loadNotifications = async () => {
      try {
        const userNotifications = await NotificationService.getUserNotifications(user.uid);
        setNotifications(userNotifications);
      } catch (error) {
        console.error('Error loading notifications:', error);
      }
    };

    loadNotifications();

    // Set up real-time updates for notifications
    const notificationsRef = collection(db, 'notifications');
    const q = query(
      notificationsRef,
      where('userId', '==', user.uid),
      where('read', '==', false)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newNotifications = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Notification[];
      setNotifications(newNotifications);

      // Show toast for new notifications
      snapshot.docChanges().forEach(change => {
        if (change.type === 'added') {
          NotificationService.showToast({
            id: change.doc.id,
            ...change.doc.data()
          } as Notification);
        }
      });
    });

    return () => unsubscribe();
  }, [user]);

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await NotificationService.markAsRead(notificationId);
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        <Bell className="h-6 w-6" />
        {notifications.length > 0 && (
          <span className="absolute -top-1 -right-1 block h-4 w-4 rounded-full bg-red-500 text-xs text-white flex items-center justify-center">
            {notifications.length}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg py-1 z-50">
          <div className="px-4 py-2 border-b border-gray-200">
            <h3 className="text-sm font-medium text-gray-900">Notificações</h3>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-4 py-6 text-center text-gray-500">
                Nenhuma notificação
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="px-4 py-3 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {notification.title}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(notification.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <button
                      onClick={() => notification.id && handleMarkAsRead(notification.id)}
                      className="text-xs text-indigo-600 hover:text-indigo-900"
                    >
                      Marcar como lida
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
