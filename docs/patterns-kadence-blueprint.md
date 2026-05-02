# Blueprint Patterns Gutenberg + Kadence

## 1. Objectif

Les patterns doivent permettre de construire l'ensemble du site sans recoder les pages.

Chaque pattern doit :

- avoir un role unique
- etre reutilisable
- rester editable visuellement
- respecter le design system
- fonctionner avec Gutenberg + Kadence Blocks

Principe :

`Le theme fournit le cadre. Les patterns fournissent les briques. Les pages s'assemblent sans code.`

## 2. Regles de conception

### Regle 1

Un pattern ne doit pas contenir une page entiere.

### Regle 2

Un pattern doit rester comprensible en un coup d'oeil dans l'inserteur.

### Regle 3

Les contenus de demonstration doivent etre utiles, mais remplaçables facilement.

### Regle 4

Les variations doivent passer par quelques versions claires, pas par des exceptions infinies.

### Regle 5

Le pattern doit etre beau des l'insertion, sans parametrage complexe.

## 3. Stack blocs recommandee

### Blocs Gutenberg natifs

- Group
- Columns
- Heading
- Paragraph
- List
- Image
- Buttons
- Spacer
- Separator
- Query Loop
- Template Part

### Blocs Kadence

- Row Layout
- Advanced Heading
- Advanced Button
- Icon / Icon List
- Accordion
- Tabs si besoin ponctuel
- Testimonials si necessaire

Usage recommande :

- Gutenberg pour la structure principale
- Kadence pour le raffinement visuel et les composants interactifs simples

## 4. Taxonomie des patterns

### P00 — Fondations

- Header principal
- Footer strategique
- Bandeau confiance
- CTA global

### P10 — Heroes

- Hero accueil
- Hero page pilier
- Hero service
- Hero formation
- Hero livre
- Hero blog

### P20 — Blocs de contenu

- Intro editoriale
- Bloc `Pour qui`
- Bloc `Benefices`
- Bloc `Comment ca se passe`
- Bloc `Certifications`
- Bloc `A propos condense`

### P30 — Grilles

- Grille services
- Grille formations
- Grille temoignages
- Grille articles

### P40 — Conversion

- Bloc Calendly
- CTA simple
- CTA double
- Bloc newsletter

### P50 — Confiance

- Temoignages
- FAQ
- Bandeau preuves
- Bloc modalites a distance

### P60 — Autorite

- Bandeau livre sombre
- Bloc `Le livre comme ressource`
- Bloc `Vu / disponible chez`

## 5. Liste finale des patterns

## P01 — Header principal

### Objectif

- navigation claire
- CTA reservation visible

### Blocs

- template part / navigation
- bouton CTA

### Editable

- menu
- label du CTA

## P02 — Footer strategique

### Objectif

- conclure clairement
- relancer vers reservation, livre, contact

### Contenu

- phrase de positionnement
- navigation secondaire
- contact
- reseaux
- lien reservation

## P03 — Bandeau confiance

### Objectif

- afficher rapidement les preuves

### Contenu standard

- 21 avis 5 etoiles Google
- 8+ ans de pratique
- 100% en ligne partout en France
- Livre publie en librairie nationale

### Variante

- version claire
- version sombre

## P11 — Hero Accueil

### Objectif

- poser le positionnement
- orienter vers services ou reservation

### Composition

- eyebrow
- H1
- paragraphe
- double CTA
- mini bandeau preuves

### Texte de base

Titre :

`Guidance runique & soins energetiques pour avancer avec clarte`

Sous-texte :

`Separation, transition professionnelle, blocages inexpliques, perte de direction : des seances a distance pour vous aider a faire le point, sans deplacement, depuis toute la France.`

### Editable

- titre
- texte
- CTAs
- visuel ou texture d'ambiance

## P12 — Hero Page Pilier

### Objectif

- ouvrir `Services`, `Formations`, `Livre`, `Blog`

### Composition

- H1
- intro
- eventuel CTA

## P13 — Hero Service

### Objectif

- vendre une prestation

### Composition

- titre
- promesse
- meta services
- CTA reservation

### Meta affichables

- a partir de X EUR
- duree
- modalite
- rune

## P14 — Hero Formation

### Objectif

- presenter une formation clairement

### Composition

- titre
- niveau
- duree
- format
- CTA

## P15 — Hero Livre

### Objectif

- donner au livre une stature d'autorite

### Composition

- visuel couverture
- titre
- sous-texte
- CTA achat
- diffuseurs

## P21 — Intro editoriale

### Objectif

- ouvrir une page avec un texte dense mais respirant

### Composition

- bloc texte largeur reduite
- phrase d'ancrage

## P22 — Bloc `Pour qui`

### Objectif

- aider a l'identification

### Structure

- titre
- intro
- 4 a 6 cartes ou puces

### Exemples

- vous hésitez sur une decision importante
- vous tournez en rond apres une rupture
- vous traversez une transition professionnelle
- vous ressentez un blocage sans comprendre pourquoi

## P23 — Bloc `Benefices`

### Objectif

- traduire l'offre en effets concrets

### Format

- 3 a 6 cartes

### Regle

Formuler des benefices concrets, jamais medicalises.

## P24 — Bloc `Comment ca se passe`

### Objectif

- rassurer sur le deroulement

### Format

