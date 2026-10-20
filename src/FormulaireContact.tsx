import { useEffect, useId, useRef, useState } from 'react';
import { LienLangue, type Langue } from './langue';
import { ArrowLeft } from 'lucide-react';
import { telephoneValide, useSaisieTelephone } from './telephone';
import { bloquerEntree, ChampAntiRobot, MessageEnvoi, useEnvoiFormulaire } from './envoiFormulaire';

// Formulaire de demande commun à toutes les pages (accueil et Contact) : un seul endroit à modifier.

// Format imposé à l'e-mail (attribut HTML pattern, vérifié par le navigateur à l'envoi)
const EMAIL_PATTERN = String.raw`[^@\s]+@[^@\s]+\.[a-zA-Z]{2,}`;

// Textes du formulaire en français et en anglais (la version anglaise sert à la page Contact en anglais).
// Les noms des champs envoyés par e-mail (name="Nom"…) restent en français, pour que les demandes reçues soient homogènes.
// En français, «   » est une espace insécable : elle empêche « : ; ? ! » de passer seuls à la ligne.
const TEXTES = {
  fr: {
    aucunContact: 'Indiquez au moins un e-mail ou un numéro de téléphone pour que je puisse vous recontacter.',
    telInvalide: 'Numéro invalide : 10 chiffres pour un numéro français (06 00 00 00 00), ou + et indicatif pour un numéro étranger (+44 20 12 34 56 78).',
    nom: 'Votre nom *', nomExemple: 'Théo Courant',
    email: 'E-mail', emailExemple: 'theo@exemple.fr', emailAide: 'Adresse e-mail complète, par exemple theo@exemple.fr',
    tel: 'Téléphone', telExemple: '06 00 00 00 00',
    codePostal: 'Code postal', codePostalAide: '5 chiffres',
    commune: 'Commune *', rechercheCommune: 'Recherche de la commune…', choixCommune: 'Plusieurs communes correspondent, choisissez la vôtre :',
    message: 'Votre demande *', messageExemple: 'Décrivez votre projet (rénovation, installation neuve, domotique, mise aux normes, dépannage…)',
    date: 'Objectif de date de réalisation', dateExemple: 'Par exemple : dès que possible, avant l’été, d’ici fin mars…',
    retour: 'Retour', envoyer: 'Envoyer', envoiEnCours: 'Envoi en cours…',
    obligatoires: 'Les champs marqués d’un * sont obligatoires. Indiquez au moins un moyen de vous recontacter : e-mail ou téléphone.',
    usage: 'Nous utilisons ces informations uniquement pour vous répondre.',
    confidentialiteAvant: 'Pour en savoir plus sur l’utilisation de vos données et vos droits, consultez notre ',
    confidentialiteLien: 'politique de confidentialité', confidentialiteApres: '.',
  },
  en: {
    aucunContact: 'Please provide at least an email address or a phone number so I can get back to you.',
    telInvalide: 'Invalid number: 10 digits for a French number (06 00 00 00 00), or + and country code for an international number (+44 20 12 34 56 78).',
    nom: 'Your name *', nomExemple: 'John Smith',
    email: 'Email', emailExemple: 'john@example.com', emailAide: 'Full email address, e.g. john@example.com',
    tel: 'Phone', telExemple: '+44 20 12 34 56 78',
    codePostal: 'Postcode (France)', codePostalAide: '5 digits',
    commune: 'Town *', rechercheCommune: 'Looking up the town…', choixCommune: 'Several towns match this postcode, please choose yours:',
    message: 'Your request *', messageExemple: 'Describe your project (renovation, new installation, home automation, compliance upgrade, repairs…)',
    date: 'Target completion date', dateExemple: 'For example: as soon as possible, before summer, by the end of March…',
    retour: 'Back', envoyer: 'Send', envoiEnCours: 'Sending…',
    obligatoires: 'Fields marked with * are required. Please provide at least one way to contact you: email or phone.',
    usage: 'We use this information solely to reply to you.',
    confidentialiteAvant: 'To learn more about how your data is used and your rights, see our ',
    confidentialiteLien: 'privacy policy', confidentialiteApres: '.',
  },
};

