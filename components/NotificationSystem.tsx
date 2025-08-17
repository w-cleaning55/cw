import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  X,
  Check,
  AlertCircle,
  Info,
  AlertTriangle,
  Bell,
  BellRing,
  MessageSquare,
  Phone,
  Mail,
  Clock,
  Trash2,
} from "lucide-react";
import { useTranslation } from "../hooks/useTranslation";
import { useAnimation } from "./AnimationController";

export type NotificationType =
  | "success"
  | "error"
  | "warning"
  | "info"
  | "message"
  | "booking"
  | "payment"
  | "system";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  titleAr: string;
  message: string;
  messageAr: string;
  timestamp: string;
  read: boolean;
  actionable: boolean;
  actions?: NotificationAction[];
  priority: "low" | "medium" | "high" | "urgent";
  category: string;
  categoryAr: string;
  userId?: string;
  autoDismiss?: boolean;
  dismissAfter?: number; // in milliseconds
  persistent?: boolean;
  data?: Record<string, any>;
}

export interface NotificationAction {
  id: string;
  label: string;
  labelAr: string;
  action: (notification: Notification) => void;
  variant?: "default" | "destructive" | "outline" | "secondary";
  icon?: React.ComponentType<{ className?: string }>;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (
    notification: Omit<Notification, "id" | "timestamp" | "read">,
  ) => string;
  removeNotification: (id: string) => void;
  markAsRead: (id: string) => void;
  markAsUnread: (id: string) => void;
  markAllAsRead: () => void;
  clearAllNotifications: () => void;
  getNotificationsByType: (type: NotificationType) => Notification[];
  getNotificationsByPriority: (
    priority: Notification["priority"],
  ) => Notification[];
  subscribe: (callback: (notification: Notification) => void) => () => void;
  settings: NotificationSettings;
  updateSettings: (settings: Partial<NotificationSettings>) => void;
  requestNotificationPermission: () => Promise<boolean>;
}

interface NotificationSettings {
  enabled: boolean;
  soundEnabled: boolean;
  desktopNotifications: boolean;
  showBadges: boolean;
  autoMarkAsRead: boolean;
  maxNotifications: number;
  defaultDismissTime: number;
  types: Record<
    NotificationType,
    {
      enabled: boolean;
      sound: boolean;
      desktop: boolean;
      priority: Notification["priority"];
    }
  >;
}

const defaultSettings: NotificationSettings = {
  enabled: true,
  soundEnabled: true,
  desktopNotifications: true,
  showBadges: true,
  autoMarkAsRead: false,
  maxNotifications: 50,
  defaultDismissTime: 5000,
  types: {
    success: { enabled: true, sound: true, desktop: false, priority: "low" },
    error: { enabled: true, sound: true, desktop: true, priority: "high" },
    warning: { enabled: true, sound: true, desktop: true, priority: "medium" },
    info: { enabled: true, sound: false, desktop: false, priority: "low" },
    message: { enabled: true, sound: true, desktop: true, priority: "medium" },
    booking: { enabled: true, sound: true, desktop: true, priority: "high" },
    payment: { enabled: true, sound: true, desktop: true, priority: "high" },
    system: { enabled: true, sound: false, desktop: true, priority: "medium" },
  },
};

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined,
);

interface NotificationProviderProps {
  children: ReactNode;
  maxNotifications?: number;
  defaultDismissTime?: number;
}

