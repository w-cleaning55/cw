import { aiManager, AIMessage } from './index';
import { databaseManager } from '../database';

export interface ChatSession {
  id: string;
  userId?: string;
  customerInfo?: {
    name?: string;
    phone?: string;
    email?: string;
    location?: string;
  };
  context: 'customerService' | 'sales' | 'technical' | 'booking';
  messages: AIMessage[];
  intent?: string;
  entities: Record<string, any>;
  currentStep?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface KnowledgeBase {
  services: Array<{
    id: string;
    name: string;
    nameAr: string;
    description: string;
    descriptionAr: string;
    price: string;
    duration: string;
    features: string[];
    category: string;
    isActive: boolean;
  }>;
  
  faqs: Array<{
    id: string;
    question: string;
    questionAr: string;
    answer: string;
    answerAr: string;
    category: string;
    keywords: string[];
    popularity: number;
  }>;
  
  policies: Array<{
    id: string;
    title: string;
    titleAr: string;
    content: string;
    contentAr: string;
    type: 'cancellation' | 'refund' | 'privacy' | 'terms';
  }>;
  
  promotions: Array<{
    id: string;
    title: string;
    titleAr: string;
    description: string;
    descriptionAr: string;
    discount: number;
    validUntil: string;
    conditions: string[];
    isActive: boolean;
  }>;
}

class SmartChatbot {
  private sessions: Map<string, ChatSession> = new Map();
  private knowledgeBase: KnowledgeBase | null = null;
  private isLearning: boolean = true;

  async initialize(): Promise<void> {
    await this.loadKnowledgeBase();
    this.setupPeriodicLearning();
  }

  async loadKnowledgeBase(): Promise<void> {
    try {
      // Load services
      const servicesData = await databaseManager.read('services');
      const services = servicesData?.services || [];

      // Load FAQs
      const faqsData = await databaseManager.read('faqs');
      const faqs = faqsData?.faqs || [];

      // Load policies
      const policiesData = await databaseManager.read('policies');
      const policies = policiesData?.policies || [];

      // Load promotions
      const promotionsData = await databaseManager.read('promotions');
      const promotions = promotionsData?.promotions || [];

      this.knowledgeBase = {
        services,
        faqs,
        policies,
        promotions
      };

      console.log('Knowledge base loaded successfully');
    } catch (error) {
      console.error('Failed to load knowledge base:', error);
      // Initialize with empty knowledge base
      this.knowledgeBase = {
        services: [],
        faqs: [],
        policies: [],
        promotions: []
      };
    }
  }

