import { getDefaultPalettes } from '../_data';

export default async function handler(_req: any, res: any) {
  try {
    const palettes = getDefaultPalettes();
    const active = palettes.find((p: any) => p.isActive) || palettes[0];
    return res.status(200).json(active);
  } catch (err: any) {
    return res.status(500).json({ error: 'فشل في تحميل الباليت النشط' });
  }
}


