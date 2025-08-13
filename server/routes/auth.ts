import { Router, Request, Response } from 'express';
import { z } from 'zod';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { dataManager } from '../utils/dataManager';

const router = Router();

// JWT Secret (في الإنتاج يجب أن يكون في متغير البيئة)
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';

// Schema للتحقق من بيانات تسجيل الدخول
const LoginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

// Schema للتحقق من بيانات التسجيل
const RegisterSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['admin', 'manager', 'operator']),
  permissions: z.array(z.object({
    module: z.string(),
    actions: z.array(z.enum(['create', 'read', 'update', 'delete']))
  }))
});

// Middleware للتحقق من JWT token
export const authenticateToken = (req: any, res: Response, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

function maskHash(hash: string): string {
  if (!hash || hash.length < 14) return hash;
  return `${hash.slice(0, 10)}...${hash.slice(-4)}`;
}

// تسجيل الدخول
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { username, password } = LoginSchema.parse(req.body);
    const debugEnabled = process.env.DEBUG_AUTH === '1' || (req.query?.debug === '1');
    
    // جلب المستخدمين من قاعدة البيانات
    let users = await dataManager.readData('users') || [];
    
    // إذا لم يوجد مستخدمين، إنشاء مستخدم admin افتراضي
    if (users.length === 0) {
      const defaultAdmin = {
        id: 'admin-1',
        username: 'admin',
        email: 'admin@cleaningworld.sa',
        password: await bcrypt.hash('admin123', 10),
        role: 'admin',
        permissions: [
          { module: 'users', actions: ['create', 'read', 'update', 'delete'] },
          { module: 'services', actions: ['create', 'read', 'update', 'delete'] },
          { module: 'bookings', actions: ['create', 'read', 'update', 'delete'] },
          { module: 'customers', actions: ['create', 'read', 'update', 'delete'] },
          { module: 'settings', actions: ['create', 'read', 'update', 'delete'] }
        ],
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      users = [defaultAdmin];
      await dataManager.writeData('users', users);
    }
    
    // البحث عن المستخدم
    const user = users.find((u: any) => u.username === username);
    if (!user) {
      const payload = { error: 'اسم المستخدم أو كلمة المرور غير صحيحة' } as any;
      if (debugEnabled) {
        payload.debug = {
          attempted: { username, password },
          matchedUser: null,
          compare: false,
        };
      }
      return res.status(401).json(payload);
    }
    
    // التحقق من كلمة المرور
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      const payload = { error: 'اسم المستخدم أو كلمة المرور غير صحيحة' } as any;
      if (debugEnabled) {
        payload.debug = {
          attempted: { username, password },
          matchedUser: { id: user.id, username: user.username, email: user.email },
          storedHash: maskHash(user.password),
          compare: false,
        };
      }
      return res.status(401).json(payload);
    }
    
    // التحقق من حالة المستخدم
    if (!user.isActive) {
      return res.status(401).json({ error: 'حساب المستخدم غير نشط' });
    }
    
    // إنشاء JWT token
    const token = jwt.sign(
      { 
        id: user.id, 
        username: user.username, 
        role: user.role 
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    // تحديث آخر تسجيل دخول
    user.lastLogin = new Date().toISOString();
    await dataManager.writeData('users', users);
    
    // إرجاع بيانات المستخدم (بدون كلمة المرور) والtoken
    const { password: _, ...userWithoutPassword } = user;
    
    const successPayload: any = {
      user: userWithoutPassword,
      token,
      message: 'تم تسجيل الدخول بنجاح'
    };
    if (debugEnabled) {
      successPayload.debug = {
        attempted: { username, password },
        matchedUser: { id: user.id, username: user.username, email: user.email },
        storedHash: maskHash(user.password),
        compare: true,
      };
    }
    res.json(successPayload);
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'بيانات غير صحيحة', details: error.errors });
    }
    console.error('Login error:', error);
    res.status(500).json({ error: 'خطأ في الخادم' });
  }
});

// تسجيل الخروج
router.post('/logout', authenticateToken, (req: any, res: Response) => {
  // في حالة استخدام blacklist للtokens، يمكن إضافة الtoken هنا
  res.json({ message: 'تم تسجيل الخروج بنجاح' });
});

