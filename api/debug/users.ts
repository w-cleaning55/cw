import { embeddedUsers, sanitizeUser } from '../_data';

export default async function handler(_req: any, res: any) {
  const users = embeddedUsers.map(sanitizeUser);
  return res.status(200).json({ count: users.length, users });
}


