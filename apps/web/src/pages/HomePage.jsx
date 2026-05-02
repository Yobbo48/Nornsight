
import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import runeData from '@/data/runeData.js';
import { getStrictPositionProfile } from '@/data/runeReferential.js';
import AdminHistoryPanel from '@/components/AdminHistoryPanel.jsx';
import ResultsPhase from '@/components/ResultsPhase.jsx';
import DeepReadingPhase from '@/components/DeepReadingPhase.jsx';
import PublicNav from '@/components/PublicNav.jsx';
import SectionRule from '@/components/SectionRule.jsx';
import { ADMIN_PREVIEW_EMAIL, isAdminPreviewEnabled } from '@/lib/adminPreview.js';
import { copy, getInitialLocale, persistLocale } from '@/lib/locale.js';
import { MAX_QUESTION_LENGTH, shouldShowQuestionContextHint } from '@/lib/questionLimits.js';
import {
  createCheckoutSession,
  createFreeTirage,
  fetchAdminDrawings,
  fetchRuneReading,
  fetchTirageStatus,
  saveTirageEmail,
  unlockFullReading
} from '@/lib/runeReadingApi.js';
import { createFreeReadingSummary } from '@/lib/runeReadingPrompt.js';
import { getSeoRouteConfig } from '@/lib/seoRoutes.js';
import {
  POSITION_KEYS,
  POSITION_LABELS_BY_LOCALE,
  getPositionSourceKey,
  buildPositionInterpretation,
  buildPositionKeywords
} from '@/lib/runePositions.js';
const CURRENT_STATE_KEY = 'nornsight_current_state';
const DEEPENING_KEY = 'nornsight_deepening_interest';
const LEADS_KEY = 'nornsight_leads';
const AI_STATUS = {
  idle: 'idle',
  loading: 'loading',
  success: 'success',
  error: 'error'
};

const normalizeEmail = (value) => value.trim().toLowerCase();
const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || '').trim());
const QUESTION_FORM_ID = 'question-form';

const buildHomeResetUrl = (locale = 'fr') => {
  if (typeof window === 'undefined') {
    return `/?lang=${locale}&reset=1`;
  }

  const url = new URL(window.location.origin);
  url.searchParams.set('lang', locale);
  url.searchParams.set('reset', '1');
  return url.toString();
};

const scrollToQuestionForm = () => {
  const element = document.getElementById(QUESTION_FORM_ID);
  if (!element) {
    return;
  }

  element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  const textarea = element.querySelector('textarea');
  if (textarea) {
    window.setTimeout(() => textarea.focus(), 350);
  }
};

const buildEmailNoticeFromPayload = (payload, localeCopy) => {
  if (!payload) {
    return '';
  }

  if (payload.status === 'not_ready') {
    return localeCopy.paymentNotReady;
  }

  return '';
};

const isNetworkReadingMessage = (message = '') =>
  /connexion a ete instable|connexion a été instable|failed to fetch|network/i.test(String(message || ''));
const isQuestionValidationMessage = (message = '') =>
  /300 caract|question est requise|too long/i.test(String(message || ''));
const isRateLimitMessage = (message = '') => /too many requests/i.test(String(message || ''));

