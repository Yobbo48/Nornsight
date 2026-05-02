const QUESTION_LENSES = [
  {
    label: 'administrative ou juridique',
    keywords: ['caf', 'proces', 'procès', 'justice', 'jugement', 'dossier', 'plainte', 'avocat', 'tribunal']
  },
  {
    label: 'professionnelle ou financiere',
    keywords: [
      'travail',
      'pro',
      'profession',
      'activité',
      'activite',
      'financ',
      'argent',
      'client',
      'liberale',
      'libérale',
      'carriere',
      'carrière'
    ]
  },
  {
    label: 'affective ou relationnelle',
    keywords: [
      'couple',
      'mari',
      'femme',
      'amour',
      'emilie',
      'dialogue',
      'dialoguer',
      'comprendre avec',
      'se comprenne',
      'se comprendre',
      'ex',
      'relation',
      'reciproque',
      'réciproque'
    ]
  }
];

const QUESTION_FORMS = [
  {
    label: 'floue ou diffuse',
    keywords: [
      'je sais pas trop',
      'j arrive pas a savoir',
      'j’arrive pas à savoir',
      'j ai l impression',
      'j’ai l’impression',
      'sensation bizarre',
      'je vois pas',
      'je comprends pas'
    ]
  },
  {
    label: 'binaire ou tranchee',
    keywords: ['ou pas', 'c est mort', 'c’est mort', 'je continue', 'je fais quoi', 'je me plante', 'bonne idee']
  },
  {
    label: 'contradictoire ou ambivalente',
    keywords: [
      'mais en meme temps',
      'mais en même temps',
      'j ai envie',
      'j’ai envie',
      'je veux',
      'j ose pas',
      'j’ose pas',
      'j y arrive pas',
      'j’y arrive pas'
    ]
  },
  {
    label: 'liee a un schema repetitif',
    keywords: ['toujours', 'encore', 'je repete', 'je répète', 'meme erreurs', 'mêmes erreurs', 'ca finit pareil', 'ça finit pareil']
  },
  {
    label: 'chargee emotionnellement',
    keywords: ['je me sens', 'nul', 'de trop', 'ca me touche', 'ça me touche', 'ca me rend fou', 'ça me rend fou', 'tout gacher', 'tout gâcher']
  },
  {
    label: 'longue et melangee',
    keywords: ['en gros', 'a cote', 'à côté', 'sauf que', 'du coup', 'depuis un moment', 'depuis des mois']
  }
];

const GROUNDING_NOTES = {
  'administrative ou juridique':
    "Reste concret. Parle de blocage, d'issue, de pression, de marge ou de posture a tenir. N'invente pas de detail de procedure, de delai ou de document si la question ne le nomme pas.",
  'professionnelle ou financiere':
    "Reste concret. Parle d'argent, de revenus, d'activite, de cap, de stabilite, de fatigue, d'engagement ou de decision. Si la question nomme une activite, un projet, des videos ou plusieurs projets en cours, garde ces reperes visibles dans la lecture. N'invente pas de detail operationnel ou administratif qui n'est pas clairement soutenu par la question.",
  'affective ou relationnelle':
    "Reste concret. Parle de reciprocite, distance, non-dit, desir, ecoute, malaise, attente ou lien. N'emploie pas un vocabulaire flou ou poetique.",
  personnelle:
    "Reste concret. Parle de ce qui bloque, de ce qui insiste, et de ce qui demande un vrai ajustement. N'emploie pas un vocabulaire flou ou poetique."
};

const FORM_NOTES = {
  'floue ou diffuse':
    "Aide a nommer l'enjeu sans singer le flou de la question. Fais sentir que quelque chose est reel, meme si ce n'est pas encore clair.",
  'binaire ou tranchee':
    "Ne reponds pas par oui/non. Deplace la lecture vers ce qui rend la situation plus complexe qu'une reponse tranchee.",
  'contradictoire ou ambivalente':
    "Mets en valeur la tension entre deux mouvements contraires. Fais sentir l'ambivalence sans la juger.",
  'liee a un schema repetitif':
    "Fais apparaitre le motif qui se repete, la fatigue qu'il produit, et ce qui cherche a casser ce cycle.",
  'chargee emotionnellement':
    "Reste simple et juste. N'en rajoute pas. Reconnais la charge ressentie sans dramatiser ni consoler de facon creuse.",
  'longue et melangee':
    "Trie l'enjeu central au milieu des details. Reformule le vrai noeud sans reprendre toute la question."
};