  async createSession(context: ChatSession['context'], customerInfo?: ChatSession['customerInfo']): Promise<string> {
    const sessionId = `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const session: ChatSession = {
      id: sessionId,
      customerInfo,
      context,
      messages: [],
      entities: {},
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.sessions.set(sessionId, session);
    
    // Add initial system message based on context
    await this.addSystemMessage(sessionId);
    
    return sessionId;
  }

  private async addSystemMessage(sessionId: string): Promise<void> {
    const session = this.sessions.get(sessionId);
    if (!session || !this.knowledgeBase) return;

    let systemPrompt = '';
    
    switch (session.context) {
      case 'customerService':
        systemPrompt = this.buildCustomerServicePrompt();
        break;
      case 'sales':
        systemPrompt = this.buildSalesPrompt();
        break;
      case 'technical':
        systemPrompt = this.buildTechnicalPrompt();
        break;
      case 'booking':
        systemPrompt = this.buildBookingPrompt();
        break;
    }

    session.messages.push({
      role: 'system',
      content: systemPrompt,
      timestamp: new Date().toISOString()
    });
  }

  private buildCustomerServicePrompt(): string {
    if (!this.knowledgeBase) return '';

    const servicesInfo = this.knowledgeBase.services
      .filter(s => s.isActive)
      .map(s => `- ${s.nameAr} (${s.name}): ${s.descriptionAr} - السعر: ${s.price} - المدة: ${s.duration}`)
      .join('\n');

    const promotionsInfo = this.knowledgeBase.promotions
      .filter(p => p.isActive)
      .map(p => `- ${p.titleAr}: ${p.descriptionAr} - خصم ${p.discount}%`)
      .join('\n');

    const faqsInfo = this.knowledgeBase.faqs
      .slice(0, 10) // Top 10 FAQs
      .map(f => `س: ${f.questionAr}\nج: ${f.answerAr}`)
      .join('\n\n');

    return `أنت مساعد ذكي متخصص في خدمة العملاء لشركة تنظيف. المعلومات المحدثة:

الخدمات المتاحة:
${servicesInfo}

العروض الحالية:
${promotionsInfo}

الأسئلة الشائعة:
${faqsInfo}

دورك:
1. الترحيب بالعملاء بطريقة ودودة ومهنية
2. فهم احتياجاتهم وتقديم الخدمة المناسبة
3. الإجابة على الاستفسارات بدقة
4. مساعدتهم في الحجز إذا رغبوا
5. تقديم معلومات عن العروض والخصومات
6. حل المشاكل والشكاوى

تأكد من:
- استخدام اللغة العربية كلغة أساسية
- الحفاظ على الطابع السعودي في التعامل
- تقديم معلومات دقيقة ومحدثة
- عدم اختلاق معلومات غير موجودة`;
  }

  private buildSalesPrompt(): string {
    if (!this.knowledgeBase) return '';

    const servicesInfo = this.knowledgeBase.services
      .filter(s => s.isActive)
      .map(s => {
        const features = s.features.join(', ');
        return `- ${s.nameAr}: ${s.descriptionAr}\n  السعر: ${s.price}\n  المميزات: ${features}`;
      })
      .join('\n\n');

    const promotionsInfo = this.knowledgeBase.promotions
      .filter(p => p.isActive)
      .map(p => `- ${p.titleAr}: خصم ${p.discount}% (صالح حتى ${p.validUntil})`)
      .join('\n');

    return `أنت خبير مبيعات محترف لشركة تنظيف. هدفك زيادة المبيعات وإقناع العملاء.

خدماتنا المميزة:
${servicesInfo}

العروض الحالية:
${promotionsInfo}

استراتيجية المبيعات:
1. فهم احتياجات العميل بدقة
2. تقديم الحل المناسب من خدماتنا
3. إبراز المميزات والفوائد
4. استخدام العروض والخصومات بذكاء
5. خلق إحساس بالحاجة والعجلة
6. تسهيل عملية الحجز والدفع

تقنيات البيع:
- استخدم الأسئلة المفتوحة لفهم الاحتياجات
- اربط الخدمات بفوائد ملموسة
- تعامل مع الاعتراضات بذكاء
- قدم شهادات وأمثلة نجاح
- استخدم مبدأ الندرة والعجلة

كن مقنعاً ومهنياً وودوداً`;
  }

  private buildTechnicalPrompt(): string {
    return `أنت خبير تقني متخصص في مجال التنظيف. تقدم معلومات تقنية دقيقة ونصائح عملية.

خبرتك تشمل:
1. أنواع المعدات والأدوات المستخدمة
2. المواد الكيميائية وطرق استخدامها الآمن
3. تقنيات التنظيف المختلفة
4. حل المشاكل التقنية
5. الصيانة والعناية
6. معايير الجودة والسلامة

تأكد من:
- تقديم معلومات دقيقة وموثوقة
- شرح التقنيات بطريقة مفهومة
- التأكيد على السلامة
- تقديم نصائح عملية
- استخدام المصطلحات التقنية الصحيحة`;
  }

  private buildBookingPrompt(): string {
    if (!this.knowledgeBase) return '';

    const activeServices = this.knowledgeBase.services
      .filter(s => s.isActive)
      .map(s => `${s.nameAr} (${s.price})`)
      .join(', ');

    return `أنت مساعد حجز ذكي. مهمتك مساعدة العملاء في إتمام حجز الخدمات بسهولة.

الخدمات المتاحة: ${activeServices}

خطوات الحجز:
1. تحديد الخدمة المطلوبة
2. جمع معلومات العميل (الاسم، الهاتف، العنوان)
3. تحديد التاريخ والوقت المناسب
4. تأكيد التفاصيل والسعر
5. إتمام الحجز

معلومات مطلوبة للحجز:
- اسم العميل
- رقم الهاتف
- العنوان التفصيلي
- نوع الخدمة
- التاريخ والوقت المفضل
- أي ملاحظات خاصة

كن ودوداً وصبوراً واجمع المعلومات بطريقة منظمة`;
  }

  async sendMessage(sessionId: string, message: string, isFromUser: boolean = true): Promise<string> {
    const session = this.sessions.get(sessionId);
    if (!session || !session.isActive) {
      throw new Error('Session not found or inactive');
    }

    // Add user message
    if (isFromUser) {
      session.messages.push({
        role: 'user',
        content: message,
        timestamp: new Date().toISOString()
      });

      // Extract entities and intent
      await this.extractEntitiesAndIntent(session, message);
    }

    // Generate AI response
    const response = await this.generateResponse(session);

    // Add AI response
    session.messages.push({
      role: 'assistant',
      content: response,
      timestamp: new Date().toISOString()
    });

    session.updatedAt = new Date().toISOString();

    // Learn from the interaction
    if (this.isLearning) {
      await this.learnFromInteraction(session);
    }

    return response;
  }

  private async generateResponse(session: ChatSession): Promise<string> {
    try {
      if (!aiManager.isConnected()) {
        return this.getFallbackResponse(session);
      }

      // Use the context-specific system prompt
      const response = await aiManager.generateResponse(
        session.messages,
        session.context,
        {
          temperature: 0.7,
          maxTokens: 1000
        }
      );

      return response.content;
    } catch (error) {
      console.error('AI response generation failed:', error);
      return this.getFallbackResponse(session);
    }
  }

  private getFallbackResponse(session: ChatSession): string {
    const arabicResponses = [
      'أعتذر، أواجه صعوبة تقنية حالياً. يمكنك التواصل معنا على الهاتف للحصول على مساعدة فورية.',
      'نشكرك لصبرك. يرجى المحاولة مرة أخرى أو الاتصال بنا مباشرة.',
      'أعتذر عن هذا الانقطاع المؤقت. فريقنا متاح للمساعدة عبر الهاتف.'
    ];

    return arabicResponses[Math.floor(Math.random() * arabicResponses.length)];
  }

  private async extractEntitiesAndIntent(session: ChatSession, message: string): Promise<void> {
    // Simple entity extraction (can be enhanced with NLP libraries)
    const patterns = {
      phone: /(\+966|0)?[5-9]\d{8}/g,
      email: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
      price: /(\d+)\s*(ريال|ر\.س|SAR)/g,
      time: /(صباح|مساء|ظهر|\d{1,2}:\d{2})/g,
      date: /(\d{1,2}\/\d{1,2}|\d{1,2}-\d{1,2}|غداً|بعد غد|الأسبوع القادم)/g
    };

    Object.entries(patterns).forEach(([entity, pattern]) => {
      const matches = message.match(pattern);
      if (matches) {
        session.entities[entity] = matches;
      }
    });

    // Simple intent detection
    const intents = {
      booking: ['حجز', 'أريد', 'أحتاج', 'موعد', 'تنظيف'],
      pricing: ['سعر', 'كم', 'تكلفة', 'ثمن'],
      information: ['معلومات', 'ما هو', 'كيف', 'متى'],
      complaint: ['شكوى', 'مشكلة', 'غير راضي', 'سيء']
    };

    for (const [intent, keywords] of Object.entries(intents)) {
      if (keywords.some(keyword => message.includes(keyword))) {
        session.intent = intent;
        break;
      }
    }
  }

  private async learnFromInteraction(session: ChatSession): Promise<void> {
    try {
      // Save successful interactions as potential FAQs
      if (session.messages.length >= 4) { // At least 2 exchanges
        const lastUserMessage = session.messages[session.messages.length - 2];
        const lastAIMessage = session.messages[session.messages.length - 1];

        if (lastUserMessage.role === 'user' && lastAIMessage.role === 'assistant') {
          // Store as potential FAQ
          await this.storePotentialFAQ({
            question: lastUserMessage.content,
            answer: lastAIMessage.content,
            category: session.context,
            timestamp: new Date().toISOString()
          });
        }
      }

      // Learn from entity extraction
      if (Object.keys(session.entities).length > 0) {
        await this.updateEntityRecognition(session.entities);
      }

    } catch (error) {
      console.error('Learning from interaction failed:', error);
    }
  }

  private async storePotentialFAQ(faq: any): Promise<void> {
    try {
      const potentialFAQs = await databaseManager.read('potential-faqs');
      const faqs = potentialFAQs?.['potential-faqs'] || [];
      
      faqs.push({
        id: `faq_${Date.now()}`,
        ...faq,
        needsReview: true,
        createdAt: new Date().toISOString()
      });

      await databaseManager.update('potential-faqs', 'potential-faqs', { 'potential-faqs': faqs });
    } catch (error) {
      console.error('Failed to store potential FAQ:', error);
    }
  }

  private async updateEntityRecognition(entities: Record<string, any>): Promise<void> {
    // This would update entity recognition patterns based on successful extractions
    // For now, we'll just log for analysis
    console.log('Entities extracted:', entities);
  }

  private setupPeriodicLearning(): void {
    // Update knowledge base every hour
    setInterval(async () => {
      await this.loadKnowledgeBase();
    }, 60 * 60 * 1000);

    // Clean up inactive sessions every 30 minutes
    setInterval(() => {
      this.cleanupInactiveSessions();
    }, 30 * 60 * 1000);
  }

  private cleanupInactiveSessions(): void {
    const now = new Date().getTime();
    const maxAge = 2 * 60 * 60 * 1000; // 2 hours

    for (const [sessionId, session] of this.sessions.entries()) {
      const lastUpdate = new Date(session.updatedAt).getTime();
      if (now - lastUpdate > maxAge) {
        this.sessions.delete(sessionId);
      }
    }
  }

  async getSession(sessionId: string): Promise<ChatSession | null> {
    return this.sessions.get(sessionId) || null;
  }

  async endSession(sessionId: string): Promise<void> {
    const session = this.sessions.get(sessionId);
    if (session) {
      session.isActive = false;
      session.updatedAt = new Date().toISOString();
      
      // Save session to database for analysis
      await this.saveSessionToDatabase(session);
      
      // Remove from memory after a delay
      setTimeout(() => {
        this.sessions.delete(sessionId);
      }, 5 * 60 * 1000); // 5 minutes
    }
  }

  private async saveSessionToDatabase(session: ChatSession): Promise<void> {
    try {
      await databaseManager.create('chat-sessions', {
        ...session,
        endedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Failed to save session to database:', error);
    }
  }

  // Get analytics and insights
  async getAnalytics(): Promise<any> {
    const activeSessions = Array.from(this.sessions.values()).filter(s => s.isActive);
    
    return {
      activeSessions: activeSessions.length,
      sessionsByContext: this.groupSessionsByContext(activeSessions),
      commonIntents: this.getCommonIntents(activeSessions),
      averageResponseTime: await this.calculateAverageResponseTime(),
      customerSatisfaction: await this.getCustomerSatisfactionScore()
    };
  }

  private groupSessionsByContext(sessions: ChatSession[]): Record<string, number> {
    return sessions.reduce((acc, session) => {
      acc[session.context] = (acc[session.context] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }

  private getCommonIntents(sessions: ChatSession[]): Record<string, number> {
    return sessions.reduce((acc, session) => {
      if (session.intent) {
        acc[session.intent] = (acc[session.intent] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);
  }

  private async calculateAverageResponseTime(): Promise<number> {
    // Calculate average response time from database
    // This is a placeholder implementation
    return 2.5; // seconds
  }

  private async getCustomerSatisfactionScore(): Promise<number> {
    // Calculate customer satisfaction from feedback
    // This is a placeholder implementation
    return 4.2; // out of 5
  }
}

// Global smart chatbot instance
export const smartChatbot = new SmartChatbot();

// Initialize chatbot
smartChatbot.initialize().catch(console.error);
