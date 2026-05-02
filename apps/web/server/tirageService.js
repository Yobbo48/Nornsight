import {
  buildHeuristicRuneDecision,
  createFreeReadingSummary,
  createTeaserFallback
} from '../src/lib/runeReadingPrompt.js';
import { getDrawingRepository } from './data/drawingRepository.js';
import { getPublicAppUrl, isAdminEmail, normalizeEmail } from './config/env.js';
import { buildLangfuseReadingMetadata, withLangfuseSpan, withLangfuseTrace } from './langfuse.js';
import { sendTransactionalMail } from './mailService.js';
import { drawRunes } from './runeDrawService.js';
import { createRuneReading } from './runeReadingService.js';
import { createStripeCheckoutSession } from './stripeService.js';
import { hashValue, normalizeQuestion } from './utils/hash.js';
import { MAX_QUESTION_LENGTH } from '../src/lib/questionLimits.js';

const FULL_READING_COOLDOWN_MS = 24 * 60 * 60 * 1000;
const CHECKOUT_REUSE_WINDOW_MS = 30 * 60 * 1000;
const STALE_GENERATION_TIMEOUT_MS = 15 * 60 * 1000;
const activeGenerationLocks = new Set();
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function serializeRunes(runes) {
  return runes.map((rune) => ({
    symbole: rune.symbole,
    nom: rune.nom,
    // Nornsight does not actively use reversed runes. Any remaining orientation field is
    // preserved only for compatibility with existing records; blocking nuances come from metadata.
    isReversed: Boolean(rune.isReversed),
    orientationLabel: rune.orientationLabel || (rune.isReversed ? 'Renversée' : 'Droite'),
    positionKey: rune.positionKey,
    positionLabel: rune.positionLabel,
    interpretation: rune.interpretation,
    positionKeywords: rune.positionKeywords
  }));
}

function buildQuestionFingerprint(question) {
  return hashValue(normalizeQuestion(question));
}

function buildIpFingerprint(requestIp) {
  return hashValue(String(requestIp || 'unknown').trim());
}

function buildReadingSnapshot({ runes, summary, teaser, fullReading }) {
  return {
    runes: serializeRunes(runes),
    freeReadingSummary: summary,
    teaserReading: teaser,
    fullReading
  };
}

function generateTirageId() {
  return `tirage_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function isValidEmail(value) {
  return EMAIL_PATTERN.test(String(value || '').trim());
}

function buildManageUrl({ origin, locale = 'fr', tirageId }) {
  const baseUrl = getPublicAppUrl(origin || '').replace(/\/+$/, '');
  const url = new URL(baseUrl || origin || 'http://localhost:3003');
  url.searchParams.set('lang', locale);
  url.searchParams.set('checkout', 'success');
  url.searchParams.set('tirageId', tirageId);
  return url.toString();
}

function getOrderState(record) {
  return record?.interpretation?.orderState || {};
}

function mergeInterpretation(record, { runes, summary, teaser, fullReading, orderState, appendMailEvent } = {}) {
  const previous = record?.interpretation || {};
  const nextMailHistory = Array.isArray(previous.mailHistory) ? previous.mailHistory.slice(-9) : [];

  if (appendMailEvent) {
    nextMailHistory.push(appendMailEvent);
  }

  return {
    ...previous,
    runes: serializeRunes(runes || previous.runes || []),
    freeReadingSummary: summary ?? previous.freeReadingSummary ?? '',
    teaserReading: teaser ?? previous.teaserReading ?? '',
    fullReading: fullReading ?? previous.fullReading ?? '',
    orderState: {
      ...(previous.orderState || {}),
      ...(orderState || {})
    },
    mailHistory: nextMailHistory
  };
}

function buildDrawingRecord({
  existingRecord,
  id,
  email,
  question,
  questionFingerprint,
  ipFingerprint,
  runes,
  summary,
  teaser,
  fullReading,
  status,
  fullUnlockedAt,
  orderState,
  appendMailEvent
}) {
  const timestamp = new Date().toISOString();

  return {
    ...(existingRecord || {}),
    id,
    email: email || existingRecord?.email || '',
    emailNormalized: email || existingRecord?.emailNormalized || '',
    question,
    questionFingerprint,
    ipFingerprint,
    createdAt: existingRecord?.createdAt || timestamp,
    updatedAt: timestamp,
    fullUnlockedAt: fullUnlockedAt || existingRecord?.fullUnlockedAt || null,
    status,
    runes: serializeRunes(runes || existingRecord?.runes || []),
    interpretation: mergeInterpretation(existingRecord, {
      runes,
      summary,
      teaser,
      fullReading,
      orderState,
      appendMailEvent
    })
  };
}

async function persistMailEvent(repository, mailEvent) {
  if (!mailEvent) {
    return;
  }

  await repository.saveMailEvent({
    id: `mail_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    ...mailEvent
  });
}

