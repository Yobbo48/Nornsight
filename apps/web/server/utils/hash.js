import { createHash } from 'node:crypto';

export function hashValue(value) {
  return createHash('sha256').update(String(value || '')).digest('hex');
}

export function normalizeQuestion(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ');
}
