import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { dataManager } from '../../../../server/utils/dataManager';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';

// Embedded users for Vercel compatibility
const embeddedUsers = [
  {
    id: 'admin-1',
    username: 'admin',
    email: 'admin@cleaningworld.sa',
    password: '$2b$10$cnmRVkKL012/IbI2.1SbGe5gVhcjfge9/wdE3zJlwb3pazO3wC7hK', // admin123
    role: 'admin',
    permissions: [
      { module: 'users', actions: ['create', 'read', 'update', 'delete'] },
      { module: 'services', actions: ['create', 'read', 'update', 'delete'] },
      { module: 'bookings', actions: ['create', 'read', 'update', 'delete'] },
      { module: 'customers', actions: ['create', 'read', 'update', 'delete'] },
      { module: 'settings', actions: ['create', 'read', 'update', 'delete'] },
    ],
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'admin-test-1',
    username: 'testadmin',
    email: 'testadmin@cleaningworld.sa',
    password: '$2b$10$lCvruuPWcjumULGIlaeiiOtfBU2xFJIwuxhNTRH9/oV62lIe.hRQW', // test123
    role: 'admin',
    permissions: [
      { module: 'users', actions: ['create', 'read', 'update', 'delete'] },
      { module: 'services', actions: ['create', 'read', 'update', 'delete'] },
      { module: 'bookings', actions: ['create', 'read', 'update', 'delete'] },
      { module: 'customers', actions: ['create', 'read', 'update', 'delete'] },
      { module: 'settings', actions: ['create', 'read', 'update', 'delete'] },
    ],
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

async function getUsers() {
  try {
    const users = await dataManager.readData('users');
    return Array.isArray(users) ? users : embeddedUsers;
  } catch (error) {
    return embeddedUsers;
  }
}

function sanitizeUser(user: any) {
  const { password, ...rest } = user;
  return rest;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    const users = await getUsers();
    const user = users.find((u: any) => u.username === username);

    if (!user) {
      return NextResponse.json(
        { error: 'اسم المستخدم أو كلمة المرور غير صحيحة' },
        { status: 401 }
      );
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return NextResponse.json(
        { error: 'اسم المستخدم أو كلمة المرور غير صحيحة' },
        { status: 401 }
      );
    }

    if (!user.isActive) {
      return NextResponse.json(
        { error: 'حساب المستخدم غير نشط' },
        { status: 401 }
      );
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    return NextResponse.json({
      user: sanitizeUser(user),
      token,
      message: 'تم تسجيل الدخول بنجاح',
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'خطأ في الخادم' },
      { status: 500 }
    );
  }
}
