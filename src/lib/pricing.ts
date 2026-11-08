import type { Locale, Route } from "./routes";
import type { SceneKey } from "./projects";

/*
 * Price list by project type. Prices are indicative starting points ("from"),
 * in euro. Edit numbers and copy here: the pricing page reads only this file.
 */

export type Cell = boolean | string;
type Plan = {
  name: string;
  price: number;
  tagline: string;
  time: string;
  features: string[];
};
type Category = {
  key: string;
  route?: Route;
  scene: SceneKey;
  name: string;
  short: string;
  description: string;
  ideal: string[];
  excluded: string;
  plans: [Plan, Plan, Plan];
  rows: [string, Cell, Cell, Cell][];
};

const it: Category[] = [
  {
    key: "siti-vetrina",
    route: "siti-web",
    scene: "vetrina",
    name: "Siti vetrina",
    short: "Presentati bene online",
    description:
      "Per professionisti, studi e attività che vogliono raccontare chi sono, cosa offrono e farsi contattare con facilità.",
    ideal: ["Professionisti", "Studi", "PMI", "Artigiani"],
    excluded:
      "Dominio, hosting e caselle email vengono indicati nel preventivo, con i costi del fornitore scelto.",
    plans: [
      {
        name: "Base",
        price: 600,
        tagline: "Per iniziare, con le idee chiare.",
        time: "1–2 settimane",
        features: [
          "Sito one page",
          "Design responsive",
          "Presentazione dei servizi",
          "Email, telefono e WhatsApp",
          "Pubblicazione online",
        ],
      },
      {
        name: "Standard",
        price: 1200,
        tagline: "Più spazio per raccontare la tua attività.",
        time: "2–4 settimane",
        features: [
          "Sito multipagina",
          "Design personalizzato",
          "Modulo contatti e indicazioni sede",
          "SEO di base on-page",
          "Collegamento del dominio",
        ],
      },
      {
        name: "Premium",
        price: 2000,
        tagline: "Un progetto più curato, pronto a crescere.",
        time: "4–6 settimane",
        features: [
          "Fino a 5 pagine progettate su misura",
          "Design premium e micro-animazioni",
          "Struttura e revisione dei contenuti",
          "Ottimizzazione SEO on-page",
          "3 mesi di assistenza inclusi",
        ],
      },
    ],
    rows: [
      ["Pagine", "One page", "Multipagina", "Fino a 5, su misura"],
      ["Design", "Responsive", "Personalizzato", "Premium su misura"],
      ["Modulo contatti", false, true, true],
      ["SEO on-page", false, "Base", "Ottimizzata"],
      ["Collegamento del dominio", false, true, true],
      ["Revisione dei contenuti", false, false, true],
      ["Assistenza inclusa", false, false, "3 mesi"],
    ],
  },
  {
    key: "e-commerce",
    route: "e-commerce",
    scene: "shop",
    name: "E-commerce",
    short: "Vendi online con ordine",
    description:
      "Negozi online per brand, artigiani e aziende: catalogo chiaro, checkout semplice da smartphone e ordini facili da gestire.",
    ideal: ["Negozi", "Brand", "Artigiani", "Produttori"],
    excluded:
      "Canoni della piattaforma, commissioni sui pagamenti, temi e plugin a pagamento sono esclusi e indicati nel preventivo.",
    plans: [
      {
        name: "Start",
        price: 2500,
        tagline: "Per aprire il tuo primo negozio online.",
        time: "3–5 settimane",
        features: [
          "Piattaforma affidabile (es. Shopify o WooCommerce)",
          "Tema personalizzato con la tua identità",
          "Fino a 50 prodotti caricati",
          "Pagamenti con carta e PayPal",
          "Spedizioni e imposte configurate",
        ],
      },
      {
        name: "Business",
        price: 4500,
        tagline: "Un negozio su misura, pronto a crescere.",
        time: "5–8 settimane",
        features: [
          "Design su misura di catalogo e scheda prodotto",
          "Fino a 300 prodotti con varianti",
          "Filtri, ricerca e prodotti correlati",
          "Email d’ordine personalizzate",
          "SEO per categorie e prodotti",
        ],
      },
      {
        name: "Pro",
        price: 8000,
        tagline: "Per volumi importanti e processi integrati.",
        time: "8–12 settimane",
        features: [
          "UX del checkout ottimizzata e funzioni su misura",
          "Integrazione con magazzino, gestionale o fatturazione",
          "Negozio multilingua e più valute",
          "Area clienti avanzata",
          "3 mesi di assistenza inclusi",
        ],
      },
    ],
    rows: [
      ["Prodotti caricati", "Fino a 50", "Fino a 300", "Catalogo esteso"],
      ["Design", "Tema personalizzato", "Su misura", "Su misura + UX checkout"],
      ["Pagamenti online", true, true, true],
      ["Filtri e ricerca avanzata", false, true, true],
      ["SEO e-commerce", false, true, true],
      ["Integrazioni", "Spedizioni", "Spedizioni", "Magazzino, ERP, fatture"],
      ["Multilingua e valute", false, false, true],
      ["Assistenza inclusa", false, "1 mese", "3 mesi"],
    ],
  },
  {
    key: "app-mobile",
    scene: "mobile",
    name: "App mobile",
    short: "iOS e Android",
    description:
      "App per iPhone e Android da un’unica base di codice: progettiamo flussi e schermate attorno a chi le userà ogni giorno.",
    ideal: ["Startup", "Servizi", "Community", "Aziende"],
    excluded:
      "Account sviluppatore Apple e Google, servizi cloud e costi di terze parti sono esclusi e indicati nel preventivo.",
    plans: [
      {
        name: "MVP",
        price: 6000,
        tagline: "Per validare un’idea con un’app essenziale.",
        time: "6–8 settimane",
        features: [
          "App iOS e Android cross-platform",
          "Fino a 5 schermate",
          "Design UI/UX dei flussi principali",
          "Registrazione e profilo utente",
          "Pubblicazione su App Store e Google Play",
        ],
      },
      {
        name: "Business",
        price: 12000,
        tagline: "Un’app completa per i tuoi clienti.",
        time: "10–14 settimane",
        features: [
          "Fino a 15 schermate",
          "Prototipo interattivo prima dello sviluppo",
          "Notifiche push",
          "Pannello per gestire i contenuti",
          "Integrazione con API e servizi esterni",
        ],
      },
      {
        name: "Pro",
        price: 20000,
        tagline: "Un prodotto digitale pronto a scalare.",
        time: "Da 4 mesi",
        features: [
          "Backend e database su misura",
          "Pagamenti in app o abbonamenti",
          "Funzioni offline e sincronizzazione",
          "Statistiche d’uso nel rispetto della privacy",
          "3 mesi di assistenza inclusi",
        ],
      },
    ],
    rows: [
      ["Schermate", "Fino a 5", "Fino a 15", "Su misura"],
      [
        "Design UI/UX",
        "Flussi principali",
        "+ prototipo interattivo",
        "+ test con utenti",
      ],
      ["Pubblicazione negli store", true, true, true],
      ["Notifiche push", false, true, true],
      ["Gestione contenuti", false, true, true],
      ["Backend su misura", false, false, true],
      ["Pagamenti in app", false, false, true],
      ["Assistenza inclusa", false, "1 mese", "3 mesi"],
    ],
  },
  {
    key: "gestionali",
    route: "gestionali",
    scene: "dashboard",
    name: "Gestionali",
    short: "Processi in ordine",
    description:
      "Applicazioni web su misura per sostituire fogli di calcolo e passaggi manuali: dati, documenti e persone nello stesso posto.",
    ideal: ["Aziende", "Uffici", "Produzione", "Studi"],
    excluded:
      "Hosting, backup e manutenzione evolutiva vengono concordati con un canone separato, in base a utenti e dati gestiti.",
    plans: [
      {
        name: "Modulo",
        price: 3500,
        tagline: "Per digitalizzare un processo specifico.",
        time: "4–6 settimane",
        features: [
          "Analisi del processo da digitalizzare",
          "Un modulo: anagrafiche, ordini o pratiche",
          "Accesso con utenti e password",
          "Ricerca, filtri ed export Excel/CSV",
          "Interfaccia web responsive",
        ],
      },
      {
        name: "Gestionale",
        price: 8000,
        tagline: "Un unico strumento per il lavoro di ogni giorno.",
        time: "8–12 settimane",
        features: [
          "Fino a 4 moduli collegati",
          "Ruoli e permessi per utente",
          "Dashboard con gli indicatori chiave",
          "Generazione di documenti PDF",
          "Notifiche e promemoria via email",
        ],
      },
      {
        name: "Su misura",
        price: 15000,
        tagline: "Processi complessi, integrazioni, crescita.",
        time: "Da 3 mesi",
        features: [
          "Moduli definiti sull’analisi",
          "Integrazione con software esistenti e API",
          "Automazioni e flussi di approvazione",
          "Registro attività e backup pianificati",
          "Formazione del team e documentazione",
        ],
      },
    ],
    rows: [
      ["Moduli", "1", "Fino a 4", "Su analisi"],
      [
        "Utenti e accessi",
        "Login",
        "Ruoli e permessi",
        "Ruoli, permessi, audit",
      ],
      ["Export dati", true, true, true],
      ["Dashboard", false, true, true],
      ["Documenti PDF", false, true, true],
      ["Integrazioni esterne", false, false, true],
      ["Automazioni e approvazioni", false, false, true],
      [
        "Formazione del team",
        false,
        "Sessione iniziale",
        "Completa + documentazione",
      ],
    ],
  },
];