const QUESTION_SHAPE_NOTES = {
  fermée:
    "Quand la question est fermée ou prédictive, donne une orientation réelle. Ne réponds pas par oui ou non sec, mais fais sentir une tendance claire, avec sa limite ou sa condition.",
  ouverte:
    "Quand la question est ouverte, ne reste pas dans l'ambiance générale. Reformule l'enjeu et fais apparaître une direction lisible."
};

const EXAMPLE_DIRECTIONS = {
  'professionnelle ou financiere':
    "Direction de ton utile : montrer l'ecart entre potentiel, engagement reel, stabilite, revenus, regularite, charge de travail et passage a l'action. Si la question porte sur une activite precise, des videos, un projet, plusieurs projets en cours ou une source de revenus, appuie-toi dessus concretement.",
  'affective ou relationnelle':
    "Direction de ton utile : montrer l'ecart entre attachement, reciprocite, clarte, projection, non-dit ou difficulte a lacher.",
  'administrative ou juridique':
    "Direction de ton utile : montrer l'ecart entre issue souhaitee, contraintes reelles, rapport de force, marge de manoeuvre et posture a tenir.",
  personnelle:
    "Direction de ton utile : montrer l'ecart entre ce qui bouge, ce qui resiste, et ce qui n'est pas encore regarde franchement."
};

const QUESTION_TYPE_CALIBRATIONS_FR = {
  relationnel: {
    summary:
      "Calibration relationnelle : reponse claire, incarnee, emotionnelle mais concrete. Parle de comportements reels : retour, message, silence, distance, rapprochement, malaise, reprise du contact, blocage concret. Ne flotte pas dans le ressenti general.",
    full:
      "Calibration relationnelle approfondie : montre si le lien tient vraiment, ce qui revient par cycles, ce qui relance la tension, et ce qui depend des limites posees ou non. Fais sentir la realite du lien, pas une ambiance abstraite."
  },
  professionnel: {
    summary:
      "Calibration pro : sois lisible, concret et oriente action. Parle d'interet, de clients, d'offre, de conversion, de cap, de regularite, de fatigue, de passage a l'action. Va droit a l'effet reel dans la vie pro.",
    full:
      "Calibration pro approfondie : montre ce qui attire sans convertir, ce qui tient dans le temps, ce qui use, ce qui demande d'etre clarifie ou tenu. Le levier doit etre exploitable, pas conceptuel."
  },
  finances: {
    summary:
      "Calibration finances : va vers la clarte, le timing et le concret. Parle d'argent qui rentre, de delai, de reequilibrage, d'attente, de marge, de stabilite ou d'instabilite. Ne reste pas flou.",
    full:
      "Calibration finances approfondie : montre si la remise en place est progressive, ce qui freine les rentrees, ce qui reste tendu, et a quel rythme la stabilite peut revenir. Pas d'abstraction psychologique."
  },
  administratif: {
    summary:
      "Calibration administratif : reste ancre dans le reel. Parle de dossier, de reponse, de relance, de delai, d'etape qui traine, de blocage externe, d'inertie administrative. Pas de symbolisme.",
    full:
      "Calibration administratif approfondie : explique ce qui bloque sans faire de roman. Dis si c'est retenu, suspendu, en attente, ou lent mais non ferme. Fais sentir ce qui depend d'un retour exterieur et ce qui ne depend pas de la personne."
  },
  decision: {
    summary:
      "Calibration decision personnelle : donne une direction claire, sans ton moraliste. Dis si continuer freine, si changer ouvre, si rester ne tient plus. Ne contourne pas la question.",
    full:
      "Calibration decision approfondie : montre ce que la personne accepte encore, ce qui la retient, et ce que la suite coute si rien ne change. Reste direct, sans juger."
  },
  timing: {
    summary:
      "Calibration temps et evolution : donne un vrai rythme. Dis si c'est bientot, pas tout de suite, lent, bloque par phases, ou en train de bouger. Le temps doit se sentir dans la reponse.",
    full:
      "Calibration temps et evolution approfondie : montre la progression reelle, ce qui ralentit, ce qui repart, ce qui demande encore du temps, et ce qui peut accelerer ou figer la suite."
  },
  general: {
    summary:
      "Calibration generale : reponse concrete, pas de flou, pas de texte generique. Fais reconnaitre la situation a la personne en peu de mots.",
    full:
      "Calibration generale approfondie : va plus loin que le gratuit en montrant ce qui tient la situation, ce qui la freine, et ce qui pourrait vraiment la faire basculer."
  }
};

