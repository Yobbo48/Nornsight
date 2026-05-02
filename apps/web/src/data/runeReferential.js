const source = {
  title: 'Le Petit Guide des Runes'
};

const STRICT_GENERIC_AVOID = [
  'idealisation du bonheur',
  "laisser la clarte preceder l'action",
  'direction rayonnante',
  'guidance',
  'protection divine',
  'connexion sacree',
  'jeu de hasard',
  'mort-renaissance',
  'lacher-prise structure',
  'synchronicite'
];

const DISPLAY_KEYWORD_AVOID = [
  'richesse',
  'bonheur',
  'reussite',
  'épanouissement',
  'epanouissement',
  'croissance',
  'partage',
  'energie',
  'énergie',
  'communion',
  'celebration',
  'célébration',
  'succes',
  'succès'
];

const STRICT_POSITION_OVERRIDES = {
  Wunjo: {
    sensible: {
      axis: "attente trop haute",
      keywords: ['déception', 'attente', 'insatisfaction'],
      allowedConcepts: ['déception', 'attente excessive', 'insatisfaction', 'écart avec le réel'],
      avoidConcepts: ['idéalisation du bonheur', 'perfection', 'euphorie']
    }
  },
  Isa: {
    mouvement: {
      axis: 'retrouver le bon tempo',
      keywords: ['patience', 'observation', 'reprise graduelle'],
      allowedConcepts: ['patience', 'observation', 'reprise graduelle', 'clarification'],
      avoidConcepts: ["laisser la clarté précéder l'action", 'gel spirituel']
    }
  },
  Perthro: {
    dynamique: {
      keywords: ['part cachée', 'donnée manquante', 'coïncidence']
    }
  },
  Sowilo: {
    mouvement: {
      keywords: ['affirmation', 'élan', 'direction nette']
    }
  },
  Laguz: {
    mouvement: {
      keywords: ['écoute', 'souplesse', 'orientation']
    }
  },
  Dagaz: {
    mouvement: {
      keywords: ['changement net', 'éclaircie', 'nouvelle lecture']
    }
  },
  Algiz: {
    dynamique: {
      keywords: ['garde', 'soutien', 'vigilance']
    }
  }
};

const STRICT_TEMPORAL_KEYWORD_OVERRIDES = {
  Fehu: {
    dynamique: ['ressource amorcée', 'valeur', 'mise en route'],
    essence: ['valeur', 'circulation', 'ressource vivante'],
    mouvement: ['circulation', 'amélioration', 'flux instable']
  },
  Uruz: {
    dynamique: ['élan fort', 'appui', 'vitalité'],
    essence: ['force', 'capacité', 'canalisation'],
    mouvement: ['percée possible', 'tenue', 'usure']
  },
  Thurisaz: {
    dynamique: ['heurt', 'seuil', 'défense'],
    essence: ['obstacle', 'tension', 'confrontation'],
    mouvement: ['clarification', 'effort', 'passage contraint']
  },
  Ansuz: {
    dynamique: ['parole', 'signe', 'échange'],
    essence: ['message', 'compréhension', 'confirmation'],
    mouvement: ['clarification', 'information clé', 'mise au clair']
  },
  Raidho: {
    dynamique: ['mouvement engagé', 'trajet', 'progression'],
    essence: ['rythme', 'parcours', 'direction'],
    mouvement: ['réajustement', 'orientation', 'cadence juste']
  },
  Kenaz: {
    dynamique: ['compréhension', 'mise au jour', 'levier'],
    essence: ['clarté', 'révélation', 'lucidité'],
    mouvement: ['solution visible', 'vérité exposée', 'ajustement']
  },
  Gebo: {
    dynamique: ['échange', 'attente de retour', 'implication'],
    essence: ['réciprocité', 'équilibre', 'accord'],
    mouvement: ['réajustement', 'terrain d’entente', 'accord possible']
  },
  Wunjo: {
    dynamique: ['soutien', 'apaisement', 'accord'],
    essence: ['accord', 'détente', 'cohésion'],
    mouvement: ['amélioration', 'base réelle', 'apaisement fragile']
  },
  Hagalaz: {
    dynamique: ['choc passé', 'rupture', 'désordre'],
    essence: ['fracture', 'heurt', 'réorganisation'],
    mouvement: ['réagencement', 'désordre', 'reconstruction']
  },
  Nauthiz: {
    dynamique: ['manque', 'pression', 'besoin'],
    essence: ['nécessité', 'contrainte', 'marge réduite'],
    mouvement: ['ajustement', 'sobriété', 'recentrage']
  },
  Isa: {
    dynamique: ['arrêt', 'pause', 'figement'],
    essence: ['gel', 'immobilité', 'suspension'],
    mouvement: ['attente', 'maintien', 'dégel incertain']
  },
  Jera: {
    dynamique: ['cycle engagé', 'effort semé', 'maturation'],
    essence: ['cycle', 'récolte', 'temps juste'],
    mouvement: ['résultat possible', 'délai', 'maturation']
  },
  Eihwaz: {
    dynamique: ['tenue', 'passage', 'endurance'],
    essence: ['axe', 'transition', 'entre-deux'],
    mouvement: ['évolution lente', 'tenue', 'stabilisation']
  },
  Perthro: {
    dynamique: ['coulisses', 'part cachée', 'information manquante'],
    essence: ['caché', 'aléa', 'opacité'],
    mouvement: ['dévoilement', 'surprise', 'élément voilé']
  },
  Algiz: {
    dynamique: ['protection', 'alerte', 'garde'],
    essence: ['vigilance', 'limite', 'instinct'],
    mouvement: ['soutien prudent', 'mise à l’abri', 'discernement']
  },
  Sowilo: {
    dynamique: ['élan juste', 'évidence', 'lucidité'],
    essence: ['clarté', 'axe juste', 'vitalité'],
    mouvement: ['cohérence', 'éclaircie', 'force retrouvée']
  },
  Tiwaz: {
    dynamique: ['choix fort', 'exigence', 'ligne claire'],
    essence: ['justesse', 'décision', 'engagement'],
    mouvement: ['avancée', 'ligne tenue', 'coupe nette']
  },
  Berkano: {
    dynamique: ['croissance', 'commencement', 'soin'],
    essence: ['maturation douce', 'protection', 'développement'],
    mouvement: ['progression lente', 'terrain fertile', 'construction']
  },
  Ehwaz: {
    dynamique: ['mouvement commun', 'coordination', 'appui'],
    essence: ['accord dynamique', 'rythme partagé', 'ajustement'],
    mouvement: ['avancée', 'synchronisation', 'coopération']
  },
  Mannaz: {
    dynamique: ['posture', 'rapport humain', 'image'],
    essence: ['conscience de soi', 'positionnement', 'collectif'],
    mouvement: ['repositionnement', 'lucidité', 'place juste']
  },
  Laguz: {
    dynamique: ['ressenti', 'émotion', 'intuition'],
    essence: ['flux sensible', 'écoute', 'profondeur'],
    mouvement: ['adaptation', 'orientation sensible', 'forme à garder']
  },
  Ingwaz: {
    dynamique: ['germe', 'préparation', 'potentiel'],
    essence: ['maturation interne', 'gestation', 'potentiel contenu'],
    mouvement: ['sortie possible', 'forme à venir', 'maturation complète']
  },
  Dagaz: {
    dynamique: ['changement amorcé', 'éclaircie', 'nouvelle lecture'],
    essence: ['aurore', 'déclic', 'passage'],
    mouvement: ['retournement possible', 'seuil à fixer', 'clarté nouvelle']
  },
  Othala: {
    dynamique: ['cadre ancien', 'héritage', 'base'],
    essence: ['socle', 'appartenance', 'cadre'],
    mouvement: ['stabilisation', 'maintien', 'territoire à trier']
  }
};

