# عالم النظافة - Cleaning World Pro

شركة تنظيف محترفة في جدة تقدم خدمات تنظيف شاملة للمنازل والمكاتب والمنشآت التجارية.

## 🚀 المميزات

- **تصميم عصري ومتجاوب** - يعمل على جميع الأجهزة
- **دعم متعدد اللغات** - العربية والإنجليزية مع دعم RTL/LTR
- **نظام ثيمات متقدم** - الوضع الفاتح والداكن والتلقائي
- **لوحة إدارة شاملة** - إدارة المحتوى والخدمات والعملاء
- **نظام مصادقة آمن** - JWT مع إدارة الصلاحيات
- **نموذج اتصال تفاعلي** - مع التحقق من صحة البيانات
- **تحسين محركات البحث** - SEO محسن مع البيانات المنظمة
- **أداء عالي** - تحسينات متقدمة للسرعة والأداء

## 🛠️ التقنيات المستخدمة

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS, Radix UI
- **Authentication**: JWT, bcryptjs
- **Validation**: Zod
- **Icons**: Lucide React
- **Deployment**: Vercel/Netlify ready

## 📋 المتطلبات

- Node.js 18.17.0 أو أحدث
- npm 9.0.0 أو أحدث

## 🚀 التثبيت والتشغيل

### 1. استنساخ المشروع

```bash
git clone https://github.com/cleaning-world/cleaning-world-pro.git
cd cleaning-world-pro
```

### 2. تثبيت التبعيات

```bash
npm install
```

### 3. إعداد متغيرات البيئة

أنشئ ملف `.env.local` في المجلد الجذر:

```env
# Authentication
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# Database (for future use)
DATABASE_URL=your-database-url

# Email (for future use)
SMTP_HOST=your-smtp-host
SMTP_PORT=587
SMTP_USER=your-smtp-user
SMTP_PASS=your-smtp-password

# Analytics
NEXT_PUBLIC_GA_ID=your-google-analytics-id

# Social Media
NEXT_PUBLIC_FACEBOOK_APP_ID=your-facebook-app-id
NEXT_PUBLIC_TWITTER_HANDLE=@cleaningworld
```

### 4. تشغيل المشروع في وضع التطوير

```bash
npm run dev
```

