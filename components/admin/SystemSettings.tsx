'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';
import { useTranslation } from '../../hooks/useTranslation';

export default function SystemSettings() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t('admin.system.title')}</h1>
        <p className="text-muted-foreground">{t('admin.system.description')}</p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('admin.system.general')}</CardTitle>
            <CardDescription>{t('admin.system.generalDesc')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch id="maintenance-mode" />
              <Label htmlFor="maintenance-mode">{t('admin.system.maintenanceMode')}</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="auto-backup" defaultChecked />
              <Label htmlFor="auto-backup">{t('admin.system.autoBackup')}</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="email-notifications" defaultChecked />
              <Label htmlFor="email-notifications">{t('admin.system.emailNotifications')}</Label>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('admin.system.security')}</CardTitle>
            <CardDescription>{t('admin.system.securityDesc')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch id="two-factor" />
              <Label htmlFor="two-factor">{t('admin.system.twoFactor')}</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="session-timeout" defaultChecked />
              <Label htmlFor="session-timeout">{t('admin.system.sessionTimeout')}</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="audit-logs" defaultChecked />
              <Label htmlFor="audit-logs">{t('admin.system.auditLogs')}</Label>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button>{t('admin.system.saveSettings')}</Button>
        </div>
      </div>
    </div>
  );
}
