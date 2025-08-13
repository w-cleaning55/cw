'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { useTranslation } from '../../hooks/useTranslation';

export default function CompanySettings() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t('admin.company.title')}</h1>
        <p className="text-muted-foreground">{t('admin.company.description')}</p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('admin.company.basicInfo')}</CardTitle>
            <CardDescription>{t('admin.company.basicInfoDesc')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="company-name-ar">{t('admin.company.nameAr')}</Label>
                <Input id="company-name-ar" defaultValue="عالم التنظيف" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company-name-en">{t('admin.company.nameEn')}</Label>
                <Input id="company-name-en" defaultValue="Cleaning World" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="slogan">{t('admin.company.slogan')}</Label>
              <Input id="slogan" defaultValue="نجعل منزلك يتألق" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">{t('admin.company.description')}</Label>
              <Textarea id="description" defaultValue="شركة رائدة في مجال التنظيف في جدة" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('admin.company.contactInfo')}</CardTitle>
            <CardDescription>{t('admin.company.contactInfoDesc')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">{t('admin.company.phone')}</Label>
                <Input id="phone" defaultValue="+966 12 123 4567" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="whatsapp">{t('admin.company.whatsapp')}</Label>
                <Input id="whatsapp" defaultValue="+966 50 123 4567" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">{t('admin.company.email')}</Label>
              <Input id="email" type="email" defaultValue="info@cleaningworld.sa" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">{t('admin.company.address')}</Label>
              <Textarea id="address" defaultValue="حي النسيم، جدة، المملكة العربية السعودية" />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button className="w-auto">
            {t('admin.company.saveSettings')}
          </Button>
        </div>
      </div>
    </div>
  );
}