- etapes numerotees
- version service
- version soin energetique
- version atelier

## P25 — Bloc `Modalites a distance`

### Objectif

- transformer la distance en atout

### Texte de base

`Toutes les seances se font a distance, par telephone, visioconference ou email, avec la meme qualite d'accompagnement, depuis chez vous, sans deplacement.`

## P26 — Bloc `Certifications`

### Objectif

- credibiliser sans lourdeur

### Format

- timeline ou grille sobre

## P27 — Bloc `A propos condense`

### Objectif

- humaniser rapidement depuis la home

### Contenu

- 2 a 4 paragraphes
- CTA vers la page complete

## P31 — Grille Services

### Source

- CPT `service`

### Carte affichee

- rune
- titre
- accroche benefice
- tags
- lien

### Usage

- accueil
- page services
- liens internes

## P32 — Grille Formations

### Source

- CPT `formation`

### Carte affichee

- titre
- niveau
- duree
- objectif
- CTA

## P33 — Grille Temoignages

### Source

- CPT `testimonial`

### Regle

- limiter a 3 en home
- version archive pour la page temoignages

## P34 — Grille Articles

### Source

- Query Loop articles

### Usage

- home
- blog
- fin d'article

## P41 — Bloc Calendly

### Objectif

- convertir proprement

### Composition

- titre
- texte rassurant
- embed Calendly
- note sur format des seances

### Variante

- plein ecran page reserver
- version compacte dans pages service

## P42 — CTA simple

### Composition

- titre
- paragraphe
- bouton

## P43 — CTA double

### Composition

- titre
- paragraphe
- bouton principal
- bouton secondaire

## P44 — Bloc Newsletter

### Objectif

- capter l'email avec une promesse concrete

### Promesse type

`Recevez des contenus utiles autour des runes, des tirages et des temps de transition, sans spam. Desinscription en un clic.`

### Composition

- texte
- champ email
- bouton
- note de reassurance

## P51 — FAQ

### Format

- accordéon Kadence

### Variantes

- FAQ service
- FAQ ateliers
- FAQ reservation

## P52 — Bloc Temoignage mis en avant

### Objectif

- isoler une preuve forte

### Usage

- pages service
- pages formation

## P53 — Bloc `Ressource complementaire`

### Objectif

- faire le lien entre service, livre et formation

### Exemples

- sur un service : proposer le livre
- sur le livre : proposer une formation
- sur la formation : proposer une seance

## P61 — Bandeau Livre Sombre

### Objectif

- donner de l'autorite
- montrer que le livre est une ressource transversale

### Composition

- fond bleu nuit
- couverture
- texte
- diffuseurs
- CTA achat

## P62 — Bloc `Disponible chez`

### Contenu

- Fnac
- Cultura
- Amazon
- Furet du Nord
- Librairies independantes

## 6. Assemblage par page

## Accueil

- P11 Hero Accueil
- P03 Bandeau confiance
- P61 Bandeau Livre Sombre
- P31 Grille Services
- P27 A propos condense
- P33 Grille Temoignages
- P44 Newsletter
- P43 CTA double

## A propos

- P12 Hero Page Pilier
- P21 Intro editoriale
- P26 Certifications
- P25 Modalites a distance
- P42 CTA simple

## Services

- P12 Hero Page Pilier
- P21 Intro editoriale
- P31 Grille Services
- P24 Comment ca se passe
- P25 Modalites a distance
- P33 Grille Temoignages
- P42 CTA simple

## Tirage de runes

- P13 Hero Service
- P21 Intro editoriale
- P23 Benefices
- P24 Comment ca se passe
- P25 Modalites a distance
- P41 Calendly compact

## Soins energetiques

- P13 Hero Service
- P21 Intro editoriale
- P24 Comment ca se passe
- P23 Benefices
- P51 FAQ
- P41 Calendly compact

## Mediumnite

- P13 Hero Service
- P21 Intro editoriale
- P22 Pour qui
- P52 Temoignage mis en avant
- P41 Calendly compact

## Ateliers

- P13 Hero Service
- P22 Pour qui
- P24 Comment ca se passe
- P51 FAQ
- P42 CTA simple

## Formations

- P12 Hero Page Pilier
- P21 Intro editoriale
- P32 Grille Formations
- P53 Ressource complementaire
- P42 CTA simple

## Livre

- P15 Hero Livre
- P21 Intro editoriale
- P62 Disponible chez
- P53 Ressource complementaire
- P42 CTA simple

## Blog

- P12 Hero Page Pilier
- P34 Grille Articles

## Reserver

- P12 Hero Page Pilier
- P25 Modalites a distance
- P41 Calendly
- P51 FAQ

## 7. Regles d'import et d'edition

Chaque pattern doit pouvoir etre :

- importe dans une page vide
- duplique
- deplace
- modifie sans casser la composition

Contenus qui doivent rester edition libre :

- titres
- paragraphes
- images
- CTA
- ordre des sections

Contenus qui doivent idealement etre dynamiques :

- grilles services
- grilles formations
- temoignages

## 8. Definition de reussite

Les patterns sont reussis si :

- ils couvrent 90% des besoins de page
- ils evitent d'inventer des mises en page au cas par cas
- ils restent lisibles dans Gutenberg
- ils sont beaux sans etre surcharges
- ils permettent une reprise en main reelle sans code
