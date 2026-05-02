const DEFAULT_WINDOW_MS = 60_000;
const DEFAULT_LIMIT = 12;

const rateLimitStore = globalThis.__nornsightApiRateLimitStore || new Map();
globalThis.__nornsightApiRateLimitStore = rateLimitStore;

export function applyRouteRateLimit({ key, requestIp, windowMs = DEFAULT_WINDOW_MS, limit = DEFAULT_LIMIT }) {
  const now = Date.now();
  const entryKey = `${key}:${requestIp || 'unknown'}`;
  const existing = rateLimitStore.get(entryKey);

  if (!existing || existing.expiresAt <= now) {
    rateLimitStore.set(entryKey, {
      count: 1,
      expiresAt: now + windowMs
    });
    return null;
  }

  existing.count += 1;
  rateLimitStore.set(entryKey, existing);

  if (existing.count > limit) {
    return {
      retryAfterSeconds: Math.max(1, Math.ceil((existing.expiresAt - now) / 1000))
    };
  }

  return null;
}
