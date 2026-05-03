# Blueprint Final WordPress — L'energie des Runes

## 1. Vision directrice

`L'energie des Runes` est la marque mere du site.

Le site doit exprimer en priorite :

- une pratique des runes nordiques serieuse, accessible et incarnee
- un accompagnement 100% en ligne, partout en France francophone
- une articulation claire entre services, transmission, livre et contenus
- une image premium, sobre, rassurante et durable

Le site ne doit jamais suggerer :

- un cabinet physique
- des consultations en presentiel
- une promesse medicale ou therapeutique
- un folklore esoterique excessif

Phrase de positionnement de reference :

`Guidances runiques, soins energetiques et transmission autour des runes nordiques, accessibles a distance depuis toute la France, sans deplacement.`

## 2. Principes de construction

Le site doit rester :

- natif WordPress
- administrable visuellement
- modifiable sans code dans Gutenberg
- structurellement stable
- extensible dans le temps

Decision cadre :

- theme parent sur mesure
- theme enfant vide
- Gutenberg natif
- Kadence Blocks gratuit
- CPT pour `services`, `formations`, `temoignages`
- meta boxes natives pour les donnees simples
- Customizer pour les options globales
- pages exportables en JSON

## 3. Arborescence finale

### Navigation principale

- Accueil
- A propos
- Services
- Formations
- Le Livre
- Blog
- bouton `Reserver une seance`

### Navigation secondaire

- FAQ
- Temoignages
- Contact
- Mentions legales
- Politique de confidentialite

### Pages

- `/`
- `/a-propos/`
- `/services/`
- `/tirage-de-runes-en-ligne/`
- `/soins-energetiques-en-ligne/`
- `/ateliers-runes-en-ligne/`
- `/formations/`
- `/formation-initiation-runes/`
- `/formation-runes-avancee/`
- `/le-petit-guide-des-runes/`
- `/blog/`
- `/contact/`
- `/reserver/`
- `/faq/`
- `/temoignages/`

## 4. Piliers editoriaux

### Pilier 1 — Services

Objectif :

- vendre les accompagnements
- aider a choisir la bonne porte d'entree
- rassurer sur la distance

### Pilier 2 — Formations

Objectif :

- installer la transmission comme axe de marque
- accueillir les futurs developpements pedagogiques
- structurer une montee en gamme naturelle

### Pilier 3 — Livre

Objectif :

- asseoir l'autorite
- servir de ressource d'entree
- relier lecture, pratique et accompagnement

### Pilier 4 — Blog

Objectif :

- travailler le SEO
- nourrir la confiance
- attirer depuis des situations de vie concretes

## 5. UX et parcours

### Parcours A — Personne en difficulte ou en questionnement

1. Arrive sur accueil ou article
2. Se reconnait dans une situation concrete
3. Comprend qu'il existe plusieurs types d'accompagnement
4. Va vers une page service
5. Est rassuree par les modalites a distance
6. Reserve

### Parcours B — Personne attiree par les runes

1. Arrive via le blog ou la page livre
2. Decouvre l'univers
3. Comprend qu'il existe des formations et ateliers
4. S'oriente vers une formation ou un atelier

### Parcours C — Personne deja confiante

1. Arrive depuis reseaux ou recommandation
2. Clique sur `Reserver une seance`
3. Consulte les modalites
4. Prend rendez-vous via Calendly

## 6. Regles editoriales globales

### Ton

- direct
- bienveillant
- concret
- incarne
- jamais opaque
- jamais jargonneux

### Champs lexicaux privilegies

- clarte
- direction
- blocage
- transition
- recul
- lecture
- mise en lumiere
- apaisement
- recentrage
- accompagnement

### Interdits editoriaux

- cabinet
- presentiel
- adresse d'exercice
- guerison
- magie sans nuance
- promesses medicales
- predictions definitives

### Formulation reference sur la distance

`Toutes les seances se font a distance, par telephone, visioconference ou email, avec la meme qualite d'accompagnement, depuis chez vous, sans deplacement.`

## 7. Design system operationnel

### Couleurs

