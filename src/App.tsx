import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Lightbulb, Share2, Zap, Menu, Phone, X } from 'lucide-react';
import Home from './pages/Home';
import Contact from './pages/Contact';
import MentionsLegales from './pages/MentionsLegales';
import Confidentialite from './pages/Confidentialite';
import { ChoixLangue, cheminLangue, LienLangue, useLangue } from './langue';

// Onglets du menu.
const navLinks = [
  { to: '/', label: { fr: 'L’entreprise', en: 'The company' } },
  { to: '/contact', label: { fr: 'Contact', en: 'Contact' } },
];

// En français, «   » est une espace insécable : elle empêche « : » de passer seul à la ligne.
const TEXTES_ENTETE = {
  fr: { urgence: 'Une urgence, appelez-moi :', numero: '06 16 26 70 91', devis: 'Demander un devis' },
  en: { urgence: 'Emergency? Call me:', numero: '+33 6 16 26 70 91', devis: 'Request a quote' },
};

const TEXTES_PIED = {
  fr: { mentions: 'Mentions légales', confidentialite: 'Politique de confidentialité', signature: '© 2026 Electricab – L’art de l’énergie, le sens du détail.' },
  en: { mentions: 'Legal notice', confidentialite: 'Privacy policy', signature: '© 2026 Electricab – The art of energy, an eye for detail.' },
};

// Pied de page, dans la langue de la page affichée
function PiedDePage() {
  const T = TEXTES_PIED[useLangue()];
  return (
    <footer className="border-t border-slate-200 py-24 bg-bg-main">
      <div className="max-w-6xl mx-auto px-4 flex flex-col items-center">

         <LienLangue to="/" className="mb-16 opacity-90 hover:opacity-100 transition-opacity">
           <img src={`${import.meta.env.BASE_URL}logo-electricab-transparent.png`} alt="ELECTRICAB" className="h-6 md:h-8 w-auto" />
         </LienLangue>

         <div className="flex flex-wrap justify-center gap-10 mb-16 text-xs font-bold uppercase tracking-widest text-slate-600 hover:*:text-ink *:transition-colors">
           <LienLangue to="/mentions-legales">{T.mentions}</LienLangue>
           <LienLangue to="/politique-de-confidentialite">{T.confidentialite}</LienLangue>
         </div>

         <div className="flex items-center gap-8 mb-16 opacity-60">
           {/* Icônes décoratives, sans lien */}
           <Share2 size={20} aria-hidden="true" />
           <Zap size={20} aria-hidden="true" />
           <Lightbulb size={20} aria-hidden="true" />
         </div>

         <div className="text-slate-500 font-accroche text-sm text-center">
           {T.signature}
         </div>
      </div>
    </footer>
  );
}

// À chaque clic vers une page (même celle où l'on est déjà), on repart du haut.
// Sauf pour un lien vers une ancre (ex. /#devis) : la page gère elle-même le défilement.
function RemonterEnHaut() {
  const { key, hash } = useLocation();
  useEffect(() => {
    if (!hash) window.scrollTo(0, 0);
  }, [key, hash]);
  return null;
}

