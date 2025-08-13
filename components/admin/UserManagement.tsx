'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { useTranslation } from '../../hooks/useTranslation';

export default function UserManagement() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('admin.users.title')}</h1>
          <p className="text-muted-foreground">{t('admin.users.description')}</p>
        </div>
        <Button>{t('admin.users.addUser')}</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('admin.users.allUsers')}</CardTitle>
          <CardDescription>{t('admin.users.manageSystemUsers')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((item) => (
              <div key={item} className="flex items-center justify-between border-b pb-4">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                    {item}
                  </div>
                  <div>
                    <p className="font-medium">{t('admin.users.sampleName')} {item}</p>
                    <p className="text-sm text-muted-foreground">user{item}@cleaningworld.sa</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={item === 1 ? 'default' : 'secondary'}>
                    {item === 1 ? t('admin.users.admin') : t('admin.users.employee')}
                  </Badge>
                  <Button variant="outline" size="sm">
                    {t('admin.users.edit')}
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
