import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
}

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'read' | 'createdAt'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearAll: () => void;
  getTimeAgo: (date: string) => string;
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      notifications: [],
      unreadCount: 0,
      
      addNotification: (notification) => {
        const newNotification: Notification = {
          ...notification,
          id: crypto.randomUUID(),
          read: false,
          createdAt: new Date().toISOString()
        };
        
        set((state) => ({
          notifications: [newNotification, ...state.notifications],
          unreadCount: state.unreadCount + 1
        }));
      },
      
      markAsRead: (id) => {
        set((state) => ({
          notifications: state.notifications.map((notification) =>
            notification.id === id ? { ...notification, read: true } : notification
          ),
          unreadCount: state.unreadCount - 1
        }));
      },
      
      markAllAsRead: () => {
        set((state) => ({
          notifications: state.notifications.map((notification) => ({
            ...notification,
            read: true
          })),
          unreadCount: 0
        }));
      },
      
      clearAll: () => {
        set({ notifications: [], unreadCount: 0 });
      },
      
      getTimeAgo: (date) => {
        return formatDistanceToNow(new Date(date), {
          addSuffix: true,
          locale: ptBR
        });
      }
    }),
    {
      name: 'notification-storage'
    }
  )
);