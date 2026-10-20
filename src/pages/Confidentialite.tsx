import type { Langue } from '../langue';
import { Infos, lienClasse, PageLegale, SectionLegale } from '../PageLegale';

const EMAIL = <a href="mailto:charles-antoine@electricab.fr" className={lienClasse}>charles-antoine@electricab.fr</a>;

export default function Confidentialite({ langue = 'fr' }: { langue?: Langue }) {
  if (langue === 'en') {
    return (
      <PageLegale
        langue="en"
        surtitre="Your data"
        titre="Privacy policy"
        accroche="What data we collect, why, and what your rights are."
      >
        <SectionLegale titre="Data controller">
          <Infos lignes={[
            ['Company', 'ELECTRICAB OISE'],
            ['Address', '8 Avenue de Creil, 60300 Senlis, France'],
            ['Email', EMAIL],
          ]} />
        </SectionLegale>

        <SectionLegale titre="Data collected">
          <p>When you use the contact or quote request form, we collect:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>your name;</li>
            <li>your email address;</li>
            <li>your phone number;</li>
            <li>your postcode and town;</li>
            <li>the content of your message;</li>
            <li>your target completion date, if you provide one (quote request).</li>
          </ul>
        </SectionLegale>

        <SectionLegale titre="Booking an appointment">
          <p>
            When you book an appointment on the Contact page, we collect your name and phone number and, if you provide them,
            your email address, the appointment address, the job site address and the reason for the appointment.
          </p>
          <p>
            This information is recorded in Electricab’s calendar, hosted by <strong className="font-semibold text-ink">Google</strong> (Google Agenda),
            and is sent to you by email with a Google Calendar invitation if you provided your email address.
            It is used solely to organise the appointment. When choosing a slot, the website only displays available times:
            no information about other appointments is ever shown.
          </p>
        </SectionLegale>

        <SectionLegale titre="Purpose and legal basis">
          <p>This data is used solely to respond to your enquiry, to prepare a quote and to organise appointments.</p>
          <p>
            Legal basis: pre-contractual measures taken at your request (Article 6(1)(b) of the General Data
            Protection Regulation, GDPR).
          </p>
        </SectionLegale>

        <SectionLegale titre="Recipients">
          <p>
            Your message is sent through the <strong className="font-semibold text-ink">Web3Forms</strong> service,
            which forwards it to contact@electricab.fr.
          </p>
          <p>
            Appointments are recorded in Electricab’s Google calendar and the related emails are sent through Google’s services.
          </p>
        </SectionLegale>

        <SectionLegale titre="Retention period">
          <p>Your data is kept for 3 years after our last contact.</p>
        </SectionLegale>

        <SectionLegale titre="Your rights">
          <p>
            You have the right to access, rectify and erase your data, to object to its processing and to restrict it.
            To exercise these rights, write to {EMAIL}.
          </p>
          <p>
            If you believe your rights have not been respected, you can lodge a complaint with the
            CNIL, the French data protection authority: <a href="https://www.cnil.fr/en/home" target="_blank" rel="noopener noreferrer" className={lienClasse}>www.cnil.fr</a>.
          </p>
        </SectionLegale>

        <SectionLegale titre="Cookies">
          <p>This website uses no tracking cookies and no audience measurement tools.</p>
        </SectionLegale>
      </PageLegale>
    );
  }

  return (
    <PageLegale
      surtitre="Vos données"
      titre="Politique de confidentialité"
      accroche="Quelles données nous recueillons, pourquoi, et quels sont vos droits."
    >
      <SectionLegale titre="Responsable du traitement">
        <Infos lignes={[
          ['Entreprise', 'ELECTRICAB OISE'],
          ['Adresse', '8 avenue de Creil, 60300 Senlis'],
          ['E-mail', EMAIL],
        ]} />
      </SectionLegale>

      <SectionLegale titre="Données collectées">
        <p>Lorsque vous utilisez le formulaire de contact ou de demande de devis, nous recueillons&nbsp;:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>votre nom&nbsp;;</li>
          <li>votre adresse e-mail&nbsp;;</li>
          <li>votre numéro de téléphone&nbsp;;</li>
          <li>votre code postal et votre commune&nbsp;;</li>
          <li>le contenu de votre message&nbsp;;</li>
          <li>votre objectif de date de réalisation, si vous l’indiquez (demande de devis).</li>
        </ul>
      </SectionLegale>

      <SectionLegale titre="Prise de rendez-vous">
        <p>
          Lorsque vous prenez rendez-vous depuis la page Contact, nous recueillons votre nom et votre numéro de téléphone, et,
          si vous les indiquez, votre adresse e-mail, l’adresse du rendez-vous, l’adresse du chantier et le motif du rendez-vous.
        </p>
        <p>
          Ces informations sont enregistrées dans l’agenda d’Electricab, hébergé par <strong className="font-semibold text-ink">Google</strong> (Google Agenda),
          et vous sont envoyées par e-mail avec une invitation Google Agenda si vous avez indiqué votre adresse e-mail.
          Elles servent uniquement à organiser le rendez-vous. Lors du choix d’un créneau, le site n’affiche que les heures
          disponibles&nbsp;: aucune information sur les autres rendez-vous n’est jamais montrée.
        </p>
      </SectionLegale>

      <SectionLegale titre="Finalité et base légale">
        <p>Ces données servent uniquement à répondre à votre demande de contact, à établir un devis et à organiser les rendez-vous.</p>
        <p>
          Base légale&nbsp;: mesures précontractuelles prises à votre demande (article 6.1.b du Règlement général
          sur la protection des données, RGPD).
        </p>
      </SectionLegale>

      <SectionLegale titre="Destinataires">
        <p>
          Votre message est transmis par le service d’envoi <strong className="font-semibold text-ink">Web3Forms</strong>,
          qui l’achemine vers l’adresse contact@electricab.fr.
        </p>
        <p>
          Les rendez-vous sont enregistrés dans l’agenda Google d’Electricab, et les e-mails qui s’y rapportent sont envoyés par les services de Google.
        </p>
      </SectionLegale>

      <SectionLegale titre="Durée de conservation">
        <p>Vos données sont conservées pendant 3 ans après notre dernier contact.</p>
      </SectionLegale>

      <SectionLegale titre="Vos droits">
        <p>
          Vous disposez d’un droit d’accès, de rectification, de suppression, d’opposition et de limitation du traitement
          de vos données. Pour les exercer, écrivez à {EMAIL}.
        </p>
        <p>
          Si vous estimez que vos droits ne sont pas respectés, vous pouvez adresser une réclamation à la
          CNIL (Commission nationale de l’informatique et des libertés)&nbsp;: <a href="https://www.cnil.fr/fr/plaintes" target="_blank" rel="noopener noreferrer" className={lienClasse}>www.cnil.fr</a>.
        </p>
      </SectionLegale>

      <SectionLegale titre="Cookies">
        <p>Ce site n’utilise aucun cookie de suivi ni outil de mesure d’audience.</p>
      </SectionLegale>
    </PageLegale>
  );
}
