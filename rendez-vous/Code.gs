/**
 * Prise de rendez-vous du site electricab.fr
 *
 * Ce programme tourne dans le compte Google de Charles-Antoine (Google Apps Script).
 * Il est le seul à lire l'agenda : le site ne reçoit QUE des heures libres,
 * jamais le titre, le lieu ni les participants des rendez-vous existants.
 *
 *   GET  ?type=telephone|surplace   → les 10 prochains jours ouvrables avec au moins un créneau libre
 *   POST { type, date, heure, nom, telephone, ... } → crée le rendez-vous, vous envoie un e-mail,
 *                                                     envoie une confirmation + invitation au visiteur
 *
 * Installation : voir rendez-vous/LISEZ-MOI.md
 */

const CONFIG = {
  // Adresse à laquelle le visiteur répond depuis son e-mail de confirmation
  emailNotification: 'contact@electricab.fr',
  // Plage de travail, trajets compris, du lundi au vendredi
  debutJournee: '08:30',
  finJournee: '18:30',
  // Nombre de jours proposés, et jusqu'où chercher (en jours) si l'agenda est très rempli
  nombreDeJours: 10,
  horizonMaxJours: 60,
  types: {
    // Rendez-vous téléphonique : 15 min, proposé toutes les 15 min
    telephone: { duree: 15, pas: 15, trajetAvant: 0, trajetApres: 0 },
    // Rendez-vous sur place : 1 h 30 au total = 15 min de trajet + 1 h sur place + 15 min de trajet,
    // proposé toutes les 30 min (l'heure proposée est l'heure d'arrivée)
    surplace: { duree: 60, pas: 30, trajetAvant: 15, trajetApres: 15 },
  },
  // Protection contre les envois répétés : une réservation par numéro de téléphone toutes les 2 minutes
  delaiEntreReservationsSecondes: 120,
};

const LIBELLES = {
  fr: { telephone: 'Rendez-vous téléphonique', surplace: 'Rendez-vous sur place' },
  en: { telephone: 'Phone appointment', surplace: 'On-site appointment' },
};

// ---------------------------------------------------------------------------
// Points d'entrée appelés par le site
// ---------------------------------------------------------------------------

function doGet(e) {
  try {
    const type = (e && e.parameter && e.parameter.type) || '';
    if (!CONFIG.types[type]) return reponse({ ok: false, erreur: 'type' });
    return reponse({ ok: true, jours: joursDisponibles(type) });
  } catch (err) {
    console.error(err);
    return reponse({ ok: false, erreur: 'serveur' });
  }
}

function doPost(e) {
  let demande;
  try {
    demande = JSON.parse(e.postData.contents);
  } catch (err) {
    return reponse({ ok: false, erreur: 'donnees' });
  }

  // Champ piège invisible : rempli uniquement par les robots
  if (demande.botcheck) return reponse({ ok: true });

  const erreur = verifier(demande);
  if (erreur) return reponse({ ok: false, erreur: erreur });

  // Envois répétés depuis le même numéro
  const cache = CacheService.getScriptCache();
  const cle = 'tel-' + demande.telephone.replace(/\D/g, '');
  if (cache.get(cle)) return reponse({ ok: false, erreur: 'repetition' });

  // Un seul rendez-vous créé à la fois : deux personnes ne peuvent pas prendre le même créneau
  const verrou = LockService.getScriptLock();
  if (!verrou.tryLock(15000)) return reponse({ ok: false, erreur: 'occupe' });
  try {
    const libres = creneauxDuJour(demande.type, dateDepuisIso(demande.date), evenementsOccupes());
    if (libres.indexOf(demande.heure) === -1) return reponse({ ok: false, erreur: 'pris' });
    creerRendezVous(demande);
    cache.put(cle, '1', CONFIG.delaiEntreReservationsSecondes);
  } finally {
    verrou.releaseLock();
  }

  try {
    envoyerEmails(demande);
  } catch (err) {
    console.error(err); // le rendez-vous est déjà dans l'agenda : on ne bloque pas le visiteur
  }
  return reponse({ ok: true });
}