- Fond principal : `#faf9f7`
- Fond doux : `#f3f0eb`
- Fond sombre 1 : `#1c1f2e`
- Fond sombre 2 : `#252a3a`
- Accent cuivre : `#b8864e`
- Texte principal : `#3a3530`
- Texte secondaire : `#6b6158`
- Bordures : `#e5dfd6`

### Typographies

- Titres : `Cinzel`
- Corps : `Lora`
- UI : `system-ui`

### Hierarchie typo

- H1 : 48 a 68px desktop, 36 a 42px mobile
- H2 : 34 a 44px desktop, 28 a 34px mobile
- H3 : 24 a 30px
- H4 : 18 a 22px
- Texte courant : 18px desktop, 17px mobile
- Small text UI : 14 a 15px

### Espacements

- XS : 8px
- S : 16px
- M : 24px
- L : 40px
- XL : 64px
- XXL : 96px

### Grille

- Largeur contenu standard : 1140px
- Largeur texte editorial : 760px
- Grille 2 colonnes max sur desktop
- Colonne unique sous 768px

### Boutons

- Primaire : fond cuivre, texte clair
- Secondaire : contour cuivre, fond transparent
- Tertiaire : lien texte fleche

### Cards

- fond clair
- bordure subtile
- ombre douce
- hover : `translateY(-4px)` + border-color accent

### Sections

- section claire
- section douce
- section sombre de contraste
- section CTA
- bandeau compact

### Modules de confiance

Elements recurrents disponibles comme badges ou mini-cards :

- `21 avis 5 etoiles Google`
- `8+ ans de pratique`
- `Livre publie en librairie nationale`
- `Certifications`
- `Seances 100% en ligne partout en France`

## 8. Composants reutilisables

Chaque composant doit exister comme pattern Gutenberg/Kadence reutilisable.

### C01 — Hero principal

Contenu :

- eyebrow
- H1
- paragraphe d'accroche
- 2 CTA
- bandeau preuves

Usages :

- accueil
- pages piliers

Modifiable :

- titre
- texte
- liens
- image ou visuel d'ambiance
- labels de confiance

### C02 — Hero service

Contenu :

- titre
- promesse
- modalites
- prix a partir de
- CTA reservation

Usages :

- pages service

### C03 — Hero formation

Contenu :

- titre
- niveau
- duree
- format en ligne
- CTA

### C04 — Bandeau confiance

Contenu :

- 3 a 5 indicateurs

### C05 — Bandeau livre sombre

Contenu :

- visuel livre
- phrase de positionnement
- logos diffuseurs ou texte diffuseurs
- CTA achat

### C06 — Card service

Contenu :

- symbole rune
- titre
- accroche benefice
- tags prix / duree / modalite
- lien

### C07 — Card formation

Contenu :

- titre
- niveau
- duree
- objectif
- lien

### C08 — Temoignage

Contenu :

- citation
- prenom + initiale
- service concerne

### C09 — FAQ

Contenu :

- question
- reponse

Format :

- accordéon Kadence

### C10 — Bloc Calendly

Contenu :

- titre
- phrase de reassurance
- embed inline
- mini note sur les modalites

### C11 — Bloc `Comment ca se passe`

Contenu :

- etapes
- format visuel lineaire ou cards

### C12 — Bloc `Pour qui`

Contenu :

- situations concretes
- liste 4 a 6 cas

### C13 — Bloc certifications

Contenu :

- liste chronologique ou grille

### C14 — Bloc newsletter

Contenu :

- promesse claire
- champ email
- bouton
- micro-note de reassurance

### C15 — Footer strategique

Contenu :

- rappel de positionnement
- menu
- contact
- reseaux
- lien reservation
- mentions

## 9. Templates de page

## T01 — Accueil

### Objectif

- poser la marque
- orienter vers les bons piliers
- rassurer
- convertir

### Structure

1. Hero principal
2. Bandeau confiance
3. Bandeau livre sombre
4. Grille des 5 services
5. Bloc `A propos` condense
6. 3 temoignages
7. Bloc newsletter
8. CTA final reservation

### Intention UX

- comprendre le site en moins de 10 secondes
- voir qu'il existe une vraie profondeur
- sentir que tout est possible a distance

