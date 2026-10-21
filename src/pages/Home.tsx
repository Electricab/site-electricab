import { motion } from 'motion/react';
import { Camera, DoorOpen, TreePine, Wifi, Zap } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import FormulaireContact from '../FormulaireContact';
import { LienLangue, useLangueDocument, type Langue } from '../langue';

// Textes de la page en français et en anglais (/ et /en).
// En français, «   » est une espace insécable : elle empêche « : ; ? ! » de passer seuls à la ligne.
const TEXTES = {
  fr: {
    surtitre: 'Votre électricien dans l’Oise',
    accroche: 'Une relation simple, claire et structurée, du premier contact à la fin des travaux.',
    boutonDevis: 'Demander un devis', boutonServices: 'Nos services', boutonContact: 'Nous contacter',
    valeursTitre: 'Nos valeurs',
    valeurs: [
      { titre: 'Fiabilité et ponctualité', court: 'Délais annoncés, travaux assurés.', texte: 'Travaux réalisés dans les délais annoncés, par un professionnel assuré en décennale. Qualité maîtrisée à chaque étape.' },
      { titre: 'Clarté et transparence', court: 'Prix et planning connus dès le départ.', texte: 'Devis détaillé, avancement du chantier suivi à chaque étape. Facture sans mauvaise surprise.' },
      { titre: 'Écoute et conseil', court: 'Solution adaptée à vos besoins réels.', texte: 'Installation dimensionnée à votre besoin, et non à la solution la plus chère. Conseil honnête, y compris quand aucun travail n’est nécessaire.' },
    ],
    etapesTitre: 'Notre manière de travailler',
    etapesSousTitre: 'Un planning respecté avec des étapes claires',
    etapes: [
      { titre: 'Premier contact', texte: 'Réponse rapide par message ou par téléphone.' },
      { titre: 'Visite et échange', texte: 'Besoin réel compris, sur place si nécessaire.' },
      { titre: 'Devis et planning', texte: 'Devis détaillé et planning, rien ne démarre sans accord.' },
      { titre: 'Travaux et suivi', texte: 'Point régulier pendant tout le chantier.' },
      { titre: 'Fin de chantier', texte: 'Installation expliquée, conseils d’entretien donnés.' },
    ],
    servicesTitre: 'Nos services',
    servicesSousTitre: 'Du petit dépannage au chantier complet',
    services: [
      { titre: 'Électricité générale', detail: 'Rénovation et neuf', texte: 'Installation et rénovation complètes, prises, interrupteurs, tableaux électriques et VMC, aux normes en vigueur.', alt: 'Tableau électrique ouvert avec ses disjoncteurs et son câblage' },
      { titre: 'Surveillance et sécurité', detail: 'Caméras', texte: 'Caméras et enregistrement pour garder un œil sur votre maison.', alt: 'Caméra de surveillance fixée sous un avant-toit' },
      { titre: 'Ouverture et fermeture des logements', detail: 'Portails, garages, interphones, visiophones', texte: 'Installation, entretien et remise en route de vos motorisations de portails et portes de garage, interphones et visiophones.', alt: 'Portail coulissant motorisé avec visiophone sur le pilier' },
      { titre: 'Communication et connectivité', detail: 'Réseau, Starlink, domotique', texte: 'Création de réseau domestique, domotique et installation de système Starlink, pour une connexion dans toute la maison.', alt: 'Antenne Starlink installée sur un mât en bord de toit' },
      { titre: 'Aménagement extérieur', detail: 'Éclairage de jardin', texte: 'Éclairage extérieur pour mettre en valeur votre jardin et sécuriser vos accès.', alt: 'Allée de maison éclairée le soir par des spots encastrés' },
    ],
    interlocuteurTitre: 'Votre interlocuteur',
    interlocuteurSousTitre: 'Charles-Antoine Beirnaert – Fondateur d’Electricab',
    portraitAlt: 'Portrait de Charles-Antoine Beirnaert, fondateur d’Electricab',
    parcours1: 'Ingénieur de formation, Charles-Antoine a passé 19 ans dans une entreprise internationale, dont une grande partie au service commercial, ce qui l’a rendu attentif à ses clients.',
    parcours2: 'Passionné d’électricité depuis toujours, il s’est reconverti et a obtenu le titre professionnel d’Électricien d’équipement du bâtiment. Installé à Senlis, il a fondé Electricab et intervient dans la région de Senlis et Chantilly, avec un esprit structuré, un planning clair et une communication transparente.',
    devisTitre: 'Demander un devis',
    devisTexte: 'Confiez-nous votre projet pour une étude personnalisée et détaillée.',
    sujet: 'Nouvelle demande de devis depuis electricab.fr – {nom} – (page L’entreprise)',
  },
  en: {
    surtitre: 'Your electrician in the Oise',
    accroche: 'A simple, clear and structured relationship, from the first contact to the end of the work.',
    boutonDevis: 'Request a quote', boutonServices: 'Our services', boutonContact: 'Contact us',
    valeursTitre: 'Our values',
    valeurs: [
      { titre: 'Reliability and punctuality', court: 'Deadlines met, work insured.', texte: 'Work completed within the announced timeframe, by a professional covered by a 10-year liability insurance (décennale). Quality under control at every stage.' },
      { titre: 'Clarity and transparency', court: 'Price and schedule known from the start.', texte: 'A detailed quote, with progress tracked at every stage of the project. No unpleasant surprises on the invoice.' },
      { titre: 'Listening and advice', court: 'A solution suited to your real needs.', texte: 'An installation sized to your needs, not to the most expensive solution. Honest advice, even when no work is needed.' },
    ],
    etapesTitre: 'How we work',
    etapesSousTitre: 'A schedule we stick to, with clear steps',
    etapes: [
      { titre: 'First contact', texte: 'A quick reply by message or phone.' },
      { titre: 'Visit and discussion', texte: 'Your real needs understood, on site if necessary.' },
      { titre: 'Quote and schedule', texte: 'A detailed quote and schedule; nothing starts without your approval.' },
      { titre: 'Work and follow-up', texte: 'Regular updates throughout the project.' },
      { titre: 'Project completion', texte: 'Installation explained, maintenance advice given.' },
    ],
    servicesTitre: 'Our services',
    servicesSousTitre: 'From small repairs to complete projects',
    services: [
      { titre: 'General electrical work', detail: 'Renovation and new builds', texte: 'Complete installation and renovation: sockets, switches, consumer units and ventilation systems, to current standards.', alt: 'Open consumer unit with its circuit breakers and wiring' },
      { titre: 'Surveillance and security', detail: 'Cameras', texte: 'Cameras and recording to keep an eye on your home.', alt: 'Security camera mounted under the eaves' },
      { titre: 'Home access systems', detail: 'Gates, garage doors, intercoms, video intercoms', texte: 'Installation, maintenance and repair of your gate and garage door motors, intercoms and video intercoms.', alt: 'Motorised sliding gate with a video intercom on the pillar' },
      { titre: 'Communication and connectivity', detail: 'Network, Starlink, home automation', texte: 'Home network setup, home automation and Starlink installation, for a connection throughout the house.', alt: 'Starlink dish mounted on a pole at the edge of a roof' },
      { titre: 'Outdoor improvements', detail: 'Garden lighting', texte: 'Outdoor lighting to show off your garden and make your paths and entrances safer.', alt: 'House driveway lit in the evening by recessed spotlights' },
    ],
    interlocuteurTitre: 'Your point of contact',
    interlocuteurSousTitre: 'Charles-Antoine Beirnaert – Founder of Electricab',
    portraitAlt: 'Portrait of Charles-Antoine Beirnaert, founder of Electricab',
    parcours1: 'An engineer by training, Charles-Antoine spent 19 years with an international company, much of it in sales, which made him attentive to his clients.',
    parcours2: 'Passionate about electrical work for as long as he can remember, he retrained and earned the French professional qualification of building electrician (Électricien d’équipement du bâtiment). Based in Senlis, he founded Electricab and works across the Senlis and Chantilly area, bringing a structured approach, a clear schedule and transparent communication to every project.',
    devisTitre: 'Request a quote',
    devisTexte: 'Tell us about your project for a personalised, detailed assessment.',
    sujet: 'Nouvelle demande de devis depuis electricab.fr – {nom} – (page L’entreprise, version anglaise)',
  },
};

