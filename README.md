# Site web Charly Elec

Site vitrine de **Charly Elec**, maître électricien : domotique de luxe et bornes de recharge pour véhicules électriques. Direction artistique « Retro-Chic » : fond charbon, accents cuivre, polices Michroma (grands titres), Jura (accroches et petits titres) et Inter (textes).

Ce dossier contient tout le nécessaire pour continuer à développer le site avec Claude, puis le publier sur GitHub Pages.

> **Pour démarrer avec Claude** : ouvre ce dossier dans Claude Code et copie-colle le contenu de [`PROMPT-INTRO.md`](PROMPT-INTRO.md) comme premier message. Claude connaîtra alors le projet, ses règles et ses limites.

---

## 1. Ce que contient le site

| Page | Adresse | Fichier |
|---|---|---|
| L'entreprise (accueil) | `/` | `src/pages/Home.tsx` |
| Contact | `/contact` | `src/pages/Contact.tsx` (prise de rendez-vous : `src/RendezVous.tsx` et `rendez-vous/LISEZ-MOI.md`) |

Le menu, le pied de page et le routage sont dans `src/App.tsx`. Les couleurs et polices du site sont dans `src/index.css` (bloc `@theme`).

## 2. Technologies

- **React 19** + **TypeScript**
- **Vite 6** : outil de développement et de construction du site
- **Tailwind CSS 4** : mise en forme (classes directement dans le code des pages)
- **React Router 7** : navigation entre les pages
- **motion** : animations d'apparition
- **lucide-react** : icônes

C'est un site **100 % statique** : après construction, il ne reste que des fichiers HTML/CSS/JS, sans serveur ni base de données. C'est ce qui permet de l'héberger gratuitement sur GitHub Pages.

## 3. Installation sur ton ordinateur

À faire une seule fois :

1. Installer **Node.js 22** (version LTS) : <https://nodejs.org>
2. Installer **Git** : <https://git-scm.com>
3. Installer **Claude Code** : voir <https://claude.com/claude-code>

Puis, dans un terminal, depuis ce dossier :

```bash
npm install
```

## 4. Commandes utiles

| Commande | Effet |
|---|---|
| `npm run dev` | Lance le site en local sur <http://localhost:3000>. Les modifications s'affichent en direct. |
| `npm run build` | Construit le site final dans le dossier `dist/`. |
| `npm run preview` | Affiche le contenu de `dist/` en local, pour vérifier avant de publier. |
| `npm run lint` | Vérifie qu'il n'y a pas d'erreur TypeScript. |

**Avant chaque publication**, lance `npm run lint` puis `npm run build` : si les deux passent sans erreur, le site peut être publié.

### Tester le site en local avant de le publier

Toujours tester sur ton ordinateur avant de mettre en ligne. Deux niveaux de test :

**A. Pendant que tu modifies : `npm run dev`**
1. Dans le terminal, depuis ce dossier : `npm run dev`
2. Ouvrir <http://localhost:3000> dans le navigateur.
3. Modifier un fichier : la page se met à jour toute seule. Arrêter avec `Ctrl + C`.

**B. Avant de publier : tester la version finale**
1. `npm run lint` : doit se terminer sans erreur.
2. `npm run build` : construit le site dans `dist/`. Doit se terminer par « built in … ».
3. `npm run preview` : sert `dist/` sur <http://localhost:4173>. C'est exactement ce que verront les visiteurs.

**Tester comme sur GitHub Pages (sous-dossier)**, si tu n'as pas de nom de domaine :

- PowerShell (Windows) :
  ```powershell
  $env:BASE_PATH="/charly-elec/"; npm run build; npm run preview
  ```
  puis ouvrir <http://localhost:4173/charly-elec/>
- Mac / Linux : `BASE_PATH=/charly-elec/ npm run build && npm run preview`

(Remplacer `charly-elec` par le nom réel du dépôt GitHub. Fermer puis rouvrir le terminal ensuite, ou relancer sans la variable, pour revenir au mode normal.)