function reponse(objet) {
  return ContentService.createTextOutput(JSON.stringify(objet)).setMimeType(ContentService.MimeType.JSON);
}

// ---------------------------------------------------------------------------
// Calcul des créneaux libres
// ---------------------------------------------------------------------------

function joursDisponibles(type) {
  const occupes = evenementsOccupes();
  const jours = [];
  const jour = aujourdhui();
  for (let i = 1; i <= CONFIG.horizonMaxJours && jours.length < CONFIG.nombreDeJours; i++) {
    jour.setDate(jour.getDate() + 1);
    const jourSemaine = jour.getDay();
    if (jourSemaine === 0 || jourSemaine === 6) continue; // samedi, dimanche
    const creneaux = creneauxDuJour(type, jour, occupes);
    if (creneaux.length) jours.push({ date: isoDepuisDate(jour), creneaux: creneaux });
  }
  return jours;
}

// Heures libres d'une journée pour un type de rendez-vous, au format "HH:MM"
function creneauxDuJour(type, jour, occupes) {
  const t = CONFIG.types[type];
  const debut = minutes(CONFIG.debutJournee);
  const fin = minutes(CONFIG.finJournee);
  const resultat = [];
  // Heures proposées alignées sur le début de journée (8:30, 8:45… ou 8:30, 9:00…)
  for (let h = debut; h + t.duree <= fin; h += t.pas) {
    const blocDebut = h - t.trajetAvant;
    const blocFin = h + t.duree + t.trajetApres;
    if (blocDebut < debut || blocFin > fin) continue;
    const a = dateHeure(jour, blocDebut);
    const b = dateHeure(jour, blocFin);
    const libre = occupes.every(function (o) { return o.fin <= a || o.debut >= b; });
    if (libre) resultat.push(texteHeure(h));
  }
  return resultat;
}

// Périodes occupées de l'agenda principal, de demain jusqu'à l'horizon de recherche.
// Le service « disponibilités » de Google Agenda (Freebusy) ne renvoie que des heures de début et de fin :
// une seule demande par tranche de 30 jours, rapide, et aucun détail des rendez-vous n'est lu.
// Comptent comme occupés : les événements marqués « Occupé » (réglage par défaut des événements avec horaire),
// sauf ceux que vous avez refusés. Un événement « toute la journée » ne bloque que s'il est marqué « Occupé ».
function evenementsOccupes() {
  const occupes = [];
  const debut = aujourdhui();
  const finRecherche = aujourdhui();
  finRecherche.setDate(finRecherche.getDate() + CONFIG.horizonMaxJours + 1);
  while (debut < finRecherche) {
    const fin = new Date(debut);
    fin.setDate(fin.getDate() + 30);
    const reponse = Calendar.Freebusy.query({
      timeMin: debut.toISOString(),
      timeMax: (fin < finRecherche ? fin : finRecherche).toISOString(),
      items: [{ id: 'primary' }],
    });
    (reponse.calendars.primary.busy || []).forEach(function (b) {
      occupes.push({ debut: new Date(b.start), fin: new Date(b.end) });
    });
    debut.setTime(fin.getTime());
  }
  return occupes;
}

// ---------------------------------------------------------------------------
// Création du rendez-vous et e-mails
// ---------------------------------------------------------------------------

function creerRendezVous(d) {
  const t = CONFIG.types[d.type];
  const jour = dateDepuisIso(d.date);
  const h = minutes(d.heure);
  const debut = dateHeure(jour, h);
  const fin = dateHeure(jour, h + t.duree);
  const agenda = CalendarApp.getDefaultCalendar();

  const options = {
    description: descriptionRendezVous(d),
    location: d.type === 'surplace' ? d.adresseRdv : 'Téléphone : ' + d.telephone,
  };
  // Invitation Google envoyée au visiteur s'il a donné son e-mail
  if (d.email) {
    options.guests = d.email;
    options.sendInvites = true;
  }
  const titre = (d.type === 'surplace' ? 'RDV sur place – ' : 'RDV téléphone – ') + d.nom + ' (Electricab)';
  agenda.createEvent(titre, debut, fin, options);

  // Trajets aller et retour, visibles seulement dans votre agenda
  if (t.trajetAvant) agenda.createEvent('Trajet – ' + d.nom, dateHeure(jour, h - t.trajetAvant), debut);
  if (t.trajetApres) agenda.createEvent('Trajet retour – ' + d.nom, fin, dateHeure(jour, h + t.duree + t.trajetApres));
}

