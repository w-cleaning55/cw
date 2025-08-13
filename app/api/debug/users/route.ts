import { NextRequest, NextResponse } from 'next/server';
import { dataManager } from '../../../../server/utils/dataManager';

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

export async function GET() {
  try {
    let users;
    try {
      const rawUsers = await dataManager.readData('users');
      users = Array.isArray(rawUsers) ? rawUsers : embeddedUsers;
    } catch (error) {
      users = embeddedUsers;
    }

    const sanitizedUsers = users.map((user: any) => ({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
    }));

    return NextResponse.json({
      count: sanitizedUsers.length,
      users: sanitizedUsers,
    });
  } catch (error) {
    console.error('Debug users error:', error);
    return NextResponse.json(
      { error: 'Failed to read users' },
      { status: 500 }
    );
  }
}
