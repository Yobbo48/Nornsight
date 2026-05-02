# Blueprint Technique — Theme Parent WordPress

## 1. Objectif du theme parent

Le theme parent doit servir de socle durable.

Il ne doit pas contenir :

- de contenus figes difficiles a changer
- de logique metier trop dispersee
- de mise en page verrouillee partout
- de dependance a un builder proprietaire

Il doit contenir :

- le design system global
- les styles globaux du site
- les conventions de structure
- les CPT necessaires
- les meta boxes simples
- les reglages globaux du Customizer
- les templates WordPress minimaux
- les patterns de reference

## 2. Architecture de fichiers recommandee

Nom du theme parent :

`edr-core`

Nom du theme enfant :

`edr-child`

### Structure du theme parent

```text
edr-core/
├── style.css
├── theme.json
├── functions.php
├── screenshot.png
├── templates/
│   ├── page.html
│   ├── single.html
│   ├── archive.html
│   ├── index.html
│   ├── home.html
│   └── front-page.html
├── parts/
│   ├── header.html
│   ├── footer.html
│   ├── sidebar.html
│   └── post-meta.html
├── patterns/
│   ├── hero-home.php
│   ├── trust-strip.php
│   ├── book-banner.php
│   ├── services-grid.php
│   ├── testimonials-grid.php
│   ├── newsletter-block.php
│   ├── hero-service.php
│   ├── process-steps.php
│   ├── faq-block.php
│   ├── calendly-block.php
│   ├── training-grid.php
│   └── certifications-block.php
├── inc/
│   ├── setup.php
│   ├── assets.php
│   ├── cpts.php
│   ├── meta-boxes.php
│   ├── customizer.php
│   ├── ajax-newsletter.php
│   ├── helpers.php
│   ├── block-styles.php
│   └── admin-guidelines.php
├── assets/
│   ├── css/
│   │   ├── editor.css
│   │   ├── frontend.css
│   │   └── utilities.css
│   ├── js/
│   │   ├── theme.js
│   │   ├── header-scroll.js
│   │   ├── reveal.js
│   │   ├── mobile-menu.js
│   │   └── newsletter.js
│   └── images/
│       └── placeholders/
└── languages/
```

## 3. Philosophie technique

Le theme parent gere :

- le cadre
- la coherence
- les composants
- le style
- la structure

Les pages gerees par Gutenberg + Kadence gerent :

- les contenus
- les variations de section
- les images
- les ajustements editoriaux
- l'assemblage final des pages

Principe :

`Le theme fixe les regles. L'editeur assemble les pages.`

## 4. Repartition des responsabilites

### Theme parent

- palette
- typo
- largeurs
- styles de boutons
- styles de cards
- styles de blocs natifs
- styles Kadence communs
- composants reutilisables
- CPT et meta boxes
- options globales
- scripts d'interface sobres

### Theme enfant

- vide au depart
- reserve a de futurs ajustements mineurs
- aucun contenu
- aucun style metier si non necessaire

### Gutenberg + Kadence

- construction des pages
- reordonnancement des blocs
- adaptation des textes
- remplacement des visuels
- duplication des sections

## 5. Theme.json — responsabilites

`theme.json` doit devenir la source principale de coherence visuelle.

Il doit definir :

- palette globale
- typographies globales
- tailles typographiques
- espacements
- content width
- wide width
- styles globaux des blocs de base

### Contenu attendu dans `theme.json`

- couleurs :
  - base claire
  - base douce
  - contraste nuit 1
  - contraste nuit 2
  - accent cuivre
  - texte principal
  - texte secondaire
  - bordure
- typographies :
  - `Cinzel` pour titres
  - `Lora` pour texte
  - `system-ui` pour UI
- tailles :
  - xs
  - sm
  - md
  - lg
  - xl
  - xxl
- layout :
  - content size
  - wide size

## 6. Styles CSS — organisation

### `style.css`

Reste minimal :

- en-tete de theme
- import si besoin

### `assets/css/frontend.css`

Contient :

- styles globaux front
- layout
- composants
- variations

### `assets/css/editor.css`

Contient :

- coherence visuelle dans l'editeur
- alignement avec le front
- styles de confort pour Gutenberg

### `assets/css/utilities.css`

Contient uniquement des utilitaires sobres :

