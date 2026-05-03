# Nornsight + Cloudflare

## Objectif
Mettre Nornsight derriere Cloudflare sans casser :
- le tunnel gratuit -> payant -> livraison
- le webhook Stripe
- l'envoi mail transactionnel

## Variables cote projet
- `APP_BASE_URL=https://nornsight.example.com`
- `API_PUBLIC_HOSTNAME=nornsight.example.com`
- `CLOUDFLARE_ZONE=example.com`
- `TRUST_PROXY_HEADERS=true`

## DNS minimal
### Domaine principal
- `A` ou `CNAME` vers l'hebergement qui sert l'app Node
- proxy Cloudflare active

### Sous-domaine API
Optionnel.
Si tu gardes site et API sur le meme host, inutile d'ajouter un sous-domaine.
Si tu separes plus tard :
- `api.example.com` en proxifie
- mettre `APP_BASE_URL` sur le domaine public qui sert l'interface

## Ce qui est deja prepare dans le code
- prise en charge de `CF-Connecting-IP`
- prise en charge de `X-Forwarded-For`
- prise en charge de `X-Forwarded-Proto`
- prise en charge de `X-Forwarded-Host`
- `Cache-Control: no-store` sur les routes API
- webhook Stripe en `no-store`
- rate limiting leger sur :
  - `/api/tirages/free`
  - `/api/tirages/checkout`
  - `/api/rune-reading`
- HSTS active quand la requete arrive en `https` via proxy

## Regles Cloudflare a appliquer
### Cache
- ne jamais mettre `/api/*` en cache
- ne jamais mettre `/api/stripe/webhook` en cache
- ne jamais transformer ou minifier le body des webhooks

### WAF / securite
- autoriser le webhook Stripe a atteindre `/api/stripe/webhook`
- garder un WAF simple, sans challenge sur les webhooks
- ne pas bloquer les POST serveur a serveur sur les routes de tunnel

### Rate limiting
Le code applique deja une limitation legere.
Tu peux ajouter une regle Cloudflare simple en plus sur :
- `/api/tirages/free`
- `/api/tirages/checkout`

## Stripe derriere Cloudflare
- declarer le webhook Stripe vers `https://nornsight.example.com/api/stripe/webhook`
- utiliser le `whsec_...` correspondant dans `STRIPE_WEBHOOK_SECRET`
- verifier que la route n'est pas mise en cache ni protegee par un challenge

## Mail / domaine
Pour les mails transactionnels :
- SPF sur le domaine d'envoi
- DKIM sur le domaine d'envoi
- DMARC minimal en monitoring au depart

Si le domaine web et le domaine d'envoi sont identiques, garder une coherence simple :
- site : `nornsight.example.com`
- mail from : `contact@example.com` ou `contact@nornsight.example.com`

## Tests prioritaires
1. homepage chargee via domaine proxifie Cloudflare
2. tirage gratuit
3. sauvegarde d'email
4. checkout Stripe
5. retour `success` / `cancel`
6. webhook Stripe
7. mail de paiement recu
8. mail de lecture livree
