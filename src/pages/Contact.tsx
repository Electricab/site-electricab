import { motion } from 'motion/react';
import { Mail, Phone } from 'lucide-react';
import FormulaireContact from '../FormulaireContact';
import RendezVous, { ouvrirRendezVous } from '../RendezVous';
import { type Langue, useLangueDocument } from '../langue';

// Logo WhatsApp officiel (lucide-react ne fournit pas les logos de marque)
function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" width={22} height={22} fill="#25D366" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
}

// Textes de la page en français et en anglais (/contact et /en/contact).
// En français, «   » est une espace insécable : elle empêche « : ; ? ! » de passer seuls à la ligne.
const TEXTES = {
  fr: {
    surtitre: 'Nous contacter',
    titre: 'Parlons de votre projet',
    accroche: 'Une question, un devis, une urgence ? L’équipe d’Electricab est à votre entière disposition.',
    coordonnees: 'Coordonnées',
    telephone: 'Téléphone', numero: '06 16 26 70 91',
    meilleurMoment: 'Meilleur moment pour m’appeler : 17 h 30 – 19 h',
    pasDeReponse: 'Pas de réponse ? Laissez un message ou envoyez-moi un SMS, je vous rappelle dès que possible. Vous pouvez aussi ',
    lienRdvTelephone: 'prendre un rendez-vous téléphonique', apresRdvTelephone: '.',
    email: 'E-mail',
    horaires: 'Horaires d’ouverture',
    semaine: 'Lundi – vendredi', heuresSemaine: '8 h 30 – 18 h 30',
    samedi: 'Samedi', heuresSamedi: 'Sur rendez-vous',
    dimanche: 'Dimanche', ferme: 'Fermé',
    formulaireTitre: 'Envoyez-nous un message',
    formulaireTexte: 'Confiez-nous votre projet pour une étude personnalisée.',
    sujet: 'Nouvelle demande de contact depuis electricab.fr (page Contact)',
  },
  en: {
    surtitre: 'Contact us',
    titre: "Let's talk about your project",
    accroche: 'A question, a quote, an emergency? The Electricab team is entirely at your disposal.',
    coordonnees: 'Contact details',
    telephone: 'Phone', numero: '+33 6 16 26 70 91',
    meilleurMoment: 'Best time to call me: 5:30 pm – 7 pm (French time)',
    pasDeReponse: "No answer? Leave a voicemail or send me a text message, and I'll call you back as soon as possible. You can also ",
    lienRdvTelephone: 'book a phone appointment', apresRdvTelephone: '.',
    email: 'Email',
    horaires: 'Opening hours',
    semaine: 'Monday – Friday', heuresSemaine: '8:30 am – 6:30 pm',
    samedi: 'Saturday', heuresSamedi: 'By appointment',
    dimanche: 'Sunday', ferme: 'Closed',
    formulaireTitre: 'Send us a message',
    formulaireTexte: "Tell us about your project and we'll prepare a tailored quote.",
    sujet: 'Nouvelle demande de contact depuis electricab.fr (page Contact, version anglaise)',
  },
};

