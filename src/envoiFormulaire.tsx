import { useState, type FormEvent, type KeyboardEvent } from 'react';

// Envoi des formulaires par Web3Forms (https://web3forms.com) : chaque demande arrive
// par e-mail sur contact@electricab.fr. La clé d'accès est publique par conception
// (elle permet seulement d'envoyer vers cette adresse), elle peut donc rester dans le code.
const WEB3FORMS_URL = 'https://api.web3forms.com/submit';
const WEB3FORMS_CLE = 'baa30148-33a5-40e2-abe1-336d35a947ae';
const DELAI_MAX_MS = 15000;

// Champ piège invisible : un humain ne le coche jamais, un robot si (filtré par Web3Forms)
export const CHAMP_ANTI_ROBOT = 'botcheck';
// Texte affiché dans l'e-mail pour un champ laissé vide (tous les champs sont toujours envoyés)
const CHAMP_VIDE = '(non renseigné)';

// Date et heure de la demande, à l'heure française quel que soit le pays du visiteur : « 20-octobre-2026 à 14:32 »
function dateDemande(): string {
  const parties = Object.fromEntries(
    new Intl.DateTimeFormat('fr-FR', {
      timeZone: 'Europe/Paris', day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
    }).formatToParts(new Date()).map(p => [p.type, p.value]),
  );
  return `${parties.day}-${parties.month}-${parties.year} à ${parties.hour}:${parties.minute}`;
}

async function envoyer(sujet: string, form: HTMLFormElement): Promise<void> {
  const formData = new FormData(form);
  const champs: Record<string, string> = {};
  for (const [cle, valeur] of formData) {
    if (cle !== CHAMP_ANTI_ROBOT && typeof valeur === 'string') champs[cle] = valeur;
  }
  // « {nom} » dans l'objet est remplacé par le nom saisi par le visiteur
  const nom = String(formData.get('Nom') ?? '').trim() || '(sans nom)';
  await envoyerEmail(sujet.replace('{nom}', nom), champs, formData.has(CHAMP_ANTI_ROBOT));
}

// Envoie un e-mail sur contact@electricab.fr avec les champs donnés, dans l'ordre (« nom du champ : valeur »).
// Sert aux formulaires et à la notification de rendez-vous. « Email » est l'adresse du visiteur, pour « Répondre ».
export async function envoyerEmail(sujet: string, champs: Record<string, string>, robot = false): Promise<void> {
  const donnees: Record<string, string | boolean> = {
    access_key: WEB3FORMS_CLE,
    subject: sujet,
    from_name: 'Site Electricab',
    // Première ligne des informations de l'e-mail reçu : « Demande du : 20-octobre-2026 à 14:32 »
    'Demande du': dateDemande(),
  };
  for (const [cle, valeur] of Object.entries(champs)) donnees[cle] = valeur.trim() || CHAMP_VIDE;
  // « Répondre » dans l'e-mail reçu écrit directement au visiteur, s'il a donné son adresse
  const emailVisiteur = (champs.Email ?? '').trim();
  if (emailVisiteur) donnees.replyto = emailVisiteur;
  donnees[CHAMP_ANTI_ROBOT] = robot;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), DELAI_MAX_MS);
  try {
    const res = await fetch(WEB3FORMS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(donnees),
      signal: controller.signal,
    });
    const reponse = await res.json().catch(() => null);
    if (!res.ok || !reponse?.success) throw new Error(reponse?.message ?? `Erreur ${res.status}`);
  } finally {
    clearTimeout(timeout);
  }
}

export type EtatEnvoi = 'repos' | 'envoi' | 'envoye' | 'erreur';

// Gère l'envoi d'un formulaire : pas de rechargement de page, champs vidés seulement si l'envoi a réussi.
// `apresEnvoi` remet à zéro les champs gérés par React (téléphone, code postal…).
export function useEnvoiFormulaire(sujet: string, apresEnvoi?: () => void) {
  const [etat, setEtat] = useState<EtatEnvoi>('repos');

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (etat === 'envoi') return;
    const form = e.currentTarget;
    setEtat('envoi');
    try {
      await envoyer(sujet, form);
      form.reset();
      apresEnvoi?.();
      setEtat('envoye');
    } catch {
      setEtat('erreur');
    }
  }

  return { etat, onSubmit };
}

// Entrée dans un champ ne doit pas envoyer le formulaire (sauf retour à la ligne dans un message)
export function bloquerEntree(e: KeyboardEvent<HTMLFormElement>) {
  if (e.key === 'Enter' && e.target instanceof HTMLInputElement) e.preventDefault();
}

export function ChampAntiRobot() {
  return <input type="checkbox" name={CHAMP_ANTI_ROBOT} tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />;
}

const MESSAGES = {
  fr: {
    envoye: 'Merci, votre demande a bien été envoyée. Je vous réponds au plus vite.',
    erreur: 'L’envoi n’a pas abouti. Réessayez dans un instant, ou contactez-moi directement au 06 16 26 70 91 ou à contact@electricab.fr.',
  },
  en: {
    envoye: "Thank you, your request has been sent. I'll get back to you as soon as possible.",
    erreur: 'Sending failed. Please try again in a moment, or contact me directly on +33 6 16 26 70 91 or at contact@electricab.fr.',
  },
};

export function MessageEnvoi({ etat, langue = 'fr' }: { etat: EtatEnvoi; langue?: 'fr' | 'en' }) {
  return (
    <div aria-live="polite" className="empty:hidden">
      {etat === 'envoye' && (
        <p className="border border-green-600/30 bg-green-50 text-green-800 px-5 py-4 text-sm">
          {MESSAGES[langue].envoye}
        </p>
      )}
      {etat === 'erreur' && (
        <p className="border border-red-600/30 bg-red-50 text-red-800 px-5 py-4 text-sm">
          {MESSAGES[langue].erreur}
        </p>
      )}
    </div>
  );
}