async function sendOrderMail({ repository, record, locale = 'fr', type, reading = '', origin = '' }) {
  if (!record?.emailNormalized) {
    return null;
  }

  try {
    const result = await sendTransactionalMail({
      to: record.emailNormalized,
      locale,
      type,
      question: record.question,
      reading,
      manageUrl: buildManageUrl({ origin, locale, tirageId: record.id }),
      tirageId: record.id
    });

    await persistMailEvent(repository, {
      tirageId: record.id,
      type,
      status: result.status,
      messageId: result.messageId || '',
      at: result.at || new Date().toISOString()
    });

    return result;
  } catch (error) {
    const failedResult = {
      status: 'failed',
      type,
      tirageId: record.id,
      error: error?.message || 'Mail error',
      at: new Date().toISOString()
    };
    console.error('[mail] failed', failedResult);
    await persistMailEvent(repository, failedResult);
    return failedResult;
  }
}

async function savePaymentRecord(repository, payload) {
  await repository.savePayment({
    id: payload.id || payload.stripeSessionId,
    tirageId: payload.tirageId,
    email: payload.email,
    emailNormalized: payload.email,
    stripeSessionId: payload.stripeSessionId,
    stripePaymentIntentId: payload.stripePaymentIntentId || '',
    amountCents: payload.amountCents,
    currency: payload.currency || 'eur',
    status: payload.status,
    createdAt: payload.createdAt || new Date().toISOString(),
    paidAt: payload.paidAt || null
  });
}