- `is-soft`
- `is-dark`
- `is-narrow`
- `has-top-divider`
- `has-bottom-divider`
- `u-text-center`
- `u-stack-lg`

Pas de framework utilitaire lourd.

## 7. JavaScript — organisation

Le JS doit rester discret et non critique.

### `theme.js`

Charge les modules simples.

### `header-scroll.js`

Ajoute une classe au header quand on scrolle.

### `reveal.js`

Anime les sections marquees `data-reveal`.

### `mobile-menu.js`

Gere le drawer plein ecran du menu mobile.

### `newsletter.js`

Gere l'envoi AJAX de la newsletter.

Interdits :

- animations lourdes
- dependances JS inutiles
- comportements qui bloquent l'edition

## 8. Conventions de nommage CSS

Nommer les classes selon une logique simple et stable.

### Prefixe global

Utiliser `edr-` pour tous les composants.

### Exemples

- `edr-hero`
- `edr-hero__content`
- `edr-hero__actions`
- `edr-card-service`
- `edr-card-service__title`
- `edr-trust-strip`
- `edr-book-banner`
- `edr-process-steps`
- `edr-faq`
- `edr-calendly-block`

### Variantes

- `is-dark`
- `is-soft`
- `is-compact`
- `is-featured`

### Regle

Ne jamais styliser une page sur la base d'un identifiant local improvise.

## 9. CPT — structure precise

## CPT `service`

### Usage

- pages d'offre
- cartes reutilisables
- page `Services`

### Supports

- title
- editor
- excerpt
- thumbnail
- custom-fields

### Meta fields

- `_edr_service_price`
- `_edr_service_duration`
- `_edr_service_modality`
- `_edr_service_rune`
- `_edr_service_cta_label`
- `_edr_service_cta_url`

### Slugs des posts principaux prevus

- `tirage-de-runes-en-ligne`
- `soins-energetiques-en-ligne`
- `ateliers-runes-en-ligne`
- `lecture-vies-anterieures` si maintenu
- `purification-des-lieux` si maintenu

## CPT `formation`

### Usage

- cartes de formations
- page pilier `Formations`

### Supports

- title
- editor
- excerpt
- thumbnail
- custom-fields

### Meta fields

- `_edr_training_price`
- `_edr_training_duration`
- `_edr_training_level`
- `_edr_training_rune`
- `_edr_training_format`
- `_edr_training_cta_label`
- `_edr_training_cta_url`

## CPT `testimonial`

### Usage

- accueil
- pages service
- page temoignages

### Supports

- title
- editor
- custom-fields

### Meta fields

- `_edr_testimonial_name`
- `_edr_testimonial_service`
- `_edr_testimonial_rating`
- `_edr_testimonial_source`
- `_edr_testimonial_featured`

## 10. Meta boxes — regles

Les meta boxes doivent rester tres simples.

Objectif :

- completer les cards
- alimenter quelques sections dynamiques
- ne pas transformer WordPress en interface complexe

Regles :

- peu de champs
- labels clairs
- placeholders concrets
- sanitization stricte
- aucun champ superflu

## 11. Customizer — blueprint

Le Customizer doit centraliser uniquement les options globales.

### Section `Identite & contact`

- telephone
- email
- texte court de positionnement

### Section `Reservation`

- URL Calendly
- texte du CTA principal

### Section `Livre`

- URL livre
- texte CTA livre

### Section `Reseaux`

- Instagram
- YouTube
- Facebook
- TikTok

### Section `Preuves`

- texte `21 avis 5 etoiles Google`
- texte `8+ ans de pratique`
- texte `Livre publie en librairie nationale`
- lien avis Google

### Section `Accueil`

- titre hero
- sous-titre hero

Regle :

pas de multiplication de micro-reglages de design dans le Customizer.

Le design doit rester dans `theme.json` + styles.

## 12. Templates WordPress — blueprint technique

Le theme doit proposer une base simple :

- `front-page.html`
- `home.html`
- `page.html`
- `single.html`
- `archive.html`
- `index.html`

### `front-page.html`

Utilise les patterns :

- hero-home
- trust-strip
- book-banner
- services-grid
- about-condensed
- testimonials-grid
- newsletter-block

### `page.html`

Template neutre pour pages classiques.

### `single.html`

Template article avec :

- titre
- meta
- contenu
- bloc CTA article
- navigation articles

