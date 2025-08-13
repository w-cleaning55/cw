'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { useTranslation } from '../../hooks/useTranslation';

export default function SEOSettings() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t('admin.seo.title')}</h1>
        <p className="text-muted-foreground">{t('admin.seo.description')}</p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('admin.seo.basicSeo')}</CardTitle>
            <CardDescription>{t('admin.seo.basicSeoDesc')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="site-title">{t('admin.seo.siteTitle')}</Label>
              <Input id="site-title" defaultValue="عالم التنظيف - خدمات التنظيف في جدة" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="meta-description">{t('admin.seo.metaDescription')}</Label>
              <Textarea 
                id="meta-description" 
                defaultValue="شركة رائدة في خدمات التنظيف بجدة. نقدم تنظيف شامل للمنازل والمكاتب والشقق بأعلى معايير الجودة."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="keywords">{t('admin.seo.keywords')}</Label>
              <Input 
                id="keywords" 
                defaultValue="تنظيف منازل جدة, شركة تنظيف, تنظيف شقق, تنظيف مكاتب"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('admin.seo.socialMedia')}</CardTitle>
            <CardDescription>{t('admin.seo.socialMediaDesc')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="og-title">{t('admin.seo.ogTitle')}</Label>
              <Input id="og-title" defaultValue="عالم التنظيف - أفضل خدمات التنظيف في جدة" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="og-description">{t('admin.seo.ogDescription')}</Label>
              <Textarea id="og-description" defaultValue="احصل على خدمات تنظيف احترافية لمنزلك أو مكتبك في جدة" />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button>{t('admin.seo.saveSettings')}</Button>
        </div>
      </div>
    </div>
  );
}
