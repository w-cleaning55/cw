'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Textarea } from '../../../components/ui/textarea';
import { Switch } from '../../../components/ui/switch';
import {
  Globe,
  Plus,
  Edit,
  Trash2,
  Save,
  Download,
  Upload,
  Languages,
  FileText,
  Check,
  X
} from 'lucide-react';

const languages = [
  {
    code: 'ar',
    name: 'العربية',
    nativeName: 'الع��بية',
    isDefault: true,
    isRTL: true,
    enabled: true,
    progress: 100
  },
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    isDefault: false,
    isRTL: false,
    enabled: true,
    progress: 95
  },
  {
    code: 'fr',
    name: 'French',
    nativeName: 'Français',
    isDefault: false,
    isRTL: false,
    enabled: false,
    progress: 60
  }
];

const translationKeys = [
  {
    key: 'common.welcome',
    ar: 'مرحباً',
    en: 'Welcome',
    category: 'عام'
  },
  {
    key: 'navigation.home',
    ar: 'الرئيسية',
    en: 'Home',
    category: 'التنقل'
  },
  {
    key: 'navigation.about',
    ar: 'من نحن',
    en: 'About Us',
    category: 'التنقل'
  },
  {
    key: 'navigation.services',
    ar: 'الخدمات',
    en: 'Services',
    category: 'التنقل'
  },
  {
    key: 'navigation.contact',
    ar: 'اتصل بنا',
    en: 'Contact Us',
    category: 'التنقل'
  },
  {
    key: 'services.cleaning_home',
    ar: 'تنظيف المنازل',
    en: 'Home Cleaning',
    category: 'الخدمات'
  },
  {
    key: 'services.cleaning_office',
    ar: 'تنظيف المكاتب',
    en: 'Office Cleaning',
    category: 'الخدمات'
  }
];

export default function I18nPage() {
  const [selectedKey, setSelectedKey] = useState(translationKeys[0]);
  const [editMode, setEditMode] = useState(false);
  const [newTranslations, setNewTranslations] = useState({
    ar: selectedKey?.ar || '',
    en: selectedKey?.en || ''
  });

  const getProgressColor = (progress: number) => {
    if (progress >= 90) return 'text-green-500';
    if (progress >= 70) return 'text-yellow-500';
    return 'text-red-500';
  };

  const categories = Array.from(new Set(translationKeys.map(k => k.category)));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">إدارة اللغات والترجمة</h1>
          <p className="text-muted-foreground mt-2">
            إدارة اللغات المدعومة ونصوص الترجمة
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Upload className="w-4 h-4 mr-2" />
            استيراد
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            تصدير
          </Button>
          <Button size="sm">
            <Plus className="w-4 h-4 mr-2" />
            لغة جديدة
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* اللغات المدعومة */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              اللغات المدعومة
            </CardTitle>
            <CardDescription>
              إدارة اللغات المتاحة في الموقع
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {languages.map((lang) => (
              <div key={lang.code} className="p-3 border rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{lang.nativeName}</div>
                    <div className="text-sm text-muted-foreground">{lang.name}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    {lang.isDefault && (
                      <Badge variant="default" className="text-xs">افتراضي</Badge>
                    )}
                    <Switch
                      checked={lang.enabled}
                      onCheckedChange={() => {}}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>مكتملة:</span>
                  <span className={getProgressColor(lang.progress)}>
                    {lang.progress}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{width: `${lang.progress}%`}}
                  ></div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* فئات الترجمة */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              فئات النصوص
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {categories.map((category) => (
              <div key={category} className="p-2 border rounded cursor-pointer hover:bg-muted">
                <div className="flex items-center justify-between">
                  <span>{category}</span>
                  <Badge variant="outline" className="text-xs">
                    {translationKeys.filter(k => k.category === category).length}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* قائمة النصوص */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Languages className="w-5 h-5" />
              نصوص الترجمة
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 max-h-[500px] overflow-y-auto">
            {translationKeys.map((item) => (
              <div
                key={item.key}
                className={`p-2 border rounded cursor-pointer transition-colors ${
                  selectedKey?.key === item.key 
                    ? 'bg-primary/10 border-primary' 
                    : 'hover:bg-muted'
                }`}
                onClick={() => {
                  setSelectedKey(item);
                  setNewTranslations({
                    ar: item.ar,
                    en: item.en
                  });
                  setEditMode(false);
                }}
              >
                <div className="text-sm font-medium">{item.key}</div>
                <div className="text-xs text-muted-foreground">{item.ar}</div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* محرر الترجمة */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Edit className="w-5 h-5" />
                محرر الترجمة
              </div>
              {!editMode ? (
                <Button variant="outline" size="sm" onClick={() => setEditMode(true)}>
                  <Edit className="w-4 h-4 mr-2" />
                  تعديل
                </Button>
              ) : (
                <div className="flex gap-1">
                  <Button variant="outline" size="sm" onClick={() => setEditMode(false)}>
                    <X className="w-4 h-4" />
                  </Button>
                  <Button size="sm">
                    <Check className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedKey && (
              <>
                <div>
                  <Label>مفتاح الترجمة</Label>
                  <Input value={selectedKey.key} disabled />
                </div>
                <div>
                  <Label>الفئة</Label>
                  <Input value={selectedKey.category} disabled />
                </div>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="ar-text">النص العربي</Label>
                    {editMode ? (
                      <Textarea
                        id="ar-text"
                        value={newTranslations.ar}
                        onChange={(e) => setNewTranslations(prev => ({
                          ...prev,
                          ar: e.target.value
                        }))}
                        className="text-right"
                        dir="rtl"
                      />
                    ) : (
                      <div className="p-2 border rounded bg-muted text-right" dir="rtl">
                        {selectedKey.ar}
                      </div>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="en-text">النص الإنجليزي</Label>
                    {editMode ? (
                      <Textarea
                        id="en-text"
                        value={newTranslations.en}
                        onChange={(e) => setNewTranslations(prev => ({
                          ...prev,
                          en: e.target.value
                        }))}
                      />
                    ) : (
                      <div className="p-2 border rounded bg-muted">
                        {selectedKey.en}
                      </div>
                    )}
                  </div>
                </div>
                {editMode && (
                  <Button className="w-full">
                    <Save className="w-4 h-4 mr-2" />
                    حفظ التغييرات
                  </Button>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* إعدادات متقدمة */}
      <Card>
        <CardHeader>
          <CardTitle>الإعدادات المتقدمة</CardTitle>
          <CardDescription>
            إعدادات إضافية للترجمة والتوطين
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="auto-detect">اكتشاف اللغة تلقائياً</Label>
            <Switch id="auto-detect" />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="fallback">استخدام لغة احتياطية</Label>
            <Switch id="fallback" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="cache">تخزين الترجمات مؤقتاً</Label>
            <Switch id="cache" defaultChecked />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
