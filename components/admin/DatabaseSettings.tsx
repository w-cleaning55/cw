'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { useTranslation } from '../../hooks/useTranslation';

export default function DatabaseSettings() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t('admin.database.title')}</h1>
        <p className="text-muted-foreground">{t('admin.database.description')}</p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('admin.database.connection')}</CardTitle>
            <CardDescription>{t('admin.database.connectionDesc')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{t('admin.database.status')}</p>
                <p className="text-sm text-muted-foreground">{t('admin.database.currentProvider')}: JSON Files</p>
              </div>
              <Badge className="bg-green-500">{t('admin.database.connected')}</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('admin.database.backup')}</CardTitle>
            <CardDescription>{t('admin.database.backupDesc')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Button>{t('admin.database.createBackup')}</Button>
              <Button variant="outline">{t('admin.database.restoreBackup')}</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('admin.database.migration')}</CardTitle>
            <CardDescription>{t('admin.database.migrationDesc')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline">{t('admin.database.exportData')}</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
