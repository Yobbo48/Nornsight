# Deploiement Hostinger Business

## Prerequis

- Plan `Business Web Hosting` avec support `Node.js Web App`
- Base MySQL creee dans Hostinger
- Variables d'environnement renseignees dans hPanel

## Variables d'environnement

- `OPENAI_API_KEY`
- `OPENAI_MODEL=gpt-5.4-mini`
- `OPENAI_FREE_MODEL=gpt-4.1-mini`
- `OPENAI_FULL_MODEL=gpt-5.4-mini`
- `APP_BASE_URL=https://ton-domaine`
- `ADMIN_EMAILS=kevin.legros@yahoo.fr`
- `MYSQL_HOST`
- `MYSQL_PORT=3306`
- `MYSQL_USER`
- `MYSQL_PASSWORD`
- `MYSQL_DATABASE`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `STRIPE_PRICE_CENTS=590`
- `STRIPE_CURRENCY=eur`
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASSWORD`
- `SMTP_SECURE=false`
- `MAIL_FROM_EMAIL`
- `MAIL_FROM_NAME=Nornsight`
- `MAIL_REPLY_TO`
- `API_PUBLIC_HOSTNAME`
- `CLOUDFLARE_ZONE`
- `TRUST_PROXY_HEADERS=true`
- `PORT=3000`

## Build et demarrage

- Build command : `npm run build`
- Start command : `npm run start`
- Node version : `20.x`

## Base de donnees

1. Cree la base MySQL dans Hostinger.
2. Ouvre phpMyAdmin.
3. Execute le script `server/sql/001_nornsight_mvp.sql`.

## Upload du projet

1. Dans hPanel, ouvre `Websites`.
2. Choisis `Add Website`.
3. Selectionne `Node.js Apps`.
4. Choisis `Upload your website files`.
5. Envoie l'archive zip du projet source.
6. Verifie les settings detectes :
   - Build command : `npm run build`
   - Start command : `npm run start`
   - App type : `Other` si besoin
   - Entry file : laisse vide si Hostinger utilise `npm run start`
7. Ajoute les variables d'environnement.
8. Lance le deploiement.

## Verifications apres deploiement

- `GET /api/health` doit repondre `ok: true`
- le hero de la homepage doit charger
- un tirage gratuit doit fonctionner
- le tunnel checkout doit repondre sans erreur
- le webhook Stripe doit etre joignable sur `/api/stripe/webhook`
- le mode admin local `?preview_paid=1` ne doit pas etre utilise en production publique

## Si tu passes derriere Cloudflare

- active le proxy Cloudflare sur le domaine public
- ne mets jamais `/api/stripe/webhook` en cache
- garde le body du webhook intact
- applique un rate limiting leger sur :
  - `/api/tirages/free`
  - `/api/tirages/checkout`
- configure SPF / DKIM / DMARC sur le domaine d'envoi des mails

## Ce qui reste avant ouverture publique

- brancher MySQL reel via `mysql2`
- brancher l'envoi email reel
- brancher Stripe Checkout
- proteger la preprod si tu veux la garder non publique
