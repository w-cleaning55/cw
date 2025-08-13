import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { dataManager } from '../../../../server/utils/dataManager';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';

const embeddedUsers = [
  {
    id: 'admin-1',
    username: 'admin',
    email: 'admin@cleaningworld.sa',
    role: 'admin',
    isActive: true,
  },
  {
    id: 'admin-test-1',
    username: 'testadmin',
    email: 'testadmin@cleaningworld.sa',
    role: 'admin',
    isActive: true,
  },
];

function sanitizeUser(user: any) {
  const { password, ...rest } = user;
  return rest;
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return NextResponse.json(
        { error: 'Access token required' },
        { status: 401 }
      );
    }

    return new Promise<NextResponse>((resolve) => {
      jwt.verify(token, JWT_SECRET, async (err: any, payload: any) => {
        if (err) {
          resolve(NextResponse.json(
            { error: 'Invalid or expired token' },
            { status: 403 }
          ));
          return;
        }

        try {
          const users = await dataManager.readData('users') || embeddedUsers;
          const user = Array.isArray(users)
            ? users.find((u: any) => u.id === payload.id)
            : embeddedUsers.find(u => u.id === payload.id);

          if (!user || !user.isActive) {
            resolve(NextResponse.json(
              { error: 'مستخدم غير صالح' },
              { status: 401 }
            ));
            return;
          }

          resolve(NextResponse.json(sanitizeUser(user)));
        } catch (error) {
          resolve(NextResponse.json(
            { error: 'خطأ في التحقق' },
            { status: 500 }
          ));
        }
      });
    });
  } catch (error) {
    console.error('Verify error:', error);
    return NextResponse.json(
      { error: 'خطأ في التحقق' },
      { status: 500 }
    );
  }
}
