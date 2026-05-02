import {
  buildAnchorNote,
  buildEmotionalStateCalibrationEn,
  buildEmotionalStateCalibrationFr,
  buildExampleDirection,
  buildFormNote,
  buildGroundingNote,
  buildQuestionTypeCalibrationEn,
  buildQuestionTypeCalibrationFr,
  buildShapeNote,
  detectQuestionCategory,
  detectQuestionHandling,
  inferQuestionForm,
  inferQuestionLens,
  inferQuestionShape
} from './runeReadingCalibrations.js';

export {
  detectQuestionCategory,
  detectQuestionHandling,
  inferQuestionShape
} from './runeReadingCalibrations.js';

export const DEFAULT_OPENAI_MODEL = 'gpt-5.4-mini';
export const normalizeLocale = (locale) => (String(locale || '').toLowerCase().startsWith('en') ? 'en' : 'fr');
export const normalizeTheme = (theme) => {
  const value = String(theme || '').toLowerCase();
  return ['pro', 'relations', 'argent', 'situation', 'autre'].includes(value) ? value : 'situation';
};

const THEME_NOTES_FR = {
  pro: "Thème choisi : pro. Garde la lecture ancrée dans le travail, l'activité, les projets, la visibilité, le cadre concret ou les décisions professionnelles.",
  relations: "Thème choisi : relations. Garde la lecture ancrée dans le lien, la réciprocité, la distance, la reprise ou la manière dont la relation est vécue.",
  argent: "Thème choisi : argent. Garde la lecture ancrée dans l'argent, la marge, la stabilité, les dépenses, les revenus ou le cadre matériel.",
  situation: "Thème choisi : situation. Reste large mais concret. Cherche le nœud réel sans enfermer la lecture trop vite dans un domaine unique.",
  autre: "Thème choisi : autre. Garde la lecture ouverte mais concrète, sans surinterpréter ni inventer un cadre psychologique."
};

const THEME_NOTES_EN = {
  pro: "Chosen theme: work. Keep the reading anchored in work, projects, visibility, structure or professional decisions.",
  relations: "Chosen theme: relationships. Keep the reading anchored in the bond, reciprocity, distance, reconnection or how the relationship is being lived.",
  argent: "Chosen theme: money. Keep the reading anchored in money, margin, stability, expenses, income or practical conditions.",
  situation: "Chosen theme: situation. Stay broad but concrete. Look for the real knot without forcing the reading too early into one domain.",
  autre: "Chosen theme: other. Keep the reading open but concrete, without overinterpreting or inventing a psychological frame."
};

const RUNE_ANALYSIS_METADATA = {
  Fehu: { type: 'expansion', movement: 'active', tempo: 'fast', control: 'controlled', function: 'flow, gain, circulation' },
  Uruz: { type: 'expansion', movement: 'active', tempo: 'fast', control: 'semi-controlled', function: 'force, push' },
  Thurisaz: { type: 'rupture', movement: 'brutal', tempo: 'immediate', control: 'uncontrolled', function: 'shock, obstacle' },
  Ansuz: { type: 'revelation', movement: 'active', tempo: 'fast', control: 'controlled', function: 'message, clarity' },
  Raidho: { type: 'transition', movement: 'progressive', tempo: 'slow', control: 'controlled', function: 'direction, path' },
  Kenaz: { type: 'revelation', movement: 'active', tempo: 'fast', control: 'controlled', function: 'clarity' },
  Gebo: { type: 'stabilization', movement: 'passive', tempo: 'slow', control: 'semi-controlled', function: 'exchange' },
  Wunjo: { type: 'stabilization', movement: 'passive', tempo: 'slow', control: 'semi-controlled', function: 'alignment' },
  Hagalaz: { type: 'rupture', movement: 'brutal', tempo: 'immediate', control: 'uncontrolled', function: 'collapse' },
  Nauthiz: { type: 'contraction', movement: 'blocked', tempo: 'slow', control: 'uncontrolled', function: 'constraint' },
  Isa: { type: 'contraction', movement: 'blocked', tempo: 'slow', control: 'uncontrolled', function: 'freeze' },
  Jera: { type: 'transition', movement: 'progressive', tempo: 'cyclical', control: 'uncontrolled', function: 'cycle' },
  Eihwaz: { type: 'stabilization', movement: 'passive', tempo: 'slow', control: 'controlled', function: 'endurance' },
  Perthro: { type: 'revelation', movement: 'latent', tempo: 'delayed', control: 'uncontrolled', function: 'hidden factor' },
  Algiz: { type: 'stabilization', movement: 'passive', tempo: 'immediate', control: 'semi-controlled', function: 'protection' },
  Sowilo: { type: 'expansion', movement: 'active', tempo: 'fast', control: 'controlled', function: 'success' },
  Tiwaz: { type: 'transition', movement: 'active', tempo: 'fast', control: 'controlled', function: 'decision' },
  Berkano: { type: 'expansion', movement: 'progressive', tempo: 'slow', control: 'controlled', function: 'growth' },
  Ehwaz: { type: 'transition', movement: 'active', tempo: 'fast', control: 'semi-controlled', function: 'movement' },
  Mannaz: { type: 'revelation', movement: 'active', tempo: 'fast', control: 'controlled', function: 'self-awareness' },
  Laguz: { type: 'transition', movement: 'passive', tempo: 'slow', control: 'uncontrolled', function: 'flow' },
  Ingwaz: { type: 'stabilization', movement: 'latent', tempo: 'slow', control: 'uncontrolled', function: 'maturation' },
  Dagaz: { type: 'transition', movement: 'active', tempo: 'immediate', control: 'uncontrolled', function: 'shift' },
  Othala: { type: 'stabilization', movement: 'passive', tempo: 'slow', control: 'controlled', function: 'foundation' }
};

const STYLE_REFERENCE = [
  "Va vers des formulations simples et nettes.",
  "Parle du noeud reel de la situation, pas du symbolisme.",
  "Choisis des mots simples et concrets plutot que des mots abstraits ou trop analytiques.",
  "Nomme la tension entre deux mouvements quand elle existe.",
  "Fais sentir la réserve utile, ce qui insiste, ou ce qui reste entre deux.",
  "Ecris comme si la personne etait en face de toi.",
  "Evite les formulations demonstratives ou professorales.",
  "Evite de conclure trop fort : ouvre sans fermer.",
  "Quand une personne precise est nommee dans la question, tu peux la mentionner sobrement si cela clarifie vraiment l'enjeu.",
  "N'invente jamais une profondeur ou une essence qui ne tient pas dans les appuis runiques contrôlés."
].join(' ');

const STAGE_STYLE_NOTES = {
  summary:
    "Pour la synthese : reponds d'abord, comme en consultation. Prends position quand c'est possible. Si c'est non, dis-le. Si c'est partiel, dis-le clairement. Fais 3 temps courts : 1) reponse directe, 2) ce qui va reellement se passer, 3) le point qui change tout. Trois phrases suffisent. Ne raconte pas le tirage. Ne fais pas une mini lecture approfondie. L’analyse runique garde toujours la main : le ton ne doit jamais la contredire. Après l’analyse et avant la réponse, traduis toujours la dynamique en situation vécue : à quoi cela ressemble concrètement, ce que la personne vivra vraiment, et ce qui se passera si rien ne change.",
  teaser:
    "Pour le teaser : touche juste sans tout livrer. N'etends pas simplement le gratuit. Ajoute ce qui complique vraiment la premiere reponse, avec une voix naturelle, puis arrete-toi la. L’analyse runique reste prioritaire : le ton suit le mouvement, il ne le réécrit pas. Fais sentir la situation vécue, pas une idée abstraite du tirage.",
  full:
    "Pour la lecture complete : garde une voix plus posee et plus pleine, mais reste directe. Prends clairement position selon la force du tirage : plus direct si le blocage est fort, plus nuance si la situation est ouverte, plus net si la personne est dans la confusion. Pars de la question concrete. Dis ce qui soutient la premiere reponse, ce qui la fragilise, et ce qui pourrait la faire evoluer. Va avec des phrases courtes a moyennes. Une idee forte par phrase. Glisse au moins une phrase simple et marquante. Suggere plutot que d'expliquer. Evite les accumulations en 'entre... et...'. Reste dans le reel et dans le detail juste. N'étire pas le gratuit : apporte le noeud et ce qui le tient. L’analyse runique est prioritaire : le ton ne sert qu’à exprimer la dynamique détectée, jamais à la corriger. Avant d’écrire, traduis mentalement le tirage en vécu réel : ce que cela donne dans les faits, ce que la personne va constater, et ce qui arrivera si rien ne bouge."
};

const KNOWLEDGE_HIERARCHY_NOTE_FR = [
  "Hiérarchie absolue : 1) le tirage décide, 2) la question oriente, 3) la culture générale aide seulement à contextualiser le sujet, le registre et les enjeux réalistes.",
  "La culture générale peut aider à comprendre s'il s'agit d'argent, de voyage, de relation, de délai, de dossier ou de projet, mais elle ne tranche jamais à la place du tirage.",
  "Ne fais jamais comme si tu savais un fait réel, une issue vérifiable, un délai exact, un prix réel ou une vérité du monde. Si une phrase semble venir d'un savoir externe plutôt que du tirage, réécris-la.",
  "Les runes décident. La culture générale sert seulement à mieux formuler et à éviter des maladresses."
].join(' ');

const KNOWLEDGE_HIERARCHY_NOTE_EN = [
  "Absolute hierarchy: 1) the spread decides, 2) the question guides, 3) general knowledge only helps with context, topic recognition and realistic wording.",
  "General knowledge may help identify whether the topic is money, travel, relationship, timing, paperwork or projects, but it must never decide the outcome instead of the spread.",
  "Never act as if you know a real-world fact, a verifiable outcome, an exact delay, a real price or an external truth. If a sentence sounds driven by outside knowledge rather than the spread, rewrite it.",
  "The runes decide. General knowledge only helps you phrase the reading more clearly."
].join(' ');

const buildControlledRuneNotes = (runes) =>
  runes
    .map((rune) => {
      const label = rune?.positionLabel || '';
      const keywords =
        (Array.isArray(rune?.positionKeywords) && rune.positionKeywords.length
          ? rune.positionKeywords
          : rune?.positionProfile?.allowedKeywords) || [];

      if (!label || !keywords.length) {
        return '';
      }

      const orientation = rune?.isReversed ? 'renversée' : 'droite';
      return `${label} (${orientation}) : ${keywords.slice(0, 3).join(', ')}`;
    })
    .filter(Boolean)
    .join(' | ');

const formatRuneAnalysisLabelFr = (rune, role, metadata = {}) => {
  if (!rune?.nom) {
    return role === 'dominant' ? 'aucune dominante nette' : 'aucune limite nette';
  }

  const parts = [
    rune.nom,
    metadata.type,
    metadata.movement,
    metadata.tempo,
    metadata.control
  ].filter(Boolean);

  return parts.join(' / ');
};

const formatRuneAnalysisLabelEn = (rune, role, metadata = {}) => {
  if (!rune?.nom) {
    return role === 'dominant' ? 'no clear dominant rune' : 'no clear limiting rune';
  }

  const parts = [
    rune.nom,
    metadata.type,
    metadata.movement,
    metadata.tempo,
    metadata.control
  ].filter(Boolean);

  return parts.join(' / ');
};

const buildDynamicExpressionNoteFr = (dynamic = 'instability') => {
  if (dynamic === 'blockage') {
    return "Expression attendue : plus directe, phrases plus courtes, peu de projection. N’adoucis pas le blocage si l’analyse montre qu’il est réel.";
  }

  if (dynamic === 'progression') {
    return "Expression attendue : plus allant, légèrement ouverte, mais toujours ancrée. N’ajoute pas de prudence artificielle si le mouvement va vraiment dans le bon sens.";
  }

  if (dynamic === 'delay') {
    return "Expression attendue : fais sentir le temps, le retard ou le passage lent. Pas de fausse urgence, pas de promesse prématurée.";
  }

  return "Expression attendue : fais sentir l’irrégularité, les avancées qui ne tiennent pas encore, ou les retours en arrière. Évite les phrases définitives.";
};

const buildDynamicExpressionNoteEn = (dynamic = 'instability') => {
  if (dynamic === 'blockage') {
    return 'Expected expression: more direct, shorter sentences, less projection. Do not soften the blockage if the analysis shows it is real.';
  }

  if (dynamic === 'progression') {
    return 'Expected expression: more forward, slightly open, but still grounded. Do not add artificial caution if the movement is genuinely going the right way.';
  }

  if (dynamic === 'delay') {
    return 'Expected expression: make time, delay or slower follow-through felt. No false urgency and no premature promise.';
  }

  return 'Expected expression: reflect inconsistency, movement that does not hold yet, or back-and-forth. Avoid definitive statements.';
};

const REAL_LIFE_TRANSLATION_NOTE_FR =
  "Traduction obligatoire en vécu réel : après l’analyse, demande-toi toujours à quoi cela ressemble dans la vie concrète. Ne dis pas seulement 'il y a un blocage' : montre ce que la personne vit, voit ou répète réellement. Demande-toi aussi ce qui se passera si rien ne change.";

const REAL_LIFE_TRANSLATION_NOTE_EN =
  'Mandatory real-life translation: after the analysis, always ask what this looks like in lived reality. Do not just say there is a blockage or progression: show what the person would actually live through, notice or keep running into. Also ask what happens if nothing changes.';

const NON_INTERCHANGEABLE_PAID_NOTE_FR =
  "Règle absolue pour le payant : inclus au moins une situation concrète de la vie réelle qui ne puisse pas s’appliquer à plusieurs contextes. Elle doit décrire soit un comportement précis, soit une réaction précise, soit une conséquence précise. Si cette phrase pourrait marcher aussi bien pour une autre situation, réécris-la.";

const NON_INTERCHANGEABLE_PAID_NOTE_EN =
  'Absolute rule for the paid layer: include at least one concrete real-world situation that cannot fit multiple contexts. It must describe either a specific behaviour, a specific reaction, or a specific consequence. If the line could work just as well for another situation, rewrite it.';

const REAL_SCENE_ENFORCEMENT_NOTE_FR =
  "Règle de scène réelle : dans le payant, au moins une phrase doit décrire une scène visualisable, presque filmable. Elle doit montrer une petite suite d’actions, quelque chose que la personne fait ou observe vraiment, étape par étape. Si la phrase ne peut pas être visualisée concrètement, réécris-la.";

const REAL_SCENE_ENFORCEMENT_NOTE_EN =
  'Real-scene rule: in the paid layer, at least one sentence must describe a scene that can be visualized, almost filmed. It must show a short sequence of actions, something the person actually does or observes step by step. If the line cannot be visualized concretely, rewrite it.';

const RUNE_TO_SCENE_BINDING_NOTE_FR =
  "La scène concrète doit être déduite du mouvement runique, pas seulement du domaine. Si la rune limitante bloque (Isa, Nauthiz), montre l’arrêt, le silence ou l’absence de réponse. Si elle rompt (Thurisaz, Hagalaz), montre une coupure, une annulation, une disparition ou un arrêt brutal. Si la dynamique est dans le délai (Jera, Ingwaz), montre une avancée lente ou des confirmations tardives. Si la dynamique est instable, montre l’irrégularité. Si la dominante pousse à l’action (Tiwaz, Raidho, Uruz), montre ce que la personne fait, pousse, ajuste ou relance. Si la dominante éclaire (Ansuz, Kenaz), montre comment une clarification change les retours. Si la même scène pourrait convenir à d’autres runes, elle doit être réécrite.";

const RUNE_TO_SCENE_BINDING_NOTE_EN =
  'The real-life scene must come from the rune movement, not just the domain. If the limiting rune blocks (Isa, Nauthiz), show stagnation, silence or no reply. If it ruptures (Thurisaz, Hagalaz), show interruption, cancellation, disappearance or an abrupt stop. If the dynamic is delay (Jera, Ingwaz), show slow progression or late confirmation. If the dynamic is instability, show inconsistency. If the dominant rune is active (Tiwaz, Raidho, Uruz), show what the person actively pushes, adjusts or follows up on. If the dominant rune is revelation (Ansuz, Kenaz), show how clarity changes the response. If the same scene could fit different runes, rewrite it.';

const DOMINANCE_RESTITUTION_NOTE_FR =
  "Contrainte de dominance : la réponse doit choisir un axe principal et s’y tenir. Elle ne doit pas faire une moyenne entre plusieurs interprétations possibles. Si plusieurs éléments coexistent, elle doit dire ce qui domine réellement dans la situation. Si la réponse ressemble à 'oui et non', elle doit être réécrite.";

const DOMINANCE_RESTITUTION_NOTE_EN =
  'Dominance rule: the answer must choose one main axis and stick to it. It must not average several possible readings together. If several elements coexist, it must say what truly dominates the situation. If the answer sounds like yes and no at once, rewrite it.';

const DOMINANCE_AS_SCENE_NOTE_FR =
  "Contrainte complémentaire : la dominance ne doit jamais être formulée comme une analyse. N’écris pas 'le vrai sujet, c’est', 'ce qui domine, c’est' ou 'le problème, c’est'. Montre la dominance par une scène réelle, un comportement, une suite d’actions ou un vécu concret. Si la phrase peut être comprise sans imaginer une situation réelle, elle doit être réécrite.";

const DOMINANCE_AS_SCENE_NOTE_EN =
  "Extra dominance rule: never phrase dominance as analysis. Do not write 'the real issue is', 'what dominates is' or 'the problem is'. Show dominance through a real scene, a behaviour, a sequence of actions or a lived situation. If the line can be understood without imagining a real situation, rewrite it.";

const IDENTIFIABLE_SCENE_NOTE_FR =
  "La scène doit être spécifique et identifiable immédiatement. Évite les phrases générales, même concrètes. Elle doit contenir une action précise, un moment identifiable et un comportement observable. Si la personne ne peut pas se dire 'oui, ça m’est arrivé exactement comme ça', la phrase doit être réécrite.";

const IDENTIFIABLE_SCENE_NOTE_EN =
  "The scene must be specific and immediately identifiable. Avoid general sentences, even concrete ones. It must contain a precise action, an identifiable moment and an observable behaviour. If the person cannot say 'yes, that happened to me exactly like that', rewrite the line.";

const LEXICAL_VARIATION_NOTE_FR =
  "Variation lexicale : évite de répéter trop souvent 'quelque chose', 'la suite', 'pas encore', 'plus net', 'prendre forme', 'se stabiliser', 'clarification'. Varie avec des mots plus situés : retour, choix, réponse, décision, geste, échange, cadre, limite, proposition, parole posée, réservation, validation, relance, confirmation.";

const LEXICAL_VARIATION_NOTE_EN =
  "Lexical variation: avoid repeating 'something', 'what comes next', 'not yet', 'clearer', 'take shape', 'stabilize', 'clarify'. Vary with more situated words such as return, choice, answer, decision, gesture, exchange, frame, limit, proposal, stated word, booking, validation, follow-up and confirmation.";

const buildContextualRealLifeNoteFr = (question = '') => {
  const topic = detectQuestionTopic(question);
  const workSubtype = detectWorkSubtype(question);
  const adminSubtype = detectAdminSubtype(question);

  if (topic === 'work' && workSubtype !== 'finance') {
    return "La traduction concrète doit rester dans le champ pro : parle de clients, offres, ventes, demandes, prises de contact, retours, intérêt sans suite, visibilité, achat, conversion ou régularité. Varie les formulations : n’utilise pas toujours les mêmes mots comme clients ou conversion. Interdit : phrases vécues génériques qui pourraient marcher pour une relation ou un dossier.";
  }

  if (topic === 'work' && workSubtype === 'finance') {
    return "La traduction concrète doit rester dans le champ financier : parle de rentrées, dépenses, marge, retard d’argent, pression matérielle, souffle retrouvé ou non. Interdit : phrases générales qui pourraient s’appliquer à n’importe quelle situation.";
  }

  if (topic === 'relationship') {
    return "La traduction concrète doit rester dans le champ relationnel : parle d’échanges, distance, silence, comportements incohérents, présence irrégulière, échanges sans suite, reprise de contact, présence, absence, malaise, rapprochement ou flou dans le lien. Varie les formulations : n’utilise pas toujours silence ou distance. Interdit : phrases vagues ou transposables à un projet ou à l’argent.";
  }

  if (topic === 'admin' || adminSubtype === 'benefit' || adminSubtype === 'legal') {
    return "La traduction concrète doit rester dans le champ administratif ou juridique : parle de délais, réponses, relances, validation, dossier, pièce manquante, blocage externe, retour attendu, attente qui dure, demande qui n’aboutit pas, étape qui traîne. Varie les formulations à l’intérieur de ce terrain. Interdit : phrases vécues génériques.";
  }

  if (topic === 'price') {
    return "La traduction concrète doit rester liée au prix, à l’achat ou au compromis concret : parle de tarif, marge, budget, remise, achat repoussé, condition trop serrée, offre trop haute, compromis de prix. Varie les formulations à l’intérieur de ce terrain. Interdit : phrases générales qui pourraient convenir à tout.";
  }

  return "La traduction concrète doit reprendre la situation exacte posée par la question. Utilise le terrain réel de la personne, pas un schéma général qui pourrait convenir à n’importe qui.";
};

