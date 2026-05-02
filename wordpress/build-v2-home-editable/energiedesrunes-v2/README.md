# L'Énergie des Runes v2 — Thème WordPress

Thème sur mesure v2 — design clair, contenu SEO, 100% personnalisable.

## Installation rapide

1. Zipper le dossier `energiedesrunes-v2/`
2. WordPress Admin → Apparence → Thèmes → Ajouter → Téléverser → Activer

## Personnalisation sans coder

Tout se passe dans **Apparence → Personnaliser → L'Énergie des Runes** :
- Titre et sous-titre du Hero
- Email, téléphone
- URL Calendly, Nornsight, réseaux sociaux, lien livre
- Lien avis Google

## Contenu modifiable directement dans WordPress

### Custom Post Types (menus dans l'admin)
- **Témoignages** → ajouter/modifier les avis affichés en home
- **Services** → chaque prestation avec prix, durée, modalité, rune
- **Formations** → chaque formation avec prix, niveau, durée

### Champs personnalisés (sidebar de chaque CPT)
Pour les Services :
- Prix / Tarif (ex : "À partir de 35€")
- Durée (ex : "30 min · 1h")
- Modalité (ex : "En ligne · À distance")
- Rune (symbole à afficher, ex : "ᚱ")

Pour les Formations :
- Prix (ex : "89€")
- Niveau (Débutant / Intermédiaire / Avancé)
- Durée / Volume (ex : "4 modules vidéo")
- Rune (ex : "ᚠ")

## Plugins recommandés (gratuits)

| Plugin | Usage |
|--------|-------|
| Yoast SEO ou RankMath | Optimisation SEO page par page |
| Simply Schedule Appointments | Prise de RDV intégrée (remplace Calendly optionnel) |
| Tutor LMS | Formations en ligne |
| Brevo for WP | Connexion newsletter Brevo/Sendinblue |
| WP Super Cache | Performances |
| Smush | Optimisation images |

## Structure des fichiers

```
energiedesrunes-v2/
├── style.css       ← Styles complets + déclaration thème
├── functions.php   ← Setup, CPT, meta boxes, customizer, AJAX
├── index.php       ← Page d'accueil (homepage)
├── header.php      ← Header + navigation responsive
├── footer.php      ← Pied de page
├── singular.php    ← Pages et articles
├── js/
│   └── main.js     ← Burger, scroll reveal, newsletter
└── README.md
```

## Brancher Brevo pour la newsletter

Dans `functions.php`, repérer la fonction `edr_newsletter()`.
Remplacer le commentaire `// TODO : brancher ici l'API Brevo` par :

```php
$api_key = 'VOTRE_CLÉ_API_BREVO';
wp_remote_post('https://api.brevo.com/v3/contacts', [
    'headers' => [
        'accept'       => 'application/json',
        'content-type' => 'application/json',
        'api-key'      => $api_key,
    ],
    'body' => json_encode(['email' => $email, 'listIds' => [VOTRE_ID_LISTE]]),
]);
```

## Polices utilisées
- **Cormorant Garamond** (serif) — titres
- **DM Sans** (sans-serif) — corps, navigation
- Chargées depuis Google Fonts, incluses dans functions.php
