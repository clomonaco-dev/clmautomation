export const routes = [
  "",
  "chi-siamo",
  "servizi",
  "pacchetti",
  "metodo",
  "contatti",
  "avvocati",
  "medici",
  "professionisti",
  "siti-web",
  "restyling-siti-web",
  "sviluppo-web",
  "seo-performance",
  "siti-multilingua",
  "assistenza-web",
  "progetti",
  "recensioni",
  "privacy",
  "cookie-policy",
  "termini-condizioni",
] as const;
export type Route = (typeof routes)[number];
export type Locale = "it" | "en";
export const siteUrl = "https://clmautomation.it";
export const email = "c.lomonaco@clmautomation.com";
export const phone = "+39 347 389 3863";
export const mapsUrl =
  "https://www.google.com/maps/search/?api=1&query=CLM+Automation+Viale+Parona+33+Gozzano";
export function href(locale: Locale, route: Route = "") {
  return `${locale === "en" ? "/en" : ""}/${route ? route + "/" : ""}`;
}
export function isRoute(value: string): value is Route {
  return (routes as readonly string[]).includes(value);
}
