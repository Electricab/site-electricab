# Prompt d'introduction pour Claude

> **Mode d'emploi (pour Charly)** : ouvre ce dossier dans Claude Code, puis copie-colle tout ce qui se trouve sous la ligne `---` comme premier message d'une nouvelle session. Claude aura ainsi tout le contexte nécessaire.

---

Tu vas m'aider à développer le site web de mon entreprise, **Charly Elec**. Le code se trouve dans le dossier courant. Commence par lire `README.md`, `package.json`, `vite.config.ts`, `src/App.tsx` et `src/index.css`, puis résume-moi en quelques lignes ce que tu as compris avant de modifier quoi que ce soit.

## Qui je suis et comment travailler avec moi

- Je suis maître électricien, pas développeur. Explique-moi simplement ce que tu fais et pourquoi, sans jargon inutile, et réponds toujours en français.
- Avant une modification importante (nouvelle page, changement de structure, nouvelle dépendance, suppression de fichier), dis-moi ce que tu comptes faire et attends mon accord. Pour une petite retouche (texte, couleur, espacement), fais-la directement.
- Après chaque modification, vérifie par toi-même que le site compile (`npm run lint` puis `npm run build`) et dis-moi le résultat. Si quelque chose échoue, ne le cache pas.
- Ne supprime aucun fichier sans me le dire. N'invente jamais d'informations me concernant (téléphone, adresse, SIRET, tarifs, certifications, avis clients, références de chantiers) : demande-les-moi, ou laisse un texte provisoire clairement signalé.

## L'entreprise et le site

- **Activité** : électricité haut de gamme, avec deux spécialités : la **domotique de luxe** (maison connectée, invisible et élégante) et l'**installation de bornes de recharge** pour véhicules électriques. Clientèle visée : propriétaires exigeants, sensibles à l'esthétique et au détail.
- **Positionnement** : « L'art de l'énergie, le sens du détail ». Univers *Retro-Chic* : artisan d'autrefois (esprit salon de barbier) rencontrant l'innovation électrique.
- **Zone et coordonnées** (à confirmer par moi) : atelier à Senlis (60300), visites sur rendez-vous.
- **Objectif du site** : site vitrine qui inspire confiance et pousse le visiteur à **demander un devis**. Pas de boutique, pas de comptes utilisateurs.
- **Langue du site** : français.

## Architecture technique

- **React 19 + TypeScript**, construit avec **Vite 6**, mis en forme avec **Tailwind CSS 4** (plugin `@tailwindcss/vite`, configuré dans `vite.config.ts`, pas de `tailwind.config.js`), routage avec **React Router 7** (`BrowserRouter`), animations avec **motion** (`import { motion } from 'motion/react'`), icônes **lucide-react**.
- Site **100 % statique**, sans serveur ni base de données. Il sera publié sur **GitHub Pages**. Tout ce que tu proposes doit donc fonctionner sans backend : si une fonctionnalité exige un serveur (envoi de formulaire, paiement, base de données), propose un service externe ou une alternative statique et demande-moi mon avis.
- Fichiers principaux :
  - `src/App.tsx` : menu (`navLinks`), routes (`<Routes>`), pied de page.
  - `src/pages/` : `Home.tsx`, `Domotique.tsx`, `Bornes.tsx`, `APropos.tsx`, `Contact.tsx`.
  - `src/index.css` : polices et couleurs de la marque dans le bloc `@theme`.
  - `public/` : fichiers servis tels quels (logo).
  - `inspiration/` : chartes graphiques de référence (`DESIGN.md`, captures). **À consulter avant tout travail de design.**
  - `images/` : visuels sources, hors site. Ne pas les importer dans le code.