export default function Contact({ langue = 'fr' }: { langue?: Langue }) {
  const T = TEXTES[langue];
  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  };

  // Langue de la page pour les navigateurs, lecteurs d'écran et moteurs de recherche
  useLangueDocument(langue);

  return (
    <main className="pt-32 lg:pt-24 pb-16 min-h-screen bg-bg-main flex flex-col items-center">
      {/* Hero Header */}
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
             {T.surtitre}
             <span className="w-8 h-px bg-brand"></span>
          </motion.div>

          <motion.h1 variants={fadeUp} className="relative -top-3 text-3xl sm:text-4xl md:text-[3.25rem] leading-tight font-display text-ink mb-6">{T.titre}</motion.h1>
          <motion.p variants={fadeUp} className="text-xl md:text-2xl font-accroche font-light text-slate-700 max-w-2xl mx-auto">{T.accroche}</motion.p>
        </motion.div>
      </section>

      {/* Main Content */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-20 grid md:grid-cols-5 gap-12 lg:gap-20">

        {/* Contact Info */}
        <motion.div
            initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
            className="md:col-span-2 space-y-12"
        >
            <div>
                <h3 className="text-2xl font-accroche font-semibold text-ink mb-8 border-b border-slate-200 pb-4 inline-block">{T.coordonnees}</h3>
                <div className="space-y-8">
                    <div className="flex items-start gap-5 group">
                        <div className="w-12 h-12 rounded-full border border-brand/20 bg-brand/5 flex items-center justify-center shrink-0 group-hover:bg-brand/10 group-hover:border-brand/40 transition-all">
                            <Phone className="text-brand" size={20} />
                        </div>
                        <div>
                            <div className="text-[10px] uppercase tracking-widest text-slate-600 font-bold mb-1">{T.telephone}</div>
                            <a href="tel:+33616267091" className="text-lg text-ink font-medium hover:text-brand transition-colors tracking-widest">{T.numero}</a>
                            <p className="mt-2 text-sm font-bold text-ink">{T.meilleurMoment}</p>
                            <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                              {T.pasDeReponse}
                              <button type="button" onClick={() => ouvrirRendezVous('telephone')} className="text-brand hover:text-brand-dark underline underline-offset-2 transition-colors">{T.lienRdvTelephone}</button>
                              {T.apresRdvTelephone}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-5 group">
                        <div className="w-12 h-12 rounded-full border border-brand/20 bg-brand/5 flex items-center justify-center shrink-0 group-hover:bg-brand/10 group-hover:border-brand/40 transition-all">
                            <Mail className="text-brand" size={20} />
                        </div>
                        <div>
                            <div className="text-[10px] uppercase tracking-widest text-slate-600 font-bold mb-1">{T.email}</div>
                            <a href="mailto:contact@electricab.fr" className="text-lg text-ink font-medium hover:text-brand transition-colors">contact@electricab.fr</a>
                        </div>
                    </div>

                    <div className="flex items-start gap-5 group">
                        <div className="w-12 h-12 rounded-full border border-brand/20 bg-brand/5 flex items-center justify-center shrink-0 group-hover:bg-brand/10 group-hover:border-brand/40 transition-all">
                            <WhatsAppIcon />
                        </div>
                        <div>
                            <div className="text-[10px] uppercase tracking-widest text-slate-600 font-bold mb-1">WhatsApp</div>
                            <a href="https://wa.me/33616267091" target="_blank" rel="noopener noreferrer" className="text-lg text-ink font-medium hover:text-brand transition-colors">@ElectricabOise</a>
                        </div>
                    </div>
                </div>
            </div>

            <RendezVous langue={langue} />

            <div className="p-8 border border-slate-200 bg-bg-card">
                <h4 className="font-accroche font-semibold text-brand text-lg mb-4">{T.horaires}</h4>
                <ul className="space-y-3 text-sm text-slate-600">
                    <li className="flex justify-between border-b border-slate-200 pb-2"><span>{T.semaine}</span> <span className="text-ink">{T.heuresSemaine}</span></li>
                    <li className="flex justify-between border-b border-slate-200 pb-2"><span>{T.samedi}</span> <span className="text-ink">{T.heuresSamedi}</span></li>
                    <li className="flex justify-between pt-1"><span>{T.dimanche}</span> <span className="text-slate-500">{T.ferme}</span></li>
                </ul>
            </div>
        </motion.div>

        {/* Contact Form */}
        <div className="md:col-span-3">
        <motion.div
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-bg-card/50 p-8 md:p-12 border border-slate-200 backdrop-blur-md relative"
        >
             <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-[1px] bg-gradient-to-r from-transparent via-brand to-transparent"></div>

             <div className="mb-10">
               <h2 className="text-xl md:text-2xl leading-tight font-display text-ink mb-4">{T.formulaireTitre}</h2>
               <p className="text-slate-600">{T.formulaireTexte}</p>
             </div>

             <FormulaireContact sujet={T.sujet} lienRetour langue={langue} />
        </motion.div>
        </div>
      </section>
    </main>
  );
}
