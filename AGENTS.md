# AGENTS.md

## Nornsight

Ces regles s'appliquent en priorite a `apps/web` et a toute modification du moteur de lecture runique Nornsight.

### Produit
- Nornsight est un moteur de lectures runiques.
- Le but n'est pas seulement d'etre techniquement correct : il faut produire des lectures credibles, nuancees, utiles et vendables.

### Priorites metier
- Un tirage positif doit pouvoir rester positif.
- Un ajustement simple ne doit pas etre traite comme un frein majeur.
- Un tirage tendu doit rester franc sans devenir punitif.
- Le gratuit doit etre clair, utile et lisible.
- Le payant doit apporter une vraie valeur supplementaire.
- Le payant ne doit jamais etre un gratuit allonge.
- Une question factuelle brute ne doit pas suivre la meme filiere qu'une vraie question de tirage.

### Logique moteur
- Respecter les filieres `standard`, `reframe`, `sensible`.
- Ne pas reintroduire une logique binaire simpliste.
- Ne pas ecraser la decision locale par une reformulation trop libre.
- Ne pas surponderer la prudence sur les tirages porteurs.
- Ne pas noircir artificiellement un tirage favorable.
- Garder la hierarchie : decision locale -> synthese interne -> rendu gratuit/payant -> fallback propre.

### Redaction
- Eviter le texte scolaire.
- Eviter les repetitions deguisees.
- Eviter les blocs qui disent la meme chose autrement.
- Relier chaque lecture a la situation reelle posee par la question.
- Garder une langue simple, claire, incarnee et non robotique.

### Garde-fous
- Ne jamais exposer les coulisses internes.
- Ne jamais faire fuiter `fallback`, `score`, `internal_synthesis`, `validation flags`.
- Ne jamais afficher les pourcentages internes a l'utilisateur.
- Ne jamais laisser les questions `reframe` declencher une vraie lecture premium classique.
- Controler les couts : pas de retries inutiles, pas d'appel full premium pour une question mal routee.

### Review
- Toute review sur Nornsight doit suivre [code_review.md](./code_review.md).

## Objet
Ce projet sert a construire la v1 du site WordPress de `L'energie des Runes`.

La v1 doit rester :
- simple
- propre
- maintenable
- modifiable sans code ensuite dans WordPress + Elementor Pro

## Stack validee
- Theme : `Hello Elementor`
- Builder : `Elementor Pro`
- Plugin metier : `edr-core`
- Contenus metier : `CPT offre`
- Taxonomie : `type_offre`
- Blog : WordPress natif

## Regle de separation
- Le plugin `edr-core` porte le contenu metier.
- Le theme porte seulement le socle visuel leger.
- Elementor porte le rendu visuel des pages, templates et composants.
- Aucune logique metier ne doit vivre dans le theme.
- Aucune page marketing ne doit etre codee en dur.

## Regles absolues
- Ne pas remettre de CPT ni de taxonomie dans le theme.
- Ne pas coder les textes marketing dans les templates PHP.
- Ne pas reintroduire une architecture block theme.
- Ne pas ajouter de surcouche complexe dans le child theme.
- Ne pas surconstruire la v1.
- Ne pas multiplier les variantes de composants sans besoin reel.
- Ne pas embedder Calendly partout.
- Ne jamais mentionner de cabinet, de presentiel ou de lieu physique.
- Ne jamais promettre de resultat medical ou therapeutique.
- Ne jamais basculer dans un ton esoterique caricatural.

## Regles de contenu
- Ton : direct, humain, professionnel, rassurant.
- Style : sobre, naturel, premium, lisible.
- Le site doit mettre en avant une activite 100% a distance.
- Formulation cle : `accessible partout en France, sans deplacement`.
- Les pages doivent rester courtes, claires, bien hierarchisees.

## Modele de contenu v1
### CPT `offre`
Un seul CPT pour la v1 :
- `offre`

### Taxonomie `type_offre`
Deux termes de base :
- `service`
- `formation`

### Champs custom v1
Strict minimum :
- `prix`
- `duree`
- `modalite`
- `texte_cta`
- `url_cta`
- `mise_en_avant`
- `rune_ou_symbole`

### Champs natifs a conserver
- titre
- contenu principal
- extrait
- image mise en avant

## Templates Elementor a produire
Dans Theme Builder :
- Header
- Footer
- Single Offre
- Single Post
- Archive Blog

Pages Elementor :
- Accueil
- Services
- Formations
- A propos
- Livre
- Contact / Reservation

## Bibliotheque de composants v1
Limiter la v1 a ces composants :
- `EDR - Hero Principal`
- `EDR - Hero Interieur`
- `EDR - Intro Editoriale`
- `EDR - Carte Offre`
- `EDR - Grille Offres`
- `EDR - Ruban Confiance`
- `EDR - Bloc Temoignages`
- `EDR - Bloc Livre`
- `EDR - Bloc FAQ`
- `EDR - CTA Simple`

## Conventions Elementor
- Nommer tous les templates et composants avec le prefixe `EDR -`.
- Ne pas laisser de noms flous du type `Section test`, `Hero final 2`, `Bloc copy`.
- 1 composant = 1 usage clair.
- 1 page = 1 structure lisible, pas de duplication confuse.

## Regles UX v1
- `Single Offre` : pas de Calendly embed par defaut.
- `Single Offre` : CTA principal vers `Contact / Reservation`.
- `Offres liees` : 2 ou 3 maximum.
- `Homepage` : pas d'embed Calendly complet.
- `Homepage` : distinguer clairement accompagnement et transmission.
- `Contact / Reservation` : page unique de prise de rendez-vous avec embed Calendly central.

## Regles de build
Ordre de production a respecter :
1. Header
2. Footer
3. Single Offre
4. Single Post
5. Archive Blog
6. Composants Elementor
7. Contact / Reservation
8. Services
9. Formations
10. Accueil
11. A propos
12. Livre

## Regles de code
- Code lisible.
- Code maintenable.
- Pas de logique prematuree pour la v2.
- Commentaires sobres uniquement si utiles.
- Privilegier l'option la plus simple quand un choix est discutable.

## Regles de validation avant mise en ligne
- Menu et CTA coherents.
- Responsive propre.
- Pages sans texte lorem.
- Aucun lien mort.
- Aucun doublon de section.
- Aucun contenu parasite du theme.
- Aucun residu des tentatives precedentes.