// Éléments communs aux deux langues, dans le même ordre que les textes ci-dessus
const ICONES_VALEURS = ['icone-fiabilite.svg', 'icone-clarte.svg', 'icone-ecoute.svg']; // dans public/
// Photos dans public/services/, image alternativement à gauche et à droite
const VISUELS_SERVICES = [
  { Icone: Zap, image: 'tableau-electrique.jpg' },
  { Icone: Camera, image: 'camera.jpg' },
  { Icone: DoorOpen, image: 'portail.jpg' },
  { Icone: Wifi, image: 'starlink.jpg', cadrage: 'object-top' },
  { Icone: TreePine, image: 'jardin.jpg' },
];

export default function Home({ langue = 'fr' }: { langue?: Langue }) {
  const T = TEXTES[langue];
  useLangueDocument(langue);
  const { hash, key } = useLocation();

  // Défilement vers la section demandée (/#devis, /#services…), même si on clique deux fois sur le même lien
  useEffect(() => {
    if (hash) {
      const element = document.getElementById(hash.substring(1));
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }
  }, [hash, key]);

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <main>
      {/* Hero Section */}
      <section className="w-full relative mt-32 lg:mt-24 min-h-[25rem] md:min-h-[22rem] py-8 bg-bg-card border-b border-slate-200 flex flex-col items-center justify-center overflow-hidden">
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
           <motion.div variants={fadeUp} className="relative -top-1.5 text-brand-dark font-bold tracking-[0.25em] text-xs uppercase mb-6 flex items-center gap-4 whitespace-nowrap">
              {/* Traits décoratifs masqués sur petit écran, pour que la mention tienne sur une ligne */}
              <span className="hidden sm:block w-8 h-px bg-brand"></span>
              {T.surtitre}
              <span className="hidden sm:block w-8 h-px bg-brand"></span>
           </motion.div>
           <motion.h1 variants={fadeUp} className="relative -top-3 mb-6 md:mb-8 w-full flex justify-center">
             <img src={`${import.meta.env.BASE_URL}logo-electricab-transparent.png`} alt="ELECTRICAB" className="w-full max-w-2xl h-auto" />
           </motion.h1>
           <motion.p variants={fadeUp} className="text-xl md:text-2xl font-accroche font-light text-slate-700 max-w-2xl mx-auto mb-6 md:mb-7">{T.accroche}</motion.p>

           <motion.div variants={fadeUp} className="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-4 sm:gap-6">
              <LienLangue to="/#devis" className="w-full sm:w-auto text-center bg-brand hover:bg-brand-dark active:bg-brand-dark text-white font-bold px-10 py-4 uppercase tracking-widest text-xs transition-colors">
                {T.boutonDevis}
              </LienLangue>
              <LienLangue to="/#services" className="w-full sm:w-auto text-center border border-slate-300 hover:border-brand hover:text-brand text-ink font-bold px-10 py-4 uppercase tracking-widest text-xs transition-colors">
                {T.boutonServices}
              </LienLangue>
              <LienLangue to="/contact" className="w-full sm:w-auto text-center border border-slate-300 hover:border-brand hover:text-brand text-ink font-bold px-10 py-4 uppercase tracking-widest text-xs transition-colors">
                {T.boutonContact}
              </LienLangue>
           </motion.div>
        </motion.div>
      </section>

      {/* Values Section */}
      <section className="py-24 px-4 sm:px-8 bg-bg-main">
        <div className="max-w-6xl mx-auto">
          <motion.div
             initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}
             className="text-center mb-24"
          >
            <h2 className="text-2xl md:text-4xl leading-tight font-display text-ink inline-block relative">
              {T.valeursTitre}
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-24 h-[2px] bg-brand"></div>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {T.valeurs.map(({ titre, court, texte }, i) => (
              <motion.div
                 key={ICONES_VALEURS[i]}
                 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: 0.1 * (i + 1) }}
                 className="text-center p-10 border border-slate-200 bg-bg-card hover:border-brand/40 transition-colors duration-500 flex flex-col items-center"
              >
                <img src={`${import.meta.env.BASE_URL}${ICONES_VALEURS[i]}`} alt="" width={72} height={72} className="w-18 h-18 mb-6" />
                <h3 className="text-2xl font-accroche font-semibold text-ink mb-2">{titre}</h3>
                <p className="text-brand font-medium leading-snug">{court}</p>
                <div className="w-12 h-[2px] bg-brand/40 my-5"></div>
                <p className="text-slate-600 leading-relaxed text-sm">{texte}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Notre manière de travailler : frise horizontale, verticale sur téléphone */}
      <section className="py-24 px-4 sm:px-8 bg-bg-card">
        <div className="max-w-6xl mx-auto">
          <motion.div
             initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}
             className="text-center mb-20"
          >
            <h2 className="text-2xl md:text-4xl leading-tight font-display text-ink inline-block relative">
              {T.etapesTitre}
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-24 h-[2px] bg-brand"></div>
            </h2>
            <p className="mt-12 text-xl md:text-2xl font-accroche font-light text-slate-700">{T.etapesSousTitre}</p>
          </motion.div>

          <ol className="relative grid md:grid-cols-5 gap-10 md:gap-0">
            {/* La ligne passe par le centre des numéros (sur téléphone, un segment par étape, voir plus bas) */}
            <div aria-hidden="true" className="hidden md:block absolute top-7 left-[10%] right-[10%] h-[2px] -translate-y-1/2 bg-brand/40"></div>

            {T.etapes.map(({ titre, texte }, i) => (
              <motion.li
                 key={i}
                 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: 0.1 * i }}
                 tabIndex={0}
                 className="group relative flex md:flex-col items-start md:items-center gap-5 md:gap-0 md:px-3 md:text-center outline-none"
              >
                {i < T.etapes.length - 1 && (
                  <div aria-hidden="true" className="absolute md:hidden left-7 top-14 -bottom-10 w-[2px] -translate-x-1/2 bg-brand/40"></div>
                )}
                <div className="relative z-10 shrink-0 w-14 h-14 rounded-full border-2 border-brand bg-bg-card text-brand font-display text-lg flex items-center justify-center transition-all duration-300 survol:group-hover:scale-125 survol:group-hover:bg-brand survol:group-hover:text-white group-focus-visible:bg-brand group-focus-visible:text-white">
                  {i + 1}
                </div>
                <div className="pt-3 md:pt-0 md:mt-7">
                  <h3 className="font-accroche font-semibold text-xl text-ink leading-snug transition-all duration-300 survol:group-hover:text-brand survol:group-hover:scale-110 group-focus-visible:text-brand">{titre}</h3>
                  <p className="mt-2 text-slate-600 text-sm leading-relaxed transition-all duration-300 survol:opacity-0 survol:translate-y-2 survol:group-hover:opacity-100 survol:group-hover:translate-y-0 survol:group-focus-visible:opacity-100 survol:group-focus-visible:translate-y-0">{texte}</p>
                </div>
              </motion.li>
            ))}
          </ol>
        </div>
      </section>

      {/* Services Section : un groupe par service, image une fois à gauche, une fois à droite */}
      <section id="services" className="py-32 px-4 sm:px-8 bg-bg-main relative overflow-hidden scroll-mt-32 lg:scroll-mt-20">
        <div className="max-w-6xl mx-auto">
          <motion.div
             initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}
             className="text-center mb-24"
          >
            <h2 className="text-2xl md:text-4xl leading-tight font-display text-ink inline-block relative">
              {T.servicesTitre}
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-24 h-[2px] bg-brand"></div>
            </h2>
            <p className="mt-12 text-xl md:text-2xl font-accroche font-light text-slate-700">{T.servicesSousTitre}</p>
          </motion.div>

          {/* Image à côté du texte, à sa hauteur. Sur téléphone, l'explication passe sous la ligne image + titre,
              pour que la photo ne devienne pas une bande haute et étroite. */}
          <ul className="max-w-4xl mx-auto space-y-12 md:space-y-20">
            {T.services.map(({ titre, detail, texte, alt }, i) => {
              const { Icone, image, cadrage } = VISUELS_SERVICES[i];
              const imageADroite = i % 2 === 1;
              const animation = (x: number) => ({
                initial: { opacity: 0, x }, whileInView: { opacity: 1, x: 0 }, viewport: { once: true }, transition: { duration: 0.8 },
              });
              return (
                <li key={image} className={`grid gap-x-5 sm:gap-x-8 md:gap-x-12 gap-y-3 md:gap-y-0 md:grid-rows-[auto_1fr] ${imageADroite ? 'grid-cols-[1fr_7rem] sm:grid-cols-[1fr_11rem] md:grid-cols-[1fr_16rem]' : 'grid-cols-[7rem_1fr] sm:grid-cols-[11rem_1fr] md:grid-cols-[16rem_1fr]'}`}>
                  <motion.div
                     {...animation(imageADroite ? 50 : -50)}
                     className={`relative row-start-1 md:row-span-2 ${imageADroite ? 'col-start-2' : 'col-start-1'}`}
                  >
                    <div className="absolute -inset-3 border border-brand/20 z-0 hidden md:block opacity-50"></div>
                    <div className="group relative z-10 h-full overflow-hidden bg-bg-card">
                      <img
                         src={`${import.meta.env.BASE_URL}services/${image}`}
                         alt={alt}
                         width={1024} height={1024} loading="lazy"
                         className={`absolute inset-0 w-full h-full object-cover ${cadrage ?? ''} survol:grayscale transition-all duration-1000 group-hover:scale-105 survol:group-hover:grayscale-0`}
                      />
                      <div className="absolute inset-0 ring-1 ring-inset ring-slate-900/10 pointer-events-none"></div>
                    </div>
                  </motion.div>

                  <motion.div
                     {...animation(imageADroite ? -50 : 50)}
                     className={`row-start-1 min-w-0 pt-1 ${imageADroite ? 'col-start-1' : 'col-start-2'}`}
                  >
                    <div className="w-10 h-10 md:w-14 md:h-14 mb-3 md:mb-5 border border-brand/30 bg-bg-card flex items-center justify-center">
                      <Icone strokeWidth={1.5} className="text-brand w-5 h-5 md:w-[26px] md:h-[26px]" aria-hidden="true" />
                    </div>
                    <h3 className="text-lg sm:text-2xl md:text-3xl font-accroche font-semibold text-ink leading-snug mb-1 md:mb-2">{titre}</h3>
                    <p className="text-brand font-medium text-sm sm:text-base leading-snug">{detail}</p>
                    <div className="w-12 h-[2px] bg-brand/40 mt-3 md:mt-4"></div>
                  </motion.div>

                  <motion.p
                     {...animation(imageADroite ? -50 : 50)}
                     className={`row-start-2 col-span-2 col-start-1 md:col-span-1 md:pt-4 pb-1 text-slate-600 text-sm sm:text-base leading-relaxed ${imageADroite ? 'md:col-start-1' : 'md:col-start-2'}`}
                  >
                    {texte}
                  </motion.p>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* Votre interlocuteur (anciennement la page À propos ; adresse /#qui-je-suis conservée) */}
      <section id="qui-je-suis" className="py-32 px-4 sm:px-8 bg-bg-card scroll-mt-32 lg:scroll-mt-20">
        <div className="max-w-6xl mx-auto">
          <motion.div
             initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}
             className="text-center mb-20"
          >
            <h2 className="text-2xl md:text-4xl leading-tight font-display text-ink inline-block relative">
              {T.interlocuteurTitre}
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-24 h-[2px] bg-brand"></div>
            </h2>
            <p className="mt-12 text-xl md:text-2xl font-accroche font-light text-slate-700">{T.interlocuteurSousTitre}</p>
          </motion.div>

          <div className="max-w-4xl mx-auto flex flex-col md:flex-row-reverse gap-10 md:gap-16 items-center">
            <motion.div
               initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
               className="relative shrink-0"
            >
                {/* Photo de Charles-Antoine, même style que les photos des services */}
                <div className="absolute -inset-3 border border-brand/20 z-0 hidden md:block opacity-50"></div>
                <div className="group relative z-10 w-56 h-56 md:w-64 md:h-64 overflow-hidden bg-bg-main">
                    <img
                        src={`${import.meta.env.BASE_URL}portrait-charles-antoine.jpg`}
                        alt={T.portraitAlt}
                        width={800} height={803} loading="lazy"
                        className="w-full h-full object-cover object-[center_35%] survol:grayscale transition-all duration-1000 group-hover:scale-105 survol:group-hover:grayscale-0"
                    />
                    <div className="absolute inset-0 ring-1 ring-inset ring-slate-900/10 pointer-events-none"></div>
                </div>
            </motion.div>

            {/* Même taille de texte que les explications des services */}
            <motion.div
               initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
               className="flex-1 min-w-0 text-slate-600 text-sm sm:text-base leading-relaxed"
            >
                <p className="mb-4">{T.parcours1}</p>
                <p>{T.parcours2}</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-32 px-4 sm:px-8 bg-gradient-to-b from-bg-card to-bg-main">
        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
          className="max-w-3xl mx-auto bg-bg-card/50 p-8 md:p-16 border border-slate-200 backdrop-blur-md relative"
        >
           <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-[1px] bg-gradient-to-r from-transparent via-brand to-transparent"></div>

           {/* Même en-tête que les autres sections : titre, filet bleu, sous-titre en Jura */}
           <div id="devis" className="text-center mb-16 scroll-mt-36 lg:scroll-mt-28">
             <h2 className="text-2xl md:text-4xl leading-tight font-display text-ink inline-block relative">
               {T.devisTitre}
               <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-24 h-[2px] bg-brand"></div>
             </h2>
             <p className="mt-12 text-xl md:text-2xl font-accroche font-light text-slate-700">{T.devisTexte}</p>
           </div>

           <FormulaireContact sujet={T.sujet} langue={langue} dateRealisation />
        </motion.div>
      </section>
    </main>
  );
}
