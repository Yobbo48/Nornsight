export const SUPPORTED_LOCALES = ['fr', 'en'];
export const DEFAULT_LOCALE = 'fr';
export const LOCALE_STORAGE_KEY = 'nornsight_locale';

export const getInitialLocale = () => {
  if (typeof window === 'undefined') {
    return DEFAULT_LOCALE;
  }

  const params = new URLSearchParams(window.location.search);
  const urlLocale = params.get('lang');
  if (SUPPORTED_LOCALES.includes(urlLocale)) {
    return urlLocale;
  }

  const storedLocale = window.localStorage.getItem(LOCALE_STORAGE_KEY);
  if (SUPPORTED_LOCALES.includes(storedLocale)) {
    return storedLocale;
  }

  const browserLocale = (window.navigator.language || '').toLowerCase();
  return browserLocale.startsWith('en') ? 'en' : DEFAULT_LOCALE;
};

export const persistLocale = (locale) => {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  const url = new URL(window.location.href);
  url.searchParams.set('lang', locale);
  window.history.replaceState({}, '', url.toString());
};

export const copy = {
  fr: {
    metaTitle: 'Nornsight - Un regard clair sur ce que tu traverses',
    metaDescription: 'Tirage de runes pour éclairer ta situation présente',
    heroBadge: 'Tirage de runes guidé',
    heroTitle: 'Nornsight',
    heroSubtitle: 'Un tirage pour éclairer ce que tu traverses vraiment.',
    heroBody: 'Une lecture sobre et claire. Pour voir plus juste.',
    heroButton: 'Faire un tirage',
    heroHint: '3 runes. Une lecture. Puis un approfondissement si tu le souhaites.',
    startLabel: 'Commencer',
    startBody: 'Écris simplement ce qui te traverse.',
    themeLabel: 'Thème',
    themeHint: 'Choisis simplement le domaine qui se rapproche le plus de ta question.',
    themeOptions: [
      { value: 'pro', label: 'Pro' },
      { value: 'relations', label: 'Relations' },
      { value: 'argent', label: 'Argent' },
      { value: 'situation', label: 'Situation' },
      { value: 'autre', label: 'Autre' }
    ],
    questionPlaceholder: 'Écris ce qui te traverse...',
    questionTooLong: 'Ta question est un peu trop longue. Essaie de la formuler en 300 caractères maximum, avec l’essentiel de la situation.',
    questionContextHint: 'Ta question est très courte. Pour une lecture plus précise, tu peux ajouter une phrase de contexte : depuis quand ça dure, ou ce qui te pèse le plus.',
    startButton: 'Lancer le tirage',
    howItWorksLabel: 'Parcours',
    howItWorks: [
      { step: '1', title: 'Tu poses ta question', text: 'Une situation précise ou un ressenti encore flou.' },
      { step: '2', title: 'Trois runes sont tirées', text: 'Le tirage fait apparaître ce qui est déjà là.' },
      { step: '3', title: 'Tu obtiens une lecture', text: 'Une lecture claire, puis un approfondissement si besoin.' }
    ],
    readingLabel: 'Lecture',
    readingTitle: 'Une lecture qui tient sa ligne',
    readingPillars: [
      'Faire apparaître ce qui travaille déjà la situation',
      'Montrer où elle se tend ou se fragilise',
      'Ouvrir sur ce qui peut réellement évoluer'
    ],
    readingBodyLine1: 'Le tirage avance avec méthode : un passé, un présent, un futur.',
    readingBodyLine2: 'La lecture ne cherche pas l’effet. Elle cherche la justesse.',
    aboutLabel: 'À propos',
    aboutTitle: 'Kevin Legros',
    aboutBodyLine1: 'Auteur, praticien des runes et énergéticien depuis 2015.',
    aboutBodyLine2: 'Une présence sobre, guidée par la clarté et l’expérience.',
    foundationLabel: 'Fondement',
    foundationTitle: 'Fondement',
    foundationBody:
      'Nornsight s’appuie sur un vrai travail autour des runes : des années de pratique, des tirages menés en séance, et une écriture pensée pour dire les choses avec netteté.',
    ctaTitle: 'Le tirage commence là où ta question devient claire.',
    footer: 'Une création de Kevin Legros — L’énergie des Runes',
    loadingConnecting: 'Le tirage se met en place...',
    loadingReveal: 'Les runes se dévoilent...',
    questionLead: 'Au regard de ce que tu traverses :',
    resultsIntro:
      'Ce tirage ne donne pas une vérité figée. Il montre où tu en es, ce qui pèse encore, et ce qui peut commencer à bouger.',
    summaryLoading: 'La lecture se précise encore.',
    emailCaptureLead: 'Enregistre ton tirage pour recevoir la suite.',
    bridgeLine1: 'Il y a déjà une direction dans ce tirage.',
    bridgeLine2: 'Mais l’endroit où ça retient, hésite ou s’ouvre vraiment n’apparaît pas encore entièrement ici.',
    goFurtherLabel: 'Aller plus loin',
    goFurtherTitle: 'Aller plus loin dans la lecture',
    teaserLoading: 'La lecture est en train d’aller vers le point sensible.',
    teaserError: 'La connexion a été instable. Le tirage reste disponible.',
    retry: 'Réessayer',
    emailTitle: 'Garder mon tirage et continuer',
    emailBody: 'Entre ton email pour conserver ce tirage et accéder à la lecture approfondie.',
    emailPlaceholder: 'ton@email.com',
    emailSaved: 'Tirage enregistré',
    emailButton: 'Recevoir mon tirage et voir la suite',
    emailHint: 'La suite de la lecture sera envoyée à cette adresse après validation.',
    emailInvalid: 'Merci de renseigner une adresse email valide avant de continuer.',
    emailEditable: 'Tu peux corriger cette adresse avant le paiement si nécessaire.',
    paidTitle: 'Aller plus loin dans la lecture — 5,90 €',
    paidBody: 'Une lecture plus précise de ce qui maintient la situation et de ce qui peut vraiment la faire évoluer.',
    paidButton: 'Commander la lecture approfondie',
    paidPreviewButton: 'Prévisualiser la lecture approfondie',
    paidViewButton: 'Voir la lecture approfondie',
    paidStepTitle: 'Lecture approfondie',
    paidStepSubtitle: 'Une lecture plus précise de ce que le tirage montre vraiment.',
    yourQuestion: 'Ta question',
    valuePoints: [
      'Ce qui tient réellement la situation en place',
      'Ce qui la fragilise ou la freine',
      'Ce qui peut vraiment évoluer'
    ],
    unlockButton: 'Débloquer la lecture complète',
    previewLoading: 'Prévisualisation en cours',
    paidDelivery: 'Lecture disponible immédiatement après paiement, et envoyée par email.',
    adminAccess: 'Accès admin actif. Le bouton affiche directement la lecture sans paiement.',
    paymentPending: 'Paiement sécurisé par Stripe. La lecture sera générée puis envoyée par email après confirmation du paiement.',
    paymentEmailRequired: 'Renseigne d’abord ton email sur l’écran précédent pour recevoir la lecture.',
    paymentPreparing: 'Paiement confirmé. La lecture est en préparation.',
    paymentCancelled: 'Le paiement a été annulé. Tu peux reprendre quand tu veux.',
    paymentFailed: 'La lecture payante n’a pas encore pu être livrée. Le suivi reste conservé.',
    paymentNotReady: 'Le paiement Stripe n’est pas encore activé ici. Le tunnel est prêt, mais les clés réelles ne sont pas encore branchées.',
    backToReading: 'Revenir au tirage',
    fullReadingLoading: 'La lecture approfondie se met en place...',
    fullReadingError: 'La lecture approfondie n’a pas pu être générée pour l’instant.',
    networkReadingFallback: 'La connexion a été instable. Le tirage reste disponible.',
    teaserRetryHint: 'Tu peux continuer ou réessayer plus bas.',
    adminAccessInline: 'Accès admin actif. La lecture approfondie peut être affichée sans paiement.',
    adminEmailInline: 'Après validation de l’email admin, la lecture approfondie s’affiche directement ici.',
    fullReadingDeploying: 'La lecture complète est en train de se déployer...',
    fullReadingLoadError: 'La lecture complète n’a pas pu être chargée pour l’instant.',
    deepenSessionButton: 'Approfondir en séance',
    newDrawButton: 'Faire un nouveau tirage'
  },
  en: {
    metaTitle: 'Nornsight - A clear reading of what you are dealing with',
    metaDescription: 'Rune reading to bring clarity to your current situation',
    heroBadge: 'Guided rune reading',
    heroTitle: 'Nornsight',
    heroSubtitle: 'A reading to clarify what you are actually dealing with.',
    heroBody: 'A sober, clear reading. So you can see things more plainly.',
    heroButton: 'Start a reading',
    heroHint: '3 runes. One reading. Then a deeper one if you want.',
    startLabel: 'Begin',
    startBody: 'Simply write what is on your mind.',
    themeLabel: 'Theme',
    themeHint: 'Simply choose the area that is closest to your question.',
    themeOptions: [
      { value: 'pro', label: 'Work' },
      { value: 'relations', label: 'Relations' },
      { value: 'argent', label: 'Money' },
      { value: 'situation', label: 'Situation' },
      { value: 'autre', label: 'Other' }
    ],
    questionPlaceholder: 'Write what is weighing on you...',
    questionTooLong: 'Your question is a little too long. Try to keep it within 300 characters and stay with the essential part of the situation.',
    questionContextHint: 'Your question is very short. For a more precise reading, you can add one sentence of context: how long this has been going on, or what weighs on you most.',
    startButton: 'Draw the runes',
    howItWorksLabel: 'Process',
    howItWorks: [
      { step: '1', title: 'You ask your question', text: 'A precise situation or a still unclear feeling.' },
      { step: '2', title: 'Three runes are drawn', text: 'The reading brings out what is already there.' },
      { step: '3', title: 'You receive a reading', text: 'A clear reading, then a deeper one if needed.' }
    ],
    readingLabel: 'Reading',
    readingTitle: 'A reading that holds its line',
    readingPillars: [
      'Show what is already shaping the situation',
      'Show where it tightens or weakens',
      'Open toward what can truly evolve'
    ],
    readingBodyLine1: 'The reading moves in a clear order: a past, a present, a future.',
    readingBodyLine2: 'It is not here to impress. It is here to be accurate.',
    aboutLabel: 'About',
    aboutTitle: 'Kevin Legros',
    aboutBodyLine1: 'Author and rune practitioner since 2015.',
    aboutBodyLine2: 'A steady presence guided by clarity and experience.',
    foundationLabel: 'Foundation',
    foundationTitle: 'Foundation',
    foundationBody:
      'Nornsight is grounded in real work with runes: years of practice, readings carried out in sessions, and writing shaped to say things clearly.',
    ctaTitle: 'The reading begins where your question becomes clear.',
    footer: 'A creation by Kevin Legros — The Energy of Runes',
    loadingConnecting: 'The reading is settling into place...',
    loadingReveal: 'The runes are revealing themselves...',
    questionLead: 'In relation to what you are dealing with:',
    resultsIntro:
      'This reading does not hand you a fixed truth. It shows where you stand, what still weighs on the situation, and what may start to move.',
    summaryLoading: 'The reading is still sharpening.',
    emailCaptureLead: 'Save your reading to receive what comes next.',
    bridgeLine1: 'This reading already points in a direction.',
    bridgeLine2: 'But the place where things hold back, hesitate, or start to open is not fully visible yet.',
    goFurtherLabel: 'Go further',
    goFurtherTitle: 'Go further into this reading',
    teaserLoading: 'The reading is moving toward the real sticking point.',
    teaserError: 'The connection was unstable. Your reading is still available.',
    retry: 'Try again',
    emailTitle: 'Keep my reading and continue',
    emailBody: 'Enter your email to keep this reading and access the deeper one.',
    emailPlaceholder: 'you@email.com',
    emailSaved: 'Reading saved',
    emailButton: 'Receive my reading and see the next part',
    emailHint: 'The rest of the reading will be sent to this address after confirmation.',
    emailInvalid: 'Please enter a valid email address before continuing.',
    emailEditable: 'You can still edit this address before payment if needed.',
    paidTitle: 'Go further into the reading — €5.90',
    paidBody: 'A more precise reading of what is holding the situation in place, and of what could actually move it.',
    paidButton: 'Order the deeper reading',
    paidPreviewButton: 'Preview the deeper reading',
    paidViewButton: 'View the deeper reading',
    paidStepTitle: 'Deeper reading',
    paidStepSubtitle: 'A more precise reading of what the draw is really showing.',
    yourQuestion: 'Your question',
    valuePoints: [
      'What is truly holding the situation in place',
      'What weakens or slows it down',
      'What can genuinely evolve'
    ],
    unlockButton: 'Unlock the full reading',
    previewLoading: 'Preview in progress',
    paidDelivery: 'The reading appears right after payment and is also sent by email.',
    adminAccess: 'Admin access is active. The button shows the reading directly without payment.',
    paymentPending: 'Secure payment via Stripe. Once payment is confirmed, the reading is generated and sent by email.',
    paymentEmailRequired: 'Please save your email first on the previous screen.',
    paymentPreparing: 'Payment confirmed. Your reading is being prepared.',
    paymentCancelled: 'The payment was cancelled. You can come back to it anytime.',
    paymentFailed: 'The paid reading could not be delivered yet. Your request has still been kept.',
    paymentNotReady: 'Stripe payment is not active here yet. The flow is ready, but the live keys are not connected.',
    backToReading: 'Back to the reading',
    fullReadingLoading: 'The deeper reading is settling into place...',
    fullReadingError: 'The deeper reading could not be generated for now.',
    networkReadingFallback: 'The connection was unstable. Your reading is still available.',
    teaserRetryHint: 'You can continue or try again below.',
    adminAccessInline: 'Admin access is active. The deeper reading can be shown without payment.',
    adminEmailInline: 'Once the admin email is confirmed, the deeper reading appears directly here.',
    fullReadingDeploying: 'The full reading is arriving now...',
    fullReadingLoadError: 'The full reading could not be loaded for now.',
    deepenSessionButton: 'Go deeper in session',
    newDrawButton: 'Start a new reading'
  }
};