const HomePage = () => {
  const [phase, setPhase] = useState('question');
  const [locale, setLocale] = useState(getInitialLocale);
  const [selectedTheme, setSelectedTheme] = useState('situation');
  const [question, setQuestion] = useState('');
  const [questionError, setQuestionError] = useState('');
  const [drawnRunes, setDrawnRunes] = useState([]);
  const [revealedCards, setRevealedCards] = useState([false, false, false]);
  const [loadingText, setLoadingText] = useState('Connexion aux runes...');
  const [email, setEmail] = useState('');
  const [emailSaved, setEmailSaved] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [activeDrawingId, setActiveDrawingId] = useState('');
  const [emailLimitNotice, setEmailLimitNotice] = useState('');
  const [deepenRequested, setDeepenRequested] = useState(false);
  const [freeReadingSummary, setFreeReadingSummary] = useState('');
  const [summaryStatus, setSummaryStatus] = useState(AI_STATUS.idle);
  const [teaserReading, setTeaserReading] = useState('');
  const [teaserReadingStatus, setTeaserReadingStatus] = useState(AI_STATUS.idle);
  const [teaserReadingError, setTeaserReadingError] = useState('');
  const [fullReading, setFullReading] = useState('');
  const [fullReadingStatus, setFullReadingStatus] = useState(AI_STATUS.idle);
  const [fullReadingError, setFullReadingError] = useState('');
  const [paymentStatusMessage, setPaymentStatusMessage] = useState('');
  const [adminPreviewEnabled, setAdminPreviewEnabled] = useState(false);
  const [adminReadingUnlocked, setAdminReadingUnlocked] = useState(false);
  const [adminDrawings, setAdminDrawings] = useState([]);
  const [adminHistoryStatus, setAdminHistoryStatus] = useState(AI_STATUS.idle);
  const [adminHistoryError, setAdminHistoryError] = useState('');
  const t = copy[locale];
  const showQuestionContextHint = shouldShowQuestionContextHint(question);
  const rootSeo = getSeoRouteConfig('/', locale);
  const positionLabels = POSITION_LABELS_BY_LOCALE[locale];
  const isAdminTestEmail = normalizeEmail(email) === ADMIN_PREVIEW_EMAIL;
  const revealTimersRef = useRef([]);

  useEffect(() => {
    setAdminPreviewEnabled(isAdminPreviewEnabled());
  }, []);

  useEffect(() => {
    persistLocale(locale);
  }, [locale]);

  useEffect(() => () => {
    revealTimersRef.current.forEach((timer) => window.clearTimeout(timer));
    revealTimersRef.current = [];
  }, []);

  useEffect(() => {
    if (!adminPreviewEnabled) {
      return;
    }

    const controller = new AbortController();

    const loadAdminHistory = async () => {
      setAdminHistoryStatus(AI_STATUS.loading);
      setAdminHistoryError('');

      try {
        const payload = await fetchAdminDrawings({ limit: 20, signal: controller.signal });
        setAdminDrawings(Array.isArray(payload.tirages) ? payload.tirages : []);
        setAdminHistoryStatus(AI_STATUS.success);
      } catch (error) {
        if (error?.name === 'AbortError') {
          return;
        }

        setAdminDrawings([]);
        setAdminHistoryStatus(AI_STATUS.error);
        setAdminHistoryError(error?.message || 'Impossible de charger l’historique admin.');
      }
    };

    loadAdminHistory();

    return () => controller.abort();
  }, [adminPreviewEnabled, phase]);

  useEffect(() => {
    const url = new URL(window.location.href);
    const shouldReset = url.searchParams.get('reset') === '1';

    if (!shouldReset) {
      return;
    }

    localStorage.removeItem(CURRENT_STATE_KEY);
    localStorage.removeItem(DEEPENING_KEY);
    url.searchParams.delete('checkout');
    url.searchParams.delete('tirageId');
    url.searchParams.delete('reset');
    window.history.replaceState({}, '', url.toString());
  }, []);

  useEffect(() => {
    const savedState = localStorage.getItem(CURRENT_STATE_KEY);
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        if (parsed.phase === 'results') {
          localStorage.removeItem(CURRENT_STATE_KEY);
          return;
        }

        if (parsed.phase && parsed.question && parsed.drawnRunes) {
          setPhase(parsed.phase);
          setQuestion(parsed.question);
          setSelectedTheme(parsed.selectedTheme || 'situation');
          setDrawnRunes(parsed.drawnRunes);
          setEmail(parsed.email || '');
          setEmailSaved(Boolean(parsed.emailSaved));
          setEmailError(parsed.emailError || '');
          setActiveDrawingId(parsed.activeDrawingId || '');
          setEmailLimitNotice(parsed.emailLimitNotice || '');
          setDeepenRequested(Boolean(parsed.deepenRequested));
          setFreeReadingSummary(parsed.freeReadingSummary || '');
          setSummaryStatus(parsed.summaryStatus || AI_STATUS.idle);
          setTeaserReading(parsed.teaserReading || '');
          setTeaserReadingStatus(parsed.teaserReadingStatus || AI_STATUS.idle);
          setTeaserReadingError(parsed.teaserReadingError || '');
          setFullReading(parsed.fullReading || '');
          setFullReadingStatus(parsed.fullReadingStatus || AI_STATUS.idle);
          setFullReadingError(parsed.fullReadingError || '');
          setPaymentStatusMessage(parsed.paymentStatusMessage || '');
          setAdminReadingUnlocked(Boolean(parsed.adminReadingUnlocked));
        }
      } catch (error) {
        console.error('Error loading saved state:', error);
      }
    }
  }, []);

  useEffect(() => {
    const url = new URL(window.location.href);
    const checkout = url.searchParams.get('checkout');
    const checkoutTirageId = url.searchParams.get('tirageId');

    if (!checkout || !checkoutTirageId) {
      return;
    }

    setActiveDrawingId((current) => current || checkoutTirageId);
    setDeepenRequested(true);
    setPhase('deep-reading');

    if (checkout === 'cancel') {
      setPaymentStatusMessage(t.paymentCancelled);
      setFullReadingStatus(AI_STATUS.idle);
      persistResultsState({
        activeDrawingId: checkoutTirageId,
        deepenRequested: true,
        paymentStatusMessage: t.paymentCancelled,
        fullReadingStatus: AI_STATUS.idle
      });
      url.searchParams.delete('checkout');
      window.history.replaceState({}, '', url.toString());
      return;
    }

    setPaymentStatusMessage(t.paymentPreparing);
    setFullReadingStatus(AI_STATUS.loading);
    persistResultsState({
      activeDrawingId: checkoutTirageId,
      deepenRequested: true,
      paymentStatusMessage: t.paymentPreparing,
      fullReadingStatus: AI_STATUS.loading,
      fullReadingError: ''
    });
    url.searchParams.delete('checkout');
    window.history.replaceState({}, '', url.toString());
  }, [t.paymentCancelled, t.paymentPreparing]);

  useEffect(() => {
    if (!activeDrawingId || phase !== 'deep-reading' || adminPreviewEnabled || adminReadingUnlocked || fullReading) {
      return;
    }

    if (fullReadingStatus !== AI_STATUS.loading && !paymentStatusMessage) {
      return;
    }

    let cancelled = false;
    let timeoutId = null;

    const pollStatus = async () => {
      try {
        const payload = await fetchTirageStatus({ tirageId: activeDrawingId });

        if (cancelled) {
          return;
        }

        if (payload.status === 'delivered' && payload.reading) {
          setFullReading(payload.reading);
          setFullReadingStatus(AI_STATUS.success);
          setFullReadingError('');
          setPaymentStatusMessage('');
          setAdminReadingUnlocked(true);
          saveCurrentState('deep-reading', question, drawnRunes, {
            activeDrawingId,
            deepenRequested: true,
            fullReading: payload.reading,
            fullReadingStatus: AI_STATUS.success,
            fullReadingError: '',
            paymentStatusMessage: '',
            adminReadingUnlocked: true
          });
          return;
        }

        if (payload.status === 'failed') {
          const message = payload.lastError || t.paymentFailed;
          setFullReading('');
          setFullReadingStatus(AI_STATUS.error);
          setFullReadingError(message);
          setPaymentStatusMessage(message);
          saveCurrentState('deep-reading', question, drawnRunes, {
            activeDrawingId,
            deepenRequested: true,
            fullReading: '',
            fullReadingStatus: AI_STATUS.error,
            fullReadingError: message,
            paymentStatusMessage: message,
            adminReadingUnlocked: false
          });
          return;
        }

        const nextMessage =
          payload.status === 'payment_pending'
            ? t.paymentPending
            : payload.status === 'paid' || payload.status === 'generating'
              ? t.paymentPreparing
              : paymentStatusMessage || t.paymentPreparing;

        setPaymentStatusMessage(nextMessage);
        setFullReadingStatus(AI_STATUS.loading);
        timeoutId = window.setTimeout(pollStatus, 3500);
      } catch (error) {
        if (cancelled) {
          return;
        }

        const message = error?.message || t.paymentFailed;
        setFullReadingStatus(AI_STATUS.error);
        setFullReadingError(message);
        setPaymentStatusMessage(message);
      }
    };

    pollStatus();

    return () => {
      cancelled = true;
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [
    activeDrawingId,
    adminPreviewEnabled,
    adminReadingUnlocked,
    drawnRunes,
    fullReading,
    fullReadingStatus,
    paymentStatusMessage,
    phase,
    question,
    t.paymentFailed,
    t.paymentPending,
    t.paymentPreparing
  ]);

  const saveCurrentState = (newPhase, newQuestion, newRunes, nextState = {}) => {
    const state = {
      phase: newPhase,
      question: newQuestion,
      selectedTheme,
      drawnRunes: newRunes,
      email,
      emailSaved,
      emailError,
      activeDrawingId,
      emailLimitNotice,
      deepenRequested,
      freeReadingSummary,
      summaryStatus,
      teaserReading,
      teaserReadingStatus,
      teaserReadingError,
      fullReading,
      fullReadingStatus,
      fullReadingError,
      paymentStatusMessage,
      adminReadingUnlocked,
      ...nextState
    };
    localStorage.setItem(CURRENT_STATE_KEY, JSON.stringify(state));
  };

  const persistResultsState = (overrides = {}) => {
    saveCurrentState('results', question, drawnRunes, {
      email,
      emailSaved,
      emailError,
      activeDrawingId,
      emailLimitNotice,
      deepenRequested,
      freeReadingSummary,
      summaryStatus,
      teaserReading,
      teaserReadingStatus,
      teaserReadingError,
      fullReading,
      fullReadingStatus,
      fullReadingError,
      paymentStatusMessage,
      adminReadingUnlocked,
      ...overrides
    });
  };

  const drawRunes = () => {
    const shuffled = [...runeData].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, 3);

    return selected.map((rune, index) => {
      const positionKey = POSITION_KEYS[index];
      const sourceKey = getPositionSourceKey(positionKey, index);
      const positionInterpretations = rune.interpretations[positionKey] || [];
      const randomIndex = Math.floor(Math.random() * positionInterpretations.length);
      // Nornsight does not use reversed runes in the reading flow.
      // Any remaining orientation flag is kept only for compatibility with old data,
      // while nuance comes from metadata such as restrictive, limitante or instable.
      const isReversed = rune?.isReversed === true;
      const positionProfile = getStrictPositionProfile(rune.referential, sourceKey, { isReversed });

      return {
        symbole: rune.symbole,
        nom: rune.nom,
        isReversed,
        positionKey,
        positionSourceKey: sourceKey,
        positionLabel: positionLabels[index],
        orientationLabel: isReversed ? (locale === 'en' ? 'Reversed' : 'Renversée') : locale === 'en' ? 'Upright' : 'Droite',
        interpretation: buildPositionInterpretation(
          positionKey,
          sourceKey,
          positionProfile.semanticCore ||
            (sourceKey === 'essence'
              ? rune.referential.essence?.axis
              : rune.referential.positions[sourceKey]?.axis),
          locale
        ),
        positionKeywords: buildPositionKeywords(
          positionProfile.allowedKeywords,
          locale
        ),
        positionProfile,
        detailedInterpretation: positionInterpretations[randomIndex],
        essenceSummary: rune.essence.summary,
        essenceKeywords: rune.essence.keywords,
        referential: rune.referential
      };
    });
  };

  const buildInterpretationSnapshot = (runes) =>
    runes.map((rune) => ({
      position: rune.positionLabel,
      rune: rune.nom,
      symbole: rune.symbole,
      isReversed: Boolean(rune.isReversed),
      orientationLabel: rune.orientationLabel || (rune.isReversed ? 'Renversée' : 'Droite'),
      texte: rune.interpretation,
      positionKeywords: rune.positionKeywords,
      detail: rune.detailedInterpretation,
      essence: rune.essenceSummary,
      keywords: rune.essenceKeywords
    }));

  const buildSavedInterpretation = () => ({
    runes: buildInterpretationSnapshot(drawnRunes),
    freeReadingSummary,
    teaserReading,
    fullReading
  });

  const requestReading = async (mode, questionValue, runeSet) => {
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 20000);

    try {
      const result = await fetchRuneReading({
        question: questionValue,
        runes: runeSet,
        mode,
        locale,
        theme: selectedTheme,
        signal: controller.signal
      });

      return result.reading;
    } finally {
      window.clearTimeout(timeoutId);
    }
  };

  const startRevealSequence = ({ trimmedQuestion, tirageId, runes, summary, teaser }) => {
    setDrawnRunes(runes);
    setActiveDrawingId(tirageId);
    setFreeReadingSummary(summary);
    setSummaryStatus(AI_STATUS.idle);
    setTeaserReading(teaser);
    setTeaserReadingStatus(teaser ? AI_STATUS.success : AI_STATUS.idle);
    setTeaserReadingError('');
    setLoadingText(t.loadingReveal);

    saveCurrentState('revealing', trimmedQuestion, runes, {
      email: '',
      emailSaved: false,
      emailError: '',
      activeDrawingId: tirageId,
      emailLimitNotice: '',
      deepenRequested: false,
      freeReadingSummary: summary,
      summaryStatus: AI_STATUS.idle,
      teaserReading: teaser,
      teaserReadingStatus: teaser ? AI_STATUS.success : AI_STATUS.idle,
      teaserReadingError: '',
      fullReading: '',
      fullReadingStatus: AI_STATUS.idle,
      fullReadingError: '',
      paymentStatusMessage: '',
      adminReadingUnlocked: false
    });

    revealTimersRef.current.push(window.setTimeout(() => {
      setRevealedCards([true, false, false]);
    }, 450));

    revealTimersRef.current.push(window.setTimeout(() => {
      setRevealedCards([true, true, false]);
    }, 700));

    revealTimersRef.current.push(window.setTimeout(() => {
      setRevealedCards([true, true, true]);
    }, 1300));

    revealTimersRef.current.push(window.setTimeout(() => {
      setPhase('results');
      saveCurrentState('results', trimmedQuestion, runes, {
        email: '',
        emailSaved: false,
        emailError: '',
        activeDrawingId: tirageId,
        emailLimitNotice: '',
        deepenRequested: false,
        freeReadingSummary: summary,
        summaryStatus: AI_STATUS.idle,
        teaserReading: teaser,
        teaserReadingStatus: teaser ? AI_STATUS.success : AI_STATUS.idle,
        teaserReadingError: '',
        fullReading: '',
        fullReadingStatus: AI_STATUS.idle,
        fullReadingError: '',
        paymentStatusMessage: '',
        adminReadingUnlocked: false
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
      revealTimersRef.current = [];
    }, 1950));
  };

  const generateTeaserReading = async (questionValue, runeSet) => {
    setTeaserReadingStatus(AI_STATUS.loading);
    setTeaserReadingError('');
    persistResultsState({
      teaserReading: '',
      teaserReadingStatus: AI_STATUS.loading,
      teaserReadingError: ''
    });

    try {
      const reading = await requestReading('teaser', questionValue, runeSet);

      setTeaserReading(reading);
      setTeaserReadingStatus(AI_STATUS.success);
      setTeaserReadingError('');
      saveCurrentState('results', questionValue, runeSet, {
        teaserReading: reading,
        teaserReadingStatus: AI_STATUS.success,
        teaserReadingError: ''
      });
    } catch (error) {
      const message =
        error?.name === 'AbortError'
          ? 'Le teaser a pris trop de temps à arriver.'
          : isNetworkReadingMessage(error?.message)
            ? t.networkReadingFallback
            : error?.message || 'Impossible de générer le teaser.';

      setTeaserReading('');
      setTeaserReadingStatus(AI_STATUS.error);
      setTeaserReadingError(message);
      saveCurrentState('results', questionValue, runeSet, {
        teaserReading: '',
        teaserReadingStatus: AI_STATUS.error,
        teaserReadingError: message
      });
    }
  };

  const generateSummaryReading = async (questionValue, runeSet) => {
    setSummaryStatus(AI_STATUS.loading);
    persistResultsState({
      summaryStatus: AI_STATUS.loading
    });

    try {
      const reading = await requestReading('summary', questionValue, runeSet);

      setFreeReadingSummary(reading);
      setSummaryStatus(AI_STATUS.success);
      saveCurrentState('results', questionValue, runeSet, {
        freeReadingSummary: reading,
        summaryStatus: AI_STATUS.success
      });
    } catch (error) {
      console.error('Error generating summary reading:', error);
      const fallbackSummary = createFreeReadingSummary({ runes: runeSet, question: questionValue, locale, theme: selectedTheme });
      setFreeReadingSummary((current) => current || fallbackSummary);
      setSummaryStatus(AI_STATUS.error);
      saveCurrentState('results', questionValue, runeSet, {
        freeReadingSummary: fallbackSummary,
        summaryStatus: AI_STATUS.error
      });
    }
  };

  useEffect(() => {
    if (
      phase === 'results' &&
      question &&
      drawnRunes.length === 3 &&
      summaryStatus === AI_STATUS.idle &&
      !freeReadingSummary
    ) {
      generateSummaryReading(question, drawnRunes);
    }
  }, [phase, question, drawnRunes, summaryStatus, freeReadingSummary]);

  useEffect(() => {
    if (
      phase === 'results' &&
      question &&
      drawnRunes.length === 3 &&
      teaserReadingStatus === AI_STATUS.idle &&
      !teaserReading
    ) {
      generateTeaserReading(question, drawnRunes);
    }
  }, [phase, question, drawnRunes, teaserReadingStatus, teaserReading]);

  const handleQuestionSubmit = async (e) => {
    e.preventDefault();
    if (question.trim()) {
      const trimmedQuestion = question.trim();

      if (trimmedQuestion.length > MAX_QUESTION_LENGTH) {
        setQuestionError(t.questionTooLong);
        return;
      }

      revealTimersRef.current.forEach((timer) => window.clearTimeout(timer));
      revealTimersRef.current = [];

      setQuestion(trimmedQuestion);
      setDrawnRunes([]);
      setRevealedCards([false, false, false]);
      setLoadingText(t.loadingConnecting);
      setPhase('revealing');
      setEmail('');
      setQuestionError('');
      setEmailSaved(false);
      setEmailError('');
      setActiveDrawingId('');
      setEmailLimitNotice('');
      setDeepenRequested(false);
      setFreeReadingSummary('');
      setSummaryStatus(AI_STATUS.idle);
      setTeaserReading('');
      setTeaserReadingStatus(AI_STATUS.idle);
      setTeaserReadingError('');
      setFullReading('');
      setFullReadingStatus(AI_STATUS.idle);
      setFullReadingError('');
      setPaymentStatusMessage('');
      setAdminReadingUnlocked(false);
      saveCurrentState('revealing', trimmedQuestion, [], {
        email: '',
        emailSaved: false,
        emailError: '',
        activeDrawingId: '',
        emailLimitNotice: '',
        deepenRequested: false,
        freeReadingSummary: '',
        summaryStatus: AI_STATUS.idle,
        teaserReading: '',
        teaserReadingStatus: AI_STATUS.idle,
        teaserReadingError: '',
        fullReading: '',
        fullReadingStatus: AI_STATUS.idle,
        fullReadingError: '',
        paymentStatusMessage: '',
        adminReadingUnlocked: false
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });

      try {
        const payload = await createFreeTirage({ question: trimmedQuestion, locale, theme: selectedTheme });
        startRevealSequence({
          trimmedQuestion,
          tirageId: payload.tirageId || '',
          runes: payload.runes || [],
          summary: payload.summary || '',
          teaser: payload.teaser || ''
        });
      } catch (error) {
        console.error('Error creating free tirage on server:', error);

        if (isQuestionValidationMessage(error?.message) || isRateLimitMessage(error?.message)) {
          setPhase('question');
          setLoadingText(t.loadingConnecting);
          setQuestionError(error?.message || t.questionTooLong);
          localStorage.removeItem(CURRENT_STATE_KEY);
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return;
        }

        const runes = drawRunes();
        startRevealSequence({
          trimmedQuestion,
          tirageId: '',
          runes,
          summary: createFreeReadingSummary({ runes, question: trimmedQuestion, locale, theme: selectedTheme }),
          teaser: ''
        });
      }
    }
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (email.trim()) {
      const normalizedEmail = normalizeEmail(email);

      if (!isValidEmail(normalizedEmail)) {
        setEmailError(t.emailInvalid);
        persistResultsState({
          email: normalizedEmail,
          emailSaved: false,
          emailError: t.emailInvalid
        });
        return;
      }

      if (activeDrawingId) {
        try {
          await saveTirageEmail({
            tirageId: activeDrawingId,
            email: normalizedEmail
          });
        } catch (error) {
          console.error('Error saving lead on server:', error);
        }
      }

      try {
        const existingLeads = JSON.parse(localStorage.getItem(LEADS_KEY) || '[]');
        existingLeads.push({
          id: `lead_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
          email: normalizedEmail,
          question,
          tirageId: activeDrawingId || null,
          runes: buildInterpretationSnapshot(drawnRunes),
          savedAt: new Date().toISOString()
        });
        localStorage.setItem(LEADS_KEY, JSON.stringify(existingLeads));
      } catch (error) {
        console.error('Error saving lead locally:', error);
      }

      setEmail(normalizedEmail);
      setEmailSaved(true);
      setEmailError('');
      setEmailLimitNotice('');
      persistResultsState({
        email: normalizedEmail,
        emailSaved: true,
        emailError: '',
        emailLimitNotice: ''
      });

      if (normalizedEmail === ADMIN_PREVIEW_EMAIL) {
        setFullReadingStatus(AI_STATUS.loading);
        setFullReadingError('');
        persistResultsState({
          email: normalizedEmail,
          emailSaved: true,
          emailError: '',
          fullReading: '',
          fullReadingStatus: AI_STATUS.loading,
          fullReadingError: '',
          paymentStatusMessage: '',
          adminReadingUnlocked: false
        });

        try {
          const payload = await unlockFullReading({
            tirageId: activeDrawingId,
            email: normalizedEmail,
            question,
            runes: drawnRunes,
            freeReadingSummary,
            teaserReading,
            locale,
            theme: selectedTheme
          });

          setActiveDrawingId(payload.tirageId || activeDrawingId);
          setFullReading(payload.reading || '');
          setFullReadingStatus(AI_STATUS.success);
          setFullReadingError('');
          setAdminReadingUnlocked(Boolean(payload.reading));
          persistResultsState({
            activeDrawingId: payload.tirageId || activeDrawingId,
            email: normalizedEmail,
            emailSaved: true,
            emailError: '',
            fullReading: payload.reading || '',
            fullReadingStatus: AI_STATUS.success,
            fullReadingError: '',
            paymentStatusMessage: '',
            adminReadingUnlocked: Boolean(payload.reading)
          });
        } catch (error) {
          console.error('Error unlocking admin reading from server:', error);

          try {
            const reading = await requestReading('full', question, drawnRunes);

            setFullReading(reading);
            setFullReadingStatus(AI_STATUS.success);
            setFullReadingError('');
            setAdminReadingUnlocked(true);
            persistResultsState({
              email: normalizedEmail,
              emailSaved: true,
              emailError: '',
              fullReading: reading,
              fullReadingStatus: AI_STATUS.success,
              fullReadingError: '',
              paymentStatusMessage: '',
              adminReadingUnlocked: true
            });
          } catch (fallbackError) {
            const message =
              fallbackError?.name === 'AbortError'
                ? 'La lecture approfondie a pris trop de temps à arriver.'
                : isNetworkReadingMessage(fallbackError?.message)
                  ? t.fullReadingError
                  : fallbackError?.message || t.fullReadingError;

            setFullReading('');
            setFullReadingStatus(AI_STATUS.error);
            setFullReadingError(message);
            setAdminReadingUnlocked(false);
            persistResultsState({
              email: normalizedEmail,
              emailSaved: true,
              emailError: '',
              fullReading: '',
              fullReadingStatus: AI_STATUS.error,
              fullReadingError: message,
              paymentStatusMessage: message,
              adminReadingUnlocked: false
            });
          }
        }
      }
    }
  };

  const handleDeepen = () => {
    const payload = {
      question,
      runes: drawnRunes,
      interpretation: buildSavedInterpretation(),
      requestedAt: new Date().toISOString()
    };

    try {
      localStorage.setItem(DEEPENING_KEY, JSON.stringify(payload));
    } catch (error) {
      console.error('Error saving deepening intent:', error);
    }

    setDeepenRequested(true);
    saveCurrentState('deep-reading', question, drawnRunes, {
      email,
      emailSaved,
      activeDrawingId,
      emailLimitNotice,
      deepenRequested: true
    });
    setPhase('deep-reading');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const generatePaidReadingPreview = async () => {
    if (!question || drawnRunes.length !== 3) {
      return;
    }

    if (!adminPreviewEnabled && !isAdminTestEmail && !adminReadingUnlocked && !emailSaved) {
      setFullReadingStatus(AI_STATUS.error);
      setFullReadingError(t.paymentEmailRequired);
      setPaymentStatusMessage(t.paymentEmailRequired);
      return;
    }

    if (!adminPreviewEnabled && !isAdminTestEmail && !adminReadingUnlocked) {
      setFullReadingStatus(AI_STATUS.loading);
      setFullReadingError('');
      setPaymentStatusMessage(t.paymentPending);
      saveCurrentState('deep-reading', question, drawnRunes, {
        email,
        emailSaved,
        activeDrawingId,
        emailLimitNotice,
        deepenRequested: true,
        fullReading: '',
        fullReadingStatus: AI_STATUS.loading,
        fullReadingError: '',
        paymentStatusMessage: t.paymentPending,
        adminReadingUnlocked: false
      });

      try {
        const payload = await createCheckoutSession({
          tirageId: activeDrawingId,
          email,
          question,
          runes: drawnRunes,
          freeReadingSummary,
          teaserReading,
          locale,
          theme: selectedTheme
        });

        if (payload.status === 'not_ready') {
          const message = buildEmailNoticeFromPayload(payload, t) || payload.message || t.paymentNotReady;
          setFullReadingStatus(AI_STATUS.error);
          setFullReadingError(message);
          setPaymentStatusMessage(message);
          saveCurrentState('deep-reading', question, drawnRunes, {
            deepenRequested: true,
            fullReading: '',
            fullReadingStatus: AI_STATUS.error,
            fullReadingError: message,
            paymentStatusMessage: message,
            adminReadingUnlocked: false
          });
          return;
        }

        if (payload.status === 'already_delivered' && payload.reading) {
          setFullReading(payload.reading);
          setFullReadingStatus(AI_STATUS.success);
          setFullReadingError('');
          setPaymentStatusMessage('');
          setAdminReadingUnlocked(true);
          saveCurrentState('deep-reading', question, drawnRunes, {
            activeDrawingId: payload.tirageId || activeDrawingId,
            deepenRequested: true,
            fullReading: payload.reading,
            fullReadingStatus: AI_STATUS.success,
            fullReadingError: '',
            paymentStatusMessage: '',
            adminReadingUnlocked: true
          });
          return;
        }

        if (payload.checkoutUrl) {
          window.location.assign(payload.checkoutUrl);
          return;
        }

        throw new Error(t.paymentNotReady);
      } catch (error) {
        const message = isNetworkReadingMessage(error?.message)
          ? t.networkReadingFallback
          : error?.message || 'Impossible de lancer le paiement.';
        setFullReadingStatus(AI_STATUS.error);
        setFullReadingError(message);
        setPaymentStatusMessage(message);
        saveCurrentState('deep-reading', question, drawnRunes, {
          deepenRequested: true,
          fullReading: '',
          fullReadingStatus: AI_STATUS.error,
          fullReadingError: message,
          paymentStatusMessage: message,
          adminReadingUnlocked: false
        });
      }

      return;
    }

    setFullReadingStatus(AI_STATUS.loading);
    setFullReadingError('');
    setPaymentStatusMessage('');
    saveCurrentState('deep-reading', question, drawnRunes, {
      email,
      emailSaved,
      activeDrawingId,
      emailLimitNotice,
      deepenRequested: true,
      fullReading: '',
      fullReadingStatus: AI_STATUS.loading,
      fullReadingError: '',
      paymentStatusMessage: ''
    });

    try {
      const reading = await requestReading('full', question, drawnRunes);
      setFullReading(reading);
      setFullReadingStatus(AI_STATUS.success);
      setFullReadingError('');
      setAdminReadingUnlocked(true);
      saveCurrentState('deep-reading', question, drawnRunes, {
        email,
        emailSaved,
        activeDrawingId,
        emailLimitNotice,
        deepenRequested: true,
        fullReading: reading,
        fullReadingStatus: AI_STATUS.success,
        fullReadingError: '',
        paymentStatusMessage: '',
        adminReadingUnlocked: true
      });
    } catch (error) {
      const message =
        error?.name === 'AbortError'
          ? 'La lecture approfondie a pris trop de temps à arriver.'
          : isNetworkReadingMessage(error?.message)
            ? t.fullReadingError
            : error?.message || t.fullReadingError;

      setFullReading('');
      setFullReadingStatus(AI_STATUS.error);
      setFullReadingError(message);
      saveCurrentState('deep-reading', question, drawnRunes, {
        email,
        emailSaved,
        activeDrawingId,
        emailLimitNotice,
        deepenRequested: true,
        fullReading: '',
        fullReadingStatus: AI_STATUS.error,
        fullReadingError: message,
        paymentStatusMessage: message,
        adminReadingUnlocked: false
      });
    }
  };

  const handleBackToResults = () => {
    setPhase('results');
    persistResultsState({
      deepenRequested: true
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNewDraw = () => {
    window.location.assign(buildHomeResetUrl(locale));
  };

  const handleReturnHome = () => {
    window.location.assign(buildHomeResetUrl(locale));
  };

  const handleRetryTeaser = () => {
    generateTeaserReading(question, drawnRunes);
  };

  const handleRetryFullReading = () => {
    generatePaidReadingPreview();
  };

  const canonicalUrl =
    typeof window === 'undefined' ? '/' : `${window.location.origin}${window.location.pathname}`;

  return (
    <>
      <Helmet>
        <html lang={locale} />
        <title>{rootSeo?.title || t.metaTitle}</title>
        <meta name="description" content={rootSeo?.description || t.metaDescription} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Nornsight" />
        <meta property="og:title" content={rootSeo?.title || t.metaTitle} />
        <meta property="og:description" content={rootSeo?.description || t.metaDescription} />
        <meta property="og:url" content={canonicalUrl} />
      </Helmet>

      <div className="ns-shell min-h-screen text-[#ede8df] relative overflow-hidden">
        <div className="ns-ambient" />
        <div className="ns-grid" />
        <div className="relative z-10">
          <AnimatePresence mode="wait">
            {phase === 'question' && (
              <motion.div
                key="question"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
                className="px-4 py-5 sm:px-6 md:py-10 lg:py-12"
              >
                <div className="mx-auto w-full max-w-[76rem]">
                  <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="ns-hero section-tight"
                  >
                    <PublicNav locale={locale} onLocaleChange={setLocale} />

                    <div className="ns-hero__layout">
                      <div className="ns-hero__copy">
                        <div className="ns-kicker">{t.heroBadge}</div>

                        <h1 className="ns-display">{t.heroTitle}</h1>
                        <h2 className="ns-hero__title">{t.heroSubtitle}</h2>
                        <p className="ns-hero__body">{t.heroBody}</p>

                        <div className="ns-hero__actions">
                          <button
                            type="button"
                            onClick={scrollToQuestionForm}
                            className="ns-button ns-button--primary"
                          >
                            {t.heroButton}
                          </button>
                          <p className="ns-hero__hint">{t.heroHint}</p>
                        </div>
                      </div>
                    </div>
                  </motion.section>

                  <motion.section
                    id={QUESTION_FORM_ID}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="ns-start section-tight"
                  >
                    <div className="ns-start__intro">
                      <SectionRule label={t.startLabel} />
                      <h3 className="ns-section-title">{t.ctaTitle}</h3>
                      <p className="ns-start__body">{t.startBody}</p>
                    </div>

                    <motion.form
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.35 }}
                      onSubmit={handleQuestionSubmit}
                      className="ns-start__form"
                    >
                      <div className="ns-fieldset">
                        <div className="ns-fieldset__head">
                          <p className="ns-label">
                            {t.themeLabel}
                          </p>
                          <p className="ns-help">
                            {t.themeHint}
                          </p>
                        </div>
                        <div className="ns-theme-grid">
                          {t.themeOptions.map((option) => (
                            <button
                              key={option.value}
                              type="button"
                              onClick={() => setSelectedTheme(option.value)}
                              className={`ns-theme-button ${selectedTheme === option.value ? 'is-active' : ''}`}
                            >
                              {option.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <textarea
                        value={question}
                        onChange={(e) => {
                          setQuestion(e.target.value);
                          if (questionError) {
                            setQuestionError('');
                          }
                        }}
                        required
                        maxLength={MAX_QUESTION_LENGTH}
                        placeholder={t.questionPlaceholder}
                        className="ns-textarea"
                      />

                      {questionError && (
                        <p className="ns-form-help ns-form-help--error">
                          {questionError}
                        </p>
                      )}

                      {!questionError && showQuestionContextHint && (
                        <p className="ns-form-help">
                          {t.questionContextHint}
                        </p>
                      )}

                      <button
                        type="submit"
                        disabled={!question.trim()}
                        className="ns-button ns-button--wide"
                      >
                        {t.startButton}
                      </button>
                    </motion.form>
                  </motion.section>

                  <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.25 }}
                    className="ns-process section"
                  >
                    <SectionRule label={t.howItWorksLabel} />
                    <div className="ns-process__grid">
                      {t.howItWorks.map((item, index) => (
                        <div
                          key={item.step}
                          className={`ns-process__item ${index < t.howItWorks.length - 1 ? 'has-border' : ''}`}
                        >
                          <div className="ns-process__number">{item.step}</div>
                          <h3 className="ns-card-title">
                            {item.title}
                          </h3>
                          <p className="ns-muted-text">
                            {item.text}
                          </p>
                        </div>
                      ))}
                    </div>
                  </motion.section>

                  <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.3 }}
                    className="ns-reading section"
                  >
                    <div className="ns-reading__copy">
                      <SectionRule label={t.readingLabel} />
                      <h3 className="ns-section-title">
                        {t.readingTitle}
                      </h3>
                      <div className="ns-pillars">
                        {t.readingPillars.map((item) => (
                          <div key={item} className="ns-pillar">
                            <div />
                            <p>{item}</p>
                          </div>
                        ))}
                      </div>
                      <div className="ns-reading__note">
                        <p>
                          {t.readingBodyLine1}
                          <br />
                          {t.readingBodyLine2}
                        </p>
                      </div>
                    </div>
                  </motion.section>

                  <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.35 }}
                    className="ns-about section"
                  >
                    <div className="ns-about__block">
                      <SectionRule label={t.aboutLabel} />
                      <h3 className="ns-section-title">
                        {t.aboutTitle}
                      </h3>
                      <p className="ns-muted-text">
                        {t.aboutBodyLine1}
                        <br />
                        {t.aboutBodyLine2}
                      </p>
                    </div>

                    <div className="ns-about__block ns-about__block--right">
                      <SectionRule label={t.foundationLabel} />
                      <h3 className="ns-section-title">
                        {t.foundationTitle}
                      </h3>
                      <p className="ns-muted-text">
                        {t.foundationBody}
                      </p>
                    </div>
                  </motion.section>

                  <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.4 }}
                    className="ns-final section-tight"
                  >
                    <div className="ns-final__inner">
                      <h3 className="ns-section-title">
                        {t.ctaTitle}
                      </h3>
                      <button
                        type="button"
                        onClick={scrollToQuestionForm}
                        className="ns-button ns-button--primary"
                      >
                        {t.heroButton}
                      </button>
                    </div>
                  </motion.section>

                  <motion.footer
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.45 }}
                    className="text-center text-[0.78rem] tracking-[0.14em] text-[#5a5448] pb-4"
                  >
                    {t.footer}
                  </motion.footer>
                </div>
              </motion.div>
            )}

            {phase === 'revealing' && (
              <motion.div
                key={`revealing-${activeDrawingId || question}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
                className="min-h-screen flex flex-col items-center justify-center px-4 py-12 md:py-20"
              >
                <motion.p
                  key={loadingText}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-xl md:text-3xl text-center text-muted-foreground mb-10 md:mb-16"
                >
                  {loadingText}
                </motion.p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-8 max-w-5xl w-full">
                  {Array.from({ length: 3 }).map((_, index) => {
                    const rune = drawnRunes[index];

                    return (
                    <motion.div
                      key={`${activeDrawingId || question}-${index}-${rune?.nom || 'pending'}-${rune?.symbole || 'back'}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.45, ease: 'easeOut' }}
                      className="relative h-72 md:h-96"
                      style={{ perspective: '1000px' }}
                    >
                      <div
                        className="relative w-full h-full transition-all duration-[820ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
                        style={{
                          transformStyle: 'preserve-3d',
                          transform: revealedCards[index] ? 'rotateY(180deg)' : 'rotateY(0deg)'
                        }}
                      >
                        <div
                          className="absolute inset-0 glass-strong rounded-2xl flex items-center justify-center"
                          style={{ backfaceVisibility: 'hidden' }}
                        >
                          <div className="text-6xl opacity-20">ᚱᚢᚾᛖ</div>
                        </div>

                        <div
                          className={`absolute inset-0 glass-strong rounded-2xl flex flex-col items-center justify-center p-6 transition-all duration-700 ${
                            revealedCards[index] && rune ? 'glow-primary' : ''
                          }`}
                          style={{
                            backfaceVisibility: 'hidden',
                            transform: 'rotateY(180deg)'
                          }}
                        >
                          <div className="text-8xl mb-4 text-accent">{rune?.symbole || 'ᚱ'}</div>
                          <div className="font-['Cinzel'] text-2xl font-semibold">{rune?.nom || 'Rune'}</div>
                        </div>
                      </div>
                    </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {phase === 'results' && (
              <ResultsPhase
                key="results"
                runes={drawnRunes}
                question={question}
                locale={locale}
                copy={t}
                email={email}
                emailSaved={emailSaved}
                emailLimitNotice={emailLimitNotice}
                freeReadingSummary={freeReadingSummary}
                summaryStatus={summaryStatus}
                teaserReading={teaserReading}
                teaserReadingStatus={teaserReadingStatus}
                teaserReadingError={teaserReadingError}
                adminPreviewEnabled={adminPreviewEnabled}
                adminReadingUnlocked={adminReadingUnlocked}
                isAdminTestEmail={isAdminTestEmail}
                fullReading={fullReading}
                fullReadingStatus={fullReadingStatus}
                fullReadingError={fullReadingError}
                emailError={emailError}
                onEmailChange={(value) => {
                  const normalizedNext = normalizeEmail(value);
                  setEmail(value);
                  if (emailError) {
                    setEmailError('');
                  }
                  if (emailSaved && normalizedNext !== normalizeEmail(email)) {
                    setEmailSaved(false);
                    persistResultsState({
                      email: value,
                      emailSaved: false,
                      emailError: '',
                      emailLimitNotice: ''
                    });
                  }
                }}
                onEmailSubmit={handleEmailSubmit}
                onDeepen={handleDeepen}
                onNewDraw={handleNewDraw}
                onGoHome={handleReturnHome}
                onRetryTeaser={handleRetryTeaser}
                onRetryFullReading={handleRetryFullReading}
              />
            )}

            {phase === 'deep-reading' && (
              <DeepReadingPhase
                key="deep-reading"
                question={question}
                locale={locale}
                copy={t}
                emailSaved={emailSaved}
                adminPreviewEnabled={adminPreviewEnabled}
              adminReadingUnlocked={adminReadingUnlocked}
              isAdminTestEmail={isAdminTestEmail}
              fullReading={fullReading}
              fullReadingStatus={fullReadingStatus}
              fullReadingError={fullReadingError}
              paymentStatusMessage={paymentStatusMessage}
                onBack={handleBackToResults}
                onGoHome={handleReturnHome}
                onUnlock={generatePaidReadingPreview}
                onRetry={generatePaidReadingPreview}
              />
            )}
          </AnimatePresence>
        </div>
      </div>

      {adminPreviewEnabled && (phase === 'question' || phase === 'results' || phase === 'deep-reading') && (
        <div className="relative z-10 px-4 pb-16">
          <div className="max-w-5xl mx-auto">
            <AdminHistoryPanel
              drawings={adminDrawings}
              status={adminHistoryStatus}
              error={adminHistoryError}
            />
          </div>
        </div>
      )}

      {phase === 'results' && deepenRequested && (
        <div className="fixed bottom-6 left-1/2 z-20 w-[calc(100%-2rem)] max-w-xl -translate-x-1/2 glass-strong rounded-2xl px-5 py-4">
          <p className="text-sm text-center text-foreground">
            L&apos;intérêt pour un approfondissement a été enregistré localement avec ce tirage.
          </p>
        </div>
      )}
    </>
  );
};

export default HomePage;
