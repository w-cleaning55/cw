'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { useTranslation } from '../../hooks/useTranslation';

export default function CustomerManagement() {
  const { t } = useTranslation();

  const customers = [
    { id: 1, name: 'فاطمة المالكي', email: 'fatima@example.com', phone: '+966501234567', status: 'active' },
    { id: 2, name: 'أحمد العتيبي', email: 'ahmed@example.com', phone: '+966501234568', status: 'active' },
    { id: 3, name: 'سارة القحطاني', email: 'sarah@example.com', phone: '+966501234569', status: 'inactive' },
    { id: 4, name: 'محمد الشهري', email: 'mohammed@example.com', phone: '+966501234570', status: 'active' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('admin.customers.title')}</h1>
          <p className="text-muted-foreground">{t('admin.customers.description')}</p>
        </div>
        <Button>{t('admin.customers.addCustomer')}</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('admin.customers.allCustomers')}</CardTitle>
          <CardDescription>{t('admin.customers.manageCustomerData')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {customers.map((customer) => (
              <div key={customer.id} className="flex items-center justify-between border-b pb-4">
                <div className="space-y-1">
                  <p className="font-medium">{customer.name}</p>
                  <p className="text-sm text-muted-foreground">{customer.email}</p>
                  <p className="text-xs text-muted-foreground">{customer.phone}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={customer.status === 'active' ? 'default' : 'secondary'}>
                    {t(`admin.customers.status.${customer.status}`)}
                  </Badge>
                  <Button variant="outline" size="sm">
                    {t('admin.customers.view')}
                  </Button>
                  <Button variant="outline" size="sm">
                    {t('admin.customers.edit')}
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