async function generateAndDeliverPaidReading({ tirageId, locale = 'fr', theme = 'situation', origin = '' }) {
  if (activeGenerationLocks.has(tirageId)) {
    return { status: 'generating', tirageId, reused: true };
  }

  activeGenerationLocks.add(tirageId);

  try {
    const repository = await getDrawingRepository();
    const record = await repository.findDrawingById(tirageId);

    if (!record) {
      throw new Error('Tirage introuvable.');
    }

    if (record.status === 'delivered' && record.interpretation?.fullReading) {
      return {
        status: 'delivered',
        tirageId,
        reading: record.interpretation.fullReading,
        reused: true
      };
    }

    const generatingRecord = buildDrawingRecord({
      existingRecord: record,
      id: record.id,
      email: record.emailNormalized,
      question: record.question,
      questionFingerprint: record.questionFingerprint,
      ipFingerprint: record.ipFingerprint,
      runes: record.runes,
      summary: record.interpretation?.freeReadingSummary || '',
      teaser: record.interpretation?.teaserReading || '',
      fullReading: record.interpretation?.fullReading || '',
      status: 'generating',
      fullUnlockedAt: null,
      orderState: {
        paymentStatus: 'paid',
        generationStatus: 'running',
        generationStartedAt: new Date().toISOString(),
        lastError: ''
      }
    });

    await repository.saveDrawing(generatingRecord);

    const reading = await createRuneReading({
      tirageId: record.id,
      question: record.question,
      runes: record.runes,
      mode: 'full',
      locale,
      theme
    });

    const deliveredAt = new Date().toISOString();
    let deliveredRecord = buildDrawingRecord({
      existingRecord: generatingRecord,
      id: generatingRecord.id,
      email: generatingRecord.emailNormalized,
      question: generatingRecord.question,
      questionFingerprint: generatingRecord.questionFingerprint,
      ipFingerprint: generatingRecord.ipFingerprint,
      runes: generatingRecord.runes,
      summary: generatingRecord.interpretation?.freeReadingSummary || '',
      teaser: generatingRecord.interpretation?.teaserReading || '',
      fullReading: reading,
      status: 'delivered',
      fullUnlockedAt: deliveredAt,
      orderState: {
        paymentStatus: 'paid',
        generationStatus: 'completed',
        deliveredAt,
        lastError: ''
      }
    });

    const deliveredMail = await sendOrderMail({
      repository,
      record: deliveredRecord,
      locale,
      type: 'reading_delivered',
      reading,
      origin
    });

    deliveredRecord = buildDrawingRecord({
      existingRecord: deliveredRecord,
      id: deliveredRecord.id,
      email: deliveredRecord.emailNormalized,
      question: deliveredRecord.question,
      questionFingerprint: deliveredRecord.questionFingerprint,
      ipFingerprint: deliveredRecord.ipFingerprint,
      runes: deliveredRecord.runes,
      summary: deliveredRecord.interpretation?.freeReadingSummary || '',
      teaser: deliveredRecord.interpretation?.teaserReading || '',
      fullReading: reading,
      status: 'delivered',
      fullUnlockedAt: deliveredAt,
      orderState: {
        mailStatus: deliveredMail?.status || 'disabled',
        lastMailType: 'reading_delivered',
        lastMailAt: deliveredMail?.at || '',
        lastError: ''
      },
      appendMailEvent: deliveredMail
        ? {
            type: 'reading_delivered',
            status: deliveredMail.status,
            at: deliveredMail.at || new Date().toISOString()
          }
        : null
    });

    await repository.saveDrawing(deliveredRecord);

    return {
      status: 'delivered',
      tirageId,
      reading
    };
  } catch (error) {
    const repository = await getDrawingRepository();
    const record = await repository.findDrawingById(tirageId);

    if (record) {
      const failedAt = new Date().toISOString();
      let failedRecord = buildDrawingRecord({
        existingRecord: record,
        id: record.id,
        email: record.emailNormalized,
        question: record.question,
        questionFingerprint: record.questionFingerprint,
        ipFingerprint: record.ipFingerprint,
        runes: record.runes,
        summary: record.interpretation?.freeReadingSummary || '',
        teaser: record.interpretation?.teaserReading || '',
        fullReading: record.interpretation?.fullReading || '',
        status: 'failed',
        fullUnlockedAt: null,
        orderState: {
          generationStatus: 'failed',
          failedAt,
          lastError: error?.message || 'Generation failed'
        }
      });

      const delayedMail = await sendOrderMail({
        repository,
        record: failedRecord,
        locale,
        type: 'delivery_delayed',
        origin
      });

      failedRecord = buildDrawingRecord({
        existingRecord: failedRecord,
        id: failedRecord.id,
        email: failedRecord.emailNormalized,
        question: failedRecord.question,
        questionFingerprint: failedRecord.questionFingerprint,
        ipFingerprint: failedRecord.ipFingerprint,
        runes: failedRecord.runes,
        summary: failedRecord.interpretation?.freeReadingSummary || '',
        teaser: failedRecord.interpretation?.teaserReading || '',
        fullReading: failedRecord.interpretation?.fullReading || '',
        status: 'failed',
        fullUnlockedAt: null,
        orderState: {
          mailStatus: delayedMail?.status || 'disabled',
          lastMailType: 'delivery_delayed',
          lastMailAt: delayedMail?.at || '',
          lastError: error?.message || 'Generation failed'
        },
        appendMailEvent: delayedMail
          ? {
              type: 'delivery_delayed',
              status: delayedMail.status,
              at: delayedMail.at || new Date().toISOString()
            }
          : null
      });

      await repository.saveDrawing(failedRecord);
    }

    throw error;
  } finally {
    activeGenerationLocks.delete(tirageId);
  }
}

