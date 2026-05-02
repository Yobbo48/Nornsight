# Installation WordPress — L’énergie des Runes

## 1. Installer le thème

Dans WordPress :

1. Va dans `Apparence > Thèmes`
2. Téléverse `edr-core.zip`
3. Active `edr-core`
4. Téléverse ensuite `edr-child.zip`
5. Si tu veux travailler avec un thème enfant actif, active `edr-child`

Important :
- `edr-core` contient le vrai socle
- `edr-child` reste volontairement léger

## 2. Installer les plugins utiles

Minimum recommandé :

- `Kadence Blocks` (gratuit)
- `Rank Math` ou `Yoast SEO`
- `WP Mail SMTP`
- `Redirection`

Optionnel ensuite :

- un plugin de cache léger
- `Fluent Forms` si tu veux un formulaire de contact plus poussé

## 3. Régler l’identité du site

Va dans :

- `Apparence > Personnaliser`

Puis règle :

- logo officiel
- titre du site
- slogan
- téléphone
- email
- URL Calendly
- lien du livre
- réseaux sociaux

## 4. Importer les pages de base

Le thème embarque maintenant un importeur simple.

Va dans :

- `Apparence > EDR Import`

Tu pourras :

- importer toutes les pages de base d’un coup
- ou importer une page précise
- relancer l’import plus tard pour mettre à jour une page de base

Pages prévues :

- Accueil
- Services
- À propos
- Formations
- Le Livre
- Réserver

## 5. Vérifier la page d’accueil

Après import :

1. Va dans `Réglages > Lecture`
2. Vérifie que `Accueil` est bien utilisée comme page d’accueil

Le thème essaie déjà de la définir automatiquement à l’import, mais il vaut mieux contrôler.

## 6. Configurer le menu

Va dans :

- `Apparence > Éditeur > Navigation`
ou
- `Apparence > Menus` selon ton installation

Navigation principale attendue :

- Accueil
- À propos
- Services
- Formations
- Le Livre
- Blog
- Réserver

## 7. Ce que tu peux modifier sans code

Dans Gutenberg + Kadence Blocks, tu pourras :

- modifier les textes
- remplacer les visuels
- changer les CTA
- déplacer les sections
- supprimer ou dupliquer des blocs
- ajuster certains espacements et colonnes
- refaire l’ordre des sections de page

## 8. Ce qu’il vaut mieux garder stable

Pour conserver l’élégance du site, je te conseille de ne pas trop casser :

- la palette
- la typo
- le header
- le footer
- les styles des boutons
- les styles des cartes

## 9. Calendly

La page `Réserver` contient déjà une structure prévue pour Calendly.

Dans le bloc concerné, tu pourras :

- remplacer le placeholder par l’embed Calendly
- ou utiliser l’URL globale définie dans le Customizer

## 10. Newsletter

Le thème contient déjà la base AJAX newsletter.

Avant usage réel :

- branche Brevo
- teste l’envoi
- vérifie les messages de succès/erreur

## 11. Ordre conseillé après installation

1. logo + identité
2. import des pages
3. menu
4. page d’accueil
5. page Services
6. page Réserver
7. page Formations
8. page Livre
9. SEO
10. responsive final

## 12. Fichiers utiles

Thème parent :

- [edr-core](/Users/kevin/Documents/New%20project/wordpress/wp-content/themes/edr-core/style.css)

Thème enfant :

- [edr-child](/Users/kevin/Documents/New%20project/wordpress/wp-content/themes/edr-child/style.css)

Pages JSON externes :

- [page-json](/Users/kevin/Documents/New%20project/wordpress/page-json/home-v1.json)

Guide thème :

- [edr-themes-README.md](/Users/kevin/Documents/New%20project/wordpress/edr-themes-README.md)
