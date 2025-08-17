'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  Bell, 
  Mail, 
  Phone, 
  MessageSquare, 
  Send, 
  Globe,
  Settings,
  Volume2,
  VolumeX,
  CheckCircle,
  AlertTriangle,
  Save,
  RefreshCw
} from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { useNotify } from '../NotificationSystem';

interface NotificationChannel {
  id: string;
  name: string;
  nameAr: string;
  enabled: boolean;
  config: Record<string, any>;
  testable: boolean;
}

interface NotificationSettings {
  general: {
    enableNotifications: boolean;
    defaultLanguage: 'ar' | 'en';
    timezone: string;
    quietHours: {
      enabled: boolean;
      start: string;
      end: string;
    };
  };
  channels: {
    email: NotificationChannel;
    sms: NotificationChannel;
    whatsapp: NotificationChannel;
    telegram: NotificationChannel;
    push: NotificationChannel;
  };
  events: {
    newBooking: {
      enabled: boolean;
      channels: string[];
      priority: 'low' | 'medium' | 'high' | 'urgent';
      template: string;
    };
    paymentReceived: {
      enabled: boolean;
      channels: string[];
      priority: 'low' | 'medium' | 'high' | 'urgent';
      template: string;
    };
    customerMessage: {
      enabled: boolean;
      channels: string[];
      priority: 'low' | 'medium' | 'high' | 'urgent';
      template: string;
    };
    systemAlert: {
      enabled: boolean;
      channels: string[];
      priority: 'low' | 'medium' | 'high' | 'urgent';
      template: string;
    };
  };
  templates: {
    [key: string]: {
      subject: string;
      bodyAr: string;
      bodyEn: string;
    };
  };
}

const defaultSettings: NotificationSettings = {
  general: {
    enableNotifications: true,
    defaultLanguage: 'ar',
    timezone: 'Asia/Riyadh',
    quietHours: {
      enabled: true,
      start: '22:00',
      end: '08:00'
    }
  },
  channels: {
    email: {
      id: 'email',
      name: 'Email',
      nameAr: 'البريد الإلكتروني',
      enabled: true,
      testable: true,
      config: {
        smtpHost: 'smtp.gmail.com',
        smtpPort: 587,
        smtpUser: '',
        smtpPassword: '',
        fromEmail: 'noreply@cleaningworld.sa',
        fromName: 'عالم التنظيف'
      }
    },
    sms: {
      id: 'sms',
      name: 'SMS',
      nameAr: 'الرسائل النصية',
      enabled: false,
      testable: true,
      config: {
        provider: 'twilio',
        apiKey: '',
        apiSecret: '',
        fromNumber: '+966'
      }
    },
    whatsapp: {
      id: 'whatsapp',
      name: 'WhatsApp',
      nameAr: 'واتساب',
      enabled: false,
      testable: true,
      config: {
        apiKey: '',
        webhookUrl: '',
        businessPhone: '+966501234567'
      }
    },
    telegram: {
      id: 'telegram',
      name: 'Telegram',
      nameAr: 'تليجرام',
      enabled: false,
      testable: true,
      config: {
        botToken: '',
        chatId: '',
        adminChatId: ''
      }
    },
    push: {
      id: 'push',
      name: 'Push Notifications',
      nameAr: 'الإشعارات الفورية',
      enabled: true,
      testable: false,
      config: {
        firebaseKey: '',
        vapidKey: ''
      }
    }
  },
  events: {
    newBooking: {
      enabled: true,
      channels: ['email', 'push'],
      priority: 'high',
      template: 'new_booking'
    },
    paymentReceived: {
      enabled: true,
      channels: ['email'],
      priority: 'medium',
      template: 'payment_received'
    },
    customerMessage: {
      enabled: true,
      channels: ['email', 'push'],
      priority: 'medium',
      template: 'customer_message'
    },
    systemAlert: {
      enabled: true,
      channels: ['email', 'telegram'],
      priority: 'urgent',
      template: 'system_alert'
    }
  },
  templates: {
    new_booking: {
      subject: 'حجز جديد - عالم التنظيف',
      bodyAr: 'تم استلام حجز جديد من {customerName} لخدمة {serviceName}.',
      bodyEn: 'New booking received from {customerName} for {serviceName} service.'
    },
    payment_received: {
      subject: 'دفعة جديدة - عالم التنظيف',
      bodyAr: 'تم استلام دفعة بقيمة {amount} من {customerName}.',
      bodyEn: 'Payment of {amount} received from {customerName}.'
    },
    customer_message: {
      subject: 'رسالة عميل جديدة - عالم التنظيف',
      bodyAr: 'رسالة جديدة من {customerName}: {message}',
      bodyEn: 'New message from {customerName}: {message}'
    },
    system_alert: {
      subject: 'تنبيه نظام - عالم التنظيف',
      bodyAr: 'تنبيه نظام: {alertMessage}',
      bodyEn: 'System Alert: {alertMessage}'
    }
  }
};

