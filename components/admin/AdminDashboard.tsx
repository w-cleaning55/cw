'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { useTranslation } from '../../hooks/useTranslation';

export default function AdminDashboard() {
  const { t } = useTranslation();

  const stats = [
    { title: t('admin.stats.totalBookings'), value: '156', change: '+12%' },
    { title: t('admin.stats.activeCustomers'), value: '89', change: '+8%' },
    { title: t('admin.stats.monthlyRevenue'), value: '45,670 ر.س', change: '+15%' },
    { title: t('admin.stats.avgRating'), value: '4.8', change: '+0.2' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t('admin.dashboard.title')}</h1>
        <p className="text-muted-foreground">{t('admin.dashboard.welcome')}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                <Badge variant="secondary" className="text-green-600">
                  {stat.change}
                </Badge>
                {' '}{t('admin.dashboard.fromLastMonth')}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>{t('admin.dashboard.recentBookings')}</CardTitle>
            <CardDescription>{t('admin.dashboard.latestCustomerBookings')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="flex items-center justify-between border-b pb-2">
                  <div>
                    <p className="font-medium">{t('services.home_cleaning')}</p>
                    <p className="text-sm text-muted-foreground">{t('customers.sample_name')} #{item}</p>
                  </div>
                  <Badge>{t('booking.status.confirmed')}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>{t('admin.dashboard.quickActions')}</CardTitle>
            <CardDescription>{t('admin.dashboard.commonTasks')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button className="w-full justify-start" variant="outline">
              {t('admin.actions.newBooking')}
            </Button>
            <Button className="w-full justify-start" variant="outline">
              {t('admin.actions.addCustomer')}
            </Button>
            <Button className="w-full justify-start" variant="outline">
              {t('admin.actions.viewReports')}
            </Button>
            <Button className="w-full justify-start" variant="outline">
              {t('admin.actions.manageServices')}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