const QUESTION_TYPE_CALIBRATIONS_EN = {
  relationnel: {
    summary:
      "Relationship calibration: clear, embodied, emotional but concrete. Speak through real behaviours: messages, silence, distance, reconnection, tension, mixed signals, repeated contact.",
    full:
      "Relationship deep-reading calibration: show whether the bond truly holds, what comes back in cycles, what reactivates the tension, and what depends on clear limits being set."
  },
  professionnel: {
    summary:
      "Work calibration: be readable, concrete and action-linked. Speak about interest, clients, offers, conversion, direction, consistency, effort and follow-through.",
    full:
      "Work deep-reading calibration: show what attracts without converting, what can hold over time, what drains energy, and what needs to be clarified or held more firmly."
  },
  finances: {
    summary:
      "Money calibration: go for clarity, timing and practical reality. Speak about incoming money, delay, rebalancing, waiting, margin, stability or instability.",
    full:
      "Money deep-reading calibration: show whether the recovery is gradual, what delays income, what still feels tight, and at what pace stability may return."
  },
  administratif: {
    summary:
      "Administrative calibration: stay grounded in real life. Speak about a file, an answer, a follow-up, delays, steps dragging on, outside blockage or system inertia.",
    full:
      "Administrative deep-reading calibration: explain what is blocked without drifting into symbolism. Say whether it is delayed, suspended, waiting on a reply, or slow but not closed."
  },
  decision: {
    summary:
      "Personal decision calibration: give a clear direction without sounding moralistic. Say if staying keeps the person stuck, if changing opens something, or if the current path no longer holds.",
    full:
      "Personal decision deep-reading calibration: show what the person is still tolerating, what keeps holding them back, and what the situation costs if nothing changes."
  },
  timing: {
    summary:
      "Timing calibration: give a real sense of pace. Say if it is soon, not yet, slow, blocked in waves, or genuinely moving.",
    full:
      "Timing deep-reading calibration: show the real progression, what slows it down, what starts moving again, what still needs time, and what could speed up or freeze the next step."
  },
  general: {
    summary:
      "General calibration: concrete answer, no vagueness, no generic wording. The person should recognise their situation in very few lines.",
    full:
      "General deep-reading calibration: go beyond the free reading by naming what holds the situation in place, what slows it down, and what could truly shift it."
  }
};

