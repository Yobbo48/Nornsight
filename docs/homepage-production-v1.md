# Page D'Accueil V1

Document de montage direct dans Elementor pour construire la homepage v1.

## Reglages de page
- Titre WordPress : `Accueil`
- Slug : `/`
- Mode de page : `Elementor pleine largeur`
- H1 unique : oui
- Pas d'embed Calendly sur cette page

## Ordre Exact Des Sections
1. Hero principal
2. Ruban confiance
3. Bloc accompagnements
4. Bloc formations
5. Bloc a propos condense
6. Bloc livre
7. Bloc temoignages
8. Derniers articles
9. CTA final

---

## 1. Hero Principal

### Composant
`EDR - Hero Principal`

### Structure
- Container principal en 2 colonnes
- Colonne gauche : texte
- Colonne droite : visuel ou image d'ambiance sobre

### Contenu
**Titre**
Guidance runique et soins energetiques pour avancer avec clarte

**Sous-titre**
Separation, transition professionnelle, blocages ou perte de direction : je vous accompagne a distance avec une approche directe, humaine et lisible.

**CTA principal**
Reserver une seance

**Lien CTA principal**
`/contact-reservation/`

**CTA secondaire**
Decouvrir les accompagnements

**Lien CTA secondaire**
`/services/`

**Micro-reassurance**
Accessible partout en France, sans deplacement

### Reglages simples
- Largeur max : `1240px`
- Gap colonnes : `40px`
- Padding haut/bas : `72px`
- Alignement vertical : `center`
- Mobile : passer en 1 colonne, texte avant visuel

### Point de vigilance
- Le hero doit etre fort mais court
- Le CTA principal doit etre visible sans scroll important

---

## 2. Ruban Confiance

### Composant
`EDR - Ruban Confiance`

### Structure
- 1 container horizontal
- 3 items max

### Contenu
- 21 avis 5 etoiles Google
- 8+ ans de pratique
- Accompagnement 100% a distance

### Reglages simples
- Padding : `18px 24px`
- Alignement : centre
- Gap : `24px`
- Mobile : 1 colonne ou 3 lignes courtes

### Point de vigilance
- Rester compact
- Ne pas transformer ce bloc en pavé

---

## 3. Bloc Accompagnements

### Composants
- `EDR - Intro Editoriale`
- `EDR - Grille Offres`

### Structure
1. Intro courte
2. Loop Grid des offres `service`

### Contenu intro
**Titre**
Faire le point et avancer

**Texte**
Tirages de runes et soins energetiques pour eclairer ce qui se joue et retrouver un cap plus clair.

### Loop Grid
- Source : CPT `offre`
- Filtre taxonomie : `type_offre = service`
- Nombre d'elements : `3`
- Trier : offres mises en avant d'abord si possible, sinon manuel
- Carte utilisee : `EDR - Carte Offre`

### Reglages simples
- 3 colonnes desktop
- 1 colonne mobile
- Gap : `24px`

### Point de vigilance
- Bien distinguer ce bloc du bloc formations
- Garder seulement 3 offres max

---

## 4. Bloc Formations

### Composants
- `EDR - Intro Editoriale`
- `EDR - Grille Offres`

### Structure
1. Intro courte
2. Loop Grid des offres `formation`

### Contenu intro
**Titre**
Transmettre et approfondir

**Texte**
Ateliers et formations pour decouvrir les runes, affiner votre lecture et gagner en autonomie.

### Loop Grid
- Source : CPT `offre`
- Filtre taxonomie : `type_offre = formation`
- Nombre d'elements : `2`
- Carte utilisee : `EDR - Carte Offre`

### Reglages simples
- 2 colonnes desktop
- 1 colonne mobile
- Gap : `24px`

### Point de vigilance
- Cette section doit respirer differemment du bloc accompagnements
- Ne pas en faire un bloc massif

---

## 5. Bloc A Propos Condense

### Composant
`EDR - Intro Editoriale`

### Structure
- 2 colonnes
- Colonne gauche : photo
- Colonne droite : texte + CTA

