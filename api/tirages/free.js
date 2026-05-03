import { createFreeTirage } from '../../apps/web/server/tirageService.js';
import { getRequestIp } from '../../apps/web/server/utils/requestContext.js';
import { applyRouteRateLimit } from '../_utils/rateLimit.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed.' });
    return;
  }

  const requestIp = getRequestIp(req);
  const limited = applyRouteRateLimit({
    key: '/api/tirages/free',
    requestIp,
    windowMs: 60_000,
    limit: 12
  });

  if (limited) {
    res.setHeader('Retry-After', String(limited.retryAfterSeconds));
    res.status(429).json({ error: 'Too many requests.' });
    return;
  }

  try {
    const result = await createFreeTirage({
      question: req.body?.question,
      locale: req.body?.locale,
      theme: req.body?.theme,
      requestIp
    });

    res.status(200).json(result);
  } catch (error) {
    res.status(error?.statusCode || 500).json({ error: error?.message || 'Erreur inconnue.' });
  }
}