### `archive.html`

Template blog / archives simple et sobre.

## 13. Patterns — organisation

Chaque pattern doit etre :

- autonome
- modifiable
- simple a dupliquer
- documente par son nom

### Noms recommandes

- `EDR / Hero Accueil`
- `EDR / Bandeau Confiance`
- `EDR / Bandeau Livre`
- `EDR / Grille Services`
- `EDR / Grille Formations`
- `EDR / Bloc Temoignages`
- `EDR / Bloc FAQ`
- `EDR / Bloc Calendly`
- `EDR / Bloc Newsletter`
- `EDR / Bloc Certifications`

### Regle

Un pattern = un role clair.

Pas de pattern monstre qui contient la moitie d'une page.

## 14. Kadence Blocks — usage recommande

Kadence doit servir a :

- les rows/layouts
- les accordion FAQ
- les testimonials si utile
- les tabs si besoin futur
- les advanced buttons
- les icon lists

Kadence ne doit pas servir a contourner l'architecture.

Principe :

- Gutenberg pour la structure
- Kadence pour affiner proprement

## 15. Newsletter AJAX maison

### Objectif

- capter l'email
- integrer Brevo proprement
- rester simple

### Fichiers

- `inc/ajax-newsletter.php`
- `assets/js/newsletter.js`

### Flux

1. Saisie email
2. Validation front simple
3. Envoi AJAX nonce
4. Validation back
5. Envoi vers Brevo
6. Message de succes/erreur

### Reponses UI

- succes simple
- deja inscrit
- email invalide
- erreur temporaire

## 16. Header et navigation

### Desktop

- logo / nom
- menu principal
- CTA reservation

### Mobile

- burger
- drawer plein ecran
- CTA reservation visible

### Comportement

- header transparent ou leger au top
- header plus solide au scroll
- pas d'animation lourde

## 17. Footer

Le footer doit etre strategique, pas administratif uniquement.

Contenu :

- rappel du positionnement
- liens principaux
- contact
- lien reservation
- reseaux
- livre
- FAQ
- mentions

## 18. Composants dynamiques a alimenter depuis les CPT

### Bloc `Services`

Source :

- CPT service

Affiche :

- titre
- extrait
- rune
- prix
- duree
- modalite
- lien

### Bloc `Formations`

Source :

- CPT formation

Affiche :

- titre
- extrait
- niveau
- duree
- rune
- lien

### Bloc `Temoignages`

Source :

- CPT testimonial

Affiche :

- citation
- nom
- service
- note

## 19. Regles d'edition pour rester no code

Apres mise en place, l'utilisateur doit pouvoir :

- modifier les textes dans Gutenberg
- remplacer les images
- dupliquer des sections
- changer l'ordre des blocs
- ajuster les CTA
- publier de nouveaux services, temoignages ou formations

L'utilisateur ne doit pas avoir besoin de :

- toucher au CSS
- toucher aux templates
- editer du PHP
- changer les classes manuellement

## 20. Garde-fous anti-desarrois futur

### Regle 1

Chaque nouvelle page doit commencer depuis un template ou un JSON d'import.

### Regle 2

Chaque nouvelle section doit venir d'un pattern existant si possible.

### Regle 3

Pas de nouvelle couleur sans mise a jour du design system.

### Regle 4

Pas de nouveaux plugins pour corriger un probleme de structure.

### Regle 5

Pas de contenu important enferme dans le theme si ce contenu doit etre edite regulierement.

## 21. Roadmap technique de production

### Sprint 1

- creer le theme parent
- creer le theme enfant
- poser `theme.json`
- enregistrer assets
- poser header/footer

### Sprint 2

- creer CPT
- creer meta boxes
- creer Customizer
- creer helper functions

### Sprint 3

- construire patterns principaux
- construire templates
- harmoniser front/editor

### Sprint 4

- integrer newsletter AJAX
- integrer Calendly
- tester responsive
- tester perf

### Sprint 5

- exporter pages JSON
- documenter l'usage
- verifier SEO

## 22. Definition de reussite technique

La base technique est reussie si :

- le theme parent pose une vraie coherence globale
- le theme enfant peut rester vide
- les pages sont construites en blocs sans bricolage
- les contenus ne sont pas prisonniers du code
- l'administration reste lisible
- les composants sont reutilisables
- la maintenance future reste simple