### Intention conversion

- aller vers services
- aller vers reservation

### Blocs reutilisables

- C01
- C04
- C05
- C06
- C08
- C14

## T02 — A propos

### Objectif

- humaniser
- legitimiser
- creer la confiance

### Structure

1. Hero editorial
2. Recit de reconversion
3. Phrase de posture
4. Bloc sur les seances a distance
5. Timeline de formation
6. Certifications
7. CTA reservation

### Contenu cle a conserver

`Mon approche est directe, bienveillante, sans jugement. Je n'attends pas de vous que vous croyiez en quoi que ce soit — seulement que vous soyez pret(e) a regarder honnetement votre situation.`

### Timeline

- 2015 — Apprentissage des runes du Futhark ancien
- 2016 — Reiki Usui niveau I
- 2019 — Reiki Usui niveau II
- 2022 — Lithomonde niveaux I et II, Aromatherapie, Pierres et Huiles Essentielles, Lithotherapie energetique
- 2023 — Lithomonde niveau III, Tarot de Marseille, Lithotherapie energetique niveau II
- 2024 — Publication du Petit Guide des Runes

## T03 — Services

### Objectif

- centraliser les prestations
- aider au choix

### Structure

1. Hero pilier
2. Intro de positionnement
3. Grille services
4. Bloc `Comment choisir`
5. Bloc `Toutes les seances sont a distance`
6. Temoignages
7. CTA reservation

## T04 — Tirage de runes en ligne

### Objectif

- se positionner SEO sur `tirage de runes en ligne`
- eduquer
- convertir

### Structure

1. Hero service
2. Origine des runes
3. Mythologie d'Odin et Yggdrasil
4. Utilisation historique
5. Usage divinatoire
6. Evolution du Futhark ancien au regain contemporain
7. Benefices concrets d'un tirage
8. Modalites et tarifs
9. CTA reservation

### Meta service

- prix : `A partir de 30 EUR`
- modalites : `Email, telephone ou visioconference`

## T05 — Soins energetiques en ligne

### Objectif

- clarifier
- demystifier
- rassurer

### Structure

1. Hero service
2. Intro `On me demande souvent ce qu'est un soin energetique`
3. Definition simple
4. Deroulement en 9 etapes
5. Zoom sur les 4 techniques
6. Bloc `Ce que vous pouvez ressentir`
7. Modalites
8. CTA reservation

### Meta service

- prix : `A partir de 65 EUR`
- duree : `Environ 1h15`
- modalite : `Visioconference`

### Techniques a distinguer

- Reiki
- Lithomonde
- Lithotherapie
- Soin Runique

## T07 — Ateliers runes en ligne

### Objectif

- vendre les ateliers collectifs en ligne

### Structure

1. Hero
2. Atelier Initiation
3. Atelier Avance
4. FAQ
5. CTA inscription

### Informations fixes

- initiation : environ 4h
- avance : environ 3h
- livret de formation fourni
- pas besoin d'avoir ses propres runes

## T08 — Formations

### Objectif

- poser la transmission comme pilier
- accueillir l'evolution future de l'offre

### Structure

1. Hero pilier
2. Vision de la transmission
3. Grille formations
4. Parcours recommande
5. Pour qui
6. FAQ
7. CTA

## T09 — Formation initiation

### Objectif

- presenter la premiere porte d'entree

### Structure

1. Hero formation
2. Objectifs
3. Ce que l'on apprend
4. Pour qui
5. Format
6. CTA

## T10 — Formation avancee

### Objectif

- accompagner les personnes deja familiarisees

### Structure

1. Hero formation
2. Prerequis
3. Ce que l'on approfondit
4. Benefices
5. Format
6. CTA

## T11 — Le Petit Guide des Runes

### Objectif

- asseoir l'autorite
- transformer le livre en ressource vivante

### Structure

1. Hero livre
2. Presentation generale
3. Ce que contient le livre
4. A qui il s'adresse
5. Disponibilite librairies et marketplaces
6. CTA achat
7. Lien vers formations et services

### Donnees fixes

