'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { dictionary } from '@/lib/content';
import { href, type Locale } from '@/lib/routes';
const KEY='clm-analytics'; const VERSION=1;
export function CookiePreferences({locale}:{locale:Locale}){
 const t=dictionary(locale);const [choice,setChoice]=useState<string|null>(null);const [show,setShow]=useState(false);
 const url=process.env.NEXT_PUBLIC_ANALYTICS_URL||'https://analytics.clmautomation.it/script.js';
 const websiteId=process.env.NEXT_PUBLIC_ANALYTICS_WEBSITE_ID||'30dd203e-99f5-4c14-9fef-f51335d3184c';
 useEffect(()=>{try{const saved=JSON.parse(localStorage.getItem(KEY)||'null');if(saved?.version===VERSION&&saved.expires>Date.now()&&['yes','no'].includes(saved.choice)){setChoice(saved.choice);return;}}catch{}setShow(true);},[]);
 useEffect(()=>{if(choice!=='yes')return;const script=document.createElement('script');script.src=url;script.defer=true;script.dataset.websiteId=websiteId;script.dataset.excludeSearch='true';script.dataset.excludeHash='true';script.dataset.doNotTrack='true';script.id='clm-umami';document.head.appendChild(script);return()=>{script.remove();};},[choice,url,websiteId]);
 function save(value:string){const expiry=new Date();expiry.setMonth(expiry.getMonth()+6);try{localStorage.setItem(KEY,JSON.stringify({choice:value,version:VERSION,expires:expiry.getTime()}));}catch{}const revoke=choice==='yes'&&value!=='yes';setChoice(value);setShow(false);if(revoke)location.reload();}
 return <><button className="cookie-settings" onClick={()=>setShow(true)}>{t.preferences}</button>{show&&<aside className="cookie-banner" aria-label={t.preferences}><p>{locale==='it'?'Usiamo Umami per statistiche facoltative sul sito, solo se accetti. Puoi rifiutare e continuare a navigare, oppure cambiare scelta dal footer.':'We use Umami for optional website analytics only if you accept. You can refuse and keep browsing, or change your choice in the footer.'}</p><p className="cookie-links"><Link href={href(locale,'cookie-policy')}>Cookie policy</Link> · <Link href={href(locale,'privacy')}>{t.privacy}</Link></p><div className="actions"><button className="button button-outline button-small" onClick={()=>save('no')}>{t.reject}</button><button className="button button-outline button-small" onClick={()=>save('yes')}>{t.accept}</button></div>{choice&&<button className="cookie-close" onClick={()=>setShow(false)}>{locale==='it'?'Chiudi senza modificare':'Close without changes'}</button>}</aside>}</>;
}
