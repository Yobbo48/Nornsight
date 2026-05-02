import path from 'node:path';
import { existsSync, readFileSync } from 'node:fs';
import {
  buildHeuristicRuneDecision,
  buildFreeLeadFromDecision,
  createReframeReading,
  createFreeReadingSummary,
  createFullReadingFallback,
  createTeaserFallback,
  DEFAULT_OPENAI_MODEL,
  detectQuestionCategory,
  detectQuestionTopic,
  getFullSystemPrompt,
  getFullUserPromptWithDecision,
  getSummarySystemPrompt,
  getSummaryUserPromptWithDecision,
  getTeaserSystemPrompt,
  getTeaserUserPromptWithDecision,
  normalizeLocale,
  normalizeTheme
} from '../src/lib/runeReadingPrompt.js';
import { MAX_QUESTION_LENGTH } from '../src/lib/questionLimits.js';
import {
  buildLangfuseReadingMetadata,
  withLangfuseSpan,
  withLangfuseTrace
} from './langfuse.js';

const OPENAI_API_URL = 'https://api.openai.com/v1/responses';
const ENV_PATHS = [
  path.resolve(process.cwd(), '.env'),
  path.resolve(process.cwd(), '../../.env'),
  path.resolve(process.cwd(), '../.env')
];

const MODE_CONFIG = {
  summary: { maxOutputTokens: 145, minWords: 35, maxWords: 70 },
  teaser: { maxOutputTokens: 170, minWords: 50, maxWords: 95 },
  full: { maxOutputTokens: 530, minWords: 130, maxWords: 340 }
};

const MODE_ATTEMPTS = {
  summary: 1,
  teaser: 1,
  full: 1
};

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

function getConfigValue(key, fallback = '') {
  return process.env[key] || fileEnv[key] || fallback;
}

function getModelForMode(mode) {
  if (mode === 'full') {
    return getConfigValue('OPENAI_FULL_MODEL', getConfigValue('OPENAI_MODEL', DEFAULT_OPENAI_MODEL));
  }

  return getConfigValue('OPENAI_FREE_MODEL', getConfigValue('OPENAI_MODEL', DEFAULT_OPENAI_MODEL));
}

function extractText(responseJson) {
  if (typeof responseJson.output_text === 'string' && responseJson.output_text.trim()) {
    return responseJson.output_text.trim();
  }

  const outputItems = Array.isArray(responseJson.output) ? responseJson.output : [];

  for (const item of outputItems) {
    const content = Array.isArray(item.content) ? item.content : [];

    for (const part of content) {
      if (typeof part.text === 'string' && part.text.trim()) {
        return part.text.trim();
      }
    }
  }

  return '';
}

function countWords(text) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function countSentences(text) {
  return (String(text || '').match(/[^.!?…]+[.!?…]/g) || []).length;
}

function hasRedundantSummarySentences(text) {
  const sentences = String(text || '')
    .split(/(?<=[.!?…])\s+/)
    .map((sentence) => normalizeText(sentence).replace(/[^a-z0-9\s]/g, '').trim())
    .filter(Boolean);

  if (sentences.length < 2) {
    return false;
  }

  const seenStarts = new Set();

  for (const sentence of sentences) {
    const start = sentence.split(/\s+/).slice(0, 5).join(' ');
    if (seenStarts.has(start)) {
      return true;
    }
    seenStarts.add(start);
  }

  return false;
}

