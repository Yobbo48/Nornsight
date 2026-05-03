export function getRequestIp(req) {
  const cloudflareIp = req.headers['cf-connecting-ip'];

  if (typeof cloudflareIp === 'string' && cloudflareIp.trim()) {
    return cloudflareIp.trim();
  }

  const forwardedFor = req.headers['x-forwarded-for'];

  if (typeof forwardedFor === 'string' && forwardedFor.trim()) {
    return forwardedFor.split(',')[0].trim();
  }

  if (Array.isArray(forwardedFor) && forwardedFor[0]) {
    return String(forwardedFor[0]).trim();
  }

  const realIp = req.headers['x-real-ip'];
  if (typeof realIp === 'string' && realIp.trim()) {
    return realIp.trim();
  }

  return req.socket?.remoteAddress || 'unknown';
}

export function getRequestOrigin(req) {
  const forwardedProto = req.headers['x-forwarded-proto'];
  const forwardedHost = req.headers['x-forwarded-host'];
  const host = forwardedHost || req.headers.host || 'localhost:3000';
  const protocol =
    typeof forwardedProto === 'string' && forwardedProto.trim()
      ? forwardedProto.split(',')[0].trim()
      : req.socket?.encrypted
        ? 'https'
        : 'http';

  return `${protocol}://${host}`;
}
