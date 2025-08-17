import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

// Types
export interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'manager' | 'operator';
  permissions: Permission[];
  createdAt: string;
  updatedAt: string;
}

export interface Permission {
  module: string;
  actions: ('create' | 'read' | 'update' | 'delete')[];
}

export interface JWTPayload {
  userId: string;
  username: string;
  role: string;
  iat: number;
  exp: number;
}

// Configuration
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';
const JWT_EXPIRES_IN = '24h';
const SALT_ROUNDS = 12;

// Default admin user (in production, this should be in a database)
const DEFAULT_ADMIN: Omit<User, 'id' | 'createdAt' | 'updatedAt'> = {
  username: 'admin',
  email: 'admin@cw.com.sa',
  role: 'admin',
  permissions: [
    { module: 'dashboard', actions: ['read'] },
    { module: 'users', actions: ['create', 'read', 'update', 'delete'] },
    { module: 'services', actions: ['create', 'read', 'update', 'delete'] },
    { module: 'bookings', actions: ['create', 'read', 'update', 'delete'] },
    { module: 'content', actions: ['create', 'read', 'update', 'delete'] },
    { module: 'settings', actions: ['read', 'update'] },
  ],
};

// Password hashing
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

// JWT operations
export function generateToken(user: Omit<User, 'permissions'>): string {
  const payload: Omit<JWTPayload, 'iat' | 'exp'> = {
    userId: user.id,
    username: user.username,
    role: user.role,
  };
  
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch (error) {
    return null;
  }
}

// Cookie management
export function setAuthCookie(token: string, response: NextResponse): NextResponse {
  response.cookies.set('auth_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 24 * 60 * 60, // 24 hours
    path: '/',
  });
  return response;
}

export function clearAuthCookie(response: NextResponse): NextResponse {
  response.cookies.delete('auth_token');
  return response;
}

export function getAuthToken(request: NextRequest): string | null {
  return request.cookies.get('auth_token')?.value || 
         request.headers.get('authorization')?.replace('Bearer ', '') || 
         null;
}

// User management (simplified - in production, use a database)
const users = new Map<string, User & { password: string }>();

// Initialize default admin user
export async function initializeDefaultAdmin(): Promise<void> {
  const adminId = 'admin-001';
  const hashedPassword = await hashPassword('admin123');
  
  users.set(adminId, {
    id: adminId,
    ...DEFAULT_ADMIN,
    password: hashedPassword,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
}

// Authentication functions
export async function authenticateUser(username: string, password: string): Promise<User | null> {
  // Initialize default admin if no users exist
  if (users.size === 0) {
    await initializeDefaultAdmin();
  }

  // Find user by username
  const user = Array.from(users.values()).find(u => u.username === username);
  if (!user) {
    return null;
  }

  // Verify password
  const isValidPassword = await comparePassword(password, user.password);
  if (!isValidPassword) {
    return null;
  }

  // Return user without password
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

export function getUserById(userId: string): User | null {
  const user = users.get(userId);
  if (!user) {
    return null;
  }
  
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

export function getUserByToken(token: string): User | null {
  const payload = verifyToken(token);
  if (!payload) {
    return null;
  }
  
  return getUserById(payload.userId);
}

// Permission checking
export function hasPermission(user: User, module: string, action: 'create' | 'read' | 'update' | 'delete'): boolean {
  if (user.role === 'admin') {
    return true;
  }
  
  const permission = user.permissions.find(p => p.module === module);
  return permission?.actions.includes(action) || false;
}

export function hasRole(user: User, role: 'admin' | 'manager' | 'operator'): boolean {
  return user.role === role;
}

// Middleware helper
export async function validateAuth(request: NextRequest): Promise<{ user: User | null; isValid: boolean }> {
  const token = getAuthToken(request);
  
  if (!token) {
    return { user: null, isValid: false };
  }
  
  const user = getUserByToken(token);
  if (!user) {
    return { user: null, isValid: false };
  }
  
  return { user, isValid: true };
}

// Rate limiting (simple in-memory implementation)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export function checkRateLimit(identifier: string, limit: number = 5, windowMs: number = 15 * 60 * 1000): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(identifier);
  
  if (!record || now > record.resetTime) {
    rateLimitMap.set(identifier, { count: 1, resetTime: now + windowMs });
    return true;
  }
  
  if (record.count >= limit) {
    return false;
  }
  
  record.count++;
  return true;
}

// Clean up expired rate limit records
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of rateLimitMap.entries()) {
    if (now > record.resetTime) {
      rateLimitMap.delete(key);
    }
  }
}, 60 * 1000); // Clean up every minute