- auteur : Kevin Legros
- editeur : MLL
- diffuseurs : Fnac, Cultura, Amazon, Furet du Nord, librairies independantes

## T12 — Blog

### Objectif

- soutenir le SEO
- montrer la profondeur du projet

### Structure

1. Hero blog
2. Intro editoriale
3. Categories
4. Articles recents
5. Articles mis en avant

### Categories recommandees

- Runes et reconstruction amoureuse
- Runes et transition professionnelle
- Runes et blocages inexpliques
- Premier tirage de runes
- Futhark ancien
- Tirage de runes vs tarot
- Soins energetiques
- Reiki / Lithomonde / Lithotherapie
- Runes et developpement personnel

## T13 — Article

### Objectif

- repondre a une intention
- faire progresser vers un service

### Structure

1. Header article
2. Contenu
3. Encadre de service associe
4. CTA reservation
5. Articles lies

## T14 — Reserver / Contact

### Objectif

- convertir rapidement

### Structure

1. Hero simple
2. Rappel des modalites a distance
3. Bloc Calendly
4. Methode de prise de contact
5. Mini FAQ

## T15 — Temoignages

### Objectif

- centraliser la preuve sociale

### Structure

1. Hero
2. Intro
3. Grille temoignages
4. CTA reservation

## T16 — FAQ

### Objectif

- lever les objections

### Themes FAQ

- comment se passe une seance a distance
- telephone, visio ou email
- faut-il connaitre les runes
- comment choisir entre tirage et soin
- faut-il preparer une question
- peut-on reserver depuis n'importe ou en France
- combien de temps entre deux seances

## 10. SEO par page

### Accueil

- intention : marque + accompagnement runique en ligne

### Tirage de runes

- mot-cle principal : `tirage de runes en ligne`
- variantes : guidance runique a distance, voyance par les runes, mediumnite par les runes, runes nordiques

### Soins energetiques

- mot-cle principal : `soins energetiques en ligne`
- variantes : soin runique, soin energetique a distance, lithomonde, Reiki a distance

### Ateliers

- mot-cle principal : `atelier runes en ligne`

### Formations

- mot-cle principal : `formation runes`
- variantes : apprendre les runes nordiques, formation Futhark ancien

### Livre

- mot-cle principal : `Petit Guide des Runes`
- variantes : livre runes nordiques, guide runes Futhark ancien

## 11. Donnees dynamiques WordPress

## CPT Services

Champs :

- prix
- duree
- modalite
- rune

Usages :

- grille accueil
- grille page services
- cartes liens internes

## CPT Formations

Champs :

- prix
- duree
- niveau
- rune

Usages :

- grille formations
- cards parcours

## CPT Temoignages

Champs :

- nom affiche
- citation
- service associe
- note

Usages :

- accueil
- pages service
- page temoignages

## 12. Options globales Customizer

- telephone
- email
- lien Calendly
- Instagram
- YouTube
- Facebook
- TikTok
- lien livre
- lien avis Google
- titre hero accueil
- sous-titre hero accueil

## 13. Regles de contenu a rappeler dans l'administration

Chaque page doit respecter :

- ton direct et accessible
- aucune mention de lieu physique
- aucune promesse therapeutique
- aucune redondance excessive SEO
- CTA clair
- mention positive de l'accompagnement a distance

## 14. Priorites de production

### Phase 1

- Theme parent
- Theme enfant
- CPT
- meta boxes
- Customizer
- style global

### Phase 2

- Composants Gutenberg/Kadence
- templates accueil, service, formation, article

### Phase 3

- Pages prioritaires :
- accueil
- services
- tirage de runes, guidance & voyance
- soins energetiques
- formations
- livre
- reserver
- a propos

### Phase 4

- blog
- FAQ
- temoignages
- optimisation perf / responsive / SEO

## 15. Definition de reussite

Le blueprint est correctement implemente si :

- le site reste simple a modifier en no code
- les pages se construisent par assemblage de composants
- la marque semble mature et coherente
- la distance est percue comme un avantage
- la formation devient un pilier lisible
- les services sont clairs et distincts
- le livre renforce la credibilite
- la conversion vers Calendly est simple et naturelle
