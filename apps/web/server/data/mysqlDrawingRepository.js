import { getMysqlPool } from './mysqlClient.js';

function serializeInterpretation(interpretation) {
  return JSON.stringify(interpretation || {});
}

function hydrateRecord(row) {
  if (!row) {
    return null;
  }

  const interpretation = typeof row.interpretation_json === 'string'
    ? JSON.parse(row.interpretation_json)
    : row.interpretation_json || {};

  return {
    id: row.public_id,
    email: row.email || '',
    emailNormalized: row.email || '',
    question: row.question,
    questionFingerprint: row.question_fingerprint,
    ipFingerprint: row.ip_fingerprint,
    createdAt: row.created_at instanceof Date ? row.created_at.toISOString() : row.created_at,
    updatedAt: row.updated_at instanceof Date ? row.updated_at.toISOString() : row.updated_at,
    fullUnlockedAt:
      row.full_unlocked_at instanceof Date
        ? row.full_unlocked_at.toISOString()
        : row.full_unlocked_at,
    status: row.status,
    runes: interpretation.runes || [],
    interpretation
  };
}

export async function createMysqlDrawingRepository() {
  const pool = await getMysqlPool();

  if (!pool) {
    return null;
  }

  return {
    mode: 'mysql',

    async ensureLeadId(email) {
      const normalizedEmail = String(email || '').trim().toLowerCase();
      if (!normalizedEmail) {
        return null;
      }

      await pool.query(
        `
          INSERT INTO leads (email)
          VALUES (?)
          ON DUPLICATE KEY UPDATE updated_at = CURRENT_TIMESTAMP
        `,
        [normalizedEmail]
      );

      const [leadRows] = await pool.query(`SELECT id FROM leads WHERE email = ? LIMIT 1`, [normalizedEmail]);
      return leadRows[0]?.id || null;
    },

    async saveDrawing(record) {
      const email = record.emailNormalized || null;

      const leadId = await this.ensureLeadId(email);

      await pool.query(
        `
          INSERT INTO tirages (
            lead_id,
            public_id,
            question,
            question_fingerprint,
            ip_fingerprint,
            rune_1,
            rune_2,
            rune_3,
            summary_text,
            teaser_text,
            full_reading_text,
            interpretation_json,
            status,
            full_unlocked_at
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE
            lead_id = VALUES(lead_id),
            question = VALUES(question),
            question_fingerprint = VALUES(question_fingerprint),
            ip_fingerprint = VALUES(ip_fingerprint),
            rune_1 = VALUES(rune_1),
            rune_2 = VALUES(rune_2),
            rune_3 = VALUES(rune_3),
            summary_text = VALUES(summary_text),
            teaser_text = VALUES(teaser_text),
            full_reading_text = VALUES(full_reading_text),
            interpretation_json = VALUES(interpretation_json),
            status = VALUES(status),
            full_unlocked_at = VALUES(full_unlocked_at),
            updated_at = CURRENT_TIMESTAMP
        `,
        [
          leadId,
          record.id,
          record.question,
          record.questionFingerprint,
          record.ipFingerprint,
          record.runes?.[0]?.nom || '',
          record.runes?.[1]?.nom || '',
          record.runes?.[2]?.nom || '',
          record.interpretation?.freeReadingSummary || null,
          record.interpretation?.teaserReading || null,
          record.interpretation?.fullReading || null,
          serializeInterpretation(record.interpretation),
          record.status,
          record.fullUnlockedAt ? new Date(record.fullUnlockedAt) : null
        ]
      );

      return record;
    },

    async findDrawingById(id) {
      const [rows] = await pool.query(
        `
          SELECT
            t.public_id,
            t.question,
            t.question_fingerprint,
            t.ip_fingerprint,
            t.status,
            t.full_unlocked_at,
            t.created_at,
            t.updated_at,
            t.interpretation_json,
            l.email
          FROM tirages t
          LEFT JOIN leads l ON l.id = t.lead_id
          WHERE t.public_id = ?
          LIMIT 1
        `,
        [id]
      );

      return hydrateRecord(rows[0]);
    },

    async findRecentUnlock({ questionFingerprint, emailNormalized, ipFingerprint, since }) {
      const [rows] = await pool.query(
        `
          SELECT
            t.public_id,
            t.question,
            t.question_fingerprint,
            t.ip_fingerprint,
            t.status,
            t.full_unlocked_at,
            t.created_at,
            t.updated_at,
            t.interpretation_json,
            l.email
          FROM tirages t
          LEFT JOIN leads l ON l.id = t.lead_id
          WHERE t.question_fingerprint = ?
            AND t.full_unlocked_at IS NOT NULL
            AND t.full_unlocked_at >= ?
            AND (l.email = ? OR t.ip_fingerprint = ?)
          ORDER BY t.full_unlocked_at DESC
          LIMIT 1
        `,
        [questionFingerprint, new Date(since), emailNormalized, ipFingerprint]
      );

      return hydrateRecord(rows[0]);
    },

    async listRecentDrawings(limit = 20) {
      const safeLimit = Math.min(Math.max(Number(limit) || 20, 1), 100);
      const [rows] = await pool.query(
        `
          SELECT
            t.public_id,
            t.question,
            t.question_fingerprint,
            t.ip_fingerprint,
            t.status,
            t.full_unlocked_at,
            t.created_at,
            t.updated_at,
            t.interpretation_json,
            l.email
          FROM tirages t
          LEFT JOIN leads l ON l.id = t.lead_id
          ORDER BY t.updated_at DESC, t.created_at DESC
          LIMIT ?
        `,
        [safeLimit]
      );

      return rows.map(hydrateRecord).filter(Boolean);
    },

    async savePayment(record) {
      const leadId = await this.ensureLeadId(record.emailNormalized || record.email || '');
      let tirageInternalId = null;

      if (record.tirageId) {
        const [tirageRows] = await pool.query(
          `SELECT id FROM tirages WHERE public_id = ? LIMIT 1`,
          [record.tirageId]
        );
        tirageInternalId = tirageRows[0]?.id || null;
      }

      await pool.query(
        `
          INSERT INTO payments (
            lead_id,
            tirage_id,
            stripe_session_id,
            stripe_payment_intent_id,
            amount_cents,
            currency,
            status,
            paid_at
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE
            stripe_payment_intent_id = VALUES(stripe_payment_intent_id),
            amount_cents = VALUES(amount_cents),
            currency = VALUES(currency),
            status = VALUES(status),
            paid_at = VALUES(paid_at)
        `,
        [
          leadId,
          tirageInternalId,
          record.stripeSessionId,
          record.stripePaymentIntentId || null,
          record.amountCents || 0,
          record.currency || 'eur',
          record.status === 'paid' ? 'paid' : record.status === 'failed' ? 'failed' : 'pending',
          record.paidAt ? new Date(record.paidAt) : null
        ]
      );

      return record;
    },

    async findPaymentBySessionId(stripeSessionId) {
      const [rows] = await pool.query(
        `
          SELECT
            p.id,
            p.stripe_session_id,
            p.stripe_payment_intent_id,
            p.amount_cents,
            p.currency,
            p.status,
            p.created_at,
            p.paid_at,
            t.public_id,
            l.email
          FROM payments p
          LEFT JOIN tirages t ON t.id = p.tirage_id
          LEFT JOIN leads l ON l.id = p.lead_id
          WHERE p.stripe_session_id = ?
          LIMIT 1
        `,
        [stripeSessionId]
      );

      const row = rows[0];
      if (!row) {
        return null;
      }

      return {
        id: row.id,
        tirageId: row.public_id || '',
        email: row.email || '',
        emailNormalized: row.email || '',
        stripeSessionId: row.stripe_session_id,
        stripePaymentIntentId: row.stripe_payment_intent_id || '',
        amountCents: row.amount_cents,
        currency: row.currency,
        status: row.status,
        createdAt: row.created_at instanceof Date ? row.created_at.toISOString() : row.created_at,
        paidAt: row.paid_at instanceof Date ? row.paid_at.toISOString() : row.paid_at
      };
    },

    async saveMailEvent(record) {
      return record;
    }
  };
}