export async function createFreeTirage({ question, requestIp, locale = 'fr', theme = 'situation' }) {
  const trimmedQuestion = String(question || '').trim();

  if (!trimmedQuestion) {
    const error = new Error('La question est requise.');
    error.statusCode = 400;
    throw error;
  }

  if (trimmedQuestion.length > MAX_QUESTION_LENGTH) {
    const error = new Error('Ta question est un peu trop longue. Essaie de la formuler en 300 caractères maximum, avec l’essentiel de la situation.');
    error.statusCode = 400;
    throw error;
  }

  const tirageId = generateTirageId();

  return withLangfuseTrace(
    {
      tirageId,
      traceName: 'nornsight_reading',
      input: {
        question: trimmedQuestion,
        locale,
        theme
      },
      metadata: {
        stage: 'free_tirage'
      }
    },
    async (traceObservation) => {
      const runes = drawRunes();
      const decision = buildHeuristicRuneDecision({ question: trimmedQuestion, runes, locale, theme });

      await withLangfuseSpan(
        traceObservation,
        'question_classification',
        {
          input: { question: trimmedQuestion, locale, theme },
          metadata: {
            question_category: decision.question_category,
            question_handling: decision.question_handling,
            theme
          }
        },
        async (span) => {
          span?.update({
            output: {
              question_category: decision.question_category,
              question_handling: decision.question_handling
            }
          });
        }
      );

      await withLangfuseSpan(
        traceObservation,
        'local_decision',
        {
          input: { question: trimmedQuestion, runes },
          metadata: buildLangfuseReadingMetadata({
            question: trimmedQuestion,
            theme,
            runes,
            decision,
            shortAnswer: decision?.internal_synthesis?.reponse_courte,
            usedFreeAi: false,
            usedFullAi: false,
            usedFullFallback: false,
            modelFree: '',
            modelFull: ''
          })
        },
        async (span) => {
          span?.update({
            output: {
              decision: decision.decision,
              global_tone: decision.global_tone,
              support_level: decision.support_level,
              friction_level: decision.friction_level,
              opening_level: decision.opening_level,
              confidence_level: decision.confidence_level
            }
          });
        }
      );

      const summary = createFreeReadingSummary({ runes, question: trimmedQuestion, locale, theme, decision });
      let teaser = '';
      let usedTeaserAi = false;

      try {
        teaser = await createRuneReading(
          {
            question: trimmedQuestion,
            runes,
            mode: 'teaser',
            locale,
            theme
          },
          {
            tirageId,
            traceObservation
          }
        );
        usedTeaserAi = true;
      } catch (error) {
        teaser = createTeaserFallback({ question: trimmedQuestion, runes, locale, theme, decision });
      }

      await withLangfuseSpan(
        traceObservation,
        'free_generation',
        {
          input: {
            question: trimmedQuestion,
            runes
          },
          output: summary,
          metadata: buildLangfuseReadingMetadata({
            question: trimmedQuestion,
            theme,
            runes,
            decision,
            shortAnswer: decision?.internal_synthesis?.reponse_courte,
            usedFreeAi: false,
            usedFullAi: usedTeaserAi,
            usedFullFallback: false,
            modelFree: '',
            modelFull: usedTeaserAi ? 'teaser' : ''
          })
        },
        async () => {}
      );

      await withLangfuseSpan(
        traceObservation,
        'teaser_generation',
        {
          input: {
            question: trimmedQuestion,
            runes
          },
          output: teaser,
          metadata: buildLangfuseReadingMetadata({
            question: trimmedQuestion,
            theme,
            runes,
            decision,
            shortAnswer: decision?.internal_synthesis?.reponse_courte,
            usedFreeAi: false,
            usedFullAi: usedTeaserAi,
            usedFullFallback: false,
            modelFree: '',
            modelFull: usedTeaserAi ? 'teaser' : ''
          })
        },
        async () => {}
      );

      const record = buildDrawingRecord({
        id: tirageId,
        email: '',
        question: trimmedQuestion,
        questionFingerprint: buildQuestionFingerprint(trimmedQuestion),
        ipFingerprint: buildIpFingerprint(requestIp),
        runes,
        summary,
        teaser,
        fullReading: '',
        status: 'created',
        orderState: {
          paymentStatus: 'created',
          generationStatus: 'idle',
          mailStatus: 'idle',
          lastError: ''
        }
      });

      const repository = await getDrawingRepository();
      await repository.saveDrawing(record);

      const result = {
        tirageId: record.id,
        question: trimmedQuestion,
        theme,
        runes: serializeRunes(runes),
        summary,
        teaser
      };

      await withLangfuseSpan(
        traceObservation,
        'final_render',
        {
          output: result,
          metadata: buildLangfuseReadingMetadata({
            question: trimmedQuestion,
            theme,
            runes,
            decision,
            shortAnswer: decision?.internal_synthesis?.reponse_courte,
            usedFreeAi: false,
            usedFullAi: false,
            usedFullFallback: false,
            modelFree: '',
            modelFull: ''
          })
        },
        async () => {}
      );

      return result;
    }
  );
}