const EMOTIONAL_STATE_CALIBRATIONS_FR = {
  doute: {
    summary:
      "État émotionnel : doute ou hésitation. Garde un ton posé, clair, explicatif, sans dramatiser. Aide la personne à comprendre ce qu'elle vit sans la brusquer.",
    full:
      "État émotionnel : doute ou hésitation. Garde une voix calme, structurante et lisible. Éclaire sans appuyer trop fort. Le rythme doit rassurer par la clarté."
  },
  incertitude: {
    summary:
      "État émotionnel : incertitude avec besoin de réponse. Sois plus direct, plus tranché, moins explicatif. Donne une vraie orientation rapidement.",
    full:
      "État émotionnel : incertitude avec besoin de réponse. Va plus vite au point central. Coupe les détours inutiles. La personne cherche surtout à savoir où ça va."
  },
  detresse: {
    summary:
      "État émotionnel : charge émotionnelle forte. Reste ancré, humain et sobre. Ne mens pas, ne dramatise pas davantage, mais évite toute brutalité gratuite.",
    full:
      "État émotionnel : charge émotionnelle forte. La lecture doit rester humaine, contenante et nette. Reconnais la souffrance sans l'exploiter. Dis la vérité avec plus de tenue que de dureté."
  },
  projection: {
    summary:
      "État émotionnel : projection ou envie d'avancer. Tu peux donner plus d'élan, tout en restant réaliste. Fais sentir ce qui peut se construire et à quelle condition.",
    full:
      "État émotionnel : projection ou envie d'avancer. Garde un ton plus allant, plus moteur, mais sans survendre. Montre ce qui peut vraiment prendre forme si la ligne est tenue."
  },
  frustration: {
    summary:
      "État émotionnel : frustration ou blocage. Sois direct, concret, explicatif. N'adoucis pas inutilement ce qui coince. Aide à voir le vrai frein.",
    full:
      "État émotionnel : frustration ou blocage. Mets le doigt sur ce qui bloque réellement, sans tourner autour. Le ton doit être franc, lisible et utile."
  },
  decision: {
    summary:
      "État émotionnel : besoin de trancher. Sois clair, assumé, sans détour. La personne veut une direction plus qu'une longue explication.",
    full:
      "État émotionnel : besoin de trancher. Garde une voix nette et assumée. Montre la direction, ce qu'elle demande, et ce que coûte l'inaction."
  },
  neutre: {
    summary:
      "État émotionnel : calme relatif. Réponse simple, humaine et concrète, avec une intensité ajustée au sujet.",
    full:
      "État émotionnel : calme relatif. Lecture nette, humaine et concrète, sans en faire trop dans un sens ou dans l'autre."
  }
};

const EMOTIONAL_STATE_CALIBRATIONS_EN = {
  doute: {
    summary:
      "Emotional state: doubt or hesitation. Keep the tone calm, clear and lightly explanatory, without dramatising.",
    full:
      "Emotional state: doubt or hesitation. Keep the voice calm, steady and easy to follow. Clarity matters more than intensity."
  },
  incertitude: {
    summary:
      "Emotional state: uncertainty and need for an answer. Be more direct, more decisive, less explanatory.",
    full:
      "Emotional state: uncertainty and need for an answer. Reach the core point faster. Cut unnecessary detours."
  },
  detresse: {
    summary:
      "Emotional state: strong emotional strain. Stay grounded, human and sober. Do not lie, do not dramatise, and avoid unnecessary harshness.",
    full:
      "Emotional state: strong emotional strain. The reading should stay human, steady and clear. Acknowledge the pain without exploiting it."
  },
  projection: {
    summary:
      "Emotional state: projection or desire to move forward. You may give a little more momentum, while staying realistic.",
    full:
      "Emotional state: projection or desire to move forward. Keep a more forward-moving tone, but do not oversell. Show what can genuinely be built."
  },
  frustration: {
    summary:
      "Emotional state: frustration or blockage. Be direct, concrete and explanatory. Do not soften the blockage for no reason.",
    full:
      "Emotional state: frustration or blockage. Put your finger on what is actually stuck. The tone should be frank, readable and useful."
  },
  decision: {
    summary:
      "Emotional state: need to decide. Be clear, firm and without detours. The person wants direction more than commentary.",
    full:
      "Emotional state: need to decide. Keep a clear and assumed voice. Show the direction, what it asks for, and the cost of not moving."
  },
  neutre: {
    summary:
      "Emotional state: relatively calm. Keep the answer simple, human and concrete, with intensity adjusted to the subject.",
    full:
      "Emotional state: relatively calm. Keep the reading clear, human and concrete, without overplaying it."
  }
};

