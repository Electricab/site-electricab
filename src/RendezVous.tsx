import { useEffect, useId, useRef, useState, type FormEvent } from 'react';
import { CalendarCheck, ChevronLeft, MapPin, Phone, X } from 'lucide-react';
import { LienLangue, type Langue } from './langue';
import { telephoneValide, useSaisieTelephone } from './telephone';
import { bloquerEntree, ChampAntiRobot, CHAMP_ANTI_ROBOT, envoyerEmail } from './envoiFormulaire';

// Prise de rendez-vous de la page Contact.
// Les disponibilités sont calculées par le programme Google Apps Script de rendez-vous/Code.gs,
// qui lit l'agenda dans votre compte Google : le site ne reçoit que des heures libres, jamais le détail des rendez-vous.
//
// Adresse du programme une fois déployé (voir rendez-vous/LISEZ-MOI.md), de la forme
// https://script.google.com/macros/s/…/exec
// Tant qu'elle est vide, le bouton n'apparaît pas sur le site en ligne ; en local (npm run dev),
// des créneaux fictifs sont proposés pour tester l'affichage.
const URL_RENDEZ_VOUS = 'https://script.google.com/macros/s/AKfycbxpsBRSa2YNr0-i6fUp7c24f0RmFq5R6-spU1RtTiJiOamg2a9swFvSXSZiLId0ijmk/exec';

type TypeRdv = 'telephone' | 'surplace';
type Jour = { date: string; creneaux: string[] };
type Etat = 'repos' | 'chargement' | 'erreur' | 'envoi' | 'confirme';

const SIMULATION = !URL_RENDEZ_VOUS && import.meta.env.DEV;

// Ouvre la fenêtre de rendez-vous depuis un autre endroit de la page (lien « prendre un rendez-vous téléphonique »…),
// avec éventuellement le type déjà choisi
const EVENEMENT_OUVRIR = 'electricab:ouvrir-rendez-vous';
export function ouvrirRendezVous(type?: TypeRdv) {
  window.dispatchEvent(new CustomEvent(EVENEMENT_OUVRIR, { detail: type }));
}

