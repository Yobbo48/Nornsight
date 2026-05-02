# Checklist De Production Et Controle Qualite V1

## Ordre Exact De Build
1. Installer et activer `Hello Elementor`
2. Installer et activer `Elementor Pro`
3. Installer et activer `edr-core`
4. Creer les termes `service` et `formation` dans `type_offre`
5. Creer le menu principal WordPress
6. Creer le `Header` dans Elementor Theme Builder
7. Creer le `Footer` dans Elementor Theme Builder
8. Creer le template `Single Offre`
9. Creer le template `Single Post`
10. Creer le template `Archive Blog`
11. Construire les composants Elementor v1
12. Creer les 3 offres de demonstration
13. Monter la page `Contact / Reservation`
14. Monter la page `Services`
15. Monter la page `Formations`
16. Monter la page `Accueil`
17. Monter la page `A propos`
18. Monter la page `Livre`
19. Definir `Accueil` comme page d'accueil statique
20. Verifier blog, liens et CTA

## Controle Responsive

### Global
- Le header passe correctement en burger sur mobile.
- Aucun bloc ne deborde horizontalement.
- Les sections respirent encore sur tablette.
- Les colonnes se replient proprement en une colonne sous mobile.

### Accueil
- Le hero reste lisible sans couper le message.
- Les blocs `accompagnement` et `transmission` restent bien distincts.
- Les cartes d'offres passent en 1 colonne sur mobile.

### Single Offre
- Les metas `prix`, `duree`, `modalite` restent lisibles sur petit ecran.
- Le CTA principal reste visible sans scroll excessif.
- Les offres liees n'envahissent pas la page.

### Contact / Reservation
- L'embed Calendly reste utilisable sur mobile.
- Le texte d'introduction ne pousse pas Calendly trop bas.

## Controle UX

### Navigation
- Le menu principal contient seulement les pages utiles.
- Le bouton `Reserver` est toujours visible ou facilement atteignable.
- Le blog n'ecrase pas les pages de conversion.

### Conversion
- Homepage : CTA vers reservation visible rapidement.
- Single Offre : CTA clair vers `Contact / Reservation`.
- Contact / Reservation : un seul point central de prise de rendez-vous.

### Clarte
- Les pages `Services` et `Formations` sont clairement distinctes.
- Aucun jargon flou ou inutile.
- Les pages ne sont pas surchargees.

## Controle SEO

### Structure
- Une balise H1 unique par page.
- Titre de page clair et coherent avec l'intention.
- Meta title et meta description renseignes.
- URLs propres et coherentes.

### Contenu
- Pas de doublon de sections ou de titres entre `Services` et `Formations`.
- Chaque page repond a une intention claire.
- Les CTA n'ecrasent pas le contenu informatif.

### Blog
- Archive blog propre.
- Single post avec bonne hierarchie H2/H3.
- Liens internes vers pages `Services`, `Formations` ou `Reservation`.

## Controle Performance
- Images compressees et bien dimensionnees.
- Pas de slider lourd non indispensable.
- Pas de video auto-play.
- Pas d'embed Calendly en dehors de la page `Contact / Reservation`.
- Nombre de polices limite.
- CSS additionnel sobre et centralise.

## Controle De Contenu
- Aucun texte lorem.
- Aucun contenu encore code en dur dans le theme.
- Aucun residu des anciennes tentatives.
- Toutes les offres ont :
  - titre
  - extrait
  - image
  - prix
  - duree
  - modalite
  - CTA
  - type d'offre

## Controle Avant Mise En Ligne
- Page d'accueil statique bien definie.
- Menu principal bien assigne.
- Logo definitif en place.
- Liens CTA testes.
- Calendly teste.
- Formulations 100% a distance verifiees.
- Aucun mot problematique type `cabinet`, `presentiel`, `guerison`.
- Footer complet et propre.
- Articles et pages test supprimes.
- Permaliens verifies.
- Favicon et infos site en place.

## Validation Finale V1
Le site est pret a etre ouvert si :
- la navigation est claire
- les pages principales sont montees
- les offres de demonstration fonctionnent
- le responsive est propre
- la reservation est centralisee
- le ton est coherent
- le rendu est premium mais simple
