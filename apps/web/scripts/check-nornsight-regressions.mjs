import fs from 'node:fs';
import path from 'node:path';
import {
  PROMPT_MANAGEMENT_KEYS,
  PROMPT_MANAGEMENT_REGISTRY,
  buildHeuristicRuneDecision,
  createFreeReadingSummary,
  createFullReadingFallback,
  createReframeReading,
  createTeaserFallback,
  getFullUserPromptWithDecision,
  getSummaryUserPromptWithDecision
} from '../src/lib/runeReadingPrompt.js';
import { parseFullReadingSections } from '../src/lib/fullReadingSections.js';
import { createRuneReading } from '../server/runeReadingService.js';

const CASES_PATH = path.resolve(process.cwd(), 'server/observability/nornsight-reference-cases.json');
const cases = JSON.parse(fs.readFileSync(CASES_PATH, 'utf8'));

const forbiddenVisibleTerms = [
  'internal_synthesis',
  'validation_success',
  'validation_failure_reason',
  'fallback_reason',
  'fallback_text_final',
  'support_level',
  'friction_level',
  'opening_level',
  'confidence_level',
  'response courte',
  'réponse courte',
  'synthèse interne',
  'ce fallback reste volontairement court',
  'la lecture approfondie n’a pas pu être générée'
];

const forbiddenLeadPatterns = [/^autour de\b/i, /^pour ta question\b/i, /^pour\b.+\bil semble que\b/i];
const negativeDecisions = new Set(['non_pour_l_instant', 'peu_probable', 'non_dans_les_conditions_actuelles']);

let failed = false;

function assert(condition, message) {
  if (!condition) {
    failed = true;
    console.error(`FAIL: ${message}`);
  }
}

function checkNoLeaks(text, label) {
  const lowered = String(text || '').toLowerCase();
  for (const term of forbiddenVisibleTerms) {
    assert(!lowered.includes(term.toLowerCase()), `${label} leaked internal term "${term}"`);
  }
}

function checkNoBrokenLead(text, label) {
  const firstSentence = String(text || '').split(/(?<=[.!?…])\s+/)[0] || '';
  for (const pattern of forbiddenLeadPatterns) {
    assert(!pattern.test(firstSentence), `${label} starts with a broken or generic lead`);
  }
}

function checkSentenceCount(text, maxSentences, label) {
  const count = (String(text || '').match(/[^.!?…]+[.!?…]/g) || []).length;
  assert(count <= maxSentences, `${label} is too long (${count} sentences > ${maxSentences})`);
}

function runCase(testCase) {
  const { id, label, question, runes, theme } = testCase;
  const decision = buildHeuristicRuneDecision({ question, runes, locale: 'fr', theme });
  const free = createFreeReadingSummary({ question, runes, locale: 'fr', decision, theme });
  const teaser = createTeaserFallback({ question, runes, locale: 'fr', decision, theme });
  const fullFallback = createFullReadingFallback({ question, runes, locale: 'fr', decision, theme });
  const reframe = createReframeReading({ question, locale: 'fr', decision, mode: 'full' });
  const summaryPrompt = getSummaryUserPromptWithDecision({ question, runes, locale: 'fr', decision, theme });
  const fullPrompt = getFullUserPromptWithDecision({ question, runes, locale: 'fr', decision, theme });

  console.log(`\n[${id}] ${label}`);
  console.log(`decision=${decision.decision} tone=${decision.global_tone} handling=${decision.question_handling}`);

  checkNoLeaks(free, `${id}:free`);
  checkNoLeaks(teaser, `${id}:teaser`);
  checkNoLeaks(fullFallback, `${id}:fullFallback`);
  checkNoLeaks(reframe, `${id}:reframe`);
  checkNoBrokenLead(free, `${id}:free`);
  checkSentenceCount(free, 3, `${id}:free`);

  assert(summaryPrompt.length < fullPrompt.length, `${id} should keep a lighter free prompt than full prompt`);

  if (id === 'reframe_fact') {
    assert(decision.question_handling === 'reframe', `${id} should route to reframe`);
    assert(decision.question_category === 'factuelle_brute', `${id} should be classified as factuelle_brute`);
    assert(reframe.includes('vérification concrète'), `${id} reframe text should mention factual verification`);
    assert(fullFallback.includes('vérification concrète'), `${id} fallback full should stay in reframe mode`);
  }

  if (id === 'maturation_finance') {
    assert(decision.question_handling === 'allow', `${id} should stay in standard track`);
    assert(decision.support_level >= decision.friction_level, `${id} should keep more support than friction`);
    assert(!negativeDecisions.has(decision.decision), `${id} should not collapse into a closed decision`);
    assert(fullFallback.includes('situation financière'), `${id} full fallback should stay tied to the real situation`);
  }

  if (id === 'porteur_demenagement') {
    assert(decision.global_tone === 'porteur', `${id} should stay clearly supportive`);
    assert(decision.decision === 'oui' || decision.decision === 'oui_mais', `${id} should remain positive`);
    assert(fullFallback.includes('ton déménagement'), `${id} full fallback should stay concrete`);
  }

  if (id === 'project_revenue') {
    assert(decision.question_handling === 'allow', `${id} should not be reframed`);
    assert(decision.support_level > decision.friction_level, `${id} should keep a supportive balance`);
    assert(!negativeDecisions.has(decision.decision), `${id} should not turn into a closed answer`);
  }

  if (id === 'tendu_finance') {
    assert(decision.question_handling === 'allow', `${id} should remain a normal reading`);
    assert(decision.friction_level >= decision.support_level, `${id} should keep friction dominant`);
    assert(negativeDecisions.has(decision.decision), `${id} should stay tense or closed`);
  }

  if (id === 'constructive_relation') {
    assert(decision.question_handling === 'allow', `${id} should stay in standard track`);
    assert(decision.support_level > decision.friction_level, `${id} should stay constructive overall`);
    assert(
      decision.global_tone === 'porteur' || decision.global_tone === 'ouvert_mais_retenu' || decision.decision === 'oui_mais' || decision.decision === 'oui',
      `${id} should not collapse into a negative reading`
    );
  }

  if (id === 'maturation_growth') {
    assert(decision.question_handling === 'allow', `${id} should stay in standard track`);
    assert(decision.support_level >= decision.friction_level, `${id} should keep maturation above blockage`);
    assert(!negativeDecisions.has(decision.decision), `${id} should not be treated as a hard block`);
  }

  if (id === 'relation_opening') {
    assert(decision.support_level > decision.friction_level, `${id} should preserve reciprocal opening`);
    assert(!negativeDecisions.has(decision.decision), `${id} should not degrade into a negative outcome`);
  }

  if (id === 'clarity_favorable') {
    assert(decision.support_level > decision.friction_level, `${id} should stay favorable overall`);
    assert(decision.global_tone !== 'tendu' && decision.global_tone !== 'ferme_a_court_terme', `${id} should not over-darken Sowilo/Wunjo`);
  }
}

