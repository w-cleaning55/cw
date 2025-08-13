import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const NOTIFICATIONS_FILE = path.join(DATA_DIR, 'notifications.json');
const SETTINGS_FILE = path.join(DATA_DIR, 'notification-settings.json');

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'booking' | 'payment' | 'review' | 'system';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  isRead: boolean;
  actionUrl?: string;
  metadata?: Record<string, any>;
  createdAt: string;
  readAt?: string;
}

interface NotificationSettings {
  email: {
    bookings: boolean;
    payments: boolean;
    reviews: boolean;
    system: boolean;
  };
  push: {
    bookings: boolean;
    payments: boolean;
    reviews: boolean;
    system: boolean;
  };
  sms: {
    bookings: boolean;
    payments: boolean;
    reviews: boolean;
    system: boolean;
  };
  soundEnabled: boolean;
  quietHours: {
    enabled: boolean;
    start: string;
    end: string;
  };
}

function ensureDataDirectory() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function getDefaultNotifications(): Notification[] {
  return [
    {
      id: 'NOT001',
      title: 'حجز جديد',
      message: 'تم استلام حجز جديد من أحمد محمد لخدمة تنظيف المنزل',
      type: 'booking',
      priority: 'high',
      isRead: false,
      actionUrl: '/admin/bookings/BK001',
      metadata: {
        bookingId: 'BK001',
        customerName: 'أحمد محمد',
        service: 'تنظيف منزل'
      },
      createdAt: '2024-01-15T10:30:00Z'
    },
    {
      id: 'NOT002',
      title: 'دفعة جديدة',
      message: 'تم استلام دفعة بقيمة 500 ريال من العميل فاطمة أحمد',
      type: 'payment',
      priority: 'medium',
      isRead: false,
      actionUrl: '/admin/payments/PAY001',
      metadata: {
        amount: 500,
        customerName: 'فاطمة أحمد',
        paymentId: 'PAY001'
      },
      createdAt: '2024-01-15T09:45:00Z'
    },
    {
      id: 'NOT003',
      title: 'مراجعة جديدة',
      message: 'ترك محمد علي مراجعة 5 نجوم لخدمة تنظيف المكتب',
      type: 'review',
      priority: 'low',
      isRead: true,
      actionUrl: '/admin/reviews/REV001',
      metadata: {
        rating: 5,
        customerName: 'محمد علي',
        service: 'تنظيف مكتب'
      },
      createdAt: '2024-01-15T08:20:00Z',
      readAt: '2024-01-15T09:00:00Z'
    },
    {
      id: 'NOT004',
      title: 'تنبيه النظام',
      message: 'يحتاج النظام إلى تحديث، يرجى مراجعة الإعدادات',
      type: 'system',
      priority: 'high',
      isRead: true,
      actionUrl: '/admin/settings',
      metadata: {
        updateType: 'security',
        version: '2.1.0'
      },
      createdAt: '2024-01-14T16:00:00Z',
      readAt: '2024-01-15T08:00:00Z'
    },
    {
      id: 'NOT005',
      title: 'عميل جديد',
      message: 'انضم عميل جديد: سارة خالد المطيري',
      type: 'info',
      priority: 'medium',
      isRead: true,
      actionUrl: '/admin/customers/CUST004',
      metadata: {
        customerId: 'CUST004',
        customerName: 'سارة خالد المطيري'
      },
      createdAt: '2024-01-14T13:30:00Z',
      readAt: '2024-01-14T14:00:00Z'
    }
  ];
}

function getDefaultSettings(): NotificationSettings {
  return {
    email: {
      bookings: true,
      payments: true,
      reviews: false,
      system: true
    },
    push: {
      bookings: true,
      payments: true,
      reviews: true,
      system: true
    },
    sms: {
      bookings: false,
      payments: true,
      reviews: false,
      system: false
    },
    soundEnabled: true,
    quietHours: {
      enabled: true,
      start: '22:00',
      end: '07:00'
    }
  };
}

