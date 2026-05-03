import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const SERVER_DIR = path.dirname(fileURLToPath(import.meta.url));
const STORE_PATH = path.resolve(SERVER_DIR, '../../../../.nornsight-store.json');

function ensureStoreFile() {
  const storeDir = path.dirname(STORE_PATH);

  if (!existsSync(storeDir)) {
    mkdirSync(storeDir, { recursive: true });
  }

  if (!existsSync(STORE_PATH)) {
    writeFileSync(STORE_PATH, JSON.stringify({ tirages: [], payments: [], mailEvents: [] }, null, 2), 'utf-8');
  }
}

function readStore() {
  try {
    ensureStoreFile();
    const parsed = JSON.parse(readFileSync(STORE_PATH, 'utf-8'));
    return {
      tirages: Array.isArray(parsed?.tirages) ? parsed.tirages : [],
      payments: Array.isArray(parsed?.payments) ? parsed.payments : [],
      mailEvents: Array.isArray(parsed?.mailEvents) ? parsed.mailEvents : []
    };
  } catch (error) {
    console.error('Error reading local drawings store:', error);
    return { tirages: [], payments: [], mailEvents: [] };
  }
}

function writeStore(store) {
  ensureStoreFile();
  writeFileSync(STORE_PATH, JSON.stringify(store, null, 2), 'utf-8');
}

export function createLocalDrawingRepository() {
  return {
    mode: 'local',

    async saveDrawing(record) {
      const store = readStore();
      const existingIndex = store.tirages.findIndex((entry) => entry.id === record.id);

      if (existingIndex >= 0) {
        store.tirages[existingIndex] = record;
      } else {
        store.tirages.push(record);
      }

      writeStore(store);
      return record;
    },

    async findDrawingById(id) {
      return readStore().tirages.find((entry) => entry.id === id) || null;
    },

    async findRecentUnlock({ questionFingerprint, emailNormalized, ipFingerprint, since }) {
      return (
        readStore().tirages.find((entry) => {
          if (!entry.fullUnlockedAt) {
            return false;
          }

          const unlockedAt = new Date(entry.fullUnlockedAt).getTime();
          if (!Number.isFinite(unlockedAt) || unlockedAt < since) {
            return false;
          }

          const sameQuestion = entry.questionFingerprint === questionFingerprint;
          const sameEmail = entry.emailNormalized === emailNormalized;
          const sameIp = entry.ipFingerprint === ipFingerprint;

          return sameQuestion && (sameEmail || sameIp);
        }) || null
      );
    },

    async listRecentDrawings(limit = 20) {
      return readStore()
        .tirages
        .slice()
        .sort((left, right) => new Date(right.updatedAt || right.createdAt).getTime() - new Date(left.updatedAt || left.createdAt).getTime())
        .slice(0, limit);
    },

    async savePayment(record) {
      const store = readStore();
      const paymentId = record.id || record.stripeSessionId;
      const existingIndex = store.payments.findIndex(
        (entry) => entry.id === paymentId || entry.stripeSessionId === record.stripeSessionId
      );
      const nextRecord = {
        ...record,
        id: paymentId
      };

      if (existingIndex >= 0) {
        store.payments[existingIndex] = {
          ...store.payments[existingIndex],
          ...nextRecord
        };
      } else {
        store.payments.push(nextRecord);
      }

      writeStore(store);
      return nextRecord;
    },

    async findPaymentBySessionId(stripeSessionId) {
      return readStore().payments.find((entry) => entry.stripeSessionId === stripeSessionId) || null;
    },

    async saveMailEvent(record) {
      const store = readStore();
      store.mailEvents.push(record);
      writeStore(store);
      return record;
    }
  };
}
