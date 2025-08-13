import { Router } from 'express';
import { z } from 'zod';
import { dataManager } from '../utils/dataManager';

const router = Router();

// Message schemas
const MessageSchema = z.object({
  conversationId: z.string(),
  senderId: z.string(),
  receiverId: z.string().optional(),
  content: z.string(),
  type: z.enum(['text', 'image', 'file', 'audio', 'video', 'location', 'contact', 'system']),
  attachments: z.array(z.object({
    id: z.string(),
    name: z.string(),
    type: z.string(),
    size: z.number(),
    url: z.string(),
    thumbnail: z.string().optional(),
  })).optional(),
  replyTo: z.string().optional(),
  metadata: z.record(z.any()).optional(),
});

const ConversationSchema = z.object({
  type: z.enum(['direct', 'group', 'channel', 'support']),
  name: z.string(),
  nameAr: z.string(),
  description: z.string().optional(),
  descriptionAr: z.string().optional(),
  participants: z.array(z.object({
    userId: z.string(),
    name: z.string(),
    nameAr: z.string(),
    avatar: z.string().optional(),
    role: z.enum(['owner', 'admin', 'member', 'guest']),
    permissions: z.array(z.string()),
  })),
  avatar: z.string().optional(),
  settings: z.object({
    canAddMembers: z.boolean(),
    canRemoveMembers: z.boolean(),
    canEditMessages: z.boolean(),
    canDeleteMessages: z.boolean(),
    messageRetention: z.number().optional(),
    allowAttachments: z.boolean(),
    maxAttachmentSize: z.number(),
    allowedAttachmentTypes: z.array(z.string()),
  }),
  metadata: z.record(z.any()).optional(),
});

// Get user conversations
router.get('/conversations', async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const conversations = await dataManager.readData('conversations') || [];
    
    // Filter conversations where user is a participant
    const userConversations = conversations.filter((conv: any) =>
      conv.participants.some((p: any) => p.userId === userId)
    );

    // Load last messages for each conversation
    const messages = await dataManager.readData('messages') || [];
    
    const conversationsWithLastMessage = userConversations.map((conv: any) => {
      const conversationMessages = messages.filter((msg: any) => msg.conversationId === conv.id);
      const lastMessage = conversationMessages.sort((a: any, b: any) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      )[0];

      // Calculate unread count
      const unreadCount = conversationMessages.filter((msg: any) => 
        msg.senderId !== userId && msg.status !== 'read'
      ).length;

      return {
        ...conv,
        lastMessage,
        unreadCount,
        updatedAt: lastMessage?.timestamp || conv.updatedAt,
      };
    });

    // Sort by last activity
    conversationsWithLastMessage.sort((a: any, b: any) => 
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );

    res.json({ conversations: conversationsWithLastMessage });
  } catch (error) {
    console.error('خطأ في جلب المحادثات:', error);
    res.status(500).json({ error: 'فشل في جلب المحادثات' });
  }
});

// Get conversation messages
router.get('/conversations/:conversationId/messages', async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { limit = 50, offset = 0 } = req.query;

    const messages = await dataManager.readData('messages') || [];
    
    // Filter messages for this conversation
    const conversationMessages = messages
      .filter((msg: any) => msg.conversationId === conversationId)
      .sort((a: any, b: any) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
      .slice(Number(offset), Number(offset) + Number(limit));

    res.json({ messages: conversationMessages });
  } catch (error) {
    console.error('خطأ في جلب الرسائل:', error);
    res.status(500).json({ error: 'فشل في جلب الرسائل' });
  }
});

// Send message
router.post('/send', async (req, res) => {
  try {
    const messageData = MessageSchema.parse(req.body);
    
    const messages = await dataManager.readData('messages') || [];
    
    const newMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...messageData,
      timestamp: new Date().toISOString(),
      status: 'sent',
      reactions: [],
      edited: false,
      deleted: false,
    };

    messages.push(newMessage);
    await dataManager.writeData('messages', messages);

    // Update conversation last activity
    const conversations = await dataManager.readData('conversations') || [];
    const conversationIndex = conversations.findIndex((conv: any) => conv.id === messageData.conversationId);
    
    if (conversationIndex >= 0) {
      conversations[conversationIndex].updatedAt = newMessage.timestamp;
      await dataManager.writeData('conversations', conversations);
    }

    // In a real implementation, you would:
    // 1. Send real-time notification to other participants
    // 2. Update message status based on delivery
    // 3. Store in proper database with relationships

    res.json(newMessage);
  } catch (error) {
    console.error('خطأ في إرسال الرسالة:', error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'بيانات غير صحيحة',
        details: error.errors
      });
    }
    
    res.status(500).json({ error: 'فشل في إرسال الرسالة' });
  }
});