export async function GET(request: NextRequest) {
  try {
    ensureDataDirectory();
    
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const isRead = searchParams.get('isRead');
    const limit = searchParams.get('limit');
    const getSettings = searchParams.get('settings') === 'true';
    
    if (getSettings) {
      // Return notification settings
      let settings: NotificationSettings;
      if (fs.existsSync(SETTINGS_FILE)) {
        const fileContent = fs.readFileSync(SETTINGS_FILE, 'utf-8');
        settings = JSON.parse(fileContent);
      } else {
        settings = getDefaultSettings();
        fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2));
      }
      
      return NextResponse.json({
        success: true,
        settings
      });
    }
    
    // Return notifications
    let notifications: Notification[];
    
    if (fs.existsSync(NOTIFICATIONS_FILE)) {
      const fileContent = fs.readFileSync(NOTIFICATIONS_FILE, 'utf-8');
      notifications = JSON.parse(fileContent);
    } else {
      notifications = getDefaultNotifications();
      fs.writeFileSync(NOTIFICATIONS_FILE, JSON.stringify(notifications, null, 2));
    }
    
    // Apply filters
    if (type) {
      notifications = notifications.filter(n => n.type === type);
    }
    if (isRead !== null) {
      const readFilter = isRead === 'true';
      notifications = notifications.filter(n => n.isRead === readFilter);
    }
    
    // Sort by creation date (newest first)
    notifications.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    // Apply limit
    if (limit) {
      const limitNum = parseInt(limit);
      notifications = notifications.slice(0, limitNum);
    }
    
    const unreadCount = notifications.filter(n => !n.isRead).length;
    
    return NextResponse.json({
      success: true,
      notifications,
      total: notifications.length,
      unreadCount
    });
  } catch (error) {
    console.error('Error reading notifications:', error);
    return NextResponse.json(
      { error: 'Failed to load notifications' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    ensureDataDirectory();
    
    const body = await request.json();
    const { action, settings, ...notificationData } = body;
    
    if (action === 'update_settings') {
      // Update notification settings
      const updatedSettings = {
        ...getDefaultSettings(),
        ...settings
      };
      
      fs.writeFileSync(SETTINGS_FILE, JSON.stringify(updatedSettings, null, 2));
      
      return NextResponse.json({
        success: true,
        settings: updatedSettings,
        message: 'Notification settings updated successfully'
      });
    }
    
    // Create new notification
    let notifications: Notification[] = [];
    if (fs.existsSync(NOTIFICATIONS_FILE)) {
      const fileContent = fs.readFileSync(NOTIFICATIONS_FILE, 'utf-8');
      notifications = JSON.parse(fileContent);
    }
    
    const notification: Notification = {
      id: `NOT${String(notifications.length + 1).padStart(3, '0')}`,
      ...notificationData,
      isRead: false,
      createdAt: new Date().toISOString()
    };
    
    notifications.unshift(notification); // Add to beginning
    fs.writeFileSync(NOTIFICATIONS_FILE, JSON.stringify(notifications, null, 2));
    
    return NextResponse.json({ 
      success: true, 
      notification,
      message: 'Notification created successfully' 
    });
  } catch (error) {
    console.error('Error creating notification:', error);
    return NextResponse.json(
      { error: 'Failed to create notification' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    ensureDataDirectory();
    
    const { id, action, ...updates } = await request.json();
    
    if (!fs.existsSync(NOTIFICATIONS_FILE)) {
      return NextResponse.json(
        { error: 'Notifications file not found' },
        { status: 404 }
      );
    }
    
    const fileContent = fs.readFileSync(NOTIFICATIONS_FILE, 'utf-8');
    let notifications: Notification[] = JSON.parse(fileContent);
    
    switch (action) {
      case 'mark_all_read':
        notifications = notifications.map(n => ({
          ...n,
          isRead: true,
          readAt: n.readAt || new Date().toISOString()
        }));
        break;
      
      case 'mark_read':
        if (id) {
          const notificationIndex = notifications.findIndex(n => n.id === id);
          if (notificationIndex !== -1) {
            notifications[notificationIndex] = {
              ...notifications[notificationIndex],
              isRead: true,
              readAt: new Date().toISOString()
            };
          }
        }
        break;
      
      case 'mark_unread':
        if (id) {
          const notificationIndex = notifications.findIndex(n => n.id === id);
          if (notificationIndex !== -1) {
            notifications[notificationIndex] = {
              ...notifications[notificationIndex],
              isRead: false,
              readAt: undefined
            };
          }
        }
        break;
      
      default:
        if (id) {
          const notificationIndex = notifications.findIndex(n => n.id === id);
          if (notificationIndex !== -1) {
            notifications[notificationIndex] = {
              ...notifications[notificationIndex],
              ...updates
            };
          }
        }
        break;
    }
    
    fs.writeFileSync(NOTIFICATIONS_FILE, JSON.stringify(notifications, null, 2));
    
    return NextResponse.json({ 
      success: true, 
      message: 'Notifications updated successfully' 
    });
  } catch (error) {
    console.error('Error updating notifications:', error);
    return NextResponse.json(
      { error: 'Failed to update notifications' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    ensureDataDirectory();
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const action = searchParams.get('action');
    
    if (!fs.existsSync(NOTIFICATIONS_FILE)) {
      return NextResponse.json(
        { error: 'Notifications file not found' },
        { status: 404 }
      );
    }
    
    const fileContent = fs.readFileSync(NOTIFICATIONS_FILE, 'utf-8');
    let notifications: Notification[] = JSON.parse(fileContent);
    
    if (action === 'clear_all') {
      notifications = [];
    } else if (action === 'clear_read') {
      notifications = notifications.filter(n => !n.isRead);
    } else if (id) {
      const initialLength = notifications.length;
      notifications = notifications.filter(n => n.id !== id);
      
      if (notifications.length === initialLength) {
        return NextResponse.json(
          { error: 'Notification not found' },
          { status: 404 }
        );
      }
    } else {
      return NextResponse.json(
        { error: 'Notification ID or action is required' },
        { status: 400 }
      );
    }
    
    fs.writeFileSync(NOTIFICATIONS_FILE, JSON.stringify(notifications, null, 2));
    
    return NextResponse.json({ 
      success: true, 
      message: 'Notifications deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting notifications:', error);
    return NextResponse.json(
      { error: 'Failed to delete notifications' },
      { status: 500 }
    );
  }
}
