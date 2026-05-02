# Nornsight checkout + livraison

## Flux retenu
- `created` : tirage gratuit cree
- `payment_pending` : session Stripe creee
- `paid` : paiement confirme par webhook
- `generating` : lecture approfondie en cours
- `delivered` : lecture generee et livree
- `failed` : generation ou livraison en echec

## Routes
- `POST /api/tirages/free`
- `POST /api/tirages/save-email`
- `POST /api/tirages/checkout`
- `GET /api/tirages/status?tirageId=...`
- `POST /api/stripe/webhook`

## Variables minimales
- `APP_BASE_URL`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `STRIPE_PRICE_CENTS`
- `STRIPE_CURRENCY`
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASSWORD`
- `MAIL_FROM_EMAIL`

## Comportement si Stripe n'est pas encore branche
- le tunnel reste affichable
- la collecte d'email reste fonctionnelle
- le clic sur le payant n'entraine pas de casse
- l'interface affiche simplement que Stripe n'est pas encore actif ici

## Activation Stripe reelle
1. renseigner `STRIPE_SECRET_KEY`
2. renseigner `STRIPE_WEBHOOK_SECRET`
3. definir `APP_BASE_URL` sur le vrai domaine public
4. creer le webhook Stripe vers `/api/stripe/webhook`
5. verifier le prix via `STRIPE_PRICE_CENTS` et `STRIPE_CURRENCY`

## Test local
1. Lancer le site : `npm run dev --prefix apps/web -- --port 3003`
2. Lancer Stripe CLI :
   `stripe listen --forward-to localhost:3003/api/stripe/webhook`
3. Reporter le `whsec_...` dans `.env`
4. Faire un tirage, enregistrer un email, cliquer sur la lecture payante
5. Verifier :
   - retour Stripe vers `?checkout=success&tirageId=...`
   - statut qui passe vers `paid/generating/delivered`
   - mails transactionnels
   - message propre si Stripe n'est pas encore active

## Preparation Cloudflare
- Garder `APP_BASE_URL` sur le domaine public final
- Conserver `POST /api/stripe/webhook` hors cache
- Autoriser les headers proxifies : `CF-Connecting-IP`, `X-Forwarded-Proto`, `X-Forwarded-Host`
- Appliquer un rate limit leger sur :
  - `POST /api/tirages/free`
  - `POST /api/tirages/checkout`
- Ne pas filtrer ou transformer le body du webhook Stripe
- Prevoir SPF/DKIM/DMARC sur le domaine d'envoi des mails
- Si WAF strict, prevoir une exception precise pour le webhook Stripe

## Ce qui reste avant vraie production
- appliquer la migration SQL `002_nornsight_checkout_delivery.sql`
- configurer un vrai SMTP transactionnel
- configurer Stripe prod + webhook prod
- tester un cas de relance sur statut `failed`