const QUESTION_STOP_WORDS = new Set([
  'alors', 'avec', 'avoir', 'bientot', 'bientôt', 'comment', 'dans', 'depuis', 'dois', 'doit',
  'donc', 'elle', 'elles', 'entre', 'est', 'estce', 'etre', 'être', 'faire', 'faut', 'fois',
  'juste', 'leur', 'leurs', 'mais', 'meme', 'même', 'mon', 'plus', 'pour', 'pourquoi',
  'quand', 'que', 'quel', 'quelle', 'quelles', 'quels', 'quoi', 'sans', 'sera', 'serait',
  'sont', 'sous', 'sur', 'toi', 'ton', 'tout', 'tous', 'tres', 'très', 'une', 'vers',
  'vont', 'vrai', 'vraie', 'vraiment', 'vais', 'va', 'estce', 'ou', 'pas', 'qui', 'dans',
  'cela', 'ça', 'ca', 'quelque', 'chose', 'situation', 'traverse', 'traverses', 'moment'
]);

const toAscii = (value = '') =>
  String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

export const inferQuestionLens = (question) => {
  const lowered = question.toLowerCase();
  const scored = QUESTION_LENSES.map(({ label, keywords }) => ({
    label,
    score: keywords.reduce((total, keyword) => total + (lowered.includes(keyword) ? 1 : 0), 0)
  })).sort((a, b) => b.score - a.score);

  return scored[0]?.score > 0 ? scored[0].label : 'personnelle';
};

export const inferQuestionForm = (question) => {
  const lowered = question.toLowerCase();
  const scored = QUESTION_FORMS.map(({ label, keywords }) => ({
    label,
    score: keywords.reduce((total, keyword) => total + (lowered.includes(keyword) ? 1 : 0), 0)
  })).sort((a, b) => b.score - a.score);

  return scored[0]?.score > 0 ? scored[0].label : 'directe';
};

export const inferQuestionShape = (question) => {
  const lowered = question.toLowerCase();

  if (
    lowered.includes('est-ce que') ||
    lowered.includes('est ce que') ||
    lowered.includes('vais-je') ||
    lowered.includes('vais je') ||
    lowered.includes('ou pas') ||
    lowered.includes('c est mort') ||
    lowered.includes('c’est mort')
  ) {
    return 'fermée';
  }

  return 'ouverte';
};

export const detectQuestionCategory = (question = '') => {
  const lowered = toAscii(question);
  const normalReadingMarkers = [
    'peut devenir',
    'devenir une source de revenus',
    'devenir rentable',
    'va evoluer',
    'va t il evoluer',
    'va t elle evoluer',
    'comment va evoluer',
    'comment evoluera',
    'dans les mois a venir',
    'dans les mois',
    'cette annee',
    'ma situation',
    'mon projet',
    'notre lien',
    'mes finances',
    'mon activite',
    'ma vie personnelle',
    'ma vie pro',
    'ma relation',
    'pour moi dans les mois'
  ];

  if (normalReadingMarkers.some((marker) => lowered.includes(marker))) {
    if (lowered.includes('comment va evoluer') || lowered.includes('comment evoluera')) {
      return 'evolution';
    }

    if (lowered.includes('dans les mois') || lowered.includes('cette annee')) {
      return 'timing';
    }

    return inferQuestionShape(question) === 'fermée' ? 'decisionnelle' : 'evolution';
  }

  if (
    (lowered.includes('est ce que') || lowered.includes('est-ce que')) &&
    (
      lowered.includes('mort') ||
      lowered.includes('decede') ||
      lowered.includes('evenement') ||
      lowered.includes('eu lieu') ||
      lowered.includes('est il mort') ||
      lowered.includes('est elle morte') ||
      lowered.includes('est il decede') ||
      lowered.includes('est elle decedee') ||
      lowered.includes('a t il eu lieu') ||
      lowered.includes('a t elle eu lieu')
    )
  ) {
    return 'factuelle_brute';
  }

  if (
    lowered.length < 8 ||
    lowered === 'oui ou non' ||
    lowered === 'vrai ou faux' ||
    lowered.includes('donne moi la verite') ||
    lowered.includes('repond juste oui ou non')
  ) {
    return 'mal_adaptee_au_tirage';
  }

  if (
    lowered.includes('quand') ||
    lowered.includes('en juin') ||
    lowered.includes('cette annee') ||
    lowered.includes('cet ete') ||
    lowered.includes('dans les mois')
  ) {
    return 'timing';
  }

  if (
    lowered.includes('relation') ||
    lowered.includes('ex') ||
    lowered.includes('couple') ||
    lowered.includes('amour') ||
    lowered.includes('mari') ||
    lowered.includes('femme')
  ) {
    return 'relationnelle';
  }

  if (
    lowered.includes('je me sens') ||
    lowered.includes('pourquoi je me sens') ||
    lowered.includes('pourquoi ca me touche') ||
    lowered.includes('emotion')
  ) {
    return 'emotionnelle';
  }

  if (lowered.includes('comment va evoluer') || lowered.includes('comment evoluera')) {
    return 'evolution';
  }

  if (
    lowered.includes('dois je') ||
    lowered.includes('dois-je') ||
    lowered.includes('vais je') ||
    lowered.includes('vais-je') ||
    lowered.includes('est ce que je dois')
  ) {
    return 'decisionnelle';
  }

  return inferQuestionShape(question) === 'fermée' ? 'decisionnelle' : 'evolution';
};

