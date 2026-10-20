import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
// Polices hébergées avec le site (pas d'appel à Google Fonts : rien n'est transmis à Google, conforme RGPD)
import '@fontsource/inter/300.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/michroma/400.css';
import '@fontsource/jura/300.css';
import '@fontsource/jura/600.css';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
