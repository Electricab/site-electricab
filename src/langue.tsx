import { useEffect, useId, type ComponentProps } from 'react';
import { Link, useLocation } from 'react-router-dom';

// Langue du site : français par défaut, anglais pour toutes les adresses commençant par /en
// (/en, /en/contact…). Une adresse anglaise peut donc être partagée telle quelle.
// Toutes les pages sont traduites : les drapeaux affichent la même page dans l'autre langue.
export type Langue = 'fr' | 'en';

export function useLangue(): Langue {
  const { pathname } = useLocation();
  return pathname === '/en' || pathname.startsWith('/en/') ? 'en' : 'fr';
}

// Adresse d'une page dans une langue donnée : '/contact' -> '/en/contact', '/#devis' -> '/en#devis'
export function cheminLangue(chemin: string, langue: Langue): string {
  if (langue === 'fr') return chemin;
  const [page, ancre] = chemin.split('#');
  return (page === '/' ? '/en' : `/en${page}`) + (ancre !== undefined ? `#${ancre}` : '');
}

// Même page, dans l'autre langue
function cheminTraduit(pathname: string, cible: Langue): string {
  const pageFr = pathname === '/en' ? '/' : pathname.startsWith('/en/') ? pathname.slice(3) : pathname;
  return cheminLangue(pageFr, cible);
}

// Lien interne qui garde la langue en cours
export function LienLangue({ to, ...props }: ComponentProps<typeof Link> & { to: string }) {
  return <Link to={cheminLangue(to, useLangue())} {...props} />;
}

// Langue déclarée au navigateur (lecteurs d'écran, moteurs de recherche) pour une page traduite
export function useLangueDocument(langue: Langue) {
  useEffect(() => {
    document.documentElement.lang = langue;
    return () => { document.documentElement.lang = 'fr'; };
  }, [langue]);
}

function DrapeauFrance() {
  return (
    <svg viewBox="0 0 3 2" className="w-full h-full" aria-hidden="true">
      <rect width="1" height="2" x="0" fill="#002654" />
      <rect width="1" height="2" x="1" fill="#ffffff" />
      <rect width="1" height="2" x="2" fill="#ce1126" />
    </svg>
  );
}

function DrapeauRoyaumeUni() {
  const id = useId();
  return (
    <svg viewBox="0 0 60 30" preserveAspectRatio="xMidYMid slice" className="w-full h-full" aria-hidden="true">
      <clipPath id={`${id}-t`}><path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z" /></clipPath>
      <path d="M0,0 v30 h60 v-30 z" fill="#012169" />
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
      <path d="M0,0 L60,30 M60,0 L0,30" clipPath={`url(#${id}-t)`} stroke="#C8102E" strokeWidth="4" />
      <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10" />
      <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6" />
    </svg>
  );
}

// Deux petits drapeaux pour changer de langue (même page, autre langue)
export function ChoixLangue({ onChoix, className = '' }: { onChoix?: () => void; className?: string }) {
  const langue = useLangue();
  const { pathname } = useLocation();
  const drapeaux = [
    { code: 'fr' as const, libelle: 'Version française', Drapeau: DrapeauFrance },
    { code: 'en' as const, libelle: 'English version', Drapeau: DrapeauRoyaumeUni },
  ];
  return (
    <nav aria-label="Langue / Language" className={`flex items-center gap-2 ${className}`}>
      {drapeaux.map(({ code, libelle, Drapeau }) => {
        const actif = code === langue;
        return (
          <Link
            key={code} to={cheminTraduit(pathname, code)} hrefLang={code} lang={code} onClick={onChoix}
            aria-label={libelle} title={libelle} aria-current={actif ? 'page' : undefined}
            className={`block w-7 h-[1.2rem] overflow-hidden rounded-sm shadow-sm transition-all ${actif ? 'ring-2 ring-brand ring-offset-2 ring-offset-bg-main' : 'opacity-50 hover:opacity-100'}`}
          >
            <Drapeau />
          </Link>
        );
      })}
    </nav>
  );
}
