import { createServer } from 'node:http';
import { existsSync, createReadStream, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { getPublicAppUrl } from '../apps/web/server/config/env.js';
import { createRuneReading } from '../apps/web/server/runeReadingService.js';
import {
  createCheckoutForTirage,
  createFreeTirage,
  getTirageDeliveryStatus,
  processStripeCheckoutCompleted,
  saveTirageEmail,
  unlockFullTirage
} from '../apps/web/server/tirageService.js';
import { getCloudflareConfig } from '../apps/web/server/config/env.js';
import { getDrawingRepository, getDrawingRepositoryMode } from '../apps/web/server/data/drawingRepository.js';
import { getMysqlDebugInfo } from '../apps/web/server/data/mysqlClient.js';
import { verifyStripeWebhook } from '../apps/web/server/stripeService.js';
import { getRequestIp, getRequestOrigin } from '../apps/web/server/utils/requestContext.js';
import { SEO_PUBLIC_PATHS, getSeoRouteConfig } from '../apps/web/src/lib/seoRoutes.js';
import { getLangfuseDebugInfo } from '../apps/web/server/langfuse.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const DIST_DIR = path.resolve(ROOT_DIR, 'dist/apps/web');
const BLOCKED_PATH_PREFIXES = [
  '/.git',
  '/.env',
  '/server',
  '/apps',
  '/src',
  '/node_modules',
  '/package',
  '/pnpm-lock',
  '/package-lock',
  '/yarn.lock',
  '/HOSTINGER_DEPLOY',
  '/server/sql'
];
const BLOCKED_PATH_SEGMENTS = ['/.', '/..'];
const BLOCKED_EXTENSIONS = new Set(['.map', '.log', '.sql', '.env']);

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8'
};

const RATE_LIMIT_WINDOWS = {
  '/api/tirages/free': { windowMs: 60_000, limit: 12 },
  '/api/tirages/checkout': { windowMs: 60_000, limit: 10 },
  '/api/rune-reading': { windowMs: 60_000, limit: 20 }
};

const rateLimitStore = new Map();

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function sendJson(res, statusCode, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(body),
    'Cache-Control': 'no-store'
  });
  res.end(body);
}

function sendText(res, statusCode, message) {
  res.writeHead(statusCode, {
    'Content-Type': 'text/plain; charset=utf-8',
    'Content-Length': Buffer.byteLength(message)
  });
  res.end(message);
}

function applyCommonHeaders(res) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
}

function applyApiHeaders(res, pathname = '') {
  res.setHeader('Cache-Control', pathname === '/api/stripe/webhook' ? 'no-store, no-cache, must-revalidate' : 'no-store');
  res.setHeader('CDN-Cache-Control', 'no-store');
  res.setHeader('Vary', 'Origin, X-Forwarded-Proto, X-Forwarded-Host');
}

function isPreviewAccess(url) {
  return url.searchParams.get('preview_paid') === '1';
}

function isBlockedStaticPath(pathname) {
  const lowered = pathname.toLowerCase();

  if (BLOCKED_PATH_SEGMENTS.some((segment) => lowered.includes(segment))) {
    return true;
  }

  if (BLOCKED_PATH_PREFIXES.some((prefix) => lowered === prefix || lowered.startsWith(`${prefix}/`))) {
    return true;
  }

  const extension = path.extname(lowered);
  if (BLOCKED_EXTENSIONS.has(extension)) {
    return true;
  }

  return false;
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let raw = '';

    req.on('data', (chunk) => {
      raw += chunk;

      if (raw.length > 1_000_000) {
        reject(new Error('Payload too large.'));
        req.destroy();
      }
    });

    req.on('end', () => {
      try {
        resolve(raw ? JSON.parse(raw) : {});
      } catch (error) {
        reject(new Error('Invalid JSON body.'));
      }
    });

    req.on('error', reject);
  });
}

function readRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];

    req.on('data', (chunk) => {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    });

    req.on('end', () => {
      resolve(Buffer.concat(chunks));
    });

    req.on('error', reject);
  });
}