**Checklist avant publication**
- Les 5 pages s'ouvrent depuis le menu, et le logo s'affiche sur « À propos ».
- Le bouton « Demander un Devis » descend bien vers le formulaire de l'accueil.
- Recharger la page (`F5`) sur `/contact` : elle doit rester affichée (pas d'erreur).
- Le rendu est correct sur mobile : dans le navigateur, `F12` puis l'icône « appareil mobile ».
- Pour tester sur ton téléphone (même Wi-Fi) : `npm run dev -- --host`, puis ouvrir l'adresse « Network » affichée dans le terminal.

## 5. Structure du dossier

```
.
├── PROMPT-INTRO.md          Message à donner à Claude au début d'une session
├── README.md                Ce fichier
├── index.html               Page HTML d'entrée (titre de l'onglet, langue)
├── vite.config.ts           Configuration de construction (Tailwind, React, chemin de base)
├── package.json             Dépendances et commandes
├── tsconfig.json            Configuration TypeScript
├── scripts/copy-404.mjs     Copie index.html en 404.html après le build (voir §7)
├── .github/workflows/
│   └── deploy.yml           Publication automatique sur GitHub Pages
├── public/
│   └── …                    Fichiers servis tels quels (logo, icônes, photos dans services/, portrait)
├── src/
│   ├── main.tsx             Point d'entrée React
│   ├── App.tsx              Menu, routes, pied de page
│   ├── index.css            Couleurs, polices, styles globaux
│   └── pages/               Une page par fichier
├── inspiration/             Chartes graphiques de référence (DESIGN.md + captures)
└── images/                  Logos et visuels sources (non utilisés par le site)
```

Le dossier `images/` contient les fichiers d'origine de la charte graphique (logos, archives `.zip` générées avec Google Stitch). Il ne fait pas partie du site publié. Les archives `.zip` reprennent le contenu de `inspiration/` ; tu peux les supprimer si tu veux alléger le dossier.

## 6. Modifier le site

La façon la plus simple : décrire à Claude ce que tu veux, par exemple *« Change le numéro de téléphone sur la page contact »* ou *« Ajoute une section avec les marques partenaires sur la page Domotique »*.

À savoir :
- **Textes** : directement dans les fichiers de `src/pages/`.
- **Couleurs et polices** : dans `src/index.css`, bloc `@theme` (`--color-brand` est le cuivre principal).
- **Images** : actuellement des photos libres **Unsplash** chargées depuis Internet. Pour utiliser tes propres photos, place-les dans `public/` et référence-les ainsi dans le code : `` `${import.meta.env.BASE_URL}ma-photo.jpg` `` (et **pas** `/ma-photo.jpg`, qui casserait sous GitHub Pages).
- **Nouvelle page** : créer le fichier dans `src/pages/`, puis l'ajouter dans `navLinks` et dans `<Routes>` de `src/App.tsx`.

## 7. Publier sur GitHub Pages

### Mise en place (une seule fois)

1. Créer un compte sur <https://github.com> puis un **nouveau dépôt** (par exemple `charly-elec`), vide.
2. Dans ce dossier, envoyer le code :
   ```bash
   git init
   git add .
   git commit -m "Version initiale du site"
   git branch -M main
   git remote add origin https://github.com/TON-COMPTE/charly-elec.git
   git push -u origin main
   ```
3. Sur GitHub : **Settings → Pages → Build and deployment → Source : « GitHub Actions »**.

Dès le premier envoi, GitHub construit et publie le site automatiquement (onglet **Actions** pour suivre l'avancement). L'adresse sera de la forme `https://TON-COMPTE.github.io/charly-elec/`.

### Ensuite, à chaque modification

```bash
git add .
git commit -m "Description de la modification"
git push
```

Le site est mis à jour en 1 à 2 minutes. Claude peut faire ces commandes pour toi si tu le lui demandes.

### Adresse avec ou sans nom de dépôt : le chemin de base

Sans nom de domaine personnalisé, GitHub Pages sert le site dans un sous-dossier (`/charly-elec/`). Le projet est déjà prévu pour ça : `vite.config.ts` lit la variable `BASE_PATH`, et le workflow `deploy.yml` la règle sur `/<nom-du-dépôt>/`.

Si tu utilises **un nom de domaine à toi** (par exemple `www.charly-elec.fr`) :
1. Dans `.github/workflows/deploy.yml`, remplacer `BASE_PATH: /${{ github.event.repository.name }}/` par `BASE_PATH: /`.
2. Créer un fichier `public/CNAME` contenant uniquement le nom de domaine (`www.charly-elec.fr`).
3. Chez ton fournisseur de domaine, créer un enregistrement DNS `CNAME` de `www` vers `TON-COMPTE.github.io`, puis activer **Enforce HTTPS** dans Settings → Pages.

Documentation officielle : <https://docs.github.com/pages>

### Autre hébergeur (OVH, O2Switch, Netlify…)

Le site étant statique, n'importe quel hébergeur convient : lancer `npm run build` (avec `BASE_PATH` à `/` si le site est à la racine du domaine) et déposer **le contenu du dossier `dist/`** à la racine de l'hébergement. Sur un hébergement Apache, ajouter un fichier `.htaccess` à côté de `index.html` pour que les adresses comme `/contact` fonctionnent :

```apache
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^ /index.html [L]
```

### Pourquoi `404.html` ?

Le site est une application à page unique : `/contact` n'existe pas comme fichier. Si quelqu'un ouvre directement `…/contact` ou recharge la page, GitHub Pages ne trouve rien et affiche son `404.html`. Le script `scripts/copy-404.mjs` y place une copie de `index.html`, ce qui permet à React de reprendre la main et d'afficher la bonne page. Ne pas retirer cette étape du `npm run build`.

## 8. Points à finaliser avant la mise en ligne définitive

Le site est une **démo** : plusieurs éléments sont encore provisoires.

| Sujet | Où | Détail |
|---|---|---|
| Formulaires | `src/envoiFormulaire.tsx` | Branchés sur **Web3Forms** (formulaire « Contact Electricab ») : chaque demande arrive par e-mail sur contact@electricab.fr. À tester une fois le site en ligne. |
| Mentions légales, confidentialité, CGV | pied de page, `src/App.tsx` | Les liens pointent vers `#` : les pages n'existent pas. Les mentions légales sont obligatoires pour un site professionnel (SIRET, hébergeur, etc.). |
| Réseaux sociaux | pied de page, `src/App.tsx` | Trois icônes décoratives sans lien. |
| Copyright | pied de page, `src/App.tsx` | « © 2024 » et « ESTD 2026 » se contredisent : à harmoniser. |
| Photos | `public/services/`, `public/portrait-charles-antoine.jpg` | Vraies photos en place (services et portrait). Ajouter des photos de réalisations quand elles seront disponibles. |
| Référencement | `index.html` | Pas de description (`<meta name="description">`), pas d'icône d'onglet, pas de `sitemap.xml`. |

Tu peux demander à Claude de traiter ces points un par un.

## 9. Historique : de la démo à ce dossier

- Le site a été conçu avec Google AI Studio et Google Stitch (charte graphique dans `inspiration/`), puis repris avec Claude Code.
- Une démo a été hébergée temporairement sur un serveur de Jérôme. Ce dossier a été comparé à la version en ligne : les sources étaient identiques. La démo a ensuite été retirée.
- Nettoyages faits au moment de la remise : ajout du `vite.config.ts` (qui manquait), suppression des dépendances inutilisées (Gemini, Express…), ajout du déploiement GitHub Pages, passage de la page en `lang="fr"`.
- L'hébergement sur le serveur de Jérôme n'est **plus à utiliser** pour la suite : tout passe désormais par GitHub.