export default function NotificationSettings() {
  const { t } = useTranslation();
  const notify = useNotify();
  
  const [settings, setSettings] = useState<NotificationSettings>(defaultSettings);
  const [isSaving, setIsSaving] = useState(false);
  const [testingChannel, setTestingChannel] = useState<string | null>(null);

  // تحميل الإعدادات
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await fetch('/api/admin/notification-settings');
        if (response.ok) {
          const data = await response.json();
          setSettings({ ...defaultSettings, ...data });
        }
      } catch (error) {
        console.error('خطأ في تحميل إعدادات الإشعارات:', error);
      }
    };

    loadSettings();
  }, []);

  // حفظ الإعدادات
  const saveSettings = async () => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/admin/notification-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });

      if (response.ok) {
        notify.success('تم الحفظ', 'تم حفظ إعدادات الإشعارات بنجاح');
      } else {
        throw new Error('فشل في الحفظ');
      }
    } catch (error) {
      console.error('خطأ في حفظ الإعدادات:', error);
      notify.error('خطأ في الحفظ', 'فشل في حفظ الإعدادات');
    } finally {
      setIsSaving(false);
    }
  };

  // اختبار قناة إشعار
  const testChannel = async (channelId: string) => {
    setTestingChannel(channelId);
    
    try {
      const response = await fetch(`/api/notifications/${channelId}/test`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          config: settings.channels[channelId as keyof typeof settings.channels].config
        })
      });

      if (response.ok) {
        notify.success('اختبار ناجح', `تم إرسال الاختبار عبر ${settings.channels[channelId as keyof typeof settings.channels].nameAr}`);
      } else {
        throw new Error('فشل الاختبار');
      }
    } catch (error) {
      console.error('خطأ في الاختبار:', error);
      notify.error('فشل الاختبار', 'تأكد من إعدادات القناة');
    } finally {
      setTestingChannel(null);
    }
  };

  // تحديث إعدادات عامة
  const updateGeneralSetting = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      general: {
        ...prev.general,
        [key]: value
      }
    }));
  };

  // تحديث قناة
  const updateChannel = (channelId: string, updates: Partial<NotificationChannel>) => {
    setSettings(prev => ({
      ...prev,
      channels: {
        ...prev.channels,
        [channelId]: {
          ...prev.channels[channelId as keyof typeof prev.channels],
          ...updates
        }
      }
    }));
  };

  // تحديث إعدادات القناة
  const updateChannelConfig = (channelId: string, configKey: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      channels: {
        ...prev.channels,
        [channelId]: {
          ...prev.channels[channelId as keyof typeof prev.channels],
          config: {
            ...prev.channels[channelId as keyof typeof prev.channels].config,
            [configKey]: value
          }
        }
      }
    }));
  };

  // تحديث حدث
  const updateEvent = (eventId: string, updates: any) => {
    setSettings(prev => ({
      ...prev,
      events: {
        ...prev.events,
        [eventId]: {
          ...prev.events[eventId as keyof typeof prev.events],
          ...updates
        }
      }
    }));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'destructive';
      case 'high': return 'secondary';
      case 'medium': return 'default';
      case 'low': return 'outline';
      default: return 'default';
    }
  };

  const getChannelIcon = (channelId: string) => {
    switch (channelId) {
      case 'email': return Mail;
      case 'sms': return Phone;
      case 'whatsapp': return MessageSquare;
      case 'telegram': return Send;
      case 'push': return Bell;
      default: return Bell;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">إعدادات الإشعارات</h1>
          <p className="text-muted-foreground">
            إدارة وتخصيص نظام الإشعارات والتنبيهات
          </p>
        </div>
        <Button onClick={saveSettings} disabled={isSaving}>
          {isSaving ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              جارٍ الحفظ...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              حفظ الإعدادات
            </>
          )}
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">
            <Settings className="w-4 h-4 mr-2" />
            عام
          </TabsTrigger>
          <TabsTrigger value="channels">
            <Globe className="w-4 h-4 mr-2" />
            القنوات
          </TabsTrigger>
          <TabsTrigger value="events">
            <Bell className="w-4 h-4 mr-2" />
            الأحداث
          </TabsTrigger>
          <TabsTrigger value="templates">
            <Mail className="w-4 h-4 mr-2" />
            القوالب
          </TabsTrigger>
        </TabsList>

        {/* الإعدادات العامة */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>الإعدادات العامة</CardTitle>
              <CardDescription>
                الإعدادات الأساسية لنظام الإشعارات
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="enable-notifications">تفعيل الإشعارات</Label>
                  <p className="text-sm text-muted-foreground">
                    تشغيل أو إيقاف نظام الإشعارات بالكامل
                  </p>
                </div>
                <Switch
                  id="enable-notifications"
                  checked={settings.general.enableNotifications}
                  onCheckedChange={(checked) => updateGeneralSetting('enableNotifications', checked)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="default-language">اللغة الافتراضية</Label>
                  <Select 
                    value={settings.general.defaultLanguage} 
                    onValueChange={(value) => updateGeneralSetting('defaultLanguage', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ar">العربية</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timezone">المنطقة الزمنية</Label>
                  <Select 
                    value={settings.general.timezone} 
                    onValueChange={(value) => updateGeneralSetting('timezone', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Asia/Riyadh">السعودية (GMT+3)</SelectItem>
                      <SelectItem value="Asia/Dubai">الإمارا�� (GMT+4)</SelectItem>
                      <SelectItem value="Asia/Kuwait">الكويت (GMT+3)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="quiet-hours">ساعات الهدوء</Label>
                  <Switch
                    id="quiet-hours"
                    checked={settings.general.quietHours.enabled}
                    onCheckedChange={(checked) => 
                      updateGeneralSetting('quietHours', { ...settings.general.quietHours, enabled: checked })
                    }
                  />
                </div>

                {settings.general.quietHours.enabled && (
                  <div className="grid grid-cols-2 gap-4 pl-6">
                    <div className="space-y-2">
                      <Label htmlFor="quiet-start">بداية الهدوء</Label>
                      <Input
                        id="quiet-start"
                        type="time"
                        value={settings.general.quietHours.start}
                        onChange={(e) => 
                          updateGeneralSetting('quietHours', { 
                            ...settings.general.quietHours, 
                            start: e.target.value 
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="quiet-end">نهاية الهدوء</Label>
                      <Input
                        id="quiet-end"
                        type="time"
                        value={settings.general.quietHours.end}
                        onChange={(e) => 
                          updateGeneralSetting('quietHours', { 
                            ...settings.general.quietHours, 
                            end: e.target.value 
                          })
                        }
                      />
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* القنوات */}
        <TabsContent value="channels">
          <div className="space-y-4">
            {Object.entries(settings.channels).map(([channelId, channel]) => {
              const IconComponent = getChannelIcon(channelId);
              
              return (
                <Card key={channelId}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <IconComponent className="w-5 h-5" />
                        <div>
                          <CardTitle className="text-lg">{channel.nameAr}</CardTitle>
                          <CardDescription>{channel.name}</CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {channel.testable && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => testChannel(channelId)}
                            disabled={testingChannel === channelId || !channel.enabled}
                          >
                            {testingChannel === channelId ? (
                              <>
                                <RefreshCw className="w-4 h-4 mr-1 animate-spin" />
                                اختبار...
                              </>
                            ) : (
                              <>
                                <Send className="w-4 h-4 mr-1" />
                                اختبار
                              </>
                            )}
                          </Button>
                        )}
                        <Switch
                          checked={channel.enabled}
                          onCheckedChange={(checked) => updateChannel(channelId, { enabled: checked })}
                        />
                      </div>
                    </div>
                  </CardHeader>
                  
                  {channel.enabled && (
                    <CardContent className="space-y-4">
                      {/* إعدادات البريد الإلكتروني */}
                      {channelId === 'email' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>خادم SMTP</Label>
                            <Input
                              value={channel.config.smtpHost}
                              onChange={(e) => updateChannelConfig(channelId, 'smtpHost', e.target.value)}
                              placeholder="smtp.gmail.com"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>منفذ SMTP</Label>
                            <Input
                              type="number"
                              value={channel.config.smtpPort}
                              onChange={(e) => updateChannelConfig(channelId, 'smtpPort', e.target.value)}
                              placeholder="587"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>اسم المستخدم</Label>
                            <Input
                              value={channel.config.smtpUser}
                              onChange={(e) => updateChannelConfig(channelId, 'smtpUser', e.target.value)}
                              placeholder="username@gmail.com"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>كلمة المرور</Label>
                            <Input
                              type="password"
                              value={channel.config.smtpPassword}
                              onChange={(e) => updateChannelConfig(channelId, 'smtpPassword', e.target.value)}
                              placeholder="كلمة مرور التطبيق"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>البريد المُرسِل</Label>
                            <Input
                              value={channel.config.fromEmail}
                              onChange={(e) => updateChannelConfig(channelId, 'fromEmail', e.target.value)}
                              placeholder="noreply@cleaningworld.sa"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>اسم المُرسِل</Label>
                            <Input
                              value={channel.config.fromName}
                              onChange={(e) => updateChannelConfig(channelId, 'fromName', e.target.value)}
                              placeholder="عالم التنظيف"
                            />
                          </div>
                        </div>
                      )}

                      {/* إعدادات SMS */}
                      {channelId === 'sms' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>مزود الخدمة</Label>
                            <Select 
                              value={channel.config.provider} 
                              onValueChange={(value) => updateChannelConfig(channelId, 'provider', value)}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="twilio">Twilio</SelectItem>
                                <SelectItem value="unifonic">Unifonic</SelectItem>
                                <SelectItem value="msegat">Msegat</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>مفتاح API</Label>
                            <Input
                              type="password"
                              value={channel.config.apiKey}
                              onChange={(e) => updateChannelConfig(channelId, 'apiKey', e.target.value)}
                              placeholder="مفتاح API"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>الرقم المُرسِل</Label>
                            <Input
                              value={channel.config.fromNumber}
                              onChange={(e) => updateChannelConfig(channelId, 'fromNumber', e.target.value)}
                              placeholder="+966501234567"
                            />
                          </div>
                        </div>
                      )}

                      {/* إعدادات WhatsApp */}
                      {channelId === 'whatsapp' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>مفتاح API</Label>
                            <Input
                              type="password"
                              value={channel.config.apiKey}
                              onChange={(e) => updateChannelConfig(channelId, 'apiKey', e.target.value)}
                              placeholder="مفتاح WhatsApp Business API"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>رقم الأعمال</Label>
                            <Input
                              value={channel.config.businessPhone}
                              onChange={(e) => updateChannelConfig(channelId, 'businessPhone', e.target.value)}
                              placeholder="+966501234567"
                            />
                          </div>
                          <div className="space-y-2 md:col-span-2">
                            <Label>رابط Webhook</Label>
                            <Input
                              value={channel.config.webhookUrl}
                              onChange={(e) => updateChannelConfig(channelId, 'webhookUrl', e.target.value)}
                              placeholder="https://yourapp.com/api/whatsapp/webhook"
                            />
                          </div>
                        </div>
                      )}

                      {/* إعدادات Telegram */}
                      {channelId === 'telegram' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>رمز البوت</Label>
                            <Input
                              type="password"
                              value={channel.config.botToken}
                              onChange={(e) => updateChannelConfig(channelId, 'botToken', e.target.value)}
                              placeholder="123456789:ABCdefGhiJklMnoPqrsTuvWxyz"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>معرف المحادثة</Label>
                            <Input
                              value={channel.config.chatId}
                              onChange={(e) => updateChannelConfig(channelId, 'chatId', e.target.value)}
                              placeholder="-1001234567890"
                            />
                          </div>
                        </div>
                      )}
                    </CardContent>
                  )}
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* الأحداث */}
        <TabsContent value="events">
          <div className="space-y-4">
            {Object.entries(settings.events).map(([eventId, event]) => (
              <Card key={eventId}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>
                        {eventId === 'newBooking' ? 'حجز جديد' : 
                         eventId === 'paymentReceived' ? 'دفعة مستلمة' :
                         eventId === 'customerMessage' ? 'رسالة عم��ل' :
                         eventId === 'systemAlert' ? 'تنبيه نظام' : eventId}
                      </CardTitle>
                      <CardDescription>
                        إعدادات إشعارات هذا الحدث
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={getPriorityColor(event.priority)}>
                        {event.priority === 'urgent' ? 'عاجل' :
                         event.priority === 'high' ? 'مرتفع' :
                         event.priority === 'medium' ? 'متوسط' : 'منخفض'}
                      </Badge>
                      <Switch
                        checked={event.enabled}
                        onCheckedChange={(checked) => updateEvent(eventId, { enabled: checked })}
                      />
                    </div>
                  </div>
                </CardHeader>
                
                {event.enabled && (
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>الأولوية</Label>
                      <Select 
                        value={event.priority} 
                        onValueChange={(value) => updateEvent(eventId, { priority: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">منخفض</SelectItem>
                          <SelectItem value="medium">متوسط</SelectItem>
                          <SelectItem value="high">مرتفع</SelectItem>
                          <SelectItem value="urgent">عاجل</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>القنوات المُفعّلة</Label>
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(settings.channels).map(([channelId, channel]) => {
                          const IconComponent = getChannelIcon(channelId);
                          const isSelected = event.channels.includes(channelId);
                          
                          return (
                            <Button
                              key={channelId}
                              variant={isSelected ? "default" : "outline"}
                              size="sm"
                              disabled={!channel.enabled}
                              onClick={() => {
                                const newChannels = isSelected
                                  ? event.channels.filter(c => c !== channelId)
                                  : [...event.channels, channelId];
                                updateEvent(eventId, { channels: newChannels });
                              }}
                            >
                              <IconComponent className="w-4 h-4 mr-1" />
                              {channel.nameAr}
                            </Button>
                          );
                        })}
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* القوالب */}
        <TabsContent value="templates">
          <div className="space-y-4">
            {Object.entries(settings.templates).map(([templateId, template]) => (
              <Card key={templateId}>
                <CardHeader>
                  <CardTitle>
                    قالب: {templateId === 'new_booking' ? 'حجز جديد' : 
                            templateId === 'payment_received' ? 'دفعة مستلمة' :
                            templateId === 'customer_message' ? 'رسالة عميل' :
                            templateId === 'system_alert' ? 'تنبيه نظام' : templateId}
                  </CardTitle>
                  <CardDescription>
                    تخصيص محتوى الرسائل والإشعارات
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>موضوع الرسالة</Label>
                    <Input
                      value={template.subject}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        templates: {
                          ...prev.templates,
                          [templateId]: {
                            ...prev.templates[templateId],
                            subject: e.target.value
                          }
                        }
                      }))}
                      placeholder="موضوع الرسالة"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>المحتوى (عربي)</Label>
                      <Textarea
                        value={template.bodyAr}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          templates: {
                            ...prev.templates,
                            [templateId]: {
                              ...prev.templates[templateId],
                              bodyAr: e.target.value
                            }
                          }
                        }))}
                        placeholder="محتوى الرسالة بالعربية"
                        rows={4}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>المحتوى (إنجليزي)</Label>
                      <Textarea
                        value={template.bodyEn}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          templates: {
                            ...prev.templates,
                            [templateId]: {
                              ...prev.templates[templateId],
                              bodyEn: e.target.value
                            }
                          }
                        }))}
                        placeholder="Message content in English"
                        rows={4}
                      />
                    </div>
                  </div>

                  <div className="text-xs text-muted-foreground">
                    <p className="mb-1">المتغيرات المتاحة:</p>
                    <div className="flex flex-wrap gap-1">
                      <Badge variant="outline" className="text-xs">{'{customerName}'}</Badge>
                      <Badge variant="outline" className="text-xs">{'{serviceName}'}</Badge>
                      <Badge variant="outline" className="text-xs">{'{amount}'}</Badge>
                      <Badge variant="outline" className="text-xs">{'{message}'}</Badge>
                      <Badge variant="outline" className="text-xs">{'{date}'}</Badge>
                      <Badge variant="outline" className="text-xs">{'{time}'}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