function normalizeText(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function sanitizeReading(text) {
  return String(text || '')
    .replace(/\r/g, '')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \t]{2,}/g, ' ')
    .replace(/\s+([,;:.!?])/g, '$1')
    .replace(/([«“])\s+/g, '$1')
    .replace(/\s+([»”])/g, '$1')
    .replace(/\bCa\b/g, 'Ça')
    .replace(/\bca\b/g, 'ça')
    .replace(/\bEtre\b/g, 'Être')
    .replace(/\betre\b/g, 'être')
    .replace(/\bMeme\b/g, 'Même')
    .replace(/\bmeme\b/g, 'même')
    .replace(/\bTres\b/g, 'Très')
    .replace(/\btres\b/g, 'très')
    .replace(/\bDecaler\b/g, 'Décaler')
    .replace(/\bdecaler\b/g, 'décaler')
    .replace(/\bRealite\b/g, 'Réalité')
    .replace(/\brealite\b/g, 'réalité')
    .replace(/\bPrecision\b/g, 'Précision')
    .replace(/\bprecision\b/g, 'précision')
    .replace(/\bNoeud\b/g, 'Nœud')
    .replace(/\bnoeud\b/g, 'nœud')
    .replace(/\bcoeur\b/g, 'cœur')
    .replace(/\bCoeur\b/g, 'Cœur')
    .replace(/\bc[’']est\b/g, 'c’est')
    .replace(/\bC[’']est\b/g, 'C’est')
    .replace(/\bd[’']abord\b/g, 'd’abord')
    .replace(/\bD[’']abord\b/g, 'D’abord')
    .replace(/\bl[’']instant\b/g, 'l’instant')
    .replace(/\bL[’']instant\b/g, 'L’instant')
    .replace(/\bl[’']enjeu\b/g, 'l’enjeu')
    .replace(/\bL[’']enjeu\b/g, 'L’enjeu')
    .replace(/\bn[’']est\b/g, 'n’est')
    .replace(/\bN[’']est\b/g, 'N’est')
    .replace(/\bjusqu[’']a\b/g, 'jusqu’à')
    .replace(/\bJusqu[’']a\b/g, 'Jusqu’à')
    .replace(/\bpresqu[’']a\b/g, 'presqu’à')
    .replace(/\bqu[’']il\b/g, 'qu’il')
    .replace(/\bQu[’']il\b/g, 'Qu’il')
    .replace(/\bs[’']il\b/g, 's’il')
    .replace(/\bS[’']il\b/g, 'S’il')
    .replace(/\bA ce stade\b/g, 'À ce stade')
    .replace(/\bA cet endroit\b/g, 'À cet endroit')
    .replace(/\bA ce moment\b/g, 'À ce moment')
    .replace(/\bA partir\b/g, 'À partir')
    .replace(/\bA travers\b/g, 'À travers')
    .replace(/\bA force\b/g, 'À force')
    .replace(/\bA l['’]/g, 'À l’')
    .replace(/\bA la fois\b/g, 'À la fois')
    .trim();
}

function sanitizeDecision(decision, question, runes, locale = 'fr') {
  const fallback = buildHeuristicRuneDecision({ question, runes, locale });
  const source = decision && typeof decision === 'object' ? decision : {};
  const allowedDecisions = ['oui', 'oui_mais', 'non_pour_l_instant', 'peu_probable', 'non_dans_les_conditions_actuelles'];
  const allowedClosure = ['low', 'medium', 'high'];
  const allowedHandling = ['allow', 'soften', 'reframe', 'refuse'];
  const allowedConfidenceLevels = ['high', 'medium', 'low'];
  const allowedGlobalTones = [
    'porteur',
    'ouvert_mais_retenu',
    'mitige',
    'tendu',
    'ferme_a_court_terme',
    'bloque_mais_non_sterile',
    'en_clarification',
    'en_maturation',
    'en_reajustement'
  ];
  const allowedCategories = [
    'decisionnelle',
    'evolution',
    'timing',
    'relationnelle',
    'emotionnelle',
    'factuelle_brute',
    'mal_adaptee_au_tirage'
  ];

  return {
    question_category: allowedCategories.includes(source.question_category) ? source.question_category : fallback.question_category,
    question_handling: allowedHandling.includes(source.question_handling) ? source.question_handling : fallback.question_handling,
    decision: allowedDecisions.includes(source.decision) ? source.decision : fallback.decision,
    confidence: typeof source.confidence === 'number' ? Math.max(0, Math.min(1, source.confidence)) : fallback.confidence,
    confidence_level: allowedConfidenceLevels.includes(source.confidence_level) ? source.confidence_level : fallback.confidence_level,
    past_role: typeof source.past_role === 'string' ? source.past_role : fallback.past_role,
    present_role: typeof source.present_role === 'string' ? source.present_role : fallback.present_role,
    future_role: typeof source.future_role === 'string' ? source.future_role : fallback.future_role,
    dominant_axis: typeof source.dominant_axis === 'string' ? source.dominant_axis : fallback.dominant_axis,
    main_block: typeof source.main_block === 'string' ? source.main_block : fallback.main_block,
    main_lever: typeof source.main_lever === 'string' ? source.main_lever : fallback.main_lever,
    closure_level: allowedClosure.includes(source.closure_level) ? source.closure_level : fallback.closure_level,
    global_tone: allowedGlobalTones.includes(source.global_tone) ? source.global_tone : fallback.global_tone,
    support_level: typeof source.support_level === 'number' ? Math.max(0, Math.min(1, source.support_level)) : fallback.support_level,
    friction_level: typeof source.friction_level === 'number' ? Math.max(0, Math.min(1, source.friction_level)) : fallback.friction_level,
    opening_level: typeof source.opening_level === 'number' ? Math.max(0, Math.min(1, source.opening_level)) : fallback.opening_level,
    tonal_response: allowedDecisions.includes(source.tonal_response) ? source.tonal_response : fallback.tonal_response,
    internal_synthesis:
      source.internal_synthesis && typeof source.internal_synthesis === 'object'
        ? {
            ...fallback.internal_synthesis,
            ...source.internal_synthesis
          }
        : fallback.internal_synthesis,
    is_positive_rune_neutralized:
      typeof source.is_positive_rune_neutralized === 'boolean'
        ? source.is_positive_rune_neutralized
        : fallback.is_positive_rune_neutralized,
    future_confirms_outcome:
      typeof source.future_confirms_outcome === 'boolean'
        ? source.future_confirms_outcome
        : fallback.future_confirms_outcome,
    tone_free: typeof source.tone_free === 'string' ? source.tone_free : fallback.tone_free,
    tone_paid: typeof source.tone_paid === 'string' ? source.tone_paid : fallback.tone_paid,
    topic: fallback.topic,
    subtype: fallback.subtype
  };
}

function extractFirstSentence(text) {
  const match = String(text || '').trim().match(/^.*?[.!?…](?:\s|$)/);
  return (match ? match[0] : String(text || '').trim()).trim();
}

function hasClearSummaryLead(text, question, locale = 'fr') {
  if (normalizeLocale(locale) !== 'fr') {
    return true;
  }

  const category = detectQuestionCategory(question);
  const topic = detectQuestionTopic(question);
  const firstSentence = normalizeText(extractFirstSentence(text));
  const closedQuestion = normalizeText(question).includes('est ce que') ||
    normalizeText(question).includes('vais je') ||
    normalizeText(question).includes('vais-je') ||
    normalizeText(question).includes('dois je') ||
    normalizeText(question).includes('dois-je');

  if (category === 'factuelle_brute' || category === 'mal_adaptee_au_tirage') {
    return (
      firstSentence.startsWith('la question appelle') ||
      firstSentence.startsWith('le tirage ne confirme pas') ||
      firstSentence.startsWith('dans cette forme')
    );
  }

  const weakStarts = [
    'la situation',
    'la tendance',
    'le mouvement',
    'quelque chose',
    'ce qui',
    'le present',
    'le présent'
  ];

  if (weakStarts.some((snippet) => firstSentence.startsWith(snippet))) {
    return false;
  }

  if (!closedQuestion) {
    return true;
  }

  if (topic === 'admin') {
    return (
      firstSentence.startsWith('oui') ||
      firstSentence.startsWith('non') ||
      firstSentence.startsWith('pour l instant') ||
      firstSentence.startsWith('pour l’instant') ||
      firstSentence.startsWith('une ouverture existe') ||
      firstSentence.startsWith('le plus probable') ||
      firstSentence.includes('se debloque') ||
      firstSentence.includes('se débloque') ||
      firstSentence.includes('issue favorable') ||
      firstSentence.includes('avancee partielle') ||
      firstSentence.includes('avancée partielle')
    );
  }

  return (
    firstSentence.startsWith('oui') ||
    firstSentence.startsWith('non') ||
    firstSentence.startsWith('plutot non') ||
    firstSentence.startsWith('plutôt non') ||
    firstSentence.startsWith('c est possible') ||
    firstSentence.startsWith('c’est possible') ||
    firstSentence.includes('parait probable') ||
    firstSentence.includes('paraît probable') ||
    firstSentence.includes('peu probable')
  );
}

function hasBrokenQuestionReuse(text) {
  const firstSentence = normalizeText(extractFirstSentence(text));
  return (
    firstSentence.startsWith('autour de ') ||
    firstSentence.startsWith('pour ta question') ||
    firstSentence.startsWith('pour votre question') ||
    firstSentence.startsWith('concernant ta question') ||
    firstSentence.startsWith('concernant votre question') ||
    /\best il\b.*\bpeut prendre forme\b/.test(firstSentence) ||
    /\best ce que\b.*\bpeut prendre forme\b/.test(firstSentence)
  );
}

function forceSummaryLead(text, question, runes, locale = 'fr', decision = null) {
  const normalizedLocale = normalizeLocale(locale);
  const normalizedQuestion = normalizeText(question);
  const closedQuestion =
    normalizedQuestion.includes('est ce que') ||
    normalizedQuestion.includes('vais je') ||
    normalizedQuestion.includes('vais-je') ||
    normalizedQuestion.includes('dois je') ||
    normalizedQuestion.includes('dois-je');

  if (normalizedLocale !== 'fr') {
    return text;
  }

  const localDecision = decision || buildHeuristicRuneDecision({ question, runes, locale });
  const forcedLead = buildFreeLeadFromDecision(localDecision, question, runes, locale);
  if (!closedQuestion && hasClearSummaryLead(text, question, locale) && !hasBrokenQuestionReuse(text)) {
    return text;
  }

  const sentences = String(text || '')
    .split(/(?<=[.!?…])\s+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);
  const remainder = sentences.slice(1, 3);
  return sanitizeReading([forcedLead, ...remainder].join(' '));
}

function endsCleanly(text) {
  return /[.!?…]$/.test(text.trim());
}

function endsWithQuestion(text) {
  return /\?\s*$/.test(text.trim());
}

function recoverNearCompleteFull(text, config) {
  const trimmed = String(text || '').trim();

  if (!trimmed || endsCleanly(trimmed)) {
    return trimmed;
  }

  const lastStop = Math.max(
    trimmed.lastIndexOf('.'),
    trimmed.lastIndexOf('!'),
    trimmed.lastIndexOf('?'),
    trimmed.lastIndexOf('…')
  );

  if (lastStop < 0) {
    return trimmed;
  }

  const recovered = trimmed.slice(0, lastStop + 1).trim();
  const recoveredWordCount = countWords(recovered);
  const lostWords = Math.max(0, countWords(trimmed) - recoveredWordCount);

  if (
    recoveredWordCount >= Math.max(config.minWords - 20, 105) &&
    lostWords <= 26 &&
    splitReadingBlocks(recovered).length >= 3
  ) {
    return recovered;
  }

  return trimmed;
}

function looksMechanicalTeaser(text) {
  const lowered = normalizeText(text);
  return [
    'par rapport a ta question sur',
    'montre que',
    'signale que',
    'ouvre une voie',
    'on voit que',
    'decouvrons ensemble',
    'secret',
    'energie',
    'invite a',
    'rappelle que',
    'murmure que',
    'souffle',
    'feu interieur',
    'renouveau',
    'harmonie',
    'carrefour',
    'labyrinthe',
    'echo',
    'resonance',
    'voie vers',
    'tu te retrouves',
    'tu te trouves a un moment ou',
    'ce qui se dessine',
    'la question de',
    'la dynamique montre',
    'il y a ici un vrai mouvement',
    'une tension plus fine',
    'c est precisement la',
    'c’est précisément là'
  ].some((snippet) => lowered.includes(snippet));
}

function looksMechanicalSummary(text) {
  const lowered = normalizeText(text);
  return [
    'montre que',
    'indique que',
    'ouvre une voie',
    'par rapport a ta question sur',
    'par rapport a ce que tu traverses',
    'energie',
    'on voit que',
    'souffle',
    'harmonie',
    'carrefour',
    'labyrinthe',
    'ce qui se dessine',
    'la question de',
    'la dynamique montre',
    'du coup',
    'le point qui pese le plus',
    'ce qui retient',
    'le vrai point a regarder',
    'le vrai point à regarder',
    'quelque chose peut avancer',
    'la situation n est pas fermee',
    'la situation n’est pas fermée',
    'tout n est pas bloque',
    'tout n’est pas bloqué',
    'tourne autour de',
    'c est possible, mais encore instable',
    'c’est possible, mais encore instable',
    'discipliner la force',
    'confrontation protectrice',
    'oui, cela parait probable',
    'oui, cela paraît probable',
    'le point qui resserre'
  ].some((snippet) => lowered.includes(snippet));
}

function looksMechanicalFull(text, question = '') {
  const lowered = normalizeText(text);
  const strongMarkers = [
    'cette rune',
    'ces runes',
    'energie',
    'souffle',
    'feu interieur',
    'renouveau',
    'harmonie',
    'carrefour',
    'labyrinthe',
    'echo',
    'resonance',
    'tu te retrouves',
    'tu te trouves a un moment ou',
    'tu vois deja ce qui est en train de se jouer'
  ];
  const weakMarkers = [
    'par rapport a ta question sur',
    'montre que',
    'indique que',
    'ouvre une voie',
    'ce qui se dessine',
    'la question de',
    'la dynamique montre',
    'une part de la situation',
    'le point sensible se situe la',
    'du coup'
  ];

  if (strongMarkers.some((snippet) => lowered.includes(snippet))) {
    return true;
  }

  const weakCount = weakMarkers.filter((snippet) => lowered.includes(snippet)).length;
  if (weakCount >= 2) {
    return true;
  }

  if (weakCount >= 1 && lacksConcreteAnchor(text, question) && lacksDomainAnchor(text, question)) {
    return true;
  }

  return false;
}

function hasPronounShift(text) {
  const lowered = normalizeText(text);
  return /\bvous\b/.test(lowered) || /\bvotre\b/.test(lowered) || /\bvos\b/.test(lowered);
}

function hasGenericCoachingQuestion(text) {
  const lowered = normalizeText(text);
  return [
    'es tu pret a',
    'es-tu pret a',
    'veux tu',
    'veux-tu',
    'jusqu ou es tu pret',
    'jusqu’ou es tu pret',
    'quelle part de cette retenue',
    'quelle question reste a explorer'
  ].some((snippet) => lowered.includes(snippet));
}

function hasMechanicalIntroLead(text) {
  const lowered = normalizeText(text.trim());
  return (
    lowered.startsWith('autour de ') ||
    lowered.startsWith('concernant ') ||
    lowered.startsWith('dans ta question') ||
    lowered.startsWith('au sujet de ') ||
    lowered.startsWith('for ') ||
    lowered.startsWith('around ') ||
    lowered.startsWith('regarding ')
  );
}

function splitReadingBlocks(text) {
  return String(text || '')
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean);
}

function getBlockSignalTokens(block) {
  const stopWords = new Set([
    'avec', 'alors', 'ainsi', 'apres', 'après', 'avant', 'cette', 'celui', 'celle', 'comme', 'dans', 'depuis',
    'encore', 'entre', 'mais', 'moins', 'plus', 'pour', 'quoi', 'sans', 'sous', 'tout', 'toute', 'toutes',
    'situation', 'tirage', 'montre', 'demande', 'reste', 'chose', 'point', 'partir', 'vraiment', 'maintenant',
    'deja', 'déjà', 'alors', 'vers', 'cela', 'cette', 'celui', 'celle', 'elles', 'leurs', 'leur', 'dans',
    'quand', 'encore', 'doit', 'peut', 'faire', 'tenir', 'avoir', 'etre', 'être'
  ]);

  return new Set(
    normalizeText(block)
      .split(/[^a-z0-9]+/)
      .filter((token) => token.length >= 5 && !stopWords.has(token))
  );
}

function hasRepetitiveFullBlocks(text) {
  const blocks = splitReadingBlocks(text);

  if (blocks.length < 3) {
    return true;
  }

  const firstThree = blocks.slice(0, 3);
  const tokenSets = firstThree.map(getBlockSignalTokens);

  for (let i = 0; i < tokenSets.length - 1; i += 1) {
    const current = tokenSets[i];
    const next = tokenSets[i + 1];

    if (!current.size || !next.size) {
      continue;
    }

    const overlap = [...current].filter((token) => next.has(token)).length;
    const ratio = overlap / Math.min(current.size, next.size);

    if (ratio >= 0.6) {
      return true;
    }
  }

  const loweredBlocks = firstThree.map((block) => normalizeText(block));
  const repeatedFamilies = [
    ['temps', 'maturation', 'rythme'],
    ['stabil', 'tenir', 'solid'],
    ['clar', 'lisib', 'net'],
    ['ajust', 'reajust', 'reglag'],
    ['bloqu', 'frein', 'resserr']
  ];

  const repeatedDominance = repeatedFamilies.some((family) =>
    loweredBlocks.filter((block) => family.some((token) => block.includes(token))).length >= 3
  );

  return repeatedDominance;
}

function hasProgressiveFullStructure(text) {
  const blocks = splitReadingBlocks(text).slice(0, 3).map((block) => normalizeText(block));

  if (blocks.length < 3) {
    return false;
  }

  const presentMarkers = ['maintenant', 'aujourd', 'actuel', 'centre', 'noeud', 'nœud'];
  const futureMarkers = ['evolu', 'évolu', 'suite', 'demande', 'franchi', 'franchi', 'ajust', 'assum', 'muri', 'murir', 'respect', 'passage'];

  const secondAnchored = presentMarkers.some((marker) => blocks[1].includes(marker));
  const thirdAnchored = futureMarkers.some((marker) => blocks[2].includes(marker));

  return secondAnchored && thirdAnchored;
}

function overcoolsSupportiveReading(text, decision = null) {
  if (!decision || (decision.global_tone !== 'porteur' && decision.global_tone !== 'ouvert_mais_retenu')) {
    return false;
  }

  const lowered = normalizeText(text);
  const positiveMarkers = [
    'ouverture',
    'appui',
    'base reelle',
    'base réelle',
    'favorable',
    'porteur',
    'mouvement deja',
    'mouvement déjà',
    'avance',
    'possibilite reelle',
    'possibilité réelle'
  ];
  const heavyReserveMarkers = [
    'reste fragile',
    'instable',
    'resserre',
    'bloque',
    'bloqué',
    'limite sa portee',
    'limite sa portée',
    'ne suffit pas encore',
    'retenue',
    'ralentit fortement',
    'freine encore'
  ];

  const positiveCount = positiveMarkers.filter((snippet) => lowered.includes(snippet)).length;
  const reserveCount = heavyReserveMarkers.filter((snippet) => lowered.includes(snippet)).length;

  if (decision.global_tone === 'porteur') {
    return reserveCount >= 2 && positiveCount < 2;
  }

  return reserveCount >= 3 && positiveCount < 1;
}

function hasForbiddenRuneDrift(text) {
  const lowered = normalizeText(text);
  return [
    'crise necessaire',
    'transformation brutale',
    'tenir le seuil jusqu a la bascule',
    'tenir le seuil jusqu’a la bascule',
    'grande bascule initiatique',
    'bascule initiatique',
    'traversee',
    'traversée',
    'initiatique',
    'rupture radicale',
    'transformation totale',
    'idealisation du bonheur',
    'laisser la clarte preceder l action',
    'laisser la clarte preceder',
    'faire confiance au flux',
    'se dissoudre',
    'preceder l action',
    'nourrissage',
    'laisser croitre',
    'faire circuler avec discernement',
    'lumiere pleine',
    'alignement et victoire',
    'direction rayonnante',
    'protection divine',
    'connexion sacree',
    'jeu de hasard',
    'mort-renaissance',
    'lacher-prise structure',
    'synchronicite',
    'sagesse ancienne',
    'message de l univers',
    'energie subtile',
    'cela depend',
    'cela dependra',
    'une dynamique semble',
    'il pourrait',
    'cette energie',
    'lecture approfondie n a pas pu etre generee',
    'lecture approfondie n’a pas pu etre generee',
    'lecture approfondie n’a pas pu être générée',
    'synthese interne',
    'synthèse interne',
    'reponse courte reste',
    'réponse courte reste',
    'soutien est evalue',
    'soutien est évalué',
    'ce fallback',
    'fallback',
    'pourcentage',
    'non mesure',
    'non mesuré',
    'le point qui pese le plus',
    'tourne autour de',
    'discipliner la force',
    'confrontation protectrice'
  ].some((snippet) => lowered.includes(snippet));
}

function mentionsRuneNames(text, runes) {
  const lowered = normalizeText(text);
  return runes.some((rune) => lowered.includes(normalizeText(String(rune?.nom || ''))));
}

function looksSegmentedReading(text) {
  const lowered = normalizeText(text);
  return [
    'passe',
    'présent',
    'present',
    'futur',
    'd abord',
    'ensuite',
    'enfin'
  ].some((snippet) => lowered.includes(snippet));
}

function extractQuestionAnchors(question) {
  const lowered = normalizeText(question);
  const stopWords = new Set([
    'alors', 'avec', 'avoir', 'comment', 'dans', 'depuis', 'dois', 'doit', 'donc', 'elle', 'elles',
    'entre', 'etre', 'faire', 'mais', 'meme', 'mon', 'plus', 'pour', 'pourquoi', 'quand', 'quel',
    'quelle', 'quelles', 'quels', 'quoi', 'sans', 'sera', 'serait', 'sont', 'sur', 'toi', 'ton',
    'tout', 'tres', 'une', 'vers', 'vais', 'vrai', 'vraie', 'vraiment', 'ou', 'pas', 'qui',
    'cela', 'ca', 'situation', 'traverse', 'traverses', 'moment', 'question'
  ]);

  return [...new Set(
    lowered
      .split(/[^a-z0-9]+/)
      .filter((token) => token.length >= 4 && !stopWords.has(token))
  )].slice(0, 6);
}

function lacksConcreteAnchor(text, question) {
  const anchors = extractQuestionAnchors(question);

  if (!anchors.length) {
    return false;
  }

  const lowered = normalizeText(text);
  return !anchors.some((anchor) => lowered.includes(anchor));
}

function lacksDomainAnchor(text, question) {
  const loweredQuestion = normalizeText(question);
  const loweredText = normalizeText(text);

  const domainChecks = [
    {
      triggers: ['financ', 'argent', 'revenu', 'client', 'clients', 'money', 'income', 'financial'],
      required: ['financ', 'argent', 'revenu', 'client', 'clients', 'stable', 'stabil', 'materiel', 'materielle', 'money', 'income', 'financial']
    },
    {
      triggers: ['projet', 'projets', 'activite', 'activité', 'video', 'videos', 'reseaux', 'réseaux', 'project', 'projects', 'visibility', 'social'],
      required: ['projet', 'projets', 'activite', 'activité', 'video', 'videos', 'visibil', 'regulier', 'reguli', 'tenir', 'rythme', 'project', 'projects', 'visibility', 'steady', 'consisten', 'pace']
    },
    {
      triggers: ['couple', 'relation', 'amour', 'mari', 'femme', 'lien', 'relationship', 'love', 'partner'],
      required: ['relation', 'lien', 'couple', 'attache', 'reciproc', 'clarte', 'distance', 'relationship', 'attachment', 'clarity', 'distance']
    }
  ];

  for (const rule of domainChecks) {
    if (rule.triggers.some((token) => loweredQuestion.includes(token))) {
      return !rule.required.some((token) => loweredText.includes(token));
    }
  }

  return false;
}

function lacksLivedSituationLayer(text, question) {
  const loweredQuestion = normalizeText(question);
  const loweredText = normalizeText(text);

  const livedMarkers = [
    'concret', 'cadre', 'rythme', 'timing', 'conditions', 'marge', 'decision', 'décision',
    'echange', 'échange', 'place', 'pression', 'organisation', 'materiel', 'matériel',
    'stabilite', 'stabilité', 'retard', 'appui', 'charge', 'rapport', 'lien', 'quotidien'
  ];

  const topicSensitive = [
    'demenagement', 'déménagement', 'projet', 'activite', 'activité', 'revenu', 'argent',
    'financ', 'relation', 'couple', 'lien', 'train', 'billet', 'achat', 'tarif', 'prix'
  ].some((token) => loweredQuestion.includes(normalizeText(token)));

  if (!topicSensitive) {
    return false;
  }

  return !livedMarkers.some((token) => loweredText.includes(normalizeText(token)));
}

function hasUnsupportedConcreteSpecifics(text, question) {
  const loweredText = normalizeText(text);
  const loweredQuestion = normalizeText(question);

  const bannedSpecifics = [
    'validation formelle',
    'validation officielle',
    'delai administratif',
    'document attendu',
    'document a fournir',
    'contact direct',
    'action ciblee',
    'action ciblée',
    'formulaire',
    'piece justificative',
    'pièce justificative'
  ];

  const questionAllowsConcrete =
    ['document', 'dossier', 'formulaire', 'administratif', 'administrative', 'justificatif', 'validation', 'tribunal', 'caf']
      .some((token) => loweredQuestion.includes(normalizeText(token)));

  if (questionAllowsConcrete) {
    return false;
  }

  return bannedSpecifics.some((snippet) => loweredText.includes(normalizeText(snippet)));
}

function getReadingValidationResult(text, mode, runes = [], question = '', locale = 'fr', decision = null) {
  const config = MODE_CONFIG[mode];
  const wordCount = countWords(text);
  const normalizedLocale = normalizeLocale(locale);

  if (!text || !endsCleanly(text)) {
    return { valid: false, reason: 'empty_or_unfinished_text', severity: 'hard' };
  }

  if (wordCount < config.minWords || wordCount > config.maxWords) {
    return { valid: false, reason: 'word_count_out_of_bounds', severity: mode === 'full' ? 'soft' : 'hard' };
  }

  if (mode === 'summary' && countSentences(text) > 3) {
    return { valid: false, reason: 'summary_too_many_sentences', severity: 'soft' };
  }

  if (mode === 'summary' && hasRedundantSummarySentences(text)) {
    return { valid: false, reason: 'summary_redundant_sentences', severity: 'soft' };
  }

  if (normalizedLocale === 'fr' && mode === 'teaser' && looksMechanicalTeaser(text)) {
    return { valid: false, reason: 'mechanical_teaser', severity: 'soft' };
  }

  if (mode === 'teaser' && (mentionsRuneNames(text, runes) || looksSegmentedReading(text))) {
    return { valid: false, reason: 'teaser_exposes_runes_or_segments', severity: 'hard' };
  }

  if (normalizedLocale === 'fr' && mode === 'summary' && looksMechanicalSummary(text)) {
    return { valid: false, reason: 'mechanical_summary', severity: 'soft' };
  }

  if (mode === 'summary' && mentionsRuneNames(text, runes)) {
    return { valid: false, reason: 'summary_mentions_runes', severity: 'hard' };
  }

  if (mode === 'summary' && !hasClearSummaryLead(text, question, locale)) {
    return { valid: false, reason: 'summary_missing_clear_lead', severity: 'soft' };
  }

  if (mode === 'summary' && hasBrokenQuestionReuse(text)) {
    return { valid: false, reason: 'summary_broken_question_reuse', severity: 'hard' };
  }

  if (mode === 'summary' && lacksConcreteAnchor(text, question)) {
    return { valid: false, reason: 'summary_missing_concrete_anchor', severity: 'soft' };
  }

  if (mode === 'summary' && lacksDomainAnchor(text, question)) {
    return { valid: false, reason: 'summary_missing_domain_anchor', severity: 'soft' };
  }

  if ((mode === 'summary' || mode === 'full') && hasUnsupportedConcreteSpecifics(text, question)) {
    return { valid: false, reason: 'unsupported_concrete_specifics', severity: 'hard' };
  }

  if (normalizedLocale === 'fr' && mode === 'full' && looksMechanicalFull(text, question)) {
    return { valid: false, reason: 'mechanical_full', severity: 'soft' };
  }

  if (mode === 'full' && hasRepetitiveFullBlocks(text)) {
    return { valid: false, reason: 'full_repetitive_blocks', severity: 'soft' };
  }

  if (mode === 'full' && !hasProgressiveFullStructure(text)) {
    return { valid: false, reason: 'full_missing_progression', severity: 'soft' };
  }

  if (mode === 'full' && overcoolsSupportiveReading(text, decision)) {
    return { valid: false, reason: 'full_overcools_supportive_tone', severity: 'soft' };
  }

  if (mode === 'full' && mentionsRuneNames(text, runes)) {
    return { valid: false, reason: 'full_mentions_runes', severity: 'hard' };
  }

  if (normalizedLocale === 'fr' && mode === 'full' && (hasPronounShift(text) || hasGenericCoachingQuestion(text))) {
    return { valid: false, reason: 'full_pronoun_shift_or_generic_coaching', severity: 'soft' };
  }

  if (mode === 'full' && hasMechanicalIntroLead(text)) {
    return { valid: false, reason: 'full_mechanical_intro', severity: 'hard' };
  }

  if (normalizedLocale === 'fr' && hasForbiddenRuneDrift(text)) {
    return { valid: false, reason: 'forbidden_rune_drift', severity: 'hard' };
  }

  if ((mode === 'teaser' || mode === 'full') && lacksConcreteAnchor(text, question)) {
    return { valid: false, reason: `${mode}_missing_concrete_anchor`, severity: 'soft' };
  }

  if ((mode === 'teaser' || mode === 'full') && lacksDomainAnchor(text, question)) {
    return { valid: false, reason: `${mode}_missing_domain_anchor`, severity: 'soft' };
  }

  if (mode === 'full' && lacksLivedSituationLayer(text, question)) {
    return { valid: false, reason: 'full_missing_lived_situation_layer', severity: 'soft' };
  }

  return { valid: true, reason: '', severity: 'none' };
}

function validateReading(text, mode, runes = [], question = '', locale = 'fr', decision = null) {
  return getReadingValidationResult(text, mode, runes, question, locale, decision).valid;
}

export function validateRuneReadingInput(payload) {
  const question = typeof payload?.question === 'string' ? payload.question.trim() : '';
  const runes = Array.isArray(payload?.runes) ? payload.runes : [];
  const mode = ['summary', 'teaser', 'full'].includes(payload?.mode) ? payload.mode : 'teaser';
  const locale = normalizeLocale(payload?.locale);
  const theme = normalizeTheme(payload?.theme);

  if (!question) {
    throw new Error('La question est requise.');
  }

  if (question.length > MAX_QUESTION_LENGTH) {
    const error = new Error('Ta question est un peu trop longue. Essaie de la formuler en 300 caracteres maximum, avec l’essentiel de la situation.');
    error.statusCode = 400;
    throw error;
  }

  if (runes.length !== 3) {
    throw new Error('Le tirage doit contenir exactement 3 runes.');
  }

  return { question, runes, mode, locale, theme };
}

async function requestReading({ apiKey, instructions, prompt, config, mode }) {
  const response = await fetch(OPENAI_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: getModelForMode(mode),
      temperature: 0.7,
      max_output_tokens: config.maxOutputTokens,
      instructions,
      input: [
        {
          role: 'user',
          content: [
            {
              type: 'input_text',
              text: prompt
            }
          ]
        }
      ]
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI API error: ${response.status} ${errorText}`);
  }

  const responseJson = await response.json();

  if (responseJson?.refusal) {
    throw new Error('Le modele a refuse de produire une lecture pour cette demande.');
  }

  return extractText(responseJson);
}

export async function createRuneReading(payload, telemetry = null) {
  const { question, runes, mode, locale, theme } = validateRuneReadingInput(payload);
  const decision = buildHeuristicRuneDecision({ question, runes, locale, theme });
  const isReframeTrack =
    decision.question_handling === 'reframe' ||
    decision.question_category === 'factuelle_brute' ||
    decision.question_category === 'mal_adaptee_au_tirage';
  const isSensitiveTrack = decision.question_handling === 'refuse';
  const maxAttempts = MODE_ATTEMPTS[mode] ?? 1;
  const modelForMode = getModelForMode(mode);
  const spanName =
    mode === 'summary'
      ? 'free_generation'
      : mode === 'teaser'
        ? 'teaser_generation'
        : 'full_generation';

  const executeReading = async (traceObservation) => {
    await withLangfuseSpan(
      traceObservation,
      'question_classification',
      {
        input: { question, theme, mode, locale },
        metadata: {
          theme,
          question,
          question_category: decision.question_category,
          question_handling: decision.question_handling
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
        input: { question, theme, runes },
        metadata: buildLangfuseReadingMetadata({
          question,
          theme,
          runes,
          decision,
          shortAnswer: decision?.internal_synthesis?.reponse_courte,
          modelFree: getModelForMode('summary'),
          modelFull: getModelForMode('full')
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
            confidence_level: decision.confidence_level,
            short_answer: decision?.internal_synthesis?.reponse_courte || ''
          }
        });
      }
    );

    if (mode === 'full' && (isReframeTrack || isSensitiveTrack)) {
      const reframeFull = createReframeReading({ question, locale, decision, mode: 'full' });

      await withLangfuseSpan(
        traceObservation,
        'full_generation',
        {
          input: { question, runes, mode, theme },
          output: reframeFull,
          metadata: {
            route: isReframeTrack ? 'reframe' : 'sensitive',
            skipped_ai: true,
            validation_success: true,
            validation_failure_reason: '',
            ...buildLangfuseReadingMetadata({
              question,
              theme,
              runes,
              decision,
              shortAnswer: decision?.internal_synthesis?.reponse_courte,
              usedFreeAi: false,
              usedFullAi: false,
              usedFullFallback: false,
              modelFree: getModelForMode('summary'),
              modelFull: getModelForMode('full')
            })
          }
        },
        async () => {}
      );

      await withLangfuseSpan(
        traceObservation,
        'final_render',
        {
          output: {
            mode,
            reading: reframeFull
          },
          metadata: buildLangfuseReadingMetadata({
            question,
            theme,
            runes,
            decision,
            shortAnswer: decision?.internal_synthesis?.reponse_courte,
            usedFreeAi: false,
            usedFullAi: false,
            usedFullFallback: false,
            modelFree: getModelForMode('summary'),
            modelFull: getModelForMode('full')
          })
        },
        async () => {}
      );

      return reframeFull;
    }

    if (maxAttempts === 0) {
      const teaser = createTeaserFallback({ question, runes, locale, decision, theme });

      await withLangfuseSpan(
        traceObservation,
        'teaser_generation',
        {
          input: { question, runes, mode, theme },
          metadata: buildLangfuseReadingMetadata({
            question,
            theme,
            runes,
            decision,
            usedFreeAi: false,
            usedFullAi: false,
            usedFullFallback: false,
            modelFree: getModelForMode('summary'),
            modelFull: getModelForMode('full')
          }),
          output: teaser
        },
        async () => {}
      );

      await withLangfuseSpan(
        traceObservation,
        'final_render',
        {
          output: {
            mode,
            reading: teaser
          },
          metadata: buildLangfuseReadingMetadata({
            question,
            theme,
            runes,
            decision,
            usedFreeAi: false,
            usedFullAi: false,
            usedFullFallback: false,
            modelFree: getModelForMode('summary'),
            modelFull: getModelForMode('full')
          })
        },
        async () => {}
      );

      return teaser;
    }

    const apiKey = getConfigValue('OPENAI_API_KEY');

    if (!apiKey) {
      throw new Error('OPENAI_API_KEY is missing.');
    }

    for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
      const config = MODE_CONFIG[mode];
      const instructions =
        mode === 'summary'
          ? getSummarySystemPrompt(locale)
          : mode === 'teaser'
            ? getTeaserSystemPrompt(locale)
            : getFullSystemPrompt(locale);
      const prompt =
        mode === 'summary'
          ? getSummaryUserPromptWithDecision({ question, runes, locale, decision, theme })
          : mode === 'teaser'
            ? getTeaserUserPromptWithDecision({ question, runes, locale, decision, theme })
            : getFullUserPromptWithDecision({ question, runes, locale, decision, theme });

      let rawReading = '';
      let reading = '';
      let validation = { valid: false, reason: 'not_validated', severity: 'hard' };

      await withLangfuseSpan(
        traceObservation,
        spanName,
        {
          input: prompt,
          model: modelForMode,
          modelParameters: {
            max_output_tokens: config.maxOutputTokens,
            attempt: attempt + 1
          },
          metadata: {
            prompt_compact: prompt,
            theme,
            mode,
            question,
            attempt: attempt + 1,
            ...buildLangfuseReadingMetadata({
              question,
              theme,
              runes,
              decision,
              usedFreeAi: mode === 'summary',
              usedFullAi: mode === 'full',
              usedFullFallback: false,
              modelFree: getModelForMode('summary'),
              modelFull: getModelForMode('full')
            })
          }
        },
        async (generation) => {
          rawReading = await requestReading({ apiKey, instructions, prompt, config, mode });
          reading = sanitizeReading(rawReading);

          if (mode === 'summary') {
            reading = forceSummaryLead(reading, question, runes, locale, decision);
          }

          if (mode === 'full') {
            reading = recoverNearCompleteFull(reading, config);
          }

          validation = getReadingValidationResult(reading, mode, runes, question, locale, decision);

          generation?.update({
            output: {
              raw_output: rawReading,
              final_output: reading
            },
            metadata: {
              validation_success: validation.valid,
              validation_failure_reason: validation.reason
            }
          });
        },
        { asType: 'generation' }
      );

      if (validation.valid || validation.severity === 'soft') {
        await withLangfuseSpan(
          traceObservation,
          'final_render',
          {
            output: {
              mode,
              reading
            },
            metadata: buildLangfuseReadingMetadata({
              question,
              theme,
              runes,
              decision,
              shortAnswer: decision?.internal_synthesis?.reponse_courte,
              usedFreeAi: mode === 'summary',
              usedFullAi: mode === 'full',
              usedFullFallback: false,
              modelFree: getModelForMode('summary'),
              modelFull: getModelForMode('full')
            })
          },
          async () => {}
        );

        return reading;
      }

      if (attempt === maxAttempts - 1) {
        const fallback =
          mode === 'summary'
            ? createFreeReadingSummary({ question, runes, locale, decision, theme })
            : mode === 'teaser'
              ? createTeaserFallback({ question, runes, locale, decision, theme })
              : createFullReadingFallback({ question, runes, locale, decision, theme });

        if (mode === 'full') {
          await withLangfuseSpan(
            traceObservation,
            'fallback_full',
            {
              input: {
                question,
                runes
              },
              output: {
                fallback_text_final: fallback
              },
              metadata: {
                fallback_reason: validation.reason || 'validation_failed',
                ...buildLangfuseReadingMetadata({
                  question,
                  theme,
                  runes,
                  decision,
                  shortAnswer: decision?.internal_synthesis?.reponse_courte,
                  usedFreeAi: false,
                  usedFullAi: false,
                  usedFullFallback: true,
                  modelFree: getModelForMode('summary'),
                  modelFull: getModelForMode('full')
                })
              }
            },
            async () => {}
          );
        }

        await withLangfuseSpan(
          traceObservation,
          'final_render',
          {
            output: {
              mode,
              reading: fallback
            },
            metadata: buildLangfuseReadingMetadata({
              question,
              theme,
              runes,
              decision,
              shortAnswer: decision?.internal_synthesis?.reponse_courte,
              usedFreeAi: mode === 'summary' ? false : mode === 'teaser' ? false : false,
              usedFullAi: false,
              usedFullFallback: mode === 'full',
              modelFree: getModelForMode('summary'),
              modelFull: getModelForMode('full')
            })
          },
          async () => {}
        );

        return fallback;
      }
    }
  };

  if (telemetry?.traceObservation) {
    return executeReading(telemetry.traceObservation);
  }

  return withLangfuseTrace(
    {
      tirageId: telemetry?.tirageId || payload?.tirageId || null,
      traceName: 'nornsight_reading',
      input: {
        question,
        runes,
        mode,
        locale,
        theme
      },
      metadata: buildLangfuseReadingMetadata({
        question,
        theme,
        runes,
        decision,
        shortAnswer: decision?.internal_synthesis?.reponse_courte,
        usedFreeAi: mode === 'summary',
        usedFullAi: mode === 'full',
        usedFullFallback: false,
        modelFree: getModelForMode('summary'),
        modelFull: getModelForMode('full')
      })
    },
    async (traceObservation) => executeReading(traceObservation)
  );
}
