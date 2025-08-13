import { getDefaultPalettes } from '../_data';

export default async function handler(_req: any, res: any) {
  try {
    return res.status(200).json(getDefaultPalettes());
  } catch (err: any) {
    return res.status(500).json({ error: 'فشل في تحميل الباليتات' });
  }
}