// En français, «   » est une espace insécable : elle empêche « : ; ? ! » de passer seuls à la ligne.
const TEXTES = {
  fr: {
    carteTitre: 'Rendez-vous',
    carteTexte: 'Par téléphone (15 min) ou sur place (1 h), du lundi au vendredi. Choisissez directement votre créneau.',
    bouton: 'Je souhaite prendre rendez-vous',
    titre: 'Prendre rendez-vous',
    fermer: 'Fermer',
    question: 'Quel type de rendez-vous ?',
    telephone: 'Par téléphone', telephoneDuree: '15 min',
    surplace: 'Sur place', surplaceDuree: '1 h',
    choixJour: 'Choisissez un jour', choixHeure: 'Choisissez une heure', changerJour: 'Changer de jour', changerHeure: 'Changer d’heure',
    chargement: 'Recherche des disponibilités…',
    erreurChargement: 'Les disponibilités n’ont pas pu être chargées. Réessayez dans un instant, ou appelez le 06 16 26 70 91.',
    reessayer: 'Réessayer',
    aucunJour: 'Aucune disponibilité pour le moment. Appelez-moi au 06 16 26 70 91.',
    coordonnees: 'Vos coordonnées',
    nom: 'Votre nom *', tel: 'Téléphone *', telExemple: '06 00 00 00 00',
    telInvalide: 'Numéro invalide : 10 chiffres pour un numéro français (06 00 00 00 00), ou + et indicatif pour un numéro étranger.',
    email: 'E-mail', emailAide: 'Pour recevoir la confirmation et l’invitation dans votre agenda.',
    adresseRdv: 'Adresse du rendez-vous *', adresseChantier: 'Adresse du chantier', adresseChantierAide: 'Si elle est différente de celle du rendez-vous.',
    motif: 'Motif du rendez-vous', motifExemple: 'En quelques mots : dépannage, devis de rénovation, installation…',
    confirmer: 'Confirmer le rendez-vous', envoi: 'Réservation en cours…',
    obligatoires: 'Les champs marqués d’un * sont obligatoires.',
    confidentialiteAvant: 'Vos informations servent uniquement à organiser ce rendez-vous. Voir notre ',
    confidentialiteLien: 'politique de confidentialité', confidentialiteApres: '.',
    recap: (type: TypeRdv, jour: string, heure: string) =>
      type === 'telephone' ? `Rendez-vous par téléphone le ${jour} à ${heure} (15 min)` : `Rendez-vous sur place le ${jour} à ${heure} (1 h)`,
    confirmeTitre: 'Rendez-vous confirmé',
    confirmeAppel: 'Je vous appellerai au numéro indiqué.',
    confirmeEmail: 'Vous allez recevoir un e-mail de confirmation et une invitation Google Agenda.',
    confirmeSansEmail: 'Notez bien la date : sans e-mail, vous ne recevrez pas de confirmation écrite.',
    erreurs: {
      pris: 'Ce créneau vient d’être pris. Choisissez-en un autre.',
      repetition: 'Un rendez-vous vient déjà d’être pris avec ce numéro. Patientez deux minutes, ou appelez-moi au 06 16 26 70 91.',
      autre: 'La réservation n’a pas abouti. Réessayez dans un instant, ou appelez le 06 16 26 70 91.',
    },
  },
  en: {
    carteTitre: 'Appointments',
    carteTexte: 'By phone (15 min) or on site (1 h), Monday to Friday. Pick your time slot directly.',
    bouton: 'Book an appointment',
    titre: 'Book an appointment',
    fermer: 'Close',
    question: 'What type of appointment?',
    telephone: 'By phone', telephoneDuree: '15 min',
    surplace: 'On site', surplaceDuree: '1 h',
    choixJour: 'Choose a day', choixHeure: 'Choose a time (French time)', changerJour: 'Change day', changerHeure: 'Change time',
    chargement: 'Looking for available slots…',
    erreurChargement: 'Available slots could not be loaded. Please try again in a moment, or call +33 6 16 26 70 91.',
    reessayer: 'Try again',
    aucunJour: 'No availability at the moment. Please call me on +33 6 16 26 70 91.',
    coordonnees: 'Your details',
    nom: 'Your name *', tel: 'Phone *', telExemple: '+44 20 12 34 56 78',
    telInvalide: 'Invalid number: 10 digits for a French number (06 00 00 00 00), or + and country code for an international number.',
    email: 'Email', emailAide: 'To receive the confirmation and the invitation in your calendar.',
    adresseRdv: 'Appointment address *', adresseChantier: 'Job site address', adresseChantierAide: 'If different from the appointment address.',
    motif: 'Reason for the appointment', motifExemple: 'In a few words: repair, renovation quote, installation…',
    confirmer: 'Confirm the appointment', envoi: 'Booking…',
    obligatoires: 'Fields marked with * are required.',
    confidentialiteAvant: 'Your information is used only to organise this appointment. See our ',
    confidentialiteLien: 'privacy policy', confidentialiteApres: '.',
    recap: (type: TypeRdv, jour: string, heure: string) =>
      type === 'telephone' ? `Phone appointment on ${jour} at ${heure} (15 min, French time)` : `On-site appointment on ${jour} at ${heure} (1 h, French time)`,
    confirmeTitre: 'Appointment confirmed',
    confirmeAppel: 'I will call you on the number you provided.',
    confirmeEmail: 'You will receive a confirmation email and a Google Calendar invitation.',
    confirmeSansEmail: 'Please note the date: without an email address, you will not receive a written confirmation.',
    erreurs: {
      pris: 'This slot has just been taken. Please choose another one.',
      repetition: 'An appointment has just been booked with this number. Please wait two minutes, or call me on +33 6 16 26 70 91.',
      autre: 'The booking could not be completed. Please try again in a moment, or call +33 6 16 26 70 91.',
    },
  },
};

const EMAIL_PATTERN = String.raw`[^@\s]+@[^@\s]+\.[a-zA-Z]{2,}`;
const CLASSE_LABEL = 'block text-[10px] font-bold uppercase tracking-[0.2em] text-brand mb-2';
const CLASSE_CHAMP = 'w-full bg-bg-main border border-slate-200 px-4 py-3 text-ink focus:outline-none focus:border-brand/50 user-invalid:border-red-500 transition-colors placeholder:text-slate-400';
const CLASSE_CHOIX = 'border text-center transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/50';
const CLASSE_CHOIX_INACTIF = 'border-slate-200 bg-bg-main text-ink hover:border-brand hover:text-brand';
const CLASSE_CHOIX_ACTIF = 'border-brand bg-brand text-white';

