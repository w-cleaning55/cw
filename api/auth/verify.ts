import jwt from 'jsonwebtoken';
import { embeddedUsers, sanitizeUser } from '..//_data';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';

export default async function handler(req: any, res: any) {
  try {
    const authHeader = req.headers['authorization'] as string | undefined;
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Access token required' });

    jwt.verify(token, JWT_SECRET, (err, payload: any) => {
      if (err) return res.status(403).json({ error: 'Invalid or expired token' });
      const user = embeddedUsers.find((u) => u.id === payload.id);
      if (!user || !user.isActive) return res.status(401).json({ error: 'مستخدم غير صالح' });
      return res.status(200).json(sanitizeUser(user));
    });
  } catch (err: any) {
    console.error('auth/verify error:', err);
    return res.status(500).json({ error: 'خطأ في التحقق' });
  }
}


