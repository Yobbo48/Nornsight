# EDR Themes

Ce dossier contient le nouveau socle de travail :

- `wp-content/themes/edr-core/` : theme parent
- `wp-content/themes/edr-child/` : theme enfant

Le parent pose :

- la structure
- les CPT
- le Customizer
- le theme.json
- les patterns de depart
- le style premium principal
- le header/footer
- l'importeur de pages de base depuis l'admin WordPress

Le child reste vide pour garder une evolution propre.

## Mise en place rapide

1. Installer `edr-core` puis `edr-child`
2. Activer `edr-core` une premiere fois
3. Regler :
   - le logo
   - le titre du site
   - le slogan
4. Activer ensuite `edr-child` si tu veux travailler avec un enfant actif
5. Aller dans `Apparence > EDR Import`
6. Importer toutes les pages de base
7. Aller dans `Réglages > Lecture` pour verifier que la page d'accueil est bien `Accueil`
8. Ajuster les contenus dans Gutenberg

## Presets inclus

Le theme parent contient maintenant des presets JSON internes dans :

- `wp-content/themes/edr-core/seed-pages/`

Ils peuvent etre importes directement depuis l'ecran `Apparence > EDR Import`.
