// GitHub Pages ne sait pas servir les routes React (/contact, /bornes...) :
// il renvoie son 404.html. On y met une copie de index.html pour que
// React Router prenne le relais côté navigateur.
import {copyFileSync} from 'node:fs';

copyFileSync('dist/index.html', 'dist/404.html');
