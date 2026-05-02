import { saveTirageEmail } from '../../apps/web/server/tirageService.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  try {
    const result = await saveTirageEmail({
      tirageId: req.body?.tirageId,
      email: req.body?.email
    });

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      error: error?.message || 'Unknown error.'
    });
  }
}
