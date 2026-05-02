const buildAppCta = (locale) =>
  locale === 'en'
    ? {
        label: 'Start a reading',
        href: '/?lang=en#question-form'
      }
    : {
        label: 'Faire un tirage',
        href: '/?lang=fr#question-form'
      };

const buildRelatedLinks = (locale, items) =>
  items.map(({ href, fr, en }) => ({
    href,
    label: locale === 'en' ? en : fr
  }));

export const SEO_ROUTE_CONFIG = {
  '/': {
    fr: {
      title: 'Nornsight — Tirage de runes en ligne clair et guidé',
      description:
        'Un tirage de runes en ligne clair pour éclairer une relation, un projet, une question d’argent ou une période floue.',
      heading: 'Un tirage de runes en ligne, simple et lisible',
      intro:
        'Nornsight n’essaie pas d’en faire trop. Tu poses ta question, trois runes sont tirées, puis une lecture vient mettre des mots clairs sur ce qui est déjà en train de se jouer.',
      sections: [
        {
          title: 'Ce que tu trouves ici',
          body: 'Une lecture sobre, directe, qui ne dramatise pas et ne vend pas du mystère. Le but est de voir plus juste, pas d’en rajouter.'
        },
        {
          title: 'Ce que le gratuit donne déjà',
          body: 'Une réponse claire, une tendance dominante, et une vraie première mise au point. C’est court, mais ce n’est pas vide.'
        },
        {
          title: 'Quand l’approfondissement devient utile',
          body: 'Si tu sens que quelque chose mérite d’être mieux compris, la lecture approfondie va plus loin sur ce qui tient, ce qui bloque, et ce qui peut réellement évoluer ensuite.'
        }
      ],
      relatedLinks: buildRelatedLinks('fr', [
        { href: '/tirages', fr: 'Voir les différents tirages', en: 'See the different readings' },
        { href: '/comment-ca-marche', fr: 'Comprendre comment fonctionne Nornsight', en: 'Understand how Nornsight works' },
        { href: '/tirage-amour', fr: 'Voir la lecture relationnelle', en: 'Explore relationship readings' },
        { href: '/tirage-professionnel', fr: 'Voir la lecture professionnelle', en: 'Explore professional readings' }
      ])
    },
    en: {
      title: 'Nornsight — Clear online rune reading',
      description:
        'A clear online rune reading to explore a relationship, a project, a money question, or a confusing period.',
      heading: 'A simple, readable online rune reading',
      intro:
        'Nornsight does not try to overdo things. You ask your question, three runes are drawn, and a reading puts clear words on what is already unfolding.',
      sections: [
        {
          title: 'What you find here',
          body: 'A sober, direct reading that does not force drama and does not hide behind mystery. The goal is clarity, not performance.'
        },
        {
          title: 'What the free reading already gives',
          body: 'A clear answer, a main direction, and a real first clarification. It stays short, but it is not empty.'
        },
        {
          title: 'When the deeper reading becomes useful',
          body: 'If you feel something needs more than a quick answer, the deeper reading goes further into what holds, what slows things down, and what may truly change next.'
        }
      ],
      relatedLinks: buildRelatedLinks('en', [
        { href: '/tirages', fr: 'Voir les différents tirages', en: 'See the different readings' },
        { href: '/comment-ca-marche', fr: 'Comprendre comment fonctionne Nornsight', en: 'Understand how Nornsight works' },
        { href: '/tirage-amour', fr: 'Voir la lecture relationnelle', en: 'Explore relationship readings' },
        { href: '/tirage-professionnel', fr: 'Voir la lecture professionnelle', en: 'Explore professional readings' }
      ])
    }
  },
  '/tirages': {
    fr: {
      title: 'Tirages — Les différentes lectures Nornsight',
      description:
        'Retrouve les différentes pages de tirage Nornsight : tirage en ligne, amour, professionnel et finances.',
      heading: 'Les tirages Nornsight',
      intro:
        'Cette page sert de point d’entrée simple pour retrouver les différentes lectures proposées par Nornsight. Chaque page garde son angle propre, sans multiplier les promesses inutiles.',
      sections: [
        {
          title: 'Tirage de runes en ligne',
          body: 'La porte d’entrée générale. Idéal si ta question n’entre pas dans une seule case ou si tu veux simplement commencer par une lecture claire.'
        },
        {
          title: 'Tirage amour',
          body: 'Pour un lien, une relation, une distance, une mise au clair ou une question affective qui demande plus de lisibilité.'
        },
        {
          title: 'Tirage professionnel',
          body: 'Pour un projet, une activité, une offre, un cap à reprendre, ou un vrai frein professionnel à nommer plus franchement.'
        },
        {
          title: 'Tirage finances',
          body: 'Pour une période serrée, une reprise lente, un dossier, une attente ou une question de stabilité matérielle.'
        }
      ],
      relatedLinks: buildRelatedLinks('fr', [
        { href: '/tirage-runes-en-ligne', fr: 'Découvrir le tirage de runes en ligne', en: 'Discover the online rune reading' },
        { href: '/tirage-amour', fr: 'Découvrir le tirage amour', en: 'Discover the love reading' },
        { href: '/tirage-professionnel', fr: 'Découvrir le tirage professionnel', en: 'Discover the professional reading' },
        { href: '/tirage-finances', fr: 'Découvrir le tirage finances', en: 'Discover the finance reading' }
      ])
    },
    en: {
      title: 'Readings — Nornsight reading pages',
      description:
        'Browse the main Nornsight reading pages: general online reading, love, professional, and finance.',
      heading: 'Nornsight readings',
      intro:
        'This page is a simple hub to find the main Nornsight reading pages. Each one keeps its own angle without overloading the navigation.',
      sections: [
        {
          title: 'Online rune reading',
          body: 'The general entry point. Best if your question does not fit into one narrow category or if you want to start with a clear overall reading.'
        },
        {
          title: 'Love reading',
          body: 'For a bond, a relationship, distance, clarification, or any emotional question that needs more clarity.'
        },
        {
          title: 'Professional reading',
          body: 'For a project, an activity, an offer, a direction to reclaim, or a real professional bottleneck that needs naming clearly.'
        },
        {
          title: 'Finance reading',
          body: 'For a tight period, slow recovery, an administrative file, a waiting period, or a question about material stability.'
        }
      ],
      relatedLinks: buildRelatedLinks('en', [
        { href: '/tirage-runes-en-ligne', fr: 'Découvrir le tirage de runes en ligne', en: 'Discover the online rune reading' },
        { href: '/tirage-amour', fr: 'Découvrir le tirage amour', en: 'Discover the love reading' },
        { href: '/tirage-professionnel', fr: 'Découvrir le tirage professionnel', en: 'Discover the professional reading' },
        { href: '/tirage-finances', fr: 'Découvrir le tirage finances', en: 'Discover the finance reading' }
      ])
    }
  },
  '/tirage-runes-en-ligne': {
    fr: {
      title: 'Tirage de runes en ligne — Nornsight',
      description:
        'Découvre un tirage de runes en ligne clair et structuré pour une relation, un projet, une question d’argent ou une période de transition.',
      heading: 'Faire un tirage de runes en ligne sans se perdre dans le flou',
      intro:
        'Un tirage de runes peut vite devenir vague ou trop chargé. Ici, l’idée est plus simple : une question précise, trois runes, puis une lecture qui garde les pieds sur terre.',
      sections: [
        {
          title: 'À quoi cela sert vraiment',
          body: 'À voir plus clair dans une situation qui te travaille déjà : un lien, un projet, un choix, un dossier, une tension qui revient.'
        },
        {
          title: 'Pourquoi trois runes',
          body: 'Parce que cela suffit souvent pour faire apparaître une base, un nœud actuel et une direction probable, sans étirer artificiellement le tirage.'
        },
        {
          title: 'Ce que tu obtiens',
          body: 'D’abord une lecture nette et lisible. Puis, si tu veux aller plus loin, un approfondissement qui explique mieux ce qui est en train de se construire, de se bloquer ou de se transformer.'
        }
      ],
      relatedLinks: buildRelatedLinks('fr', [
        { href: '/tirages', fr: 'Voir tous les tirages', en: 'See all readings' },
        { href: '/comment-ca-marche', fr: 'Voir comment se déroule le tirage', en: 'See how the reading works' },
        { href: '/faq', fr: 'Lire les questions fréquentes', en: 'Read the FAQ' },
        { href: '/tirage-finances', fr: 'Explorer les questions d’argent', en: 'Explore finance questions' }
      ])
    },
    en: {
      title: 'Online rune reading — Nornsight',
      description:
        'A clear and structured online rune reading for a relationship, a project, a money question, or a time of transition.',
      heading: 'An online rune reading without getting lost in vagueness',
      intro:
        'A rune reading can quickly become vague or overloaded. Here, the approach is simpler: one clear question, three runes, and a reading that stays grounded.',
      sections: [
        {
          title: 'What it is really for',
          body: 'To bring clarity to something that is already working on you: a bond, a project, a choice, a file, or a recurring tension.'
        },
        {
          title: 'Why three runes',
          body: 'Because that is often enough to show a base, an active issue, and a likely direction without stretching the reading for no reason.'
        },
        {
          title: 'What you receive',
          body: 'First, a clear and readable reading. Then, if you want more, a deeper one that explains what is being built, blocked, or transformed.'
        }
      ],
      relatedLinks: buildRelatedLinks('en', [
        { href: '/tirages', fr: 'Voir tous les tirages', en: 'See all readings' },
        { href: '/comment-ca-marche', fr: 'Voir comment se déroule le tirage', en: 'See how the reading works' },
        { href: '/faq', fr: 'Lire les questions fréquentes', en: 'Read the FAQ' },
        { href: '/tirage-finances', fr: 'Explorer les questions d’argent', en: 'Explore finance questions' }
      ])
    }
  },
  '/tirage-amour': {
    fr: {
      title: 'Tirage amour — Lecture de relation avec les runes',
      description:
        'Une lecture relationnelle par les runes pour voir plus clair dans un lien, une distance, un blocage, un rapprochement ou un engagement.',
      heading: 'Voir plus clair dans une relation avec les runes',
      intro:
        'Quand une relation devient floue, tendue ou simplement importante, on a surtout besoin d’y voir plus clair. Le tirage amour sert à ça : lire le lien sans l’idéaliser, sans le noircir non plus.',
      sections: [
        {
          title: 'Ce que le tirage peut vraiment montrer',
          body: 'S’il y a une base réelle entre vous, si quelque chose s’ouvre, si un malentendu s’installe, ou si le lien risque de rester suspendu tant qu’un point n’est pas clarifié.'
        },
        {
          title: 'Ce que la lecture aide à nommer',
          body: 'La place de chacun, la réciprocité, la distance, le flou, le besoin de mise au clair, ou au contraire une vraie possibilité d’avancer.'
        },
        {
          title: 'Quand cela devient utile',
          body: 'Quand tu sens que la situation ne se résume pas à un simple oui ou non, et que tu veux comprendre ce qui tient encore, ce qui fatigue le lien, et ce qui pourrait le faire évoluer.'
        }
      ],
      relatedLinks: buildRelatedLinks('fr', [
        { href: '/tirages', fr: 'Voir les autres tirages', en: 'See the other readings' },
        { href: '/tirage-runes-en-ligne', fr: 'Revenir au tirage en ligne', en: 'Back to the online reading' },
        { href: '/faq', fr: 'Voir les questions fréquentes', en: 'See the FAQ' },
        { href: '/comment-ca-marche', fr: 'Comprendre le fonctionnement', en: 'Understand how it works' }
      ])
    },
    en: {
      title: 'Love rune reading — Relationship insight with runes',
      description:
        'A relationship reading with runes to clarify a bond, distance, blockage, possible closeness, or commitment.',
      heading: 'Use runes to see more clearly in a relationship',
      intro:
        'When a relationship becomes blurry, tense, or simply important, what you need most is clarity. A love reading is here for that: to read the bond without idealising it and without darkening it for no reason.',
      sections: [
        {
          title: 'What the reading can really show',
          body: 'Whether there is a real base between you, whether something is opening, whether confusion has settled in, or whether the bond may stay suspended until something is clarified.'
        },
        {
          title: 'What the reading helps name',
          body: 'Each person’s place, reciprocity, distance, ambiguity, the need for a real clarification, or on the contrary a genuine possibility to move forward.'
        },
        {
          title: 'When it becomes useful',
          body: 'When you feel the situation cannot be reduced to a simple yes or no, and you want to understand what still holds, what drains the bond, and what could help it evolve.'
        }
      ],
      relatedLinks: buildRelatedLinks('en', [
        { href: '/tirages', fr: 'Voir les autres tirages', en: 'See the other readings' },
        { href: '/tirage-runes-en-ligne', fr: 'Revenir au tirage en ligne', en: 'Back to the online reading' },
        { href: '/faq', fr: 'Voir les questions fréquentes', en: 'See the FAQ' },
        { href: '/comment-ca-marche', fr: 'Comprendre le fonctionnement', en: 'Understand how it works' }
      ])
    }
  },
  '/tirage-professionnel': {
    fr: {
      title: 'Tirage professionnel — Projet, activité et orientation',
      description:
        'Une lecture professionnelle par les runes pour éclairer un projet, une activité, une offre, un frein réel ou un cap à reprendre.',
      heading: 'Voir plus clair dans un projet ou une activité',
      intro:
        'Sur le pro, ce n’est pas seulement une question de motivation. Il y a souvent un vrai sujet de cap, de lisibilité, d’offre, ou de frein mal nommé. Le tirage sert à remettre cela à plat.',
      sections: [
        {
          title: 'Ce que la lecture peut débloquer',
          body: 'Une offre qui attire sans convertir, un projet qui tourne sans avancer, une activité qui tient mal sa promesse, ou un cap qui reste trop flou.'
        },
        {
          title: 'Ce qu’elle ne fera pas',
          body: 'Elle ne remplace pas une stratégie business. En revanche, elle peut montrer où se trouve le vrai levier, ce qui fatigue inutilement ton activité, et ce qui peut enfin devenir plus net.'
        },
        {
          title: 'Pourquoi cela vaut le coup',
          body: 'Parce qu’un bon tirage peut t’aider à sentir si quelque chose est seulement intéressant, réellement viable, encore mal formulé, ou prêt à prendre plus de place.'
        }
      ],
      relatedLinks: buildRelatedLinks('fr', [
        { href: '/tirages', fr: 'Voir les autres tirages', en: 'See the other readings' },
        { href: '/tirage-finances', fr: 'Voir aussi les questions d’argent', en: 'See finance-related questions' },
        { href: '/comment-ca-marche', fr: 'Comprendre comment la lecture fonctionne', en: 'Understand how the reading works' },
        { href: '/faq', fr: 'Lire les réponses fréquentes', en: 'Read the common questions' }
      ])
    },
    en: {
      title: 'Professional rune reading — Project, activity and direction',
      description:
        'A professional rune reading to clarify a project, an activity, an offer, a real bottleneck, or a direction to reclaim.',
      heading: 'See more clearly in a project or an activity',
      intro:
        'In work matters, it is not only about motivation. There is often a real issue of direction, offer clarity, positioning, or a bottleneck that has not been named properly. The reading helps lay that out more clearly.',
      sections: [
        {
          title: 'What the reading can unlock',
          body: 'An offer that attracts without converting, a project that keeps moving without progressing, an activity that does not hold its promise well, or a direction that stays too vague.'
        },
        {
          title: 'What it will not do',
          body: 'It does not replace business strategy. But it can show where the real lever is, what is draining the activity, and what could finally become clearer and more workable.'
        },
        {
          title: 'Why it is worth using',
          body: 'Because a good reading can help you feel whether something is merely interesting, truly viable, still poorly framed, or ready to take more space.'
        }
      ],
      relatedLinks: buildRelatedLinks('en', [
        { href: '/tirages', fr: 'Voir les autres tirages', en: 'See the other readings' },
        { href: '/tirage-finances', fr: 'Voir aussi les questions d’argent', en: 'See finance-related questions' },
        { href: '/comment-ca-marche', fr: 'Comprendre comment la lecture fonctionne', en: 'Understand how the reading works' },
        { href: '/faq', fr: 'Lire les réponses fréquentes', en: 'Read the common questions' }
      ])
    }
  },
  '/tirage-finances': {
    fr: {
      title: 'Tirage finances — Argent, stabilité et blocages',
      description:
        'Une lecture des finances par les runes pour mieux comprendre un blocage, une attente, une reprise lente ou un retour à l’équilibre.',
      heading: 'Lire plus clairement une question d’argent ou de stabilité',
      intro:
        'Les questions d’argent demandent du calme et de la précision. Le tirage ne remplace pas la réalité concrète, mais il peut aider à distinguer un simple retard d’un vrai blocage, ou une amélioration réelle d’un faux espoir.',
      sections: [
        {
          title: 'Quand cela aide vraiment',
          body: 'Quand tu es dans une période serrée, un dossier en attente, un retour à l’équilibre trop lent, ou une impression que quelque chose reste retenu.'
        },
        {
          title: 'Ce que la lecture peut préciser',
          body: 'Si la situation est seulement ralentie, si elle dépend d’un tiers, si elle avance par étapes, ou si le soulagement attendu ne vient pas encore franchement.'
        },
        {
          title: 'Ce que tu peux en attendre',
          body: 'Une lecture plus nette de ce qui coince, de ce qui peut bouger, et du rythme probable de la situation, sans promesse artificielle.'
        }
      ],
      relatedLinks: buildRelatedLinks('fr', [
        { href: '/tirages', fr: 'Voir les autres tirages', en: 'See the other readings' },
        { href: '/tirage-professionnel', fr: 'Explorer aussi le versant professionnel', en: 'Explore the professional side too' },
        { href: '/faq', fr: 'Lire la FAQ', en: 'Read the FAQ' },
        { href: '/tirage-runes-en-ligne', fr: 'Revenir au tirage principal', en: 'Back to the main reading' }
      ])
    },
    en: {
      title: 'Finance rune reading — Money, stability and bottlenecks',
      description:
        'A rune reading focused on money questions, blocked situations, slow recovery, or a return to stability.',
      heading: 'Read a money or stability question more clearly',
      intro:
        'Money questions need calm and precision. The reading does not replace concrete reality, but it can help distinguish a simple delay from a real blockage, or real improvement from false hope.',
      sections: [
        {
          title: 'When it truly helps',
          body: 'When you are in a tight period, waiting on a file, hoping for balance to return, or feeling that something stays held back.'
        },
        {
          title: 'What the reading can clarify',
          body: 'Whether the situation is only slowed down, whether it depends on a third party, whether it will move in stages, or whether the expected relief is still not arriving clearly.'
        },
        {
          title: 'What you can expect from it',
          body: 'A clearer reading of what is stuck, what may move, and the likely pace of the situation, without artificial promises.'
        }
      ],
      relatedLinks: buildRelatedLinks('en', [
        { href: '/tirages', fr: 'Voir les autres tirages', en: 'See the other readings' },
        { href: '/tirage-professionnel', fr: 'Explorer aussi le versant professionnel', en: 'Explore the professional side too' },
        { href: '/faq', fr: 'Lire la FAQ', en: 'Read the FAQ' },
        { href: '/tirage-runes-en-ligne', fr: 'Revenir au tirage principal', en: 'Back to the main reading' }
      ])
    }
  },
  '/comment-ca-marche': {
    fr: {
      title: 'Comment ça marche — Tirage Nornsight',
      description:
        'Comprendre simplement comment fonctionne Nornsight : question, trois runes, lecture gratuite, approfondissement et envoi.',
      heading: 'Comment fonctionne Nornsight, concrètement',
      intro:
        'Le principe est simple. Tu poses ta question, le tirage se fait, puis une première lecture te donne déjà une vraie direction. Si tu veux aller plus loin, l’approfondissement vient ensuite.',
      sections: [
        {
          title: 'Le tirage gratuit',
          body: 'Il répond clairement et pose une première ligne de lecture. Le but n’est pas d’en faire trop, mais de donner quelque chose de lisible, utile et honnête.'
        },
        {
          title: 'La lecture approfondie',
          body: 'Elle va plus loin sur ce qui se joue vraiment, sur ce qui risque de freiner, sur ce qui peut tenir, et sur ce qui pourrait faire évoluer la suite.'
        },
        {
          title: 'La livraison',
          body: 'Si tu prends la lecture approfondie, elle est préparée puis envoyée par email. Le tunnel est pensé pour rester simple et traçable.'
        }
      ],
      relatedLinks: buildRelatedLinks('fr', [
        { href: '/tirages', fr: 'Voir les différents tirages', en: 'See the different readings' },
        { href: '/faq', fr: 'Lire les questions fréquentes', en: 'Read the FAQ' },
        { href: '/tirage-runes-en-ligne', fr: 'Revenir au tirage en ligne', en: 'Back to the online reading' },
        { href: '/tirage-amour', fr: 'Voir un exemple de lecture relationnelle', en: 'See a relationship reading example' }
      ])
    },
    en: {
      title: 'How it works — Nornsight reading',
      description:
        'Understand simply how Nornsight works: one question, three runes, a free reading, a deeper reading, and email delivery.',
      heading: 'How Nornsight works, in practice',
      intro:
        'The principle is simple. You ask your question, the runes are drawn, and a first reading already gives you a real direction. If you want to go further, the deeper reading comes next.',
      sections: [
        {
          title: 'The free reading',
          body: 'It answers clearly and sets a first line of interpretation. The goal is not to overdo things, but to give something readable, useful, and honest.'
        },
        {
          title: 'The deeper reading',
          body: 'It goes further into what is really happening, what may slow things down, what may hold, and what could change the next step.'
        },
        {
          title: 'Delivery',
          body: 'If you choose the deeper reading, it is prepared and sent by email. The flow is designed to stay simple and traceable.'
        }
      ],
      relatedLinks: buildRelatedLinks('en', [
        { href: '/tirages', fr: 'Voir les différents tirages', en: 'See the different readings' },
        { href: '/faq', fr: 'Lire les questions fréquentes', en: 'Read the FAQ' },
        { href: '/tirage-runes-en-ligne', fr: 'Revenir au tirage en ligne', en: 'Back to the online reading' },
        { href: '/tirage-amour', fr: 'Voir un exemple de lecture relationnelle', en: 'See a relationship reading example' }
      ])
    }
  },
  '/faq': {
    fr: {
      title: 'FAQ Nornsight — Questions fréquentes',
      description:
        'Questions fréquentes sur Nornsight, le tirage gratuit, la lecture approfondie, la livraison par email et le fonctionnement global.',
      heading: 'Questions fréquentes sur Nornsight',
      intro:
        'Si tu veux comprendre rapidement ce que fait Nornsight, ce que donne le gratuit, ou comment se passe la lecture approfondie, cette page va à l’essentiel.',
      sections: [
        {
          title: 'Le gratuit est-il déjà utile ?',
          body: 'Oui. Il donne déjà une vraie réponse et une première lecture de la situation. L’approfondissement sert surtout quand tu veux aller plus loin et mieux comprendre la suite.'
        },
        {
          title: 'Comment arrive la lecture complète ?',
          body: 'Après paiement confirmé, la lecture approfondie est préparée puis envoyée par email. Si quelque chose prend plus de temps, un suivi simple garde la commande claire.'
        },
        {
          title: 'À qui s’adresse Nornsight ?',
          body: 'À quelqu’un qui veut une lecture sobre, lisible et sérieuse, sans folklore ni grand spectacle.'
        }
      ],
      faq: [
        {
          question: 'Quelle est la différence entre le gratuit et le payant ?',
          answer: 'Le gratuit répond et donne une première direction. Le payant va plus loin sur ce qui tient, ce qui bloque, et ce qui pourrait vraiment faire évoluer la situation.'
        },
        {
          question: 'La lecture est-elle envoyée par email ?',
          answer: 'Oui. La lecture approfondie est envoyée par email après confirmation du paiement.'
        },
        {
          question: 'Faut-il déjà savoir lire les runes ?',
          answer: 'Non. Nornsight est pensé pour rester lisible, même si tu ne connais rien aux runes.'
        }
      ],
      relatedLinks: buildRelatedLinks('fr', [
        { href: '/tirages', fr: 'Voir les différents tirages', en: 'See the different readings' },
        { href: '/comment-ca-marche', fr: 'Voir comment ça marche', en: 'See how it works' },
        { href: '/tirage-runes-en-ligne', fr: 'Accéder au tirage en ligne', en: 'Go to the online reading' },
        { href: '/tirage-professionnel', fr: 'Explorer la lecture professionnelle', en: 'Explore the professional reading' }
      ])
    },
    en: {
      title: 'Nornsight FAQ — Frequently asked questions',
      description:
        'Frequently asked questions about Nornsight, the free reading, the deeper reading, email delivery, and the overall experience.',
      heading: 'Frequently asked questions about Nornsight',
      intro:
        'If you want a quick understanding of what Nornsight does, what the free reading gives, or how the deeper reading is delivered, this page keeps it simple.',
      sections: [
        {
          title: 'Is the free reading already useful?',
          body: 'Yes. It already gives a real answer and a first reading of the situation. The deeper reading is mainly useful when you want to go further and better understand what may come next.'
        },
        {
          title: 'How does the full reading arrive?',
          body: 'Once payment is confirmed, the deeper reading is prepared and sent by email. If something takes longer, simple follow-up keeps the order clear.'
        },
        {
          title: 'Who is Nornsight for?',
          body: 'For someone who wants a sober, readable, serious reading, without folklore and without showmanship.'
        }
      ],
      faq: [
        {
          question: 'What is the difference between the free and paid readings?',
          answer: 'The free reading answers and gives a first direction. The paid one goes further into what holds, what blocks, and what could truly change the situation.'
        },
        {
          question: 'Is the reading sent by email?',
          answer: 'Yes. The deeper reading is sent by email once payment is confirmed.'
        },
        {
          question: 'Do I need to know runes already?',
          answer: 'No. Nornsight is built to stay readable even if you know nothing about runes.'
        }
      ],
      relatedLinks: buildRelatedLinks('en', [
        { href: '/tirages', fr: 'Voir les différents tirages', en: 'See the different readings' },
        { href: '/comment-ca-marche', fr: 'Voir comment ça marche', en: 'See how it works' },
        { href: '/tirage-runes-en-ligne', fr: 'Accéder au tirage en ligne', en: 'Go to the online reading' },
        { href: '/tirage-professionnel', fr: 'Explorer la lecture professionnelle', en: 'Explore the professional reading' }
      ])
    }
  }
};

export const SEO_PUBLIC_PATHS = Object.keys(SEO_ROUTE_CONFIG);

export function getSeoRouteConfig(pathname, locale = 'fr') {
  const route = SEO_ROUTE_CONFIG[pathname];
  if (!route) {
    return null;
  }

  const copy = route[locale] || route.fr;
  return {
    ...copy,
    cta: buildAppCta(locale)
  };
}
