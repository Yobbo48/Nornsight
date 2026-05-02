import { randomUUID } from 'node:crypto';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { LangfuseSpanProcessor } from '@langfuse/otel';
import { LangfuseClient } from '@langfuse/client';
import { createTraceId, startActiveObservation } from '@langfuse/tracing';
import { getConfigValue } from './config/env.js';

const ROOT_SPAN_ID = '0123456789abcdef';
const DEFAULT_TRACE_NAME = 'nornsight_reading';
const MAX_STRING_LENGTH = 8000;

let sdkStartPromise = null;
let sdkInstance = null;
let spanProcessor = null;
let langfuseClient = null;

function truncateString(value, maxLength = MAX_STRING_LENGTH) {
  if (typeof value !== 'string') {
    return value;
  }

  return value.length > maxLength ? `${value.slice(0, maxLength)}…` : value;
}

function sanitizeForLangfuse(value) {
  if (value == null) {
    return value;
  }

  if (typeof value === 'string') {
    return truncateString(value);
  }

  if (Array.isArray(value)) {
    return value.map((item) => sanitizeForLangfuse(item)).slice(0, 50);
  }

  if (typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value)
        .slice(0, 80)
        .map(([key, nestedValue]) => [key, sanitizeForLangfuse(nestedValue)])
    );
  }

  return value;
}

export function isLangfuseEnabled() {
  return Boolean(
    getConfigValue('LANGFUSE_PUBLIC_KEY') &&
      getConfigValue('LANGFUSE_SECRET_KEY') &&
      getConfigValue('LANGFUSE_BASE_URL')
  );
}

export async function ensureLangfuse() {
  if (!isLangfuseEnabled()) {
    return false;
  }

  if (!sdkStartPromise) {
    sdkStartPromise = (async () => {
      spanProcessor = new LangfuseSpanProcessor({
        publicKey: getConfigValue('LANGFUSE_PUBLIC_KEY'),
        secretKey: getConfigValue('LANGFUSE_SECRET_KEY'),
        baseUrl: getConfigValue('LANGFUSE_BASE_URL'),
        environment: getConfigValue('LANGFUSE_TRACING_ENVIRONMENT', getConfigValue('NODE_ENV', 'development')),
        release: getConfigValue('LANGFUSE_RELEASE', 'nornsight'),
        exportMode: getConfigValue('LANGFUSE_EXPORT_MODE', 'immediate'),
        timeout: Number(getConfigValue('LANGFUSE_TIMEOUT', '5'))
      });

      sdkInstance = new NodeSDK({
        spanProcessors: [spanProcessor]
      });

      await sdkInstance.start();
      return true;
    })().catch((error) => {
      sdkStartPromise = null;
      spanProcessor = null;
      sdkInstance = null;
      console.error('Langfuse initialization failed:', error);
      return false;
    });
  }

  return sdkStartPromise;
}

export function getLangfuseClient() {
  if (!isLangfuseEnabled()) {
    return null;
  }

  if (!langfuseClient) {
    langfuseClient = new LangfuseClient({
      publicKey: getConfigValue('LANGFUSE_PUBLIC_KEY'),
      secretKey: getConfigValue('LANGFUSE_SECRET_KEY'),
      baseUrl: getConfigValue('LANGFUSE_BASE_URL')
    });
  }

  return langfuseClient;
}

export function getLangfuseDebugInfo() {
  return {
    enabled: isLangfuseEnabled(),
    baseUrl: getConfigValue('LANGFUSE_BASE_URL', ''),
    hasPublicKey: Boolean(getConfigValue('LANGFUSE_PUBLIC_KEY')),
    hasSecretKey: Boolean(getConfigValue('LANGFUSE_SECRET_KEY'))
  };
}

export async function flushLangfuse() {
  try {
    if (spanProcessor) {
      await spanProcessor.forceFlush();
    }

    if (langfuseClient) {
      await langfuseClient.flush();
    }
  } catch (error) {
    console.error('Langfuse flush failed:', error);
  }
}

export async function withLangfuseTrace(
  {
    tirageId,
    traceName = DEFAULT_TRACE_NAME,
    input = null,
    metadata = null
  },
  fn
) {
  if (!(await ensureLangfuse())) {
    return fn(null, null);
  }

  const seed = tirageId || randomUUID();
  const traceId = await createTraceId(seed);

  return startActiveObservation(
    traceName,
    async (trace) => {
      trace.update({
        input: sanitizeForLangfuse(input),
        metadata: sanitizeForLangfuse({
          tirageId: tirageId || null,
          ...metadata
        })
      });

      try {
        return await fn(trace, traceId);
      } finally {
        await flushLangfuse();
      }
    },
    {
      parentSpanContext: {
        traceId,
        spanId: ROOT_SPAN_ID,
        traceFlags: 1
      }
    }
  );
}

export async function withLangfuseSpan(parentObservation, name, attributes, fn, options = {}) {
  if (!parentObservation) {
    return fn(null);
  }

  const observation = parentObservation.startObservation(
    name,
    {
      input: sanitizeForLangfuse(attributes?.input),
      output: sanitizeForLangfuse(attributes?.output),
      metadata: sanitizeForLangfuse(attributes?.metadata),
      model: attributes?.model,
      modelParameters: sanitizeForLangfuse(attributes?.modelParameters),
      level: attributes?.level,
      statusMessage: attributes?.statusMessage
    },
    options
  );

  try {
    const result = await fn(observation);
    return result;
  } catch (error) {
    observation.update({
      level: 'ERROR',
      statusMessage: error?.message || 'Unknown span error',
      output: sanitizeForLangfuse({
        error: error?.message || 'Unknown error'
      })
    });
    throw error;
  } finally {
    observation.end();
  }
}

export const NORN_SIGHT_MANUAL_SCORES = [
  'free_clarity',
  'paid_value',
  'rune_fidelity',
  'tone_accuracy',
  'repetition',
  'would_send_to_customer'
];

export function recordTraceScores(traceObservation, scores = {}, comment = '') {
  const client = getLangfuseClient();

  if (!client || !traceObservation) {
    return;
  }

  for (const scoreName of NORN_SIGHT_MANUAL_SCORES) {
    if (scores[scoreName] == null) {
      continue;
    }

    client.score.trace(
      { otelSpan: traceObservation.otelSpan },
      {
        name: scoreName,
        value: scores[scoreName],
        comment: comment || undefined
      }
    );
  }
}

export function buildLangfuseReadingMetadata({
  question,
  theme,
  runes,
  decision,
  shortAnswer = '',
  usedFreeAi = false,
  usedFullAi = false,
  usedFullFallback = false,
  modelFree = '',
  modelFull = ''
}) {
  return sanitizeForLangfuse({
    theme,
    question,
    runes,
    decision: decision?.decision,
    global_tone: decision?.global_tone,
    support_level: decision?.support_level,
    friction_level: decision?.friction_level,
    opening_level: decision?.opening_level,
    confidence_level: decision?.confidence_level,
    question_handling: decision?.question_handling,
    short_answer: shortAnswer || decision?.internal_synthesis?.reponse_courte || '',
    used_free_ai: usedFreeAi,
    used_full_ai: usedFullAi,
    used_full_fallback: usedFullFallback,
    model_free: modelFree,
    model_full: modelFull
  });
}
