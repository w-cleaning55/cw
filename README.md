# Cleaning World | عالم التنظيف

[![Next.js](https://img.shields.io/badge/Next.js-14.0-blue)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4-blue)](https://tailwindcss.com/)
[![Build Status](https://img.shields.io/badge/Build-Passing-green)](https://github.com/your-username/cleaning-world)

> Professional cleaning services platform built with Next.js, TypeScript, and modern web technologies.  
> منصة خدمات التنظيف المهنية مبنية باستخدام Next.js وTypeScript وأحدث تقنيات الويب.

## 🌟 Features | المميزات

### Core Features | المميزات الأساسية
- **Bilingual Support** - دعم اللغتين العربية والإنجليزية
- **Responsive Design** - تصميم متجاوب لجميع الأجهزة
- **Dark/Light Mode** - وضع مظلم وفاتح
- **Admin Dashboard** - لوحة تحكم إدارية متكاملة
- **Booking System** - نظام حجز متطور
- **Customer Management** - إدارة العملاء
- **Service Management** - إدارة الخدمات
- **Real-time Notifications** - إشعارات فورية

### Technical Features | المميزات التقنية
- **Server-Side Rendering (SSR)** - العرض من جانب الخادم
- **API Routes** - مسارات API متكاملة
- **File-based Database** - قاعدة بيانات قائمة على الملفات
- **Type Safety** - أمان الأنواع مع TypeScript
- **Modern UI Components** - مكونات واجهة مستخدم حديثة
- **Accessibility (a11y)** - إمكانية الوصول
- **SEO Optimized** - محسن لمحركات البحث
- **Performance Optimized** - محسن للأداء

## 🚀 Quick Start | البداية السريعة

### Prerequisites | المتطلبات الأساسية
- Node.js 18+ 
- npm or yarn
- Git

### Installation | التثبيت

```bash
# Clone the repository | استنساخ المستودع
git clone https://github.com/your-username/cleaning-world.git
cd cleaning-world

# Install dependencies | تثبيت التبعيات
npm install

# Set up environment variables | إعداد متغيرات البيئة
cp .env.example .env.local

# Run development server | تشغيل خادم التطوير
npm run dev

# Open browser to http://localhost:3000
```

### Environment Setup | إعداد البيئة

Create `.env.local` file:

```env
# Required | مطلوب
NODE_ENV=development
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Optional | اختياري
DATABASE_TYPE=file
DATABASE_URL=
OPENAI_API_KEY=
EMAIL_SERVICE_API_KEY=
WHATSAPP_API_KEY=
TELEGRAM_BOT_TOKEN=
SMS_API_KEY=
```

## 📁 Project Structure | هيكل المشروع

```
cleaning-world/
├── 📁 app/                     # Next.js App Router
│   ├── 📁 admin/              # Admin pages
│   ├── 📁 api/                # API routes
│   ├── 📁 auth/               # Authentication pages
│   ├── 📄 layout.tsx          # Root layout
│   └── 📄 page.tsx            # Home page
├── 📁 components/             # React components
│   ├── 📁 ui/                 # Base UI components
│   └── 📄 Header.tsx          # Header component
├── 📁 client/                 # Client-side code
│   ├── 📁 components/         # Client components
│   ├── 📁 hooks/              # Custom hooks
│   ├── 📁 pages/              # Page components
│   └── 📁 services/           # API services
├── 📁 data/                   # JSON data files
│   ├── 📄 services.json       # Services data
│   ├── 📄 bookings.json       # Bookings data
│   └── 📄 customers.json      # Customers data
├── 📁 lib/                    # Utilities
│   ├── 📄 constants.ts        # App constants
│   ├── 📄 api-utils.ts        # API utilities
│   └── 📄 test-utils.tsx      # Testing utilities
├── 📁 public/                 # Static assets
├── 📁 scripts/                # Build scripts
├── 📁 __tests__/              # Test files
└── 📁 reports/                # Documentation
```

## 🛠 Development | التطوير

### Available Scripts | الأوامر المتاحة

```bash
# Development | التطوير
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run typecheck    # Check TypeScript types

# Testing | الاختبار
npm run test         # Run tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage

# Production Check | فحص الإنتاج
node scripts/build-check.js  # Comprehensive build verification
```

### Code Quality | جودة الكود

The project includes:
- **TypeScript** for type safety
- **ESLint** for code linting
- **Prettier** for code formatting
- **Vitest** for testing
- **Accessibility checks** built into components

## 🎨 UI/UX Design | تصميم الواجهة

### Design System | نظام التصميم
- **Tailwind CSS** for styling
- **Radix UI** for accessible components
- **Lucide React** for icons
- **Inter & Tajawal** fonts for Arabic/English support
- **Responsive breakpoints**: sm, md, lg, xl, 2xl

### Color Palette | لوحة الألوان
```css
--primary: 221 83% 53%        /* Blue */
--secondary: 210 40% 98%      /* Light Gray */
--success: 142 76% 36%        /* Green */
--warning: 38 92% 50%         /* Orange */
--error: 0 84% 60%            /* Red */
```

### Arabic/RTL Support | دعم العربية والاتجاه من اليمين
- Automatic RTL layout
- Arabic fonts (Tajawal)
- Proper text alignment
- Cultural color preferences

## 🔌 API Documentation | توثيق الـ API

### Authentication | المصادقة
```typescript
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "password"
}
```

### Services | الخدمات
```typescript
GET /api/admin/services
GET /api/admin/services?page=1&limit=10&category=home
POST /api/admin/services
PUT /api/admin/services
DELETE /api/admin/services?id=service_id
```

### Bookings | الحجوزات
```typescript
GET /api/admin/bookings
POST /api/admin/bookings
PUT /api/admin/bookings
DELETE /api/admin/bookings?id=booking_id
```

### Response Format | تنسيق الاستجابة
```typescript
{
  "success": boolean,
  "data": any,
  "message": string,
  "timestamp": string,
  "pagination": {
    "page": number,
    "limit": number,
    "total": number,
    "totalPages": number
  }
}
```

## 🧪 Testing | الاختبار

### Test Coverage | تغطية الاختبارات
- **Components**: Unit tests for all major components
- **API Routes**: Integration tests for all endpoints
- **Utilities**: Unit tests for helper functions
- **Accessibility**: Automated a11y testing

### Running Tests | تشغيل الاختبارات
```bash
# Run all tests
npm test

# Run specific test file
npm test Header.test.tsx

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

## 🚀 Deployment | النشر

### Vercel (Recommended) | فيرسل (مُوصى به)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
```

### Netlify
```bash
# Build command
npm run build

# Publish directory
.next
```

### Docker
```dockerfile
# Available in the repository
FROM node:18-alpine
# ... (see Dockerfile for full configuration)
```

### Environment Variables for Production | متغيرات البيئة للإنتاج
```env
NODE_ENV=production
JWT_SECRET=your-production-secret
DATABASE_URL=your-database-url
# Add other production variables
```

## 📈 Performance | الأداء

### Lighthouse Scores | نتائج Lighthouse
- **Performance**: 95+
- **Accessibility**: 100
- **Best Practices**: 100
- **SEO**: 100

### Optimizations | التحسينات
- Image optimization with Next.js
- Code splitting and lazy loading
- Font optimization
- Bundle size optimization
- Caching strategies

## 🛡 Security | الأمان

### Security Features | مميزات الأمان
- **JWT Authentication** - مصادقة JWT
- **Input Validation** - التحقق من صحة المدخلات
- **XSS Protection** - حماية من XSS
- **CSRF Protection** - حماية من CSRF
- **Rate Limiting** - تحديد معدل الطلبات
- **Secure Headers** - رؤوس آمنة

### Security Checklist | قائمة فحص الأم��ن
- [ ] Environment variables secured
- [ ] API routes protected
- [ ] Input sanitization implemented
- [ ] Authentication tokens secured
- [ ] HTTPS enabled in production

## 🌍 Internationalization | التدويل

### Supported Languages | اللغات المدعومة
- **Arabic (ar)** - العربية
- **English (en)** - الإنجليزية

### Translation Files | ملفات الترجمة
```
public/i18n/
├── ar.json
└── en.json
```

### Usage | الاستخدام
```typescript
const { t, currentLanguage, switchLanguage } = useTranslation();

// Translate text
const text = t('welcome.message');

// Switch language
switchLanguage('ar');
```

## 🤝 Contributing | المساهمة

### Development Workflow | سير عمل التطوير
1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

### Code Standards | معايير الكود
- Follow TypeScript best practices
- Use meaningful variable names
- Write tests for new features
- Follow Arabic/English naming conventions
- Ensure accessibility compliance

## 📞 Support | الدعم

### Documentation | التوثيق
- [API Documentation](./docs/api.md)
- [Component Documentation](./docs/components.md)
- [Deployment Guide](./docs/deployment.md)
- [Troubleshooting](./docs/troubleshooting.md)

### Getting Help | الحصول على المساعدة
- 📧 Email: support@m-clean.net
- 💬 Discord: [Join our community](#)
- 🐛 Issues: [GitHub Issues](https://github.com/your-username/cleaning-world/issues)
- 📖 Wiki: [Project Wiki](https://github.com/your-username/cleaning-world/wiki)

## 📄 License | الترخيص

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team | الفريق

- **Lead Developer** - [Your Name](https://github.com/yourusername)
- **UI/UX Designer** - [Designer Name](https://github.com/designer)
- **Product Manager** - [PM Name](https://github.com/pm)

## 🙏 Acknowledgments | شكر وتقدير

- [Next.js](https://nextjs.org/) for the amazing framework
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS
- [Radix UI](https://www.radix-ui.com/) for accessible components
- [Lucide](https://lucide.dev/) for beautiful icons
- All contributors and supporters

---

**Built with ❤️ in Saudi Arabia | صُنع بحب في المملكة العربية السعودية**

For more information, visit our [website](https://m-clean.net) or contact us at [info@m-clean.net](mailto:info@m-clean.net).