const buildContextualRealLifeNoteEn = (question = '') => {
  const topic = detectQuestionTopic(question);
  const workSubtype = detectWorkSubtype(question);
  const adminSubtype = detectAdminSubtype(question);

  if (topic === 'work' && workSubtype !== 'finance') {
    return 'The real-life translation must stay in the business field: talk about clients, offers, sales, incoming requests, first contact, replies, interest that goes nowhere, visibility, buying decisions, conversion or consistency. Vary the wording inside this field instead of repeating clients or conversion every time. Forbidden: generic lived examples that could fit a relationship or paperwork question.';
  }

  if (topic === 'work' && workSubtype === 'finance') {
    return 'The real-life translation must stay in the money field: talk about income, expenses, margin, delayed money, material pressure, breathing room or the lack of it. Forbidden: broad lines that could apply anywhere.';
  }

  if (topic === 'relationship') {
    return 'The real-life translation must stay in the relationship field: talk about exchanges, distance, silence, inconsistent behaviour, irregular presence, contact with no follow-through, renewed contact, presence, absence, unease, closeness or confusion in the bond. Vary the wording inside this field instead of repeating silence or distance every time. Forbidden: vague lines that could be reused for work or money.';
  }

  if (topic === 'admin' || adminSubtype === 'benefit' || adminSubtype === 'legal') {
    return 'The real-life translation must stay in the administrative or legal field: talk about delays, answers, follow-ups, validation, paperwork, missing pieces, outside blockage, waiting on a reply, a request that does not go through, or a step that drags on. Vary the wording inside this field. Forbidden: generic lived examples.';
  }

  if (topic === 'price') {
    return 'The real-life translation must stay tied to price, buying conditions or compromise: talk about budget, price range, discount, delayed purchase, an offer that stays too high, or conditions that remain too tight. Vary the wording inside this field. Forbidden: generic lines that could fit any situation.';
  }

  return 'The real-life translation must reuse the exact field of the question. Use the person’s actual ground, not a broad pattern that could fit anyone.';
};

const buildDominantOutcomeLabelFr = (decision = null) => {
  const topic = decision?.topic || 'generic';
  const subtype = decision?.subtype || 'generic';
  const tone = decision?.global_tone || 'mitige';
  const dynamic = decision?.rune_dynamics?.dynamic || 'instability';

  if (topic === 'work' && subtype === 'sessions') {
    if (dynamic === 'delay') return 'une conversion tardive plutôt qu’une absence d’intérêt';
    if (dynamic === 'instability') return 'une irrégularité des réservations plus qu’un vrai remplissage stable';
    if (tone === 'porteur') return 'un remplissage en train de se construire, mais pas encore fixé';
    return 'de l’intérêt qui ne se transforme pas encore assez vite en séances posées';
  }

  if (topic === 'work') {
    if (dynamic === 'delay') return 'un passage lent entre intérêt et engagement réel';
    if (dynamic === 'instability') return 'une traction irrégulière plus qu’un mouvement installé';
    return 'de l’intérêt partiel qui ne convertit pas encore assez clairement';
  }

  if (topic === 'relationship') {
    if (dynamic === 'delay') return 'un lien qui avance lentement plus qu’un vrai retour franc';
    if (dynamic === 'instability') return 'une présence irrégulière plus qu’un engagement net';
    return 'un lien réel, mais pas encore assez stable';
  }

  if (topic === 'admin') {
    if (dynamic === 'delay') return 'un dossier retenu surtout par le délai et les étapes';
    if (dynamic === 'blockage') return 'un blocage concret qui empêche encore l’avancée';
    return 'une reprise lente, suspendue à un retour ou à une validation';
  }

  if (tone === 'porteur') return 'une ouverture réelle qui peut être assumée';
  if (dynamic === 'delay') return 'un mouvement retardé plus qu’un refus définitif';
  if (dynamic === 'blockage') return 'un frein réel qui domine la situation';
  return 'le mouvement dominant, pas les éléments secondaires';
};

const buildDominantOutcomeLabelEn = (decision = null) => {
  const topic = decision?.topic || 'generic';
  const subtype = decision?.subtype || 'generic';
  const tone = decision?.global_tone || 'mixed';
  const dynamic = decision?.rune_dynamics?.dynamic || 'instability';

  if (topic === 'work' && subtype === 'sessions') {
    if (dynamic === 'delay') return 'late conversion rather than no interest';
    if (dynamic === 'instability') return 'irregular bookings rather than stable fill';
    if (tone === 'porteur') return 'bookings building up, but not fully fixed yet';
    return 'interest that still does not turn quickly enough into booked sessions';
  }

  if (topic === 'work') {
    if (dynamic === 'delay') return 'a slow move from interest to real commitment';
    if (dynamic === 'instability') return 'uneven traction rather than a settled movement';
    return 'partial interest that still does not convert clearly enough';
  }

  if (topic === 'relationship') {
    if (dynamic === 'delay') return 'a bond moving slowly rather than a clear return';
    if (dynamic === 'instability') return 'irregular presence rather than clear commitment';
    return 'a real bond, but not stable enough yet';
  }

  if (topic === 'admin') {
    if (dynamic === 'delay') return 'a case held back mainly by delay and process';
    if (dynamic === 'blockage') return 'a concrete blockage that still prevents progress';
    return 'a slow restart that depends on a reply or validation';
  }

  if (tone === 'porteur') return 'a real opening that can be assumed';
  if (dynamic === 'delay') return 'a delayed movement rather than a final no';
  if (dynamic === 'blockage') return 'a real brake that dominates the situation';
  return 'the dominant movement, not the secondary elements';
};

const buildSceneDomainFragmentsFr = (question = '') => {
  const topic = detectQuestionTopic(question);
  const workSubtype = detectWorkSubtype(question);
  const adminSubtype = detectAdminSubtype(question);

  if (topic === 'work' && workSubtype === 'sessions') {
    return {
      progression: "tu annonces des créneaux en début de semaine, quelqu’un t’écrit, pose une question, puis revient confirmer et la séance se pose vraiment dans l’agenda",
      blockage: "tu ouvres des créneaux, tu réponds à deux ou trois messages, puis plus rien ne revient et aucune séance ne se pose dans les jours qui suivent",
      rupture: "quelqu’un demande un tarif ou un horaire, l’échange avance un peu, puis s’arrête net au moment où il faudrait vraiment réserver",
      delay: "une personne te contacte, demande des infos, puis revient plusieurs jours après pour confirmer, pas dans la foulée",
      instability: "tu poses une séance, puis plus rien pendant plusieurs jours, puis une nouvelle demande arrive sans que le rythme se stabilise",
      active: "tu renvoies un créneau, tu reformules ce que comprend la séance, tu relances, et c’est là que ça se décide ou non",
      revelation: "quand tu expliques plus clairement comment se passe la séance ou ce qu’elle apporte, les questions changent et les réservations deviennent plus directes"
    };
  }

  if (topic === 'work' && workSubtype === 'visibility') {
    return {
      progression: "tu publies un contenu, des personnes réagissent dans la journée, puis l’une d’elles t’écrit ensuite pour demander comment travailler avec toi",
      blockage: "tu publies, tu reçois quelques réactions ou compliments, puis aucun message ne va jusqu’à une vraie demande ou un rendez-vous posé",
      rupture: "une personne commente ou réagit, pose une question en privé, puis disparaît dès que l’échange devrait devenir concret",
      delay: "tu publies maintenant, puis les demandes sérieuses reviennent plusieurs jours après, pas dans l’élan du post",
      instability: "un post attire beaucoup d’attention, puis le suivant presque rien, puis un peu d’intérêt revient sans vraie continuité",
      active: "tu republies, tu reformules ton message, tu relances un contact, et c’est là que tu vois ce qui accroche vraiment",
      revelation: "quand tu dis plus clairement pour qui c’est et ce que ça change, les réactions cessent d’être vagues et deviennent plus ciblées"
    };
  }

  if (topic === 'work') {
    return {
      progression: "quelqu’un te demande ce que tu proposes, l’échange continue, puis la personne revient vers toi avec une vraie décision",
      blockage: "on regarde ton offre, on pose une question, puis rien n’avance vraiment jusqu’à un accord clair",
      rupture: "quelqu’un s’intéresse à ton offre, l’échange démarre, puis s’interrompt juste avant l’engagement réel",
      delay: "les retours utiles arrivent, mais souvent plusieurs jours après, et la décision met du temps à se poser",
      instability: "tu reçois deux bons retours, puis plus rien, puis un nouvel intérêt revient sans encore tenir dans le temps",
      active: "tu relances, tu ajustes ta façon de présenter l’offre, tu reformules ce que tu attends, et c’est là que ça bouge ou non",
      revelation: "quand tu rends l’offre plus lisible, les questions changent et les réactions deviennent plus franches"
    };
  }

  if (topic === 'relationship') {
    return {
      progression: "vous reparlez, les messages se suivent sur plusieurs jours, puis la présence devient plus régulière au lieu de retomber juste après",
      blockage: "tu envoies un message ou tu attends un retour, puis rien ne vient vraiment relancer le lien dans les jours qui suivent",
      rupture: "la personne revient parler, répond un moment, puis coupe net ou disparaît dès que la conversation devient plus concrète",
      delay: "le lien repart, mais avec des réponses qui arrivent bien plus tard que tu l’espères",
      instability: "vous vous rapprochez un peu pendant un moment, puis ça retombe, puis ça reprend encore sans vraie continuité",
      active: "tu poses une question plus franche, tu relances ou tu dis ce que tu veux vraiment, et c’est là que ça avance ou se ferme",
      revelation: "quand tu dis plus clairement ce que tu attends, la réponse en face change tout de suite de ton ou de rythme"
    };
  }

  if (topic === 'admin' || adminSubtype === 'benefit' || adminSubtype === 'legal') {
    return {
      progression: "tu attends, puis un mail, un courrier ou un appel finit par arriver et le dossier franchit enfin une vraie étape",
      blockage: "tu relances, tu regardes ton dossier, puis rien n’aboutit vraiment et tu restes plusieurs jours sans réponse claire",
      rupture: "une réponse semble arriver, puis tout s’arrête brusquement sur un refus, une coupure ou un silence qui retombe d’un coup",
      delay: "tu relances cette semaine, puis le retour ne tombe que bien plus tard, pas dans le délai que tu espérais",
      instability: "tu reçois un retour, puis plus rien, puis une nouvelle demande qui rallonge encore l’attente",
      active: "tu renvoies un document, tu rappelles, tu reprends un point précis, et c’est là que tu vois si ça repart ou non",
      revelation: "quand une pièce est enfin comprise correctement ou qu’un point est clarifié, la réponse repart différemment"
    };
  }

  if (topic === 'price') {
    return {
      progression: "tu compares plusieurs options, puis un tarif ou une formule devient enfin assez clair pour que l’achat se fasse vraiment",
      blockage: "tu regardes le prix, tu refais les calculs, puis rien ne devient assez simple pour acheter maintenant",
      rupture: "tu es presque prêt à accepter le tarif, puis quelque chose coupe net la décision au dernier moment",
      delay: "tu reviens voir l’offre plus tard, parce que le bon moment ou le bon prix n’arrive pas dans l’immédiat",
      instability: "tu te rapproches de la décision, puis tu repousses encore, puis tu reviens dessus sans stabiliser ton choix",
      active: "tu renégocies, tu recalcules, tu revois tes priorités, et c’est là que la décision se fait ou se défait",
      revelation: "quand tu vois plus clairement ce que ce prix t’engage vraiment à faire, ton choix change"
    };
  }

  return {
    progression: "tu lances quelque chose, puis un retour concret arrive enfin et la suite prend une forme plus claire",
    blockage: "tu fais une démarche ou tu attends un retour, puis rien ne répond vraiment dans l’immédiat",
    rupture: "quelque chose commence, puis s’arrête brusquement juste avant d’aboutir",
    delay: "tu bouges maintenant, puis les retours ne reviennent que plus tard, pas tout de suite",
    instability: "ça repart un peu, puis ça retombe, puis ça recommence sans encore tenir",
    active: "tu ajustes, tu relances ou tu reformules, et c’est là que la suite se décide ou non",
    revelation: "le tournant se voit au moment où tu comprends enfin ce qui fait réagir autrement"
  };
};

const buildNonInterchangeableSceneFr = (question = '', decision = null) => {
  const fragments = buildSceneDomainFragmentsFr(question);
  const dynamics = decision?.rune_dynamics || {};
  const limitingRune = dynamics.limiting_rune || '';
  const dominantRune = dynamics.dominant_rune || '';
  const dynamic = dynamics.dynamic || 'instability';

  let scene = fragments.instability;

  if (['Isa', 'Nauthiz'].includes(limitingRune)) {
    scene = fragments.blockage;
  } else if (['Thurisaz', 'Hagalaz'].includes(limitingRune)) {
    scene = fragments.rupture;
  } else if (['Jera', 'Ingwaz'].includes(limitingRune) || dynamic === 'delay') {
    scene = fragments.delay;
  } else if (dynamic === 'progression') {
    scene = fragments.progression;
  } else if (dynamic === 'blockage') {
    scene = fragments.blockage;
  }

  if (dynamic === 'instability' && !['Isa', 'Nauthiz', 'Thurisaz', 'Hagalaz', 'Jera', 'Ingwaz'].includes(limitingRune)) {
    scene = fragments.instability;
  }

  let extension = '';
  if (['Tiwaz', 'Raidho', 'Uruz', 'Ehwaz'].includes(dominantRune)) {
    extension = fragments.active;
  } else if (['Ansuz', 'Kenaz', 'Mannaz'].includes(dominantRune)) {
    extension = fragments.revelation;
  }

  return extension ? `${scene}. ${extension}.` : `${scene}.`;
};

const isPluralSituationFr = (subject = '') =>
  /^tes\s/i.test(String(subject || '').trim()) || /^les\s/i.test(String(subject || '').trim());

const TEMPORAL_READING_NOTE_FR =
  "Rôle temporel du tirage : le Passé montre une trace ou un contexte encore actif ; le Présent montre ce qui est réellement au cœur de la situation maintenant, sans être automatiquement négatif ; le Futur montre l'ouverture, la tendance ou le déplacement possible.";

const TEMPORAL_READING_NOTE_EN =
  "Temporal role of the spread: the Past shows a trace or background that is still active; the Present shows what is truly at the core of the situation now and is not automatically negative; the Future shows the opening, trend or possible shift.";

const buildSharedPromptContextFr = ({ question, runes, stage, theme = 'situation', decision = null }) => `Question utilisateur : ${question}
Thème déclaré : ${normalizeTheme(theme)}
Repère de thème : ${THEME_NOTES_FR[normalizeTheme(theme)]}
Contexte dominant : ${inferQuestionLens(question)}
Forme de la question : ${inferQuestionForm(question)}
Nature de la question : ${inferQuestionShape(question)}
Categorie de la question : ${detectQuestionCategory(question)}
Repere de ton : ${buildGroundingNote(question)}
Repere de lecture : ${buildFormNote(question)}
Repere de question : ${buildShapeNote(question)}
Repere d'ancrage : ${buildAnchorNote(question)}
${decision?.question_handling === 'soften' ? `Repere de prudence : sujet sensible. Reponds symboliquement, sans diagnostic ni promesse, et garde toute note de prudence pour la fin du texte, de facon douce.` : ''}
Repere de style : ${STYLE_REFERENCE}
Repere de hiérarchie : ${KNOWLEDGE_HIERARCHY_NOTE_FR}
Repere d'etape : ${STAGE_STYLE_NOTES[stage]}
Calibration par type : ${buildQuestionTypeCalibrationFr(question, stage)}
Calibration émotionnelle : ${buildEmotionalStateCalibrationFr(question, stage)}
Direction utile : ${buildExampleDirection(question)}
Repere temporel : ${TEMPORAL_READING_NOTE_FR}
Passé : ${runes[0]?.nom || ''}
Présent : ${runes[1]?.nom || ''}
Futur : ${runes[2]?.nom || ''}
Repères runiques contrôlés : ${buildControlledRuneNotes(runes) || 'non disponibles'}
Repères d’analyse runique : ${decision?.rune_dynamics?.dominant_signature_fr || 'dominante non calculée'} ; limite principale : ${decision?.rune_dynamics?.limiting_signature_fr || 'limite non calculée'} ; dynamique : ${decision?.rune_dynamics?.dynamic || 'instability'} ; mouvement réel : ${decision?.rune_dynamics?.real_movement_fr || 'non précisé'} ; illusion à éviter : ${decision?.rune_dynamics?.illusion_fr || 'non précisée'} ; ce qui retient : ${decision?.rune_dynamics?.holding_back_fr || 'non précisé'}.
Repère d’expression : ${buildDynamicExpressionNoteFr(decision?.rune_dynamics?.dynamic)}
Repère de traduction concrète : ${REAL_LIFE_TRANSLATION_NOTE_FR}
Repère de contexte concret : ${buildContextualRealLifeNoteFr(question)}
Repère rune → scène : ${RUNE_TO_SCENE_BINDING_NOTE_FR}
Repère de dominance : ${DOMINANCE_RESTITUTION_NOTE_FR}
Repère de dominance vécue : ${DOMINANCE_AS_SCENE_NOTE_FR}
Repère de scène identifiable : ${IDENTIFIABLE_SCENE_NOTE_FR}
Repère de variation lexicale : ${LEXICAL_VARIATION_NOTE_FR}
Vérification finale : si la réponse ne changerait pas avec d’autres runes, réécris-la. Le ton peut varier, pas le sens du tirage.
Consigne runique : utilise seulement ces appuis pour caractériser la lecture. N'invente pas d'autre vocabulaire symbolique. Ne projette pas de detail concret non soutenu.`;

const buildSharedPromptContextEn = ({ question, runes, stage, theme = 'situation', decision = null }) => `User question: ${question}
Declared theme: ${normalizeTheme(theme)}
Theme note: ${THEME_NOTES_EN[normalizeTheme(theme)]}
Dominant context: ${inferQuestionLens(question)}
Question form: ${inferQuestionForm(question)}
Question type: ${inferQuestionShape(question)}
Question category: ${detectQuestionCategory(question)}
Grounding note: ${buildGroundingNote(question)}
Reading note: ${buildFormNote(question)}
Question note: ${buildShapeNote(question)}
Concrete anchors: ${buildAnchorNote(question)}
${decision?.question_handling === 'soften' ? `Delivery caution: sensitive topic. Answer symbolically, without diagnosing or promising, and keep any cautionary note for the end of the text in a gentle way.` : ''}
Style note: ${STYLE_REFERENCE}
Hierarchy note: ${KNOWLEDGE_HIERARCHY_NOTE_EN}
Stage note: ${STAGE_STYLE_NOTES[stage]}
Question-type calibration: ${buildQuestionTypeCalibrationEn(question, stage)}
Emotional-state calibration: ${buildEmotionalStateCalibrationEn(question, stage)}
Useful direction: ${buildExampleDirection(question)}
Temporal note: ${TEMPORAL_READING_NOTE_EN}
Past: ${runes[0]?.nom || ''}
Present: ${runes[1]?.nom || ''}
Future: ${runes[2]?.nom || ''}
Controlled rune anchors: ${buildControlledRuneNotes(runes) || 'not available'}
Runic analysis anchors: ${decision?.rune_dynamics?.dominant_signature_en || 'dominant not computed'} ; main limit: ${decision?.rune_dynamics?.limiting_signature_en || 'limit not computed'} ; dynamic: ${decision?.rune_dynamics?.dynamic || 'instability'} ; real movement: ${decision?.rune_dynamics?.real_movement_en || 'not specified'} ; illusion to avoid: ${decision?.rune_dynamics?.illusion_en || 'not specified'} ; what holds it back: ${decision?.rune_dynamics?.holding_back_en || 'not specified'}.
Expression note: ${buildDynamicExpressionNoteEn(decision?.rune_dynamics?.dynamic)}
Real-life translation note: ${REAL_LIFE_TRANSLATION_NOTE_EN}
Concrete context note: ${buildContextualRealLifeNoteEn(question)}
Rune-to-scene note: ${RUNE_TO_SCENE_BINDING_NOTE_EN}
Dominance note: ${DOMINANCE_RESTITUTION_NOTE_EN}
Lived dominance note: ${DOMINANCE_AS_SCENE_NOTE_EN}
Identifiable scene note: ${IDENTIFIABLE_SCENE_NOTE_EN}
Lexical variation note: ${LEXICAL_VARIATION_NOTE_EN}
Final check: if the answer would stay the same with different runes, rewrite it. The tone may vary, but the meaning must stay tied to the spread.
Rune instruction: use only these anchors to characterize the reading. Do not invent extra symbolic vocabulary or unsupported practical detail.`;

