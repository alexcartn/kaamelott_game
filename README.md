# Kaamelott Game

Petit recueil de répliques de Kaamelott et jeux de quiz, en une seule page HTML, sans dépendance.

- Citation : une réplique au hasard, filtrable par personnage et par livre.
- Jouer : deux jeux, trois niveaux (Écuyer, Chevalier, Roi), manches de 10 questions, records gardés sur l'appareil.
  - Qui a dit ça ? : retrouver le personnage.
  - Complète la réplique : retrouver la fin de la phrase parmi quatre.
- Défi du jour : 5 questions identiques pour tout le monde chaque jour (3 noms, 2 fins à compléter), résultat copiable sans spoiler.
- Scores : classement commun, sans compte, avec seulement un nom à saisir (optionnel, voir plus bas).

Les 765 citations viennent de l'API https://kaamelott.chaudie.re/api (projet sin0light/api-kaamelott) et sont embarquées dans `index.html` : la page fonctionne hors ligne et sans appel réseau.

Utilisation en local : ouvrir `index.html` dans un navigateur.

## Classement commun (optionnel)

Sans configuration, l'onglet Scores affiche seulement les records de l'appareil. Pour un classement partagé, il faut un petit serveur de scores. Le script `apps-script/Code.gs` utilise Google Apps Script et un Google Sheet, gratuitement, sans compte pour les joueurs :

1. Crée un Google Sheet vide.
2. Menu Extensions, puis Apps Script. Remplace le contenu par celui de `apps-script/Code.gs`.
3. Déployer, puis Nouveau déploiement, type Application web. Exécuter en tant que : moi. Qui a accès : tout le monde. Autorise l'accès quand Google le demande.
4. Copie l'URL de l'application web (elle finit par `/exec`).
5. Dans `index.html`, colle-la dans `const SCORES_URL = "";`, puis commit et push. La page GitHub Pages se met à jour.

À savoir :
- Les scores sont envoyés par le navigateur : rien n'empêche de tricher, c'est un classement de bureau.
- Un seul score par nom et par classement : le meilleur est gardé.
- Les données sont dans l'onglet `scores` du Google Sheet, modifiables à la main.
- Après une modification du script, redéployer une nouvelle version pour la prendre en compte.