// التحقق من صحة الtoken
router.get('/verify', authenticateToken, async (req: any, res: Response) => {
  try {
    const users = await dataManager.readData('users') || [];
    const user = users.find((u: any) => u.id === req.user.id);
    
    if (!user || !user.isActive) {
      return res.status(401).json({ error: 'مستخدم غير صالح' });
    }
    
    const { password: _, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
    
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(500).json({ error: 'خطأ في التحقق' });
  }
});

// تسجيل مستخدم جديد (للمشرفين فقط)
router.post('/register', authenticateToken, async (req: any, res: Response) => {
  try {
    // التحقق من صلاحيات المستخدم
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'غير مسموح لك بإنشاء مستخدمين جدد' });
    }
    
    const validatedData = RegisterSchema.parse(req.body);
    const users = await dataManager.readData('users') || [];
    
    // التحقق من عدم وجود مستخدم بنفس اسم المستخدم أو البريد الإلكتروني
    const existingUser = users.find((u: any) => 
      u.username === validatedData.username || u.email === validatedData.email
    );
    
    if (existingUser) {
      return res.status(400).json({ error: 'اسم المستخدم أو البريد الإلكتروني موجود بالفعل' });
    }
    
    // تشفير كلمة المرور
    const hashedPassword = await bcrypt.hash(validatedData.password, 10);
    
    // إنشاء المستخدم الجديد
    const newUser = {
      id: `user-${Date.now()}`,
      ...validatedData,
      password: hashedPassword,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    users.push(newUser);
    await dataManager.writeData('users', users);
    
    // إرجاع بيانات المستخدم (بدون كلمة المرور)
    const { password: _, ...userWithoutPassword } = newUser;
    res.status(201).json(userWithoutPassword);
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'بيانات غير صحيحة', details: error.errors });
    }
    console.error('Registration error:', error);
    res.status(500).json({ error: 'خطأ في إنشاء المستخدم' });
  }
});

// جلب جميع المستخدمين (للمشرفين فقط)
router.get('/users', authenticateToken, async (req: any, res: Response) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'غير مسموح لك بعرض المستخدمين' });
    }
    
    const users = await dataManager.readData('users') || [];
    
    // إرجاع المستخدمين بدون كلمات المرور
    const usersWithoutPasswords = users.map((user: any) => {
      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
    
    res.json(usersWithoutPasswords);
    
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'خطأ في جلب المستخدمين' });
  }
});

// تحديث مستخدم
router.put('/users/:id', authenticateToken, async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const users = await dataManager.readData('users') || [];
    
    // التحقق من الصلاحيات
    if (req.user.role !== 'admin' && req.user.id !== id) {
      return res.status(403).json({ error: 'غير مسموح لك بتحديث هذا المستخدم' });
    }
    
    const userIndex = users.findIndex((u: any) => u.id === id);
    if (userIndex === -1) {
      return res.status(404).json({ error: 'المستخدم غير موجود' });
    }
    
    const updateData = req.body;
    
    // إذا كان هناك كلمة مرور جديدة، تشفيرها
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }
    
    // تحديث المستخدم
    users[userIndex] = {
      ...users[userIndex],
      ...updateData,
      updatedAt: new Date().toISOString(),
    };
    
    await dataManager.writeData('users', users);
    
    const { password: _, ...userWithoutPassword } = users[userIndex];
    res.json(userWithoutPassword);
    
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ error: 'خطأ في تحديث المستخدم' });
  }
});

// تغيير كلمة المرور
router.post('/change-password', authenticateToken, async (req: any, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'كلمة المرور الحالية والجديدة مطلوبتان' });
    }
    
    const users = await dataManager.readData('users') || [];
    const userIndex = users.findIndex((u: any) => u.id === req.user.id);
    
    if (userIndex === -1) {
      return res.status(404).json({ error: 'المستخدم غير موجود' });
    }
    
    // التحقق من كلمة المرور الحالية
    const isValidPassword = await bcrypt.compare(currentPassword, users[userIndex].password);
    if (!isValidPassword) {
      return res.status(400).json({ error: 'كلمة المرور الحالية غير صحيحة' });
    }
    
    // تشفير كلمة المرور الجديدة
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    
    // تحديث كلمة المرور
    users[userIndex].password = hashedNewPassword;
    users[userIndex].updatedAt = new Date().toISOString();
    
    await dataManager.writeData('users', users);
    
    res.json({ message: 'تم تغيير كلمة المرور بنجاح' });
    
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ error: 'خطأ في تغيير كلمة المرور' });
  }
});

export default router;
