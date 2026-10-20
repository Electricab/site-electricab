# Prise de rendez-vous : installation dans votre compte Google

Le bouton « Je souhaite prendre rendez-vous » de la page Contact s'appuie sur un petit programme
(`Code.gs`) qui tourne **dans votre compte Google** (Google Apps Script, gratuit).

- Lui seul lit votre agenda Google principal. Le site ne reçoit **que des heures libres** :
  jamais le titre, le lieu ni les participants de vos rendez-vous.
- Quand quelqu'un réserve, il vérifie que le créneau est toujours libre, crée le rendez-vous dans votre agenda
  (avec les trajets pour un rendez-vous sur place) et envoie au visiteur une confirmation
  et une invitation Google Agenda s'il a donné son e-mail. Le site vous envoie ensuite un e-mail
  « Nouveau rendez-vous » sur contact@electricab.fr, par Web3Forms comme les formulaires.

Tant que le programme n'est pas installé, le bouton n'apparaît pas sur le site en ligne
(en local, avec `npm run dev`, des créneaux fictifs permettent de tester l'affichage).

## Installation (10 minutes, une seule fois)

Connectez-vous avec le compte Google **qui possède votre agenda**.

1. Allez sur <https://script.google.com>, puis **Nouveau projet**. Renommez-le « Rendez-vous Electricab » (en haut à gauche).
2. Dans le fichier `Code.gs` qui s'affiche, effacez tout et collez le contenu du fichier `rendez-vous/Code.gs` de ce dossier.
3. Cliquez sur la roue dentée **Paramètres du projet** (à gauche), cochez
   **Afficher le fichier manifeste « appsscript.json » dans l'éditeur**.
   Revenez à l'éditeur (icône `< >`), ouvrez `appsscript.json`, effacez tout et collez le contenu de `rendez-vous/appsscript.json`.
   Enregistrez (icône disquette ou Ctrl+S).
4. **Test** : en haut, choisissez la fonction `testerCreneaux`, puis **Exécuter**.
   Google demande l'autorisation d'accéder à votre agenda et d'envoyer des e-mails :
   - **Examiner les autorisations**, choisissez votre compte ;
   - Google affiche « Google n'a pas validé cette application » : c'est normal, c'est votre propre programme.
     Cliquez sur **Paramètres avancés**, puis **Accéder à Rendez-vous Electricab (non sécurisé)**, puis **Autoriser**.

   Le journal en bas doit afficher des jours et des heures libres. Vérifiez qu'ils correspondent à votre agenda.
5. **Mise en ligne** : bouton bleu **Déployer**, puis **Nouveau déploiement**.
   - Type (roue dentée) : **Application Web** ;
   - Exécuter en tant que : **Moi** ;
   - Qui a accès : **Tout le monde** ;
   - **Déployer**, puis copiez l'**URL de l'application Web** (elle se termine par `/exec`).
6. Donnez-moi cette adresse : je la place dans `src/RendezVous.tsx` (`URL_RENDEZ_VOUS`), puis on publie le site.

## Modifier les réglages plus tard

Les réglages sont en haut de `Code.gs`, dans `CONFIG` : horaires (8 h 30 – 18 h 30), durées, pas entre les créneaux,
temps de trajet, nombre de jours proposés, adresse de notification.

Après une modification dans l'éditeur Apps Script : **Déployer**, puis **Gérer les déploiements**, crayon **Modifier**,
Version : **Nouvelle version**, puis **Déployer**. L'adresse `/exec` ne change pas, le site n'a pas besoin d'être modifié.

## Bon à savoir

- **Ce qui bloque un créneau** : les événements de votre agenda principal marqués **« Occupé »**, sauf ceux que vous avez refusés.
  C'est le réglage par défaut des événements avec un horaire. Un événement marqué « Disponible » ne bloque rien.
- **Fermer une journée** (congés, jour férié…) : ajoutez un événement « toute la journée » et réglez-le sur **« Occupé »**
  (Google les met sur « Disponible » par défaut).
- **Jours fériés** : ils ne sont pas retirés automatiquement. Ajoutez-les de la même façon.
- **Rendez-vous sur place** : l'heure proposée est l'heure d'arrivée. Le programme crée trois événements :
  « Trajet » (15 min avant), le rendez-vous (1 h, avec le visiteur invité) et « Trajet retour » (15 min après).
  Le créneau complet de 1 h 30 tient dans la plage 8 h 30 – 18 h 30 : premier rendez-vous à 9 h 00, dernier à 17 h 00.
- **Expéditeur** : les e-mails et l'invitation partent de l'adresse de votre compte Google, avec le nom « Electricab » ;
  la réponse du visiteur arrive sur contact@electricab.fr.
- **Limites Google** : un compte Gmail gratuit peut envoyer environ 100 e-mails par jour depuis un programme,
  largement assez pour des rendez-vous.
- **Protection** : champ piège contre les robots, vérification de toutes les données, une réservation par numéro
  toutes les 2 minutes, et un verrou pour que deux personnes ne prennent pas le même créneau en même temps.
