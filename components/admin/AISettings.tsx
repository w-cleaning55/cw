'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useTranslation } from '../../hooks/useTranslation';

export default function AISettings() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t('admin.ai.title')}</h1>
        <p className="text-muted-foreground">{t('admin.ai.description')}</p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('admin.ai.chatbot')}</CardTitle>
            <CardDescription>{t('admin.ai.chatbotDesc')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch id="chatbot-enabled" defaultChecked />
              <Label htmlFor="chatbot-enabled">{t('admin.ai.enableChatbot')}</Label>
            </div>
            <div className="space-y-2">
              <Label>{t('admin.ai.aiProvider')}</Label>
              <Select defaultValue="openai">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="openai">OpenAI GPT</SelectItem>
                  <SelectItem value="gemini">Google Gemini</SelectItem>
                  <SelectItem value="claude">Anthropic Claude</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{t('admin.ai.responseLanguage')}</Label>
              <Select defaultValue="ar">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ar">العربية</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="both">Both / كلاهما</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('admin.ai.knowledgeBase')}</CardTitle>
            <CardDescription>{t('admin.ai.knowledgeBaseDesc')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch id="auto-learn" defaultChecked />
              <Label htmlFor="auto-learn">{t('admin.ai.autoLearn')}</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="feedback-learning" defaultChecked />
              <Label htmlFor="feedback-learning">{t('admin.ai.feedbackLearning')}</Label>
            </div>
            <Button variant="outline">{t('admin.ai.updateKnowledge')}</Button>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button>{t('admin.ai.saveSettings')}</Button>
        </div>
      </div>
    </div>
  );
}