const CLASSE_LABEL = 'block text-[10px] font-bold uppercase tracking-[0.2em] text-brand mb-3';
const CLASSE_CHAMP = 'w-full bg-bg-main border border-slate-200 px-5 py-4 text-ink focus:outline-none focus:border-brand/50 user-invalid:border-red-500 transition-colors placeholder:text-slate-400';

// Communes correspondant à un code postal (API officielle geo.api.gouv.fr).
// En cas d'échec, on renvoie une liste vide : la commune reste en saisie libre.
async function fetchCommunes(codePostal: string, signal: AbortSignal): Promise<string[]> {
  const res = await fetch(`https://geo.api.gouv.fr/communes?codePostal=${codePostal}&fields=nom`, { signal });
  if (!res.ok) return [];
  const data: { nom: string }[] = await res.json();
  return [...new Set(data.map(c => c.nom))].sort((a, b) => a.localeCompare(b, 'fr'));
}

type Props = {
  sujet: string;          // objet de l'e-mail reçu, pour savoir de quelle page vient la demande
  lienRetour?: boolean;   // lien « Retour » vers l'accueil à côté du bouton
  langue?: Langue;        // langue des textes affichés (français par défaut)
  dateRealisation?: boolean; // question « Objectif de date de réalisation » (formulaire de devis de l'accueil)
};

