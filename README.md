# CLM Automation — Next.js website

Sito vetrina in **Next.js App Router, React e TypeScript**, con esportazione statica per l'hosting Netlify già utilizzato dal progetto.

## Avvio

```sh
npm install
npm run dev
```

Controlli e anteprima della versione pubblicabile:

```sh
npm run build
npm run typecheck
npm test
npm run preview
```

L'anteprima statica usa `http://localhost:3101`. Il server di sviluppo usa la porta 3000. Non è necessario un database.

## Route e lingue

Le nove route italiane rimangono `/`, `/chi-siamo/`, `/servizi/`, `/pacchetti/`, `/metodo/`, `/contatti/`, `/avvocati/`, `/medici/` e `/professionisti/`.

La versione inglese usa `/en/` e gli stessi slug: ad esempio `/en/servizi/`. Il selettore lingua mantiene la pagina corrente. L'esportazione con `trailingSlash` produce un `index.html` in ogni cartella, quindi anche i collegamenti storici `/servizi/index.html` rimangono disponibili sull'hosting statico. Non aggiungere un redirect SPA verso `/index.html`.

Titoli, descrizioni, canonical e alternati linguistici sono generati per pagina. Sitemap e robots sono in `src/app`. Le pagine sono generate in fase di build, senza dipendere da chiamate esterne.

## Dove modificare il sito

- `src/lib/content.ts`: tutti i testi italiani e inglesi, servizi, pacchetti e FAQ.
- `src/lib/routes.ts`: route e recapiti.
- `src/components/Site.tsx`: sezioni e composizione delle pagine.
- `src/components/Header.tsx`: menu mobile e selettore lingua.
- `src/components/ContactForm.tsx`: modulo contatti.
- `src/app/globals.css`: colori, spazi, tipografia e layout responsive.
- `public/images/optimized`: anteprime WebP ottimizzate; originali conservati in `public/images`.
- `legacy/src`: sito HTML precedente, conservato come riferimento e non pubblicato.

Non sono stati inventati clienti, recensioni o risultati commerciali: i tre esempi di settore sono dichiarati concept dimostrativi. Prezzi di partenza, recapiti e documentazione derivano dal sito originale.

## Netlify e contatti

`netlify.toml` esegue `npm run build` e pubblica `out`. Il progetto usa l'esportazione statica Next.js, non un server Next in produzione. La funzione `netlify/functions/google-reviews.js` viene mantenuta.

Abilitare Netlify Forms nel progetto Netlify. La definizione statica in `public/__forms.html` conserva il form `contatti` e i campi originari, aggiungendo servizio, lingua e honeypot. Il modulo invia una richiesta URL-encoded e mostra conferma solo dopo una risposta positiva. In locale mostra esplicitamente che il servizio di invio non è disponibile; email, telefono e WhatsApp restano utilizzabili. Verificare una richiesta reale e le notifiche Netlify dopo il deploy.

Le recensioni Google usano le variabili server `GOOGLE_PLACES_API_KEY` e `GOOGLE_PLACE_ID` già previste. In assenza del servizio, resta un collegamento a Google: non vengono mostrate recensioni fittizie. Le recensioni sono contenuti originali degli utenti e non sono tradotte automaticamente.

## Privacy e statistiche

Il vecchio codice conteneva identificativi Iubenda segnaposto (`1234567`, `12345678`) e link privacy `#`: non sono stati reintrodotti come configurazione valida. Le informative locali sono disponibili a /privacy/, /cookie-policy/ e /termini-condizioni/, anche in inglese.

Le statistiche sono facoltative: impostare `NEXT_PUBLIC_ANALYTICS_URL` e `NEXT_PUBLIC_ANALYTICS_WEBSITE_ID` per abilitarle. Il vecchio ID era `30dd203e-99f5-4c14-9fef-f51335d3184c`. Lo script viene caricato solo dopo accettazione; il rifiuto e la revoca sono disponibili. Font e immagini vengono serviti localmente. Le mappe sono collegamenti esterni, non embed caricati automaticamente.

## Verifiche

`npm test` verifica tutte le pagine esportate, attributi lingua, metadati, form e risorse storiche. I controlli visivi vanno ripetuti in caso di nuovi contenuti particolarmente lunghi. Il test locale non certifica la ricezione email o la configurazione del servizio Google.

Riferimenti: [Next.js static exports](https://nextjs.org/docs/app/guides/static-exports), [trailingSlash](https://nextjs.org/docs/app/api-reference/config/next-config-js/trailingSlash), [Netlify Forms](https://docs.netlify.com/manage/forms/setup/).

## Compatibilità con il sito indicizzato

Il confronto con legacy/src conferma 9 pagine HTML e 38 immagini originali. Tutte le immagini sono mantenute byte per byte in public/images e in out/images, agli stessi indirizzi. Le 3 anteprime WebP in images/optimized sono aggiuntive. Rimangono disponibili anche i 2 favicon e i 2 PDF originali. Il test legacy-compatibility.test.mjs ricava l'inventario dal legacy e controlla percorsi, hash SHA-256, canonical e sitemap a ogni esecuzione di npm test dopo la build. La voce /images/ nel vecchio sitemap era una cartella di risorse, non una decima pagina HTML.



## Presentazione e approfondimenti
La home include una presentazione a quattro scene, con dissolvenze, comandi manuali e riproduzione opzionale. La preferenza di movimento ridotto disattiva animazioni e riproduzione automatica. Otto pagine aggiuntive per lingua approfondiscono sei servizi, progetti e recensioni; gli URL originali restano invariati.

Le recensioni sono caricate dall’endpoint Netlify originale. In anteprima locale e durante lo sviluppo il server inoltra la richiesta al sito pubblico, senza esporre credenziali. In produzione restano necessarie GOOGLE_PLACES_API_KEY e GOOGLE_PLACE_ID su Netlify. Il servizio Google può restituire un sottoinsieme delle recensioni: il totale è quello del profilo, tutte le card ricevute vengono mostrate.


## Informative e consenso
Umami usa URL e website-id originali del legacy, con consenso preventivo, rifiuto equivalente, revoca tramite ricaricamento e preferenza locale valida sei mesi. Le informative descrivono l’integrazione reale; prima della pubblicazione validare tempi effettivi di conservazione su Netlify e Umami, collocazione hosting analytics e garanzie dei trasferimenti. Il codice non configura la retention nei servizi esterni. Nessuna certificazione di conformità GDPR è implicita.
Il form conserva nome contatti e la definizione statica public/__forms.html, con tutti i campi corrispondenti al POST. Su Netlify la rilevazione Forms deve essere attiva: dopo il deploy verificare la presenza del modulo nella dashboard. Nessun consenso marketing viene richiesto per una semplice richiesta di preventivo.
