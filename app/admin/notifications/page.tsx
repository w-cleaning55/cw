'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import { Switch } from '../../../components/ui/switch';
import { Label } from '../../../components/ui/label';
import {
  Bell,
  Settings,
  Mail,
  MessageSquare,
  Calendar,
  DollarSign,
  Users,
  AlertTriangle,
  CheckCircle,
  Info,
  X,
  Volume2,
  VolumeX
} from 'lucide-react';

const notifications = [
  {
    id: 1,
    title: 'حجز جديد',
    message: 'تم استلام حجز جديد من أحمد محمد لخدمة تنظيف المنزل',
    type: 'booking',
    time: '5 دقائق',
    isRead: false,
    priority: 'high'
  },
  {
    id: 2,
    title: 'دفعة جديدة',
    message: 'تم استلام دفعة بقيمة 500 ريال من العميل فاطمة أحمد',
    type: 'payment',
    time: '10 دقائق',
    isRead: false,
    priority: 'medium'
  },
  {
    id: 3,
    title: 'مراجعة جديدة',
    message: 'ترك محمد علي مراجعة 5 نجوم لخدمة تنظيف المكتب',
    type: 'review',
    time: '30 دقيقة',
    isRead: true,
    priority: 'low'
  },
  {
    id: 4,
    title: 'تنبيه النظام',
    message: 'يحتاج النظام إلى تحديث، يرجى مراجعة الإعدادات',
    type: 'system',
    time: 'ساعة واحدة',
    isRead: true,
    priority: 'high'
  }
];

const notificationSettings = [
  {
    id: 'email_bookings',
    title: 'الحجوزات الجديدة',
    description: 'تلقي إشعارات عند وصول حجوزات جديدة',
    email: true,
    push: true,
    sms: false
  },
  {
    id: 'email_payments',
    title: 'المدفوعات',
    description: 'تلقي إشعارات عند استلام المدفوعات',
    email: true,
    push: true,
    sms: true
  },
  {
    id: 'email_reviews',
    title: 'المراجعات والتقييمات',
    description: 'تلقي إشعارات عند وصول مراجعات جديدة',
    email: false,
    push: true,
    sms: false
  },
  {
    id: 'email_system',
    title: 'تنبيهات النظام',
    description: 'تلقي إشعارات حول حالة النظام والتحديثات',
    email: true,
    push: true,
    sms: false
  }
];

export default function NotificationsPage() {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [settings, setSettings] = useState(notificationSettings);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'booking': return <Calendar className="w-5 h-5 text-blue-500" />;
      case 'payment': return <DollarSign className="w-5 h-5 text-green-500" />;
      case 'review': return <MessageSquare className="w-5 h-5 text-yellow-500" />;
      case 'system': return <AlertTriangle className="w-5 h-5 text-red-500" />;
      default: return <Info className="w-5 h-5 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'default';
    }
  };

  const updateSetting = (id: string, type: 'email' | 'push' | 'sms', value: boolean) => {
    setSettings(prev => prev.map(setting => 
      setting.id === id 
        ? { ...setting, [type]: value }
        : setting
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">الإشعارات</h1>
          <p className="text-muted-foreground mt-2">
            إدارة الإشعارات وإعدادات التنبيهات
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <CheckCircle className="w-4 h-4 mr-2" />
            قراءة الكل
          </Button>
          <Button variant="outline" size="sm">
            <X className="w-4 h-4 mr-2" />
            حذف الكل
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* الإشعارات الحديثة */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              الإشعارات الحديثة
            </CardTitle>
            <CardDescription>
              آخر الإشعارات والتنبيهات في النظام
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 border rounded-lg transition-colors ${
                  !notification.isRead 
                    ? 'bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800' 
                    : 'hover:bg-muted'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium">{notification.title}</h4>
                      <div className="flex items-center gap-2">
                        <Badge variant={getPriorityColor(notification.priority)} className="text-xs">
                          {notification.priority === 'high' ? 'عالي' : 
                           notification.priority === 'medium' ? 'متوسط' : 'منخفض'}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          منذ {notification.time}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {notification.message}
                    </p>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        قراءة
                      </Button>
                      <Button variant="ghost" size="sm">
                        <X className="w-3 h-3 mr-1" />
                        حذف
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* إعدادات الإشعارات */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              إع��ادات الإشعارات
            </CardTitle>
            <CardDescription>
              تخصيص تفضيلات الإشعارات
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* إعدادات عامة */}
            <div className="space-y-4">
              <h4 className="font-medium">الإعدادات العامة</h4>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                  <Label htmlFor="sound">الأصوات</Label>
                </div>
                <Switch
                  id="sound"
                  checked={soundEnabled}
                  onCheckedChange={setSoundEnabled}
                />
              </div>
            </div>

            {/* إعدادات التفصيلية */}
            <div className="space-y-4">
              <h4 className="font-medium">أنواع الإشعارات</h4>
              <div className="space-y-4">
                {settings.map((setting) => (
                  <div key={setting.id} className="space-y-3 p-3 border rounded-lg">
                    <div>
                      <div className="font-medium text-sm">{setting.title}</div>
                      <div className="text-xs text-muted-foreground">
                        {setting.description}
                      </div>
                    </div>
                    <div className="flex gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Mail className="w-3 h-3" />
                        <Label htmlFor={`${setting.id}_email`}>ا��بريد</Label>
                        <Switch
                          id={`${setting.id}_email`}
                          checked={setting.email}
                          onCheckedChange={(checked) => 
                            updateSetting(setting.id, 'email', checked)
                          }
                          
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <Bell className="w-3 h-3" />
                        <Label htmlFor={`${setting.id}_push`}>فوري</Label>
                        <Switch
                          id={`${setting.id}_push`}
                          checked={setting.push}
                          onCheckedChange={(checked) => 
                            updateSetting(setting.id, 'push', checked)
                          }
                          
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <MessageSquare className="w-3 h-3" />
                        <Label htmlFor={`${setting.id}_sms`}>SMS</Label>
                        <Switch
                          id={`${setting.id}_sms`}
                          checked={setting.sms}
                          onCheckedChange={(checked) => 
                            updateSetting(setting.id, 'sms', checked)
                          }
                          
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Button className="w-full">
              <Settings className="w-4 h-4 mr-2" />
              حفظ الإعدادات
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