function descriptionRendezVous(d) {
  return [
    (LIBELLES.fr[d.type]) + ' pris sur electricab.fr',
    '',
    'Nom : ' + d.nom,
    'Téléphone : ' + d.telephone,
    'E-mail : ' + (d.email || '(non renseigné)'),
    'Adresse du rendez-vous : ' + (d.adresseRdv || '(non renseignée)'),
    'Adresse du chantier : ' + (d.adresseChantier || '(non renseignée)'),
    'Motif : ' + (d.motif || '(non renseigné)'),
    'Langue du visiteur : ' + (d.langue === 'en' ? 'anglais' : 'français'),
  ].join('\n');
}

// Confirmation au visiteur, dans sa langue (en plus de l'invitation Google).
// L'e-mail « Nouveau rendez-vous » qui vous est destiné est envoyé par le site via Web3Forms :
// envoyé d'ici, depuis votre propre compte, il n'arriverait que dans « Messages envoyés ».
function envoyerEmails(d) {
  if (!d.email) return;
  const quandFr = texteDateFr(d.date) + ' à ' + d.heure;
  const en = d.langue === 'en';
  const quand = en ? texteDateEn(d.date) + ' at ' + d.heure + ' (French time)' : quandFr;
  const lignes = en
    ? [
        'Hello ' + d.nom + ',',
        '',
        'Your appointment with Electricab is confirmed.',
        '',
        LIBELLES.en[d.type] + ': ' + quand,
        d.type === 'surplace' ? 'Address: ' + d.adresseRdv : 'I will call you on ' + d.telephone + '.',
        '',
        'You will also receive a Google Calendar invitation to add it to your calendar.',
        'If you need to change or cancel, simply reply to this email or call +33 6 16 26 70 91.',
        '',
        'Charles-Antoine Beirnaert',
        'Electricab – electricab.fr',
      ]
    : [
        'Bonjour ' + d.nom + ',',
        '',
        'Votre rendez-vous avec Electricab est confirmé.',
        '',
        LIBELLES.fr[d.type] + ' : ' + quand,
        d.type === 'surplace' ? 'Adresse : ' + d.adresseRdv : 'Je vous appellerai au ' + d.telephone + '.',
        '',
        'Vous recevez aussi une invitation Google Agenda pour l’ajouter à votre agenda.',
        'Pour modifier ou annuler, répondez simplement à cet e-mail ou appelez le 06 16 26 70 91.',
        '',
        'Charles-Antoine Beirnaert',
        'Electricab – electricab.fr',
      ];
  MailApp.sendEmail({
    to: d.email,
    subject: en ? 'Your Electricab appointment on ' + quand : 'Votre rendez-vous Electricab le ' + quandFr,
    body: lignes.join('\n'),
    replyTo: CONFIG.emailNotification,
    name: 'Electricab',
  });
}

// ---------------------------------------------------------------------------
// Vérification des données reçues (le site vérifie aussi, mais on ne fait confiance à personne)
// ---------------------------------------------------------------------------

function verifier(d) {
  if (!d || typeof d !== 'object') return 'donnees';
  const champs = ['type', 'date', 'heure', 'nom', 'telephone', 'email', 'adresseRdv', 'adresseChantier', 'motif', 'langue'];
  champs.forEach(function (c) { d[c] = typeof d[c] === 'string' ? d[c].trim().slice(0, c === 'motif' ? 1000 : 200) : ''; });

  if (!CONFIG.types[d.type]) return 'type';
  if (!/^\d{4}-\d{2}-\d{2}$/.test(d.date) || !/^\d{2}:\d{2}$/.test(d.heure)) return 'creneau';
  if (!d.nom) return 'nom';
  const tel = d.telephone.replace(/[\s.\-]/g, '');
  if (!/^0[1-9]\d{8}$/.test(tel) && !/^\+[1-9]\d{6,14}$/.test(tel)) return 'telephone';
  if (d.email && !/^[^@\s]+@[^@\s]+\.[a-zA-Z]{2,}$/.test(d.email)) return 'email';
  if (d.type === 'surplace' && !d.adresseRdv) return 'adresse';
  if (d.langue !== 'en') d.langue = 'fr';
  return '';
}

