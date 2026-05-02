# Homepage Visual System V1

Guide visuel de production pour monter la homepage dans Elementor sans improviser le design.

## 1. Direction Visuelle

Le rendu doit etre :
- premium
- sobre
- organique
- lisible
- chaleureux
- structure

Le site ne doit jamais paraitre :
- kitsch
- mystique caricatural
- trop charge
- trop corporate
- trop vide

La homepage doit donner une sensation de :
- clarte
- calme
- tenue
- maturite

---

## 2. Palette V1

### Fonds
- Fond principal : `#FAF9F7`
- Fond doux : `#F3F0EB`
- Fond contraste fort : `#1C1F2E`
- Fond contraste secondaire : `#252A3A`

### Texte
- Texte principal : `#201C1A`
- Texte secondaire : `#645C55`
- Texte clair sur fond sombre : `#F6F2EC`

### Accents
- Cuivre principal : `#B8864E`
- Cuivre soutenu : `#9D6E3E`
- Liseres / bordures douces : `rgba(90, 70, 50, 0.12)`

### Regles
- jamais de violet
- jamais de noir pur
- jamais de degrade tape-a-l'oeil
- jamais d'accent flashy

---

## 3. Typographies

### Titres
- Police : `Cinzel`
- Usage : H1, H2, titres de blocs majeurs

### Texte courant
- Police : `Lora`
- Usage : paragraphes, extraits, textes editoriaux

### UI
- Police : `system-ui`
- Usage : boutons, menu, labels, metas, micro-textes

### Reglages recommandes

#### H1
- Taille desktop : `64px`
- Taille tablette : `52px`
- Taille mobile : `38px`
- Line-height : `1.02`
- Letter-spacing : `-0.02em`

#### H2
- Taille desktop : `38px`
- Taille tablette : `32px`
- Taille mobile : `26px`
- Line-height : `1.1`

#### H3
- Taille desktop : `24px`
- Taille mobile : `20px`

#### Texte courant
- Taille desktop : `19px`
- Taille mobile : `17px`
- Line-height : `1.7`

#### UI
- Taille standard : `15px`
- Boutons : `15px`
- Labels : `12px`

---

## 4. Echelle D'Espacement

Utiliser une echelle simple :
- `8px`
- `12px`
- `16px`
- `24px`
- `32px`
- `48px`
- `72px`
- `96px`

### Regles
- Entre elements d'une carte : `10px a 16px`
- Entre blocs dans une section : `24px a 32px`
- Entre sections : `72px a 96px`

---

## 5. Largeurs Et Grille

### Largeur globale
- Max width principal : `1240px`
- Contenu editorial serre : `760px`

### Colonnes
- Desktop : 2 ou 3 colonnes max
- Tablette : 2 colonnes si lisible
- Mobile : 1 colonne

### Regles
- ne jamais empiler 4 colonnes sur desktop
- ne jamais garder 2 colonnes si le texte devient trop serre

---

## 6. Style Des Sections

### Section claire standard
- Fond : `#FAF9F7`
- Padding vertical : `88px`
- Padding horizontal : `24px`

### Section douce
- Fond : `#F3F0EB`
- Border radius possible : `28px`

### Section contraste
- Fond : `#1C1F2E`
- Texte clair
- Accents cuivre uniquement

### Regles
- ne pas alterner clair/sombre a chaque bloc sans raison
- reserver les fonds sombres aux zones fortes :
  - hero si besoin
  - bloc livre si pertinent
  - CTA final si assume

---

## 7. Style Des Boutons

### Bouton principal
- Fond : `#B8864E`
- Texte : `#FFFFFF`
- Border radius : `999px`
- Padding : `16px 28px`
- Police : `system-ui`
- Font weight : `700`
- Box shadow : douce

### Bouton secondaire
- Fond : transparent
- Border : `1px solid rgba(90,70,50,0.18)`
- Texte : `#201C1A`
- Border radius : `999px`
- Padding : `16px 24px`

### Hover
- Legere montee du contraste
- pas d'effet brutal

---

## 8. Style Des Cartes

### Carte Offre
- Fond : `#FFFFFF`
- Border : `1px solid rgba(90,70,50,0.10)`
- Border radius : `20px`
- Padding : `20px`
- Box shadow : `0 10px 26px rgba(25,20,15,0.05)`

### Hover
- translateY : `-4px`
- border color un peu plus cuivre
- pas d'effet dramatique

### Image
- Border radius : `16px`
- ratio stable

### Regles
- cartes toujours alignees a gauche
- pas de centrage de contenu

---

## 9. Style Du Hero

### Structure
- 2 colonnes
- texte a gauche
- visuel a droite

### Reglages
- Padding vertical : `72px a 88px`
- Gap : `40px`
- alignement vertical : `center`

### H1
- court
- fort
- pas plus de 4 lignes desktop

### Sous-titre
- largeur max : `620px`

### CTA
- 2 boutons max
- l'un principal, l'autre secondaire

### Micro-reassurance
- petit label UI
- uppercase discret
- cuivre

---

## 10. Style Du Ruban Confiance

### Structure
- 3 items max
- 1 ligne desktop
- 1 colonne mobile

### Style
- fond tres legerement contraste
- petite bordure
- radius doux
- texte system-ui semi-bold

### Regle
- garder ce bloc compact

---

## 11. Style Du Bloc A Propos

### Structure
- 2 colonnes
- image a gauche
- texte a droite

### Style
- plus editorial que commercial
- texte plus calme
- CTA discret

### Regle
- ne pas raconter tout ici

---

## 12. Style Du Bloc Livre

### Structure
- couverture du livre
- texte
- bouton

### Direction
- plus contrastee que les blocs standard
- sans devenir une fiche produit

### Regle
- ce bloc doit renforcer l'autorite, pas prendre toute la place

---

## 13. Style Des Temoignages

### Structure
- 3 cartes max

### Style
- cartes legeres
- citation courte
- nom ou initiales en bas

### Regle
- pas de slider en v1
- pas de pavés

---

## 14. Style Des Derniers Articles

### Structure
- titre de bloc
- intro
- 3 cartes articles

### Style
- sobre
- plus editorial que commercial

### Regle
- ce bloc doit rester secondaire

---

## 15. Responsive

### Mobile
- hero en 1 colonne
- image sous le texte
- cartes en 1 colonne
- boutons pleine largeur si necessaire
- padding vertical des sections : `56px a 64px`

### Tablette
- verifier la coupe des titres
- verifier les cartes sur 2 colonnes
- verifier les espacements du hero

### Points sensibles
- hero
- grille offres
- bloc livre
- temoignages

---

## 16. Effets Et Animation

### Autorises
- reveal discret au scroll
- hover doux sur cartes
- hover simple sur boutons

### Interdits
- animations tape-a-l'oeil
- parallax lourde
- carousels inutiles
- sur-effets d'apparition

---

## 17. Checklist Visuelle Finale

- Le hero est fort sans etre lourd
- Les titres sont nets et lisibles
- Les services et formations sont distincts visuellement
- Les cartes sont propres et coherentes
- Le bloc livre renforce l'autorite
- La home garde un rythme simple
- La conversion reste lisible
- Le mobile est propre
