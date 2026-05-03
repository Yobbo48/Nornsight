# Nornsight SEO

## Tant que le domaine final n'est pas choisi

- L'application utilise l'origine courante comme base SEO.
- En local, `canonical`, `og:url`, `robots.txt` et `sitemap.xml` pointent donc vers `localhost`.
- En preprod ou sur un domaine temporaire, ils pointent vers ce domaine temporaire.
- Aucune URL "finale" n'est injectee tant que `APP_BASE_URL` n'est pas renseigne.

## Quand le domaine final est achete

Ajouter :

```env
APP_BASE_URL=https://ton-domaine-final.tld
```

Puis verifier :

1. `robots.txt`
2. `sitemap.xml`
3. les `canonical`
4. les `og:url`
5. Stripe webhook sur le domaine final
6. eventuelle image Open Graph

## Ce que cette couche SEO fait aujourd'hui

- pages publiques indexables
- metas par route
- canonical
- Open Graph de base
- FAQ en JSON-LD
- sitemap
- robots

## Ce qui peut venir plus tard

- image Open Graph dediee
- contenu editorial plus long sur certaines pages
- Search Console une fois le domaine final en place
- eventuel SSR si la strategie SEO devient plus ambitieuse
