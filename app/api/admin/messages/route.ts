import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const MESSAGES_FILE = path.join(DATA_DIR, 'messages.json');

interface Message {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  category: 'inquiry' | 'complaint' | 'suggestion' | 'booking' | 'other';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'new' | 'read' | 'replied' | 'resolved' | 'archived';
  isRead: boolean;
  replies?: Array<{
    id: string;
    message: string;
    sender: 'customer' | 'admin';
    timestamp: string;
  }>;
  tags?: string[];
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
}

function ensureDataDirectory() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function getDefaultMessages(): Message[] {
  return [
    {
      id: 'MSG001',
      name: 'أحمد محمد السعد',
      email: 'ahmed.saad@example.com',
      phone: '+966501234567',
      subject: 'استفسار عن خدمة تنظيف المنزل',
      message: 'مرحباً، أريد معرفة تفاصيل أكثر عن خدمة تنظيف المنزل والأسعار المتاحة. منزلي مكون من 4 غرف و3 حمامات، وأحتاج خدمة أسبوعية.',
      category: 'inquiry',
      priority: 'medium',
      status: 'new',
      isRead: false,
      tags: ['تنظيف منزل', 'أسعار'],
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-15T10:30:00Z'
    },
    {
      id: 'MSG002',
      name: 'فاطمة أحمد النصر',
      email: 'fatima.nasr@example.com',
      phone: '+966509876543',
      subject: 'طلب حجز خدمة تنظيف مكتب',
      message: 'أحتاج إلى خدمة تنظيف مكتب شهرية لشركتنا. المكتب يضم 15 موظف ومساحته حوالي 200 متر مربع. يرجى التواصل معي لتحديد الموعد المناسب وتفاصيل الخدمة.',
      category: 'booking',
      priority: 'high',
      status: 'read',
      isRead: true,
      tags: ['تنظيف مكتب', 'حجز'],
      assignedTo: 'admin@cleaningworld.sa',
      replies: [
        {
          id: 'REP001',
          message: 'شكراً لاهتمامك بخدماتنا. سيتم التواصل معك خلال 24 ساعة لتحديد موعد المعاينة.',
          sender: 'admin',
          timestamp: '2024-01-14T15:00:00Z'
        }
      ],
      createdAt: '2024-01-14T14:20:00Z',
      updatedAt: '2024-01-14T15:00:00Z'
    },
    {
      id: 'MSG003',
      name: 'محمد علي الراشد',
      email: 'mohammed.rashid@example.com',
      phone: '+966512345678',
      subject: 'شكوى بخصوص جودة الخدمة',
      message: 'لدي شكوى بخصوص جودة الخدمة المقدمة الأسبوع الماضي. الفريق لم يقم بتنظي�� المطبخ بالشكل المطلوب ولم يهتم بالتفاصيل. أرجو إعادة النظر في هذا الأمر.',
      category: 'complaint',
      priority: 'high',
      status: 'replied',
      isRead: true,
      tags: ['شكوى', 'جودة'],
      assignedTo: 'admin@cleaningworld.sa',
      replies: [
        {
          id: 'REP002',
          message: 'نعتذر عن هذا الخطأ. سنقوم بإرسال فريق متخصص لإعادة تنظيف المطبخ مجاناً.',
          sender: 'admin',
          timestamp: '2024-01-13T11:30:00Z'
        },
        {
          id: 'REP003',
          message: 'شكراً لكم على الاستجابة السريعة. تم تنظيف المطبخ بشكل ممتاز اليوم.',
          sender: 'customer',
          timestamp: '2024-01-14T16:45:00Z'
        }
      ],
      createdAt: '2024-01-13T09:15:00Z',
      updatedAt: '2024-01-14T16:45:00Z',
      resolvedAt: '2024-01-14T16:45:00Z'
    },
    {
      id: 'MSG004',
      name: 'سارة خالد المطيري',
      email: 'sara.mutairi@example.com',
      phone: '+966505555555',
      subject: 'اقتراح لتحسين الخدمة',
      message: 'اقترح إضافة خدمة تنظيف النباتات المنزلية ضمن خدمات تنظيف المنزل. كما أقترح إمكانية حجز الخدمة عبر تطبيق الجوال.',
      category: 'suggestion',
      priority: 'low',
      status: 'read',
      isRead: true,
      tags: ['اقتراح', 'تطوير'],
      createdAt: '2024-01-12T13:20:00Z',
      updatedAt: '2024-01-12T14:00:00Z'
    }
  ];
}