export async function createCheckoutForTirage({
  tirageId,
  email,
  question,
  runes,
  freeReadingSummary,
  teaserReading,
  requestIp,
  requestOrigin,
  locale = 'fr',
  theme = 'situation'
}) {
  const trimmedQuestion = String(question || '').trim();
  const normalizedEmail = normalizeEmail(email);

  if (!tirageId || !normalizedEmail || !trimmedQuestion || !Array.isArray(runes) || runes.length !== 3) {
    throw new Error('Les informations du paiement sont incomplètes.');
  }

  if (!isValidEmail(normalizedEmail)) {
    throw new Error(locale === 'en' ? 'Please enter a valid email address before payment.' : 'Merci de renseigner une adresse email valide avant le paiement.');
  }

  const repository = await getDrawingRepository();
  const existingRecord = await repository.findDrawingById(tirageId);
  const questionFingerprint = buildQuestionFingerprint(trimmedQuestion);
  const ipFingerprint = buildIpFingerprint(requestIp);
  const baseRecord = buildDrawingRecord({
    existingRecord,
    id: tirageId,
    email: normalizedEmail,
    question: trimmedQuestion,
    questionFingerprint,
    ipFingerprint,
    runes,
    summary: freeReadingSummary,
    teaser: teaserReading,
    fullReading: existingRecord?.interpretation?.fullReading || '',
    status: existingRecord?.status || 'created'
  });

  if (baseRecord.status === 'delivered' && baseRecord.interpretation?.fullReading) {
    return {
      status: 'already_delivered',
      tirageId,
      reading: baseRecord.interpretation.fullReading
    };
  }

  const orderState = getOrderState(baseRecord);
  const pendingCheckoutAt = new Date(orderState.checkoutCreatedAt || 0).getTime();
  if (
    orderState.paymentStatus === 'payment_pending' &&
    orderState.checkoutUrl &&
    Number.isFinite(pendingCheckoutAt) &&
    pendingCheckoutAt >= Date.now() - CHECKOUT_REUSE_WINDOW_MS
  ) {
    return {
      status: 'checkout_created',
      tirageId,
      checkoutUrl: orderState.checkoutUrl,
      reused: true
    };
  }

  let session;
  try {
    session = await createStripeCheckoutSession({
      tirageId,
      email: normalizedEmail,
      locale,
      question: trimmedQuestion,
      origin: requestOrigin,
      metadata: {
        theme
      }
    });
  } catch (error) {
    if (error?.message === 'stripe_not_configured') {
      return {
        status: 'not_ready',
        tirageId,
        message:
          locale === 'en'
            ? 'Stripe payment is not active here yet. The checkout flow is ready, but the live keys are not connected.'
            : 'Le paiement Stripe n’est pas encore activé ici. Le tunnel est prêt, mais les clés réelles ne sont pas encore branchées.'
      };
    }

    throw error;
  }

  const nextRecord = buildDrawingRecord({
    existingRecord: baseRecord,
    id: tirageId,
    email: normalizedEmail,
    question: trimmedQuestion,
    questionFingerprint,
    ipFingerprint,
    runes,
    summary: freeReadingSummary,
    teaser: teaserReading,
    fullReading: baseRecord.interpretation?.fullReading || '',
    status: 'payment_pending',
    orderState: {
      paymentStatus: 'payment_pending',
      checkoutSessionId: session.id,
      checkoutCreatedAt: new Date().toISOString(),
      checkoutUrl: session.url,
      amountCents: session.amountTotal,
      currency: session.currency,
      lastError: ''
    }
  });

  await repository.saveDrawing(nextRecord);
  await savePaymentRecord(repository, {
    id: session.id,
    tirageId,
    email: normalizedEmail,
    stripeSessionId: session.id,
    amountCents: session.amountTotal,
    currency: session.currency,
    status: 'payment_pending'
  });

  return {
    status: 'checkout_created',
    tirageId,
    checkoutUrl: session.url,
    sessionId: session.id
  };
}