const normalizeStrictFrench = (value) =>
  String(value || '')
    .trim()
    .replace(/\bdeja\b/gi, 'déjà')
    .replace(/\bclarte\b/gi, 'clarté')
    .replace(/\bdesordre\b/gi, 'désordre')
    .replace(/\bdesequilibre\b/gi, 'déséquilibre')
    .replace(/\bepreuve\b/gi, 'épreuve')
    .replace(/\bheritage\b/gi, 'héritage')
    .replace(/\bloyaute\b/gi, 'loyauté')
    .replace(/\brigidite\b/gi, 'rigidité')
    .replace(/\bnecessite\b/gi, 'nécessité')
    .replace(/\bporosite\b/gi, 'porosité')
    .replace(/\bsynchronie\b/gi, 'synchronie')
    .replace(/\bsynchronicite\b/gi, 'synchronicité')
    .replace(/\bliberation\b/gi, 'libération')
    .replace(/\bcoincidence\b/gi, 'coïncidence')
    .replace(/\breguelle\b/gi, 'graduelle')
    .replace(/\bresume\b/gi, 'résumé')
    .replace(/\s{2,}/g, ' ');

const shouldAvoidStrictKeyword = (value) => {
  const lowered = String(value || '').toLowerCase();
  return STRICT_GENERIC_AVOID.some((entry) => lowered.includes(entry));
};

const buildStrictKeywordList = ({ positionKeywords = [], essenceKeywords = [], overrideKeywords = [] }) => {
  const merged = [...overrideKeywords, ...positionKeywords, ...essenceKeywords]
    .map(normalizeStrictFrench)
    .filter(Boolean)
    .filter((keyword) => !shouldAvoidStrictKeyword(keyword));

  return [...new Set(merged)].slice(0, 3);
};

const buildBookKeywordList = (keywords = []) =>
  [...new Set((Array.isArray(keywords) ? keywords : []).map(normalizeStrictFrench).filter(Boolean))].slice(0, 3);

const buildDisplayKeywordList = (keywords = []) =>
  [...new Set((Array.isArray(keywords) ? keywords : []).map(normalizeStrictFrench).filter(Boolean))]
    .filter((keyword) => !DISPLAY_KEYWORD_AVOID.includes(keyword.toLowerCase()))
    .slice(0, 3);