function enforceRateLimit(pathname, requestIp) {
  const config = RATE_LIMIT_WINDOWS[pathname];

  if (!config) {
    return null;
  }

  const key = `${pathname}:${requestIp || 'unknown'}`;
  const now = Date.now();
  const entry = rateLimitStore.get(key);

  if (!entry || entry.expiresAt <= now) {
    rateLimitStore.set(key, {
      count: 1,
      expiresAt: now + config.windowMs
    });
    return null;
  }

  entry.count += 1;
  rateLimitStore.set(key, entry);

  if (entry.count > config.limit) {
    return {
      retryAfterSeconds: Math.max(1, Math.ceil((entry.expiresAt - now) / 1000))
    };
  }

  return null;
}

async function handleApi(req, res, pathname, url) {
  if (req.method === 'GET' && pathname === '/api/health') {
    const payload = {
      ok: true,
      service: 'nornsight',
      timestamp: new Date().toISOString()
    };

    if (isPreviewAccess(url)) {
      payload.storage = await getDrawingRepositoryMode();
      payload.mysql = getMysqlDebugInfo();
      payload.langfuse = getLangfuseDebugInfo();
    }

    return sendJson(res, 200, payload);
  }

  if (req.method === 'GET' && pathname === '/api/admin/tirages') {
    if (!isPreviewAccess(url)) {
      return sendJson(res, 403, { error: 'Forbidden.' });
    }

    const repository = await getDrawingRepository();
    const limit = Number(url.searchParams.get('limit') || '20');
    const tirages = await repository.listRecentDrawings(limit);

    return sendJson(res, 200, { tirages });
  }

  if (req.method !== 'POST') {
    if (req.method === 'GET' && pathname === '/api/tirages/status') {
      const result = await getTirageDeliveryStatus({
        tirageId: url.searchParams.get('tirageId') || ''
      });
      return sendJson(res, 200, result);
    }

    return sendJson(res, 405, { error: 'Method not allowed.' });
  }

  const requestIp = getRequestIp(req);
  const requestOrigin = getRequestOrigin(req);
  const limited = enforceRateLimit(pathname, requestIp);

  if (limited) {
    res.setHeader('Retry-After', String(limited.retryAfterSeconds));
    return sendJson(res, 429, {
      error: 'Too many requests.'
    });
  }

  if (pathname === '/api/stripe/webhook') {
    const rawBody = await readRawBody(req);
    const signature = req.headers['stripe-signature'];
    const event = await verifyStripeWebhook(rawBody, Array.isArray(signature) ? signature[0] : signature || '');

    if (event.type === 'checkout.session.completed') {
      await processStripeCheckoutCompleted({
        session: event.data.object,
        origin: requestOrigin
      });
    }

    return sendJson(res, 200, { received: true });
  }

  const body = await readJsonBody(req);

  if (pathname === '/api/rune-reading') {
    const reading = await createRuneReading(body);
    return sendJson(res, 200, { reading });
  }

  if (pathname === '/api/tirages/free') {
    const result = await createFreeTirage({
      question: body.question,
      requestIp,
      locale: body.locale,
      theme: body.theme
    });
    return sendJson(res, 200, result);
  }

  if (pathname === '/api/tirages/save-email') {
    const result = await saveTirageEmail({
      tirageId: body.tirageId,
      email: body.email
    });
    return sendJson(res, 200, result);
  }

  if (pathname === '/api/tirages/checkout') {
    const result = await createCheckoutForTirage({
      ...body,
      requestIp,
      requestOrigin
    });
    return sendJson(res, 200, result);
  }

  if (pathname === '/api/tirages/unlock') {
    const result = await unlockFullTirage({
      ...body,
      requestIp
    });

    return sendJson(res, result.status === 'blocked' ? 429 : 200, result);
  }

  return sendJson(res, 404, { error: 'Not found.' });
}

function safeJoin(baseDir, pathname) {
  const filePath = path.join(baseDir, pathname);
  if (!filePath.startsWith(baseDir)) {
    return null;
  }
  return filePath;
}