export async function getTirageDeliveryStatus({ tirageId }) {
  if (!tirageId) {
    throw new Error('Le tirage est requis.');
  }

  const repository = await getDrawingRepository();
  let record = await repository.findDrawingById(tirageId);

  if (!record) {
    throw new Error('Tirage introuvable.');
  }

  let orderState = getOrderState(record);
  const generationStartedAt = new Date(orderState.generationStartedAt || 0).getTime();
  const isStaleGenerating =
    record.status === 'generating' &&
    Number.isFinite(generationStartedAt) &&
    generationStartedAt > 0 &&
    generationStartedAt <= Date.now() - STALE_GENERATION_TIMEOUT_MS;

  if (isStaleGenerating) {
    record = buildDrawingRecord({
      existingRecord: record,
      id: record.id,
      email: record.emailNormalized,
      question: record.question,
      questionFingerprint: record.questionFingerprint,
      ipFingerprint: record.ipFingerprint,
      runes: record.runes,
      summary: record.interpretation?.freeReadingSummary || '',
      teaser: record.interpretation?.teaserReading || '',
      fullReading: record.interpretation?.fullReading || '',
      status: 'failed',
      fullUnlockedAt: null,
      orderState: {
        generationStatus: 'failed',
        failedAt: new Date().toISOString(),
        lastError: 'Generation timeout exceeded'
      }
    });

    await repository.saveDrawing(record);
    orderState = getOrderState(record);
  }

  return {
    tirageId: record.id,
    status: record.status,
    reading: record.status === 'delivered' ? record.interpretation?.fullReading || '' : '',
    hasReading: Boolean(record.interpretation?.fullReading),
    paymentStatus: orderState.paymentStatus || 'created',
    generationStatus: orderState.generationStatus || 'idle',
    mailStatus: orderState.mailStatus || 'idle',
    lastError: orderState.lastError || '',
    deliveredAt: orderState.deliveredAt || record.fullUnlockedAt || '',
    paymentConfirmedAt: orderState.paymentConfirmedAt || '',
    checkoutCreatedAt: orderState.checkoutCreatedAt || ''
  };
}