export async function GET(request: NextRequest) {
  try {
    ensureDataDirectory();
    
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const category = searchParams.get('category');
    const priority = searchParams.get('priority');
    
    let messages: Message[];
    
    if (fs.existsSync(MESSAGES_FILE)) {
      const fileContent = fs.readFileSync(MESSAGES_FILE, 'utf-8');
      messages = JSON.parse(fileContent);
    } else {
      messages = getDefaultMessages();
      fs.writeFileSync(MESSAGES_FILE, JSON.stringify(messages, null, 2));
    }
    
    // Apply filters
    if (status) {
      messages = messages.filter(m => m.status === status);
    }
    if (category) {
      messages = messages.filter(m => m.category === category);
    }
    if (priority) {
      messages = messages.filter(m => m.priority === priority);
    }
    
    // Sort by creation date (newest first)
    messages.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    return NextResponse.json({
      success: true,
      messages,
      total: messages.length
    });
  } catch (error) {
    console.error('Error reading messages:', error);
    return NextResponse.json(
      { error: 'Failed to load messages' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    ensureDataDirectory();
    
    const newMessage = await request.json();
    
    let messages: Message[] = [];
    if (fs.existsSync(MESSAGES_FILE)) {
      const fileContent = fs.readFileSync(MESSAGES_FILE, 'utf-8');
      messages = JSON.parse(fileContent);
    }
    
    const message: Message = {
      id: `MSG${String(messages.length + 1).padStart(3, '0')}`,
      ...newMessage,
      status: 'new',
      isRead: false,
      replies: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    messages.unshift(message); // Add to beginning for newest first
    fs.writeFileSync(MESSAGES_FILE, JSON.stringify(messages, null, 2));
    
    return NextResponse.json({ 
      success: true, 
      message,
      message_text: 'Message created successfully' 
    });
  } catch (error) {
    console.error('Error creating message:', error);
    return NextResponse.json(
      { error: 'Failed to create message' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    ensureDataDirectory();
    
    const { id, action, ...updates } = await request.json();
    
    if (!fs.existsSync(MESSAGES_FILE)) {
      return NextResponse.json(
        { error: 'Messages file not found' },
        { status: 404 }
      );
    }
    
    const fileContent = fs.readFileSync(MESSAGES_FILE, 'utf-8');
    let messages: Message[] = JSON.parse(fileContent);
    
    const messageIndex = messages.findIndex(m => m.id === id);
    if (messageIndex === -1) {
      return NextResponse.json(
        { error: 'Message not found' },
        { status: 404 }
      );
    }
    
    let updatedMessage = { ...messages[messageIndex] };
    
    switch (action) {
      case 'mark_read':
        updatedMessage.isRead = true;
        if (updatedMessage.status === 'new') {
          updatedMessage.status = 'read';
        }
        break;
      
      case 'mark_unread':
        updatedMessage.isRead = false;
        break;
      
      case 'reply':
        if (updates.replyMessage) {
          const reply = {
            id: `REP${Date.now()}`,
            message: updates.replyMessage,
            sender: 'admin' as const,
            timestamp: new Date().toISOString()
          };
          updatedMessage.replies = updatedMessage.replies || [];
          updatedMessage.replies.push(reply);
          updatedMessage.status = 'replied';
        }
        break;
      
      case 'resolve':
        updatedMessage.status = 'resolved';
        updatedMessage.resolvedAt = new Date().toISOString();
        break;
      
      case 'archive':
        updatedMessage.status = 'archived';
        break;
      
      default:
        // Regular update
        updatedMessage = { ...updatedMessage, ...updates };
        break;
    }
    
    updatedMessage.updatedAt = new Date().toISOString();
    messages[messageIndex] = updatedMessage;
    
    fs.writeFileSync(MESSAGES_FILE, JSON.stringify(messages, null, 2));
    
    return NextResponse.json({ 
      success: true, 
      message: updatedMessage,
      message_text: 'Message updated successfully' 
    });
  } catch (error) {
    console.error('Error updating message:', error);
    return NextResponse.json(
      { error: 'Failed to update message' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    ensureDataDirectory();
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Message ID is required' },
        { status: 400 }
      );
    }
    
    if (!fs.existsSync(MESSAGES_FILE)) {
      return NextResponse.json(
        { error: 'Messages file not found' },
        { status: 404 }
      );
    }
    
    const fileContent = fs.readFileSync(MESSAGES_FILE, 'utf-8');
    let messages: Message[] = JSON.parse(fileContent);
    
    const initialLength = messages.length;
    messages = messages.filter(m => m.id !== id);
    
    if (messages.length === initialLength) {
      return NextResponse.json(
        { error: 'Message not found' },
        { status: 404 }
      );
    }
    
    fs.writeFileSync(MESSAGES_FILE, JSON.stringify(messages, null, 2));
    
    return NextResponse.json({ 
      success: true, 
      message_text: 'Message deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting message:', error);
    return NextResponse.json(
      { error: 'Failed to delete message' },
      { status: 500 }
    );
  }
}
