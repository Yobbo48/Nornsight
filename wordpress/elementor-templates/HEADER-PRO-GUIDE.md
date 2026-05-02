# Header Elementor Pro - installation

Utilise ce fichier :

- `/Users/kevin/Documents/New project/wordpress/elementor-templates/edr-header-pro-v1.json`

## Workflow correct

Ne l'importe **pas** dans une page classique si ton but est d'avoir un vrai header global.

Le bon chemin est :

1. `Templates`
2. `Theme Builder`
3. `Header`
4. `Ajouter nouveau`
5. dans la fenetre Elementor, clique sur l'icone `dossier`
6. `Mes modeles`
7. `Importer un modele`
8. importe `edr-header-pro-v1.json`
9. `Inserer`

## Apres import

Fais tout de suite ces 5 verifications :

1. dans la colonne de gauche, clique sur le widget `Nav Menu`
2. verifie que le bon menu WordPress est selectionne
3. remplace l'URL du bouton par ton lien Calendly
4. remplace le nom / slogan si besoin
5. publie avec la condition `Tout le site`

## Si le header n'apparait pas bien

Verifie :

1. que le theme actif est bien `edr-elementor` ou `edr-elementor-child`
2. que le header a bien ete publie sur `Tout le site`
3. qu'il n'existe pas deja un autre header Elementor actif
4. que tu n'es pas simplement en train d'editer une page au lieu du Theme Builder

## Important

Le style premium du header repose sur les classes CSS deja prevues dans :

- `/Users/kevin/Documents/New project/wordpress/wp-content/themes/edr-elementor/style.css`

Donc garde ce theme actif pendant l'import et les tests.
