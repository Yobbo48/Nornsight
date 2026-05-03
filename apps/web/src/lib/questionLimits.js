export const MAX_QUESTION_LENGTH = 300;
export const MIN_CONTEXT_HINT_WORDS = 8;

export function normalizeQuestionText(value) {
  return String(value || '').trim();
}

export function countQuestionWords(value) {
  return normalizeQuestionText(value).split(/\s+/).filter(Boolean).length;
}

export function isQuestionTooLong(value) {
  return normalizeQuestionText(value).length > MAX_QUESTION_LENGTH;
}

export function shouldShowQuestionContextHint(value) {
  const normalized = normalizeQuestionText(value);

  if (!normalized) {
    return false;
  }

  return countQuestionWords(normalized) < MIN_CONTEXT_HINT_WORDS;
}
