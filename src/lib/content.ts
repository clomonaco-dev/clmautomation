import { solutions } from './solutions';
import type { Locale, Route } from './routes';

export const content = {
  it: {
    nav: ['Home', 'Chi siamo', 'Servizi', 'Pacchetti', 'Metodo', 'Contatti'],
    examples: 'Esempi', menu: 'Menu', close: 'Chiudi menu', language: 'Cambia lingua', skip: 'Vai al contenuto',
    contact: 'Parliamo del tuo progetto', discover: 'Scopri i servizi', allExamples: 'Esplora gli esempi', viewExample: 'Esplora il progetto',
    eyebrow: 'Sviluppo web · Novara, Italia',
    hero: ['Il tuo lavoro merita', 'un sito all’altezza.'],
    intro: 'Progettiamo e sviluppiamo siti web per chi vuole presentarsi bene, raccontare ciò che fa e trasformare una visita in una conversazione.',
    heroNote: 'Design su misura. Sviluppo solido. Un contatto diretto.',
    approach: ['Design che ti rappresenta', 'Pensato per ogni schermo', 'Codice di tua proprietà'],
    servicesLabel: '01 / Cosa possiamo fare per te', servicesTitle: 'Una bella presenza online. Una base solida per crescere.',
    servicesIntro: 'Dal primo sito al restyling completo: mettiamo insieme design, contenuti e sviluppo, partendo dalla tua attività.',
    services: [
      ['Siti vetrina', 'La tua attività, spiegata bene. Pagine chiare, servizi in evidenza e contatti a portata di mano.'],
      ['Restyling & design', 'Un nuovo linguaggio visivo per un sito che non racconta più chi sei. Ripensiamo struttura, stile e navigazione.'],
      ['Sviluppo su misura', 'Funzionalità e integrazioni costruite sulle tue esigenze, con una struttura pronta a evolvere.'],
      ['SEO & performance', 'Titoli, struttura delle pagine e caricamento curati per dare al sito fondamenta tecniche solide.'],
      ['Siti multilingua', 'Contenuti e percorsi di navigazione in più lingue, per parlare anche ai tuoi clienti internazionali.'],
      ['Assistenza & crescita', 'Aggiornamenti, nuove sezioni e supporto dopo la pubblicazione, in base alle esigenze del progetto.'],
    ],
    examplesLabel: '02 / Possibili direzioni', examplesTitle: 'Settori diversi. La stessa cura.',
    examplesIntro: 'Tre concept dimostrativi per immaginare il tuo prossimo sito. Ogni soluzione viene adattata alla tua identità e ai tuoi contenuti.',
    concept: 'Concept dimostrativo',
    sectors: [
      ['avvocati', 'Studi legali', 'Autorevolezza, senza complicazioni.', 'Competenze, aree di attività e persone: un sito che ispira fiducia e facilita il primo contatto.', 'legale'],
      ['medici', 'Medici & studi sanitari', 'La chiarezza fa stare meglio.', 'Specializzazioni, informazioni pratiche e richieste di appuntamento in un percorso semplice per il paziente.', 'sanitario'],
      ['professionisti', 'Professionisti & consulenti', 'Dai spazio alle tue competenze.', 'Servizi, metodo e progetti presentati con ordine, per rendere immediato il valore del tuo lavoro.', 'professionale'],
    ],
    methodLabel: '03 / Come lavoriamo', methodTitle: 'Un percorso chiaro, dall’idea alla pubblicazione.',
    methodIntro: 'Sai sempre a che punto siamo, cosa stiamo costruendo e qual è il prossimo passo.',
    steps: [
      ['Ci conosciamo', 'Ascoltiamo la tua idea, il tuo pubblico e gli obiettivi. Definiamo insieme il perimetro del progetto.'],
      ['Diamo forma', 'Organizziamo pagine e contenuti, poi definiamo la direzione visiva. Il sito prende forma prima dello sviluppo.'],
      ['Costruiamo', 'Trasformiamo il progetto in un sito navigabile. Curiamo leggibilità, velocità e comportamento sui diversi dispositivi.'],
      ['Andiamo online', 'Verifichiamo contenuti e collegamenti, configuriamo il dominio e pubblichiamo. Poi concordiamo i prossimi sviluppi.'],
    ],
    aboutLabel: 'Persone, prima del codice', aboutTitle: 'Pensiero ingegneristico. Cura artigianale.',
    aboutIntro: 'CLM Automation unisce esperienza nello sviluppo software e attenzione alla comunicazione. Da Gozzano, in provincia di Novara, aiutiamo professionisti e attività a costruire una presenza online riconoscibile.',
    aboutDetails: 'Il percorso tecnico comprende oltre dieci anni di sviluppo software, esperienze nei settori automotive, aerospaziale e difesa e attività di formazione per università e aziende. Portiamo lo stesso approccio strutturato anche nei progetti web.',
    aboutValues: [['Un interlocutore diretto', 'Un confronto concreto, dalle prime domande alle ultime rifiniture.'], ['Competenze verificabili', 'Formazione ingegneristica, abilitazione professionale e certificazioni tecniche.'], ['Il progetto è tuo', 'Nessun abbonamento obbligatorio al sito. Servizi esterni e assistenza vengono concordati separatamente.']],
    documents: 'Formazione e documenti', degree: 'Laurea magistrale', qualification: 'Abilitazione professionale', certificates: 'Certificazioni tecniche',
    packageLabel: 'Un punto di partenza, non un limite', packageTitle: 'La soluzione giusta per la tua prossima fase.',
    packageIntro: 'Tre livelli di progetto, con un preventivo definito sulle tue esigenze. I prezzi di partenza riprendono le proposte CLM Automation.',
    from: 'Da', quote: 'Richiedi un preventivo', priceNote: 'Prezzi indicativi di partenza. Ambito, costi di servizi esterni e condizioni economiche vengono precisati nel preventivo.', featured: 'Per una presenza completa',
    plans: [
      ['Base', '600', 'Per iniziare, con le idee chiare.', ['Sito one page', 'Design responsive', 'Presentazione dei servizi', 'Email, telefono e WhatsApp', 'Pubblicazione online']],
      ['Standard', '1.200', 'Più spazio per raccontare la tua attività.', ['Sito multipagina', 'Design personalizzato', 'Modulo contatti e indicazioni sede', 'SEO di base on-page', 'Collegamento del dominio']],
      ['Premium', '2.000', 'Un progetto più curato, pronto a crescere.', ['Fino a 5 pagine', 'Design premium su misura', 'Struttura e revisione dei contenuti', 'Ottimizzazione SEO on-page', '3 mesi di assistenza inclusi']],
    ],
    faqTitle: 'Le domande giuste, prima di iniziare.',
    faq: [
      ['Quanto tempo serve?', 'Dipende dalle pagine, dalle funzionalità e dalla disponibilità dei contenuti. Dopo il primo confronto definiamo un calendario realistico nel preventivo.'],
      ['Posso partire con un sito semplice?', 'Sì. Possiamo costruire una prima versione essenziale e aggiungere pagine o funzionalità in seguito.'],
      ['Mi aiutate con i contenuti?', 'Ti aiutiamo a organizzare le informazioni. La revisione o la realizzazione dei contenuti viene concordata in base al progetto.'],
      ['Il sito sarà mio?', 'Sì. Il sito è di tua proprietà, senza abbonamento obbligatorio. Dominio, hosting e servizi opzionali vengono chiariti nel preventivo.'],
    ],
    ctaLabel: 'Il prossimo progetto potrebbe essere il tuo', ctaTitle: 'Hai un’idea. Diamo forma al tuo sito.', ctaText: 'Raccontaci cosa fai e cosa vorresti migliorare. Partiamo da una conversazione, senza tecnicismi inutili.',
    contactLabel: 'Facciamo il primo passo', contactTitle: 'Raccontaci il tuo progetto.', contactIntro: 'Un nuovo sito, un restyling o una domanda: scrivici. Ti aiutiamo a capire da dove partire.',
    contactForm: ['Nome', 'Email', 'Attività', 'Di cosa hai bisogno?', 'Descrivi la tua idea', 'Invia richiesta'],
    formPlaceholder: 'La tua attività, il sito attuale e cosa vorresti realizzare…', optional: 'facoltativo', required: 'obbligatorio',
    formNote: 'Usiamo i dati inseriti per rispondere alla tua richiesta. Non inserire informazioni sensibili.',
    sending: 'Invio in corso…', success: 'Richiesta inviata. Grazie, ti risponderemo via email.', error: 'Non siamo riusciti a inviare la richiesta. Riprova oppure contattaci via email.',
    localForm: 'Il modulo si attiva sul sito pubblicato su Netlify. Per ora puoi scriverci via email.',
    formOptions: ['Un nuovo sito', 'Restyling del sito', 'Un progetto su misura', 'Informazioni sui pacchetti'],
    emailAction: 'Scrivi un’email', whatsapp: 'Parliamone su WhatsApp', location: 'Dove siamo', map: 'Apri su Google Maps',
    footer: 'Siti web progettati bene, per chi ha qualcosa da raccontare.', rights: 'Tutti i diritti riservati.', privacy: 'Informativa privacy',
    reviews: 'Le parole di chi ci ha scelto', reviewsLink: 'Recensioni su Google', reviewsFallback: 'Scopri CLM Automation su Google.', reviewCount: 'recensioni',
    demoNote: 'Esempio di design, non un sito cliente. Nomi, immagini e contenuti delle anteprime sono dimostrativi.',
    sectorIncludes: 'Cosa può includere il tuo sito', sectorFeatures: ['Presentazione dello studio e del team', 'Servizi e aree di specializzazione', 'Un percorso di contatto semplice', 'Informazioni pratiche e sede'],
    sectorCta: 'Vorrei un sito così', back: 'Torna agli esempi',
    consent: 'Possiamo usare statistiche di navigazione per migliorare il sito? La scelta è facoltativa.', accept: 'Accetta', reject: 'Solo essenziali', preferences: 'Preferenze cookie',
    notFound: 'Questa pagina non è qui.', backHome: 'Torna alla home',
  },
  en: {
    nav: ['Home', 'About', 'Services', 'Packages', 'Process', 'Contact'],
    examples: 'Examples', menu: 'Menu', close: 'Close menu', language: 'Change language', skip: 'Skip to content',
    contact: 'Let’s talk about your project', discover: 'Explore our services', allExamples: 'Explore the concepts', viewExample: 'Explore the concept',
    eyebrow: 'Web development · Novara, Italy',
    hero: ['Your work deserves', 'a website to match.'],
    intro: 'We design and develop websites for people who want to present their business clearly, share what they do and turn a visit into a conversation.',
    heroNote: 'Tailored design. Solid development. A direct conversation.',
    approach: ['Design that represents you', 'Made for every screen', 'Code you own'],
    servicesLabel: '01 / What we can do for you', servicesTitle: 'A distinctive online presence. A solid foundation to grow.',
    servicesIntro: 'From your first website to a complete redesign, we bring design, content and development together around your business.',
    services: [
      ['Business websites', 'Your business, clearly explained. Well-organised pages, services in the spotlight and contact details within reach.'],
      ['Redesign & design', 'A new visual direction for a website that no longer reflects who you are. We rethink structure, style and navigation.'],
      ['Custom development', 'Features and integrations built around your needs, with a structure that can evolve over time.'],
      ['SEO & performance', 'Carefully considered page titles, structure and loading performance to give your website a sound technical foundation.'],
      ['Multilingual websites', 'Content and navigation in different languages, so you can speak to international customers too.'],
      ['Support & growth', 'Updates, new sections and support after launch, tailored to the needs of your project.'],
    ],
    examplesLabel: '02 / Possible directions', examplesTitle: 'Different fields. The same attention to detail.',
    examplesIntro: 'Three demonstration concepts to help you picture your next website. Each solution is adapted to your identity and content.',
    concept: 'Demonstration concept',
    sectors: [
      ['avvocati', 'Law firms', 'Authority, without complexity.', 'Expertise, practice areas and people: a website that builds confidence and makes the first contact easy.', 'legal'],
      ['medici', 'Doctors & healthcare', 'Clarity is part of good care.', 'Specialities, practical information and appointment enquiries in a straightforward patient journey.', 'healthcare'],
      ['professionisti', 'Professionals & consultants', 'Make room for your expertise.', 'Services, methods and projects presented clearly, so the value of your work is easy to understand.', 'professional'],
    ],
    methodLabel: '03 / Our process', methodTitle: 'A clear path, from the first idea to launch.',
    methodIntro: 'You always know where we are, what we are building and what comes next.',
    steps: [
      ['Get to know each other', 'We listen to your idea, your audience and your goals. Together, we define the scope of the project.'],
      ['Shape the direction', 'We organise pages and content, then define the visual direction. Your website takes shape before development.'],
      ['Build it', 'We turn the design into a working website, focusing on readability, speed and behaviour across devices.'],
      ['Go live', 'We check content and links, configure the domain and launch. Then we agree on the next steps.'],
    ],
    aboutLabel: 'People, before code', aboutTitle: 'Engineering thinking. A craftsperson’s care.',
    aboutIntro: 'CLM Automation brings software development experience together with a thoughtful approach to communication. Based in Gozzano, near Novara, we help professionals and businesses build a recognisable online presence.',
    aboutDetails: 'Our technical background includes more than ten years of software development, experience in automotive, aerospace and defence, and teaching for universities and companies. We bring that structured approach to web projects too.',
    aboutValues: [['A direct point of contact', 'A practical conversation, from your first questions to the final details.'], ['Verifiable expertise', 'Engineering education, professional qualifications and technical certifications.'], ['The project is yours', 'No mandatory website subscription. External services and ongoing support are agreed separately.']],
    documents: 'Education and qualifications', degree: 'Master’s degree', qualification: 'Professional qualification', certificates: 'Technical certifications',
    packageLabel: 'A starting point, not a limit', packageTitle: 'The right website for your next chapter.',
    packageIntro: 'Three project levels, with a quote tailored to your needs. Starting prices reflect CLM Automation’s existing offers.',
    from: 'From', quote: 'Request a quote', priceNote: 'Indicative starting prices. Scope, external service costs and commercial terms are specified in your quote.', featured: 'For a complete online presence',
    plans: [
      ['Base', '600', 'Start with a clear, focused presence.', ['One-page website', 'Responsive design', 'Service presentation', 'Email, phone and WhatsApp', 'Website launch']],
      ['Standard', '1,200', 'More room to tell your business story.', ['Multi-page website', 'Custom design', 'Contact form and location details', 'Basic on-page SEO', 'Domain connection']],
      ['Premium', '2,000', 'A tailored project, ready to grow.', ['Up to 5 pages', 'Premium custom design', 'Content structure and review', 'On-page SEO optimisation', '3 months of support included']],
    ],
    faqTitle: 'Good questions, before we begin.',
    faq: [
      ['How long does it take?', 'It depends on the pages, features and availability of content. After our first conversation, we include a realistic schedule in your quote.'],
      ['Can I start with a simple website?', 'Yes. We can build a focused first version and add pages or features later.'],
      ['Can you help with content?', 'We help organise your information. Content creation or editing is agreed according to the project.'],
      ['Will I own my website?', 'Yes. You own your website, with no mandatory subscription. Domain, hosting and optional services are explained in your quote.'],
    ],
    ctaLabel: 'Our next project could be yours', ctaTitle: 'You have an idea. Let’s build your website.', ctaText: 'Tell us what you do and what you would like to improve. We will start with a conversation, without unnecessary jargon.',
    contactLabel: 'Let’s take the first step', contactTitle: 'Tell us about your project.', contactIntro: 'A new website, a redesign or a question: get in touch. We will help you work out where to start.',
    contactForm: ['Name', 'Email', 'Business', 'What do you need?', 'Tell us about your idea', 'Send enquiry'],
    formPlaceholder: 'Your business, your current website and what you would like to create…', optional: 'optional', required: 'required',
    formNote: 'We use the information you provide to respond to your enquiry. Please do not include sensitive information.',
    sending: 'Sending…', success: 'Enquiry sent. Thank you, we will reply by email.', error: 'We could not send your enquiry. Please try again or contact us by email.',
    localForm: 'The form becomes available when published on Netlify. You can contact us by email in the meantime.',
    formOptions: ['A new website', 'A website redesign', 'A custom project', 'Package information'],
    emailAction: 'Send an email', whatsapp: 'Let’s talk on WhatsApp', location: 'Find us', map: 'Open Google Maps',
    footer: 'Thoughtfully built websites, for people with a story to tell.', rights: 'All rights reserved.', privacy: 'Privacy notice',
    reviews: 'In our clients’ words', reviewsLink: 'Reviews on Google', reviewsFallback: 'Find CLM Automation on Google.', reviewCount: 'reviews',
    demoNote: 'A design example, not a client website. Names, images and content in the previews are for demonstration.',
    sectorIncludes: 'What your website could include', sectorFeatures: ['Your practice and your team', 'Services and areas of expertise', 'A straightforward enquiry journey', 'Practical details and location'],
    sectorCta: 'I’d like a website like this', back: 'Back to the concepts',
    consent: 'May we use browsing statistics to improve the website? This is optional.', accept: 'Accept', reject: 'Essential only', preferences: 'Cookie preferences',
    notFound: 'This page isn’t here.', backHome: 'Back to home',
  },
} as const;

export function dictionary(locale: Locale) { return content[locale]; }
export type Dictionary = ReturnType<typeof dictionary>;
export function pageTitle(locale: Locale, route: Route): string {
  const t = dictionary(locale);
  if(route==='privacy')return locale==='it'?'Informativa privacy':'Privacy notice';
  if(route==='cookie-policy')return locale==='it'?'Informativa cookie':'Cookie policy';
  if(route==='termini-condizioni')return locale==='it'?'Termini e condizioni':'Terms and conditions';
  const main = ['', 'chi-siamo', 'servizi', 'pacchetti', 'metodo', 'contatti'];
  if(route==='progetti')return locale==='it'?'Progetti e ispirazioni':'Projects and inspiration';
  if(route==='recensioni')return locale==='it'?'Recensioni':'Reviews';
  const solution=solutions(locale).find(s=>s.route===route); if(solution)return solution.name;
  const index = main.indexOf(route);
  return index >= 0 ? t.nav[index] : (t.sectors.find(s => s[0] === route)?.[1] ?? 'CLM Automation');
}