### Contenu
**Titre**
Une approche directe, bienveillante, sans jugement

**Texte**
Je n'attends pas de vous que vous croyiez en quoi que ce soit. Mon travail consiste a vous aider a regarder votre situation avec clarte, dans un cadre simple et professionnel.

**CTA**
Lire mon parcours

**Lien**
`/a-propos/`

### Reglages simples
- Ratio image vertical ou carre
- Gap : `32px`
- Mobile : texte sous l'image

### Point de vigilance
- Garder ce bloc humain mais concis
- Ne pas raconter tout le parcours ici

---

## 6. Bloc Livre

### Composant
`EDR - Bloc Livre`

### Structure
- 2 colonnes
- Colonne gauche : couverture
- Colonne droite : texte + CTA

### Contenu
**Titre**
Le Petit Guide des Runes

**Texte**
Un guide accessible pour decouvrir les 24 runes du Futhark ancien et leurs usages en tirage. Une ressource complementaire aux seances et aux formations.

**CTA**
Decouvrir le livre

**Lien**
`/le-petit-guide-des-runes/`

### Reglages simples
- Contraste visuel leger possible
- Image bien contenue
- Pas de slider ni d'effet complexe

### Point de vigilance
- Ce bloc renforce la credibilite
- Il ne doit pas prendre le dessus sur l'accompagnement

---

## 7. Bloc Temoignages

### Composant
`EDR - Bloc Temoignages`

### Structure
- Titre
- 3 cartes temoignages maximum

### Contenu
**Titre**
Des retours concrets, humains, utiles

**Temoignage 1**
J'ai pris plusieurs fois rendez-vous avec Kevin pour differentes demandes. Que ce soit en soin energetique ou pour des tirages, je n'ai jamais ete decue. Des coups de boost qui m'ont bien aidee a avancer dans ma vie.

**Temoignage 2**
Je recommande sans hesitation. Kevin est un professionnel bienveillant et tres a l'ecoute. Pour une premiere experience en soin energetique et tirages, cela a ete tres benefique pour moi.

**Temoignage 3**
Un accompagnement clair, sans discours flou. J'ai pu remettre de l'ordre dans une periode ou je me sentais completement perdue.

### Reglages simples
- 3 colonnes desktop
- 1 colonne mobile
- Meme hauteur de cartes si possible

### Point de vigilance
- Pas de carousel complexe en v1
- Pas plus de 3 temoignages

---

## 8. Derniers Articles

### Structure
- Titre de section
- Texte court
- Widget `Posts` ou `Loop Grid`

### Contenu
**Titre**
Approfondir, comprendre, mettre en perspective

**Texte**
Des articles pour eclairer ce que vous traversez et mieux comprendre l'univers des runes et des soins energetiques.

### Reglages loop
- Source : articles WordPress
- Nombre : `3`
- Trier : les plus recents

### Reglages simples
- 3 colonnes desktop
- 1 colonne mobile
- Extraits courts

### Point de vigilance
- Ce bloc vient en fin de home
- Il soutient la credibilite, pas la conversion principale

---

## 9. CTA Final

### Composant
`EDR - CTA Simple`

### Contenu
**Titre**
Vous voulez faire le point simplement ?

**Texte**
La page reservation centralise les formats de prise de rendez-vous.

**Bouton**
Acceder a la reservation

**Lien**
`/contact-reservation/`

### Reglages simples
- 1 container centre ou aligne a gauche selon la direction du site
- Padding genereux

### Point de vigilance
- Clore la home proprement
- Une seule action attendue

---

## SEO De Base

### Titre SEO
L'energie des Runes | Guidance runique et soins energetiques a distance

### Meta description
Guidance runique, soins energetiques et formations a distance pour faire le point, retrouver de la clarte et avancer avec plus de justesse.

---

## Check Final Homepage
- H1 unique
- CTA principal visible
- distinction claire `accompagnements / formations`
- pas d'embed Calendly
- 3 offres service max
- 2 formations max
- 3 temoignages max
- 3 articles max
- page fluide sur mobile
