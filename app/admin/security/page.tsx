'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Switch } from '../../../components/ui/switch';
import {
  Shield,
  Key,
  Lock,
  Eye,
  AlertTriangle,
  CheckCircle,
  Users,
  Activity,
  Download,
  RotateCcw,
  X
} from 'lucide-react';

const securityEvents = [
  {
    id: 1,
    type: 'login',
    message: 'تسجيل دخول ناجح من IP: 192.168.1.1',
    time: '2024-01-15 10:30',
    severity: 'info',
    user: 'admin@example.com'
  },
  {
    id: 2,
    type: 'failed_login',
    message: 'محاولة تسجيل دخول فاشلة من IP: 192.168.1.100',
    time: '2024-01-15 09:15',
    severity: 'warning',
    user: 'unknown'
  },
  {
    id: 3,
    type: 'password_change',
    message: 'تم تغيير كلمة المرور للمستخدم admin@example.com',
    time: '2024-01-14 14:20',
    severity: 'info',
    user: 'admin@example.com'
  }
];

const activeSessions = [
  {
    id: 1,
    device: 'Chrome على Windows',
    ip: '192.168.1.1',
    location: 'الرياض، السعودية',
    lastActive: '2024-01-15 10:30',
    current: true
  },
  {
    id: 2,
    device: 'Safari على iPhone',
    ip: '192.168.1.50',
    location: 'الرياض، السعودية',
    lastActive: '2024-01-15 08:15',
    current: false
  }
];

export default function SecurityPage() {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [loginAlertsEnabled, setLoginAlertsEnabled] = useState(true);
  const [passwordStrength, setPasswordStrength] = useState('قوية');

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'info': return 'default';
      case 'warning': return 'secondary';
      case 'error': return 'destructive';
      default: return 'default';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'info': return <CheckCircle className="w-4 h-4 text-blue-500" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'error': return <X className="w-4 h-4 text-red-500" />;
      default: return <CheckCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">الأمان والحماية</h1>
          <p className="text-muted-foreground mt-2">
            إدارة إعدادات الأمان ومراقبة النشاطات المشبوهة
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            تقرير الأمان
          </Button>
          <Button size="sm">
            <Activity className="w-4 h-4 mr-2" />
            فحص الأمان
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* إعدادات الأمان */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              إعدادات الأمان
            </CardTitle>
            <CardDescription>
              تكوين إعدادات الحماية والأمان
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* المصادقة الثنائية */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="2fa" className="flex items-center gap-2">
                  <Key className="w-4 h-4" />
                  المصادقة الثنائية
                </Label>
                <Switch
                  id="2fa"
                  checked={twoFactorEnabled}
                  onCheckedChange={setTwoFactorEnabled}
                />
              </div>
              {!twoFactorEnabled && (
                <div className="text-sm text-yellow-600 bg-yellow-50 p-2 rounded">
                  ننصح بتفعيل المصادقة الثنائية لحماية أفضل
                </div>
              )}
            </div>

            {/* تنبيهات ��سجيل الدخول */}
            <div className="flex items-center justify-between">
              <Label htmlFor="login-alerts" className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                تنبيهات تسجيل الدخول
              </Label>
              <Switch
                id="login-alerts"
                checked={loginAlertsEnabled}
                onCheckedChange={setLoginAlertsEnabled}
              />
            </div>

            {/* قوة كلمة المرور */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Lock className="w-4 h-4" />
                قوة كلمة المرور
              </Label>
              <div className="flex items-center justify-between">
                <span className="text-sm">الحالة:</span>
                <Badge variant={passwordStrength === 'قوية' ? 'default' : 'destructive'}>
                  {passwordStrength}
                </Badge>
              </div>
              <Button variant="outline" className="w-full">
                <RotateCcw className="w-4 h-4 mr-2" />
                تغيير كلمة المرور
              </Button>
            </div>

            {/* إعداد��ت إضافية */}
            <div className="space-y-3 pt-3 border-t">
              <div className="flex items-center justify-between">
                <Label htmlFor="session-timeout">انتهاء الجلسة التلقائي</Label>
                <Switch id="session-timeout" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="ip-whitelist">قائمة IP المسموحة</Label>
                <Switch id="ip-whitelist" />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="audit-log">سجل التدقيق</Label>
                <Switch id="audit-log" defaultChecked />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* الجلسات النشطة */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              الجلسات النشطة
            </CardTitle>
            <CardDescription>
              مراقبة الجلسات النشطة وأجهزة تسجيل الدخول
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {activeSessions.map((session) => (
              <div key={session.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${session.current ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                    <div>
                      <div className="font-medium">{session.device}</div>
                      <div className="text-sm text-muted-foreground">
                        {session.ip} • {session.location}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {session.current && (
                      <Badge variant="default" className="text-xs">الجلسة الحالية</Badge>
                    )}
                    {!session.current && (
                      <Button variant="destructive" size="sm">
                        إنهاء الجلسة
                      </Button>
                    )}
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  آخر نشاط: {session.lastActive}
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full">
              إنهاء جميع الجلسات الأخرى
            </Button>
          </CardContent>
        </Card>

        {/* سجل الأمان */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              سجل الأنشطة الأمنية
            </CardTitle>
            <CardDescription>
              رصد ومراقبة الأنشطة المشبوهة والأحداث الأمنية
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {securityEvents.map((event) => (
              <div key={event.id} className="flex items-start gap-3 p-3 border rounded-lg">
                <div className="mt-1">
                  {getSeverityIcon(event.severity)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium">{event.message}</span>
                    <Badge variant={getSeverityColor(event.severity)} className="text-xs">
                      {event.severity === 'info' ? 'معلومات' : 
                       event.severity === 'warning' ? 'تحذير' : 'خطأ'}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    المستخدم: {event.user} • {event.time}
                  </div>
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full">
              <Eye className="w-4 h-4 mr-2" />
              عرض السجل الكامل
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* تقييم الأمان */}
      <Card>
        <CardHeader>
          <CardTitle>تقييم مستوى الأمان</CardTitle>
          <CardDescription>
            تقييم شامل لمستوى الأمان الحالي في النظام
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-500">85%</div>
              <div className="text-sm text-muted-foreground">مستوى الأمان الإجمالي</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-blue-500">12</div>
              <div className="text-sm text-muted-foreground">التحديثات الأمنية</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-yellow-500">3</div>
              <div className="text-sm text-muted-foreground">التحذيرات النشطة</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-red-500">1</div>
              <div className="text-sm text-muted-foreground">المشاكل الحرجة</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
