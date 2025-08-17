import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';
import { embeddedUsers, sanitizeUser } from '../_data';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';
const NODE_ENV = process.env.NODE_ENV || 'development';

export default async function handler(req: any, res: any) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const { username, password } = body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    let user = embeddedUsers.find((u) => u.username === username);
    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // TODO: Implement proper password hashing (e.g., bcrypt) for production
    // For now, a simple comparison for demonstration purposes.
    // This is a security vulnerability and should be replaced with a secure hashing mechanism.
    if (user.password !== password) { // Assuming user.password holds the plain text password for this example
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    if (!user.isActive) {
      return res.status(401).json({ error: 'User account is inactive' });
    }

    const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '24h' });

    // Set the JWT as an HttpOnly cookie
    res.setHeader('Set-Cookie', serialize('auth_token', token, {
      httpOnly: true,
      secure: NODE_ENV === 'production', // Use secure cookies in production
      sameSite: 'strict', // Protect against CSRF attacks
      maxAge: 60 * 60 * 24, // 1 day
      path: '/', // Available across the entire application
    }));

    return res.status(200).json({ user: sanitizeUser(user), message: 'Login successful' });
  } catch (err: any) {
    console.error('auth/login error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
