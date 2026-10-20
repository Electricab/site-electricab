import { LienLangue, type Langue } from '../langue';
import { Infos, lienClasse, PageLegale, SectionLegale } from '../PageLegale';

const EMAIL = <a href="mailto:charles-antoine@electricab.fr" className={lienClasse}>charles-antoine@electricab.fr</a>;

export default function MentionsLegales({ langue = 'fr' }: { langue?: Langue }) {
  if (langue === 'en') {
    return (
      <PageLegale
        langue="en"
        surtitre="Legal information"
        titre="Legal notice"
        accroche="Information about the company that publishes this website."
      >
        <SectionLegale titre="Website publisher">
          <Infos lignes={[
            ['Company name', 'ELECTRICAB OISE'],
            ['Trading name', 'ELECTRICAB'],
            ['Legal form', 'SASU (French single-shareholder simplified joint-stock company)'],
            ['Share capital', '€5,000'],
            ['Registered office', '8 Avenue de Creil, 60300 Senlis, France'],
            ['SIREN', '107 918 724'],
            ['SIRET', '107 918 724 00017'],
            ['Trade and Companies Register (RCS)', 'Compiègne'],
            ['EU VAT number', 'FR60107918724'],
            ['President', 'Charles-Antoine Beirnaert'],
          ]} />
        </SectionLegale>

        <SectionLegale titre="Publication director">
          <p>Charles-Antoine Beirnaert, President.</p>
        </SectionLegale>

        <SectionLegale titre="Contact">
          <Infos lignes={[
            ['Email', EMAIL],
            ['Phone', <a href="tel:+33616267091" className={lienClasse}>+33 6 16 26 70 91</a>],
          ]} />
        </SectionLegale>

        <SectionLegale titre="Insurance">
          <p>
            Professional liability and 10-year liability (décennale) insurance taken out with <strong className="font-semibold text-ink">AXA France IARD</strong>,
            covering electrical and telecommunications work in mainland France and the French overseas departments.
          </p>
        </SectionLegale>

        <SectionLegale titre="Hosting provider">
          <Infos lignes={[
            ['Company', 'GitHub, Inc.'],
            ['Address', '88 Colin P. Kelly Jr. Street, San Francisco, CA 94107, United States'],
          ]} />
        </SectionLegale>

        <SectionLegale titre="Intellectual property">
          <p>
            All content on this website (text, images, logo) is protected by intellectual property law.
            Any reproduction, representation or distribution, in whole or in part, without prior permission is prohibited.
          </p>
        </SectionLegale>

        <SectionLegale titre="Personal data">
          <p>
            To find out how your data is used and how to exercise your rights, see
            our <LienLangue to="/politique-de-confidentialite" className={lienClasse}>privacy policy</LienLangue>.
          </p>
        </SectionLegale>
      </PageLegale>
    );
  }

  return (
    <PageLegale
      surtitre="Informations légales"
      titre="Mentions légales"
      accroche="Les informations sur l’entreprise qui édite ce site."
    >
      <SectionLegale titre="Éditeur du site">
        <Infos lignes={[
          ['Raison sociale', 'ELECTRICAB OISE'],
          ['Nom commercial', 'ELECTRICAB'],
          ['Forme juridique', 'SASU (société par actions simplifiée unipersonnelle)'],
          ['Capital social', '5 000 €'],
          ['Siège social', '8 avenue de Creil, 60300 Senlis'],
          ['SIREN', '107 918 724'],
          ['SIRET', '107 918 724 00017'],
          ['RCS', 'Compiègne'],
          ['TVA intracommunautaire', 'FR60107918724'],
          ['Président', 'Charles-Antoine Beirnaert'],
        ]} />
      </SectionLegale>

      <SectionLegale titre="Directeur de la publication">
        <p>Charles-Antoine Beirnaert, président.</p>
      </SectionLegale>

      <SectionLegale titre="Contact">
        <Infos lignes={[
          ['E-mail', EMAIL],
          ['Téléphone', <a href="tel:+33616267091" className={lienClasse}>06 16 26 70 91</a>],
        ]} />
      </SectionLegale>

      <SectionLegale titre="Assurance">
        <p>
          Assurance responsabilité civile professionnelle et décennale souscrite auprès d’<strong className="font-semibold text-ink">AXA France IARD</strong>,
          couvrant les travaux d’électricité et de télécommunications en France métropolitaine et dans les DOM.
        </p>
      </SectionLegale>

      <SectionLegale titre="Hébergeur">
        <Infos lignes={[
          ['Société', 'GitHub, Inc.'],
          ['Adresse', '88 Colin P. Kelly Jr. Street, San Francisco, CA 94107, États-Unis'],
        ]} />
      </SectionLegale>

      <SectionLegale titre="Propriété intellectuelle">
        <p>
          L’ensemble du contenu de ce site (textes, images, logo) est protégé par le droit de la propriété intellectuelle.
          Toute reproduction, représentation ou diffusion, totale ou partielle, sans autorisation préalable est interdite.
        </p>
      </SectionLegale>

      <SectionLegale titre="Données personnelles">
        <p>
          Pour savoir comment vos données sont utilisées et comment exercer vos droits, consultez
          notre <LienLangue to="/politique-de-confidentialite" className={lienClasse}>politique de confidentialité</LienLangue>.
        </p>
      </SectionLegale>
    </PageLegale>
  );
}
