'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { useTranslation } from '../../hooks/useTranslation';

export default function BookingManagement() {
  const { t } = useTranslation();

  const bookings = [
    { id: 1, customer: 'فاطمة المالكي', service: 'تنظيف شامل للمنزل', status: 'confirmed', date: '2024-01-15' },
    { id: 2, customer: 'أحمد العتيبي', service: 'تنظيف الشقق', status: 'pending', date: '2024-01-16' },
    { id: 3, customer: 'سارة القحطاني', service: 'تنظيف المكاتب', status: 'completed', date: '2024-01-14' },
    { id: 4, customer: 'محمد الشهري', service: 'تنظيف المطابخ', status: 'confirmed', date: '2024-01-17' },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge className="bg-blue-500">{t('booking.status.confirmed')}</Badge>;
      case 'pending':
        return <Badge variant="outline">{t('booking.status.pending')}</Badge>;
      case 'completed':
        return <Badge className="bg-green-500">{t('booking.status.completed')}</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('admin.bookings.title')}</h1>
          <p className="text-muted-foreground">{t('admin.bookings.description')}</p>
        </div>
        <Button>{t('admin.bookings.newBooking')}</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('admin.bookings.allBookings')}</CardTitle>
          <CardDescription>{t('admin.bookings.manageCustomerBookings')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div key={booking.id} className="flex items-center justify-between border-b pb-4">
                <div className="space-y-1">
                  <p className="font-medium">#{booking.id} - {booking.customer}</p>
                  <p className="text-sm text-muted-foreground">{booking.service}</p>
                  <p className="text-xs text-muted-foreground">{booking.date}</p>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusBadge(booking.status)}
                  <Button variant="outline" size="sm">
                    {t('admin.bookings.view')}
                  </Button>
                  <Button variant="outline" size="sm">
                    {t('admin.bookings.edit')}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
