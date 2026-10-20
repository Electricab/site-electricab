import { motion } from 'motion/react';
import type { ReactNode } from 'react';
import { useLangueDocument, type Langue } from './langue';

// Mise en page commune aux pages légales (Mentions légales, Politique de confidentialité) :
// même bandeau que les autres pages, puis le texte en sections.

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 }
};

// Date de dernière mise à jour des pages légales, dans chaque langue
export const MISE_A_JOUR = { fr: 'Dernière mise à jour : 20 octobre 2026', en: 'Last updated: 20 October 2026' };

// Avertissement affiché en tête des versions anglaises : seule la version française fait foi
const AVERTISSEMENT_TRADUCTION = 'This English translation is provided for convenience only. In case of discrepancy, the French version prevails.';

type Props = { surtitre: string; titre: string; accroche: string; langue?: Langue; children: ReactNode };

export function PageLegale({ surtitre, titre, accroche, langue = 'fr', children }: Props) {
  useLangueDocument(langue);
  return (
    <main className="pt-24 pb-16 min-h-screen bg-bg-main flex flex-col items-center">
      <section className="w-full relative min-h-[25rem] md:min-h-[22rem] py-8 bg-bg-card border-b border-slate-200 flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={`${import.meta.env.BASE_URL}bandeau.svg`}
            alt=""
            className="w-full h-full object-cover opacity-35"
          />
        </div>

        <motion.div
          key={langue}
          className="relative z-10 flex flex-col items-center text-center px-4 max-w-4xl"
          initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.2 } } }}
        >
          <motion.div variants={fadeUp} className="relative -top-1.5 text-brand-dark font-bold tracking-[0.25em] text-xs uppercase mb-6 flex items-center gap-4">
            <span className="w-8 h-px bg-brand"></span>
            {surtitre}
            <span className="w-8 h-px bg-brand"></span>
          </motion.div>
          <motion.h1 variants={fadeUp} className="relative -top-3 text-3xl sm:text-4xl md:text-[3.25rem] leading-tight font-display text-ink mb-6">{titre}</motion.h1>
          <motion.p variants={fadeUp} className="text-xl md:text-2xl font-accroche font-light text-slate-700 max-w-2xl mx-auto">{accroche}</motion.p>
        </motion.div>
      </section>

      <div className="w-full max-w-3xl mx-auto px-4 sm:px-8 py-16 md:py-20 space-y-12 text-slate-700 leading-relaxed">
        {langue === 'en' && <p className="text-sm text-slate-500 border-l-2 border-brand/40 pl-4">{AVERTISSEMENT_TRADUCTION}</p>}
        {children}
        <p className="pt-8 border-t border-slate-200 text-sm text-slate-500">{MISE_A_JOUR[langue]}</p>
      </div>
    </main>
  );
}

export function SectionLegale({ titre, children }: { titre: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="text-xl md:text-2xl leading-tight font-display text-ink mb-5 pb-3 border-b border-brand/20">{titre}</h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

// Liste « intitulé : valeur » (identité de l'entreprise, hébergeur…)
export function Infos({ lignes }: { lignes: [string, ReactNode][] }) {
  return (
    <dl className="grid grid-cols-1 sm:grid-cols-[minmax(0,14rem)_1fr] gap-x-6 gap-y-2">
      {lignes.map(([intitule, valeur]) => (
        <div key={intitule} className="contents">
          <dt className="font-semibold text-ink">{intitule}</dt>
          <dd className="mb-2 sm:mb-0">{valeur}</dd>
        </div>
      ))}
    </dl>
  );
}

export const lienClasse = 'text-brand hover:text-brand-dark underline underline-offset-2 transition-colors';