// Jour au format « mardi 21 octobre » / « Tuesday 21 October » (date ISO AAAA-MM-JJ, heure de Paris)
function texteJour(iso: string, langue: Langue, court = false): string {
  const options: Intl.DateTimeFormatOptions = court
    ? { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'Europe/Paris' }
    : { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'Europe/Paris' };
  return new Intl.DateTimeFormat(langue === 'en' ? 'en-GB' : 'fr-FR', options).format(new Date(`${iso}T12:00:00Z`));
}

// Créneaux fictifs pour tester l'affichage en local, sans le programme Google
function joursSimules(type: TypeRdv): Jour[] {
  const jours: Jour[] = [];
  const d = new Date();
  while (jours.length < 10) {
    d.setDate(d.getDate() + 1);
    if (d.getDay() === 0 || d.getDay() === 6) continue;
    const pas = type === 'telephone' ? 15 : 30;
    const [debut, fin] = type === 'telephone' ? [8 * 60 + 30, 18 * 60 + 15] : [9 * 60, 17 * 60];
    const creneaux: string[] = [];
    for (let m = debut; m <= fin; m += pas) {
      if ((m / pas + d.getDate()) % 3 === 0) continue; // quelques créneaux déjà pris
      creneaux.push(`${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`);
    }
    jours.push({ date: d.toISOString().slice(0, 10), creneaux });
  }
  return jours;
}

async function chargerJours(type: TypeRdv): Promise<Jour[]> {
  if (SIMULATION) {
    await new Promise(r => setTimeout(r, 400));
    return joursSimules(type);
  }
  const res = await fetch(`${URL_RENDEZ_VOUS}?type=${type}`);
  const donnees = await res.json();
  if (!donnees.ok) throw new Error(donnees.erreur);
  return donnees.jours;
}

// E-mail « Nouveau rendez-vous » sur contact@electricab.fr, envoyé par Web3Forms comme les formulaires :
// envoyé depuis le compte Google lui-même, il n'arriverait que dans « Messages envoyés ».
// Les noms des champs restent en français quelle que soit la langue du visiteur.
async function notifier(
  type: TypeRdv, date: string, heure: string, langue: Langue,
  c: { nom: string; telephone: string; email: string; adresseRdv: string; adresseChantier: string; motif: string },
) {
  if (SIMULATION) return;
  const jour = texteJour(date, 'fr');
  const libelle = type === 'telephone' ? 'téléphonique' : 'sur place';
  await envoyerEmail(`Nouveau rendez-vous ${libelle} depuis electricab.fr : ${jour} à ${heure} – ${c.nom}`, {
    'Type de rendez-vous': type === 'telephone' ? 'Par téléphone (15 min)' : 'Sur place (1 h, plus 15 min de trajet avant et après)',
    'Date du rendez-vous': `${jour} à ${heure}`,
    Nom: c.nom,
    Téléphone: c.telephone,
    Email: c.email,
    'Adresse du rendez-vous': c.adresseRdv,
    'Adresse du chantier': c.adresseChantier,
    Motif: c.motif,
    'Langue du visiteur': langue === 'en' ? 'anglais' : 'français',
    Agenda: 'Rendez-vous déjà enregistré dans votre agenda Google',
  });
}

// Réponse du programme Google : '' si tout va bien, sinon le code d'erreur ('pris', 'repetition'…)
async function reserver(demande: Record<string, string | boolean>): Promise<string> {
  if (SIMULATION) {
    await new Promise(r => setTimeout(r, 600));
    return '';
  }
  // Envoyé en text/plain : le navigateur n'a pas besoin de demander d'autorisation préalable à Google
  const res = await fetch(URL_RENDEZ_VOUS, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(demande) });
  const donnees = await res.json();
  return donnees.ok ? '' : String(donnees.erreur ?? 'autre');
}

