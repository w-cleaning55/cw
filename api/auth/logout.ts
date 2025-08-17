import { serialize } from 'cookie';

export default async function handler(req: any, res: any) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method Not Allowed' });
    }

    // Clear the HttpOnly cookie by setting its maxAge to 0
    res.setHeader('Set-Cookie', serialize('auth_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0, // Expire the cookie immediately
      path: '/',
    }));

    return res.status(200).json({ message: 'Logout successful' });
  } catch (err: any) {
    console.error('auth/logout error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