// Mark messages as read
router.post('/conversations/:conversationId/mark-read', async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { userId } = req.body;

    const messages = await dataManager.readData('messages') || [];
    
    // Update message status to read for messages not sent by this user
    const updatedMessages = messages.map((msg: any) => {
      if (msg.conversationId === conversationId && msg.senderId !== userId && msg.status !== 'read') {
        return { ...msg, status: 'read', readAt: new Date().toISOString() };
      }
      return msg;
    });

    await dataManager.writeData('messages', updatedMessages);

    res.json({ success: true });
  } catch (error) {
    console.error('خطأ في تحديد الرسائل كمقروءة:', error);
    res.status(500).json({ error: 'فشل في تحديد الرسائل كمقروءة' });
  }
});

// Create conversation
router.post('/conversations', async (req, res) => {
  try {
    const conversationData = ConversationSchema.parse(req.body);
    
    const conversations = await dataManager.readData('conversations') || [];
    
    const newConversation = {
      id: `conv-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...conversationData,
      isPinned: false,
      isArchived: false,
      isMuted: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    conversations.push(newConversation);
    await dataManager.writeData('conversations', conversations);

    res.json(newConversation);
  } catch (error) {
    console.error('خطأ في إنشاء المحادثة:', error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'بيانات غير صحيحة',
        details: error.errors
      });
    }
    
    res.status(500).json({ error: 'فشل في إنشاء المحادثة' });
  }
});

// Upload attachment
router.post('/upload', async (req, res) => {
  try {
    // This is a simplified implementation
    // In a real application, you would use multer and cloud storage
    
    if (!req.body.file) {
      return res.status(400).json({ error: 'لم يتم اختيار ملف' });
    }

    // Simulate file upload
    const attachmentId = `att-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const attachmentUrl = `/uploads/messages/${attachmentId}`;

    // Store attachment metadata
    const attachments = await dataManager.readData('message-attachments') || [];
    
    const attachmentMetadata = {
      id: attachmentId,
      originalName: req.body.filename || 'unknown',
      mimetype: req.body.mimetype || 'application/octet-stream',
      size: req.body.size || 0,
      url: attachmentUrl,
      uploadedAt: new Date().toISOString(),
      userId: req.body.userId,
    };

    attachments.push(attachmentMetadata);
    await dataManager.writeData('message-attachments', attachments);

    res.json({
      id: attachmentId,
      url: attachmentUrl,
      thumbnail: req.body.mimetype?.startsWith('image/') ? `${attachmentUrl}_thumb` : undefined,
    });
  } catch (error) {
    console.error('خطأ في رفع المرفق:', error);
    res.status(500).json({ error: 'فشل في رفع المرفق' });
  }
});

// Delete message
router.delete('/messages/:messageId', async (req, res) => {
  try {
    const { messageId } = req.params;
    const { userId } = req.body;

    const messages = await dataManager.readData('messages') || [];
    const messageIndex = messages.findIndex((msg: any) => msg.id === messageId);

    if (messageIndex === -1) {
      return res.status(404).json({ error: 'الرسالة غير موجودة' });
    }

    const message = messages[messageIndex];

    // Check if user can delete this message
    if (message.senderId !== userId) {
      return res.status(403).json({ error: 'غير مصرح لك بحذف هذه الرسالة' });
    }

    // Mark as deleted instead of actually deleting
    messages[messageIndex] = {
      ...message,
      deleted: true,
      deletedAt: new Date().toISOString(),
      content: 'تم حذف هذه الرسالة',
    };

    await dataManager.writeData('messages', messages);

    res.json({ success: true });
  } catch (error) {
    console.error('خطأ في حذف الرسالة:', error);
    res.status(500).json({ error: 'فشل في حذف الرسالة' });
  }
});

// Edit message
router.put('/messages/:messageId', async (req, res) => {
  try {
    const { messageId } = req.params;
    const { content, userId } = req.body;

    const messages = await dataManager.readData('messages') || [];
    const messageIndex = messages.findIndex((msg: any) => msg.id === messageId);

    if (messageIndex === -1) {
      return res.status(404).json({ error: 'الرسالة غير موجودة' });
    }

    const message = messages[messageIndex];

    // Check if user can edit this message
    if (message.senderId !== userId) {
      return res.status(403).json({ error: 'غير مصرح لك بتعديل هذه الرسالة' });
    }

    // Update message
    messages[messageIndex] = {
      ...message,
      content,
      edited: true,
      editedAt: new Date().toISOString(),
    };

    await dataManager.writeData('messages', messages);

    res.json(messages[messageIndex]);
  } catch (error) {
    console.error('خطأ في تعديل الرسالة:', error);
    res.status(500).json({ error: 'فشل في تعديل الرسالة' });
  }
});

// Search messages
router.get('/search', async (req, res) => {
  try {
    const { query, userId, conversationId, limit = 20 } = req.query;

    if (!query || !userId) {
      return res.status(400).json({ error: 'Query and userId are required' });
    }

    const messages = await dataManager.readData('messages') || [];
    const conversations = await dataManager.readData('conversations') || [];

    // Get user's conversations
    const userConversations = conversations.filter((conv: any) =>
      conv.participants.some((p: any) => p.userId === userId)
    );

    const userConversationIds = userConversations.map((conv: any) => conv.id);

    // Filter messages
    let filteredMessages = messages.filter((msg: any) => {
      // Only messages from user's conversations
      if (!userConversationIds.includes(msg.conversationId)) return false;
      
      // Filter by specific conversation if provided
      if (conversationId && msg.conversationId !== conversationId) return false;
      
      // Search in content
      return msg.content.toLowerCase().includes((query as string).toLowerCase()) ||
             msg.content.includes(query as string);
    });

    // Sort by relevance and time
    filteredMessages = filteredMessages
      .sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, Number(limit));

    res.json({ messages: filteredMessages });
  } catch (error) {
    console.error('خطأ في البحث:', error);
    res.status(500).json({ error: 'فشل في البحث' });
  }
});

