import Stripe from 'stripe';
import { getPublicAppUrl, getStripeConfig } from './config/env.js';

let stripeClientPromise = null;

export function isStripeEnabled() {
  return getStripeConfig().enabled;
}

async function getStripeClient() {
  if (stripeClientPromise) {
    return stripeClientPromise;
  }

  const config = getStripeConfig();
  if (!config.secretKey) {
    throw new Error('stripe_not_configured');
  }

  stripeClientPromise = Promise.resolve(
    new Stripe(config.secretKey, {
      apiVersion: '2025-03-31.basil'
    })
  );

  return stripeClientPromise;
}

function buildReturnUrl(origin, locale, tirageId, checkoutState) {
  const baseUrl = getPublicAppUrl(origin || '').replace(/\/+$/, '');
  const url = new URL(baseUrl || origin || 'http://localhost:3003');
  url.searchParams.set('lang', locale || 'fr');
  url.searchParams.set('checkout', checkoutState);
  url.searchParams.set('tirageId', tirageId);
  return url.toString();
}

export async function createStripeCheckoutSession({
  tirageId,
  email,
  locale = 'fr',
  question,
  origin,
  metadata = {}
}) {
  const stripe = await getStripeClient();
  const config = getStripeConfig();

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    customer_email: email,
    payment_method_types: ['card'],
    success_url: buildReturnUrl(origin, locale, tirageId, 'success'),
    cancel_url: buildReturnUrl(origin, locale, tirageId, 'cancel'),
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: config.currency,
          unit_amount: config.priceCents,
          product_data: {
            name: locale === 'en' ? 'Nornsight full reading' : 'Lecture approfondie Nornsight',
            description: String(question || '').slice(0, 240)
          }
        }
      }
    ],
    metadata: {
      tirageId,
      locale,
      ...Object.fromEntries(
        Object.entries(metadata).map(([key, value]) => [key, String(value ?? '')])
      )
    }
  });

  return {
    id: session.id,
    url: session.url || '',
    paymentStatus: session.payment_status || 'unpaid',
    amountTotal: session.amount_total || config.priceCents,
    currency: session.currency || config.currency
  };
}

export async function verifyStripeWebhook(rawBody, signature) {
  const stripe = await getStripeClient();
  const config = getStripeConfig();

  if (!config.webhookSecret) {
    throw new Error('stripe_webhook_not_configured');
  }

  return stripe.webhooks.constructEvent(rawBody, signature, config.webhookSecret);
}