const runeReferential = [
  {
    symbole: 'ᚠ',
    nom: 'Fehu',
    source,
    essence: {
      axis: 'abondance en circulation',
      keywords: ['richesse', 'circulation', 'croissance', 'partage', 'energie'],
      summary:
        "Fehu parle d'une richesse qui reste vivante seulement si elle circule. Sa vraie question n'est pas ce que l'on possede, mais ce que l'on nourrit, investit et transmet."
    },
    positions: {
      dynamique: {
        axis: 'ressource deja disponible',
        keywords: ['flux', 'valeur', 'ouverture'],
        summary:
          "Quelque chose a deja de la valeur dans la situation et demande a circuler: energie, attention, argent, affection ou confiance."
      },
      sensible: {
        axis: 'crispation autour de la possession',
        keywords: ['retention', 'avidite', 'desequilibre'],
        summary:
          "Le point sensible se situe dans la peur de perdre, le desequilibre entre donner et recevoir, ou une gestion trop serre qui finit par appauvrir le lien."
      },
      mouvement: {
        axis: 'remettre du mouvement dans les ressources',
        keywords: ['rééquilibrage', 'renouvellement', 'circulation juste'],
        summary:
          "Le mouvement juste consiste a remettre du flux la ou tout s'est fige, en redistribuant mieux les ressources pour que la croissance redevienne saine."
      }
    }
  },
  {
    symbole: 'ᚢ',
    nom: 'Uruz',
    source,
    essence: {
      axis: 'force vitale a canaliser',
      keywords: ['puissance', 'endurance', 'instinct', 'resistance', 'vitalite'],
      summary:
        "Uruz incarne la force brute, la resilience et la transformation par l'elan vital. Elle rappelle qu'une puissance mal orientee peut devenir brutale ou sterile."
    },
    positions: {
      dynamique: {
        axis: 'puissance interieure active',
        keywords: ['energie', 'tenacite', 'mutation'],
        summary:
          "Une force interieure est deja mobilisee: la situation pousse a tenir, evoluer, se redresser ou sortir d'une ancienne faiblesse."
      },
      sensible: {
        axis: 'trop-plein ou mauvaise canalisation',
        keywords: ['impulsion', 'epuisement', 'raidissement'],
        summary:
          "Le point sensible est dans l'usage de cette puissance: trop forcer, tout porter, reagir a l'instinct ou s'epuiser en voulant prouver sa solidite."
      },
      mouvement: {
        axis: 'discipliner la force',
        keywords: ['canalisation', 'ancrage', 'concretisation'],
        summary:
          "Le mouvement possible consiste a transformer la force brute en puissance utile, en l'orientant vers une decision claire, un rythme plus sain ou une reconstruction solide."
      }
    }
  },
  {
    symbole: 'ᚦ',
    nom: 'Thurisaz',
    source,
    essence: {
      axis: 'confrontation protectrice',
      keywords: ['confrontation', 'force', 'defense', 'reaction', 'maitrise'],
      summary:
        "Thurisaz est la rune de l'obstacle, de la defense et de la confrontation juste. Elle ne parle pas d'attaque gratuite, mais d'une force qui doit etre maitrisee pour proteger ce qui compte."
    },
    positions: {
      dynamique: {
        axis: 'epreuve ou seuil deja present',
        keywords: ['barriere', 'discernement', "mise a l'epreuve"],
        summary:
          "Une mise a l'epreuve est deja en cours. Quelque chose oblige a ralentir, mesurer les risques et regarder un obstacle comme un seuil a franchir lucidement."
      },
      sensible: {
        axis: 'reaction defensive excessive',
        keywords: ['rapport de force', 'colere', 'durete'],
        summary:
          "Le point sensible apparait quand la defense devient agressive, que le rapport de force l'emporte sur le discernement ou qu'une blessure ancienne gouverne la reaction."
      },
      mouvement: {
        axis: 'poser une limite juste',
        keywords: ['maitrise', 'strategie', 'protection claire'],
        summary:
          "Le mouvement juste consiste a poser une limite nette, agir avec strategie et transformer l'obstacle en point d'appui plutot qu'en guerre ouverte."
      }
    }
  },
  {
    symbole: 'ᚨ',
    nom: 'Ansuz',
    source,
    essence: {
      axis: 'parole inspiree et discernement',
      keywords: ['sagesse', 'parole', 'revelation', 'transmission', 'ecoute'],
      summary:
        "Ansuz relie la parole, l'intuition et la transmission. Elle invite a entendre ce qui se dit derriere les mots, a reconnaitre un message utile et a parler avec justesse."
    },
    positions: {
      dynamique: {
        axis: "message en train d'emerger",
        keywords: ['revelation', 'signe', 'clarification'],
        summary:
          "Quelque chose cherche deja a se dire: une parole importante, un signe, une prise de conscience ou une verite qui insiste."
      },
      sensible: {
        axis: 'bruit, confusion ou malentendu',
        keywords: ['dispersion', 'non-dit', 'illusion'],
        summary:
          "Le point sensible se situe dans la confusion des messages, les non-dits, ou la tendance a parler trop vite sans vraiment entendre ce qui se passe."
      },
      mouvement: {
        axis: "mettre du sens dans l'echange",
        keywords: ['parole juste', 'ecoute active', 'guidance'],
        summary:
          "Le mouvement possible passe par une parole plus juste, une meilleure ecoute et la capacite a nommer ce qui etait flou sans forcer la revelation."
      }
    }
  },
  {
    symbole: 'ᚱ',
    nom: 'Raidho',
    source,
    essence: {
      axis: 'justesse du chemin et du rythme',
      keywords: ['voyage', 'rythme', 'progression', 'ordre', 'evolution'],
      summary:
        "Raidho parle du chemin, du rythme et de l'ordre naturel des choses. Elle rappelle qu'une progression juste depend autant de la cadence que de la destination."
    },
    positions: {
      dynamique: {
        axis: 'processus deja enclenche',
        keywords: ['deplacement', 'transition', 'parcours'],
        summary:
          "La situation est deja en mouvement. Un changement, une prise de distance ou une progression est engagee, meme si elle reste partielle."
      },
      sensible: {
        axis: 'desaccord avec le rythme reel',
        keywords: ['precipitation', 'dispersion', 'desalignement'],
        summary:
          "Le point sensible nait quand on veut aller trop vite, tout controler, ou refuser une etape necessaire du parcours."
      },
      mouvement: {
        axis: 'retrouver la cadence juste',
        keywords: ['alignement', 'discipline', 'direction'],
        summary:
          "Le mouvement possible consiste a se remettre au bon rythme, faire un choix plus aligne et accepter que le chemin se clarifie en marchant."
      }
    }
  },
  {
    symbole: 'ᚲ',
    nom: 'Kenaz',
    source,
    essence: {
      axis: 'lumiere utile et conscience active',
      keywords: ['illumination', 'creativite', 'revelation', 'technique', 'eveil'],
      summary:
        "Kenaz est la torche qui eclaire ce qui etait obscur, mais aussi l'art de transformer une vision en savoir-faire. Sa lumiere revele autant qu'elle exige."
    },
    positions: {
      dynamique: {
        axis: 'clarte qui commence a percer',
        keywords: ['prise de conscience', 'comprehension', 'focus'],
        summary:
          "Une clarte est deja en train de se faire. Quelque chose se comprend mieux, se nomme mieux, ou ne peut plus etre maintenu dans le flou."
      },
      sensible: {
        axis: 'verite inconfortable',
        keywords: ['illusion qui tombe', 'exposition', 'vulnerabilite'],
        summary:
          "Le point sensible reside dans ce que cette lumiere oblige a voir: une illusion, une faille, une incompetence ou un desir plus vrai que prevu."
      },
      mouvement: {
        axis: 'utiliser la clarte pour transformer',
        keywords: ['apprentissage', 'creation', 'action lucide'],
        summary:
          "Le mouvement possible est d'utiliser cette nouvelle clarte pour ajuster, apprendre, creer ou faire un geste plus coherent avec ce qui a ete revele."
      }
    }
  },
  {
    symbole: 'ᚷ',
    nom: 'Gebo',
    source,
    essence: {
      axis: 'echange juste et engagement reciproque',
      keywords: ['equilibre', 'don', 'reciprocite', 'alliance', 'engagement'],
      summary:
        "Gebo parle du don juste, de l'alliance et de la reciprocity. Elle rappelle qu'un lien sain se construit dans l'equilibre, pas dans le sacrifice unilateral."
    },
    positions: {
      dynamique: {
        axis: "lien deja structure par l'echange",
        keywords: ['partenariat', 'contrat', 'complementarite'],
        summary:
          "La situation repose deja sur un echange, un pacte implicite ou une complementarite forte entre deux forces."
      },
      sensible: {
        axis: 'desequilibre du donner-recevoir',
        keywords: ['dette affective', 'attente', 'asymetrie'],
        summary:
          "Le point sensible apparait quand l'echange n'est plus juste: l'un donne trop, l'autre recoit sans rendre, ou la relation se charge d'attentes cachees."
      },
      mouvement: {
        axis: "renegocier l'equilibre",
        keywords: ['reajustement', 'mutualite', 'accord conscient'],
        summary:
          "Le mouvement possible consiste a reequilibrer les apports, clarifier l'engagement et revenir a un lien ou chacun garde sa dignite et sa place."
      }
    }
  },
  {
    symbole: 'ᚹ',
    nom: 'Wunjo',
    source,
    essence: {
      axis: 'joie partagee et harmonie reelle',
      keywords: ['bonheur', 'reussite', 'communion', 'epanouissement', 'celebration'],
      summary:
        "Wunjo est la joie qui nait de l'alignement et du lien juste. Elle ne parle pas d'euphorie abstraite, mais d'un bien-etre qui se verifie dans la qualite du rapport a soi et aux autres."
    },
    positions: {
      dynamique: {
        axis: 'harmonie deja presente',
        keywords: ['soutien', 'apaisement', 'cohesion'],
        summary:
          "Une part de la situation fonctionne deja mieux qu'on ne le croit. Il existe une base de soutien, de satisfaction ou de coherence sur laquelle s'appuyer."
      },
      sensible: {
        axis: 'idealisation du bonheur',
        keywords: ['deception', 'attente excessive', 'fuite du reel'],
        summary:
          "Le point sensible est de confondre harmonie et perfection, ou de ne plus reconnaitre ce qui va bien parce que cela ne correspond pas a l'image attendue."
      },
      mouvement: {
        axis: 'faire tenir ce qui apporte un vrai appui',
        keywords: ['gratitude', 'stabilisation', 'communion'],
        summary:
          "Le mouvement possible consiste a nourrir ce qui apporte deja de la joie vraie, au lieu de courir apres une satisfaction plus spectaculaire que substantielle."
      }
    }
  },
  {
    symbole: 'ᚺ',
    nom: 'Hagalaz',
    source,
    essence: {
      axis: 'désordre, choc et réorganisation',
      keywords: ['désordre', 'choc', 'heurt', 'chaos', 'réorganisation'],
      summary:
        "Hagalaz parle d'un désordre qui casse un fonctionnement devenu trop rigide. Elle montre un choc, une perturbation ou une phase heurtée qui oblige à réorganiser autrement."
    },
    positions: {
      dynamique: {
        axis: 'desordre deja en cours',
        keywords: ['désordre', 'heurt', 'réorganisation'],
        summary:
          "Quelque chose est deja en train de casser: une securite, une habitude, une construction mentale ou une forme de controle."
      },
      sensible: {
        axis: "resistance a l'inevitable",
        keywords: ['attachement', 'deni', 'vulnerabilite'],
        summary:
          "Le point sensible tient a la difficulte d'accepter la cassure, surtout quand elle expose une fragilite ou oblige a lacher une forme devenue obsolète."
      },
      mouvement: {
        axis: 'reconstruire sur une base plus vraie',
        keywords: ['tri', 'adaptation', 'renouveau'],
        summary:
          "Le mouvement possible n'est pas de sauver l'ancien a tout prix, mais de laisser le tri se faire pour reconstruire autrement et plus juste."
      }
    }
  },
  {
    symbole: 'ᚾ',
    nom: 'Nauthiz',
    source,
    essence: {
      axis: 'necessite qui revele le vrai besoin',
      keywords: ['necessite', 'manque', 'frustration', 'volonte', 'resilience'],
      summary:
        "Nauthiz met l'accent sur la contrainte, le manque et la frustration comme revelateurs. Elle montre ce qui fait pression et oblige a distinguer l'essentiel du superflu."
    },
    positions: {
      dynamique: {
        axis: 'contrainte deja structurante',
        keywords: ['besoin', 'limitation', 'tenue interieure'],
        summary:
          "La situation est deja organisee autour d'un besoin non satisfait, d'une limite reelle ou d'une tension qui force a s'adapter."
      },
      sensible: {
        axis: 'frustration qui enferme',
        keywords: ['manque subi', 'rigidite', 'ressentiment'],
        summary:
          "Le point sensible apparait quand le manque prend toute la place, que la frustration fige la pensee ou que l'on s'identifie entierement a ce qui fait defaut."
      },
      mouvement: {
        axis: 'transformer la contrainte en axe',
        keywords: ['priorisation', 'endurance lucide', 'recentrage'],
        summary:
          "Le mouvement juste consiste a utiliser la contrainte comme un tri: revenir au besoin reel, faire avec plus sobrement, et retrouver une volonte plus precise."
      }
    }
  },
  {
    symbole: 'ᛁ',
    nom: 'Isa',
    source,
    essence: {
      axis: 'stase, gel et maitrise du temps',
      keywords: ['gel', 'stase', 'rigidite', 'detachement', 'controle'],
      summary:
        "Isa parle d'arret, de gel et de suspension. Elle peut proteger un processus en imposant une pause, mais elle peut aussi signaler un exces de controle ou de froideur."
    },
    positions: {
      dynamique: {
        axis: 'ralentissement deja impose',
        keywords: ['pause', 'attente', 'decantation'],
        summary:
          "Quelque chose est deja a l'arret ou volontairement retenu. Le mouvement apparent diminue pour permettre une decantation ou un repositionnement."
      },
      sensible: {
        axis: 'figement defensif',
        keywords: ['froideur', 'retard', 'fermeture'],
        summary:
          "Le point sensible se situe dans le gel excessif: eviter le contact, reporter sans fin, se couper de ses ressentis ou vouloir tout tenir immobile."
      },
      mouvement: {
        axis: "laisser la clarte preceder l'action",
        keywords: ['patience', 'observation', 'degel progressif'],
        summary:
          "Le mouvement possible n'est pas une acceleration brutale, mais un degel progressif fonde sur une clarte plus nette et une meilleure comprehension du tempo reel."
      }
    }
  },
  {
    symbole: 'ᛃ',
    nom: 'Jera',
    source,
    essence: {
      axis: 'cycle, maturation et juste recompense',
      keywords: ['recolte', 'resultat', 'cycles naturels', 'travail', 'recompense'],
      summary:
        "Jera est la rune des cycles naturels et des fruits d'un effort durable. Elle enseigne que certaines evolutions ne se commandent pas, elles se cultivent."
    },
    positions: {
      dynamique: {
        axis: 'maturation deja engagee',
        keywords: ['processus', 'croissance lente', 'coherence'],
        summary:
          "La situation suit deja un cycle de maturation. Les effets d'actions passees se preparent ou commencent a devenir visibles."
      },
      sensible: {
        axis: 'impatience face au temps necessaire',
        keywords: ['urgence', 'forcage', 'attente mal vecue'],
        summary:
          "Le point sensible est le refus du rythme naturel: vouloir recolter trop tot, confondre lenteur et inertie, ou douter du processus parce qu'il ne cede pas a la pression."
      },
      mouvement: {
        axis: 'laisser le cycle porter ses fruits',
        keywords: ['constance', 'saisonnalite', 'recompense juste'],
        summary:
          "Le mouvement possible consiste a continuer sans precipiter, afin que le resultat emerge au bon moment et avec une solidite reelle."
      }
    }
  },
  {
    symbole: 'ᛇ',
    nom: 'Eihwaz',
    source,
    essence: {
      axis: 'transition exigeante et tenue',
      keywords: ['transition', 'passage', 'tenue', 'endurance', 'résilience'],
      summary:
        "Eihwaz parle d'une transition longue ou exigeante, qui demande de tenir sans forcer. Elle met l'accent sur la continuité, l'endurance et la capacité à traverser un changement sans se disperser."
    },
    positions: {
      dynamique: {
        axis: 'transition déjà active',
        keywords: ['transition', 'tenue', 'continuité'],
        summary:
          "Un passage interieur ou exterieur est deja enclenche. Meme si tout semble discret, la structure de fond est en train de changer."
      },
      sensible: {
        axis: 'fatigue du passage',
        keywords: ['entre-deux', 'epreuve', 'resistance au changement'],
        summary:
          "Le point sensible reside dans la duree et l'inconfort de l'entre-deux, quand l'ancien ne tient plus vraiment et que le nouveau n'a pas encore de forme stable."
      },
      mouvement: {
        axis: "tenir le passage sans se disperser",
        keywords: ['ancrage', 'continuité', 'stabilité'],
        summary:
          "Le mouvement possible n'est pas un raccourci, mais une endurance lucide: tenir le passage jusqu'a ce qu'une nouvelle assise se constitue."
      }
    }
  },
  {
    symbole: 'ᛈ',
    nom: 'Perthro',
    source,
    essence: {
      axis: 'mystere, destin et revelation cachee',
      keywords: ['secret', 'part cachée', 'inconnu', 'indice', 'révélation'],
      summary:
        "Perthro touche au mystere, a l'invisible et a ce qui ne se laisse pas saisir d'emblee. Elle rappelle qu'une part du sens se revele indirectement et dans le temps."
    },
    positions: {
      dynamique: {
        axis: 'element cache deja determinant',
        keywords: ['secret', 'donnée manquante', 'influence discrète'],
        summary:
          "Quelque chose agit deja en coulisse: une information incomplete, un ressort inconscient, une synchronicite ou une verite encore voilee."
      },
      sensible: {
        axis: "anxiete devant l'incertain",
        keywords: ['controle', 'projection', 'opacite'],
        summary:
          "Le point sensible est le besoin de tout comprendre trop tot, qui peut faire projeter un scenario sur ce qui n'est pas encore revelé."
      },
      mouvement: {
        axis: 'laisser emerger plutot que forcer',
        keywords: ['lecture fine', 'acceptation', 'revelation progressive'],
        summary:
          "Le mouvement possible consiste a observer les signes et les details sans precipiter de conclusion, afin de laisser apparaitre ce qui cherchait a se montrer."
      }
    }
  },
  {
    symbole: 'ᛉ',
    nom: 'Algiz',
    source,
    essence: {
      axis: 'protection et vigilance',
      keywords: ['protection', 'instinct', 'garde', 'limite', 'vigilance'],
      summary:
        "Algiz parle de protection, de vigilance et d'instinct de préservation. Elle montre ce qu'il faut garder, protéger ou mieux délimiter."
    },
    positions: {
      dynamique: {
        axis: 'mecanisme de protection deja actif',
        keywords: ['garde', 'soutien', 'vigilance'],
        summary:
          "Une protection, un reflexe de sauvegarde ou un soutien bienveillant est deja present dans la situation, meme s'il reste discret."
      },
      sensible: {
        axis: 'frontieres floues ou hypervigilance',
        keywords: ['porosite', 'naivete', 'defense excessive'],
        summary:
          "Le point sensible apparait quand les limites sont trop poreuses, ou au contraire quand la vigilance devient si forte qu'elle empêche l'ouverture juste."
      },
      mouvement: {
        axis: 'proteger sans se couper',
        keywords: ['limites saines', 'alignement', 'ecoute des signaux'],
        summary:
          "Le mouvement possible consiste a poser des limites plus fines, proteger l'essentiel et rester a l'ecoute des signaux sans sombrer dans la peur."
      }
    }
  },
  {
    symbole: 'ᛋ',
    nom: 'Sowilo',
    source,
    essence: {
      axis: 'clarté, axe juste et élan',
      keywords: ['clarté', 'élan', 'vérité', 'axe juste', 'vitalité'],
      summary:
        "Sowilo est la lumiere qui aligne, revele et dynamise. Elle ne se contente pas d'eclairer un detail: elle expose une verite plus globale et redonne de la force."
    },
    positions: {
      dynamique: {
        axis: 'clarte deja disponible',
        keywords: ['evidence', 'elan', 'coherence'],
        summary:
          "La situation contient deja une ligne claire, une energie porteuse ou un axe de verite qui pourrait servir de boussole."
      },
      sensible: {
        axis: 'eblouissement ou orgueil',
        keywords: ['aveuglement', 'surexposition', 'tension avec la verite'],
        summary:
          "Le point sensible est de ne pas supporter toute la verite qu'apporte cette lumiere, ou de vouloir la capter comme une certitude absolue."
      },
      mouvement: {
        axis: "s'aligner sur ce qui est clairement juste",
        keywords: ['affirmation', 'vitalité', 'direction nette'],
        summary:
          "Le mouvement possible consiste a suivre plus franchement ce qui apparait deja comme juste, sans s'eparpiller ni se diminuer."
      }
    }
  },
  {
    symbole: 'ᛏ',
    nom: 'Tiwaz',
    source,
    essence: {
      axis: 'droiture, engagement et sacrifice juste',
      keywords: ['justice', 'courage', 'sacrifice', 'honneur', 'leadership'],
      summary:
        "Tiwaz est la rune de l'honneur et de l'engagement. Elle demande de se tenir droit, de choisir une ligne juste et d'assumer le prix de cette coherence."
    },
    positions: {
      dynamique: {
        axis: 'necessite de se positionner',
        keywords: ['integrite', 'decision', 'responsabilite'],
        summary:
          "La situation appelle deja un positionnement clair, une prise de responsabilite ou une decision qui ne peut plus etre totalement differee."
      },
      sensible: {
        axis: 'conflit entre ideal et ego',
        keywords: ['rigidite morale', 'orgueil', 'combat mal choisi'],
        summary:
          "Le point sensible est de confondre courage et entetement, justice et rigidite, ou sacrifice juste et souffrance inutile."
      },
      mouvement: {
        axis: 'agir selon une ligne interieure juste',
        keywords: ['engagement lucide', 'ethique', 'victoire meritee'],
        summary:
          "Le mouvement possible est d'agir avec integrite, de choisir le combat utile et de tenir la direction qui respecte a la fois la verite et la responsabilite."
      }
    }
  },
  {
    symbole: 'ᛒ',
    nom: 'Berkano',
    source,
    essence: {
      axis: 'gestation, protection et croissance douce',
      keywords: ['renaissance', 'feminite', 'protection maternelle', 'croissance', 'regeneration'],
      summary:
        "Berkano incarne la croissance protegee, la fertilite des commencements et l'environnement nourricier necessaire a une emergence saine."
    },
    positions: {
      dynamique: {
        axis: 'renouveau deja en germination',
        keywords: ['gestation', 'soin', 'developpement progressif'],
        summary:
          "Quelque chose est deja en train de prendre forme: un projet, un lien, une reconstruction ou une phase de guerison."
      },
      sensible: {
        axis: 'fragilite du processus naissant',
        keywords: ['immaturite', 'surprotection', 'impatience'],
        summary:
          "Le point sensible reside dans la vulnerabilite du vivant qui commence: trop presser, trop controler ou ne pas proteger assez peut freiner la croissance."
      },
      mouvement: {
        axis: 'laisser grandir en tenant le cadre',
        keywords: ['soutien', 'douceur', 'maturation'],
        summary:
          "Le mouvement possible consiste a soutenir sans etouffer, creer les bonnes conditions et laisser l'evolution se consolider dans le temps."
      }
    }
  },
  {
    symbole: 'ᛖ',
    nom: 'Ehwaz',
    source,
    essence: {
      axis: 'progression par cooperation et adaptation',
      keywords: ['progression', 'partenariat', 'harmonie', 'transition', 'adaptation'],
      summary:
        "Ehwaz parle du mouvement partage, de l'alliance fiable et du changement qui devient plus fluide quand deux forces avancent ensemble."
    },
    positions: {
      dynamique: {
        axis: 'transformation deja soutenue par un lien',
        keywords: ['cooperation', 'evolution', 'synchronisation'],
        summary:
          "La situation evolue deja a travers une forme de partenariat, de relais, d'appui mutuel ou de coordination entre plusieurs forces."
      },
      sensible: {
        axis: 'defaut de confiance ou desynchronisation',
        keywords: ['hesitation', 'friction relationnelle', 'controle'],
        summary:
          "Le point sensible apparait quand le lien ne porte plus de la meme facon les deux parties: manque de confiance, rythme different, ou besoin de tout maitriser seul."
      },
      mouvement: {
        axis: 'accorder les forces pour avancer',
        keywords: ['ajustement', 'coherence commune', 'transition fluide'],
        summary:
          "Le mouvement possible consiste a mieux accorder les volontes, accepter l'aide ou repondre avec plus de souplesse a la transition en cours."
      }
    }
  },
  {
    symbole: 'ᛗ',
    nom: 'Mannaz',
    source,
    essence: {
      axis: 'conscience de soi dans le lien',
      keywords: ['conscience', 'cooperation', 'intelligence', 'identite', 'collectivite'],
      summary:
        "Mannaz renvoie a l'identite, a la conscience de soi et a la place tenue parmi les autres. Elle invite a se comprendre sans se couper du collectif."
    },
    positions: {
      dynamique: {
        axis: 'questionnement identitaire deja actif',
        keywords: ['introspection', 'role', 'conscience relationnelle'],
        summary:
          "La situation active deja une reflexion sur soi: sa place, son image, son mode de relation et ce qui est en train de se redefinir."
      },
      sensible: {
        axis: 'ecart entre soi reel et soi adapte',
        keywords: ['masque social', 'mentalisation', 'dependance au regard'],
        summary:
          "Le point sensible reside dans le risque de trop se penser a travers le regard exterieur, ou de maintenir une version de soi qui n'est plus vivante."
      },
      mouvement: {
        axis: 'revenir a une identite plus consciente',
        keywords: ['lucidite', 'alignement humain', 'maturite sociale'],
        summary:
          "Le mouvement possible est de retrouver une posture plus authentique, plus consciente et plus juste dans la facon d'etre avec soi comme avec les autres."
      }
    }
  },
  {
    symbole: 'ᛚ',
    nom: 'Laguz',
    source,
    essence: {
      axis: 'intuition, flux et sagesse du ressenti',
      keywords: ['intuition', 'fluidite', 'profondeur', 'receptivite', 'guerison'],
      summary:
        "Laguz est la rune de l'eau interieure, de l'intuition et du mouvement organique. Elle invite a suivre ce qui veut couler, sans se perdre ni se durcir."
    },
    positions: {
      dynamique: {
        axis: 'flux emotionnel ou intuitif deja present',
        keywords: ['ressenti', 'mouvement naturel', 'profondeur'],
        summary:
          "Quelque chose te parle deja par le ressenti, les emotions, l'inconscient ou une perception fine qui precède l'analyse."
      },
      sensible: {
        axis: 'submersion ou flou',
        keywords: ['dispersion emotionnelle', 'porosite', 'manque de forme'],
        summary:
          "Le point sensible tient au risque d'etre trop absorbe par le ressenti, de manquer d'appui ou de confondre intuition et noyade emotionnelle."
      },
      mouvement: {
        axis: "suivre le mouvement sans perdre sa forme",
        keywords: ['écoute', 'souplesse', 'orientation'],
        summary:
          "Le mouvement possible consiste a suivre ce qui coule naturellement tout en gardant une forme, afin que l'intuition devienne une vraie orientation."
      }
    }
  },
  {
    symbole: 'ᛜ',
    nom: 'Ingwaz',
    source,
    essence: {
      axis: "maturation interieure avant l'epanouissement",
      keywords: ['gestation', 'achevement', 'potentiel', 'maturation', 'satisfaction'],
      summary:
        "Ingwaz parle d'une energie en maturation, d'un potentiel plein mais encore interiorise. Elle indique que quelque chose se prepare avec profondeur avant d'apparaitre."
    },
    positions: {
      dynamique: {
        axis: 'maturation deja en cours',
        keywords: ['preparation', 'consolidation', 'gestation'],
        summary:
          "La situation travaille deja en profondeur. Meme sans resultat visible, une maturation patiente est en train de donner de la consistance a ce qui vient."
      },
      sensible: {
        axis: 'retenue excessive ou impatience de naitre',
        keywords: ['compression', 'stagnation apparente', 'pression'],
        summary:
          "Le point sensible se situe dans la tension entre ce qui est presque pret et la peur de le laisser sortir, ou au contraire le desir de le precipiter."
      },
      mouvement: {
        axis: 'laisser emerger ce qui est mur',
        keywords: ['aboutissement', 'incarnation', 'stabilite fertile'],
        summary:
          "Le mouvement possible est de donner une forme concrete a ce qui a suffisamment muri, en respectant le moment juste de l'emergence."
      }
    }
  },
  {
    symbole: 'ᛞ',
    nom: 'Dagaz',
    source,
    essence: {
      axis: 'ouverture, clarté et changement de lecture',
      keywords: ['ouverture', 'clarté', 'renouveau', 'issue', 'changement'],
      summary:
        "Dagaz parle d'une ouverture nette, d'un changement de lecture et d'un passage vers quelque chose de plus clair."
    },
    positions: {
      dynamique: {
        axis: 'ouverture déjà proche',
        keywords: ['ouverture', 'clarité', 'changement en vue'],
        summary:
          "La situation est deja au bord d'une bascule: une clarte, une resolution ou une ouverture se prepare et modifie la perspective."
      },
      sensible: {
        axis: 'peur du changement de regard',
        keywords: ['resistance a la nouveaute', 'vertige', 'ancien cadre'],
        summary:
          "Le point sensible est la difficulte a quitter une vieille lecture, meme lorsqu'une evidence nouvelle commence a apparaitre."
      },
      mouvement: {
        axis: 'entrer dans la nouvelle vision',
        keywords: ['renouveau', 'issue en vue', 'clarification'],
        summary:
          "Le mouvement possible consiste a suivre la clarte montante, accepter la bascule et agir a partir d'un cadre de conscience plus large."
      }
    }
  },
  {
    symbole: 'ᛟ',
    nom: 'Othala',
    source,
    essence: {
      axis: 'heritage, racines et construction durable',
      keywords: ['heritage', 'appartenance', 'patrimoine', 'fondation', 'transmission'],
      summary:
        "Othala parle des racines, de l'heritage et de ce qui fonde durablement une identite ou une structure. Elle interroge ce que l'on recoit, ce que l'on garde et ce que l'on transmet."
    },
    positions: {
      dynamique: {
        axis: 'poids ou soutien des fondations deja present',
        keywords: ['ancrage', 'famille', 'valeurs', 'acquis'],
        summary:
          "La situation est deja influencee par des racines, des acquis, des cadres familiaux, culturels ou symboliques qui donnent une base."
      },
      sensible: {
        axis: 'confusion entre heritage et enfermement',
        keywords: ['attachement', 'loyaute invisible', 'rigidite identitaire'],
        summary:
          "Le point sensible apparait quand ce qui soutient devient aussi ce qui enferme: devoir familial, repetition d'un schema ou peur de sortir du connu."
      },
      mouvement: {
        axis: "trier l'heritage pour construire le sien",
        keywords: ['selection', 'appropriation', 'fondation personnelle'],
        summary:
          "Le mouvement possible consiste a reprendre ce qui nourrit reellement, a laisser ce qui fige, et a batir un ancrage plus personnel et vivant."
      }
    }
  }
];