const extractQuestionSubjectFr = (question) => {
  const trimmed = String(question || '').trim().replace(/\?+$/g, '');

  if (!trimmed) {
    return '';
  }

  return trimmed
    .replace(/^est[- ]?ce qu(?:e\s+|['’])/i, '')
    .replace(/^vais[- ]?je\s+/i, '')
    .replace(/^dois[- ]?je\s+/i, '')
    .replace(/^comment va evoluer\s+/i, '')
    .replace(/^comment va évoluer\s+/i, '')
    .replace(/^comment evoluera\s+/i, '')
    .replace(/^comment évoluera\s+/i, '')
    .replace(/^je vais\s+/i, '')
    .trim();
};

const adaptSubjectForReadingFr = (subject) =>
  String(subject || '')
    .replace(/\bje\b/gi, 'tu')
    .replace(/\bj[’']\b/gi, 'tu ')
    .replace(/\bmon\b/gi, 'ton')
    .replace(/\bma\b/gi, 'ta')
    .replace(/\bmes\b/gi, 'tes')
    .replace(/\bm[’']e\b/gi, 'te')
    .replace(/\bme\b/gi, 'te')
    .replace(/\bmoi\b/gi, 'toi')
    .trim();

const buildFreeSummaryLeadFr = (question) => {
  return ensureSentence("La situation n'est pas fermée, mais elle ne trouve pas encore de point d'appui vraiment stable");
};

export const SUMMARY_SYSTEM_PROMPT = `Tu es un praticien spécialisé en runes. Tu réponds comme en consultation réelle, à une personne que tu tutoies. Tu écris en français, dans un style simple, direct, vivant et crédible. Ton français doit être irréprochable : orthographe correcte, accents présents, syntaxe nette, ponctuation soignée. La première phrase doit répondre clairement à la question et prendre position quand la question l'appelle : oui, non, oui mais, non dans les conditions actuelles, pas pour l'instant, peu probable, limité, retardé, ou possible mais instable. Tu ne restes pas neutre quand une orientation nette est possible. Si la réponse est plutôt non, dis-le. Si elle est partielle, dis-le clairement. Tu choisis une lecture dominante et tu t’y tiens : tu ne fais pas de moyenne entre plusieurs pistes. Tu ne cites jamais les runes, tu ne les expliques jamais, et tu ne construis pas la réponse à partir d'elles. Tu restes serré : 3 phrases maximum si possible. La réponse doit servir de diagnostic utile : elle donne de la clarté, de la reconnaissance, et une tension réelle, mais elle n’explique pas encore tout le mécanisme. Elle doit suivre trois temps courts : 1) réponse directe, 2) ce qui est déjà là ou en train de se vivre concrètement, 3) ce qui bloque, limite ou laisse la situation incomplète. Glisse au moins une phrase simple et marquante. Pas de mini-analyse, pas de faux détails, pas de jargon spirituel, pas de vocabulaire abstrait inutile. N'utilise pas "il semble que", "une énergie", "ce qui se joue", "dynamique", "phase", "repositionnement", "mise au clair", "cela peut", ni une voix scolaire. N'écris pas pour paraître profond : écris pour être juste.`;
export const SUMMARY_SYSTEM_PROMPT_EN = `You are a rune practitioner. You answer as if the person were sitting in front of you. Write in natural, direct, credible English. Your English must be clean and idiomatic. The first sentence must answer the question clearly and take a stance when the question calls for it: yes, no, yes but, not yet, unlikely, limited, delayed, or possible but unstable. Do not stay neutral when the reading clearly leans one way. If the answer is mostly no, say so. If it is partial, make that plain. Never name the runes, never explain them, and never build the answer around them. Stay tight: 3 sentences if possible, 4 at most. The free answer must work as a useful diagnosis: clarity, recognition, and tension, without explaining the whole mechanism yet. Start with the answer, show what is already real in lived terms, then name what is still blocking, limiting or unresolved. Include at least one short, memorable line. No mini-analysis, no invented practical details, no spiritual jargon, no vague abstract wording. Do not use stiff or therapist-like language.`;
export const PROMPT_MANAGEMENT_KEYS = {
  free_summary: 'nornsight_free_summary',
  full_reading: 'nornsight_full_reading',
  reframe_reading: 'nornsight_reframe_reading'
};

export const buildSummaryUserPrompt = ({ question, runes, theme = 'situation', decision = null }) => `${buildSharedPromptContextFr({ question, runes, stage: 'summary', theme, decision })}

Écris une réponse gratuite nette, incarnée et immédiatement lisible. Elle doit sonner comme une vraie parole, pas comme un texte organisé. Cette couche doit ouvrir la situation sans déjà l’épuiser.

Structure obligatoire en 3 phrases courtes :
- phrase 1 = réponse directe
- phrase 2 = ce qui est déjà en place ou en train de se vivre, concrètement
- phrase 3 = ce qui limite, bloque ou laisse la situation incomplète, avec une ouverture partielle mais non résolue

Commence par répondre clairement à la question. Prends position si le tirage le permet. Si c'est plutôt non, dis-le. Si c'est partiel, dis-le clairement.

Reste à 3 phrases si possible. Si la question est fermée ou prédictive, la première phrase doit dire clairement si cela paraît oui, non, oui mais, non dans les conditions actuelles, pas pour l’instant, peu probable, limité, retardé, ou possible mais instable. Adapte l’intensité : plus direct si le blocage est fort, plus nuancé si la situation est ouverte, plus clarifiant si la personne est dans la confusion. Parle de la situation vécue, pas du tirage. Sois concret : comportements, délais, tensions, retours, ralentissements, avance réelle. Ne donne pas plusieurs issues en parallèle. Choisis ce qui domine réellement dans la situation et fais reposer la réponse dessus, mais montre-le par du vécu concret, jamais par une formule analytique. Si la réponse peut se résumer à “oui et non”, réécris-la. Ne résous pas encore le mécanisme complet. Ne cite jamais les runes. N'invente pas de détails pratiques, administratifs, financiers ou organisationnels si la question ne les nomme pas clairement. N'utilise jamais : "cela dépend", "cela dépendra", "une dynamique semble", "il pourrait", "il pourrait y avoir", "cette énergie", "ce qui se joue", "structure", "il semble que", "cela peut", "le vrai sujet, c’est", "ce qui domine, c’est", "le problème, c’est".`;

export const TEASER_SYSTEM_PROMPT = `Tu es un praticien spécialisé en runes. Tu écris en français, dans un style naturel, simple, précis et parlé. Ton français doit être irréprochable : orthographe correcte, accents présents, syntaxe nette, ponctuation soignée. Tu écris un teaser de lecture approfondie qui ne répète pas le gratuit. Il doit révéler la pièce manquante : ce que la première réponse ne montre pas encore assez, là où la bascule se décide vraiment, sans déjà livrer toute la matière du payant. Il doit créer un manque clair, pas prolonger simplement la première réponse. Tu ne cites pas les runes. Tu évites les phrases commerciales, les métaphores floues, les détails plaqués et les formulations mécaniques. Tu écris 2 à 3 phrases, entre 50 et 95 mots. N'emploie pas de pseudo-profondeur ni d'image rhétorique gratuite. N'utilise pas "ce qui se joue", "une énergie", "dynamique", "cela peut" ni "il semble que". Ne formule jamais la dominance comme une analyse. N’écris pas : "ce qui domine", "le vrai sujet", "le problème", "ce qui compte le plus". Montre-la par une action, une scène, une réaction, une attente ou un comportement observable.`;
export const TEASER_SYSTEM_PROMPT_EN = `You are a rune practitioner. You write in natural, simple, precise spoken English. Your English must be clean and idiomatic. You write a teaser for the deeper reading that does not repeat the free reading. It must reveal the missing piece: what the first answer has not yet shown clearly enough, and where the real shift actually happens, without already giving away the paid reading. Do not name the runes. Avoid salesy lines, vague metaphors, bolted-on details and mechanical wording. Write 2 to 3 sentences, between 50 and 85 words. It should sound like a real voice, not a polished marketing paragraph.`;

export const buildTeaserUserPrompt = ({ question, runes, theme = 'situation', decision = null }) => `${buildSharedPromptContextFr({ question, runes, stage: 'teaser', theme, decision })}

Écris un teaser précis, vivant et nuancé, qui donne envie d’aller plus loin sans déjà livrer la lecture complète. N'allonge pas le gratuit : apporte la pièce manquante. Fais apparaître ce qui empêche réellement la situation de basculer, ce qui n’est pas encore vraiment vu, et là où la lecture approfondie va trancher plus nettement. Parle de la situation concrète et de son vrai nœud, avec une voix naturelle, comme si tu poursuivais la réponse à l’oral. Ne donne pas encore la solution.`;

export const FULL_READING_SYSTEM_PROMPT = `Tu es un praticien spécialisé en runes. Tu écris en français, dans un style humain, simple, précis et fluide. Ton français doit être propre. Tu proposes une lecture approfondie payante : plus précise que le gratuit, mais sans consultation complète. Tu réponds comme si la personne était en face de toi : direct, nuancé, sans ton scolaire. Tu ne cites jamais les runes et tu n'expliques jamais le tirage rune par rune. Tu entres directement dans la matière. Pas de formule d'ouverture automatique. Pas de jargon symbolique, pas de faux détail, pas de coaching générique. Tu suis la décision interne déjà fournie. La lecture doit s’organiser autour d’un axe principal visible : ce qui se passe vraiment, ce qui bloque la bascule, ce qui se produit si rien ne change, puis ce qui change si un ajustement est fait. Tu ne fais pas une moyenne entre plusieurs lectures possibles. Tu choisis le mouvement dominant et tu t’y tiens. La lecture doit apporter une vraie résolution : elle clarifie le mécanisme, retire l’ambiguïté, montre ce qui est solide, ce qui bloque vraiment, ce qui doit bouger, ce qui se passera si cela bouge, et ce qui se passera si rien ne change. Une idée utile par phrase. N'utilise pas "ce qui se joue", "une énergie", "dynamique", "structure", "cela peut" ni "il semble que". Ne transforme jamais la lecture en plan visible ni en suite de rubriques répétitives. Ne formule jamais la dominance comme une analyse. N’écris pas : "ce qui domine", "le vrai sujet", "le problème", "ce qui compte le plus". Montre-la par une action, une scène, une réaction, une attente ou un comportement observable.`;
export const FULL_READING_SYSTEM_PROMPT_EN = `You are a rune practitioner. You write in clean, precise, natural English. You write a paid deeper reading: more precise than the free one, but not a full consultation. Answer as if the person were in front of you: direct, nuanced, never stiff. Never name the runes and never explain the spread rune by rune. Enter the subject straight away. No automatic opening formula. No symbolic jargon, invented practical detail, generic coaching or flattery. Follow the provided internal decision. The paid reading must bring real resolution: clarify the mechanism, remove ambiguity, show what is solid, what truly blocks, what has to change, what happens if it shifts, and what happens if it does not. One useful idea per sentence. The reading must feel adapted to the question, not assembled from the same pattern every time. It must include at least one concrete real-world situation that cannot be reused in another context.`;

export const buildFullReadingUserPrompt = ({ question, runes, theme = 'situation', decision = null }) => `${buildSharedPromptContextFr({ question, runes, stage: 'full', theme, decision })}
${buildSituationReadingGuideFr(question)}

Écris une lecture plus profonde sans titres ni découpage fixe visible. Cette couche doit résoudre ce que le gratuit et le teaser ont seulement ouvert.

Choisis librement une forme adaptée à la question :
- réponse directe en 1 à 2 paragraphes serrés si la situation est simple ou tranchée
- réponse progressive si la situation s’éclaire par étapes
- réponse conditionnelle si tout tient à un point précis
- réponse plus ouverte si la suite reste mobile mais lisible

Adapte aussi la longueur :
- question simple = réponse plus courte
- question complexe = réponse plus développée
- question chargée émotionnellement = réponse plus incarnée

La lecture doit couvrir toute la mécanique, mais sans l’afficher comme un plan :
- ce qui est réellement en train de se passer, en version concrète
- ce qui domine vraiment dans la situation
- ce qui bloque réellement la bascule
- ce qui se passe si rien ne change
- ce qui change si un ajustement est fait

Varie l’attaque de la réponse. Ne commence pas toujours par la même tournure. Relie toujours ce que montre le tirage à la situation réelle et à sa conséquence concrète. Si la tonalité est favorable, assume-la clairement ; un ajustement simple doit rester secondaire. Cette fois, retire l’ambiguïté : la lecture payante doit faire sentir un relâchement, une compréhension plus nette, quelque chose qui se ferme ou se confirme enfin. Choisis un axe principal visible et tiens-le jusqu’au bout. Si plusieurs éléments coexistent, montre lequel domine réellement par une scène ou un vécu concret, jamais par une formule analytique. La scène doit être immédiatement identifiable : une action précise, un moment identifiable, un comportement observable. Si la réponse ressemble à une moyenne, réécris-la. ${NON_INTERCHANGEABLE_PAID_NOTE_FR} ${REAL_SCENE_ENFORCEMENT_NOTE_FR} ${RUNE_TO_SCENE_BINDING_NOTE_FR} ${DOMINANCE_RESTITUTION_NOTE_FR} ${DOMINANCE_AS_SCENE_NOTE_FR} ${IDENTIFIABLE_SCENE_NOTE_FR} La forme doit rester naturelle : pas de ton de fiche, pas de commentaire scolaire, pas de phrases qui sonnent écrites pour faire bien.`;

export const buildSummaryUserPromptEn = ({ question, runes, theme = 'situation', decision = null }) => `${buildSharedPromptContextEn({ question, runes, stage: 'summary', theme, decision })}

Write a free summary that feels serious, human and immediately readable, without naming the runes and without paraphrasing the question word for word. This layer must work as diagnosis plus tension, not full explanation.

Start by answering the question clearly. Take a stance if the reading allows it. Then show what is already real in lived terms. End on what is still blocked, missing or not fully settled yet.

Stay anchored in the real situation. If the question is closed or predictive, make the first sentence show which way it leans while keeping a credible nuance. Adjust the intensity to the case: more direct if the blockage is strong, more nuanced if the situation is open, clearer and firmer if the person is confused. Include at least one short, memorable line. Do not invent practical, administrative, financial or organisational details unless the question clearly names them. Avoid vague lines, therapist-like wording and anything that sounds over-written.`;

export const buildTeaserUserPromptEn = ({ question, runes, theme = 'situation', decision = null }) => `${buildSharedPromptContextEn({ question, runes, stage: 'teaser', theme, decision })}

Write a precise, vivid and nuanced teaser that makes the reader want to go further without already delivering the full reading. Do not simply stretch the free reading: reveal the missing piece, the factor that weakens, delays or conditions the first answer, and where the real shift actually happens. Speak about the concrete situation and its real knot, not the symbolism of the spread. It should feel like you are continuing the consultation, not switching into sales copy. Do not explain how to fix it yet.`;

export const buildFullReadingUserPromptEn = ({ question, runes, theme = 'situation', decision = null }) => `${buildSharedPromptContextEn({ question, runes, stage: 'full', theme, decision })}
${buildSituationReadingGuideEn(question)}

Write a deeper reading with no headings and no fixed visible structure. This layer must feel like the real resolution of what the free answer and teaser only opened.

Choose the shape that fits the question:
- direct answer in 1 or 2 tight paragraphs when the situation is simple or clear-cut
- progressive answer when understanding unfolds step by step
- conditional answer when everything turns on one key point
- more open answer when the situation is still moving but readable

Adapt the length as well:
- simple question = shorter answer
- complex question = more developed answer
- emotionally charged question = more embodied answer

The reading must cover the full mechanism, but without showing it as a template:
- what is already solid or real
- what truly blocks in concrete terms
- what needs to change
- what happens if it shifts
- what happens if nothing changes

Vary the opening lines. Do not start the same way every time. Always connect what the spread shows to the real situation and to how it may be lived concretely. If the tone is supportive, say so clearly; a simple adjustment should stay secondary. This time remove ambiguity: the paid answer must feel like release, clearer understanding, or a firmer outcome. ${NON_INTERCHANGEABLE_PAID_NOTE_EN} ${REAL_SCENE_ENFORCEMENT_NOTE_EN} ${RUNE_TO_SCENE_BINDING_NOTE_EN} No checklist, no symbolic jargon, no generic coaching, no over-explaining.`;

const buildCompactRuneLine = (runes = []) =>
  runes
    .map((rune) => {
      const position = rune?.positionLabel || '';
      const keywords = Array.isArray(rune?.positionKeywords) ? rune.positionKeywords.slice(0, 3) : [];
      return `${position}: ${rune?.nom || ''}${rune?.isReversed ? ' renversée' : ''} (${keywords.join(', ')})`;
    })
    .filter(Boolean)
    .join(' | ');

const getReserveWeight = (decision = null) => {
  const tone = decision?.global_tone || 'mitige';
  const friction = Number(decision?.friction_level || 0);
  const opening = Number(decision?.opening_level || 0);
  const presentRole = decision?.present_role || '';

  if (tone === 'porteur' && friction <= 0.42 && opening >= 0.5) {
    return 'minor';
  }

  if (tone === 'ouvert_mais_retenu' && friction <= 0.58 && presentRole !== 'frein_principal') {
    return 'moderate';
  }

  if (tone === 'en_maturation' || tone === 'en_clarification' || tone === 'en_reajustement') {
    return friction >= 0.62 ? 'moderate' : 'minor';
  }

  if (tone === 'tendu' || tone === 'bloque_mais_non_sterile') {
    return 'major';
  }

  if (tone === 'ferme_a_court_terme') {
    return 'blocking';
  }

  return friction >= 0.66 ? 'major' : 'moderate';
};

const describeRuneAnchor = (rune, locale = 'fr') => {
  const keywords = Array.isArray(rune?.positionKeywords) ? rune.positionKeywords.slice(0, 3) : [];
  if (!keywords.length) {
    return normalizeLocale(locale) === 'en' ? 'no strong keyword provided' : 'pas de mot-clé fort fourni';
  }

  return keywords.join(', ');
};

const buildFullBlockAnchorsFr = ({ runes = [], decision = null }) => {
  const past = runes[0] || {};
  const present = runes[1] || {};
  const future = runes[2] || {};

  const reserveWeight = getReserveWeight(decision);

  return [
    `Repères internes pour guider la lecture :`,
    `- Base déjà là : appuie-toi d'abord sur le passé (${describeRuneAnchor(past, 'fr')}) et sur ce qu'il a réellement installé.`,
    `- Nœud actif : centre-toi sur le présent (${describeRuneAnchor(present, 'fr')}) ; c'est lui qui doit donner la vraie couleur de la lecture.`,
    `- Passage demandé : appuie-toi sur le futur (${describeRuneAnchor(future, 'fr')}) pour dire ce qui devra être ajusté, franchi, assumé ou mûri.`,
    `- Axe global : ${decision?.dominant_axis || 'lecture contextuelle'}. Blocage principal : ${formatDecisionLabel(decision?.main_block)}. Levier : ${formatDecisionLabel(decision?.main_lever)}.`,
    `- Poids des réserves : ${reserveWeight}. Si le tirage est porteur ou ouvert, traite l'ajustement comme une condition de fluidité, pas comme un contrepoids dominant.`,
    `- Vérification interne obligatoire : la lecture doit varier son rythme et faire avancer la compréhension sans se découper en plan visible.`
  ].join('\n');
};

const buildFullBlockAnchorsEn = ({ runes = [], decision = null }) => {
  const past = runes[0] || {};
  const present = runes[1] || {};
  const future = runes[2] || {};

  const reserveWeight = getReserveWeight(decision);

  return [
    `Internal guidance for the reading:`,
    `- What is already in place: start from the past (${describeRuneAnchor(past, 'en')}) and what it has already installed.`,
    `- Active knot: focus on the present (${describeRuneAnchor(present, 'en')}); it must give the reading its real colour.`,
    `- Required passage: use the future (${describeRuneAnchor(future, 'en')}) to show what must be adjusted, faced, assumed or matured.`,
    `- Global axis: ${decision?.dominant_axis || 'contextual reading'}. Main block: ${decision?.main_block || 'current constraint'}. Lever: ${decision?.main_lever || 'needed adjustment'}.`,
    `- Reserve weight: ${reserveWeight}. If the spread is supportive or open, treat the adjustment as a condition of flow, not as the main counterweight.`,
    `- Mandatory internal check: the reading must vary its rhythm and move the understanding forward without breaking into a visible template.`
  ].join('\n');
};

const buildCompactDecisionLine = (decision) =>
  decision
    ? [
        `decision=${decision.decision}`,
        `category=${decision.question_category}`,
        `handling=${decision.question_handling}`,
        `confidence=${decision.confidence_level}`,
        `present=${decision.present_role}`,
        `future=${decision.future_role}`,
        `block=${decision.main_block}`,
        `lever=${decision.main_lever}`,
        `tone=${decision.global_tone}`
      ].join(' ; ')
    : '';

const buildCompactSummaryPromptFr = ({ question, runes, theme = 'situation', decision = null }) => `Question : ${question}
Thème : ${normalizeTheme(theme)}
Décision locale : ${buildCompactDecisionLine(decision)}
Tirage : ${buildCompactRuneLine(runes)}
Calibration : ${buildQuestionTypeCalibrationFr(question, 'summary')}
État émotionnel : ${buildEmotionalStateCalibrationFr(question, 'summary')}

Écris la réponse gratuite en 3 phrases maximum.
Phrase 1 : réponse claire à la question.
Phrase 2 : ce qui va probablement se passer ensuite, ou ce qui va surtout freiner la suite.
Phrase 3 : condition utile, manque à lever, ou point qui donnera envie d'aller plus loin.
Langue simple. Lecture prédictive, pas commentaire de structure. Ne cite pas les runes. Ne fais pas d'analyse symbolique. Pas de faux détail concret. Le tirage décide, la culture générale aide seulement à formuler.`;

const buildCompactTeaserPromptFr = ({ question, runes, theme = 'situation', decision = null }) => `Question : ${question}
Thème : ${normalizeTheme(theme)}
Décision locale : ${buildCompactDecisionLine(decision)}
Tirage : ${buildCompactRuneLine(runes)}
Calibration : ${buildQuestionTypeCalibrationFr(question, 'summary')}
État émotionnel : ${buildEmotionalStateCalibrationFr(question, 'summary')}
Variation lexicale : ${LEXICAL_VARIATION_NOTE_FR}

Écris un teaser de 2 à 3 phrases. Il ne répète pas le gratuit. Il montre seulement la pièce qui manque encore pour comprendre ce qui retient, ralentit ou rend la situation incomplète. Ne formule jamais la dominance comme une analyse. N’écris pas "ce qui domine", "le vrai sujet", "le problème" ou "ce qui compte le plus". Montre-le par une scène, une attente, un comportement ou une réaction observable.`;

const buildCompactFullPromptFr = ({ question, runes, theme = 'situation', decision = null }) => `Question : ${question}
Thème : ${normalizeTheme(theme)}
Décision locale : ${buildCompactDecisionLine(decision)}
Tirage : ${buildCompactRuneLine(runes)}
Calibration : ${buildQuestionTypeCalibrationFr(question, 'full')}
État émotionnel : ${buildEmotionalStateCalibrationFr(question, 'full')}
${buildFullBlockAnchorsFr({ runes, decision })}
${buildSituationReadingGuideFr(question)}
${buildInterpretiveMatterFr({ question, decision })}
Variation lexicale : ${LEXICAL_VARIATION_NOTE_FR}

Écris la lecture approfondie sans titres et sans plan visible.
Choisis une forme qui change selon la question : réponse directe, progressive, conditionnelle, tranchée ou plus ouverte. Adapte aussi la longueur au niveau de complexité et de charge émotionnelle. Reviens aux positions et à leurs interactions, sans nommer les runes, mais intègre-les dans un flux naturel. La lecture doit faire sentir ce qui est déjà installé, ce qui agit vraiment maintenant et ce qui a des chances de suivre, sans annoncer ces parties comme des rubriques. Va vite à l’essentiel. Langue simple. Lecture plus prédictive qu’analytique. Si la tonalité est favorable, assume-la sans refroidissement artificiel. Sur une question pro large, précise davantage le levier réel, le type d’offre à resserrer, ce qui attire sans convertir et ce qui peut tenir dans le temps. Varie le début de la réponse. Laisse une part non entièrement épuisée pour garder la tension vers la suite. Ne formule jamais la dominance comme une analyse. N’écris pas "ce qui domine", "le vrai sujet", "le problème" ou "ce qui compte le plus". Montre-la par une scène, un enchaînement, une réaction ou un comportement identifiable. Ne cite pas les runes. Pas de jargon ni de coaching générique.`;

const buildCompactSummaryPromptEn = ({ question, runes, theme = 'situation', decision = null }) => `Question: ${question}
Theme: ${normalizeTheme(theme)}
Local decision: ${buildCompactDecisionLine(decision)}
Spread: ${buildCompactRuneLine(runes)}
Calibration: ${buildQuestionTypeCalibrationEn(question, 'summary')}
Emotional state: ${buildEmotionalStateCalibrationEn(question, 'summary')}

Write the free reading in 3 sentences maximum.
Sentence 1: clear answer.
Sentence 2: concrete limit.
Sentence 3: useful missing layer that opens toward the deeper reading.
Do not name the runes. No symbolic analysis. No invented practical detail. The spread decides; general knowledge only helps wording.`;

const buildCompactTeaserPromptEn = ({ question, runes, theme = 'situation', decision = null }) => `Question: ${question}
Theme: ${normalizeTheme(theme)}
Local decision: ${buildCompactDecisionLine(decision)}
Spread: ${buildCompactRuneLine(runes)}
Calibration: ${buildQuestionTypeCalibrationEn(question, 'summary')}
Emotional state: ${buildEmotionalStateCalibrationEn(question, 'summary')}
Lexical variation: ${LEXICAL_VARIATION_NOTE_EN}

Write a teaser in 2 to 3 sentences. Do not repeat the free reading. Show only the missing piece that explains what slows, weakens or keeps the situation unresolved. Never phrase dominance like analysis. Do not write "what dominates", "the real issue", "the problem", or "what matters most". Show it through a scene, a reaction, a delay or an observable behaviour.`;

const buildCompactFullPromptEn = ({ question, runes, theme = 'situation', decision = null }) => `Question: ${question}
Theme: ${normalizeTheme(theme)}
Local decision: ${buildCompactDecisionLine(decision)}
Spread: ${buildCompactRuneLine(runes)}
Calibration: ${buildQuestionTypeCalibrationEn(question, 'full')}
Emotional state: ${buildEmotionalStateCalibrationEn(question, 'full')}
${buildFullBlockAnchorsEn({ runes, decision })}
${buildSituationReadingGuideEn(question)}
${buildInterpretiveMatterEn({ question, decision })}
Lexical variation: ${LEXICAL_VARIATION_NOTE_EN}

Write the deeper reading with no headings and no visible template.
Choose a shape that changes with the question: direct, progressive, conditional, blunt or more open. Adjust the length to the complexity and emotional weight of the question. Return to the positions and their interaction without naming the runes, but fold them into a natural flow. The reading must make clear what is already in place, what is actively shaping the situation now, and what is likely to follow or shift next, without presenting those functions as labelled sections. Keep it tight, concrete and more predictive than analytical. If the overall tone is supportive, state that clearly: a simple adjustment must not overshadow the dominant movement. Vary the opening lines. Leave one layer still partly unexplored so the deeper pull remains. Never phrase dominance like analysis. Do not write "what dominates", "the real issue", "the problem", or "what matters most". Show it through a scene, a reaction, a delay or an observable behaviour. Do not name the runes. No jargon or generic coaching.`;

const lowerFirst = (value) => value.charAt(0).toLowerCase() + value.slice(1);

const ensureSentence = (text) => {
  const trimmed = text.trim();
  if (!trimmed) {
    return '';
  }

  return /[.!?…]$/.test(trimmed) ? trimmed : `${trimmed}.`;
};

const toAscii = (value) =>
  String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

const pickVariant = (seed, variants = []) => {
  if (!variants.length) {
    return '';
  }

  const index =
    [...String(seed || '')].reduce((total, char) => total + char.charCodeAt(0), 0) % variants.length;

  return variants[index];
};

const cleanAxis = (text) =>
  String(text || '')
    .replace(/[.:;,!?…]+$/g, '')
    .trim();

const DECISION_LABELS_FR = {
  manque_de_marge: 'un manque de marge',
  contrainte_exterieure: 'une contrainte extérieure',
  cadre_deja_pose: 'un cadre déjà posé',
  timing_defavorable: 'un timing défavorable',
  flou_non_resolu: 'un flou non résolu',
  effort_disproportionne: 'un effort encore disproportionné',
  maintien_de_l_existant: 'un maintien de l’existant',
  potentiel_non_stabilise: 'un potentiel pas encore stabilisé',
  flux_instable: 'un flux encore instable',
  force_a_canaliser: 'une force à canaliser',
  obstacle_reel: 'un obstacle réel',
  confirmation_manquante: 'une confirmation encore manquante',
  trajet_a_ajuster: 'un trajet à ajuster',
  verite_a_regarder: 'une vérité à regarder',
  reciprocite_a_verifier: 'une réciprocité à vérifier',
  base_reelle_a_verifier: 'une base réelle à vérifier',
  terrain_instable: 'un terrain instable',
  marge_reduite: 'une marge réduite',
  gel_actuel: 'un gel actuel',
  temps_de_maturation: 'un temps de maturation',
  passage_long: 'un passage plus long que prévu',
  piece_manquante: 'une pièce encore manquante',
  vigilance_necessaire: 'une vigilance nécessaire',
  clarte_sans_garantie: 'une clarté qui ne garantit pas encore l’issue',
  ligne_a_tenir: 'une ligne à tenir',
  croissance_lente: 'une croissance encore lente',
  rythme_a_accorder: 'un rythme à accorder',
  positionnement_a_clarifier: 'un positionnement à clarifier',
  flou_sensible: 'un flou sensible',
  potentiel_contenu: 'un potentiel encore contenu',
  changement_a_fixer: 'un changement encore à fixer',
  cadre_qui_maintient: 'un cadre qui maintient l’existant',
  ajustement_necessaire: 'un ajustement plus net',
  clarification: 'une clarification plus nette',
  patience_active: 'une patience active',
  clarifier_un_point: 'clarifier un point encore en attente',
  relance_ou_retour: 'obtenir un retour ou reprendre le dossier plus nettement',
  validation_a_obtenir: 'obtenir une validation ou une confirmation claire',
  compromis: 'un compromis plus juste',
  demande_plus_franche: 'une demande plus franche',
  choix_plus_net: 'un choix plus net',
  restructuration: 'une restructuration plus nette'
};

const DECISION_VALUE_LABELS_FR = {
  oui: 'oui',
  oui_mais: 'oui, mais',
  non_pour_l_instant: 'non pour l’instant',
  peu_probable: 'peu probable',
  non_dans_les_conditions_actuelles: 'non dans les conditions actuelles'
};

const formatDecisionLabel = (value) =>
  DECISION_LABELS_FR[value] || String(value || '').replaceAll('_', ' ');

const withDeFr = (value) => {
  const trimmed = String(value || '').trim();
  if (!trimmed) return trimmed;
  if (trimmed.startsWith('une ')) return `d’une ${trimmed.slice(4)}`;
  if (trimmed.startsWith('un ')) return `d’un ${trimmed.slice(3)}`;
  return `de ${trimmed}`;
};

const NORSIGHT_COPY = {
  leads: {
    porteur: [
      "Oui, cela peut avancer dans le bon sens",
      "Oui, la suite va plutôt dans ce sens",
      "Oui, une vraie ouverture est là",
      "La possibilité est bien présente et elle a de l’appui"
    ],
    ouvert_mais_retenu: [
      "Oui, mais pas encore de manière pleinement installée",
      "Oui, mais cela ne tiendra pas encore tout seul",
      "Oui, la possibilité existe, sans être encore assez tenue",
      "Quelque chose peut prendre forme, mais pas encore de façon assez solide"
    ],
    mitige: [
      "Oui, une possibilité existe, mais elle reste fragile",
      "Cela peut aller dans ce sens, sans être encore acquis",
      "La suite peut s’ouvrir, mais pas sur une ligne vraiment stable"
    ],
    tendu: [
      "Non, cela ne s’ouvre pas facilement",
      "Quelque chose bloque encore fortement la suite",
      "La situation reste serrée, même si tout n’est pas fermé",
      "La suite peut bouger un peu, mais pas librement"
    ],
    ferme_a_court_terme: [
      "Non, pas dans les conditions actuelles",
      "Pour l’instant, le tirage ne montre pas d’ouverture suffisante",
      "La situation reste trop resserrée pour valider cela maintenant",
      "La réponse ne va pas clairement dans ce sens pour le moment"
    ],
    en_maturation: [
      "Oui, cela peut prendre, mais pas tout de suite",
      "Oui, quelque chose peut se former, mais lentement",
      "La suite peut aller dans ce sens, mais pas dans un rythme rapide"
    ],
    en_clarification: [
      "Oui, cela peut s’éclaircir, mais pas encore complètement",
      "La réponse va plutôt dans ce sens, mais un point reste flou",
      "La suite peut se préciser, sans être encore tranchée"
    ],
    en_reajustement: [
      "Oui, mais il faudra mieux poser les choses",
      "La situation peut évoluer, mais pas sans réglage",
      "L’ouverture existe, mais elle demandera un point plus net"
    ]
  },
  support: [
    "Ce qui soutient ici, c’est une base déjà présente",
    "Le point d’appui réel se trouve dans ce qui tient déjà",
    "Ce qui donne de la tenue à la situation n’est pas vide"
  ],
  friction: [
    "Ce qui resserre encore la situation mérite d’être regardé sans forcer",
    "La réserve vient surtout d’un point qui n’est pas encore stabilisé",
    "Ce qui limite l’ouverture pour l’instant demande un ajustement plus net"
  ],
  opening: [
    "La marge réelle se trouve dans la manière de mieux tenir ce mouvement",
    "Ce qui peut faire évoluer les choses passe par une position plus claire",
    "L’ouverture tient à ce qui pourra être assumé plus simplement"
  ],
  closing: [
    "Quelque chose est là, mais ça demande encore d’être tenu",
    "L’ouverture existe, à condition d’assumer le passage qu’elle demande",
    "Le tirage n’écarte pas cette possibilité, mais il ne permet pas encore de la tenir comme acquise",
    "Le mouvement ne manque pas totalement ; c’est sa tenue qui reste à construire"
  ]
};

const getToneKey = (decision) => decision?.global_tone || 'mitige';

const pickCopy = (seed, group, fallbackGroup = 'mitige') => {
  const variants = NORSIGHT_COPY.leads[group] || NORSIGHT_COPY.leads[fallbackGroup] || [];
  return pickVariant(seed, variants);
};

const prettifyFallbackText = (text) => {
  const value = cleanAxis(text);
  const lowered = toAscii(value);

  const replacements = [
    ['deja', 'déjà'],
    ['epreuve', 'épreuve'],
    ['clarte', 'clarté'],
    ['reelle', 'réelle'],
    ['reel', 'réel'],
    ['facon', 'façon'],
    ['evolution', 'évolution'],
    ['frustration', 'frustration'],
    ['mouvement', 'mouvement'],
    ['possible', 'possible'],
    ['present', 'présent'],
    ['presente', 'présente']
  ];

  let output = value;
  for (const [plain, accented] of replacements) {
    output = output.replace(new RegExp(`\\b${plain}\\b`, 'gi'), accented);
  }

  return output.charAt(0).toLowerCase() + output.slice(1);
};

const getRuneSourceNode = (rune, fallbackKey) => {
  const sourceKey = rune?.positionSourceKey || fallbackKey;
  if (sourceKey === 'essence') {
    return rune?.referential?.essence || null;
  }

  return rune?.referential?.positions?.[sourceKey] || null;
};

const getRuneKeywordLead = (rune, fallbackKey) => {
  const sourceNode = getRuneSourceNode(rune, fallbackKey);
  const keyword =
    (Array.isArray(rune?.positionKeywords) && rune.positionKeywords[0]) ||
    (Array.isArray(sourceNode?.keywords) && sourceNode.keywords[0]) ||
    '';

  return prettifyFallbackText(keyword);
};

const collectRuneKeywordPool = (runes = []) =>
  runes
    .flatMap((rune, index) => {
      const fallbackKey = index === 0 ? 'dynamique' : index === 1 ? 'essence' : 'mouvement';
      const sourceNode = getRuneSourceNode(rune, fallbackKey);
      const directKeywords = Array.isArray(rune?.positionKeywords) ? rune.positionKeywords : [];
      const sourceKeywords = Array.isArray(sourceNode?.keywords) ? sourceNode.keywords : [];
      return [...directKeywords, ...sourceKeywords];
    })
    .map((keyword) => prettifyFallbackText(keyword))
    .filter(Boolean);

const CLOSED_QUESTION_POSITIVE_MARKERS = [
  'ouverture',
  'progression',
  'clarification',
  'direction',
  'appui',
  'coherence',
  'cohérence',
  'stabilisation',
  'maturation',
  'issue',
  'alliance',
  'accord',
  'vitalite',
  'vitalité',
  'ressource',
  'circulation'
];

const CLOSED_QUESTION_NEGATIVE_MARKERS = [
  'gel',
  'stase',
  'manque',
  'contrainte',
  'désordre',
  'desordre',
  'choc',
  'heurt',
  'rupture',
  'chaos',
  'fragilite',
  'fragilité',
  'limite',
  'retenue',
  'blocage'
];

const detectClosedQuestionLean = (question, runes) => {
  const keywords = collectRuneKeywordPool(runes).map((keyword) => toAscii(keyword));
  const positive = keywords.reduce(
    (score, keyword) => score + (CLOSED_QUESTION_POSITIVE_MARKERS.some((marker) => keyword.includes(marker)) ? 1 : 0),
    0
  );
  const negative = keywords.reduce(
    (score, keyword) => score + (CLOSED_QUESTION_NEGATIVE_MARKERS.some((marker) => keyword.includes(marker)) ? 1 : 0),
    0
  );
  const loweredQuestion = toAscii(question);

  if (negative >= positive + 2) {
    return 'rather-no';
  }

  if (positive >= negative + 2) {
    return loweredQuestion.includes('cette annee') || loweredQuestion.includes('cet an') ? 'yes-likely' : 'likely';
  }

  if (negative > positive) {
    return 'unlikely';
  }

  return 'unstable';
};

export const detectQuestionTopic = (question = '') => {
  const lowered = toAscii(question);

  if (
    lowered.includes('prix') ||
    lowered.includes('tarif') ||
    lowered.includes('reduction') ||
    lowered.includes('réduction') ||
    lowered.includes('billet') ||
    lowered.includes('ordinateur') ||
    lowered.includes('achat') ||
    lowered.includes('acheter') ||
    lowered.includes('tatouage')
  ) {
    return 'price';
  }

  if (
    lowered.includes('financ') ||
    lowered.includes('argent') ||
    lowered.includes('revenu') ||
    lowered.includes('client') ||
    lowered.includes('seance') ||
    lowered.includes('séance') ||
    lowered.includes('session') ||
    lowered.includes('booking') ||
    lowered.includes('reservation') ||
    lowered.includes('réservation') ||
    lowered.includes('rendez vous') ||
    lowered.includes('rendez-vous') ||
    lowered.includes('consultation') ||
    lowered.includes('projet') ||
    lowered.includes('activite') ||
    lowered.includes('activité') ||
    lowered.includes('travail')
  ) {
    return 'work';
  }

  if (
    lowered.includes('couple') ||
    lowered.includes('relation') ||
    lowered.includes('amour') ||
    lowered.includes('mari') ||
    lowered.includes('femme') ||
    lowered.includes('ex')
  ) {
    return 'relationship';
  }

  if (
    lowered.includes('caf') ||
    lowered.includes('justice') ||
    lowered.includes('tribunal') ||
    lowered.includes('dossier') ||
    lowered.includes('avocat')
  ) {
    return 'admin';
  }

  return 'general';
};

const detectPriceSubtype = (question = '') => {
  const lowered = toAscii(question);

  if (lowered.includes('billet') || lowered.includes('train') || lowered.includes('paris')) {
    return 'travel';
  }

  if (
    lowered.includes('reduction') ||
    lowered.includes('réduction') ||
    lowered.includes('tarif') ||
    lowered.includes('tatouage') ||
    lowered.includes('remise')
  ) {
    return 'discount';
  }

  if (lowered.includes('ordinateur') || lowered.includes('achat') || lowered.includes('acheter')) {
    return 'purchase';
  }

  return 'generic';
};

const detectWorkSubtype = (question = '') => {
  const lowered = toAscii(question);

  if (lowered.includes('argent') || lowered.includes('financ') || lowered.includes('revenu') || lowered.includes('retomber a flot') || lowered.includes('retomber à flot')) {
    return 'finance';
  }

  if (lowered.includes('client') || lowered.includes('clients') || lowered.includes('video') || lowered.includes('videos') || lowered.includes('visibilite') || lowered.includes('visibilité')) {
    return 'visibility';
  }

  if (
    lowered.includes('seance') ||
    lowered.includes('séance') ||
    lowered.includes('seances') ||
    lowered.includes('séances') ||
    lowered.includes('session') ||
    lowered.includes('sessions') ||
    lowered.includes('booking') ||
    lowered.includes('bookings') ||
    lowered.includes('rendez vous') ||
    lowered.includes('rendez-vous')
  ) {
    return 'sessions';
  }

  if (
    lowered.includes('activite') ||
    lowered.includes('activité') ||
    lowered.includes('projet') ||
    lowered.includes('projets') ||
    lowered.includes('decoller') ||
    lowered.includes('décoller') ||
    lowered.includes('offre') ||
    lowered.includes('consultation') ||
    lowered.includes('reservation') ||
    lowered.includes('réservation') ||
    lowered.includes('service')
  ) {
    return 'activity';
  }

  return 'generic';
};

const detectRelationshipSubtype = (question = '') => {
  const lowered = toAscii(question);

  if (lowered.includes('ex') || lowered.includes('reprendre') || lowered.includes('retour')) {
    return 'return';
  }

  if (lowered.includes('couple') || lowered.includes('relation') || lowered.includes('amour')) {
    return 'bond';
  }

  return 'generic';
};

const detectAdminSubtype = (question = '') => {
  const lowered = toAscii(question);

  if (lowered.includes('caf') || lowered.includes('aide') || lowered.includes('allocation')) {
    return 'benefit';
  }

  if (
    lowered.includes('dossier') ||
    lowered.includes('demarche') ||
    lowered.includes('démarche') ||
    lowered.includes('reponse') ||
    lowered.includes('réponse') ||
    lowered.includes('blocage administratif') ||
    lowered.includes('organisme')
  ) {
    return 'dossier';
  }

  if (lowered.includes('justice') || lowered.includes('tribunal') || lowered.includes('proces') || lowered.includes('procès')) {
    return 'legal';
  }

  return 'generic';
};

const detectQuestionTimeframe = (question = '') => {
  const lowered = toAscii(question);

  if (lowered.includes('dans les mois a venir') || lowered.includes('dans les mois')) return 'dans les mois à venir';
  if (lowered.includes('cette annee')) return 'cette année';
  if (lowered.includes('en juin')) return 'en juin';
  if (lowered.includes('cet ete')) return 'cet été';
  if (lowered.includes('bientot') || lowered.includes('bientôt')) return 'dans un horizon proche';

  return '';
};

const buildSituationSpecificityFr = (question = '') => {
  const lowered = toAscii(question);
  const topic = detectQuestionTopic(question);
  const subtype =
    topic === 'price'
      ? detectPriceSubtype(question)
      : topic === 'work'
        ? detectWorkSubtype(question)
        : topic === 'relationship'
          ? detectRelationshipSubtype(question)
          : topic === 'admin'
            ? detectAdminSubtype(question)
            : 'generic';
  const timeframe = detectQuestionTimeframe(question);
  const rawSubject = adaptSubjectForReadingFr(extractQuestionSubjectFr(question));
  const subject =
    lowered.includes('demenagement') || lowered.includes('déménagement')
      ? 'ton déménagement'
      : lowered.includes('nornsight')
        ? 'Nornsight'
        : lowered.includes('blocage avec la caf')
          ? 'ton blocage avec la CAF'
          : lowered.includes('demarche') || lowered.includes('démarche')
            ? 'ta démarche'
            : lowered.includes('reponse favorable') || lowered.includes('réponse favorable')
              ? 'la réponse attendue'
        : lowered.includes('offre')
          ? 'ton offre'
          : lowered.includes('seance') || lowered.includes('séance') || lowered.includes('session')
            ? 'tes séances'
          : lowered.includes('façon de travailler') || lowered.includes('facon de travailler')
            ? 'ta manière de travailler'
          : lowered.includes('travail')
            ? 'ton travail'
          : lowered.includes('dossier')
            ? 'ton dossier'
        : lowered.includes('activite') || lowered.includes('activité')
          ? 'ton activité'
          : lowered.includes('projet')
            ? 'ton projet'
            : lowered.includes('financ') || lowered.includes('argent') || lowered.includes('revenu')
              ? 'ta situation financière'
              : lowered.includes('situation')
                ? 'ta situation'
              : lowered.includes('relation') || lowered.includes('couple') || lowered.includes('lien')
                ? 'ton lien'
                : rawSubject;

  if (topic === 'price' && subtype === 'travel') {
    return {
      subject: subject || 'la recherche d’un trajet ou d’un billet',
      angle: 'le trajet, le prix, le choix possible, le compromis ou le bon moment pour réserver',
      manifestations: 'la recherche elle-même, les options disponibles et les compromis à accepter'
    };
  }

  if (topic === 'price' && subtype === 'purchase') {
    return {
      subject: subject || 'un achat concret',
      angle: 'le moment d’achat, la marge disponible, la priorité réelle et le cadre matériel',
      manifestations: 'la marge réelle, les priorités du moment et le passage à l’acte'
    };
  }

  if (topic === 'price') {
    return {
      subject: subject || 'une question de prix ou de tarif',
      angle: 'le cadre de prix, la marge de négociation, le compromis ou le maintien du tarif',
      manifestations: 'la négociation, la marge laissée par le cadre et la manière dont l’échange se ferme ou s’ouvre'
    };
  }

  if (topic === 'work' && subtype === 'finance') {
    return {
      subject: subject || 'la situation financière ou la capacité à refaire de la marge',
      angle: 'les revenus, la stabilité, les charges, le souffle retrouvé ou la pression persistante',
      manifestations: 'le souffle retrouvé, ce qui pèse encore et la manière dont l’amélioration tient ou non'
    };
  }

  if (topic === 'work' && subtype === 'sessions') {
    return {
      subject: subject || 'tes séances',
      angle: 'les créneaux proposés, les demandes reçues, les réservations confirmées, les hésitations avant de réserver et la régularité réelle des prises de contact',
      manifestations: 'les personnes qui demandent puis ne réservent pas, les messages qui n’aboutissent pas à une séance posée, les créneaux ouverts qui restent vides, ou au contraire les demandes qui se transforment enfin en réservations concrètes'
    };
  }

  if (topic === 'work' && subtype === 'activity') {
    return {
      subject: subject || 'le projet ou l’activité en cours',
      angle: 'le développement réel, la lisibilité de l’offre, la valeur perçue, l’adhésion, la conversion possible et la capacité à tenir dans le temps',
      manifestations: 'l’intérêt suscité, ce qui reste seulement regardé, ce qui commence à être choisi, ce qui convertit peu ou mieux, et ce qui peut se stabiliser'
    };
  }

  if (topic === 'work' && subtype === 'visibility') {
    return {
      subject: subject || 'la visibilité ou l’élan du projet',
      angle: 'la présence, la réception, la compréhension du message, l’envie d’aller plus loin et l’effet réel sur ce qui est montré',
      manifestations: 'ce qui attire l’attention, ce qui plaît sans encore convertir, ce qui commence à convaincre et la manière dont la présence finit ou non par porter'
    };
  }

  if (topic === 'relationship') {
    return {
      subject: subject || 'le lien ou la relation concernée',
      angle: 'le lien réel, ce qui rapproche ou éloigne, ce qui clarifie ou entretient le flou',
      manifestations: 'ce qui se ressent dans le lien, ce qui coince dans l’échange et ce qui peut rapprocher ou éloigner'
    };
  }

  if (topic === 'admin') {
    if (subtype === 'benefit') {
      return {
        subject: subject || 'le dossier CAF ou la demande en cours',
        angle: 'le délai réel, ce qui reste retenu, ce qui attend une validation, un retour ou une reprise claire',
        manifestations: 'l’attente, le dossier qui reste suspendu, le besoin d’un retour, d’une pièce ou d’une clarification avant vraie avancée'
      };
    }

    if (subtype === 'dossier') {
      return {
        subject: subject || 'le dossier ou la démarche en cours',
        angle: 'le blocage réel, ce qui dépend d’un tiers, ce qui manque encore pour avancer, et la possibilité d’un déblocage par étape',
        manifestations: 'l’attente d’une réponse, d’un retour, d’une correction, d’une pièce ou d’un arbitrage avant résolution'
      };
    }

    if (subtype === 'legal') {
      return {
        subject: subject || 'la situation administrative ou juridique',
        angle: 'le cadre en place, le délai, l’arbitrage extérieur et ce qui doit être confirmé avant issue plus nette',
        manifestations: 'l’attente d’une décision, la lenteur du cadre et ce qui ne dépend pas seulement de toi'
      };
    }

    return {
      subject: subject || 'la situation administrative ou juridique',
      angle: 'le cadre en place, les délais, ce qui dépend d’une instance extérieure et ce qui reste à stabiliser',
      manifestations: 'les délais, les points qui ralentissent et ce qui peut faire avancer le dossier'
    };
  }

  return {
    subject: subject || 'la situation posée dans la question',
    angle: 'la situation réelle, ce qui la soutient, ce qui la complique et la manière dont elle peut évoluer',
    manifestations: 'la manière dont cela se vit, se ralentit, se bloque ou se débloque concrètement'
  };
};

const buildSituationReadingGuideFr = (question = '') => {
  const specificity = buildSituationSpecificityFr(question);
  const timeframe = detectQuestionTimeframe(question);

  return [
    `Sujet réel à éclairer : ${specificity.subject}.`,
    timeframe ? `Temporalité utile : ${timeframe}.` : null,
    `Traduction attendue : ${specificity.angle}.`,
    `Plan concret ou vécu : ${specificity.manifestations}.`
  ].filter(Boolean).join('\n');
};

const buildSituationReadingGuideEn = (question = '') => {
  const specificity = buildSituationSpecificityFr(question);
  const timeframe = detectQuestionTimeframe(question);

  return [
    `Real subject to illuminate: ${specificity.subject}.`,
    timeframe ? `Relevant timeframe: ${timeframe}.` : null,
    `Expected translation: ${specificity.angle}.`,
    `Concrete or lived layer: ${specificity.manifestations}.`
  ].filter(Boolean).join('\n');
};

const buildProfessionalOfferPrecisionGuideFr = (question = '') => {
  const lowered = toAscii(question);
  const mentionsOffer =
    lowered.includes('offre') ||
    lowered.includes('proposition') ||
    lowered.includes('service') ||
    lowered.includes('accompagnement');
  const mentionsConversion =
    lowered.includes('convert') ||
    lowered.includes('achat') ||
    lowered.includes('acheter') ||
    lowered.includes('vendre') ||
    lowered.includes('vente');
  const mentionsTakeoff =
    lowered.includes('decoller') ||
    lowered.includes('décoller') ||
    lowered.includes('tenir') ||
    lowered.includes('stabil') ||
    lowered.includes('durer');
  const broadProfessionalQuestion =
    lowered.includes('ameliorer mon activite') ||
    lowered.includes('améliorer mon activité') ||
    lowered.includes('quel genre d offre') ||
    lowered.includes('quel genre d’offre') ||
    lowered.includes('vraiment marcher') ||
    lowered.includes('vraies reservations') ||
    lowered.includes('vraies réservations') ||
    lowered.includes('attirer de l interet') ||
    lowered.includes('attirer de l’intérêt');

  return [
    `Nuance attendue dans cette famille : distinguer l’attention, la bonne réception, la compréhension, l’adhésion, le passage à l’achat, puis la tenue dans le temps.`,
    `Freins spécifiques à pouvoir nommer : offre floue, promesse pas assez lisible, formulation trop large, manque de différenciation, intérêt sans décision, hésitation avant achat, proposition utile mais pas encore assez tranchée.`,
    `Signaux positifs spécifiques à pouvoir nommer : résonance, intérêt clair, bonne réception, compréhension nette, envie d’aller plus loin, début d’adhésion, conversion qui apparaît, traction plus stable.`,
    mentionsOffer || mentionsConversion
      ? `Projection à privilégier ici : dire si l’offre attire surtout l’attention, si elle commence à convaincre, si elle donne envie d’acheter, ou si elle reste comprise sans encore convertir franchement.`
      : `Projection à privilégier ici : dire si le projet est surtout regardé, s’il commence à être choisi, ou s’il reste apprécié sans encore créer de passage à l’acte clair.`,
    mentionsTakeoff
      ? `Quand la question parle de tenue ou de décollage, distinguer un simple intérêt, une conversion encore fragile, une traction réelle, puis un décollage progressif capable de durer.`
      : `Quand un mouvement positif existe, préciser s’il reste ponctuel, s’il commence à se répéter, ou s’il gagne une vraie stabilité.`,
    broadProfessionalQuestion
      ? `Sur une question pro large, aide à nommer plus nettement le levier principal, le type d’offre à resserrer, ce qui attire sans convertir, et ce qui peut vraiment commencer à tenir.`
      : null
  ].filter(Boolean).join('\n');
};

const buildTopicWritingGuideFr = (question = '') => {
  const topic = detectQuestionTopic(question);
  const workSubtype = detectWorkSubtype(question);
  const adminSubtype = detectAdminSubtype(question);

  if (topic === 'relationship') {
    return [
      `Famille rédactionnelle : relationnel.`,
      `Vocabulaire à privilégier : lien, échanges, place, distance, rapprochement, réciprocité, engagement, mise au clair, flou, présence.`,
      `Projection à faire apparaître : ce qui peut rapprocher, ce qui peut tenir, ce qui risque de garder le lien flou, ce qui demandera une parole plus nette.`
    ].join('\n');
  }

  if (topic === 'work' && workSubtype !== 'finance') {
    return [
      `Famille rédactionnelle : projet, offre, professionnel.`,
      `Vocabulaire à privilégier : lisibilité, formulation, promesse, réception, intérêt, résonance, différenciation, adhésion, hésitation, achat, conversion, traction, décollage, tenue.`,
      `Projection à faire apparaître : ce qui attire sans déclencher, ce qui plaît mais reste flou, ce qui est compris sans encore être choisi, ce qui peut convertir sans tenir encore, ce qui commence à créer une vraie traction, ce qui peut décoller progressivement si la forme se resserre.`,
      buildProfessionalOfferPrecisionGuideFr(question)
    ].join('\n');
  }

  if (topic === 'work' && workSubtype === 'finance') {
    return [
      `Famille rédactionnelle : finances, marge, concret matériel.`,
      `Vocabulaire à privilégier : marge, charge, souffle, reprise, maintien, pression, stabilité, respiration, soutien concret.`,
      `Projection à faire apparaître : ce qui peut desserrer la pression, ce qui risque de continuer à peser, ce qui peut vraiment tenir, ce qui restera trop court ou trop fragile.`
    ].join('\n');
  }

  if (topic === 'admin' || adminSubtype === 'benefit' || adminSubtype === 'legal') {
    const subtype = detectAdminSubtype(question);
    return [
      `Famille rédactionnelle : dossier, cadre concret, situation matérielle.`,
      `Vocabulaire à privilégier : délai, blocage, attente, retour, réponse, validation, reprise, pièce manquante, information manquante, arbitrage, déblocage, avancée par étape.`,
      `Projection à faire apparaître : ce qui reste retenu, ce qui dépend d’un tiers, ce qui peut avancer après clarification, ce qui restera lent, ce qui ne donnera qu’une issue partielle, ou ce qui peut se résoudre par étape.`,
      subtype === 'benefit'
        ? `Sur un dossier CAF ou une demande d’aide, parle plus facilement de validation en attente, de retour manquant, de reprise du dossier ou d’ouverture lente plutôt que de simple patience abstraite.`
        : subtype === 'dossier'
          ? `Sur un dossier ou une démarche, aide à distinguer un retard simple, un vrai verrou externe, une pièce ou une réponse manquante, puis un déblocage conditionnel ou progressif.`
          : subtype === 'legal'
            ? `Sur un cadre juridique, parle davantage d’arbitrage, de réponse attendue, de délai imposé et d’issue lente ou partielle, sans inventer de procédure.`
            : null
    ].filter(Boolean).join('\n');
  }

  return [
    `Famille rédactionnelle : évolution personnelle, transition, choix.`,
    `Vocabulaire à privilégier : cap, décision, passage, réalignement, fatigue, reprise, clarification, seuil, bascule utile.`,
    `Projection à faire apparaître : ce qui va se préciser, ce qui risque de rester en attente, ce qui demandera une décision plus nette, ce qui peut changer si un vrai cap est pris.`
  ].join('\n');
};

const getConcreteMaturityLevelFr = (decision = null) => {
  if (!decision) return 'encore difficile à fixer clairement';
  if (decision.global_tone === 'porteur') return 'déjà assez lisible pour être assumé';
  if (decision.global_tone === 'ouvert_mais_retenu') return 'réel, mais pas encore complètement installé';
  if (decision.global_tone === 'en_maturation') return 'en cours de maturation plutôt qu’en sortie immédiate';
  if (decision.global_tone === 'en_clarification') return 'encore partiellement flou';
  if (decision.global_tone === 'ferme_a_court_terme') return 'très peu concrétisable à court terme';
  return 'encore fragile ou discuté';
};

const buildConcreteSupportFr = (decision, situation) => {
  if (decision?.global_tone === 'porteur') {
    return `ce qui soutient déjà ${situation.subject}, avec ${lowerFirst(situation.angle)}`;
  }

  if (decision?.support_level > decision?.friction_level) {
    return `une base réelle qui garde du poids dans ${situation.subject}`;
  }

  return `un appui encore partiel autour de ${situation.subject}`;
};

const buildConcreteFrictionFr = (decision, situation) => {
  const block = formatDecisionLabel(decision?.main_block);

  if (getReserveWeight(decision) === 'minor') {
    return `${block}, mais comme condition de fluidité plus que comme frein majeur`;
  }

  if (getReserveWeight(decision) === 'moderate') {
    return `${block}, avec des effets concrets sur ${lowerFirst(situation.manifestations)}`;
  }

  return `${block}, avec un poids réel sur la manière dont ${situation.subject} avance ou se retient`;
};

const buildInterpretiveMatterFr = ({ question, decision = null }) => {
  const situation = buildSituationSpecificityFr(question);
  const reserveWeight = getReserveWeight(decision);
  const dynamics = decision?.rune_dynamics || {};

  return [
    `Matière interprétative locale :`,
    `- Question réelle : ce qu’il faut lire concrètement autour de ${situation.subject}.`,
    `- Rune dominante : ${dynamics.dominant_signature_fr || 'non déterminée'}.`,
    `- Rune limitante : ${dynamics.limiting_signature_fr || 'non déterminée'}.`,
    `- Dynamique réelle : ${dynamics.dynamic || 'instability'} ; ${dynamics.real_movement_fr || 'quelque chose avance, mais pas de manière linéaire'}.`,
    `- Illusion à éviter : ${dynamics.illusion_fr || 'ne pas confondre mouvement réel et impression de mouvement'}.`,
    `- Ce qui retient : ${dynamics.holding_back_fr || 'le frein principal doit être nommé plus clairement'}.`,
    `- Dominance à tenir : ${buildDominantOutcomeLabelFr(decision)}.`,
    `- Scène concrète non interchangeable : ${buildNonInterchangeableSceneFr(question, decision)}.`,
    `- Appui : ${buildConcreteSupportFr(decision, situation)}.`,
    `- Frein : ${buildConcreteFrictionFr(decision, situation)}.`,
    `- Ton et levier : ${decision?.global_tone || 'mitige'} ; ${formatDecisionLabel(decision?.main_lever)}.`,
    `- À assumer : ${reserveWeight === 'minor' || reserveWeight === 'moderate' ? 'le mouvement principal sans le refroidir artificiellement' : 'la réserve principale qui pèse vraiment'}.`,
    buildTopicWritingGuideFr(question)
  ].join('\n');
};

const buildInterpretiveMatterEn = ({ question, decision = null }) => {
  const situation = buildSituationSpecificityFr(question);
  const dynamics = decision?.rune_dynamics || {};

  return [
    `Local interpretive material:`,
    `- What the question is really asking: a concrete reading of ${situation.subject}.`,
    `- Dominant rune: ${dynamics.dominant_signature_en || 'not determined'}.`,
    `- Limiting rune: ${dynamics.limiting_signature_en || 'not determined'}.`,
    `- Real dynamic: ${dynamics.dynamic || 'instability'} ; ${dynamics.real_movement_en || 'something is moving, but not in a clean straight line'}.`,
    `- Illusion to avoid: ${dynamics.illusion_en || 'do not confuse motion with real progress'}.`,
    `- What holds it back: ${dynamics.holding_back_en || 'the main limit needs to be named more clearly'}.`,
    `- Dominant outcome to hold: ${buildDominantOutcomeLabelEn(decision)}.`,
    `- What concretely supports the situation: ${buildConcreteSupportFr(decision, situation)}.`,
    `- What concretely slows it down: ${buildConcreteFrictionFr(decision, situation)}.`,
    `- Dominant tone to assume: ${decision?.global_tone || 'mixed'}.`,
    `- Adjustment type: ${decision?.main_lever || 'needed adjustment'}.`,
    `- Concretisation level: ${getConcreteMaturityLevelFr(decision)}.`
  ].join('\n');
};

export const createReframeReading = ({ question, locale = 'fr', decision = null, mode = 'full' }) => {
  if (normalizeLocale(locale) === 'en') {
    return mode === 'full'
      ? `This question first calls for factual verification rather than a deeper symbolic reading.\n\nWhat the spread can clarify here is your relationship to uncertainty, trust and the need for a reliable answer, not the fact itself.`
      : `This question first calls for factual verification rather than a symbolic verdict.`;
  }

  if (decision?.question_handling === 'refuse') {
    return mode === 'full'
      ? `Le tirage peut aider à nommer ce que cette question remue, mais ici il ne suffit pas à lui seul.\n\nSi cela touche à la santé, au juridique ou à une situation sensible, garde un appui concret et immédiat à portée de main.`
      : `Cette question demande d’abord une aide concrète ou spécialisée, pas une lecture de tirage.`;
  }

  if (decision?.question_category === 'mal_adaptee_au_tirage') {
    return mode === 'full'
      ? `Dans cette forme, la question se prête mal à une lecture approfondie classique.\n\nLe tirage montre surtout qu’il faut reformuler l’enjeu plus justement, pour obtenir une réponse utile au lieu de forcer un verdict brut.`
      : `Dans cette forme, la question se prête mal à une réponse runique directe.`;
  }

  return mode === 'full'
    ? `Cette question appelle d’abord une vérification concrète plutôt qu’une lecture approfondie classique.\n\nLe tirage peut toutefois montrer ce que cette recherche de réponse active : besoin de certitude, difficulté à se fier à l’information, ou tension autour de ce qui reste encore incertain.`
    : `Cette question appelle d’abord une vérification concrète plutôt qu’un verdict runique direct.`;
};

const RUNE_METHOD_RULES = {
  Fehu: { score: 0.32, cautious: true, slow: false, closed: 'oui_mais', block: 'flux_instable' },
  Uruz: { score: 0.2, cautious: true, slow: false, closed: 'oui_mais', block: 'force_a_canaliser' },
  Thurisaz: { score: -0.75, closing: true, closed: 'non_pour_l_instant', block: 'obstacle_reel' },
  Ansuz: { score: 0.24, cautious: true, closed: 'oui_mais', block: 'confirmation_manquante' },
  Raidho: { score: 0.28, cautious: true, closed: 'oui_mais', block: 'trajet_a_ajuster' },
  Kenaz: { score: 0.18, cautious: true, closed: 'oui_mais', block: 'verite_a_regarder' },
  Gebo: { score: 0.38, cautious: false, closed: 'oui_mais', block: 'reciprocite_a_verifier' },
  Wunjo: { score: 0.36, cautious: false, closed: 'oui_mais', block: 'base_reelle_a_verifier' },
  Hagalaz: { score: -1.05, closing: true, closed: 'peu_probable', block: 'terrain_instable' },
  Nauthiz: { score: -0.9, closing: true, closed: 'non_pour_l_instant', block: 'marge_reduite' },
  Isa: { score: -1.15, closing: true, closed: 'non_pour_l_instant', block: 'gel_actuel' },
  Jera: { score: 0.15, cautious: true, slow: true, closed: 'oui_mais', block: 'temps_de_maturation' },
  Eihwaz: { score: -0.35, closing: true, slow: true, closed: 'non_pour_l_instant', block: 'passage_long' },
  Perthro: { score: -0.25, closing: true, uncertain: true, closed: 'non_pour_l_instant', block: 'piece_manquante' },
  Algiz: { score: 0.12, cautious: true, closed: 'oui_mais', block: 'vigilance_necessaire' },
  Sowilo: { score: 0.52, cautious: false, closed: 'oui', block: 'clarte_sans_garantie' },
  Tiwaz: { score: 0.4, cautious: false, closed: 'oui', block: 'ligne_a_tenir' },
  Berkano: { score: 0.3, cautious: false, slow: false, closed: 'oui_mais', block: 'croissance_lente' },
  Ehwaz: { score: 0.28, cautious: true, closed: 'oui_mais', block: 'rythme_a_accorder' },
  Mannaz: { score: 0.16, cautious: false, closed: 'oui_mais', block: 'positionnement_a_clarifier' },
  Laguz: { score: -0.1, closing: true, uncertain: true, closed: 'non_pour_l_instant', block: 'flou_sensible' },
  Ingwaz: { score: 0.18, cautious: true, slow: true, closed: 'oui_mais', block: 'potentiel_contenu' },
  Dagaz: { score: 0.36, cautious: true, closed: 'oui_mais', block: 'changement_a_fixer' },
  Othala: { score: -0.15, closing: true, closed: 'non_dans_les_conditions_actuelles', block: 'cadre_qui_maintient' }
};

const getRuneMethodRule = (rune) => RUNE_METHOD_RULES[rune?.nom] || { score: 0, cautious: true, closed: 'oui_mais', block: 'ajustement_necessaire' };

const POSITIVE_DECISION_HINTS = [
  'ouverture',
  'clarté',
  'clarte',
  'vérité',
  'verite',
  'rayonnement',
  'appui',
  'accord',
  'réciprocité',
  'reciprocite',
  'complémentarité',
  'complementarite',
  'cohésion',
  'cohesion',
  'synchronisation',
  'coopération',
  'cooperation',
  'direction',
  'axe',
  'axe juste',
  'justesse',
  'décision',
  'decision',
  'engagement',
  'droiture',
  'clarification',
  'progression',
  'stabilisation',
  'issue',
  'fluidite',
  'protection',
  'vigilance',
  'limites saines',
  'alignement',
  'ecoute',
  'rythme',
  'parcours',
  'consolidation',
  'preparation',
  'valeur',
  'circulation',
  'ressource',
  'fondation',
  'appropriation',
  'partenariat',
  'contrat',
  'terrain d’entente',
  "terrain d'entente",
  'harmonie',
  'joie',
  'renouveau'
];
const NEGATIVE_DECISION_HINTS = [
  'gel',
  'stase',
  'manque',
  'contrainte',
  'desordre',
  'choc',
  'heurt',
  'rupture',
  'chaos',
  'blocage',
  'retention',
  'avidite',
  'desequilibre',
  'rigidite',
  'orgueil',
  'combat mal choisi'
];
const IMMATURE_POSITIVE_HINTS = ['maturation', 'potentiel', 'attente', 'lent', 'progressive', 'progression', 'base', 'appui', 'ressource', 'gestation'];

const runeSignals = (rune) => {
  const keywords = (Array.isArray(rune?.positionKeywords) ? rune.positionKeywords : []).map((keyword) => toAscii(keyword));
  const positive = keywords.some((keyword) => POSITIVE_DECISION_HINTS.some((hint) => keyword.includes(hint)));
  const negative = keywords.some((keyword) => NEGATIVE_DECISION_HINTS.some((hint) => keyword.includes(hint)));
  const immaturePositive = keywords.some((keyword) => IMMATURE_POSITIVE_HINTS.some((hint) => keyword.includes(hint)));
  const method = getRuneMethodRule(rune);
  return { positive, negative, immaturePositive, keywords, method };
};

const scoreRunePosition = ({ signals, rune, position }) => {
  const weights = {
    past: 0.6,
    present: 1.8,
    future: 1.0
  };
  const weight = weights[position] || 1;
  let score = (signals.method?.score || 0) * weight;

  if (signals.positive) score += weight * 0.35;
  if (signals.negative) score -= weight * 0.45;
  if (signals.method?.closing && position !== 'past') score -= weight * 0.35;
  if (signals.method?.cautious && position !== 'past') score -= weight * 0.12;
  if ((signals.immaturePositive || signals.method?.slow) && position !== 'past') score -= weight * 0.35;
  if (rune?.isReversed) {
    score -= position === 'past' ? weight * 0.45 : weight * 0.9;
  }

  return score;
};

const applySpreadInteractions = ({ pastSignals, presentSignals, futureSignals, runes, scores }) => {
  const [pastRune, presentRune, futureRune] = runes;
  const nextScores = { ...scores };
  const names = [pastRune?.nom, presentRune?.nom, futureRune?.nom];

  const isConstructiveRelationshipSpread =
    ['Fehu', 'Gebo', 'Wunjo'].every((name) => names.includes(name)) ||
    ['Fehu', 'Sowilo', 'Tiwaz'].every((name) => names.includes(name)) ||
    ['Berkano', 'Tiwaz', 'Mannaz'].every((name) => names.includes(name)) ||
    ['Gebo', 'Wunjo', 'Ehwaz'].every((name) => names.includes(name)) ||
    ['Ansuz', 'Sowilo', 'Wunjo'].every((name) => names.includes(name)) ||
    ['Fehu', 'Gebo', 'Tiwaz'].every((name) => names.includes(name));

  const isMaturationSpread =
    ['Jera', 'Berkano', 'Fehu'].every((name) => names.includes(name)) ||
    ['Ingwaz', 'Berkano', 'Jera'].every((name) => names.includes(name));

  const isHardRestrictionSpread =
    ['Isa', 'Nauthiz', 'Hagalaz'].every((name) => names.includes(name)) ||
    ['Isa', 'Thurisaz', 'Nauthiz'].every((name) => names.includes(name));

  const isMovementUnderConstraint =
    ['Raidho', 'Ehwaz', 'Nauthiz'].every((name) => names.includes(name));

  if (isConstructiveRelationshipSpread && !runes.some((rune) => rune?.isReversed)) {
    nextScores.present += 0.28;
    nextScores.future += 0.2;
  }

  if (['Berkano', 'Tiwaz', 'Mannaz'].every((name) => names.includes(name)) && !runes.some((rune) => rune?.isReversed)) {
    nextScores.present += 0.16;
    nextScores.future += 0.14;
  }

  if (isMaturationSpread && !runes.some((rune) => rune?.isReversed)) {
    nextScores.present += 0.16;
    nextScores.future += 0.18;
  }

  if (isHardRestrictionSpread) {
    nextScores.present -= 0.22;
    nextScores.future -= 0.18;
  }

  if (isMovementUnderConstraint) {
    nextScores.future -= 0.12;
  }

  if (presentRune?.nom === 'Sowilo' && presentSignals.positive && !presentRune?.isReversed) {
    nextScores.present += 0.16;
  }

  if (presentRune?.nom === 'Gebo' && presentSignals.positive && !presentRune?.isReversed) {
    nextScores.present += 0.12;
  }

  if (futureRune?.nom === 'Tiwaz' && futureSignals.positive && !futureRune?.isReversed) {
    nextScores.future += 0.14;
  }

  if (futureRune?.nom === 'Jera' && !futureRune?.isReversed) {
    nextScores.future += 0.08;
  }

  if (futureRune?.nom === 'Berkano' && !futureRune?.isReversed) {
    nextScores.future += 0.08;
  }

  if (presentRune?.nom === 'Isa' && !presentRune?.isReversed) {
    nextScores.present -= 0.18;
  }

  if (presentRune?.nom === 'Nauthiz' && !presentRune?.isReversed) {
    nextScores.present -= 0.16;
  }

  if (presentRune?.nom === 'Hagalaz' && !presentRune?.isReversed) {
    nextScores.present -= 0.22;
  }

  return nextScores;
};

const clamp01 = (value) => Math.max(0, Math.min(1, value));

const buildSpreadSynthesis = ({
  pastScore,
  presentScore,
  futureScore,
  pastSignals,
  presentSignals,
  futureSignals,
  runes,
  presentBlocked,
  futureConfirms,
  futureBlocks
}) => {
  const reversedCount = runes.filter((rune) => rune?.isReversed).length;
  const hasSlowMaturation = Boolean(presentSignals.method?.slow || futureSignals.method?.slow);
  const hasUncertainty = Boolean(presentSignals.method?.uncertain || futureSignals.method?.uncertain);
  const support = clamp01(
    0.28 +
      Math.max(pastScore, 0) * 0.12 +
      Math.max(presentScore, 0) * 0.24 +
      Math.max(futureScore, 0) * 0.18 +
      (pastSignals.positive ? 0.05 : 0) +
      (presentSignals.positive ? 0.12 : 0) +
      (futureSignals.positive ? 0.08 : 0) +
      (futureConfirms ? 0.12 : 0) -
      reversedCount * 0.04
  );
  const friction = clamp01(
    0.2 +
      Math.max(-pastScore, 0) * 0.08 +
      Math.max(-presentScore, 0) * 0.28 +
      Math.max(-futureScore, 0) * 0.2 +
      (presentBlocked ? 0.22 : 0) +
      (futureBlocks ? 0.14 : 0) +
      reversedCount * 0.08 +
      (hasUncertainty ? 0.08 : 0)
  );
  const opening = clamp01(
    0.25 +
      Math.max(presentScore, 0) * 0.12 +
      Math.max(futureScore, 0) * 0.28 +
      (futureConfirms ? 0.22 : 0) +
      (presentSignals.positive ? 0.08 : 0) -
      (presentBlocked ? 0.12 : 0) -
      (futureBlocks ? 0.18 : 0) -
      (hasSlowMaturation ? 0.06 : 0)
  );

  let tone = 'mitige';
  if (support >= 0.66 && friction <= 0.42 && opening >= 0.52) {
    tone = 'porteur';
  } else if (support >= 0.52 && opening >= 0.42 && friction <= 0.58) {
    tone = 'ouvert_mais_retenu';
  } else if (hasSlowMaturation && opening >= 0.35 && friction <= 0.68) {
    tone = 'en_maturation';
  } else if (hasUncertainty && friction <= 0.72) {
    tone = 'en_clarification';
  } else if (friction >= 0.76 && opening <= 0.36) {
    tone = 'ferme_a_court_terme';
  } else if (friction >= 0.68 && opening >= 0.34) {
    tone = 'bloque_mais_non_sterile';
  } else if (friction >= 0.58) {
    tone = 'tendu';
  } else if (opening >= 0.48) {
    tone = 'en_reajustement';
  }

  const tonalResponse =
    tone === 'porteur'
      ? 'oui'
      : tone === 'ouvert_mais_retenu'
        ? 'oui_mais'
        : tone === 'en_maturation' || tone === 'en_clarification' || tone === 'en_reajustement'
          ? 'oui_mais'
          : tone === 'tendu' || tone === 'bloque_mais_non_sterile'
            ? 'non_pour_l_instant'
            : 'non_dans_les_conditions_actuelles';

  return {
    global_tone: tone,
    support_level: Number(support.toFixed(2)),
    friction_level: Number(friction.toFixed(2)),
    opening_level: Number(opening.toFixed(2)),
    tonal_response: tonalResponse
  };
};

const decideFromSpread = ({ lean, pastSignals, presentSignals, futureSignals, runes }) => {
  const baseScores = {
    past: scoreRunePosition({ signals: pastSignals, rune: runes[0], position: 'past' }),
    present: scoreRunePosition({ signals: presentSignals, rune: runes[1], position: 'present' }),
    future: scoreRunePosition({ signals: futureSignals, rune: runes[2], position: 'future' })
  };
  const adjustedScores = applySpreadInteractions({
    pastSignals,
    presentSignals,
    futureSignals,
    runes,
    scores: baseScores
  });
  const pastScore = adjustedScores.past;
  const presentScore = adjustedScores.present;
  const futureScore = adjustedScores.future;
  const presentBlocked = Boolean(runes[1]?.isReversed) || presentSignals.negative || presentScore <= -0.8;
  const presentOpen = !runes[1]?.isReversed && presentSignals.positive && presentScore > 0.6;
  const futureConfirms = !runes[2]?.isReversed && futureSignals.positive && futureScore > 0.4 && !futureSignals.method?.slow && !futureSignals.method?.uncertain;
  const futureBlocks = Boolean(runes[2]?.isReversed) || futureSignals.negative || futureScore <= -0.6;
  const totalScore = pastScore + presentScore + futureScore;
  const favorableButRetained = Boolean(
    (
      presentSignals.method?.slow ||
      futureSignals.method?.slow ||
      presentSignals.method?.uncertain ||
      futureSignals.method?.uncertain ||
      ((presentSignals.method?.cautious || futureSignals.method?.cautious) && (presentBlocked || futureBlocks))
    ) &&
      (presentBlocked || futureBlocks || !futureConfirms)
  );
  const positiveNeutralized = Boolean(
    ((pastSignals.positive || presentSignals.positive || futureSignals.positive) && (presentBlocked || futureBlocks)) ||
      (favorableButRetained && (presentBlocked || futureBlocks))
  );
  const synthesis = buildSpreadSynthesis({
    pastScore,
    presentScore,
    futureScore,
    pastSignals,
    presentSignals,
    futureSignals,
    runes,
    presentBlocked,
    futureConfirms,
    futureBlocks
  });

  let decision = 'oui_mais';

  if (synthesis.global_tone === 'porteur' && !presentBlocked && !futureBlocks) {
    decision = 'oui';
  } else if (synthesis.global_tone === 'ouvert_mais_retenu') {
    decision = 'oui_mais';
  } else if (synthesis.global_tone === 'en_maturation' || synthesis.global_tone === 'en_clarification' || synthesis.global_tone === 'en_reajustement') {
    decision = synthesis.support_level >= synthesis.friction_level ? 'oui_mais' : 'non_pour_l_instant';
  } else if (synthesis.global_tone === 'bloque_mais_non_sterile') {
    decision = 'non_pour_l_instant';
  } else if (synthesis.global_tone === 'ferme_a_court_terme') {
    decision = 'non_dans_les_conditions_actuelles';
  } else if (presentBlocked && futureBlocks) {
    decision = 'non_dans_les_conditions_actuelles';
  } else if (presentBlocked && !futureConfirms) {
    decision = totalScore < -1.2 ? 'peu_probable' : 'non_pour_l_instant';
  } else if (presentBlocked && futureConfirms) {
    decision = 'non_pour_l_instant';
  } else if (presentOpen && futureConfirms && !positiveNeutralized && totalScore >= 2) {
    decision = 'oui';
  } else if (futureBlocks && !presentOpen) {
    decision = lean === 'rather-no' || lean === 'unlikely' ? 'peu_probable' : 'non_pour_l_instant';
  } else if (lean === 'rather-no') {
    decision = futureConfirms && presentOpen ? 'oui_mais' : 'non_dans_les_conditions_actuelles';
  } else if (lean === 'unlikely') {
    decision = futureConfirms ? 'non_pour_l_instant' : 'peu_probable';
  } else if (totalScore < -0.8) {
    decision = 'non_pour_l_instant';
  } else if (totalScore >= 2.2 && presentOpen && futureConfirms) {
    decision = 'oui';
  } else if (favorableButRetained && decision === 'oui') {
    decision = 'oui_mais';
  }

  return {
    decision,
    pastScore,
    presentScore,
    futureScore,
    totalScore,
    presentBlocked,
    futureConfirms,
    futureBlocks,
    positiveNeutralized,
    favorableButRetained,
    synthesis
  };
};

const buildRoleLabels = ({ pastSignals, presentSignals, futureSignals, runes }) => {
  const past_role = pastSignals.negative ? 'contexte_tendu' : pastSignals.positive ? 'base_existante' : 'inertia_du_contexte';
  const present_role =
    runes[1]?.isReversed || presentSignals.negative
      ? 'frein_principal'
      : presentSignals.positive
        ? 'ouverture_actuelle'
        : 'tension_active';
  const future_role =
    runes[2]?.isReversed || futureSignals.negative
      ? 'report'
      : futureSignals.positive
        ? 'ouverture_conditionnelle'
        : 'stabilisation_progressive';

  return { past_role, present_role, future_role };
};

const buildDecisionAxis = (decision, topic, spreadDecision = null) => {
  if (spreadDecision?.positiveNeutralized) return 'ouverture_fragile_non_confirmee';
  if (decision === 'oui') return 'reprise_progressive';
  if (decision === 'oui_mais') return topic === 'price' ? 'ouverture_sous_contrainte' : 'potentiel_non_stabilise';
  if (decision === 'non_pour_l_instant') return 'fermeture_temporaire';
  if (decision === 'peu_probable') return 'cadre_qui_se_maintient';
  return 'mouvement_freine';
};

const buildDecisionBlock = (topic, subtype = 'generic') => {
  if (topic === 'price') return subtype === 'discount' ? 'cadre_deja_pose' : 'manque_de_marge';
  if (topic === 'work') return subtype === 'finance' ? 'effort_disproportionne' : 'potentiel_non_stabilise';
  if (topic === 'relationship') return 'flou_non_resolu';
  if (topic === 'admin') return subtype === 'benefit' ? 'confirmation_manquante' : subtype === 'dossier' ? 'piece_manquante' : 'contrainte_exterieure';
  return 'maintien_de_l_existant';
};

const buildDecisionLever = (topic, subtype = 'generic') => {
  if (topic === 'price') return subtype === 'travel' ? 'compromis' : 'demande_plus_franche';
  if (topic === 'work') return subtype === 'finance' ? 'restructuration' : 'choix_plus_net';
  if (topic === 'relationship') return 'clarification';
  if (topic === 'admin') return subtype === 'benefit' ? 'validation_a_obtenir' : subtype === 'dossier' ? 'relance_ou_retour' : 'clarifier_un_point';
  return 'ajustement_necessaire';
};

const buildSpreadDynamics = ({ runes = [], scores = {}, pastSignals, presentSignals, futureSignals, spreadDecision, decision }) => {
  const entries = [
    { rune: runes[0], position: 'past', score: scores.past ?? 0, signals: pastSignals },
    { rune: runes[1], position: 'present', score: scores.present ?? 0, signals: presentSignals },
    { rune: runes[2], position: 'future', score: scores.future ?? 0, signals: futureSignals }
  ];

  const dominantEntry =
    [...entries]
      .sort((a, b) => {
        const primary = Math.abs(b.score) - Math.abs(a.score);
        if (primary !== 0) return primary;
        const presentBias = (b.position === 'present') - (a.position === 'present');
        if (presentBias !== 0) return presentBias;
        return b.score - a.score;
      })[0] || null;

  const limitingEntry =
    [...entries]
      .filter((entry) => entry.rune?.isReversed || entry.score < 0 || entry.signals?.negative || entry.signals?.method?.closing || entry.signals?.method?.slow)
      .sort((a, b) => a.score - b.score)[0] || null;

  const dominantMeta = RUNE_ANALYSIS_METADATA[dominantEntry?.rune?.nom] || {};
  const limitingMeta = RUNE_ANALYSIS_METADATA[limitingEntry?.rune?.nom] || {};

  let dynamic = 'instability';
  if (spreadDecision?.presentBlocked && spreadDecision?.futureBlocks) {
    dynamic = 'blockage';
  } else if (spreadDecision?.futureBlocks || spreadDecision?.favorableButRetained || spreadDecision?.synthesis?.global_tone === 'en_maturation') {
    dynamic = 'delay';
  } else if (decision === 'oui' || spreadDecision?.synthesis?.global_tone === 'porteur' || spreadDecision?.futureConfirms) {
    dynamic = 'progression';
  }

  const realMovementFr =
    dynamic === 'progression'
      ? "un mouvement concret est déjà engagé"
      : dynamic === 'delay'
        ? "quelque chose bouge, mais avec du retard ou un passage plus lent"
        : dynamic === 'blockage'
          ? "le mouvement réel reste bloqué pour l’instant"
          : "quelque chose avance, mais de manière instable";

  const illusionFr =
    dynamic === 'progression'
      ? "le risque serait de croire que tout tiendra tout seul"
      : dynamic === 'delay'
        ? "le risque serait de prendre un délai pour un refus définitif"
        : dynamic === 'blockage'
          ? "le risque serait de confondre attente et vraie ouverture"
          : "le risque serait de confondre un élan ponctuel avec quelque chose de stable";

  const holdingBackFr = limitingEntry?.rune?.nom
    ? `${limitingEntry.rune.nom.toLowerCase()} retient surtout la suite`
    : "le frein principal reste diffus mais réel";

  const realMovementEn =
    dynamic === 'progression'
      ? 'a concrete movement is already underway'
      : dynamic === 'delay'
        ? 'something is moving, but with delay or slower follow-through'
        : dynamic === 'blockage'
          ? 'the real movement is still blocked for now'
          : 'something is moving, but in an unstable way';

  const illusionEn =
    dynamic === 'progression'
      ? 'the risk is to think it will hold on its own'
      : dynamic === 'delay'
        ? 'the risk is to mistake delay for a final no'
        : dynamic === 'blockage'
          ? 'the risk is to mistake waiting for a real opening'
          : 'the risk is to mistake a brief push for something stable';

  const holdingBackEn = limitingEntry?.rune?.nom
    ? `${limitingEntry.rune.nom} is what mainly holds the next step back`
    : 'the main limit stays real, even if it is less sharply defined';

  return {
    dominant_rune: dominantEntry?.rune?.nom || null,
    dominant_position: dominantEntry?.position || null,
    dominant_signature_fr: formatRuneAnalysisLabelFr(dominantEntry?.rune, 'dominant', dominantMeta),
    dominant_signature_en: formatRuneAnalysisLabelEn(dominantEntry?.rune, 'dominant', dominantMeta),
    limiting_rune: limitingEntry?.rune?.nom || null,
    limiting_position: limitingEntry?.position || null,
    limiting_signature_fr: formatRuneAnalysisLabelFr(limitingEntry?.rune, 'limiting', limitingMeta),
    limiting_signature_en: formatRuneAnalysisLabelEn(limitingEntry?.rune, 'limiting', limitingMeta),
    dynamic,
    real_movement_fr: realMovementFr,
    illusion_fr: illusionFr,
    holding_back_fr: holdingBackFr,
    real_movement_en: realMovementEn,
    illusion_en: illusionEn,
    holding_back_en: holdingBackEn
  };
};

export const buildHeuristicRuneDecision = ({ question = '', runes = [], locale = 'fr' }) => {
  const question_category = detectQuestionCategory(question);
  const topic = detectQuestionTopic(question);
  const subtype =
    topic === 'price'
      ? detectPriceSubtype(question)
      : topic === 'work'
        ? detectWorkSubtype(question)
        : topic === 'relationship'
          ? detectRelationshipSubtype(question)
          : topic === 'admin'
            ? detectAdminSubtype(question)
            : 'generic';
  const lean = detectClosedQuestionLean(question, runes);
  const pastSignals = runeSignals(runes[0] || {});
  const presentSignals = runeSignals(runes[1] || {});
  const futureSignals = runeSignals(runes[2] || {});
  const spreadDecision = decideFromSpread({ lean, pastSignals, presentSignals, futureSignals, runes });
  const decision =
    question_category === 'factuelle_brute' || question_category === 'mal_adaptee_au_tirage'
      ? 'non_dans_les_conditions_actuelles'
      : spreadDecision.decision;
  const question_handling = detectQuestionHandling(question);
  const { past_role, present_role, future_role } = buildRoleLabels({ pastSignals, presentSignals, futureSignals, runes });
  const methodBlock =
    spreadDecision.presentBlocked || presentSignals.method?.closing
      ? presentSignals.method?.block
      : spreadDecision.futureBlocks || spreadDecision.favorableButRetained
        ? futureSignals.method?.block
        : '';
  const closure_level =
    spreadDecision.synthesis.global_tone === 'porteur' || decision === 'oui'
      ? 'low'
      : decision === 'oui_mais' || decision === 'non_pour_l_instant'
        ? 'medium'
        : 'high';
  const confidence = Math.max(
    0.58,
    Math.min(0.86, 0.68 + Math.min(Math.abs(spreadDecision.totalScore), 2.4) * 0.05 - (spreadDecision.positiveNeutralized ? 0.05 : 0))
  );
  const confidence_level = confidence >= 0.78 ? 'high' : confidence >= 0.66 ? 'medium' : 'low';

  return {
    question_category,
    question_handling,
    decision,
    confidence,
    confidence_level,
    past_role,
    present_role,
    future_role,
    dominant_axis: buildDecisionAxis(decision, topic, spreadDecision),
    main_block: methodBlock || buildDecisionBlock(topic, subtype),
    main_lever: buildDecisionLever(topic, subtype),
    closure_level,
    global_tone: spreadDecision.synthesis.global_tone,
    support_level: spreadDecision.synthesis.support_level,
    friction_level: spreadDecision.synthesis.friction_level,
    opening_level: spreadDecision.synthesis.opening_level,
    tonal_response: spreadDecision.synthesis.tonal_response,
    internal_synthesis: {
      teneur: spreadDecision.synthesis.global_tone,
      soutien: spreadDecision.synthesis.support_level,
      frein: spreadDecision.synthesis.friction_level,
      ouverture: spreadDecision.synthesis.opening_level,
      ton:
        spreadDecision.synthesis.global_tone === 'porteur'
          ? 'ouvert et confiant'
          : spreadDecision.synthesis.global_tone === 'ferme_a_court_terme'
            ? 'franc et digne'
            : spreadDecision.synthesis.global_tone === 'tendu'
              ? 'lucide et respirable'
              : 'nuancé et humain',
      reponse_courte: decision
    },
    is_positive_rune_neutralized: spreadDecision.positiveNeutralized,
    future_confirms_outcome: spreadDecision.futureConfirms,
    position_weighting: {
      past: Number(spreadDecision.pastScore.toFixed(2)),
      present: Number(spreadDecision.presentScore.toFixed(2)),
      future: Number(spreadDecision.futureScore.toFixed(2))
    },
    rune_dynamics: buildSpreadDynamics({
      runes,
      scores: {
        past: spreadDecision.pastScore,
        present: spreadDecision.presentScore,
        future: spreadDecision.futureScore
      },
      pastSignals,
      presentSignals,
      futureSignals,
      spreadDecision,
      decision
    }),
    tone_free: 'direct',
    tone_paid: 'deeper',
    topic,
    subtype
  };
};

export const buildForcedSummaryLead = ({ question = '', runes = [], locale = 'fr' }) => {
  const decision = buildHeuristicRuneDecision({ question, runes, locale });
  return buildFreeLeadFromDecision(decision, question, runes, locale);

  if (normalizeLocale(locale) === 'en') {
    return 'It looks possible, but not on a steady footing yet.';
  }

  const category = detectQuestionCategory(question);
  if (category === 'factuelle_brute') {
    return ensureSentence("La question appelle d’abord une vérification concrète plus qu’un verdict runique direct");
  }

  if (category === 'mal_adaptee_au_tirage') {
    return ensureSentence("Dans cette forme, la question se prête mal à une réponse runique directe");
  }

  const subject = adaptSubjectForReadingFr(extractQuestionSubjectFr(question));
  const shape = inferQuestionShape(question);

  if (shape !== 'fermée') {
    return ensureSentence(
      pickVariant(question, [
        subject
          ? `${subject.charAt(0).toUpperCase() + subject.slice(1)} peut avancer, mais pas encore sur une base assez stable`
          : "La situation peut avancer, mais pas encore sur une base assez stable",
        subject
          ? `${subject.charAt(0).toUpperCase() + subject.slice(1)} peut prendre forme, mais le mouvement reste encore instable`
          : "Le mouvement peut prendre forme, mais il reste encore instable"
      ])
    );
  }

  const lean = detectClosedQuestionLean(question, runes);
  const topic = detectQuestionTopic(question);

  if (topic === 'price') {
    const subtype = detectPriceSubtype(question);

    if (subtype === 'discount') {
      if (lean === 'rather-no' || lean === 'unlikely') {
        return ensureSentence("Une vraie réduction ne semble pas être ce qui se dessine en premier");
      }

      return ensureSentence("Il peut y avoir un léger ajustement, mais plutôt à la marge qu’une vraie remise");
    }

    if (subtype === 'travel') {
      if (lean === 'rather-no' || lean === 'unlikely') {
        return ensureSentence("Non, un tarif vraiment avantageux ne semble pas se présenter facilement");
      }

      return ensureSentence("Oui, tu peux sans doute en trouver à un prix correct, mais pas dans les conditions les plus avantageuses");
    }

    if (subtype === 'purchase') {
      if (lean === 'rather-no' || lean === 'unlikely') {
        return ensureSentence("Non, cet achat ne semble pas se dessiner simplement pour l’instant");
      }

      return ensureSentence("Oui, cet achat reste faisable, mais pas encore de la manière la plus simple");
    }

    if (lean === 'rather-no' || lean === 'unlikely') {
      return ensureSentence("Une vraie baisse ne semble pas se dessiner");
    }

    if (lean === 'yes-likely' || lean === 'likely') {
      return ensureSentence("Oui, tu peux sans doute trouver quelque chose de correct, mais pas au meilleur prix");
    }

    return ensureSentence("Oui, mais plutôt avec un compromis qu’avec une vraie bonne affaire");
  }

  if (topic === 'work') {
    const subtype = detectWorkSubtype(question);

    if (subtype === 'finance') {
      if (lean === 'rather-no' || lean === 'unlikely') {
        return ensureSentence("Non, pas au point de parler d’un vrai retour à l’équilibre pour l’instant");
      }

      if (lean === 'yes-likely' || lean === 'likely') {
        return ensureSentence("Oui, un mieux semble possible, mais pas encore comme un vrai retour à flot");
      }

      return ensureSentence("Oui, un mieux reste possible, mais encore trop fragile pour parler d’équilibre");
    }

    if (subtype === 'visibility') {
      if (lean === 'rather-no' || lean === 'unlikely') {
        return ensureSentence("Non, pas de manière assez nette pour transformer cela en vrai appui");
      }

      if (lean === 'yes-likely' || lean === 'likely') {
        return ensureSentence("Oui, cela peut relancer quelque chose, mais pas encore de façon assez solide");
      }

      return ensureSentence("Oui, cela peut aider, mais pas encore au point de tout débloquer");
    }

    if (subtype === 'activity') {
      if (lean === 'rather-no' || lean === 'unlikely') {
        return ensureSentence("Non, pas de manière assez nette pour parler d’un vrai décollage");
      }

      if (lean === 'yes-likely' || lean === 'likely') {
        return ensureSentence("Oui, ça peut avancer, mais pas encore comme quelque chose de vraiment installé");
      }

      return ensureSentence("Oui, ça peut avancer, mais pas encore au point de te stabiliser vraiment");
    }

    if (lean === 'rather-no' || lean === 'unlikely') {
      return ensureSentence("Non, pas de manière assez nette pour te sécuriser vraiment");
    }

    if (lean === 'yes-likely' || lean === 'likely') {
      return ensureSentence("Oui, un mieux semble possible, mais pas encore comme base solide");
    }

    return ensureSentence("Oui, ça peut avancer, mais pas encore au point de te stabiliser vraiment");
  }

  if (topic === 'relationship') {
    const subtype = detectRelationshipSubtype(question);

    if (subtype === 'return') {
      if (lean === 'rather-no' || lean === 'unlikely') {
        return ensureSentence("Non, un vrai retour ne semble pas se dessiner clairement pour l’instant");
      }

      if (lean === 'yes-likely' || lean === 'likely') {
        return ensureSentence("Oui, un rapprochement reste possible, mais pas de façon simple");
      }

      return ensureSentence("Oui, mais pas encore sur quelque chose de clair ou de stable");
    }

    if (subtype === 'bond') {
      if (lean === 'rather-no' || lean === 'unlikely') {
        return ensureSentence("Non, pas sur quelque chose d’assez réciproque pour tenir vraiment");
      }

      if (lean === 'yes-likely' || lean === 'likely') {
        return ensureSentence("Oui, le lien peut évoluer, mais pas encore dans une forme vraiment lisible");
      }

      return ensureSentence("Oui, mais avec trop de flou pour parler d’un mouvement simple");
    }

    if (lean === 'rather-no' || lean === 'unlikely') {
      return ensureSentence("Non, un vrai retour ne semble pas se dessiner clairement pour l’instant");
    }

    if (lean === 'yes-likely' || lean === 'likely') {
      return ensureSentence("Oui, un rapprochement reste possible, mais pas de façon simple");
    }

    return ensureSentence("Oui, mais pas encore sur quelque chose de clair ou de stable");
  }

  if (topic === 'admin') {
    const subtype = detectAdminSubtype(question);

    if (subtype === 'benefit') {
      if (lean === 'rather-no' || lean === 'unlikely') {
        return ensureSentence("Pour l’instant, non, cela ne se débloque pas franchement");
      }

      if (lean === 'yes-likely' || lean === 'likely') {
        return ensureSentence("Oui, mais lentement, et seulement si un retour ou une validation arrive");
      }

      return ensureSentence("Une ouverture existe, mais elle reste suspendue à un retour ou à une validation");
    }

    if (subtype === 'dossier') {
      if (lean === 'rather-no' || lean === 'unlikely') {
        return ensureSentence("Pour l’instant, non, ton dossier ne se débloque pas franchement");
      }

      if (lean === 'yes-likely' || lean === 'likely') {
        return ensureSentence("Oui, mais par étape, et seulement si un point manquant est repris clairement");
      }

      return ensureSentence("Le plus probable, c’est une avancée partielle avant une vraie résolution");
    }

    if (subtype === 'legal') {
      if (lean === 'rather-no' || lean === 'unlikely') {
        return ensureSentence("Non, cela ne semble pas tourner franchement en ta faveur pour l’instant");
      }

      if (lean === 'yes-likely' || lean === 'likely') {
        return ensureSentence("Oui, une issue favorable reste possible, mais pas sans tension ni délai");
      }

      return ensureSentence("Oui, mais dans un cadre encore trop contraint pour être tranquille");
    }

    if (lean === 'rather-no' || lean === 'unlikely') {
      return ensureSentence("Pour l’instant, non, cela ne se débloque pas franchement");
    }

    if (lean === 'yes-likely' || lean === 'likely') {
      return ensureSentence("Oui, mais lentement, et pas sans retour ou clarification");
    }

    return ensureSentence("Une ouverture existe, mais elle dépend encore d’un retour ou d’un point à clarifier");
  }

  if (lean === 'rather-no') {
    return ensureSentence(
      "Non, cela ne semble pas se dessiner clairement pour l’instant"
    );
  }

  if (lean === 'unlikely') {
    return ensureSentence(
      "Non, cela paraît peu probable pour l’instant"
    );
  }

  if (lean === 'yes-likely') {
    return ensureSentence(
      "Oui, cela paraît probable, mais pas dans les meilleures conditions"
    );
  }

  if (lean === 'likely') {
    return ensureSentence(
      "Oui, cela paraît probable, mais avec une marge encore réduite"
    );
  }

  return ensureSentence("Oui, mais plutôt avec des limites qu’avec une vraie marge");
};

export const buildFreeLeadFromDecision = (decision, question, runes, locale = 'fr') => {
  const category = decision?.question_category || detectQuestionCategory(question);
  const handling = decision?.question_handling || detectQuestionHandling(question);

  if (handling === 'refuse') {
    return ensureSentence("Cette question demande d’abord une aide concrète et immédiate, pas une réponse de tirage");
  }

  if (handling === 'reframe' || category === 'factuelle_brute' || category === 'mal_adaptee_au_tirage') {
    return ensureSentence("La question appelle d’abord une vérification concrète plutôt qu’un verdict runique direct");
  }

  if (handling === 'soften') {
    if (decision?.global_tone === 'porteur') {
      return ensureSentence(pickCopy(question, 'porteur'));
    }

    if (decision?.global_tone === 'ouvert_mais_retenu') {
      return ensureSentence(pickCopy(question, 'ouvert_mais_retenu'));
    }

    return ensureSentence(pickCopy(question, decision?.global_tone || 'en_clarification'));
  }

  if (decision?.global_tone === 'porteur') {
    return ensureSentence(pickCopy(question, 'porteur'));
  }

  if (decision?.global_tone === 'ouvert_mais_retenu') {
    return ensureSentence(pickCopy(question, 'ouvert_mais_retenu'));
  }

  if (decision?.global_tone === 'en_maturation') {
    return ensureSentence(pickCopy(question, 'en_maturation'));
  }

  if (decision?.global_tone === 'en_clarification') {
    return ensureSentence(pickCopy(question, 'en_clarification'));
  }

  if (decision?.global_tone === 'en_reajustement') {
    return ensureSentence(pickCopy(question, 'en_reajustement'));
  }

  if (decision?.global_tone === 'tendu' || decision?.global_tone === 'bloque_mais_non_sterile') {
    return ensureSentence(pickCopy(question, 'tendu'));
  }

  if (decision?.global_tone === 'ferme_a_court_terme') {
    return ensureSentence(pickCopy(question, 'ferme_a_court_terme'));
  }

  if (decision?.decision === 'oui') {
    return ensureSentence(pickCopy(question, 'porteur'));
  }

  if (decision?.decision === 'oui_mais') {
    return ensureSentence(pickCopy(question, 'ouvert_mais_retenu'));
  }

  if (decision?.decision === 'non_pour_l_instant') {
    return ensureSentence("Non, pas pour l’instant");
  }

  if (decision?.decision === 'peu_probable') {
    return ensureSentence("Non, cela paraît peu probable");
  }

  if (decision?.decision === 'non_dans_les_conditions_actuelles') {
    return ensureSentence("Non, pas dans les conditions actuelles");
  }

  return ensureSentence(pickCopy(question, 'mitige'));
};

export const createFreeReadingSummary = ({ runes, question = '', locale = 'fr', decision = null, theme = 'situation' }) => {
  if (normalizeLocale(locale) === 'en') {
    const loweredQuestion = toAscii(question);
    const financeTopic =
      loweredQuestion.includes('financ') ||
      loweredQuestion.includes('money') ||
      loweredQuestion.includes('income') ||
      loweredQuestion.includes('client') ||
      loweredQuestion.includes('project');

    const intro = ensureSentence(
      financeTopic
        ? 'The situation can move, but it is not turning into steady financial ground yet'
        : 'The situation is not closed, but it has not found a steady footing yet'
    );
    const tension = ensureSentence(
      'What matters most right now lies in the present, where the situation still tightens or holds back'
    );
    const opening = ensureSentence(
      'The future stays open, but only if what is beginning to form can be carried in a clearer and steadier way'
    );

    return [intro, tension, opening].join(' ');
  }

  const category = decision?.question_category || detectQuestionCategory(question);
  const intro = buildFreeLeadFromDecision(decision, question, runes, locale);
  const topic = detectQuestionTopic(question);
  const isSupportiveTone = decision?.global_tone === 'porteur' || decision?.global_tone === 'ouvert_mais_retenu';

  let nuance = '';
  let closing = '';

  if (category === 'factuelle_brute') {
    nuance = "Le tirage ne confirme pas ici un fait brut ; il éclaire plutôt le rapport à l’information, au doute ou au besoin de vérification";
    closing = "Le plus juste ici reste donc de vérifier le fait, puis de revenir au tirage seulement s’il reste quelque chose à éclairer";
    return [ensureSentence(intro), ensureSentence(nuance), ensureSentence(closing)].join(' ');
  }

  if (category === 'mal_adaptee_au_tirage') {
    nuance = "Le tirage parle ici davantage de clarté, de formulation ou de besoin de recul que d’un verdict à donner tel quel";
    closing = "Tant que la question reste posée ainsi, la lecture risque surtout de tourner autour sans aller au vrai point";
    return [ensureSentence(intro), ensureSentence(nuance), ensureSentence(closing)].join(' ');
  }

  if (topic === 'price') {
    const subtype = detectPriceSubtype(question);
    if (subtype === 'discount') {
      nuance = isSupportiveTone
        ? "Une marge existe, même si elle ne ressemble pas forcément à une remise large ou immédiate"
        : "Le cadre paraît déjà assez posé pour ne laisser qu’une petite marge de négociation";
      closing = isSupportiveTone
        ? "Le plus probable ici, c’est donc un ajustement limité plutôt qu’une vraie remise nette"
        : "Sans demande très claire, le tarif risque surtout de rester proche de ce qui est déjà posé";
    } else if (subtype === 'travel') {
      nuance =
        decision?.decision === 'non_pour_l_instant' ||
        decision?.decision === 'peu_probable' ||
        decision?.decision === 'non_dans_les_conditions_actuelles'
          ? "Le bon tarif paraît retenu par une contrainte de moment, de choix ou de conditions"
          : "Il y a ici une contrainte qui oblige à chercher plus finement ou à accepter un compromis";
      closing =
        decision?.decision === 'non_pour_l_instant' ||
        decision?.decision === 'peu_probable' ||
        decision?.decision === 'non_dans_les_conditions_actuelles'
          ? "Sans plus de marge ou de souplesse, la bonne option risque encore de t’échapper"
          : "La bonne option peut se trouver, mais plutôt au prix d’un compromis";
    } else if (subtype === 'purchase') {
      nuance =
        decision?.decision === 'non_pour_l_instant' ||
        decision?.decision === 'peu_probable' ||
        decision?.decision === 'non_dans_les_conditions_actuelles'
          ? "Le bon moment paraît encore retenu par une contrainte de prix, de priorité ou de marge"
          : "Quelque chose peut se débloquer, mais pas sans une contrainte de timing, de prix ou de priorité";
      closing = "Sans meilleur timing ou plus de marge, cet achat risque surtout d’être repoussé";
    } else {
      nuance = pickVariant(question, [
        "Il y a une option correcte à trouver, mais pas forcément au prix ou au cadre que tu voudrais d’emblée",
        "La bonne option semble accessible, mais plutôt avec un compromis qu’avec un avantage clair"
      ]);
      closing = pickVariant(question, [
        "Ce qui bloque ici, c’est surtout une contrainte de prix, de timing ou de conditions qui mérite d’être regardée de plus près",
        "La bonne option paraît accessible, mais pas encore de la manière la plus simple"
      ]);
    }
  } else if (topic === 'work') {
    const subtype = detectWorkSubtype(question);
    if (subtype === 'finance') {
      nuance =
        isSupportiveTone || decision?.decision === 'oui'
          ? "Le mouvement paraît assez porteur pour remettre de la marge, même si tout n’est pas encore réglé"
          : "Quelque chose peut repartir, mais pas encore assez largement pour absorber tout ce qui pèse";
      closing =
        isSupportiveTone || decision?.decision === 'oui'
          ? "La suite peut donc aller vers un vrai mieux, à condition que ce qui revient tienne dans la durée"
          : "Sans changement sur ce point, l’amélioration risque de rester trop courte pour vraiment te soulager";
    } else if (subtype === 'visibility') {
      nuance =
        isSupportiveTone || decision?.decision === 'oui'
          ? "Le mouvement peut produire un effet réel si la ligne reste claire"
          : "Le mouvement peut repartir, mais pas encore d’une manière assez tenue pour produire un vrai effet durable";
      closing =
        isSupportiveTone || decision?.decision === 'oui'
          ? "La suite peut donc porter davantage, à condition que la ligne reste nette"
          : "Sinon, cela risque surtout de créer de l’intérêt sans produire un vrai appui durable";
    } else if (subtype === 'activity') {
      nuance =
        isSupportiveTone || decision?.decision === 'oui'
          ? "Les appuis sont là, mais ils demandent encore à être tenus avec régularité"
          : "Quelque chose peut repartir, mais ce n’est pas encore assez solide pour rassurer vraiment";
      closing =
        isSupportiveTone || decision?.decision === 'oui'
          ? "Le projet peut donc avancer, mais il devra encore gagner en tenue pour devenir vraiment solide"
          : "Sans cap plus net, cela risque surtout d’avancer sans vraiment se stabiliser";
    } else {
      nuance = pickVariant(question, [
        "Le potentiel est là, mais il ne suffit pas encore à rendre l’ensemble vraiment stable",
        "Quelque chose bouge, mais ce n’est pas encore assez solide pour rassurer pleinement"
      ]);
      closing = pickVariant(question, [
        "Le plus probable ici, c’est une avancée réelle mais encore incomplète",
        "Sans meilleur appui, cela risque surtout de rester prometteur sans devenir vraiment stable"
      ]);
    }
  } else if (topic === 'relationship') {
    const subtype = detectRelationshipSubtype(question);
    if (subtype === 'return') {
      nuance = "Quelque chose peut se rejouer, mais pas tant que le lien reste aussi mal clarifié";
      closing = "Tant que cela ne se clarifie pas, ce retour risque surtout de rester intermittent ou confus";
    } else if (subtype === 'bond') {
      nuance = "Le lien peut évoluer, mais pas encore d’une manière simple ou pleinement réciproque";
      closing = "Sans vraie mise au clair, le lien risque de continuer sans vraiment se stabiliser";
    } else {
      nuance = pickVariant(question, [
        "Quelque chose peut avancer, mais pas sans plus de clarté dans ce qui est réellement partagé",
        "Le lien peut évoluer, mais pas encore d’une manière simple ou pleinement réciproque"
      ]);
      closing = pickVariant(question, [
        "Sans clarification, la relation risque surtout de rester inégale ou floue",
        "La suite peut aller dans le bon sens, mais seulement si quelque chose se dit plus franchement"
      ]);
    }
  } else if (topic === 'admin') {
    const subtype = detectAdminSubtype(question);
    if (subtype === 'benefit') {
      nuance = "Le dossier n’est pas fermé, mais il reste retenu par quelque chose qui n’est pas encore validé, repris ou confirmé clairement";
      closing = "Le plus probable ici, c’est une avancée lente, avec une amélioration partielle avant vraie résolution si le retour attendu arrive";
    } else if (subtype === 'dossier') {
      nuance = "Le blocage paraît moins fermé que suspendu : quelque chose manque encore, ou attend d’être repris, corrigé ou confirmé avant vraie avancée";
      closing = "La suite peut avancer, mais plutôt par étape que d’un seul coup, avec un déblocage conditionnel plus qu’une résolution immédiate";
    } else if (subtype === 'legal') {
      nuance = "Il y a une marge, mais elle dépend surtout d’un arbitrage ou d’une réponse extérieure qui ne se pose pas vite";
      closing = "La suite semble donc lente et sous contrainte, avec une issue possible mais pas totalement libre ni immédiate";
    } else {
      nuance = pickVariant(question, [
        "Une issue reste possible, mais quelque chose reste en attente d’un retour, d’une confirmation ou d’un point repris clairement",
        "Il y a une marge, mais elle dépend encore d’un verrou externe, d’un document, d’une information ou d’une réponse qui manque"
      ]);
      closing = pickVariant(question, [
        "Le plus probable ici, c’est une avancée partielle avant une vraie résolution",
        "Sans retour clair sur ce point, la situation risque de rester retenue plus longtemps"
      ]);
    }
  } else {
    nuance = isSupportiveTone
      ? "Il y a un appui réel dans le tirage, même si tout n’est pas encore complètement posé"
      : pickVariant(question, [
          "Quelque chose peut avancer, mais pas de la manière la plus simple",
          "La réponse va plutôt dans ce sens, mais avec une marge encore étroite"
        ]);
    closing = isSupportiveTone
      ? "La suite peut donc aller dans le bon sens, mais elle demandera encore un point d’appui plus net"
      : pickVariant(question, [
          "Le plus probable ici, c’est une avancée limitée tant que rien ne se clarifie",
          "Sans changement sur le point sensible, la situation risque de rester retenue"
        ]);
  }

  return [ensureSentence(intro), ensureSentence(nuance), ensureSentence(closing)].join(' ');
};

export const createTeaserFallback = ({ runes, locale = 'fr', decision = null, theme = 'situation' }) =>
  normalizeLocale(locale) === 'en'
    ? 'The first answer points in a direction, but it does not yet show what really keeps the situation from settling or turning. The deeper reading goes into that missing piece, and that is where the real shift becomes clearer.'
    : decision?.question_category === 'factuelle_brute'
        ? `Le point utile n’est pas de trancher le fait à la place d’une vérification, mais de voir ce que cette question active dans le rapport à l’information et au besoin de certitude. C’est cette pièce manquante que la lecture approfondie vient vraiment éclairer.`
      : decision?.question_category === 'mal_adaptee_au_tirage'
        ? `Le point utile n’est pas de forcer un verdict, mais de voir ce que la forme même de la question empêche encore de lire correctement. C’est là que la lecture approfondie devient utile.`
        : decision?.global_tone === 'porteur'
          ? `Quelque chose va déjà dans le bon sens, mais on ne voit pas encore ce qui ferait tenir cette ouverture au lieu de la laisser simplement prometteuse. C’est précisément ce point que la lecture approfondie vient trancher.`
          : decision?.global_tone === 'en_maturation'
            ? `Quelque chose prend forme, mais on ne voit pas encore à quel moment cela se met vraiment à tenir, ou au contraire à retomber. C’est ce passage que la lecture approfondie vient regarder de près.`
        : decision?.global_tone === 'en_clarification'
              ? `La réponse commence à se préciser, mais il manque encore le moment où tout bascule vraiment dans un sens plus net. C’est ce point-là que la lecture approfondie vient éclairer.`
        : decision?.main_block
          ? `Tu vois déjà dans quel sens la situation penche, mais on ne voit pas encore comment ${formatDecisionLabel(decision.main_block)} vient retenir la suite dans les faits. C’est ce point précis que la lecture approfondie vient éclairer.`
          : `Tu vois déjà dans quel sens la situation penche, mais on ne voit pas encore ce qui fera basculer la suite d’un côté ou de l’autre. C’est là que la lecture approfondie devient nécessaire.`;

const buildFallbackQuestion = (question) => {
  const lowered = question.toLowerCase();

  if (lowered.includes('video') || lowered.includes('vidéo') || lowered.includes('reseaux') || lowered.includes('réseaux') || lowered.includes('instagram') || lowered.includes('contenu')) {
    return "Qu'est-ce qui, dans ta manière d'envisager cette reprise, empêche encore de transformer cette visibilité en un appui vraiment stable ?";
  }

  if (lowered.includes('financ') || lowered.includes('argent') || lowered.includes('activité') || lowered.includes('activite') || lowered.includes('liberale') || lowered.includes('libérale')) {
    return "Qu'est-ce qui, dans ta manière de chercher la sécurité, risque encore d'affaiblir ce que tu essaies de construire ?";
  }

  if (lowered.includes('couple') || lowered.includes('mari') || lowered.includes('amour') || lowered.includes('relation') || lowered.includes('flora') || lowered.includes('emilie') || lowered.includes('ex')) {
    return "Qu'est-ce qui, dans ce lien, reste encore trop flou pour que tu puisses vraiment le situer ?";
  }

  if (lowered.includes('toujours') || lowered.includes('meme') || lowered.includes('même') || lowered.includes('repete') || lowered.includes('répète')) {
    return "Qu'est-ce qui, dans ce mécanisme, reste encore actif sans être pleinement identifié ?";
  }

  if (lowered.includes('choix') || lowered.includes('decider') || lowered.includes('décider') || lowered.includes('je continue') || lowered.includes('bonne idée') || lowered.includes('bonne idee')) {
    return "Qu'est-ce qui, dans ce choix, ne peut pas encore être posé sans regarder plus franchement ce que tu refuses de perdre ?";
  }

  return "Qu'est-ce qui, ici, reste encore hors de portée tant que tu le regardes de trop loin ?";
};

export const createFullReadingFallback = ({ question, runes, locale = 'fr', decision = null, theme = 'situation' }) =>
  normalizeLocale(locale) === 'en'
    ? `Something real is already in place here, even if it does not settle the whole question on its own.\n\nWhat matters most now is the active knot in the present. That is what gives the answer its real tone. In practical terms, this should name one concrete behaviour, reaction or consequence that fits this exact context and not another one.\n\nThe next shift depends less on pushing for an outcome than on dealing with that point more clearly.`
    : (() => {
        const handling = decision?.question_handling || detectQuestionHandling(question);

        if (handling === 'refuse') {
          return "Cette question demande d’abord une aide concrète et immédiate, au-delà d’une lecture symbolique.\n\nLe tirage ne doit pas remplacer une action directe, un soutien réel ou un cadre de sécurité. Il faut d’abord chercher l’appui le plus concret disponible, puis seulement revenir à une lecture plus fine si la situation le permet.";
        }

        if (decision?.question_category === 'factuelle_brute') {
          return "Cette question appelle d’abord une vérification concrète plutôt qu’un verdict symbolique.\n\nLe tirage ne remplace pas un fait vérifiable ; il éclaire surtout le rapport à l’information, au doute ou au besoin de clarté. Reviens d’abord à une source fiable avant de charger cette question d’un sens plus large.";
        }

        if (decision?.question_category === 'mal_adaptee_au_tirage') {
          return "Dans cette forme, la question ne se prête pas bien à une réponse runique directe.\n\nL’enjeu n’est pas encore formulé de manière assez claire pour recevoir une réponse vraiment utile. Il faut d’abord préciser ce qui est réellement demandé, afin que le tirage éclaire la situation au lieu de forcer un simple verdict.";
        }

        const synthesis = decision?.internal_synthesis || {};
        const tone = decision?.global_tone || synthesis.teneur || 'mitige';
        const pastRole = decision?.past_role || 'base_existante';
        const presentRole = decision?.present_role || 'tension_active';
        const futureRole = decision?.future_role || 'ouverture_conditionnelle';
        const reserveWeight = getReserveWeight(decision);
        const situation = buildSituationSpecificityFr(question);
        const pluralSituation = isPluralSituationFr(situation.subject);
        const block = formatDecisionLabel(decision?.main_block);
        const lever = formatDecisionLabel(decision?.main_lever);
        const scene = buildNonInterchangeableSceneFr(question, decision);
        const responseShape = pickVariant(`${question}:${tone}:${decision?.question_category || ''}`, [
          'direct',
          'progressive',
          'conditional',
          'open'
        ]);
        const block1 = (() => {
          if (pastRole === 'contexte_tendu') {
            return `${situation.subject.charAt(0).toUpperCase() + situation.subject.slice(1)} arrive déjà avec un poids ancien. Il y a eu de la tension, de la fatigue ou un contexte compliqué, et cela continue à peser sur la suite.`;
          }

        if (pastRole === 'inertia_du_contexte') {
            return `${situation.subject.charAt(0).toUpperCase() + situation.subject.slice(1)} ${pluralSituation ? 'partent' : 'part'} d’un cadre déjà posé. Cela donne une base, mais cela ralentit aussi le changement si rien ne bouge vraiment.`;
        }

          if (tone === 'porteur') {
            return `Il y a déjà une vraie base autour de ${situation.subject}. Ce n’est pas une simple idée ou une projection : quelque chose tient déjà et peut soutenir la suite.`;
          }

          return `Quelque chose est déjà engagé autour de ${situation.subject}. La base existe, mais elle ne suffit pas encore à rendre la suite vraiment simple ou sûre.`;
        })();

        const block2 = (() => {
          if (presentRole === 'ouverture_actuelle' && tone === 'porteur') {
            return reserveWeight === 'minor'
              ? `En ce moment, le mouvement va plutôt dans le bon sens. ${situation.subject.charAt(0).toUpperCase() + situation.subject.slice(1)} peut donc avancer, et le point à régler reste secondaire : il sert surtout à rendre la suite plus fluide.`
              : `En ce moment, l’ouverture est bien là, mais elle devra encore être tenue dans le concret pour que ${situation.subject} ne reste pas au stade d’un bon élan.`;
          }

          if (tone === 'ouvert_mais_retenu' && presentRole !== 'frein_principal') {
            return reserveWeight === 'minor' || reserveWeight === 'moderate'
              ? `En ce moment, l’ouverture reste plus forte que la réserve. ${block.charAt(0).toUpperCase() + block.slice(1)} demande surtout un réglage plus net, sans renverser le sens général du tirage.`
              : `En ce moment, quelque chose soutient encore l’ouverture, mais ${block} en retient une part bien réelle dans ${situation.subject}.`;
          }

          if (presentRole === 'frein_principal' || tone === 'tendu' || tone === 'ferme_a_court_terme') {
            return `Pour l’instant, le plus lourd vient surtout ${withDeFr(block)}. C’est ce point qui resserre ${situation.subject} et qui empêche la suite de se débloquer simplement.`;
          }

          return `Pour l’instant, rien n’annule l’ouverture, mais ${block} la retient encore. Tant que ce point reste en place, ${situation.subject} ${pluralSituation ? 'avanceront' : 'avancera'} sans vraie fluidité.`;
        })();

        const block3 = (() => {
          if (tone === 'porteur' && reserveWeight === 'minor') {
            return `La suite peut donc aller plus loin. Le plus probable ici, c’est une confirmation progressive, à condition de garder ${lever} pour donner plus de tenue à ${situation.subject}.`;
          }

          if (tone === 'ouvert_mais_retenu' && reserveWeight !== 'major' && reserveWeight !== 'blocking') {
            return `La suite peut aller dans le bon sens, mais elle ne se fixera pas seule. Si ${lever} se fait vraiment, l’ouverture a des chances de devenir plus nette ; sinon, cela restera irrégulier.`;
          }

          if (futureRole === 'report') {
            return `La suite risque d’être plus lente que prévu. Sans ${lever}, le plus probable est un décalage plutôt qu’une vraie avancée.`;
          }

          if (futureRole === 'stabilisation_progressive') {
            return `La suite peut se construire, mais plutôt dans la durée. Il y a des chances que cela prenne forme progressivement si ${lever} reste tenu dans les faits.`;
          }

          return `La suite se jouera surtout sur ${lever}. Si ce point bouge, ${situation.subject} peut évoluer plus nettement ; sinon, l’ouverture restera surtout partielle.`;
        })();

        const p1 = ensureSentence(block1);
        const p2 = ensureSentence(block2);
        const sceneSentence = ensureSentence(scene);
        const sceneLead = sceneSentence.charAt(0).toUpperCase() + sceneSentence.slice(1);
        const p3 = `${sceneLead} ${ensureSentence(block3)}`.trim();

        if (responseShape === 'direct') {
          return [`${p1} ${p2}`.trim(), p3].join('\n\n');
        }

        if (responseShape === 'conditional') {
          return [p1, `${p2} ${p3}`.trim()].join('\n\n');
        }

        if (responseShape === 'open') {
          return [
            p1,
            lowerFirst(p2).charAt(0).toUpperCase() + lowerFirst(p2).slice(1),
            p3
          ].join('\n\n');
        }

        return [p1, p2, p3].join('\n\n');
      })();

export const getSummarySystemPrompt = (locale = 'fr') =>
  normalizeLocale(locale) === 'en' ? SUMMARY_SYSTEM_PROMPT_EN : SUMMARY_SYSTEM_PROMPT;

export const getTeaserSystemPrompt = (locale = 'fr') =>
  normalizeLocale(locale) === 'en' ? TEASER_SYSTEM_PROMPT_EN : TEASER_SYSTEM_PROMPT;

export const getFullSystemPrompt = (locale = 'fr') =>
  normalizeLocale(locale) === 'en' ? FULL_READING_SYSTEM_PROMPT_EN : FULL_READING_SYSTEM_PROMPT;

export const getSummaryUserPrompt = ({ question, runes, locale = 'fr', theme = 'situation' }) =>
  normalizeLocale(locale) === 'en'
    ? buildSummaryUserPromptEn({ question, runes, theme })
    : buildSummaryUserPrompt({ question, runes, theme });

export const getTeaserUserPrompt = ({ question, runes, locale = 'fr', theme = 'situation' }) =>
  normalizeLocale(locale) === 'en'
    ? buildTeaserUserPromptEn({ question, runes, theme })
    : buildTeaserUserPrompt({ question, runes, theme });

export const getFullUserPrompt = ({ question, runes, locale = 'fr', theme = 'situation' }) =>
  normalizeLocale(locale) === 'en'
    ? buildFullReadingUserPromptEn({ question, runes, theme })
    : buildFullReadingUserPrompt({ question, runes, theme });

export const getSummaryUserPromptWithDecision = ({ question, runes, locale = 'fr', decision = null, theme = 'situation' }) => {
  return normalizeLocale(locale) === 'en'
    ? buildCompactSummaryPromptEn({ question, runes, locale, decision, theme })
    : buildCompactSummaryPromptFr({ question, runes, locale, decision, theme });
};

export const getTeaserUserPromptWithDecision = ({ question, runes, locale = 'fr', decision = null, theme = 'situation' }) => {
  return normalizeLocale(locale) === 'en'
    ? buildCompactTeaserPromptEn({ question, runes, locale, decision, theme })
    : buildCompactTeaserPromptFr({ question, runes, locale, decision, theme });
};

export const getFullUserPromptWithDecision = ({ question, runes, locale = 'fr', decision = null, theme = 'situation' }) => {
  return normalizeLocale(locale) === 'en'
    ? buildCompactFullPromptEn({ question, runes, locale, decision, theme })
    : buildCompactFullPromptFr({ question, runes, locale, decision, theme });
};

export const PROMPT_MANAGEMENT_REGISTRY = {
  free_summary: {
    key: PROMPT_MANAGEMENT_KEYS.free_summary,
    getSystemPrompt: getSummarySystemPrompt,
    getUserPrompt: getSummaryUserPromptWithDecision
  },
  full_reading: {
    key: PROMPT_MANAGEMENT_KEYS.full_reading,
    getSystemPrompt: getFullSystemPrompt,
    getUserPrompt: getFullUserPromptWithDecision
  },
  reframe_reading: {
    key: PROMPT_MANAGEMENT_KEYS.reframe_reading,
    getSystemPrompt: null,
    getUserPrompt: null
  }
};