- Commandes : `npm install`, `npm run dev` (http://localhost:3000), `npm run build`, `npm run preview`, `npm run lint`.

## Charte graphique (à respecter)

- Fond sombre : `#121212` (charbon), cartes `#1a1a1a`.
- Accent cuivre : `brand` = `#e2a071` (variantes `brand-light`, `brand-dark`). Texte clair : jamais du blanc pur sur les grands aplats, plutôt `#eeeeee` / crème.
- Polices (trois, pas plus) : **Michroma** (grands titres h1/h2, `font-display`), **Jura** (phrases d'accroche en `font-accroche font-light`, petits titres h3/h4 en `font-accroche font-semibold`), **Inter** (textes, boutons, étiquettes en capitales espacées, `font-sans`).
- Style : angles quasi droits, filets fins, lueurs cuivrées discrètes plutôt que des ombres, beaucoup d'espace vertical, étiquettes en capitales avec grand espacement des lettres. Évite tout ce qui ferait « startup tech » ou trop arrondi.
- Utilise les classes Tailwind existantes et les couleurs `brand` plutôt que d'inventer de nouvelles teintes. Le site doit rester **responsive** (menu hamburger sur mobile déjà présent) : vérifie toujours le rendu mobile.

## Pièges à connaître (très important)

1. **Chemin de base GitHub Pages.** Le site peut être servi sous un sous-dossier (`/nom-du-depot/`). Donc :
   - n'écris **jamais** un chemin absolu vers un fichier de `public/` (`src="/logo.png"`) : utilise `` `${import.meta.env.BASE_URL}logo.png` ``.
   - le routeur utilise déjà `basename={import.meta.env.BASE_URL}` dans `App.tsx` : ne le retire pas.
   - les liens internes passent par `<Link to="/contact">` de React Router, jamais par un `<a href="/contact">`.
2. **`404.html`.** Le script `npm run build` copie `index.html` en `404.html` (`scripts/copy-404.mjs`) pour que les adresses directes comme `/contact` fonctionnent sur GitHub Pages. Ne supprime pas cette étape.
3. **`vite.config.ts` est indispensable** : sans lui, Tailwind n'est pas appliqué et le site s'affiche sans mise en forme. Ne le supprime pas, et garde les deux plugins `react()` et `tailwindcss()`.
4. **Pas de variables secrètes.** Tout ce qui est dans le code est public sur GitHub. Ne mets jamais de clé d'API, mot de passe ou donnée personnelle dans le dépôt. Les fichiers `.env*` sont ignorés par Git.
5. **Images.** Les photos actuelles viennent d'Unsplash (chargées depuis Internet) et doivent être remplacées par mes vraies photos. Une photo ajoutée doit être compressée (largeur ≤ 2000 px, format WebP ou JPEG) pour ne pas alourdir le site.
6. **Langue.** Tous les textes visibles sont en français, avec les accents corrects. Le lien « Home » du menu est resté en anglais : à corriger quand l'occasion se présente.

## Ce qui reste à faire (état actuel : démo)

- **Formulaires** (section devis de `Home.tsx`, formulaire de `Contact.tsx`) : l'interface existe mais **rien n'est envoyé**. À brancher via un service externe compatible site statique (Formspree, Web3Forms, EmailJS…) ou un lien `mailto:`.
- **Coordonnées provisoires** dans `Contact.tsx` : téléphone `06 69 48 33 xx` incomplet, e-mail `contact@charly-elec.fr` à confirmer, horaires à valider.
- **Pied de page** (`App.tsx`) : liens « Mentions légales », « Politique de confidentialité », « CGV » qui pointent vers `#` (pages à créer, mentions légales obligatoires) ; icônes de réseaux sociaux sans lien ; « © 2024 » et « ESTD 2026 » incohérents.
- **Contenus** : photos génériques à remplacer par de vraies réalisations ; éventuellement ajouter réalisations, avis clients, zone d'intervention, FAQ, une fois que je t'aurai fourni les éléments réels.
- **Référencement** : ajouter `<meta name="description">`, icône d'onglet (favicon), balises Open Graph pour le partage, `sitemap.xml` et `robots.txt` dans `public/`, et un titre d'onglet par page.
- **Qualité** : accessibilité (textes alternatifs des images, contrastes, navigation au clavier), performances.

## Publication

Le dépôt GitHub publie automatiquement le site à chaque envoi sur la branche `main`, via `.github/workflows/deploy.yml` (GitHub Pages, source « GitHub Actions »). Quand je te demande de publier : vérifie que `npm run lint` et `npm run build` passent, montre-moi les fichiers modifiés (`git status`), propose un message de commit clair en français, et **attends mon accord avant tout `git push`**. Les détails (domaine personnalisé, `BASE_PATH`, `CNAME`) sont dans la section 7 du `README.md`.

## Pour commencer

Lis les fichiers listés en première ligne, résume-moi ce que tu as compris du projet, lance `npm install` si le dossier `node_modules` est absent, puis `npm run dev` pour me montrer le site. Ensuite, demande-moi ce que je veux faire en premier.
