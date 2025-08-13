'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Switch } from '../../../components/ui/switch';
import { Textarea } from '../../../components/ui/textarea';
import {
  Settings,
  Server,
  Database,
  Mail,
  Bell,
  Shield,
  Zap,
  HardDrive,
  Wifi,
  Monitor,
  Save,
  RefreshCw,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

const systemStatus = [
  {
    name: 'خادم الويب',
    status: 'نشط',
    uptime: '99.9%',
    lastChecked: '2024-01-15 10:30',
    color: 'green'
  },
  {
    name: 'قاعدة البيانات',
    status: 'نشط',
    uptime: '99.8%',
    lastChecked: '2024-01-15 10:30',
    color: 'green'
  },
  {
    name: 'خدمة البريد',
    status: 'تحذير',
    uptime: '98.5%',
    lastChecked: '2024-01-15 10:29',
    color: 'yellow'
  },
  {
    name: 'النسخ الاحتياطي',
    status: 'نشط',
    uptime: '100%',
    lastChecked: '2024-01-15 06:00',
    color: 'green'
  }
];

export default function SystemSettingsPage() {
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [debugMode, setDebugMode] = useState(false);
  const [autoBackup, setAutoBackup] = useState(true);
  const [cacheEnabled, setCacheEnabled] = useState(true);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'نشط': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'تحذير': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'معطل': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default: return <CheckCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">إعدادات النظام</h1>
          <p className="text-muted-foreground mt-2">
            إدارة الإعدادات العامة ومراقبة حالة النظام
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            تحديث الحالة
          </Button>
          <Button size="sm">
            <Save className="w-4 h-4 mr-2" />
            حفظ الإعدادات
          </Button>
        </div>
      </div>

      {/* حالة النظام */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Monitor className="w-5 h-5" />
            حالة النظام
          </CardTitle>
          <CardDescription>
            مراقبة صحة النظام والخدمات الأساسية
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {systemStatus.map((service, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(service.status)}
                    <span className="font-medium">{service.name}</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">
                    وقت التشغيل: {service.uptime}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    آخر فحص: {service.lastChecked}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ��لإعدادات العامة */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              الإعدادات العامة
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="site-name">اسم الموقع</Label>
              <Input id="site-name" defaultValue="شركة التنظيف العالمي" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="site-description">وصف الموقع</Label>
              <Textarea 
                id="site-description"
                defaultValue="الحل الأمثل لجميع احتياجات التنظيف"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="admin-email">بريد المدير الإلكتروني</Label>
              <Input id="admin-email" type="email" defaultValue="admin@cleaningworld.sa" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="timezone">المنطقة الزمنية</Label>
              <select className="w-full p-2 border rounded" id="timezone">
                <option value="Asia/Riyadh">آسيا/الرياض</option>
                <option value="Asia/Dubai">آسيا/دبي</option>
                <option value="UTC">UTC</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="language">اللغة الافتراضية</Label>
              <select className="w-full p-2 border rounded" id="language">
                <option value="ar">العربية</option>
                <option value="en">English</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* إعدادات الأداء */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              إعدادات الأداء
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="cache">تفعيل التخزين المؤقت</Label>
                <p className="text-sm text-muted-foreground">تحسين سرعة تحميل الصفحات</p>
              </div>
              <Switch
                id="cache"
                checked={cacheEnabled}
                onCheckedChange={setCacheEnabled}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="compression">ضغط البيانات</Label>
                <p className="text-sm text-muted-foreground">تقليل حجم البيانات المنقولة</p>
              </div>
              <Switch id="compression" defaultChecked />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cache-duration">مدة التخزين المؤقت (بالدقائق)</Label>
              <Input id="cache-duration" type="number" defaultValue="60" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="max-file-size">الحد الأقصى لحجم الملف (MB)</Label>
              <Input id="max-file-size" type="number" defaultValue="10" />
            </div>

            <Button variant="outline" className="w-full">
              <RefreshCw className="w-4 h-4 mr-2" />
              مسح التخزين المؤقت
            </Button>
          </CardContent>
        </Card>

        {/* إعدادات قاعدة البيانات */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5" />
              إعدادات قاعدة البيانات
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="auto-backup">النسخ الاحتياطي التلقائي</Label>
                <p className="text-sm text-muted-foreground">نسخ احتياطي يومي تلقائي</p>
              </div>
              <Switch
                id="auto-backup"
                checked={autoBackup}
                onCheckedChange={setAutoBackup}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="backup-time">وقت النسخ الاحتياطي</Label>
              <Input id="backup-time" type="time" defaultValue="02:00" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="backup-retention">الاحتفاظ بالنسخ (أيام)</Label>
              <Input id="backup-retention" type="number" defaultValue="30" />
            </div>

            <div className="flex gap-2">
              <Button variant="outline" className="flex-1">
                <HardDrive className="w-4 h-4 mr-2" />
                ��سخ احتياطي الآن
              </Button>
              <Button variant="outline" className="flex-1">
                <RefreshCw className="w-4 h-4 mr-2" />
                استعادة
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* إعدادات البريد */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5" />
              إعدادات البريد الإلكتروني
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="smtp-host">خادم SMTP</Label>
              <Input id="smtp-host" defaultValue="smtp.gmail.com" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="smtp-port">المنفذ</Label>
                <Input id="smtp-port" type="number" defaultValue="587" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="smtp-security">الأمان</Label>
                <select className="w-full p-2 border rounded" id="smtp-security">
                  <option value="tls">TLS</option>
                  <option value="ssl">SSL</option>
                  <option value="none">بدون</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="smtp-username">اسم المستخدم</Label>
              <Input id="smtp-username" type="email" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="smtp-password">كلمة المرور</Label>
              <Input id="smtp-password" type="password" />
            </div>

            <Button variant="outline" className="w-full">
              <Mail className="w-4 h-4 mr-2" />
              اختبار البريد
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* إعدادات الصيانة */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            إعدادات الصيانة والتطوير
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="maintenance">وضع الصيانة</Label>
                <p className="text-sm text-muted-foreground">إيقاف الموقع مؤقتاً للزوار</p>
              </div>
              <Switch
                id="maintenance"
                checked={maintenanceMode}
                onCheckedChange={setMaintenanceMode}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="debug">وضع التطوير</Label>
                <p className="text-sm text-muted-foreground">عرض تفاصيل الأخطاء</p>
              </div>
              <Switch
                id="debug"
                checked={debugMode}
                onCheckedChange={setDebugMode}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="logs">سجلات مفصلة</Label>
                <p className="text-sm text-muted-foreground">تسجيل جميع العمليات</p>
              </div>
              <Switch id="logs" />
            </div>
          </div>

          {maintenanceMode && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center gap-2 text-yellow-800">
                <AlertTriangle className="w-4 h-4" />
                <span className="font-medium">تنبيه: وضع الصيانة مفعل</span>
              </div>
              <p className="text-sm text-yellow-700 mt-1">
                الموقع غير متاح حالياً للزوار. سيتم عرض صفحة الصيانة.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