export async function processStripeCheckoutCompleted({ session, origin = '' }) {
  const tirageId = String(session?.metadata?.tirageId || '').trim();
  const locale = String(session?.metadata?.locale || 'fr').trim() || 'fr';
  const theme = String(session?.metadata?.theme || 'situation').trim() || 'situation';

  if (!tirageId) {
    return { status: 'ignored', reason: 'missing_tirage_id' };
  }

  const repository = await getDrawingRepository();
  const record = await repository.findDrawingById(tirageId);

  if (!record) {
    return { status: 'ignored', reason: 'tirage_not_found', tirageId };
  }

  const existingPayment = await repository.findPaymentBySessionId(session.id);
  if (existingPayment?.status === 'paid' && record.status === 'delivered') {
    return { status: 'already_processed', tirageId };
  }

  const paidAt = new Date().toISOString();
  await savePaymentRecord(repository, {
    id: session.id,
    tirageId,
    email: record.emailNormalized,
    stripeSessionId: session.id,
    stripePaymentIntentId:
      typeof session.payment_intent === 'string' ? session.payment_intent : session.payment_intent?.id || '',
    amountCents: session.amount_total || getOrderState(record).amountCents || 0,
    currency: session.currency || getOrderState(record).currency || 'eur',
    status: 'paid',
    paidAt
  });

  let paidRecord = buildDrawingRecord({
    existingRecord: record,
    id: record.id,
    email: record.emailNormalized,
    question: record.question,
    questionFingerprint: record.questionFingerprint,
    ipFingerprint: record.ipFingerprint,
    runes: record.runes,
    summary: record.interpretation?.freeReadingSummary || '',
    teaser: record.interpretation?.teaserReading || '',
    fullReading: record.interpretation?.fullReading || '',
    status: 'paid',
    orderState: {
      paymentStatus: 'paid',
      paymentConfirmedAt: paidAt,
      stripeSessionId: session.id,
      stripePaymentIntentId:
        typeof session.payment_intent === 'string' ? session.payment_intent : session.payment_intent?.id || '',
      lastError: ''
    }
  });

  const paymentMail = await sendOrderMail({
    repository,
    record: paidRecord,
    locale,
    type: 'payment_received',
    origin
  });

  paidRecord = buildDrawingRecord({
    existingRecord: paidRecord,
    id: paidRecord.id,
    email: paidRecord.emailNormalized,
    question: paidRecord.question,
    questionFingerprint: paidRecord.questionFingerprint,
    ipFingerprint: paidRecord.ipFingerprint,
    runes: paidRecord.runes,
    summary: paidRecord.interpretation?.freeReadingSummary || '',
    teaser: paidRecord.interpretation?.teaserReading || '',
    fullReading: paidRecord.interpretation?.fullReading || '',
    status: 'paid',
    orderState: {
      mailStatus: paymentMail?.status || 'disabled',
      lastMailType: 'payment_received',
      lastMailAt: paymentMail?.at || ''
    },
    appendMailEvent: paymentMail
      ? {
          type: 'payment_received',
          status: paymentMail.status,
          at: paymentMail.at || new Date().toISOString()
        }
      : null
  });

  await repository.saveDrawing(paidRecord);

  return generateAndDeliverPaidReading({
    tirageId,
    locale,
    theme,
    origin
  });
}

