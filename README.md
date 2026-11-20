# Kaamelott Game

Petit recueil de répliques de Kaamelott et jeux de quiz, en une seule page HTML, sans dépendance.

- Citation : une réplique au hasard, filtrable par personnage et par livre.
- Recherche : tape un ou plusieurs mots, les répliques qui les contiennent s'affichent avec les mots surlignés (accents et majuscules ignorés).
- Jouer : trois jeux en mort subite, trois niveaux (Écuyer, Chevalier, Roi). On enchaîne jusqu'à la première erreur et on peut s'arrêter quand on veut : le score est la plus longue série.
  - Qui a dit ça ? : retrouver le personnage. Une erreur et c'est fini.
  - Le pendu : deviner un mot caché de la réplique avant que la potence soit achevée. Mot trouvé, mot suivant ; la série s'arrête à la première pendaison.
  - Le mot juste : trouver un mot tiré des répliques en six essais (lettres vertes et dorées). Les mots inventés sont refusés, et deux indices progressifs sont possibles (qui parle, puis la réplique). La série s'arrête au premier échec.
- Classement : le palmarès commun par jeu et par niveau (podium des trois premiers, ta place en évidence), optionnel (voir plus bas), puis tes meilleures séries gardées sur l'appareil.

Les 765 citations viennent de l'API https://kaamelott.chaudie.re/api (projet sin0light/api-kaamelott) et sont embarquées dans `index.html` : la page fonctionne hors ligne et sans appel réseau.

Utilisation en local : ouvrir `index.html` dans un navigateur. Publiée sur GitHub Pages, la page peut s'installer sur l'écran d'accueil (manifeste `manifest.webmanifest`) et fonctionne hors ligne après une première visite (`sw.js`). Les icônes sont dans `icon.svg` et les `icon-*.png`, l'aperçu de partage dans `og-image.jpg`.

## Classement commun (optionnel, Supabase)

Sans configuration, seuls les records de l'appareil sont affichés. Pour un classement partagé, sans compte pour les joueurs :

1. Crée un projet gratuit sur https://supabase.com.
2. Menu SQL Editor : colle le contenu de `supabase/schema.sql`, puis Run. Si ta base date de l'ancienne version (scores sur 10 ou 18), colle plutôt `supabase/migration-serie.sql`. Cela crée la table, les règles de sécurité (lecture et ajout publics, jamais de modification ni de suppression) et la vue des meilleures séries.
3. Menu Project Settings, API : copie l'URL du projet (`https://xxxx.supabase.co`) et la clé publishable (`sb_publishable_...`).
4. Dans `index.html`, renseigne `SUPABASE_URL` et `SUPABASE_KEY`, puis commit et push.

À savoir :
- La clé publishable est publique par conception : ne jamais mettre la clé `secret` ou `service_role` dans la page.
- Un seul score par nom et par classement : le meilleur est gardé. Les scores sont envoyés par le navigateur, donc un classement de bureau, pas anti-triche.
- Le plan gratuit met le projet en pause après une semaine sans activité : il se réveille depuis le tableau de bord Supabase.

## Liste de mots du Mot juste

Pour refuser les mots inventés et ne garder comme réponses que des mots naturels, la page embarque une liste compressée (environ 95 Ko, dans la balise `<script id="mots">`) : les mots de 5 à 9 lettres les plus fréquents du français parlé, classés en courants et moins courants, plus tous les mots de 5 lettres du dictionnaire. Les mots prononcés dans la série sont toujours acceptés, même argotiques. Le niveau Roi pioche dans les mots de la série absents du français courant (graal, burgonde, sloubi…) et dans les noms de personnages. Pour régénérer la liste : `node tools/build-mots.js <dossier node_modules> <fichier fr_50k.txt>` (voir l'en-tête du script).

Sources : [an-array-of-french-words](https://www.npmjs.com/package/an-array-of-french-words) (MIT) pour le dictionnaire, et [FrequencyWords](https://github.com/hermitdave/FrequencyWords) (code MIT, contenu CC BY-SA 4.0) pour les fréquences, tirées des sous-titres français d'OpenSubtitles.

## Mise à jour du cache hors ligne

Après une modification des icônes, du manifeste ou de `og-image.jpg`, change le numéro de `CACHE` en tête de `sw.js` (`kaamelott-v2`, puis `v3`…) : sinon les anciens fichiers restent en cache sur les appareils qui ont déjà visité la page.