export function NotificationProvider({
  children,
  maxNotifications = 50,
  defaultDismissTime = 5000,
}: NotificationProviderProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [settings, setSettings] =
    useState<NotificationSettings>(defaultSettings);
  const [subscribers, setSubscribers] = useState<
    Set<(notification: Notification) => void>
  >(new Set());

  // Load notifications and settings from localStorage
  useEffect(() => {
    const savedNotifications = localStorage.getItem("app-notifications");
    const savedSettings = localStorage.getItem("notification-settings");

    if (savedNotifications) {
      try {
        setNotifications(JSON.parse(savedNotifications));
      } catch (error) {
        console.error("خطأ في تحميل الإشعارات:", error);
      }
    }

    if (savedSettings) {
      try {
        setSettings({ ...defaultSettings, ...JSON.parse(savedSettings) });
      } catch (error) {
        console.error("خطأ في تحميل إعدادات الإشعارات:", error);
      }
    }
  }, []);

  // Save notifications to localStorage
  useEffect(() => {
    localStorage.setItem("app-notifications", JSON.stringify(notifications));
  }, [notifications]);

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem("notification-settings", JSON.stringify(settings));
  }, [settings]);

  // Auto-dismiss notifications
  useEffect(() => {
    const timers: Record<string, NodeJS.Timeout> = {};

    notifications.forEach((notification) => {
      if (
        notification.autoDismiss &&
        !notification.persistent &&
        !timers[notification.id]
      ) {
        const dismissTime = notification.dismissAfter || defaultDismissTime;
        timers[notification.id] = setTimeout(() => {
          removeNotification(notification.id);
        }, dismissTime);
      }
    });

    return () => {
      Object.values(timers).forEach((timer) => clearTimeout(timer));
    };
  }, [notifications, defaultDismissTime]);

  const addNotification = (
    notificationData: Omit<Notification, "id" | "timestamp" | "read">,
  ): string => {
    const id = `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const timestamp = new Date().toISOString();

    const notification: Notification = {
      ...notificationData,
      id,
      timestamp,
      read: false,
    };

    // Check if type is enabled
    if (!settings.enabled || !settings.types[notification.type]?.enabled) {
      return id;
    }

    setNotifications((prev) => {
      const newNotifications = [notification, ...prev].slice(
        0,
        maxNotifications,
      );
      return newNotifications;
    });

    // Play notification sound
    if (settings.soundEnabled && settings.types[notification.type]?.sound) {
      playNotificationSound(notification.type);
    }

    // Show desktop notification
    if (
      settings.desktopNotifications &&
      settings.types[notification.type]?.desktop &&
      "Notification" in window &&
      Notification.permission === "granted"
    ) {
      new Notification(notification.title, {
        body: notification.message,
        icon: getNotificationIcon(notification.type),
        tag: notification.id,
      });
    }

    // Notify subscribers
    subscribers.forEach((callback) => callback(notification));

    return id;
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  };

  const markAsUnread = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: false } : n)),
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const getNotificationsByType = (type: NotificationType): Notification[] => {
    return notifications.filter((n) => n.type === type);
  };

  const getNotificationsByPriority = (
    priority: Notification["priority"],
  ): Notification[] => {
    return notifications.filter((n) => n.priority === priority);
  };

  const subscribe = (
    callback: (notification: Notification) => void,
  ): (() => void) => {
    setSubscribers((prev) => new Set([...prev, callback]));

    return () => {
      setSubscribers((prev) => {
        const newSet = new Set(prev);
        newSet.delete(callback);
        return newSet;
      });
    };
  };

  const updateSettings = (newSettings: Partial<NotificationSettings>) => {
    setSettings((prev) => {
      const updatedSettings = { ...prev, ...newSettings };
      
      // Request notification permission only when user explicitly enables desktop notifications
      if (newSettings.desktopNotifications && 
          "Notification" in window && 
          Notification.permission === "default") {
        // Only request permission if it hasn't been requested before
        // This will be handled by user interaction in the settings UI
        console.log("Desktop notifications enabled - permission will be requested on user interaction");
      }
      
      return updatedSettings;
    });
  };

  // Method to request notification permission (should be called on user interaction)
  const requestNotificationPermission = async (): Promise<boolean> => {
    if (!("Notification" in window)) {
      console.warn("Notifications not supported in this browser");
      return false;
    }

    if (Notification.permission === "granted") {
      return true;
    }

    if (Notification.permission === "denied") {
      console.warn("Notification permission denied");
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      return permission === "granted";
    } catch (error) {
      console.error("Error requesting notification permission:", error);
      return false;
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const playNotificationSound = (type: NotificationType) => {
    // Create audio context and play appropriate sound
    try {
      const audio = new Audio();
      const soundMap: Record<NotificationType, string> = {
        success: "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAAB...",
        error: "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAAB...",
        warning: "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAAB...",
        info: "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAAB...",
        message: "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAAB...",
        booking: "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAAB...",
        payment: "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAAB...",
        system: "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAAB...",
      };

      // For now, use a simple beep sound
      const context = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
      const oscillator = context.createOscillator();
      const gainNode = context.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(context.destination);

      const frequency = type === "error" ? 400 : type === "warning" ? 600 : 800;
      oscillator.frequency.setValueAtTime(frequency, context.currentTime);
      oscillator.type = "sine";

      gainNode.gain.setValueAtTime(0.1, context.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        context.currentTime + 0.3,
      );

      oscillator.start(context.currentTime);
      oscillator.stop(context.currentTime + 0.3);
    } catch (error) {
      console.warn("تعذر تشغيل صوت الإشعار:", error);
    }
  };

  const getNotificationIcon = (type: NotificationType): string => {
    const iconMap: Record<NotificationType, string> = {
      success: "/icons/success.png",
      error: "/icons/error.png",
      warning: "/icons/warning.png",
      info: "/icons/info.png",
      message: "/icons/message.png",
      booking: "/icons/booking.png",
      payment: "/icons/payment.png",
      system: "/icons/system.png",
    };

    return iconMap[type] || "/icons/default.png";
  };

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    addNotification,
    removeNotification,
    markAsRead,
    markAsUnread,
    markAllAsRead,
    clearAllNotifications,
    getNotificationsByType,
    getNotificationsByPriority,
    subscribe,
    settings,
    updateSettings,
    requestNotificationPermission,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotifications = () => {
  const context = useContext(NotificationContext);

  if (context === undefined) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider",
    );
  }

  return context;
};

// Notification Display Component
interface NotificationDisplayProps {
  position?:
    | "top-right"
    | "top-left"
    | "bottom-right"
    | "bottom-left"
    | "top-center"
    | "bottom-center";
  maxVisible?: number;
  className?: string;
}

export function NotificationDisplay({
  position = "top-right",
  maxVisible = 5,
  className = "",
}: NotificationDisplayProps) {
  const { notifications, removeNotification, markAsRead } = useNotifications();
  const { t, currentLanguage } = useTranslation();
  const { isAnimationEnabled } = useAnimation();

  const visibleNotifications = notifications
    .filter((n) => n.autoDismiss || n.persistent)
    .slice(0, maxVisible);

  const positionClasses = {
    "top-right": "top-4 right-4",
    "top-left": "top-4 left-4",
    "bottom-right": "bottom-4 right-4",
    "bottom-left": "bottom-4 left-4",
    "top-center": "top-4 left-1/2 transform -translate-x-1/2",
    "bottom-center": "bottom-4 left-1/2 transform -translate-x-1/2",
  };

  const getTypeIcon = (type: NotificationType) => {
    const iconMap = {
      success: Check,
      error: AlertCircle,
      warning: AlertTriangle,
      info: Info,
      message: MessageSquare,
      booking: Bell,
      payment: Phone,
      system: Info,
    };

    return iconMap[type] || Info;
  };

  const getTypeColor = (type: NotificationType) => {
    const colorMap = {
      success: "border-green-200 bg-green-50 text-green-800",
      error: "border-red-200 bg-red-50 text-red-800",
      warning: "border-yellow-200 bg-yellow-50 text-yellow-800",
      info: "border-blue-200 bg-blue-50 text-blue-800",
      message: "border-purple-200 bg-purple-50 text-purple-800",
      booking: "border-indigo-200 bg-indigo-50 text-indigo-800",
      payment: "border-emerald-200 bg-emerald-50 text-emerald-800",
      system: "border-gray-200 bg-gray-50 text-gray-800",
    };

    return colorMap[type] || colorMap.info;
  };

  if (visibleNotifications.length === 0) {
    return null;
  }

  return (
    <div className={`fixed z-50 ${positionClasses[position]} ${className}`}>
      <div className="space-y-2 w-80">
        {visibleNotifications.map((notification) => {
          const Icon = getTypeIcon(notification.type);
          const colorClass = getTypeColor(notification.type);

          return (
            <Card
              key={notification.id}
              className={`${colorClass} shadow-lg transition-all duration-300 ${
                isAnimationEnabled ? "animate-slide-left" : ""
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <Icon className="w-5 h-5 mt-1 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium truncate">
                        {currentLanguage === "ar"
                          ? notification.titleAr
                          : notification.title}
                      </h4>
                      <div className="flex items-center space-x-1 ml-2">
                        {notification.priority === "urgent" && (
                          <Badge variant="destructive" className="text-xs">
                            عاجل
                          </Badge>
                        )}
                        {notification.priority === "high" && (
                          <Badge variant="secondary" className="text-xs">
                            مهم
                          </Badge>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeNotification(notification.id)}
                          className="h-6 w-6 p-0"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {currentLanguage === "ar"
                        ? notification.messageAr
                        : notification.message}
                    </p>

                    {notification.actions && (
                      <div className="flex space-x-2 mt-3">
                        {notification.actions.map((action) => (
                          <Button
                            key={action.id}
                            variant={action.variant || "outline"}
                            size="sm"
                            onClick={() => action.action(notification)}
                            className="text-xs h-7"
                          >
                            {action.icon && (
                              <action.icon className="w-3 h-3 mr-1" />
                            )}
                            {currentLanguage === "ar"
                              ? action.labelAr
                              : action.label}
                          </Button>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-muted-foreground">
                        {new Date(notification.timestamp).toLocaleTimeString(
                          "ar",
                        )}
                      </span>
                      {!notification.read && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => markAsRead(notification.id)}
                          className="text-xs h-6"
                        >
                          تم القراءة
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

// Notification Bell Component
interface NotificationBellProps {
  className?: string;
  showBadge?: boolean;
  onClick?: () => void;
}

export function NotificationBell({
  className = "",
  showBadge = true,
  onClick,
}: NotificationBellProps) {
  const { unreadCount } = useNotifications();
  const hasUnread = unreadCount > 0;

  return (
    <div className={`relative ${className}`}>
      <Button
        variant="ghost"
        size="sm"
        onClick={onClick}
        className={`relative p-2 ${hasUnread ? "text-primary" : ""}`}
      >
        {hasUnread ? (
          <BellRing className="w-5 h-5" />
        ) : (
          <Bell className="w-5 h-5" />
        )}

        {showBadge && unreadCount > 0 && (
          <Badge
            variant="destructive"
            className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs font-bold p-0 min-w-[20px]"
          >
            {unreadCount > 99 ? "99+" : unreadCount}
          </Badge>
        )}
      </Button>
    </div>
  );
}

// Helper hook for easy notification creation
export function useNotify() {
  const { addNotification } = useNotifications();

  const notify = {
    success: (
      title: string,
      message: string,
      titleAr?: string,
      messageAr?: string,
    ) =>
      addNotification({
        type: "success",
        title,
        titleAr: titleAr || title,
        message,
        messageAr: messageAr || message,
        priority: "low",
        category: "General",
        categoryAr: "عام",
        actionable: false,
        autoDismiss: true,
      }),

    error: (
      title: string,
      message: string,
      titleAr?: string,
      messageAr?: string,
    ) =>
      addNotification({
        type: "error",
        title,
        titleAr: titleAr || title,
        message,
        messageAr: messageAr || message,
        priority: "high",
        category: "Error",
        categoryAr: "خطأ",
        actionable: false,
        autoDismiss: true,
      }),

    warning: (
      title: string,
      message: string,
      titleAr?: string,
      messageAr?: string,
    ) =>
      addNotification({
        type: "warning",
        title,
        titleAr: titleAr || title,
        message,
        messageAr: messageAr || message,
        priority: "medium",
        category: "Warning",
        categoryAr: "تحذير",
        actionable: false,
        autoDismiss: true,
      }),

    info: (
      title: string,
      message: string,
      titleAr?: string,
      messageAr?: string,
    ) =>
      addNotification({
        type: "info",
        title,
        titleAr: titleAr || title,
        message,
        messageAr: messageAr || message,
        priority: "low",
        category: "Information",
        categoryAr: "معلومات",
        actionable: false,
        autoDismiss: true,
      }),

    message: (
      title: string,
      message: string,
      titleAr?: string,
      messageAr?: string,
      actions?: NotificationAction[],
    ) =>
      addNotification({
        type: "message",
        title,
        titleAr: titleAr || title,
        message,
        messageAr: messageAr || message,
        priority: "medium",
        category: "Message",
        categoryAr: "رسالة",
        actionable: !!actions,
        actions,
        autoDismiss: false,
        persistent: true,
      }),
  };

  return notify;
}

export default NotificationProvider;
