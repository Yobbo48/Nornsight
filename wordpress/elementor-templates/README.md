# Header Elementor - L'energie des Runes

Ce dossier contient un vrai starter de header Elementor importable :

- `edr-header-free-v1.json`
- `edr-header-pro-v1.json`

## Ce que c'est

Ce fichier est un **template de section Elementor** pense pour fonctionner avec :

- le theme `/Users/kevin/Documents/New project/wordpress/wp-content/themes/edr-elementor/`
- Elementor Free

Le rendu beau/premium vient de la combinaison :

1. de la structure Elementor importee
2. des classes CSS deja presentes dans `edr-elementor/style.css`

## Différence Free / Pro

Avec **Elementor Free**, le "menu" dans ce header est volontairement un bloc de liens manuels.
Ce n'est **pas** un vrai widget `Nav Menu`, car ce widget demande Elementor Pro.

En pratique :

- Elementor Free : tu modifies les liens directement dans le widget `Editeur de texte`
- Elementor Pro : utilise directement `edr-header-pro-v1.json`, qui vise un vrai widget `Nav Menu`

## Comment l'importer

1. Active `edr-elementor` ou `edr-elementor-child`
2. Ouvre une page avec Elementor
3. Clique sur l'icone `dossier`
4. Va dans `Mes modeles` puis `Importer un modele`
5. Importe le fichier adapte :
   - `edr-header-free-v1.json` si tu es en Free
   - `edr-header-pro-v1.json` si tu es en Pro
6. Insere la section en haut de la page

## Pour en faire un vrai header global

Il faut l'un de ces 2 cas :

- **Elementor Pro** avec `Theme Builder`
- ou un plugin de type `Header Footer Builder for Elementor`

Ensuite :

1. va dans `Templates > Theme Builder > Header`
2. cree un nouveau header
3. importe `edr-header-pro-v1.json`
4. publie sur `Tout le site`
5. dans le widget `Nav Menu`, verifie que le bon menu WordPress est selectionne

## Ajustements conseilles juste apres import

1. remplace le bloc branding par ton logo officiel + le nom de marque
2. remplace l'URL Calendly du bouton
3. corrige les URLs des liens
4. si tu as Elementor Pro, utilise de preference `edr-header-pro-v1.json`
5. garde le theme `edr-elementor` actif pour profiter du style deja pose