// Get conversation info
router.get('/conversations/:conversationId', async (req, res) => {
  try {
    const { conversationId } = req.params;

    const conversations = await dataManager.readData('conversations') || [];
    const conversation = conversations.find((conv: any) => conv.id === conversationId);

    if (!conversation) {
      return res.status(404).json({ error: 'المحادثة غير موجودة' });
    }

    res.json(conversation);
  } catch (error) {
    console.error('خطأ في جلب معلومات المحادثة:', error);
    res.status(500).json({ error: 'فشل في جلب معلومات المحادثة' });
  }
});

// Initialize default data
router.post('/init-demo-data', async (req, res) => {
  try {
    const conversations = await dataManager.readData('conversations') || [];
    
    if (conversations.length === 0) {
      // Create demo conversations
      const demoConversations = [
        {
          id: 'conv-demo-support',
          type: 'support',
          name: 'Customer Support',
          nameAr: 'دعم العملاء',
          description: 'Get help with your cleaning services',
          descriptionAr: 'احصل على المساعدة مع خدمات التنظيف',
          participants: [
            {
              userId: 'admin-1',
              name: 'Support Team',
              nameAr: 'فريق الدعم',
              avatar: '/avatars/support.png',
              role: 'admin',
              joinedAt: new Date().toISOString(),
              lastSeen: new Date().toISOString(),
              isOnline: true,
              permissions: ['read', 'write', 'delete'],
            }
          ],
          isPinned: true,
          isArchived: false,
          isMuted: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          avatar: '/avatars/support.png',
          settings: {
            canAddMembers: false,
            canRemoveMembers: false,
            canEditMessages: false,
            canDeleteMessages: false,
            allowAttachments: true,
            maxAttachmentSize: 10,
            allowedAttachmentTypes: ['image/*', 'application/pdf'],
          },
        }
      ];

      await dataManager.writeData('conversations', demoConversations);

      // Create demo messages
      const demoMessages = [
        {
          id: 'msg-demo-1',
          conversationId: 'conv-demo-support',
          senderId: 'admin-1',
          content: 'مرحباً! كيف يمكنني مساعدتك اليوم؟',
          type: 'text',
          timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 minutes ago
          status: 'read',
          reactions: [],
          edited: false,
          deleted: false,
        }
      ];

      await dataManager.writeData('messages', demoMessages);
    }

    res.json({ success: true, message: 'تم تهيئة البيانات التجريبية' });
  } catch (error) {
    console.error('خطأ في تهيئة البيانات التجريبية:', error);
    res.status(500).json({ error: 'فشل في تهيئة البيانات التجريبية' });
  }
});

export default router;