function Header() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const langue = useLangue();
  const T = TEXTES_ENTETE[langue];

  const close = () => setOpen(false);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between gap-3 px-4 sm:px-6 md:px-12 lg:px-6 xl:px-12 py-5 bg-bg-main/80 backdrop-blur-md border-b border-slate-200">
        <LienLangue to="/" onClick={close} className="shrink-0">
          <img src={`${import.meta.env.BASE_URL}logo-electricab-transparent.png`} alt="ELECTRICAB" className="h-3 min-[360px]:h-3.5 sm:h-5 w-auto" />
        </LienLangue>

        {/* Desktop nav, avec le choix de la langue à droite des onglets */}
        <div className="hidden lg:flex items-center gap-4 xl:gap-6 2xl:gap-8">
          <nav className="flex items-center gap-4 xl:gap-6 2xl:gap-8 text-xs font-bold uppercase tracking-widest text-slate-600">
            {navLinks.map(({ to, label }) => (
              <LienLangue key={to} to={to} className="hover:text-ink border-b border-transparent hover:border-brand pb-1 transition-all whitespace-nowrap">{label[langue]}</LienLangue>
            ))}
          </nav>
          <ChoixLangue />
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
        {/* Appel d'urgence : surtout utile sur mobile. Masqué entre 1024 et 1280 px, où le menu complet prend la place. */}
        <a href="tel:+33616267091" className="group flex lg:hidden xl:flex flex-col items-end text-right">
          <span className="text-[10px] min-[360px]:text-[11px] leading-4 text-slate-600 whitespace-nowrap">{T.urgence}</span>
          <span className="flex items-center gap-1.5 text-[13px] min-[360px]:text-sm leading-5 font-bold text-brand group-hover:text-brand-dark transition-colors whitespace-nowrap">
            <Phone size={13} strokeWidth={2.5} aria-hidden="true" /> {T.numero}
          </span>
        </a>

        <LienLangue to="/#devis" className="hidden sm:inline-block bg-brand hover:bg-brand-dark active:bg-brand-dark text-white font-bold px-6 lg:px-4 xl:px-6 py-3 rounded-none text-xs uppercase tracking-widest transition-colors whitespace-nowrap">
          {T.devis}
        </LienLangue>

        {/* Mobile hamburger */}
        <button
          className="lg:hidden text-brand p-1 -mr-1"
          onClick={() => setOpen(o => !o)}
          aria-label="Menu"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
        </div>

      {/* Mobile dropdown menu, accroché sous l'en-tête quelle que soit sa hauteur */}
      {open && (
        <div className="absolute top-full left-0 right-0 z-40 lg:hidden bg-bg-main/95 backdrop-blur-md border-b border-slate-200">
          <nav className="flex flex-col px-6 py-4 gap-1">
            {navLinks.map(({ to, label }) => (
              <LienLangue
                key={to}
                to={to}
                onClick={close}
                className={`py-3 text-sm font-bold uppercase tracking-widest border-b border-slate-200 transition-colors ${location.pathname === cheminLangue(to, langue) ? 'text-brand' : 'text-slate-600 hover:text-ink'}`}
              >
                {label[langue]}
              </LienLangue>
            ))}
            <ChoixLangue onChoix={close} className="py-4" />
            <LienLangue to="/#devis" onClick={close} className="sm:hidden mt-2 text-center bg-brand hover:bg-brand-dark active:bg-brand-dark text-white font-bold px-6 py-3 text-xs uppercase tracking-widest transition-colors">
              {T.devis}
            </LienLangue>
          </nav>
        </div>
      )}
      </header>
    </>
  );
}

export default function App() {
  return (
    <Router basename={import.meta.env.BASE_URL}>
      <div className="font-sans antialiased text-ink bg-bg-main min-h-screen overflow-x-hidden">
        <RemonterEnHaut />
        <Header />

        {/* Chaque page existe en français et en anglais (adresses commençant par /en) */}
        <Routes>
          <Route path="/" element={<Home />} />
          {/* Ancienne page À propos, devenue la section « Votre interlocuteur » de l'accueil */}
          <Route path="/a-propos" element={<Navigate to="/#qui-je-suis" replace />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/mentions-legales" element={<MentionsLegales />} />
          <Route path="/politique-de-confidentialite" element={<Confidentialite />} />

          <Route path="/en" element={<Home langue="en" />} />
          <Route path="/en/a-propos" element={<Navigate to="/en#qui-je-suis" replace />} />
          <Route path="/en/contact" element={<Contact langue="en" />} />
          <Route path="/en/mentions-legales" element={<MentionsLegales langue="en" />} />
          <Route path="/en/politique-de-confidentialite" element={<Confidentialite langue="en" />} />
        </Routes>

        <PiedDePage />
      </div>
    </Router>
  );
}
