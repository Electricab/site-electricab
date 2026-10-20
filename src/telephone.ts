import { useState, type ChangeEvent } from 'react';

// Mise en forme et vérification des numéros de téléphone saisis dans les formulaires.
//   Français  : "06 16 26 70 91" (+33… et 0033… sont convertis en 0…)
//   Étranger  : "+44 20 12 34 56 78" (+ indicatif, puis chiffres par paires ; 00… vaut +…)

// Indicatifs pays à 2 chiffres. Les indicatifs 1 et 7 en ont 1, tous les autres 3.
// Aucun indicatif n'est le début d'un autre, d'où cette règle simple.
const INDICATIFS_2_CHIFFRES = new Set(
  '20 27 30 31 32 33 34 36 39 40 41 43 44 45 46 47 48 49 51 52 53 54 55 56 57 58 60 61 62 63 64 65 66 81 82 84 86 90 91 92 93 94 95 98'.split(' ')
);

function longueurIndicatif(chiffres: string): number {
  if (chiffres[0] === '1' || chiffres[0] === '7') return 1;
  return INDICATIFS_2_CHIFFRES.has(chiffres.slice(0, 2)) ? 2 : 3;
}

const parPaires = (chiffres: string) => chiffres.match(/.{1,2}/g)?.join(' ') ?? '';

// Caractères qui comptent dans un numéro (les séparateurs sont ignorés)
export const significatifs = (s: string) => s.replace(/[^\d+]/g, '');

export function formatTelephone(saisie: string): string {
  const v = saisie.trim();
  const international = v.match(/^(?:\+|00)(.*)$/);
  if (international) {
    const chiffres = international[1].replace(/\D/g, '');
    if (chiffres.startsWith('33')) return parPaires(('0' + chiffres.slice(2).replace(/^0/, '')).slice(0, 10));
    const n = Math.min(longueurIndicatif(chiffres), chiffres.length);
    const reste = chiffres.slice(n, 15); // 15 chiffres au plus, indicatif compris (norme E.164)
    return '+' + chiffres.slice(0, n) + (reste ? ' ' + parPaires(reste) : '');
  }
  if (v.startsWith('0')) return parPaires(v.replace(/\D/g, '').slice(0, 10));
  return saisie;
}

// Vérification après suppression des espaces, tirets et points. Un champ vide est accepté.
export function telephoneValide(saisie: string): boolean {
  const s = saisie.replace(/[\s.\-]/g, '');
  return s === '' || /^0[1-9]\d{8}$/.test(s) || /^\+[1-9]\d{6,14}$/.test(s);
}

// Position dans le texte mis en forme juste après le k-ième caractère significatif,
// pour que le curseur reste à côté du chiffre que l'on vient de modifier.
// Après un effacement, le curseur passe l'espace qui suit, là où se trouvait le chiffre effacé.
export function positionApres(formate: string, k: number, apresEffacement = false): number {
  let pos = formate.length;
  if (k <= 0) pos = 0;
  else {
    let vus = 0;
    for (let i = 0; i < formate.length; i++) {
      if (/[\d+]/.test(formate[i]) && ++vus === k) { pos = i + 1; break; }
    }
  }
  if (apresEffacement) while (formate[pos] === ' ' && pos + 1 < formate.length) pos++;
  return pos;
}

// Effacer un espace seul serait annulé par la remise en forme : on efface alors
// le chiffre voisin, comme si l'espace n'existait pas.
export function effacerChiffreVoisin(brut: string, pos: number, versLaGauche: boolean): { brut: string; pos: number } {
  if (versLaGauche) {
    for (let i = pos - 1; i >= 0; i--) if (/[\d+]/.test(brut[i])) return { brut: brut.slice(0, i) + brut.slice(i + 1), pos: i };
  } else {
    for (let i = pos; i < brut.length; i++) if (/[\d+]/.test(brut[i])) return { brut: brut.slice(0, i) + brut.slice(i + 1), pos };
  }
  return { brut, pos };
}

// Champ téléphone mis en forme à chaque frappe, en gardant le curseur à côté du chiffre modifié
// (utilisé par le formulaire de contact et par la prise de rendez-vous)
export function useSaisieTelephone() {
  const [telephone, setTelephone] = useState('');
  function changerTelephone(e: ChangeEvent<HTMLInputElement>) {
    const champ = e.target;
    let brut = champ.value;
    let pos = champ.selectionStart ?? brut.length;
    const typeSaisie = (e.nativeEvent as InputEvent).inputType;
    const effacement = typeSaisie === 'deleteContentBackward' || typeSaisie === 'deleteContentForward';
    if (effacement && significatifs(brut) === significatifs(telephone)) {
      ({ brut, pos } = effacerChiffreVoisin(brut, pos, typeSaisie === 'deleteContentBackward'));
    }
    const formate = formatTelephone(brut);
    const curseur = pos >= brut.length ? formate.length : positionApres(formate, significatifs(brut.slice(0, pos)).length, effacement);
    setTelephone(formate);
    requestAnimationFrame(() => champ.setSelectionRange(curseur, curseur));
  }
  return { telephone, setTelephone, changerTelephone };
}
