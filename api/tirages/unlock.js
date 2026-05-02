import { unlockFullTirage } from '../../apps/web/server/tirageService.js';
import { getRequestIp } from '../../apps/web/server/utils/requestContext.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed.' });
    return;
  }

  try {
    const result = await unlockFullTirage({
      ...req.body,
      requestIp: getRequestIp(req)
    });

    res.status(result.status === 'blocked' ? 429 : 200).json(result);
  } catch (error) {
    res.status(500).json({ error: error?.message || 'Erreur inconnue.' });
  }
}
