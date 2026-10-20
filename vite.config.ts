import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import {defineConfig} from 'vite';

// BASE_PATH : préfixe d'URL du site.
// - "/" (défaut) : domaine personnalisé ou serveur local
// - "/nom-du-depot/" : GitHub Pages sans domaine personnalisé (https://utilisateur.github.io/nom-du-depot/)
export default defineConfig({
  base: process.env.BASE_PATH ?? '/',
  plugins: [react(), tailwindcss()],
  server: {port: 3000},
});