export default function RendezVous({ langue = 'fr' }: { langue?: Langue }) {
  const T = TEXTES[langue];
  const id = useId();
  const dialogue = useRef<HTMLDialogElement>(null);

  const [type, setType] = useState<TypeRdv | null>(null);
  const [jours, setJours] = useState<Jour[]>([]);
  const [jour, setJour] = useState<Jour | null>(null);
  const [heure, setHeure] = useState<string | null>(null);
  const [etat, setEtat] = useState<Etat>('repos');
  const [erreur, setErreur] = useState('');
  const [emailDonne, setEmailDonne] = useState(false);

  const { telephone, setTelephone, changerTelephone } = useSaisieTelephone();
  const telRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    telRef.current?.setCustomValidity(telephoneValide(telephone) ? '' : T.telInvalide);
  }, [telephone, T, heure]);

  // Pas de défilement de la page derrière la fenêtre ouverte
  const [ouvert, setOuvert] = useState(false);
  useEffect(() => {
    if (!ouvert) return;
    const avant = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = avant; };
  }, [ouvert]);

  useEffect(() => {
    function surDemande(e: Event) {
      ouvrir();
      const type = (e as CustomEvent<TypeRdv | undefined>).detail;
      if (type) choisirType(type);
    }
    window.addEventListener(EVENEMENT_OUVRIR, surDemande);
    return () => window.removeEventListener(EVENEMENT_OUVRIR, surDemande);
  });

  if (!URL_RENDEZ_VOUS && !SIMULATION) return null;

  function ouvrir() {
    setType(null); setJours([]); setJour(null); setHeure(null); setEtat('repos'); setErreur(''); setTelephone('');
    dialogue.current?.showModal();
    setOuvert(true);
  }

  function fermer() {
    dialogue.current?.close();
  }

  async function choisirType(t: TypeRdv, garderJour?: string) {
    setType(t); setJour(null); setHeure(null); setErreur('');
    setEtat('chargement');
    try {
      const liste = await chargerJours(t);
      setJours(liste);
      if (garderJour) setJour(liste.find(j => j.date === garderJour) ?? null);
      setEtat('repos');
    } catch {
      setEtat('erreur');
    }
  }

  async function confirmer(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!type || !jour || !heure || etat === 'envoi') return;
    const form = new FormData(e.currentTarget);
    const champ = (nom: string) => String(form.get(nom) ?? '').trim();
    setEtat('envoi'); setErreur('');
    try {
      const code = await reserver({
        type, date: jour.date, heure, langue,
        nom: champ('nom'), telephone, email: champ('email'),
        adresseRdv: champ('adresseRdv'), adresseChantier: champ('adresseChantier'), motif: champ('motif'),
        botcheck: form.has(CHAMP_ANTI_ROBOT),
      });
      if (!code) {
        setEmailDonne(!!champ('email'));
        setEtat('confirme');
        // Le rendez-vous est déjà dans l'agenda : la notification par e-mail ne doit pas bloquer le visiteur
        notifier(type, jour.date, heure, langue, {
          nom: champ('nom'), telephone, email: champ('email'),
          adresseRdv: champ('adresseRdv'), adresseChantier: champ('adresseChantier'), motif: champ('motif'),
        }).catch(() => { /* e-mail non envoyé : le rendez-vous reste dans l'agenda */ });
      } else if (code === 'pris') {
        await choisirType(type, jour.date);
        setErreur(T.erreurs.pris);
      } else {
        setErreur(code === 'repetition' ? T.erreurs.repetition : T.erreurs.autre);
        setEtat('repos');
      }
    } catch {
      setErreur(T.erreurs.autre);
      setEtat('repos');
    }
  }

  const types: { code: TypeRdv; libelle: string; duree: string; Icone: typeof Phone }[] = [
    { code: 'telephone', libelle: T.telephone, duree: T.telephoneDuree, Icone: Phone },
    { code: 'surplace', libelle: T.surplace, duree: T.surplaceDuree, Icone: MapPin },
  ];
  const large = !!type && etat !== 'confirme';

  return (
    <>
      <div className="p-8 border border-brand/30 bg-bg-card">
        <h4 className="font-accroche font-semibold text-brand text-lg mb-3">{T.carteTitre}</h4>
        <p className="text-sm text-slate-600 leading-relaxed mb-6">{T.carteTexte}</p>
        <button
          type="button" onClick={ouvrir}
          className="w-full inline-flex items-center justify-center gap-3 bg-brand hover:bg-brand-dark active:bg-brand-dark text-white font-bold px-6 py-4 uppercase tracking-widest text-xs transition-colors"
        >
          <CalendarCheck size={18} aria-hidden="true" /> {T.bouton}
        </button>
      </div>

      <dialog
        ref={dialogue}
        aria-labelledby={`${id}-titre`}
        onClose={() => setOuvert(false)}
        onClick={e => { if (e.target === dialogue.current) fermer(); }}
        className={`m-auto w-[calc(100%-2rem)] ${large ? 'max-w-2xl' : 'max-w-md'} max-h-[90vh] overflow-y-auto p-0 bg-bg-main text-ink border border-slate-200 shadow-[0_0_60px_rgba(37,99,235,0.15)] backdrop:bg-ink/60 backdrop:backdrop-blur-sm transition-[max-width] duration-300`}
      >
        <div className="relative p-6 sm:p-8">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-[1px] bg-gradient-to-r from-transparent via-brand to-transparent"></div>
          <div className="flex items-start justify-between gap-4 mb-6">
            <h2 id={`${id}-titre`} className="text-xl md:text-2xl leading-tight font-display text-ink">{T.titre}</h2>
            <button type="button" onClick={fermer} aria-label={T.fermer} className="text-slate-500 hover:text-ink p-1 -m-1 transition-colors">
              <X size={22} />
            </button>
          </div>

          {etat === 'confirme' && type && jour && heure ? (
            <div className="text-center py-4">
              <CalendarCheck size={44} strokeWidth={1.5} className="text-brand mx-auto mb-5" aria-hidden="true" />
              <h3 className="text-2xl font-accroche font-semibold text-ink mb-3">{T.confirmeTitre}</h3>
              <p className="text-brand font-medium mb-4">{T.recap(type, texteJour(jour.date, langue), heure)}</p>
              {type === 'telephone' && <p className="text-sm text-slate-600 mb-2">{T.confirmeAppel}</p>}
              <p className="text-sm text-slate-600">{emailDonne ? T.confirmeEmail : T.confirmeSansEmail}</p>
              <button type="button" onClick={fermer} className="mt-8 bg-brand hover:bg-brand-dark text-white font-bold px-10 py-3 uppercase tracking-widest text-xs transition-colors">
                {T.fermer}
              </button>
            </div>
          ) : (
            <>
              {/* 1. Type de rendez-vous */}
              <p className="text-sm font-medium text-ink mb-3">{T.question}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {types.map(({ code, libelle, duree, Icone }) => (
                  <button
                    key={code} type="button" aria-pressed={type === code}
                    onClick={() => choisirType(code)}
                    className={`${CLASSE_CHOIX} ${type === code ? CLASSE_CHOIX_ACTIF : CLASSE_CHOIX_INACTIF} flex items-center gap-3 px-4 py-4 text-left`}
                  >
                    <Icone size={22} strokeWidth={1.5} aria-hidden="true" className="shrink-0" />
                    <span>
                      <span className="block font-accroche font-semibold leading-snug">{libelle}</span>
                      <span className={`block text-xs mt-0.5 ${type === code ? 'text-white/80' : 'text-slate-500'}`}>{duree}</span>
                    </span>
                  </button>
                ))}
              </div>

              <div aria-live="polite">
                {etat === 'chargement' && <p className="mt-6 text-sm text-slate-600">{T.chargement}</p>}
                {etat === 'erreur' && (
                  <div className="mt-6 text-sm text-red-800 border border-red-600/30 bg-red-50 px-4 py-3">
                    {T.erreurChargement}{' '}
                    <button type="button" onClick={() => type && choisirType(type)} className="underline underline-offset-2 font-medium">{T.reessayer}</button>
                  </div>
                )}
                {erreur && <p className="mt-6 text-sm text-red-800 border border-red-600/30 bg-red-50 px-4 py-3">{erreur}</p>}
              </div>

              {/* 2. Jour : les 10 prochains jours ouvrables avec au moins un créneau libre */}
              {type && etat !== 'chargement' && etat !== 'erreur' && !jour && (
                <div className="mt-8">
                  <p className="text-sm font-medium text-ink mb-3">{T.choixJour}</p>
                  {jours.length === 0 ? (
                    <p className="text-sm text-slate-600">{T.aucunJour}</p>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                      {jours.map(j => (
                        <button
                          key={j.date} type="button" onClick={() => { setJour(j); setHeure(null); setErreur(''); }}
                          className={`${CLASSE_CHOIX} ${CLASSE_CHOIX_INACTIF} px-2 py-3 text-sm first-letter:uppercase`}
                        >
                          {texteJour(j.date, langue, true)}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* 3. Heure : seul le jour choisi reste affiché */}
              {type && jour && etat !== 'chargement' && (
                <div className="mt-8">
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                    <span className={`${CLASSE_CHOIX} ${CLASSE_CHOIX_ACTIF} inline-block px-4 py-2 text-sm first-letter:uppercase`}>{texteJour(jour.date, langue)}</span>
                    <button type="button" onClick={() => { setJour(null); setHeure(null); setErreur(''); }} className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-slate-600 hover:text-brand transition-colors">
                      <ChevronLeft size={16} aria-hidden="true" /> {T.changerJour}
                    </button>
                  </div>
                  {!heure && (
                    <>
                      <p className="text-sm font-medium text-ink mb-3">{T.choixHeure}</p>
                      <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                        {jour.creneaux.map(h => (
                          <button
                            key={h} type="button" onClick={() => { setHeure(h); setErreur(''); }}
                            className={`${CLASSE_CHOIX} ${CLASSE_CHOIX_INACTIF} py-2 text-sm tabular-nums`}
                          >
                            {h}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* 4. Coordonnées et confirmation */}
              {type && jour && heure && etat !== 'chargement' && (
                <form className="mt-6" onSubmit={confirmer} onKeyDown={bloquerEntree}>
                  <ChampAntiRobot />
                  <div className="flex flex-wrap items-center justify-between gap-3 border-l-2 border-brand pl-4 py-1 mb-6">
                    <p className="text-brand font-medium">{T.recap(type, texteJour(jour.date, langue), heure)}</p>
                    <button type="button" onClick={() => setHeure(null)} className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-slate-600 hover:text-brand transition-colors">
                      <ChevronLeft size={16} aria-hidden="true" /> {T.changerHeure}
                    </button>
                  </div>

                  <h3 className="font-accroche font-semibold text-lg text-ink mb-4">{T.coordonnees}</h3>
                  <div className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label htmlFor={`${id}-nom`} className={CLASSE_LABEL}>{T.nom}</label>
                        <input id={`${id}-nom`} name="nom" type="text" autoComplete="name" required maxLength={200} className={CLASSE_CHAMP} />
                      </div>
                      <div>
                        <label htmlFor={`${id}-tel`} className={CLASSE_LABEL}>{T.tel}</label>
                        <input
                          id={`${id}-tel`} ref={telRef} type="tel" autoComplete="tel" required
                          value={telephone} onChange={changerTelephone} placeholder={T.telExemple} className={CLASSE_CHAMP}
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor={`${id}-email`} className={CLASSE_LABEL}>{T.email}</label>
                      <input id={`${id}-email`} name="email" type="email" autoComplete="email" pattern={EMAIL_PATTERN} maxLength={200} className={CLASSE_CHAMP} />
                      <p className="text-xs text-slate-500 mt-1.5">{T.emailAide}</p>
                    </div>
                    {type === 'surplace' && (
                      <div>
                        <label htmlFor={`${id}-adresse`} className={CLASSE_LABEL}>{T.adresseRdv}</label>
                        <input id={`${id}-adresse`} name="adresseRdv" type="text" autoComplete="street-address" required maxLength={200} className={CLASSE_CHAMP} />
                      </div>
                    )}
                    <div>
                      <label htmlFor={`${id}-chantier`} className={CLASSE_LABEL}>{T.adresseChantier}</label>
                      <input id={`${id}-chantier`} name="adresseChantier" type="text" maxLength={200} className={CLASSE_CHAMP} />
                      {type === 'surplace' && <p className="text-xs text-slate-500 mt-1.5">{T.adresseChantierAide}</p>}
                    </div>
                    <div>
                      <label htmlFor={`${id}-motif`} className={CLASSE_LABEL}>{T.motif}</label>
                      <textarea id={`${id}-motif`} name="motif" rows={3} maxLength={1000} placeholder={T.motifExemple} className={`${CLASSE_CHAMP} resize-none`}></textarea>
                    </div>
                  </div>

                  <button
                    type="submit" disabled={etat === 'envoi'}
                    className="mt-6 w-full bg-brand hover:bg-brand-dark active:bg-brand-dark disabled:opacity-60 disabled:cursor-wait text-white font-bold px-8 py-4 uppercase tracking-[0.2em] text-xs transition-colors"
                  >
                    {etat === 'envoi' ? T.envoi : T.confirmer}
                  </button>
                  <p className="mt-4 text-xs text-slate-600">{T.obligatoires}</p>
                  <p className="mt-1 text-xs text-slate-600">
                    {T.confidentialiteAvant}<LienLangue to="/politique-de-confidentialite" onClick={fermer} className="text-brand hover:text-brand-dark underline underline-offset-2">{T.confidentialiteLien}</LienLangue>{T.confidentialiteApres}
                  </p>
                </form>
              )}
            </>
          )}
        </div>
      </dialog>
    </>
  );
}
