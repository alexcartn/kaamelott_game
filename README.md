# Kaamelott Game

Petit recueil de répliques de Kaamelott et jeux de quiz, en une seule page HTML, sans dépendance.

- Citation : une réplique au hasard, filtrable par personnage et par livre.
- Recherche : tape un ou plusieurs mots, les répliques qui les contiennent s'affichent avec les mots surlignés (accents et majuscules ignorés).
- Jouer : deux jeux, trois niveaux (Écuyer, Chevalier, Roi), manches de 10 répliques.
  - Qui a dit ça ? : retrouver le personnage.
  - Le mot juste : trouver un mot tiré des répliques en six essais (lettres vertes et dorées), trois mots par manche, indice possible contre un point.
  - Le pendu : deviner, lettre par lettre, un mot caché de la réplique (le clavier de l'ordinateur marche aussi).
- Records : meilleurs scores par jeu et par niveau, gardés sur l'appareil, et classement commun optionnel (voir plus bas).

Les 765 citations viennent de l'API https://kaamelott.chaudie.re/api (projet sin0light/api-kaamelott) et sont embarquées dans `index.html` : la page fonctionne hors ligne et sans appel réseau.

Utilisation en local : ouvrir `index.html` dans un navigateur.

## Classement commun (optionnel, Supabase)

Sans configuration, seuls les records de l'appareil sont affichés. Pour un classement partagé, sans compte pour les joueurs :

1. Crée un projet gratuit sur https://supabase.com.
2. Menu SQL Editor : colle le contenu de `supabase/schema.sql`, puis Run. Cela crée la table, les règles de sécurité (lecture et ajout publics, jamais de modification ni de suppression) et la vue des meilleurs scores.
3. Menu Project Settings, API : copie l'URL du projet (`https://xxxx.supabase.co`) et la clé publishable (`sb_publishable_...`).
4. Dans `index.html`, renseigne `SUPABASE_URL` et `SUPABASE_KEY`, puis commit et push.

À savoir :
- La clé publishable est publique par conception : ne jamais mettre la clé `secret` ou `service_role` dans la page.
- Un seul score par nom et par classement : le meilleur est gardé. Les scores sont envoyés par le navigateur, donc un classement de bureau, pas anti-triche.
- Le plan gratuit met le projet en pause après une semaine sans activité : il se réveille depuis le tableau de bord Supabase.