افتح [http://localhost:3000](http://localhost:3000) في المتصفح.

### 5. بناء المشروع للإنتاج

```bash
npm run build
npm start
```

## 📁 هيكل المشروع

```
cw/
├── app/                    # Next.js App Router
│   ├── admin/             # لوحة الإدارة
│   ├── api/               # API endpoints
│   ├── auth/              # صفحات المصادقة
│   ├── about/             # صفحة من نحن
│   ├── services/          # صفحة الخدمات
│   ├── contact/           # صفحة الاتصال
│   └── globals.css        # الأنماط العامة
├── components/            # مكونات React
│   ├── ui/               # مكونات UI الأساسية
│   ├── admin/            # مكونات لوحة الإدارة
│   ├── sections/         # أقسام الصفحات
│   └── layout/           # مكونات التخطيط
├── hooks/                # React Hooks
├── lib/                  # مكتبات ووظائف مساعدة
├── data/                 # البيانات الثابتة
├── public/               # الملفات العامة
└── reports/              # التقارير
```

## 🔐 نظام المصادقة

### بيانات الدخول الافتراضية

- **اسم المستخدم**: `admin`
- **كلمة المرور**: `admin123`

### إدارة الصلاحيات

- **Admin**: صلاحيات كاملة
- **Manager**: إدارة المحتوى والخدمات
- **Operator**: إدارة الحجوزات والعملاء

## 🌐 النشر

### Vercel (موصى به)

1. اربط مستودع GitHub بـ Vercel
2. أضف متغيرات البيئة في إعدادات Vercel
3. انشر تلقائياً

### Netlify

1. اربط مستودع GitHub بـ Netlify
2. أضف متغيرات البيئة
3. انشر تلقائياً

### Docker

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

## 📊 الأداء والتحسين

### تحسينات مدمجة

- **Lazy Loading**: تحميل المكونات عند الحاجة
- **Image Optimization**: تحسين الصور تلقائياً
- **Code Splitting**: تقسيم الكود لتحسين الأداء
- **Caching**: تخزين مؤقت ذكي
- **Bundle Analysis**: تحليل حجم الحزم

### مراقبة الأداء

```bash
# تحليل حجم الحزم
npm run build:analyze

# فحص الأداء
npm run performance-check
```

## 🔧 الأوامر المتاحة

```bash
# التطوير
npm run dev              # تشغيل خادم التطوير
npm run dev:fast         # تشغيل سريع للتطوير

# البناء
npm run build            # بناء المشروع
npm run build:fast       # بناء سريع
npm run build:analyze    # بناء مع تحليل الحزم

# الفحص والتحسين
npm run lint             # فحص الكود
npm run typecheck        # فحص الأنواع
npm run format           # تنسيق الكود

# التنظيف
npm run clean            # تنظيف ملفات البناء
npm run clean:all        # تنظيف شامل

# قاعدة البيانات
npm run db:seed          # ملء قاعدة البيانات
```

## 🎨 التخصيص

### الألوان والثيمات

يمكن تخصيص الألوان من خلال:
- `tailwind.config.ts` - إعدادات Tailwind
- `app/globals.css` - متغيرات CSS
- `lib/constants.ts` - ألوان التطبيق

### المحتوى

يمكن تعديل المحتوى من خلال:
- `data/` - البيانات الثابتة
- `lib/constants.ts` - النصوص والروابط
- لوحة الإدارة - المحتوى الديناميكي

## 🔒 الأمان

### ميزات الأمان المدمجة

- **JWT Authentication**: مصادقة آمنة
- **Password Hashing**: تشفير كلمات المرور
- **Rate Limiting**: حماية من الهجمات
- **Input Validation**: التحقق من المدخلات
- **XSS Protection**: حماية من XSS
- **CSRF Protection**: حماية من CSRF

### أفضل الممارسات

1. غيّر `JWT_SECRET` في الإنتاج
2. استخدم HTTPS في الإنتاج
3. فعّل Rate Limiting
4. راقب السجلات بانتظام
5. حدث التبعيات دورياً

## 📈 SEO والتحليلات

### تحسين محركات البحث

- **Meta Tags**: علامات وصفية محسنة
- **Structured Data**: بيانات منظمة
- **Sitemap**: خريطة الموقع
- **Robots.txt**: ملف الروبوتات
- **Open Graph**: مشاركة وسائل التواصل

### التحليلات

- **Google Analytics**: تتبع الزوار
- **Vercel Analytics**: تحليلات Vercel
- **Performance Monitoring**: مراقبة الأداء

## 🐛 استكشاف الأخطاء

### مشاكل شائعة

1. **خطأ في المصادقة**
   - تأكد من صحة بيانات الدخول
   - تحقق من إعدادات JWT_SECRET

2. **مشاكل في البناء**
   - امسح cache: `npm run clean`
   - أعد تثبيت التبعيات: `rm -rf node_modules && npm install`

3. **مشاكل في الأداء**
   - استخدم `npm run build:analyze`
   - تحقق من حجم الصور
   - فعّل ضغط Gzip

### السجلات

```bash
# سجلات التطوير
npm run dev

# سجلات الإنتاج
npm start
```

## 🤝 المساهمة

1. Fork المشروع
2. أنشئ فرع للميزة الجديدة
3. اكتب الكود مع الاختبارات
4. أرسل Pull Request

## 📄 الترخيص

هذا المشروع مرخص تحت رخصة MIT.

## 📞 الدعم

- **البريد الإلكتروني**: admin@cw.com.sa
- **الهاتف**: +966559061065
- **الموقع**: جدة، المملكة العربية السعودية

## 🔄 التحديثات

### الإصدار 1.0.0
- ✅ نظام مصادقة كامل
- ✅ لوحة إدارة شاملة
- ✅ تصميم متجاوب
- ✅ دعم متعدد اللغات
- ✅ نظام ثيمات متقدم
- ✅ نموذج اتصال تفاعلي
- ✅ تحسينات SEO
- ✅ تحسينات الأداء

---

**تم التطوير بواسطة فريق عالم النظافة** 🧹✨
