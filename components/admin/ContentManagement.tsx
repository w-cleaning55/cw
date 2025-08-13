'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { useTranslation } from '../../hooks/useTranslation';

export default function ContentManagement() {
  const { t } = useTranslation();

  const content = [
    { id: 1, type: 'hero', title: 'Hero Section', lastModified: '2024-01-15', status: 'published' },
    { id: 2, type: 'about', title: 'About Us', lastModified: '2024-01-14', status: 'published' },
    { id: 3, type: 'services', title: 'Services Section', lastModified: '2024-01-13', status: 'draft' },
    { id: 4, type: 'footer', title: 'Footer Content', lastModified: '2024-01-12', status: 'published' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('admin.content.title')}</h1>
          <p className="text-muted-foreground">{t('admin.content.description')}</p>
        </div>
        <Button>{t('admin.content.addContent')}</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('admin.content.websiteContent')}</CardTitle>
          <CardDescription>{t('admin.content.managePageContent')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {content.map((item) => (
              <div key={item.id} className="flex items-center justify-between border-b pb-4">
                <div className="space-y-1">
                  <p className="font-medium">{item.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {t('admin.content.lastModified')}: {item.lastModified}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={item.status === 'published' ? 'default' : 'secondary'}>
                    {t(`admin.content.status.${item.status}`)}
                  </Badge>
                  <Button variant="outline" size="sm">
                    {t('admin.content.edit')}
                  </Button>
                  <Button variant="outline" size="sm">
                    {item.status === 'published' ? t('admin.content.unpublish') : t('admin.content.publish')}
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
