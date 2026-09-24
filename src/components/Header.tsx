'use client';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { dictionary, pageTitle } from '@/lib/content';
import { href, type Locale, type Route } from '@/lib/routes';

export function Header({ locale, route }: { locale: Locale; route: Route }) {
  const t = dictionary(locale);
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  const main: Route[] = ['', 'chi-siamo', 'servizi', 'pacchetti', 'metodo', 'contatti'];
  useEffect(() => {
    function onKey(event: KeyboardEvent) { if (event.key === 'Escape') { setOpen(false); toggle.current?.focus(); } }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);
  useEffect(() => { setOpen(false); }, [route]);
  return <header className="header">
    <div className="shell header-inner">
      <Link href={href(locale)} className="brand" aria-label="CLM Automation — Home"><span className="brand-mark" aria-hidden="true">c<span>l</span>m<span className="brand-dot">.</span></span><span className="brand-sub">AUTOMATION<br /><span>digital studio</span></span></Link>
      <nav className="desktop-nav" aria-label={t.menu}>
        {main.slice(1, 5).map((item, index) => <Link key={item} href={href(locale, item)} aria-current={route === item ? 'page' : undefined}>{t.nav[index + 1]}</Link>)}
        <Link href={href(locale,'progetti')} aria-current={route==='progetti'?'page':undefined}>{locale==='it'?'Progetti':'Projects'}</Link>
      </nav>
      <div className="header-actions">
        <div className="languages" aria-label={t.language}><Link href={href('it', route)} lang="it" hrefLang="it" aria-label="Italiano" aria-current={locale === 'it' ? 'true' : undefined}>IT</Link><span>/</span><Link href={href('en', route)} lang="en" hrefLang="en" aria-label="English" aria-current={locale === 'en' ? 'true' : undefined}>EN</Link></div>
        <Link className="button button-small header-cta" href={href(locale, 'contatti')}>{t.nav[5]} <span aria-hidden="true">↗</span></Link>
        <button ref={toggle} className="menu-toggle" aria-expanded={open} aria-controls="mobile-nav" aria-label={open ? t.close : t.menu} onClick={() => setOpen(!open)}><span aria-hidden="true">{open ? '×' : '☰'}</span></button>
      </div>
    </div>
    {open && <nav id="mobile-nav" className="mobile-nav shell" aria-label={t.menu}>
      {main.map((item, index) => <Link key={item} href={href(locale, item)} aria-current={route === item ? 'page' : undefined} onClick={() => setOpen(false)}>{t.nav[index]}<span aria-hidden="true">↗</span></Link>)}
      {(['progetti','recensioni'] as Route[]).map(item=><Link key={item} href={href(locale,item)}>{pageTitle(locale,item)}</Link>)}
      <p>{t.examples}</p>{t.sectors.map(s => <Link key={s[0]} href={href(locale, s[0])} onClick={() => setOpen(false)}>{s[1]}</Link>)}
    </nav>}
  </header>;
}
