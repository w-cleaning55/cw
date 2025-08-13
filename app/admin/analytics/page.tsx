'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  Calendar,
  DollarSign,
  Eye,
  Download,
  Filter,
  RefreshCw
} from 'lucide-react';

const stats = [
  {
    title: 'إجمالي الحجوزات',
    value: '1,247',
    change: '+12.5%',
    trend: 'up',
    icon: Calendar
  },
  {
    title: 'العملاء النشطين',
    value: '892',
    change: '+8.2%',
    trend: 'up',
    icon: Users
  },
  {
    title: 'الإيرادات الشهرية',
    value: '₹45,234',
    change: '+15.3%',
    trend: 'up',
    icon: DollarSign
  },
  {
    title: 'معدل الرضا',
    value: '4.8/5',
    change: '+0.3',
    trend: 'up',
    icon: TrendingUp
  }
];

const recentBookings = [
  {
    id: 'BK001',
    customer: 'أحمد محمد',
    service: 'تنظيف منزل',
    date: '2024-01-15',
    status: 'مكتمل',
    amount: '₹500'
  },
  {
    id: 'BK002',
    customer: 'فاطمة أحمد',
    service: 'تنظيف مكتب',
    date: '2024-01-14',
    status: 'قيد التنفيذ',
    amount: '₹300'
  },
  {
    id: 'BK003',
    customer: 'محمد علي',
    service: 'تنظيف سجاد',
    date: '2024-01-13',
    status: 'ملغي',
    amount: '₹200'
  }
];

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">التحليلات والتقارير</h1>
          <p className="text-muted-foreground mt-2">
            مراقبة الأداء والإحصائيات التفصيلية
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            تصفية
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            تصدير
          </Button>
          <Button size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            تحديث
          </Button>
        </div>
      </div>

      {/* إحصائيات سريعة */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center space-x-1 text-xs">
                {stat.trend === 'up' ? (
                  <TrendingUp className="w-3 h-3 text-green-500" />
                ) : (
                  <TrendingDown className="w-3 h-3 text-red-500" />
                )}
                <span className={stat.trend === 'up' ? 'text-green-500' : 'text-red-500'}>
                  {stat.change}
                </span>
                <span className="text-muted-foreground">من الشهر الماضي</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* رسم بياني للحجوزات */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              الحجوزات الشهرية
            </CardTitle>
            <CardDescription>
              إجمالي الحجوزات خلال الاثني عشر شهراً الماضية
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>الرسم البياني سيظهر هنا</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* الحجوزات الأخيرة */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              الحجوزات الأخيرة
            </CardTitle>
            <CardDescription>
              آخر الحجوزات المسجلة في النظام
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentBookings.map((booking) => (
                <div key={booking.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium">{booking.customer}</div>
                    <div className="text-sm text-muted-foreground">
                      {booking.service} - {booking.date}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={
                        booking.status === 'مكتمل' ? 'default' :
                        booking.status === 'قيد التنفيذ' ? 'secondary' : 'destructive'
                      }
                    >
                      {booking.status}
                    </Badge>
                    <span className="font-medium">{booking.amount}</span>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              <Eye className="w-4 h-4 mr-2" />
              عرض جميع الحجوزات
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* تقارير مفصلة */}
      <Card>
        <CardHeader>
          <CardTitle>التقارير المفصلة</CardTitle>
          <CardDescription>
            تقارير شاملة عن أداء الأعمال والخدمات
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
              <BarChart3 className="w-6 h-6 mb-2" />
              تقرير المبيعات الشهري
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
              <Users className="w-6 h-6 mb-2" />
              تقرير العملاء
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
              <TrendingUp className="w-6 h-6 mb-2" />
              تقرير الأداء
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