function serveStatic(req, res, pathname, url) {
  if (!existsSync(DIST_DIR)) {
    return sendText(
      res,
      503,
      'Le build frontend est introuvable. Lancez "npm run build" avant de démarrer le serveur.'
    );
  }

  if (isBlockedStaticPath(pathname)) {
    return sendJson(res, 404, { error: 'Not found.' });
  }

  const cleanPath = pathname === '/' ? '/index.html' : pathname;
  const requestedFile = safeJoin(DIST_DIR, cleanPath);

  if (requestedFile && existsSync(requestedFile)) {
    const extension = path.extname(requestedFile).toLowerCase();
    const contentType = MIME_TYPES[extension] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': extension === '.html' ? 'no-cache' : 'public, max-age=604800, immutable'
    });

    createReadStream(requestedFile).pipe(res);
    return;
  }

  const indexPath = path.join(DIST_DIR, 'index.html');
  if (!existsSync(indexPath)) {
    return sendText(res, 404, 'index.html introuvable.');
  }

  const indexHtml = readFileSync(indexPath, 'utf-8');
  const routeLocale = url?.searchParams?.get('lang') === 'en' ? 'en' : 'fr';
  const seoConfig = getSeoRouteConfig(pathname, routeLocale);

  if (seoConfig) {
    const baseUrl = getPublicAppUrl('http://localhost:3000') || 'http://localhost:3000';
    const canonical = `${baseUrl.replace(/\/+$/, '')}${pathname}`;
    const seoHead = `
      <link rel="canonical" href="${escapeHtml(canonical)}" />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Nornsight" />
      <meta property="og:title" content="${escapeHtml(seoConfig.title)}" />
      <meta property="og:description" content="${escapeHtml(seoConfig.description)}" />
      <meta property="og:url" content="${escapeHtml(canonical)}" />
    `.trim();

    const htmlWithSeo = indexHtml
      .replace(/<html[^>]*lang="[^"]*"/i, `<html lang="${routeLocale}"`)
      .replace(/<title>.*?<\/title>/i, `<title>${escapeHtml(seoConfig.title)}</title>`)
      .replace(
        /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/i,
        `<meta name="description" content="${escapeHtml(seoConfig.description)}" />`
      )
      .replace('</head>', `${seoHead}\n</head>`);

    res.writeHead(200, {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-cache'
    });

    res.end(htmlWithSeo);
    return;
  }

  res.writeHead(200, {
    'Content-Type': 'text/html; charset=utf-8',
    'Cache-Control': 'no-cache'
  });

  res.end(indexHtml);
}

const port = Number(process.env.PORT || 3000);
const host = process.env.HOST || '0.0.0.0';

const server = createServer(async (req, res) => {
  applyCommonHeaders(res);

  try {
    const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
    const pathname = decodeURIComponent(url.pathname);
    const cloudflareConfig = getCloudflareConfig();
    const baseUrl = getPublicAppUrl(`http://${req.headers.host || 'localhost'}`) || `http://${req.headers.host || 'localhost'}`;

    if (cloudflareConfig.trustedProxy && String(req.headers['x-forwarded-proto'] || '').includes('https')) {
      res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
    }

    if (pathname === '/robots.txt') {
      const body = `User-agent: *\nAllow: /\nSitemap: ${baseUrl.replace(/\/+$/, '')}/sitemap.xml\n`;
      res.writeHead(200, {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'public, max-age=3600'
      });
      res.end(body);
      return;
    }

    if (pathname === '/sitemap.xml') {
      const urls = SEO_PUBLIC_PATHS.map((seoPath) => {
        const loc = `${baseUrl.replace(/\/+$/, '')}${seoPath}`;
        return `<url><loc>${loc}</loc></url>`;
      }).join('');

      const body = `<?xml version="1.0" encoding="UTF-8"?>` +
        `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`;

      res.writeHead(200, {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600'
      });
      res.end(body);
      return;
    }

    if (pathname.startsWith('/api/')) {
      applyApiHeaders(res, pathname);
      await handleApi(req, res, pathname, url);
      return;
    }

    if (req.method !== 'GET' && req.method !== 'HEAD') {
      sendJson(res, 405, { error: 'Method not allowed.' });
      return;
    }

    serveStatic(req, res, pathname, url);
  } catch (error) {
    console.error('Production server error:', error);
    sendJson(res, error?.statusCode || 500, {
      error: error?.message || 'Internal server error.'
    });
  }
});

server.listen(port, host, () => {
  console.log(`Nornsight server running at http://${host}:${port}`);
});
