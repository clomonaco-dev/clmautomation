import { solutions } from './solutions';
import type { Metadata } from 'next';
import { dictionary, pageTitle } from './content';
import { href, siteUrl, type Locale, type Route } from './routes';
export function metadataFor(locale: Locale, route: Route): Metadata {
  const t = dictionary(locale);
  const title = route ? `${pageTitle(locale,route)} | CLM Automation` : locale==='it' ? 'CLM Automation — Sviluppo siti web a Novara' : 'CLM Automation — Web design & development in Novara';
  const description = solutions(locale).find(s=>s.route===route)?.intro ?? (route==='contatti' ? t.contactIntro : route==='chi-siamo' ? t.aboutIntro : route==='pacchetti' ? t.packageIntro : route==='metodo' ? t.methodIntro : t.sectors.find(s=>s[0]===route)?.[3] ?? (route==='recensioni' ? t.reviews : route==='progetti' ? t.examplesIntro : t.intro));
  return { metadataBase:new URL(siteUrl), title, description, alternates:{canonical:href(locale,route),languages:{it:href('it',route),en:href('en',route),'x-default':href('it',route)}}, openGraph:{title,description,url:href(locale,route),siteName:'CLM Automation',locale:locale==='it'?'it_IT':'en_GB',type:'website'}, twitter:{card:'summary',title,description}, icons:{icon:'/favicon.ico'}, verification:{google:'V3VyoKVf645esc-tt5ZtwGcfAQ-5pW40rxu6U7qWFUE'} };
}
