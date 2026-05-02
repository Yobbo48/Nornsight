# Blueprint JSON Import — Pages Prioritaires

## 1. Objectif

Les pages prioritaires doivent etre preparables sous forme de JSON importables unitairement dans WordPress.

Chaque JSON doit :

- correspondre a une page reelle
- utiliser les patterns definis
- avoir une structure stable
- pouvoir etre reimporte sans confusion

## 2. Convention de nommage

Nom de fichier recommande :

- `home-v1.json`
- `about-v1.json`
- `services-v1.json`
- `tirage-runes-v1.json`
- `soins-energetiques-v1.json`
- `ateliers-v1.json`
- `formations-v1.json`
- `livre-v1.json`
- `reserver-v1.json`
- `blog-v1.json`
- `faq-v1.json`
- `temoignages-v1.json`

## 3. Pages a prioriser

### Lot 1 — indispensable

- home
- services
- tirage de runes
- soins energetiques
- formations
- livre
- reserver
- a propos

### Lot 2 — support

- blog
- faq
- temoignages
- contact

## 4. Contenu minimum par JSON

Chaque export doit embarquer :

- le hero
- les sections dans le bon ordre
- les placeholders de visuels si besoin
- les CTA
- les textes de base deja propres editorialement

Les grilles dynamiques doivent idealement pointer vers les CPT, pas etre refaites a la main dans chaque JSON.

## 5. Regle d'assemblage

Chaque JSON doit etre compose a partir des patterns du blueprint, avec eventuellement :

- 1 a 2 blocs editoriaux specifiques
- jamais plus

## 6. Validation avant import

Avant de considerer un JSON comme valide :

- verifier responsive mobile
- verifier coherence des espacements
- verifier hierarchie H1 / H2 / H3
- verifier CTA principal
- verifier absence de mentions interdites
- verifier ton et distance positive

## 7. Definition de reussite

Le systeme JSON est reussi si :

- une page prioritaire peut etre importee rapidement
- l'utilisateur n'a plus qu'a ajuster le contenu
- la structure reste coherente sans retouche CSS
