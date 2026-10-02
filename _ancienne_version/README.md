# Foshet Ibda3 — Hub (application à 3 espaces)

## Ouvrir l'application
Double-cliquez sur **index.html**. Elle s'ouvre dans votre navigateur (Chrome, Edge, Firefox) et fonctionne **entièrement hors ligne** — aucune installation, aucune connexion internet requise pour naviguer, changer de langue ou parcourir les 3 espaces.

## Ce que c'est
Un **hub central** avec 3 cartes menant à 3 espaces indépendants, chacun pensé pour un public et un usage différents :

- **Espace 1 — Ingénierie pédagogique & démarche** : pour les inspecteurs, le jury, les pédagogues. Problématique, synergie interdisciplinaire (Éducation musicale × Arts plastiques, Collège pilote Khaznadar × Collège Karatchi), équipe de conception, modèle de la ruche (rôles des élèves), méthodologie pas à pas, mesure d'impact.
- **Espace 2 — L'aventure créative** : le support à projeter en classe. 5 étapes interactives (scénario, atelier plastique, correspondances son/couleur/forme façon Kandinsky-Beethoven, mission créative, final), avec barre de progression et navigation précédent/suivant.
- **Espace 3 — Médiathèque & productions** : galerie de ressources en 3 onglets (Vidéos, Audio, Galerie d'images), chaque ressource s'ouvrant indépendamment des autres.

La navigation se fait sans rechargement de page (SPA). Le bouton **AR / عربي** en haut à droite bascule instantanément toute l'interface en arabe, avec sens d'écriture RTL complet (texte, boutons, flèches de navigation).

## Comment brancher vos vraies vidéos (Espace 3)
Chaque carte vidéo/audio contient un champ de texte : **collez-y n'importe quel lien de partage Google Drive** (peu importe le format exact du lien — `/view`, `/edit`, `?id=…`, etc.), et la vidéo se charge immédiatement dans un lecteur intégré, en lecture seule (pas de téléchargement possible pour vos utilisateurs — utile pour la confidentialité). Pour que ça fonctionne le jour de la présentation, assurez-vous que le fichier Drive est bien partagé en **« Tous les utilisateurs disposant du lien — Lecteur »**.

Pour l'audio, vous pouvez aussi coller un lien direct vers un fichier `.mp3` si vous préférez héberger le son autrement que sur Drive.

## Ajouter vos vraies images (galerie de l'Espace 3)
Le dossier `media/` contient actuellement 4 images (reprises du diaporama, à titre d'exemple pour montrer la mise en page). Pour ajouter les photos réelles des travaux d'élèves :
1. Copiez vos photos dans `media/` (ou dans un sous-dossier `media/galerie-eleves/`).
2. Dans `index.html`, repérez la section `<!-- GALERIE -->` et dupliquez un bloc `<figure>` en changeant le chemin de l'image et les légendes FR/AR.

## Ce contenu est-il définitif ?
Les textes des 3 espaces (problématique, méthodologie, étapes du scénario, table de correspondance son-couleur-forme, citations de Jad) sont construits à partir des faits réels déjà validés dans vos présentations (voir `chronologie_recit.csv` du dossier `application_interactive/`). Les liens vidéo/audio de l'Espace 3 sont, eux, des **emplacements prêts à recevoir vos ressources réelles** — la structure technique est terminée, il ne reste qu'à coller vos liens.

## Lien avec l'autre dossier `application_interactive/`
Ce hub est une **application complémentaire**, plus modulaire et plus proche d'un usage « présentation au jury + séance en classe + consultation libre » en un seul endroit. L'application `application_interactive/` (scrollytelling en 4 phases avec les vidéos déjà intégrées) reste disponible séparément et peut continuer à servir de récit chronologique complet. Dites-moi si vous préférez qu'on fusionne les deux ou qu'on garde les deux formats — les deux fonctionnent dès maintenant, indépendamment.

## Structure du dossier
```
hub_pedagogique/
├── index.html         (l'application)
├── style.css
├── app.js
├── README.md           (ce fichier)
└── media/
    ├── hero-jad-chef-orchestre.jpg
    ├── jad-maestro-diagramme.jpg
    ├── tableau-son-couleur-forme.jpg
    └── scene-finale-beethoven.jpg
```

## Noms de l'équipe (orthographe confirmée)
- Maroua Jaoua — مروى الجوة — Professeure d'éducation musicale, Collège pilote Khaznadar
- Hela Jaoua — هالة الجوة — Professeure d'arts plastiques, Collège pilote Khaznadar
- Taher Ben Souissi — طاهر بن سويسي — Professeur d'éducation musicale, Collège Karatchi