export async function unlockFullTirage({
  tirageId,
  email,
  question,
  runes,
  freeReadingSummary,
  teaserReading,
  requestIp,
  locale = 'fr',
  theme = 'situation'
}) {
  const trimmedQuestion = String(question || '').trim();
  const normalizedEmail = normalizeEmail(email);
  const adminBypass = isAdminEmail(normalizedEmail);

  if (!normalizedEmail || !trimmedQuestion || !Array.isArray(runes) || runes.length !== 3) {
    throw new Error('Les informations du tirage sont incomplètes.');
  }

  const effectiveTirageId = tirageId || generateTirageId();

  return withLangfuseTrace(
    {
      tirageId: effectiveTirageId,
      traceName: 'nornsight_reading',
      input: {
        question: trimmedQuestion,
        locale,
        theme,
        email: normalizedEmail
      },
      metadata: {
        stage: 'unlock_full',
        admin_bypass: adminBypass
      }
    },
    async (traceObservation) => {
      const now = Date.now();
      const questionFingerprint = buildQuestionFingerprint(trimmedQuestion);
      const ipFingerprint = buildIpFingerprint(requestIp);
      const repository = await getDrawingRepository();
      const recentUnlock = adminBypass
        ? null
        : await repository.findRecentUnlock({
            questionFingerprint,
            emailNormalized: normalizedEmail,
            ipFingerprint,
            since: now - FULL_READING_COOLDOWN_MS
          });

      if (recentUnlock) {
        if (
          recentUnlock.emailNormalized === normalizedEmail &&
          recentUnlock.interpretation?.fullReading
        ) {
          const reusedResult = {
            status: 'unlocked',
            tirageId: recentUnlock.id,
            reading: recentUnlock.interpretation.fullReading,
            reused: true
          };

          await withLangfuseSpan(
            traceObservation,
            'final_render',
            {
              output: reusedResult,
              metadata: {
                reused: true
              }
            },
            async () => {}
          );

          return reusedResult;
        }

        const blockedResult = {
          status: 'blocked',
          message:
            'Une lecture complète a déjà été demandée pour cette question depuis cette adresse email ou cette connexion au cours des dernières 24 heures. Tu pourras en demander une nouvelle demain.'
        };

        await withLangfuseSpan(
          traceObservation,
          'final_render',
          {
            output: blockedResult,
            metadata: {
              blocked: true
            }
          },
          async () => {}
        );

        return blockedResult;
      }

      const reading = await createRuneReading(
        {
          tirageId: effectiveTirageId,
          question: trimmedQuestion,
          runes,
          mode: 'full',
          locale,
          theme
        },
        {
          traceObservation,
          tirageId: effectiveTirageId
        }
      );

      const timestamp = new Date().toISOString();
      const existingRecord = await repository.findDrawingById(effectiveTirageId);
      const record = buildDrawingRecord({
        existingRecord,
        id: effectiveTirageId,
        email: normalizedEmail,
        question: trimmedQuestion,
        questionFingerprint,
        ipFingerprint,
        runes,
        summary: freeReadingSummary,
        teaser: teaserReading,
        fullReading: reading,
        status: 'delivered',
        fullUnlockedAt: timestamp,
        orderState: {
          paymentStatus: adminBypass ? 'bypass' : 'paid',
          generationStatus: 'completed',
          mailStatus: 'bypass',
          deliveredAt: timestamp,
          lastError: ''
        }
      });

      await repository.saveDrawing(record);

      const result = {
        status: 'delivered',
        tirageId: record.id,
        reading,
        isAdminBypass: adminBypass
      };

      await withLangfuseSpan(
        traceObservation,
        'final_render',
        {
          output: result,
          metadata: {
            admin_bypass: adminBypass
          }
        },
        async () => {}
      );

      return result;
    }
  );
}

export async function saveTirageEmail({ tirageId, email }) {
  const normalizedEmail = normalizeEmail(email);

  if (!tirageId || !normalizedEmail) {
    throw new Error('Le tirage et l’email sont requis.');
  }

  if (!isValidEmail(normalizedEmail)) {
    throw new Error('Merci de renseigner une adresse email valide.');
  }

  const repository = await getDrawingRepository();
  const record = await repository.findDrawingById(tirageId);

  if (!record) {
    throw new Error('Tirage introuvable.');
  }

  const nextRecord = {
    ...record,
    email: normalizedEmail,
    emailNormalized: normalizedEmail,
    updatedAt: new Date().toISOString()
  };

  await repository.saveDrawing(nextRecord);

  return {
    status: 'saved',
    tirageId,
    email: normalizedEmail,
    isAdminEmail: isAdminEmail(normalizedEmail)
  };
}
