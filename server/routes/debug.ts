import { Router } from 'express';
import { dataManager } from '../utils/dataManager';

const router = Router();

// GET /api/debug/users -> summarized list of users for diagnostics
router.get('/debug/users', async (_req, res) => {
  try {
    const rawUsers: any[] = (await dataManager.readData<any>('users')) || [];
    const users = rawUsers.map((u: any) => ({
      id: u.id,
      username: u.username,
      role: u.role,
      isActive: Boolean(u.isActive),
    }));

    res.json({ count: users.length, users });
  } catch (error) {
    console.error('Debug users error:', error);
    res.status(500).json({ error: 'Failed to read users' });
  }
});

export default router;