export const detectQuestionHandling = (question = '') => {
  const lowered = toAscii(question);
  const normalReadingMarkers = [
    'peut devenir',
    'va evoluer',
    'va t il evoluer',
    'va t elle evoluer',
    'dans les mois a venir',
    'dans les mois',
    'cette annee',
    'ma situation',
    'mon projet',
    'notre lien',
    'mes finances',
    'mon activite',
    'ma vie personnelle',
    'ma relation',
    'ma situation pro',
    'ma situation financiere',
    'source de revenus',
    'rentable'
  ];

  if (
    lowered.includes('danger immediat') ||
    lowered.includes('urgence vitale') ||
    lowered.includes('me suicider') ||
    lowered.includes('suicide')
  ) {
    return 'refuse';
  }

  if (normalReadingMarkers.some((marker) => lowered.includes(marker))) {
    return 'allow';
  }

  if (
    lowered.includes('sante') ||
    lowered.includes('diagnostic') ||
    lowered.includes('maladie') ||
    lowered.includes('grossesse') ||
    lowered.includes('enceinte') ||
    lowered.includes('deces') ||
    lowered.includes('decede') ||
    lowered.includes('disparition') ||
    lowered.includes('justice') ||
    lowered.includes('tribunal') ||
    lowered.includes('proces') ||
    lowered.includes('danger') ||
    lowered.includes('urgence')
  ) {
    return 'soften';
  }

  const category = detectQuestionCategory(question);
  if (category === 'factuelle_brute' || category === 'mal_adaptee_au_tirage') {
    return 'reframe';
  }

  return 'allow';
};

export const buildGroundingNote = (question) => {
  const lens = inferQuestionLens(question);
  return GROUNDING_NOTES[lens] || GROUNDING_NOTES.personnelle;
};

export const buildFormNote = (question) => {
  const form = inferQuestionForm(question);
  return FORM_NOTES[form] || "Va droit au noeud de la situation, sans surjouer ni aplatir ce qui est en train de se vivre.";
};

export const buildExampleDirection = (question) => {
  const lens = inferQuestionLens(question);
  return EXAMPLE_DIRECTIONS[lens] || EXAMPLE_DIRECTIONS.personnelle;
};

const buildQuestionAnchors = (question) => {
  const normalized = question
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s'-]/g, ' ');

  const tokens = normalized
    .split(/\s+/)
    .map((token) => token.replace(/^['-]+|['-]+$/g, ''))
    .filter((token) => token.length >= 4 && !QUESTION_STOP_WORDS.has(token));

  return [...new Set(tokens)].slice(0, 6);
};

export const buildAnchorNote = (question) => {
  const anchors = buildQuestionAnchors(question);
  if (!anchors.length) {
    return "Aucun ancrage lexical fort n'est isolé. Reste toutefois collé au sujet exact de la question.";
  }

  return `Ancrages concrets à reprendre ou reformuler clairement : ${anchors.join(', ')}.`;
};

export const buildShapeNote = (question) =>
  QUESTION_SHAPE_NOTES[inferQuestionShape(question)] || QUESTION_SHAPE_NOTES.ouverte;