export default function FormulaireContact({ sujet, lienRetour = false, langue = 'fr', dateRealisation = false }: Props) {
  const id = useId();
  const T = TEXTES[langue];

  const [email, setEmail] = useState('');
  const emailRef = useRef<HTMLInputElement>(null);
  const { telephone, setTelephone, changerTelephone } = useSaisieTelephone();
  const telRef = useRef<HTMLInputElement>(null);

  // Vérifications affichées par le navigateur à l'envoi :
  // numéro valide (séparateurs ignorés), et au moins un moyen de recontacter (e-mail ou téléphone)
  useEffect(() => {
    telRef.current?.setCustomValidity(telephoneValide(telephone) ? '' : T.telInvalide);
    emailRef.current?.setCustomValidity(email.trim() || telephone.trim() ? '' : T.aucunContact);
  }, [email, telephone, T]);

  const [codePostal, setCodePostal] = useState('');
  const [commune, setCommune] = useState('');
  const [choixCommunes, setChoixCommunes] = useState<string[]>([]);
  const [recherche, setRecherche] = useState(false);

  useEffect(() => {
    setChoixCommunes([]);
    if (codePostal.length !== 5) return;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    setRecherche(true);
    fetchCommunes(codePostal, controller.signal)
      .then(noms => {
        if (noms.length === 1) setCommune(noms[0]);
        else if (noms.length > 1) setChoixCommunes(noms);
      })
      .catch(() => { /* API indisponible : saisie libre */ })
      .finally(() => { clearTimeout(timeout); setRecherche(false); });

    return () => { clearTimeout(timeout); controller.abort(); };
  }, [codePostal]);

  const { etat, onSubmit } = useEnvoiFormulaire(sujet, () => {
    setEmail('');
    setTelephone('');
    setCodePostal('');
    setCommune('');
  });

  return (
    <>
      <form className="space-y-8" onSubmit={onSubmit} onKeyDown={bloquerEntree}>
        <ChampAntiRobot />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label htmlFor={`${id}-nom`} className={CLASSE_LABEL}>{T.nom}</label>
            <input id={`${id}-nom`} type="text" name="Nom" autoComplete="name" required placeholder={T.nomExemple} className={CLASSE_CHAMP} />
          </div>
          <div>
            <label htmlFor={`${id}-email`} className={CLASSE_LABEL}>{T.email}</label>
            <input
              id={`${id}-email`} ref={emailRef} type="email" name="Email" autoComplete="email"
              value={email} onChange={e => setEmail(e.target.value)}
              pattern={EMAIL_PATTERN} title={T.emailAide}
              placeholder={T.emailExemple} className={CLASSE_CHAMP}
            />
          </div>
        </div>
        <div>
          <label htmlFor={`${id}-tel`} className={CLASSE_LABEL}>{T.tel}</label>
          <input
            id={`${id}-tel`} ref={telRef} type="tel" name="Téléphone" autoComplete="tel"
            value={telephone} onChange={changerTelephone}
            placeholder={T.telExemple} className={CLASSE_CHAMP}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label htmlFor={`${id}-cp`} className={CLASSE_LABEL}>{T.codePostal}</label>
            <input
              id={`${id}-cp`} name="Code postal" type="text" inputMode="numeric" autoComplete="postal-code"
              maxLength={5} pattern="[0-9]{5}" title={T.codePostalAide} placeholder="60300"
              value={codePostal}
              onChange={e => setCodePostal(e.target.value.replace(/\D/g, '').slice(0, 5))}
              className={CLASSE_CHAMP}
            />
          </div>
          <div>
            <label htmlFor={`${id}-commune`} className={CLASSE_LABEL}>{T.commune}</label>
            <input
              id={`${id}-commune`} name="Commune" type="text" autoComplete="address-level2" required
              value={commune}
              onChange={e => setCommune(e.target.value)}
              className={CLASSE_CHAMP}
            />
            <div aria-live="polite" className="text-xs text-slate-600 mt-2 empty:hidden">
              {recherche && T.rechercheCommune}
              {!recherche && choixCommunes.length > 1 && T.choixCommune}
            </div>
            {choixCommunes.length > 1 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {choixCommunes.map(nom => (
                  <button
                    key={nom} type="button"
                    onClick={() => { setCommune(nom); setChoixCommunes([]); }}
                    className="border border-slate-300 hover:border-brand hover:text-brand text-ink text-sm px-3 py-1.5 transition-colors"
                  >
                    {nom}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        <div>
          <label htmlFor={`${id}-message`} className={CLASSE_LABEL}>{T.message}</label>
          <textarea
            id={`${id}-message`} name="Message" rows={6} required
            placeholder={T.messageExemple}
            className={`${CLASSE_CHAMP} resize-none`}
          ></textarea>
        </div>
        {dateRealisation && (
          <div>
            <label htmlFor={`${id}-date`} className={CLASSE_LABEL}>{T.date}</label>
            <input
              id={`${id}-date`} type="text" name="Objectif de date de réalisation"
              placeholder={T.dateExemple} className={CLASSE_CHAMP}
            />
          </div>
        )}

        <div className={`pt-4 flex items-center flex-wrap gap-6 ${lienRetour ? 'justify-between' : 'justify-center'}`}>
          {lienRetour && (
            <LienLangue to="/" className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-slate-600 hover:text-ink transition-colors pb-1 border-b border-transparent hover:border-slate-400">
              <ArrowLeft size={16} className="mr-2" /> {T.retour}
            </LienLangue>
          )}
          <button type="submit" disabled={etat === 'envoi'} className="bg-brand hover:bg-brand-dark active:bg-brand-dark disabled:opacity-60 disabled:cursor-wait text-white font-bold px-12 py-4 uppercase tracking-[0.2em] text-xs transition-colors shadow-[0_0_20px_rgba(37,99,235,0.15)] hover:shadow-[0_0_30px_rgba(37,99,235,0.3)]">
            {etat === 'envoi' ? T.envoiEnCours : T.envoyer}
          </button>
        </div>
        <MessageEnvoi etat={etat} langue={langue} />
      </form>
      <p className="mt-8 text-sm text-slate-600">{T.obligatoires}</p>
      <p className="mt-2 text-sm text-slate-600">{T.usage}</p>
      <p className="mt-2 text-sm text-slate-600">
        {T.confidentialiteAvant}<LienLangue to="/politique-de-confidentialite" className="text-brand hover:text-brand-dark underline underline-offset-2 transition-colors">{T.confidentialiteLien}</LienLangue>{T.confidentialiteApres}
      </p>
    </>
  );
}
