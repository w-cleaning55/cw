'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { useTranslation } from '../../hooks/useTranslation';

export default function ColorPaletteManagement() {
  const { t } = useTranslation();

  const palettes = [
    { id: 1, name: 'Ocean Blue', primary: '#1e40af', secondary: '#3b82f6', active: true },
    { id: 2, name: 'Forest Green', primary: '#166534', secondary: '#22c55e', active: false },
    { id: 3, name: 'Sunset Orange', primary: '#ea580c', secondary: '#f97316', active: false },
    { id: 4, name: 'Royal Purple', primary: '#7c3aed', secondary: '#a855f7', active: false },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('admin.colors.title')}</h1>
          <p className="text-muted-foreground">{t('admin.colors.description')}</p>
        </div>
        <Button>{t('admin.colors.createPalette')}</Button>
      </div>

      <div className="grid gap-4">
        {palettes.map((palette) => (
          <Card key={palette.id}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex space-x-2">
                    <div 
                      className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
                      style={{ backgroundColor: palette.primary }}
                    />
                    <div 
                      className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
                      style={{ backgroundColor: palette.secondary }}
                    />
                  </div>
                  <div>
                    <p className="font-medium">{palette.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {palette.primary} • {palette.secondary}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {palette.active && (
                    <Badge>{t('admin.colors.active')}</Badge>
                  )}
                  <Button variant="outline" size="sm">
                    {t('admin.colors.edit')}
                  </Button>
                  <Button 
                    variant={palette.active ? "secondary" : "default"} 
                    size="sm"
                  >
                    {palette.active ? t('admin.colors.deactivate') : t('admin.colors.activate')}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