export const getStrictPositionProfile = (rune, sourceKey = 'dynamique', options = {}) => {
  const baseRune = rune || {};
  // Nornsight keeps this hook only for compatibility. The product does not activate
  // reversed runes: constraints are expressed through the referential metadata instead.
  const isReversed = Boolean(options?.isReversed);
  const reversedSourceKey = sourceKey === 'essence' ? 'sensible' : 'sensible';
  const uprightPosition =
    sourceKey === 'essence' ? baseRune.essence || {} : baseRune.positions?.[sourceKey] || {};
  const reversedPosition =
    reversedSourceKey === 'essence'
      ? baseRune.essence || {}
      : baseRune.positions?.[reversedSourceKey] || {};
  const basePosition = isReversed ? reversedPosition : uprightPosition;
  const override = STRICT_POSITION_OVERRIDES?.[baseRune.nom]?.[sourceKey] || {};
  const temporalOverride = STRICT_TEMPORAL_KEYWORD_OVERRIDES?.[baseRune.nom]?.[sourceKey] || [];
  const allowedKeywords = buildDisplayKeywordList(
    isReversed
      ? basePosition.keywords || []
      : temporalOverride.length
        ? temporalOverride
        : override.keywords || basePosition.keywords || []
  );
  const bookKeywords = buildBookKeywordList(baseRune.essence?.keywords || []);
  const reversedKeywords = buildBookKeywordList(baseRune.positions?.sensible?.keywords || []);

  return {
    semanticCore: normalizeStrictFrench(
      isReversed ? basePosition.axis || '' : override.axis || basePosition.axis || ''
    ),
    allowedKeywords,
    nearbyConcepts: buildStrictKeywordList({
      positionKeywords: isReversed ? reversedKeywords : sourceKey === 'essence' ? [] : bookKeywords,
      essenceKeywords: [],
      overrideKeywords: override.allowedConcepts || []
    }).slice(0, 3),
    avoidConcepts: [...new Set([...(override.avoidConcepts || []), ...STRICT_GENERIC_AVOID].map(normalizeStrictFrench))],
    register: 'sobre, concret, sans métaphore décorative',
    isReversed
  };
};

export default runeReferential;