const detectQuestionCalibrationType = (question = '') => {
  const category = detectQuestionCategory(question);
  const lens = inferQuestionLens(question);

  if (category === 'relationnelle' || lens === 'affective ou relationnelle') {
    return 'relationnel';
  }

  if (category === 'timing' || category === 'evolution') {
    return 'timing';
  }

  if (category === 'decisionnelle') {
    if (lens === 'professionnelle ou financiere') {
      return 'professionnel';
    }
    return 'decision';
  }

  if (lens === 'administrative ou juridique') {
    return 'administratif';
  }

  if (lens === 'professionnelle ou financiere') {
    const lowered = toAscii(question);
    if (
      lowered.includes('argent') ||
      lowered.includes('financ') ||
      lowered.includes('revenu') ||
      lowered.includes('stabilite') ||
      lowered.includes('stabilité') ||
      lowered.includes('caf')
    ) {
      return 'finances';
    }
    return 'professionnel';
  }

  return 'general';
};

export const buildQuestionTypeCalibrationFr = (question, stage = 'summary') => {
  const type = detectQuestionCalibrationType(question);
  const bucket = QUESTION_TYPE_CALIBRATIONS_FR[type] || QUESTION_TYPE_CALIBRATIONS_FR.general;
  return bucket[stage === 'full' ? 'full' : 'summary'];
};

export const buildQuestionTypeCalibrationEn = (question, stage = 'summary') => {
  const type = detectQuestionCalibrationType(question);
  const bucket = QUESTION_TYPE_CALIBRATIONS_EN[type] || QUESTION_TYPE_CALIBRATIONS_EN.general;
  return bucket[stage === 'full' ? 'full' : 'summary'];
};

const detectEmotionalState = (question = '') => {
  const lowered = toAscii(question);
  const form = inferQuestionForm(question);
  const category = detectQuestionCategory(question);

  if (
    form === 'chargee emotionnellement' ||
    lowered.includes('souffr') ||
    lowered.includes('j en peux plus') ||
    lowered.includes('je n en peux plus') ||
    lowered.includes('mal') ||
    lowered.includes('detresse') ||
    lowered.includes('détresse')
  ) {
    return 'detresse';
  }

  if (
    form === 'floue ou diffuse' ||
    lowered.includes('est ce que') ||
    lowered.includes('vais je') ||
    lowered.includes('j attends') ||
    lowered.includes('besoin de savoir')
  ) {
    return 'incertitude';
  }

  if (
    form === 'binaire ou tranchee' ||
    category === 'decisionnelle' ||
    lowered.includes('dois je') ||
    lowered.includes('quitter') ||
    lowered.includes('continuer')
  ) {
    return 'decision';
  }

  if (
    form === 'contradictoire ou ambivalente' ||
    lowered.includes('je sais pas') ||
    lowered.includes('j hesite') ||
    lowered.includes('j hésite')
  ) {
    return 'doute';
  }

  if (
    form === 'liee a un schema repetitif' ||
    lowered.includes('rien n avance') ||
    lowered.includes('bloque') ||
    lowered.includes('bloqué') ||
    lowered.includes('frustr')
  ) {
    return 'frustration';
  }

  if (
    lowered.includes('construire') ||
    lowered.includes('developper') ||
    lowered.includes('développer') ||
    lowered.includes('avancer') ||
    lowered.includes('solide') ||
    lowered.includes('projet')
  ) {
    return 'projection';
  }

  return 'neutre';
};

export const buildEmotionalStateCalibrationFr = (question, stage = 'summary') => {
  const state = detectEmotionalState(question);
  const bucket = EMOTIONAL_STATE_CALIBRATIONS_FR[state] || EMOTIONAL_STATE_CALIBRATIONS_FR.neutre;
  return bucket[stage === 'full' ? 'full' : 'summary'];
};

export const buildEmotionalStateCalibrationEn = (question, stage = 'summary') => {
  const state = detectEmotionalState(question);
  const bucket = EMOTIONAL_STATE_CALIBRATIONS_EN[state] || EMOTIONAL_STATE_CALIBRATIONS_EN.neutre;
  return bucket[stage === 'full' ? 'full' : 'summary'];
};
