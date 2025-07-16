"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

type NotificationType = "info" | "success" | "warning" | "error";

interface Notification {
  id: number;
  type: NotificationType;
  message: string;
  createdAt: string;
}

interface NotificationContextValue {
  notifications: Notification[];
  notify: (type: NotificationType, message: string) => void;
  clear: () => void;
}

const NotificationContext = createContext<NotificationContextValue | undefined>(
  undefined
);

let counter = 0;

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const notify = (type: NotificationType, message: string) => {
    const newNotification: Notification = {
      id: ++counter,
      type,
      message,
      createdAt: new Date().toISOString(), // solo se usará en cliente
    };
    setNotifications((prev) => [newNotification, ...prev]);
  };

  const clear = () => {
    setNotifications([]);
  };

  const contextValue = { notifications, notify, clear };

  return (
    <NotificationContext.Provider value={contextValue}>
      {mounted ? children : null}
    </NotificationContext.Provider>
  );
}

export function useNotify(): (type: NotificationType, message: string) => void {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotify debe usarse dentro de NotificationProvider");
  }
  return context.notify;
}

export function useNotifications(): Notification[] {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications debe usarse dentro de NotificationProvider");
  }
  return context.notifications;
}

export function useClearNotifications(): () => void {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useClearNotifications debe usarse dentro de NotificationProvider");
  }
  return context.clear;
}