assert(
  PROMPT_MANAGEMENT_KEYS.free_summary &&
    PROMPT_MANAGEMENT_KEYS.full_reading &&
    PROMPT_MANAGEMENT_KEYS.reframe_reading,
  'Prompt management keys must expose free/full/reframe'
);
assert(
  PROMPT_MANAGEMENT_REGISTRY.free_summary &&
    PROMPT_MANAGEMENT_REGISTRY.full_reading &&
    PROMPT_MANAGEMENT_REGISTRY.reframe_reading,
  'Prompt management registry must expose free/full/reframe descriptors'
);

for (const testCase of cases) {
  runCase(testCase);
}

const reframeReading = await createRuneReading({
  question: 'Est-ce que Michael Jackson est mort ?',
  theme: 'situation',
  locale: 'fr',
  mode: 'full',
  runes: [
    { nom: 'Ansuz', positionLabel: 'Passé', positionKeywords: ['message', 'information', 'parole'] },
    { nom: 'Perthro', positionLabel: 'Présent', positionKeywords: ['caché', 'incertitude', 'pièce manquante'] },
    { nom: 'Isa', positionLabel: 'Futur', positionKeywords: ['gel', 'suspension', 'arrêt'] }
  ]
});

assert(
  reframeReading.includes('vérification concrète'),
  'Reframe full should short-circuit to a clean reframe text instead of requiring premium AI generation'
);

const legacyFullReading = `
Ce que le tirage indique clairement

Le cadre est bien posé et une base existe déjà.

Ce qui agit réellement dans la situation

Quelque chose pousse mais reste encore retenu.

Ce vers quoi cela tend

La suite peut s’ouvrir, sans devenir simple pour autant.

Ce que cela dit de ta manière de vivre la situation

Tu sens déjà ce qui veut avancer, mais sans encore le tenir pleinement.

Le point d’ajustement

Ce qui fera la différence, c’est une clarification plus nette.
`;

const legacySections = parseFullReadingSections(legacyFullReading, 'fr');
assert(legacySections.length === 5, 'Legacy 5-section readings should keep 5 visible sections');
assert(
  legacySections[3]?.title === 'Ce que cela dit de ta manière de vivre la situation' &&
    legacySections[4]?.title === 'Le point d’ajustement',
  'Legacy 5-section readings should preserve section 4 and 5 titles'
);

const parasiteSections = parseFullReadingSections(
  `
1. Ce qui est déjà posé.

Une base existe.

2. Ce qui domine maintenant.

Un point demande encore d’être clarifié.

3. Ce qui va probablement suivre.

6.

3)

4 -

La suite dépend d’un cap plus net.
`,
  'fr'
);

assert(parasiteSections.length === 3, 'Numeric parasite blocks should not create extra sections');
assert(
  parasiteSections.every((section) => !/\b(?:6\.|3\)|4\s*-)\b/.test(section.body)),
  'Numeric parasite blocks should be stripped from rendered section bodies'
);

if (failed) {
  process.exitCode = 1;
  console.error('\nNornsight regression checks failed.');
} else {
  console.log('\nNornsight regression checks passed.');
}
