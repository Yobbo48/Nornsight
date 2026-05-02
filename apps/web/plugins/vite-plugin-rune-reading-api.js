import { createRuneReading } from '../server/runeReadingService.js';
import {
  createCheckoutForTirage,
  createFreeTirage,
  getTirageDeliveryStatus,
  processStripeCheckoutCompleted,
  saveTirageEmail,
  unlockFullTirage
} from '../server/tirageService.js';
import { getDrawingRepository } from '../server/data/drawingRepository.js';
import { getPublicAppUrl } from '../server/config/env.js';
import { getRequestContext, readJsonBody, readRawBody, sendJson } from '../server/http.js';
import { verifyStripeWebhook } from '../server/stripeService.js';
import { SEO_PUBLIC_PATHS } from '../src/lib/seoRoutes.js';

export default function runeReadingApiPlugin() {
  return {
    name: 'rune-reading-api',
    configureServer(server) {
      server.middlewares.use('/robots.txt', async (req, res, next) => {
        if (req.method !== 'GET') {
          return next();
        }

        const host = req.headers.host || 'localhost:3000';
        const baseUrl = getPublicAppUrl(`http://${host}`) || `http://${host}`;
        const body = `User-agent: *\nAllow: /\nSitemap: ${baseUrl.replace(/\/+$/, '')}/sitemap.xml\n`;

        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        res.setHeader('Cache-Control', 'no-store');
        res.end(body);
      });

      server.middlewares.use('/sitemap.xml', async (req, res, next) => {
        if (req.method !== 'GET') {
          return next();
        }

        const host = req.headers.host || 'localhost:3000';
        const baseUrl = getPublicAppUrl(`http://${host}`) || `http://${host}`;
        const urls = SEO_PUBLIC_PATHS.map((seoPath) => {
          const loc = `${baseUrl.replace(/\/+$/, '')}${seoPath}`;
          return `<url><loc>${loc}</loc></url>`;
        }).join('');

        const body =
          `<?xml version="1.0" encoding="UTF-8"?>` +
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`;

        res.setHeader('Content-Type', 'application/xml; charset=utf-8');
        res.setHeader('Cache-Control', 'no-store');
        res.end(body);
      });

      server.middlewares.use('/api/tirages/free', async (req, res, next) => {
        if (req.method !== 'POST') {
          return next();
        }

        try {
          const body = await readJsonBody(req);
          const context = getRequestContext(req);
          const result = await createFreeTirage({
            question: body.question,
            requestIp: context.ip,
            locale: body.lang || body.locale || 'fr',
            theme: body.theme || 'situation'
          });
          sendJson(res, 200, result);
        } catch (error) {
          sendJson(res, 500, { error: error?.message || 'Erreur inconnue.' });
        }
      });

      server.middlewares.use('/api/admin/tirages', async (req, res, next) => {
        if (req.method !== 'GET') {
          return next();
        }

        try {
          const url = new URL(req.url || '/', 'http://localhost');

          if (url.searchParams.get('preview_paid') !== '1') {
            sendJson(res, 403, { error: 'Forbidden.' });
            return;
          }

          const repository = await getDrawingRepository();
          const limit = Number(url.searchParams.get('limit') || '20');
          const tirages = await repository.listRecentDrawings(limit);

          sendJson(res, 200, { tirages });
        } catch (error) {
          sendJson(res, 500, { error: error?.message || 'Erreur inconnue.' });
        }
      });

      server.middlewares.use('/api/tirages/unlock', async (req, res, next) => {
        if (req.method !== 'POST') {
          return next();
        }

        try {
          const body = await readJsonBody(req);
          const context = getRequestContext(req);
          const result = await unlockFullTirage({
            ...body,
            requestIp: context.ip
          });

          sendJson(res, result.status === 'blocked' ? 429 : 200, result);
        } catch (error) {
          sendJson(res, 500, { error: error?.message || 'Erreur inconnue.' });
        }
      });

      server.middlewares.use('/api/tirages/checkout', async (req, res, next) => {
        if (req.method !== 'POST') {
          return next();
        }

        try {
          const body = await readJsonBody(req);
          const context = getRequestContext(req);
          const result = await createCheckoutForTirage({
            ...body,
            requestIp: context.ip,
            requestOrigin: context.origin
          });

          sendJson(res, 200, result);
        } catch (error) {
          sendJson(res, 500, { error: error?.message || 'Erreur inconnue.' });
        }
      });

      server.middlewares.use('/api/tirages/status', async (req, res, next) => {
        if (req.method !== 'GET') {
          return next();
        }

        try {
          const url = new URL(req.url || '/', 'http://localhost');
          const result = await getTirageDeliveryStatus({
            tirageId: url.searchParams.get('tirageId') || ''
          });
          sendJson(res, 200, result);
        } catch (error) {
          sendJson(res, 500, { error: error?.message || 'Erreur inconnue.' });
        }
      });

      server.middlewares.use('/api/tirages/save-email', async (req, res, next) => {
        if (req.method !== 'POST') {
          return next();
        }

        try {
          const body = await readJsonBody(req);
          const result = await saveTirageEmail({
            tirageId: body.tirageId,
            email: body.email
          });

          sendJson(res, 200, result);
        } catch (error) {
          sendJson(res, 500, { error: error?.message || 'Erreur inconnue.' });
        }
      });

      server.middlewares.use('/api/stripe/webhook', async (req, res, next) => {
        if (req.method !== 'POST') {
          return next();
        }

        try {
          const rawBody = await readRawBody(req);
          const signature = req.headers['stripe-signature'];
          const event = await verifyStripeWebhook(rawBody, Array.isArray(signature) ? signature[0] : signature || '');

          if (event.type === 'checkout.session.completed') {
            const context = getRequestContext(req);
            await processStripeCheckoutCompleted({
              session: event.data.object,
              origin: context.origin
            });
          }

          sendJson(res, 200, { received: true });
        } catch (error) {
          sendJson(res, 400, { error: error?.message || 'Webhook Stripe invalide.' });
        }
      });

      server.middlewares.use('/api/rune-reading', async (req, res, next) => {
        if (req.method !== 'POST') {
          return next();
        }

        try {
          const body = await readJsonBody(req);
          const reading = await createRuneReading(body);
          sendJson(res, 200, { reading });
        } catch (error) {
          const message =
            error?.message === 'OPENAI_API_KEY is missing.'
              ? 'La cle OpenAI n est pas configuree.'
              : error?.message || 'Erreur inconnue.';

          sendJson(res, 500, { error: message });
        }
      });
    }
  };
}
