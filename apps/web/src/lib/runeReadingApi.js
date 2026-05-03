import { buildAdminPreviewQuery } from '@/lib/adminPreview.js';

const isNetworkFailure = (error) =>
  error?.name === 'TypeError' ||
  /failed to fetch/i.test(String(error?.message || '')) ||
  /networkerror/i.test(String(error?.message || ''));

const normalizeFetchError = (error, fallbackMessage) => {
  if (isNetworkFailure(error)) {
    return new Error('La connexion a été instable. Le tirage reste disponible.');
  }

  if (error instanceof Error) {
    return error;
  }

  return new Error(fallbackMessage);
};

export async function fetchRuneReading({ question, runes, mode, locale = 'fr', theme = 'situation', signal }) {
  try {
    const response = await fetch('/api/rune-reading', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ question, runes, mode, locale, theme }),
      signal
    });

    const payload = await response.json().catch(() => null);

    if (!response.ok) {
      const message = payload?.error || 'Impossible de générer la lecture personnalisée.';
      const error = new Error(message);
      error.payload = payload;
      throw error;
    }

    return payload;
  } catch (error) {
    throw normalizeFetchError(error, 'Impossible de générer la lecture personnalisée.');
  }
}

export async function createFreeTirage({ question, locale = 'fr', theme = 'situation', signal }) {
  try {
    const response = await fetch('/api/tirages/free', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ question, locale, theme }),
      signal
    });

    const payload = await response.json().catch(() => null);

    if (!response.ok) {
      const message = payload?.error || 'Impossible de lancer le tirage.';
      const error = new Error(message);
      error.payload = payload;
      throw error;
    }

    return payload;
  } catch (error) {
    throw normalizeFetchError(error, 'Impossible de lancer le tirage.');
  }
}

export async function saveTirageEmail({ tirageId, email, signal }) {
  try {
    const response = await fetch('/api/tirages/save-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ tirageId, email }),
      signal
    });

    const payload = await response.json().catch(() => null);

    if (!response.ok) {
      const message = payload?.error || 'Impossible d’enregistrer cet email.';
      const error = new Error(message);
      error.payload = payload;
      throw error;
    }

    return payload;
  } catch (error) {
    throw normalizeFetchError(error, 'Impossible d’enregistrer cet email.');
  }
}

export async function unlockFullReading({
  tirageId,
  email,
  question,
  runes,
  freeReadingSummary,
  teaserReading,
  locale = 'fr',
  theme = 'situation',
  signal
}) {
  try {
    const response = await fetch('/api/tirages/unlock', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        tirageId,
        email,
        question,
        runes,
        freeReadingSummary,
        teaserReading,
        locale,
        theme
      }),
      signal
    });

    const payload = await response.json().catch(() => null);

    if (response.status === 429) {
      return payload;
    }

    if (!response.ok) {
      const message = payload?.error || 'Impossible de débloquer la lecture complète.';
      const error = new Error(message);
      error.payload = payload;
      throw error;
    }

    return payload;
  } catch (error) {
    throw normalizeFetchError(error, 'Impossible de débloquer la lecture complète.');
  }
}

export async function createCheckoutSession({
  tirageId,
  email,
  question,
  runes,
  freeReadingSummary,
  teaserReading,
  locale = 'fr',
  theme = 'situation',
  signal
}) {
  try {
    const response = await fetch('/api/tirages/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        tirageId,
        email,
        question,
        runes,
        freeReadingSummary,
        teaserReading,
        locale,
        theme
      }),
      signal
    });

    const payload = await response.json().catch(() => null);

    if (!response.ok) {
      const message = payload?.error || 'Impossible de créer la session de paiement.';
      const error = new Error(message);
      error.payload = payload;
      throw error;
    }

    return payload;
  } catch (error) {
    throw normalizeFetchError(error, 'Impossible de créer la session de paiement.');
  }
}

export async function fetchTirageStatus({ tirageId, signal }) {
  try {
    const response = await fetch(`/api/tirages/status?tirageId=${encodeURIComponent(tirageId)}`, {
      method: 'GET',
      signal
    });

    const payload = await response.json().catch(() => null);

    if (!response.ok) {
      const message = payload?.error || 'Impossible de vérifier le statut du tirage.';
      const error = new Error(message);
      error.payload = payload;
      throw error;
    }

    return payload;
  } catch (error) {
    throw normalizeFetchError(error, 'Impossible de vérifier le statut du tirage.');
  }
}

export async function fetchAdminDrawings({ limit = 20, signal } = {}) {
  const response = await fetch(`/api/admin/tirages?${buildAdminPreviewQuery({ limit })}`, {
    method: 'GET',
    signal
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    const message = payload?.error || 'Impossible de charger l’historique admin.';
    const error = new Error(message);
    error.payload = payload;
    throw error;
  }

  return payload;
}
