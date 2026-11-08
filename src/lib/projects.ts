import type { Locale, Route } from "./routes";

/* Transversal project types shown in "Projects" and in navigation. */
export type SceneKey =
  "vetrina" | "shop" | "dashboard" | "webapp" | "landing" | "restyle";

type ProjectCopy = { name: string; text: string; tags: string[] };

const data: {
  route: Route;
  scene: SceneKey;
  it: ProjectCopy;
  en: ProjectCopy;
}[] = [
  {
    route: "siti-web",
    scene: "vetrina",
    it: {
      name: "Siti vetrina & aziendali",
      text: "Presentano chi sei, cosa offri e trasformano una visita in un contatto.",
      tags: ["Professionisti", "PMI", "Studi"],
    },
    en: {
      name: "Business & company websites",
      text: "Introduce who you are and what you offer, and turn a visit into an enquiry.",
      tags: ["Professionals", "SMEs", "Practices"],
    },
  },
  {
    route: "e-commerce",
    scene: "shop",
    it: {
      name: "E-commerce",
      text: "Catalogo, carrello e pagamenti: vendi online con ordine.",
      tags: ["Negozi", "Brand", "Artigiani"],
    },
    en: {
      name: "E-commerce",
      text: "Catalogue, cart and payments: sell online with clarity.",
      tags: ["Shops", "Brands", "Makers"],
    },
  },
  {
    route: "gestionali",
    scene: "dashboard",
    it: {
      name: "Gestionali su misura",
      text: "Dati, processi e documenti in un’unica applicazione web.",
      tags: ["Aziende", "Uffici", "Produzione"],
    },
    en: {
      name: "Management software",
      text: "Data, processes and documents in a single web application.",
      tags: ["Companies", "Offices", "Manufacturing"],
    },
  },
  {
    route: "web-app",
    scene: "webapp",
    it: {
      name: "Web app & portali",
      text: "Aree riservate, prenotazioni e servizi digitali per i tuoi utenti.",
      tags: ["Startup", "Servizi", "Enti"],
    },
    en: {
      name: "Web apps & portals",
      text: "Private areas, bookings and digital services for your users.",
      tags: ["Start-ups", "Services", "Organisations"],
    },
  },
  {
    route: "landing-page",
    scene: "landing",
    it: {
      name: "Landing page",
      text: "Una pagina veloce e mirata per lanciare un’idea o una campagna.",
      tags: ["Eventi", "Prodotti", "Campagne"],
    },
    en: {
      name: "Landing pages",
      text: "A fast, focused page to launch an idea or a campaign.",
      tags: ["Events", "Products", "Campaigns"],
    },
  },
  {
    route: "restyling-siti-web",
    scene: "restyle",
    it: {
      name: "Restyling & migrazioni",
      text: "Un sito datato diventa moderno, veloce e semplice da usare.",
      tags: ["Siti esistenti", "SEO", "Mobile"],
    },
    en: {
      name: "Redesigns & migrations",
      text: "A dated website becomes modern, fast and easy to use.",
      tags: ["Existing sites", "SEO", "Mobile"],
    },
  },
];

export function projects(locale: Locale) {
  return data.map((p) => ({ route: p.route, scene: p.scene, ...p[locale] }));
}

export function sceneFor(route: Route): SceneKey | undefined {
  return data.find((p) => p.route === route)?.scene;
}

export const audiences = {
  it: [
    "Professionisti",
    "Studi & consulenti",
    "Negozi & brand",
    "Artigiani",
    "PMI & industria",
    "Startup",
    "Ristorazione & turismo",
    "Salute & benessere",
    "Associazioni & enti",
    "Formazione",
    "Immobiliare",
    "Sport & eventi",
  ],
  en: [
    "Professionals",
    "Practices & consultants",
    "Shops & brands",
    "Makers",
    "SMEs & industry",
    "Start-ups",
    "Hospitality & tourism",
    "Health & wellbeing",
    "Non-profits & public bodies",
    "Education",
    "Real estate",
    "Sport & events",
  ],
};
