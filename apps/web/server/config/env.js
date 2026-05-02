import path from 'node:path';
import { existsSync, readFileSync } from 'node:fs';

const ENV_PATHS = [
  path.resolve(process.cwd(), '.env'),
  path.resolve(process.cwd(), '../../.env'),
  path.resolve(process.cwd(), '../.env')
];

function readEnvFile() {
  for (const envPath of ENV_PATHS) {
    if (!existsSync(envPath)) {
      continue;
    }

    const content = readFileSync(envPath, 'utf-8');
    return Object.fromEntries(
      content
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => line && !line.startsWith('#') && line.includes('='))
        .map((line) => {
          const separatorIndex = line.indexOf('=');
          const key = line.slice(0, separatorIndex).trim();
          const rawValue = line.slice(separatorIndex + 1).trim();
          return [key, rawValue.replace(/^['"]|['"]$/g, '')];
        })
    );
  }

  return {};
}

const fileEnv = readEnvFile();

export function getConfigValue(key, fallback = '') {
  return process.env[key] || fileEnv[key] || fallback;
}

export function normalizeEmail(value) {
  return String(value || '').trim().toLowerCase();
}

export function getAdminEmails() {
  return getConfigValue('ADMIN_EMAILS', '')
    .split(',')
    .map((value) => normalizeEmail(value))
    .filter(Boolean);
}

export function isAdminEmail(email) {
  return getAdminEmails().includes(normalizeEmail(email));
}

export function getMysqlConfig() {
  const host = getConfigValue('MYSQL_HOST', 'localhost');
  const user = getConfigValue('MYSQL_USER');
  const password = getConfigValue('MYSQL_PASSWORD');
  const database = getConfigValue('MYSQL_DATABASE');
  const port = Number(getConfigValue('MYSQL_PORT', '3306'));

  return {
    host,
    user,
    password,
    database,
    port,
    enabled: Boolean(host && user && password && database)
  };
}

export function getPublicAppUrl(fallback = '') {
  return getConfigValue('APP_BASE_URL', fallback).replace(/\/+$/, '');
}

export function hasPublicAppUrlConfigured() {
  return Boolean(getConfigValue('APP_BASE_URL', '').trim());
}

export function getStripeConfig() {
  const secretKey = getConfigValue('STRIPE_SECRET_KEY');
  const webhookSecret = getConfigValue('STRIPE_WEBHOOK_SECRET');
  const priceCents = Number(getConfigValue('STRIPE_PRICE_CENTS', '590'));
  const currency = getConfigValue('STRIPE_CURRENCY', 'eur').toLowerCase();

  return {
    secretKey,
    webhookSecret,
    priceCents,
    currency,
    enabled: Boolean(secretKey && webhookSecret && Number.isFinite(priceCents) && priceCents > 0)
  };
}

export function getMailConfig() {
  const host = getConfigValue('SMTP_HOST');
  const port = Number(getConfigValue('SMTP_PORT', '587'));
  const user = getConfigValue('SMTP_USER');
  const password = getConfigValue('SMTP_PASSWORD');
  const fromEmail = getConfigValue('MAIL_FROM_EMAIL');
  const fromName = getConfigValue('MAIL_FROM_NAME', 'Nornsight');
  const replyTo = getConfigValue('MAIL_REPLY_TO');
  const secure = getConfigValue('SMTP_SECURE', 'false') === 'true';

  return {
    host,
    port,
    user,
    password,
    fromEmail,
    fromName,
    replyTo,
    secure,
    enabled: Boolean(host && port && user && password && fromEmail)
  };
}

export function getCloudflareConfig() {
  return {
    zone: getConfigValue('CLOUDFLARE_ZONE', ''),
    apiHostname: getConfigValue('API_PUBLIC_HOSTNAME', ''),
    trustedProxy: getConfigValue('TRUST_PROXY_HEADERS', 'true') === 'true'
  };
}
