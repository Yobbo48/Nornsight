# code_review.md

## Nornsight Review

Verifier a chaque PR :

- La logique des filieres `standard` / `reframe` / `sensible` est-elle respectee ?
- Un tirage porteur a-t-il ete refroidi inutilement ?
- Un tirage favorable a-t-il ete domine par des ajustements secondaires ?
- Un tirage tendu a-t-il ete artificiellement adouci ?
- Un ajustement simple prend-il plus de place que la dynamique principale ?
- Le gratuit reste-t-il lisible, utile et net ?
- Le payant apporte-t-il une vraie valeur supplementaire ?
- La lecture approfondie progresse-t-elle vraiment d'un bloc a l'autre ?
- Une validation trop dure rejette-t-elle des textes encore exploitables ?
- Le changement augmente-t-il le risque de fallback ?
- Le changement augmente-t-il inutilement le cout ou le nombre d'appels LLM ?
- Le changement reintroduit-il des phrases generiques, scolaires ou pilotees ?

## Signaux de regression

- Le gratuit ressemble a une mini lecture approfondie.
- Le payant reformule simplement le gratuit.
- Une question factuelle brute part dans un full premium.
- Un ajustement simple est traite comme un frein dominant.
- Les sorties exposent des informations internes.
- Le prompt devient plus lourd sans ajouter de matiere interpretative utile.