// ---------------------------------------------------------------------------
// Dates et heures (fuseau Europe/Paris, réglé dans appsscript.json)
// ---------------------------------------------------------------------------

function aujourdhui() {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}
function minutes(hhmm) {
  const p = hhmm.split(':');
  return Number(p[0]) * 60 + Number(p[1]);
}
function texteHeure(m) {
  return ('0' + Math.floor(m / 60)).slice(-2) + ':' + ('0' + (m % 60)).slice(-2);
}
function dateHeure(jour, m) {
  return new Date(jour.getFullYear(), jour.getMonth(), jour.getDate(), Math.floor(m / 60), m % 60);
}
function dateDepuisIso(iso) {
  const p = iso.split('-');
  return new Date(Number(p[0]), Number(p[1]) - 1, Number(p[2]));
}
function isoDepuisDate(d) {
  return Utilities.formatDate(d, 'Europe/Paris', 'yyyy-MM-dd');
}
const MOIS_FR = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
const JOURS_FR = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
function texteDateFr(iso) {
  const d = dateDepuisIso(iso);
  return JOURS_FR[d.getDay()] + ' ' + d.getDate() + ' ' + MOIS_FR[d.getMonth()] + ' ' + d.getFullYear();
}
function texteDateEn(iso) {
  return Utilities.formatDate(dateDepuisIso(iso), 'Europe/Paris', 'EEEE d MMMM yyyy');
}

// Diagnostic depuis l'éditeur (menu Exécuter) : quel compte et quels agendas le programme voit,
// et ce que chaque agenda contient demain. Ne s'affiche que dans votre journal, jamais sur le site.
function diagnostiquer() {
  console.log('Compte utilisé par le programme : ' + Session.getEffectiveUser().getEmail());
  const principal = CalendarApp.getDefaultCalendar();
  console.log('Agenda principal : « ' + principal.getName() + ' » (' + principal.getId() + ')');

  const debut = aujourdhui();
  debut.setDate(debut.getDate() + 1);
  const fin = new Date(debut);
  fin.setDate(fin.getDate() + 1);
  console.log('Événements du ' + isoDepuisDate(debut) + ', agenda par agenda :');
  CalendarApp.getAllCalendars().forEach(function (agenda) {
    const evenements = agenda.getEvents(debut, fin).map(function (ev) {
      return ev.isAllDayEvent()
        ? 'toute la journée'
        : Utilities.formatDate(ev.getStartTime(), 'Europe/Paris', 'HH:mm') + '–' + Utilities.formatDate(ev.getEndTime(), 'Europe/Paris', 'HH:mm');
    });
    console.log('  « ' + agenda.getName() + ' »' + (agenda.getId() === principal.getId() ? ' [principal]' : '') + ' : ' + (evenements.join(', ') || 'aucun'));
  });

  const occupes = Calendar.Freebusy.query({ timeMin: debut.toISOString(), timeMax: fin.toISOString(), items: [{ id: 'primary' }] })
    .calendars.primary.busy || [];
  console.log('Plages « Occupé » vues dans l\'agenda principal : ' + (occupes.map(function (b) {
    return Utilities.formatDate(new Date(b.start), 'Europe/Paris', 'HH:mm') + '–' + Utilities.formatDate(new Date(b.end), 'Europe/Paris', 'HH:mm');
  }).join(', ') || 'aucune'));
}

// Pour tester depuis l'éditeur Apps Script (menu Exécuter) : affiche les créneaux calculés
function testerCreneaux() {
  console.log(JSON.stringify(joursDisponibles('telephone').slice(0, 2)));
  console.log(JSON.stringify(joursDisponibles('surplace').slice(0, 2)));
}
