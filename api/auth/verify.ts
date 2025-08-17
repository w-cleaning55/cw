import jwt from 'jsonwebtoken';
import { parse } from 'cookie';
import { embeddedUsers, sanitizeUser } from '../_data';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';

export default async function handler(req: any, res: any) {
  try {
    if (req.method !== 'GET') {
      return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const cookies = parse(req.headers.cookie || '');
    const token = cookies.auth_token;

    if (!token) {
      return res.status(401).json({ error: 'Authentication token is missing' });
    }

    let decoded: any;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err: any) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    const user = embeddedUsers.find((u) => u.id === decoded.id);
    if (!user || !user.isActive) {
      return res.status(401).json({ error: 'User not found or inactive' });
    }

    return res.status(200).json({ user: sanitizeUser(user), message: 'User verified' });
  } catch (err: any) {
    console.error('auth/verify error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
