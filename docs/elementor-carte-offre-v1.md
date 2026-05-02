# EDR - Carte Offre

Composant Elementor v1 pour afficher une offre dans les pages `Services`, `Formations` et `Offres liees`.

## Structure exacte

### Container principal
- 1 container vertical
- largeur : 100%
- padding : `20px`
- gap : `14px`
- justify content : `flex-start`
- align items : `stretch`
- border radius : `20px`
- border : `1px solid rgba(0,0,0,0.08)`
- background : blanc ou blanc casse

### Ordre des elements
1. Image mise en avant
2. Titre
3. Extrait
4. Ligne meta
5. Bouton

## Widgets a utiliser

### 1. Image mise en avant
- Widget : `Featured Image`
- largeur : 100%
- ratio propre et constant
- border radius : `16px`

### 2. Titre
- Widget : `Post Title`
- niveau HTML : `H3`
- alignement : gauche

### 3. Extrait
- Widget : `Post Excerpt`
- longueur courte
- alignement : gauche

### 4. Ligne meta
- 1 container horizontal
- gap : `10px`
- wrap : `wrap`

Dans cette ligne meta, ajouter 3 widgets `Text Editor` ou `Heading` dynamiques :
- `prix`
- `duree`
- `modalite`

Option :
- afficher `rune_ou_symbole` seulement si c'est utile visuellement
- sinon ne pas le forcer en v1

### 5. Bouton
- Widget : `Button`
- texte dynamique depuis `texte_cta`
- lien dynamique vers le post courant ou vers la page single de l'offre

Pour les listings `Services` / `Formations` :
- bouton conseille : `Decouvrir`
- lien : page single de l'offre

Pour les `Offres liees` :
- meme logique

## Reglages de base

### Spacing
- padding container : `20px`
- espace entre image et titre : `14px`
- espace entre titre et extrait : `10px`
- espace entre extrait et meta : `12px`
- espace entre meta et bouton : `16px`

### Alignement
- tout aligne a gauche
- bouton aligne a gauche
- pas de centrage dans la carte

### Style recommande
- image forte en haut
- titre compact
- extrait court
- metas en petite taille
- bouton simple, lisible, sans effet lourd

## Version mobile
- 1 carte = 1 colonne
- padding : `16px`
- metas en wrap sur 2 lignes si besoin
- bouton pleine largeur si la largeur devient trop courte
- garder l'extrait court pour eviter une carte trop haute

## Regles v1
- pas de carousel
- pas de badge inutile
- pas d'animation lourde
- pas de CTA secondaire
- pas plus de 3 metas visibles

## Usage
- Page `Services`
- Page `Formations`
- Section `Offres liees` dans `Single Offre`