const en: Category[] = [
  {
    key: "siti-vetrina",
    route: "siti-web",
    scene: "vetrina",
    name: "Business websites",
    short: "Present your work well",
    description:
      "For professionals, practices and businesses who want to explain who they are, what they offer and be easy to contact.",
    ideal: ["Professionals", "Practices", "SMEs", "Makers"],
    excluded:
      "Domain, hosting and email boxes are listed in the quote at the chosen provider’s prices.",
    plans: [
      {
        name: "Base",
        price: 600,
        tagline: "A clear way to start.",
        time: "1–2 weeks",
        features: [
          "One-page website",
          "Responsive design",
          "Service overview",
          "Email, phone and WhatsApp",
          "Online launch",
        ],
      },
      {
        name: "Standard",
        price: 1200,
        tagline: "More room to tell your story.",
        time: "2–4 weeks",
        features: [
          "Multi-page website",
          "Custom design",
          "Contact form and directions",
          "Essential on-page SEO",
          "Domain connection",
        ],
      },
      {
        name: "Premium",
        price: 2000,
        tagline: "A more refined project, ready to grow.",
        time: "4–6 weeks",
        features: [
          "Up to 5 tailored pages",
          "Premium design and micro-animations",
          "Content structure and review",
          "On-page SEO optimisation",
          "3 months of support included",
        ],
      },
    ],
    rows: [
      ["Pages", "One page", "Multi-page", "Up to 5, tailored"],
      ["Design", "Responsive", "Custom", "Premium, tailored"],
      ["Contact form", false, true, true],
      ["On-page SEO", false, "Essential", "Optimised"],
      ["Domain connection", false, true, true],
      ["Content review", false, false, true],
      ["Support included", false, false, "3 months"],
    ],
  },
  {
    key: "e-commerce",
    route: "e-commerce",
    scene: "shop",
    name: "E-commerce",
    short: "Sell online with clarity",
    description:
      "Online stores for brands, makers and businesses: a clear catalogue, a simple mobile checkout and orders that are easy to manage.",
    ideal: ["Shops", "Brands", "Makers", "Producers"],
    excluded:
      "Platform subscriptions, payment fees and paid themes or plugins are excluded and listed in the quote.",
    plans: [
      {
        name: "Start",
        price: 2500,
        tagline: "Open your first online store.",
        time: "3–5 weeks",
        features: [
          "Reliable platform (e.g. Shopify or WooCommerce)",
          "Theme customised to your identity",
          "Up to 50 products uploaded",
          "Card and PayPal payments",
          "Shipping and taxes configured",
        ],
      },
      {
        name: "Business",
        price: 4500,
        tagline: "A tailored store, ready to grow.",
        time: "5–8 weeks",
        features: [
          "Tailored catalogue and product page design",
          "Up to 300 products with variants",
          "Filters, search and related products",
          "Custom order emails",
          "SEO for categories and products",
        ],
      },
      {
        name: "Pro",
        price: 8000,
        tagline: "For larger volumes and connected processes.",
        time: "8–12 weeks",
        features: [
          "Optimised checkout UX and custom features",
          "Stock, ERP or invoicing integration",
          "Multilingual, multi-currency store",
          "Advanced customer area",
          "3 months of support included",
        ],
      },
    ],
    rows: [
      ["Products uploaded", "Up to 50", "Up to 300", "Extended catalogue"],
      ["Design", "Customised theme", "Tailored", "Tailored + checkout UX"],
      ["Online payments", true, true, true],
      ["Filters and advanced search", false, true, true],
      ["E-commerce SEO", false, true, true],
      ["Integrations", "Shipping", "Shipping", "Stock, ERP, invoicing"],
      ["Languages and currencies", false, false, true],
      ["Support included", false, "1 month", "3 months"],
    ],
  },
  {
    key: "app-mobile",
    scene: "mobile",
    name: "Mobile apps",
    short: "iOS and Android",
    description:
      "Apps for iPhone and Android from a single codebase: we design journeys and screens around the people who will use them every day.",
    ideal: ["Start-ups", "Services", "Communities", "Companies"],
    excluded:
      "Apple and Google developer accounts, cloud services and third-party costs are excluded and listed in the quote.",
    plans: [
      {
        name: "MVP",
        price: 6000,
        tagline: "Validate an idea with an essential app.",
        time: "6–8 weeks",
        features: [
          "Cross-platform iOS and Android app",
          "Up to 5 screens",
          "UI/UX design of the main journeys",
          "Sign-up and user profile",
          "App Store and Google Play release",
        ],
      },
      {
        name: "Business",
        price: 12000,
        tagline: "A complete app for your customers.",
        time: "10–14 weeks",
        features: [
          "Up to 15 screens",
          "Interactive prototype before development",
          "Push notifications",
          "Content management panel",
          "API and third-party integrations",
        ],
      },
      {
        name: "Pro",
        price: 20000,
        tagline: "A digital product ready to scale.",
        time: "From 4 months",
        features: [
          "Custom backend and database",
          "In-app payments or subscriptions",
          "Offline features and sync",
          "Privacy-friendly usage analytics",
          "3 months of support included",
        ],
      },
    ],
    rows: [
      ["Screens", "Up to 5", "Up to 15", "Tailored"],
      [
        "UI/UX design",
        "Main journeys",
        "+ interactive prototype",
        "+ user testing",
      ],
      ["Store release", true, true, true],
      ["Push notifications", false, true, true],
      ["Content management", false, true, true],
      ["Custom backend", false, false, true],
      ["In-app payments", false, false, true],
      ["Support included", false, "1 month", "3 months"],
    ],
  },
  {
    key: "gestionali",
    route: "gestionali",
    scene: "dashboard",
    name: "Management software",
    short: "Processes in order",
    description:
      "Custom web applications that replace spreadsheets and manual steps: data, documents and people in one place.",
    ideal: ["Companies", "Offices", "Manufacturing", "Practices"],
    excluded:
      "Hosting, backups and ongoing development are agreed under a separate plan, based on users and data.",
    plans: [
      {
        name: "Module",
        price: 3500,
        tagline: "Digitise one specific process.",
        time: "4–6 weeks",
        features: [
          "Analysis of the process to digitise",
          "One module: contacts, orders or cases",
          "User sign-in",
          "Search, filters and Excel/CSV export",
          "Responsive web interface",
        ],
      },
      {
        name: "Suite",
        price: 8000,
        tagline: "One tool for everyday work.",
        time: "8–12 weeks",
        features: [
          "Up to 4 connected modules",
          "User roles and permissions",
          "Dashboard with key indicators",
          "PDF document generation",
          "Email notifications and reminders",
        ],
      },
      {
        name: "Custom",
        price: 15000,
        tagline: "Complex processes, integrations, growth.",
        time: "From 3 months",
        features: [
          "Modules defined by the analysis",
          "Integration with existing software and APIs",
          "Automations and approval flows",
          "Activity log and scheduled backups",
          "Team training and documentation",
        ],
      },
    ],
    rows: [
      ["Modules", "1", "Up to 4", "From analysis"],
      [
        "Users and access",
        "Sign-in",
        "Roles and permissions",
        "Roles, permissions, audit",
      ],
      ["Data export", true, true, true],
      ["Dashboard", false, true, true],
      ["PDF documents", false, true, true],
      ["External integrations", false, false, true],
      ["Automations and approvals", false, false, true],
      ["Team training", false, "Kick-off session", "Full + documentation"],
    ],
  },
];

export function pricing(locale: Locale) {
  return locale === "it" ? it : en;
}

/** 12000 → "12.000" (same output on server and browser). */
export function formatPrice(value: number) {
  return String(Math.round(value)).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}
