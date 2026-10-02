# فُسحة إبداع / Foshet Ibda3 — site du projet (v2, piloté par Decap CMS)

## Ouvrir le site
- **Double-clic sur `index.html`** : fonctionne directement (contenu embarqué dans `content/fallback.js`).
- **Ou `lancer_site.bat`** : lance un petit serveur local (Python) et ouvre http://localhost:8080/ — le site lit alors les fichiers `content/*.json` à jour.

Internet est nécessaire pour les vidéos Google Drive / YouTube et les polices (le site reste lisible sans).

## Publier sur Netlify Drop (site sans fichiers lourds)
1. Double-clic sur **`preparer_netlify.bat`** : déplace vidéos, audios, PowerPoint et images originales vers le dossier voisin `..\medias_hors_site\` (rien n'est supprimé) puis vérifie qu'il ne reste aucun fichier lourd. Le site ne garde que `media/web` (images optimisées) et `media/docs` (PDF légers).
2. Glissez le dossier `hub_pedagogique` sur https://app.netlify.com/drop

## Brancher les vidéos Google Drive (une seule fois)
Tous les lecteurs vidéo/audio du site sont des cadres Drive `https://drive.google.com/file/d/FILE_ID/preview`. Tant qu'un `FILE_ID` n'est pas renseigné, le site affiche « Drive — في الانتظار » avec le nom du fichier à envoyer.
1. Envoyez sur Google Drive les fichiers listés dans **`liens_drive.csv`** (ils sont dans `..\medias_hors_site\`), partage « Tous les utilisateurs disposant du lien — Lecteur ».
2. Collez chaque lien de partage dans la colonne `lien_drive` du CSV (Excel ou Bloc-notes, séparateur « ; »).
3. Lancez `python inserer_liens_drive.py` : tous les emplacements correspondants passent en `/preview` (une vidéo utilisée sur plusieurs pages est mise à jour partout), et la version double-clic est régénérée.
On peut aussi coller un lien un par un depuis l'admin (Decap CMS).

## Structure
```
index.html            coquille de la page (barre du haut + bouton « لوحة القيادة » permanent)
style.css             design (bordeaux/or, RTL/LTR, mobile)
app.js                navigation, rendu des pages, lecteurs Drive/YouTube/locaux, quiz, stepper
content/              ← TOUT le contenu modifiable (1 fichier par page)
  settings.json       tableau de bord : titre, équipe (3 enseignants), partenariat, 3 cartes, vidéo d'accueil
  pedagogie.json      carte 1 : cadre pédagogique, parcours de transformation, indicateurs, chansons
  plastique.json      carte 2 : arts plastiques (projet 1 « تنمو عناصري », projet 2 Kusama)
  musique.json        carte 2 : éducation musicale (spectacle « فسحة إبداع » en 8 étapes + leçon en 4 étapes)
  aventure.json       carte 2 : la grande aventure (jeu interactif, documentation en classe, storyboard)
  mediatheque.json    carte 3 : vidéos, audio, images, documents (classés par catégorie)
  fallback.js         copie embarquée (générée) pour le double-clic
admin/                Decap CMS : index.html + config.yml
media/web/            images optimisées pour le web
media/docs/           PDF légers (paroles, leçon « تنمو عناصري »)
liens_drive.csv + inserer_liens_drive.py   branchement des vidéos Drive
preparer_netlify.bat  sort les fichiers lourds du site avant publication
mettre_a_jour_hors_ligne.py   régénère content/fallback.js après des modifications
lancer_site.bat / lancer_cms.bat
_ancienne_version/    sauvegarde de l'ancien index.html / style.css / app.js
```

## Accès à /admin (mot de passe)
- `/admin` demande un mot de passe avant de charger Decap CMS. Mot de passe par défaut : **CPKT2026** (stocké seulement sous forme d'empreinte SHA-256 dans `admin/index.html`).
- Changer le mot de passe : `python changer_mot_de_passe_admin.py`, puis republier le dossier sur Netlify.
- La session reste ouverte jusqu'à la fermeture de l'onglet.
- Sur le site public, aucun lien ni texte d'édition n'apparaît (le lien « لوحة التحكم » et les cases « coller un lien » ne s'affichent qu'en local).
- Limite : c'est une porte côté navigateur, suffisante pour écarter les visiteurs, pas une sécurité forte. Une protection serveur nécessite l'option « Password protection » payante de Netlify.

## Modifier le contenu depuis le navigateur (Decap CMS)
**En local (le plus simple)** — nécessite Python et Node.js (https://nodejs.org) :
1. Double-clic sur **`lancer_cms.bat`**.
2. L'admin s'ouvre sur http://localhost:8080/admin/ → bouton **« Se connecter »** (aucun mot de passe en local).
3. Modifiez textes, liens vidéo, images → **Publier → Publier maintenant**. Les fichiers `content/*.json` sont mis à jour immédiatement.
4. Pour que le **double-clic sur index.html** montre aussi les changements : `python mettre_a_jour_hors_ligne.py` (le .bat le fait à la fermeture).

## Publication automatique (admin en ligne → GitHub → Netlify)
Dépôt : https://github.com/marouajaoua22-ship-it/foshet-ibda3 — `admin/config.yml` pointe déjà dessus (`backend: github`).
À faire une seule fois :
1. **Relier Netlify au dépôt** : Netlify → votre site → *Site configuration → Build & deploy → Link repository* → GitHub → `foshet-ibda3`, branche `main`, commande de build vide, dossier publié `.` (déjà défini dans `netlify.toml`). Ensuite, chaque commit republie le site (≈ 30 s) : plus besoin de glisser-déposer.
2. **Créer l'application OAuth GitHub** : GitHub → *Settings → Developer settings → OAuth Apps → New OAuth App* ; Homepage URL = l'adresse Netlify du site ; **Authorization callback URL = `https://api.netlify.com/auth/done`**. Copier le *Client ID* et générer un *Client secret*.
3. **Les déclarer dans Netlify** : *Site configuration → Access & security → OAuth → Install provider → GitHub* → coller Client ID et secret.
4. Ouvrir `https://<votre-site>.netlify.app/admin/` → mot de passe de l'équipe → **Login with GitHub** → modifier → **Publier** : commit immédiat dans le dépôt, puis mise en ligne automatique.
Chaque enseignant qui édite doit avoir un compte GitHub ajouté comme *collaborateur* du dépôt (*Settings → Collaborators*).
Envoi manuel depuis le PC (si besoin) : `publier_sur_github.bat` (nécessite Git).

## Liens vidéo acceptés (n'importe quel champ « vidéo »)
- **Google Drive** : collez le lien de partage tel quel (`/view`, `/edit`, `open?id=`…) → converti automatiquement en lecteur intégré **`/preview`**. Le fichier doit être partagé en « Tous les utilisateurs disposant du lien — Lecteur ».
- **YouTube** : `youtube.com/watch?v=…`, `youtu.be/…`, `shorts/…` → lecteur intégré.
- **Pas de fichier vidéo/audio local** dans le site : Netlify refuse les fichiers lourds.
- Champ vide → emplacement « في انتظار الرابط » avec une case pour coller un lien en aperçu temporaire (non enregistré).

## À vérifier
- Correspondances vidéo du projet 1 (arts plastiques) déduites des noms de fichiers : « أفاتار الوردة » = `Flower Teacher Welcome.mp4`, « التقرير الشامل » = `درس شاهد.mp4`, chanson = `نباتي ينمو ويرتفع.mp3`. La vidéo « الرحلة الافتراضية 3D » reste à ajouter.
- Images `media/web/paroles.jpg` et `media/web/partition.jpg` (leçon de musique) absentes → emplacements prêts.
- Légendes du storyboard « حكاية جاد بالصور » vides : à compléter dans l'admin (Aventure).
