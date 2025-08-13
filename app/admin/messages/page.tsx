'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Textarea } from '../../../components/ui/textarea';
import {
  MessageSquare,
  Send,
  Search,
  Filter,
  MoreVertical,
  Reply,
  Trash2,
  Archive,
  Star,
  Phone,
  Mail
} from 'lucide-react';

const messages = [
  {
    id: 1,
    name: 'أحمد محمد',
    email: 'ahmed@example.com',
    phone: '+966501234567',
    subject: 'استفسار عن خدمة تنظيف المنزل',
    message: 'مرحباً، أريد معرفة تفاصيل أكثر عن خدمة تنظيف المنزل والأسعار المتاحة.',
    date: '2024-01-15 10:30',
    status: 'جديد',
    priority: 'عالي',
    isRead: false
  },
  {
    id: 2,
    name: 'فاطمة أحمد',
    email: 'fatima@example.com',
    phone: '+966509876543',
    subject: 'طلب حجز خدمة تنظيف مكتب',
    message: 'أحتاج إلى خدمة تنظيف مكتب شهرية، يرجى التواصل معي لتحديد الموعد المناسب.',
    date: '2024-01-14 14:20',
    status: 'قيد المراجعة',
    priority: 'متوسط',
    isRead: true
  },
  {
    id: 3,
    name: 'محمد علي',
    email: 'mohammed@example.com',
    phone: '+966512345678',
    subject: 'شكوى بخصوص الخدمة',
    message: 'لدي شكوى بخصوص جودة الخدمة المقدمة الأسبوع الماضي، أرجو التواصل.',
    date: '2024-01-13 09:15',
    status: 'تم الرد',
    priority: 'عالي',
    isRead: true
  }
];

export default function MessagesPage() {
  const [selectedMessage, setSelectedMessage] = useState(messages[0]);
  const [replyText, setReplyText] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'جديد': return 'default';
      case 'قيد المراجعة': return 'secondary';
      case 'تم الرد': return 'outline';
      default: return 'default';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'عالي': return 'destructive';
      case 'متوسط': return 'secondary';
      case 'منخفض': return 'outline';
      default: return 'default';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">الرسائل والاستفسارات</h1>
          <p className="text-muted-foreground mt-2">
            إدارة والرد على رسائل العملاء
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            تصفية
          </Button>
          <Button size="sm">
            <MessageSquare className="w-4 h-4 mr-2" />
            رسالة جديدة
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* قائمة الرسائل */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              الرسائل الواردة
            </CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="البحث في الرسائل..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardHeader>
          <CardContent className="space-y-2 max-h-[600px] overflow-y-auto">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                  selectedMessage.id === message.id 
                    ? 'bg-primary/10 border-primary' 
                    : 'hover:bg-muted'
                } ${!message.isRead ? 'border-l-4 border-l-blue-500' : ''}`}
                onClick={() => setSelectedMessage(message)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="font-medium text-sm">{message.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {message.date.split(' ')[1]}
                  </div>
                </div>
                <div className="text-sm text-muted-foreground mb-2 truncate">
                  {message.subject}
                </div>
                <div className="flex items-center justify-between">
                  <Badge variant={getStatusColor(message.status)} className="text-xs">
                    {message.status}
                  </Badge>
                  <Badge variant={getPriorityColor(message.priority)} className="text-xs">
                    {message.priority}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* تفاصيل الرسالة */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                تفاصيل الرسالة
              </CardTitle>
              <div className="flex gap-1">
                <Button variant="ghost" size="sm">
                  <Star className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Archive className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Trash2 className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {selectedMessage && (
              <>
                {/* معلومات المرسل */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">{selectedMessage.subject}</h3>
                    <div className="flex gap-2">
                      <Badge variant={getStatusColor(selectedMessage.status)}>
                        {selectedMessage.status}
                      </Badge>
                      <Badge variant={getPriorityColor(selectedMessage.priority)}>
                        {selectedMessage.priority}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted rounded-lg">
                    <div>
                      <div className="text-sm text-muted-foreground">الاسم</div>
                      <div className="font-medium">{selectedMessage.name}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <a href={`mailto:${selectedMessage.email}`} className="text-blue-600 hover:underline">
                        {selectedMessage.email}
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <a href={`tel:${selectedMessage.phone}`} className="text-blue-600 hover:underline">
                        {selectedMessage.phone}
                      </a>
                    </div>
                  </div>
                  
                  <div className="text-sm text-muted-foreground">
                    تاريخ الإرسال: {selectedMessage.date}
                  </div>
                </div>

                {/* محتوى الرسالة */}
                <div className="space-y-3">
                  <h4 className="font-medium">محتوى الرسالة:</h4>
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {selectedMessage.message}
                    </p>
                  </div>
                </div>

                {/* نموذج الرد */}
                <div className="space-y-3">
                  <h4 className="font-medium flex items-center gap-2">
                    <Reply className="w-4 h-4" />
                    الرد على الرسالة:
                  </h4>
                  <Textarea
                    placeholder="اكتب ردك هنا..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    rows={4}
                  />
                  <div className="flex gap-2">
                    <Button className="flex-1">
                      <Send className="w-4 h-4 mr-2" />
                      إرسال الرد
                    </Button>
                    <Button variant="outline">
                      <Phone className="w-4 h-4 mr-2" />
                      اتصال
                    </Button>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
